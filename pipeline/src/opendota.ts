/**
 * Thin OpenDota REST client with rate limiting and retry/backoff.
 *
 * The free tier permits ~60 requests/minute, so every call is spaced by config.rateLimitMs
 * via a single shared queue. Transient failures (429, 5xx, network resets) are retried with
 * exponential backoff; 4xx other than 429 fail fast.
 */
import { config } from "./config.js";
import type {
  OpenDotaHero,
  OpenDotaItemConstants,
  OpenDotaItemPopularity,
  OpenDotaMatchup,
  OpenDotaPatch,
} from "./types.js";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Timestamp of the last request start, used to space calls without a busy loop. */
let lastRequestAt = 0;

async function throttle(): Promise<void> {
  const now = Date.now();
  const wait = config.rateLimitMs - (now - lastRequestAt);
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
}

function withKey(url: string): string {
  if (!config.apiKey) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}api_key=${encodeURIComponent(config.apiKey)}`;
}

async function getJSON<T>(pathname: string): Promise<T> {
  const url = withKey(`${config.apiBase}${pathname}`);
  let attempt = 0;

  // Retry loop: backoff on 429/5xx/network errors; fail fast on other 4xx.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await throttle();
    // Abort the request if it exceeds the configured timeout, so a slow/hung response
    // becomes a retryable error instead of stalling the whole pipeline.
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), config.requestTimeoutMs);
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: ac.signal,
      });

      if (res.ok) {
        return (await res.json()) as T;
      }

      const retryable = res.status === 429 || res.status >= 500;
      if (!retryable || attempt >= config.maxRetries) {
        throw new Error(`OpenDota ${pathname} -> HTTP ${res.status}`);
      }

      // Honour Retry-After if present, else exponential backoff.
      const retryAfter = Number(res.headers.get("retry-after"));
      const backoff = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : Math.min(30_000, 1000 * 2 ** attempt);
      attempt += 1;
      console.warn(
        `  ! ${pathname} HTTP ${res.status} — retry ${attempt}/${config.maxRetries} in ${backoff}ms`,
      );
      await sleep(backoff);
    } catch (err) {
      if (attempt >= config.maxRetries) throw err;
      const backoff = Math.min(30_000, 1000 * 2 ** attempt);
      attempt += 1;
      console.warn(
        `  ! ${pathname} ${(err as Error).message} — retry ${attempt}/${config.maxRetries} in ${backoff}ms`,
      );
      await sleep(backoff);
    } finally {
      clearTimeout(timer);
    }
  }
}

export function fetchHeroes(): Promise<OpenDotaHero[]> {
  return getJSON<OpenDotaHero[]>("/heroes");
}

export function fetchMatchups(heroId: number): Promise<OpenDotaMatchup[]> {
  return getJSON<OpenDotaMatchup[]>(`/heroes/${heroId}/matchups`);
}

/** Real "what players build on this hero" data, bucketed by game stage. */
export function fetchItemPopularity(heroId: number): Promise<OpenDotaItemPopularity> {
  return getJSON<OpenDotaItemPopularity>(`/heroes/${heroId}/itemPopularity`);
}

/** Item metadata (id, display name, cost, recipe components) keyed by item shortname. */
export function fetchItemConstants(): Promise<OpenDotaItemConstants> {
  return getJSON<OpenDotaItemConstants>("/constants/items");
}

/**
 * The /constants/patch endpoint returns the full list of patches, oldest first. We treat
 * the entry with the most recent date as the current patch.
 */
export async function fetchCurrentPatch(): Promise<string> {
  const patches = await getJSON<OpenDotaPatch[]>("/constants/patch");
  if (!Array.isArray(patches) || patches.length === 0) {
    throw new Error("Empty /constants/patch response");
  }
  const latest = patches.reduce((a, b) =>
    new Date(b.date).getTime() > new Date(a.date).getTime() ? b : a,
  );
  return latest.name;
}
