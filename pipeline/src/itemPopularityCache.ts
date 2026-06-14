/**
 * On-disk cache for per-hero itemPopularity responses (data/.cache/itemPopularity/{id}.json),
 * mirroring matchupsCache: fresh entries skip refetch, stale entries are a fallback on failure.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import type { OpenDotaItemPopularity } from "./types.js";

const cacheDir = path.join(config.dataDir, ".cache", "itemPopularity");

interface Record_ {
  fetched_at: string;
  popularity: OpenDotaItemPopularity;
}

const fileFor = (heroId: number): string => path.join(cacheDir, `${heroId}.json`);

export interface CachedPopularity {
  popularity: OpenDotaItemPopularity;
  ageHours: number;
}

export async function readPopularityCache(
  heroId: number,
  now: Date,
): Promise<CachedPopularity | null> {
  try {
    const raw = await fs.readFile(fileFor(heroId), "utf8");
    const rec = JSON.parse(raw) as Record_;
    if (!rec.popularity || typeof rec.fetched_at !== "string") return null;
    const ageHours = (now.getTime() - new Date(rec.fetched_at).getTime()) / 3_600_000;
    return { popularity: rec.popularity, ageHours };
  } catch {
    return null;
  }
}

export async function writePopularityCache(
  heroId: number,
  popularity: OpenDotaItemPopularity,
  now: Date,
): Promise<void> {
  await fs.mkdir(cacheDir, { recursive: true });
  const rec: Record_ = { fetched_at: now.toISOString(), popularity };
  await fs.writeFile(fileFor(heroId), JSON.stringify(rec), "utf8");
}
