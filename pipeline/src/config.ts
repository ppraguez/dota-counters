/**
 * Central configuration. Every knob is overridable via an environment variable so the
 * scheduled GitHub Action (or a local run) can tune behaviour without code changes.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Repo root = two levels up from pipeline/src. */
const repoRoot = path.resolve(__dirname, "..", "..");

/**
 * STRATZ API token. In CI it comes from the STRATZ_API_TOKEN secret; for local
 * runs we also accept a gitignored pipeline/.stratz-token file so the token
 * never has to be exported by hand. Empty string => role meta is skipped.
 */
function readStratzToken(): string {
  const fromEnv = process.env.STRATZ_API_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  try {
    return fs.readFileSync(path.join(__dirname, "..", ".stratz-token"), "utf8").trim();
  } catch {
    return "";
  }
}

function num(envVar: string, fallback: number): number {
  const raw = process.env[envVar];
  if (raw === undefined || raw.trim() === "") return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  /** OpenDota REST base. */
  apiBase: process.env.OPENDOTA_BASE ?? "https://api.opendota.com/api",

  /** Optional OpenDota API key (raises the free-tier rate limit). */
  apiKey: process.env.OPENDOTA_API_KEY ?? "",

  /** STRATZ GraphQL endpoint (position-based hero stats for the role meta). */
  stratzBase: process.env.STRATZ_BASE ?? "https://api.stratz.com/graphql",

  /** STRATZ API token (env STRATZ_API_TOKEN or local pipeline/.stratz-token). */
  stratzToken: readStratzToken(),

  /**
   * Delay between API calls in ms. OpenDota's free tier allows ~60 req/min, so ~1100ms
   * keeps us comfortably under one request per second.
   */
  rateLimitMs: num("RATE_LIMIT_MS", 1100),

  /** Retry count for transient API failures (429/5xx/network). */
  maxRetries: num("MAX_RETRIES", 3),

  /**
   * Per-request timeout (ms). OpenDota's /matchups endpoint can be slow (10-60s) when its
   * cache is cold; without a timeout a single hung request would stall the whole run.
   */
  requestTimeoutMs: num("REQUEST_TIMEOUT_MS", 45_000),

  /**
   * Per-hero matchup cache. OpenDota's /matchups endpoint is slow and flaky, so we persist
   * each successful response under data/.cache/matchups/{id}.json. Two benefits:
   *   - Resumability: rerunning the pipeline skips heroes fetched within the TTL, so a run
   *     interrupted by timeouts continues instead of restarting.
   *   - Resilience: if a hero's fetch fails this run, we fall back to its last-known cached
   *     matchups (any age) rather than emitting empty data.
   * TTL is set just under the 6-hour schedule so each scheduled run still refreshes data.
   */
  matchupCacheTtlHours: num("MATCHUP_CACHE_TTL_HOURS", 5),
  useMatchupCache: (process.env.USE_MATCHUP_CACHE ?? "true") !== "false",

  /**
   * Offline rebuild: when MATCHUPS_OFFLINE=true the pipeline never calls the slow /matchups
   * endpoint and instead builds counters purely from cached matchup data (data/.cache). Heroes
   * with no cache get empty counters. Patch info is read from patchState.json rather than
   * fetched. Useful to regenerate heroData.json from existing cache without touching the API.
   */
  matchupsOffline: (process.env.MATCHUPS_OFFLINE ?? "false") === "true",

  /**
   * Minimum games_played for a matchup pair to be trusted. Below this the win-rate delta is
   * statistically noisy, so we drop it.
   *
   * NOTE ON THE DEFAULT: the spec suggested 1000, but OpenDota's live /matchups feed is a
   * rolling sample of recently-parsed public matches, not an all-time total. Right after a
   * new patch (exactly when low_sample_warning fires) even the most-played hero's biggest
   * matchup is only ~100-150 games, so a 1000 threshold would empty the entire site. We
   * therefore default to a realistic floor and expose it via MIN_GAMES. Raise it (e.g. 200+)
   * once a patch has matured and match volume has grown.
   */
  minGames: num("MIN_GAMES", 30),

  /** Max counter/synergy entries kept per hero per section (sorted by strength). */
  maxCountersPerHero: num("MAX_COUNTERS", 14),
  maxSynergiesPerHero: num("MAX_SYNERGIES", 14),

  /** Max counter-item suggestions kept per hero. */
  maxItemsPerHero: num("MAX_ITEMS", 6),

  /** Max recommended (best-suited) build items kept per hero. */
  maxBuildItemsPerHero: num("MAX_BUILD_ITEMS", 6),

  /** Minimum synergy score required to surface a pairing at all. */
  minSynergyScore: num("MIN_SYNERGY_SCORE", 3),

  /**
   * A patch younger than this many hours flips meta.low_sample_warning to true, because
   * win rates right after a patch are dominated by experimentation, not balance.
   */
  lowSampleHours: num("LOW_SAMPLE_HOURS", 72),

  /** Where the canonical data files live (committed to the repo, read by the frontend). */
  dataDir: process.env.DATA_DIR ?? path.join(repoRoot, "data"),

  /** Steam CDN template for hero portraits. {name} = internal name without the prefix. */
  iconBase:
    "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes",
} as const;

export const HERO_NAME_PREFIX = "npc_dota_hero_";

/** "npc_dota_hero_antimage" -> "antimage" (the slug Steam uses for icon files). */
export function heroSlug(internalName: string): string {
  return internalName.startsWith(HERO_NAME_PREFIX)
    ? internalName.slice(HERO_NAME_PREFIX.length)
    : internalName;
}

export function iconUrl(internalName: string): string {
  return `${config.iconBase}/${heroSlug(internalName)}.png`;
}
