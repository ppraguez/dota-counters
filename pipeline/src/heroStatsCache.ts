/**
 * On-disk cache for the STRATZ position-stats response (data/.cache/positionStats.json).
 * Used as an offline-rebuild source and as a fallback if the live fetch fails,
 * so the role meta survives a transient STRATZ outage or IP-lock.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import type { BracketPositionStats } from "./types.js";

const cacheFile = path.join(config.dataDir, ".cache", "positionStats.json");

export async function readPositionStatsCache(): Promise<BracketPositionStats | null> {
  try {
    const raw = await fs.readFile(cacheFile, "utf8");
    const obj = JSON.parse(raw) as BracketPositionStats;
    return obj && obj.all?.pos1 && obj.all?.pos5 ? obj : null;
  } catch {
    return null;
  }
}

export async function writePositionStatsCache(stats: BracketPositionStats): Promise<void> {
  await fs.mkdir(path.dirname(cacheFile), { recursive: true });
  await fs.writeFile(cacheFile, JSON.stringify(stats), "utf8");
}
