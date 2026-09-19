import type { BracketKey, BracketPositionStats, PositionKey, PositionStats, RolesMeta, RolesMetaByBracket, RolesMetaEntry } from "./types.js";
import { BRACKET_GROUPS } from "./stratz.js";

export const META_POSITIONS: PositionKey[] = ["pos1", "pos2", "pos3", "pos4", "pos5"];

const TOP_N = 8;
const MIN_PICK_RATE = 0.01;
const round4 = (n: number): number => Math.round(n * 10000) / 10000;

function buildSingleMeta(stats: PositionStats): RolesMeta {
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

export function buildRolesMeta(stats: BracketPositionStats): RolesMetaByBracket {
  const result = {} as RolesMetaByBracket;
  for (const bKey of Object.keys(BRACKET_GROUPS) as BracketKey[]) {
    result[bKey] = buildSingleMeta(stats[bKey]);
  }
  return result;
}
