/**
 * Rules-based synergy scoring.
 *
 * WHY RULES INSTEAD OF AN /explorer SQL QUERY (spec option b vs a):
 * OpenDota's matchups endpoint only gives *opposing*-team win rates, never same-team pair win
 * rates. The only way to get real same-team synergy numbers is the /explorer endpoint running a
 * SQL query over the public matches table. In practice that path is a poor fit for a free,
 * scheduled pipeline:
 *   - /explorer queries are heavy, frequently time out, and are aggressively rate-limited.
 *   - The public matches dataset is a sparse sample, so a single query rarely yields >=1000
 *     games for most of the ~7,600 hero pairs — exactly the sample-size problem we already
 *     guard against for counters.
 *   - It would multiply our request budget by orders of magnitude against a 60 req/min limit.
 * So for reliability and reproducibility we derive synergy from hero roles/attributes instead.
 * The score is deterministic, needs no extra API calls, and never returns empty. If real
 * same-team data is ever wanted, this module is the single place to swap in an /explorer feed.
 */
import type { HeroTags } from "./heroTags.js";

type Pred = (t: HeroTags) => boolean;

/** True if the (a,b) pair matches f1/f2 in either order — keeps scoring symmetric. */
function combo(a: HeroTags, b: HeroTags, f1: Pred, f2: Pred): boolean {
  return (f1(a) && f2(b)) || (f1(b) && f2(a));
}

/**
 * Symmetric synergy score. Higher = stronger pairing. Bonuses stack (multiple complementary
 * relationships make a pairing stronger); greedy double-carry pairs are penalised.
 */
export function synergyScore(a: HeroTags, b: HeroTags): number {
  let score = 0;

  // Initiation that groups enemies + AoE/burst to punish the clump (e.g. Magnus + Lina).
  if (combo(a, b, (t) => t.isInitiator, (t) => t.isNuker || t.burstThreat)) score += 3;

  // Hard disable that sets up burst follow-up (e.g. Crystal Maiden + Lina).
  if (combo(a, b, (t) => t.isDisabler, (t) => t.burstThreat || t.isNuker)) score += 3;

  // Lockdown that protects/enables a carry's damage window.
  if (combo(a, b, (t) => t.hasLockdown, (t) => t.isCarry)) score += 2;

  // Support that lets a carry farm and scale.
  if (combo(a, b, (t) => t.isSupport, (t) => t.isCarry)) score += 2;

  // Frontline body + squishy backline damage dealer (positioning complement).
  if (combo(a, b, (t) => t.frontline, (t) => t.squishy)) score += 2;

  // Two objective-pushers snowball map control together.
  if (a.isPusher && b.isPusher) score += 2;

  // Initiation creates space for a carry even without burst follow-up.
  if (combo(a, b, (t) => t.isInitiator, (t) => t.isCarry)) score += 1;

  // Classic strength-initiator + intelligence-AoE combo.
  if (
    combo(
      a,
      b,
      (t) => t.primaryAttr === "str" && t.isInitiator,
      (t) => t.primaryAttr === "int" && (t.isNuker || t.burstThreat),
    )
  ) {
    score += 1;
  }

  // Tie-breakers that reward composition diversity (kept small so they only order ties).
  if (a.primaryAttr !== b.primaryAttr) score += 0.5;
  if (a.isMelee !== b.isMelee) score += 0.5;

  // Penalty: two greedy hard carries compete for farm and map space.
  if (a.physicalCarry && b.physicalCarry) score -= 2.5;

  return Math.max(0, Math.round(score * 10) / 10);
}
