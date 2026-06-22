/**
 * Current "meta per position", derived from STRATZ position-based hero stats.
 *
 * For each lane position (pos 1 carry … pos 5 hard support) we rank the heroes
 * actually played there by win rate, after gating out heroes with a tiny pick
 * share so a handful of off-role games can't inflate a hero onto the list. This
 * is why a flexible hero no longer floods every list: it only appears in the
 * positions it is genuinely played in, with that position's win rate.
 *
 * Rates come from the Herald–Legend brackets (see stratz.ts) and refresh every
 * time the pipeline runs — there is no hand-authored tier list to go stale.
 */
import type { PositionKey, PositionStats, RolesMeta, RolesMetaEntry } from "./types.js";

/** Position keys in display order. */
export const META_POSITIONS: PositionKey[] = ["pos1", "pos2", "pos3", "pos4", "pos5"];

/** How many heroes to list per position. */
const TOP_N = 8;

/** Minimum share of a position's games a hero needs to qualify (off-role gate). */
const MIN_PICK_RATE = 0.01; // 1%

const round4 = (n: number): number => Math.round(n * 10000) / 10000;

export function buildRolesMeta(stats: PositionStats): RolesMeta {
  const roles: Record<string, RolesMetaEntry[]> = {};

  for (const pos of META_POSITIONS) {
    const rows = stats[pos];
    const total = rows.reduce((t, r) => t + r.matchCount, 0) || 1;

    roles[pos] = rows
      .map((r) => ({
        hero_id: r.heroId,
        win_rate: r.matchCount > 0 ? r.winCount / r.matchCount : 0,
        pick_rate: r.matchCount / total,
      }))
      .filter((e) => e.pick_rate >= MIN_PICK_RATE && e.win_rate > 0)
      .sort((a, b) => b.win_rate - a.win_rate)
      .slice(0, TOP_N)
      .map((e) => ({
        hero_id: e.hero_id,
        win_rate: round4(e.win_rate),
        pick_rate: round4(e.pick_rate),
      }));
  }

  return { source: "pub", roles };
}
