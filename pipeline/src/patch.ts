/**
 * Patch detection and data-maturity tracking.
 *
 * We persist the current patch and the timestamp it was *first* observed in data/patchState.json.
 * When a new patch appears, "first_seen" resets to now. The frontend uses this to warn that a
 * brand-new patch's win rates may still be settling (low_sample_warning).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import type { PatchState } from "./types.js";

const stateFile = path.join(config.dataDir, "patchState.json");

async function readState(): Promise<PatchState | null> {
  try {
    const raw = await fs.readFile(stateFile, "utf8");
    const parsed = JSON.parse(raw) as PatchState;
    if (parsed && typeof parsed.patch === "string" && typeof parsed.first_seen === "string") {
      return parsed;
    }
    return null;
  } catch {
    // Missing or unreadable -> treat as first run.
    return null;
  }
}

export interface PatchResult {
  patch: string;
  firstSeen: string;
  lowSampleWarning: boolean;
}

/**
 * Reconcile the freshly fetched patch with the stored state.
 * @param currentPatch patch name from OpenDota (e.g. "7.39c")
 * @param now ISO timestamp of this run (injected for testability/determinism)
 */
export async function resolvePatchState(
  currentPatch: string,
  now: Date,
): Promise<PatchResult> {
  const prev = await readState();

  // First seen: keep the stored timestamp if the patch is unchanged, else stamp now.
  const firstSeen =
    prev && prev.patch === currentPatch ? prev.first_seen : now.toISOString();

  const next: PatchState = { patch: currentPatch, first_seen: firstSeen };
  await fs.mkdir(config.dataDir, { recursive: true });
  await fs.writeFile(stateFile, JSON.stringify(next, null, 2) + "\n", "utf8");

  const ageHours = (now.getTime() - new Date(firstSeen).getTime()) / 3_600_000;
  const lowSampleWarning = ageHours < config.lowSampleHours;

  return { patch: currentPatch, firstSeen, lowSampleWarning };
}

/**
 * Offline variant: derive PatchResult from the stored state file without fetching or writing.
 * Falls back to "unknown" if no state has been recorded yet.
 */
export async function loadStoredPatchState(now: Date): Promise<PatchResult> {
  const prev = await readState();
  if (!prev) {
    return { patch: "unknown", firstSeen: now.toISOString(), lowSampleWarning: false };
  }
  const ageHours = (now.getTime() - new Date(prev.first_seen).getTime()) / 3_600_000;
  return {
    patch: prev.patch,
    firstSeen: prev.first_seen,
    lowSampleWarning: ageHours < config.lowSampleHours,
  };
}
