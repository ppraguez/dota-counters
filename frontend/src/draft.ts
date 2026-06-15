import type { HeroWithId } from "./types";

export interface DraftSuggestion {
  hero: HeroWithId;
  /** Combined ranking score (synergy + scaled matchup delta). */
  total: number;
  /** Raw synergy-score sum with all allies. */
  synergy: number;
  /** Raw win-rate delta sum vs all enemies (e.g. +0.18 = +18 pts overall). */
  counter: number;
}

/** Win-rate delta of `candidate` against one enemy: positive = candidate is favoured. */
function deltaVs(candidate: HeroWithId, enemyId: number): number {
  const beats = candidate.counters.find((x) => x.hero_id === enemyId);
  if (beats) return beats.delta; // positive
  const beaten = candidate.countered_by.find((x) => x.hero_id === enemyId);
  if (beaten) return beaten.delta; // negative
  return 0;
}

/**
 * Rank candidate heroes for a draft. Score combines:
 *  - synergy: sum of synergy scores with every ally already picked
 *  - counter: sum of win-rate deltas vs every enemy already picked
 * The delta sum is scaled ×100 so a ~10pt matchup edge is comparable to a
 * single-digit synergy score. Heroes already on either team are excluded.
 */
export function rankPicks(
  candidates: HeroWithId[],
  allies: HeroWithId[],
  enemies: HeroWithId[],
  limit = 12,
): DraftSuggestion[] {
  if (allies.length === 0 && enemies.length === 0) return [];

  const allyIds = new Set(allies.map((h) => h.id));
  const enemyIds = new Set(enemies.map((h) => h.id));

  const out: DraftSuggestion[] = [];
  for (const c of candidates) {
    if (allyIds.has(c.id) || enemyIds.has(c.id)) continue;

    let synergy = 0;
    for (const s of c.synergies) if (allyIds.has(s.hero_id)) synergy += s.score;

    let counter = 0;
    for (const e of enemies) counter += deltaVs(c, e.id);

    out.push({ hero: c, synergy, counter, total: synergy + counter * 100 });
  }

  out.sort((a, b) => b.total - a.total);
  return out.slice(0, limit);
}
