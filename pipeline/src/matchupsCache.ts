/**
 * Tiny on-disk cache for per-hero matchup responses, living at data/.cache/matchups/{id}.json.
 * See config.ts (matchupCacheTtlHours / useMatchupCache) for the rationale.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import type { OpenDotaMatchup } from "./types.js";

const cacheDir = path.join(config.dataDir, ".cache", "matchups");

interface CacheRecord {
  fetched_at: string;
  matchups: OpenDotaMatchup[];
}

function fileFor(heroId: number): string {
  return path.join(cacheDir, `${heroId}.json`);
}

export interface CachedMatchups {
  matchups: OpenDotaMatchup[];
  ageHours: number;
}

export async function readMatchupCache(
  heroId: number,
  now: Date,
): Promise<CachedMatchups | null> {
  try {
    const raw = await fs.readFile(fileFor(heroId), "utf8");
    const rec = JSON.parse(raw) as CacheRecord;
    if (!Array.isArray(rec.matchups) || typeof rec.fetched_at !== "string") return null;
    const ageHours = (now.getTime() - new Date(rec.fetched_at).getTime()) / 3_600_000;
    return { matchups: rec.matchups, ageHours };
  } catch {
    return null;
  }
}

export async function writeMatchupCache(
  heroId: number,
  matchups: OpenDotaMatchup[],
  now: Date,
): Promise<void> {
  await fs.mkdir(cacheDir, { recursive: true });
  const rec: CacheRecord = { fetched_at: now.toISOString(), matchups };
  await fs.writeFile(fileFor(heroId), JSON.stringify(rec), "utf8");
}
