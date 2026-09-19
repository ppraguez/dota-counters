/**
 * Rules engine that turns a pair of heroes into a short, plain-English reason.
 *
 * Design: every reason is assembled from (a) the generic role/attribute tags in heroTags.ts
 * and (b) optional curated signature phrases in signatures.ts. There is NO free text fetched
 * and NO runtime model call — given the same heroes, the same reason is produced every time.
 *
 * Two public functions:
 *   counterReason(winner, loser) -> why `winner` tends to beat `loser`
 *   synergyReason(a, b)          -> why `a` and `b` work well on the same team
 */
import type { HeroTags } from "./heroTags.js";
import { heroSlug } from "./config.js";
import { SIGNATURES, type HeroSignature } from "./signatures.js";

function sig(t: HeroTags): HeroSignature {
  return SIGNATURES[heroSlug(t.name)] ?? {};
}

const cap = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

// ---- Generic predicates (read as "{HeroName} {predicate}") ----

/** Offensive identity: why this hero wins fights. */
function genericThreat(t: HeroTags): string {
  if (t.burstThreat) return "bursts targets down with magical nukes";
  if (t.physicalCarry) return "grinds enemies down with sustained physical damage";
  if (t.hasLockdown) return "chains disables to control the fight";
  if (t.isDurable) return "out-tanks opponents in extended fights";
  if (t.isInitiator) return "dictates fights with strong initiation";
  if (t.mobile) return "picks favourable fights and escapes punishment";
  if (t.isSupport) return "swings fights with utility and disables";
  if (t.isPusher) return "pressures lanes and objectives relentlessly";
  return "grinds out a steady edge in this matchup";
}

/** Fragility: why this hero loses the matchup. Every branch returns a concrete attribute-based
 *  weakness — there is intentionally no vague catch-all. */
function genericWeakness(t: HeroTags): string {
  if (t.squishy) return "is squishy and gets blown up quickly";
  if (t.isCarry && t.isMelee && !t.mobile) return "is melee with no escape and easy to kite";
  if (t.isCarry && !t.mobile) return "relies on farm and struggles when shut down early";
  if (!t.isDurable) return "is fragile under focus";
  if (t.mobile) return "is vulnerable once its escape and cooldowns are down";
  return "is slow and can be kited"; // durable + immobile
}

/** Enabling identity: what this hero does to help an ally. */
function genericSetup(t: HeroTags): string {
  if (t.isDisabler || t.hasLockdown) return "locks a target down";
  if (t.isInitiator) return "starts fights on favourable terms";
  if (t.isSupport) return "provides protection and utility";
  if (t.isNuker) return "adds extra burst damage";
  if (t.isDurable) return "creates space on the frontline";
  return "contributes to the fight";
}

function damageNoun(t: HeroTags): string {
  if (t.burstThreat) return "burst magical damage";
  if (t.physicalCarry) return "sustained physical damage";
  if (t.isNuker) return "nuke damage";
  return "follow-up damage";
}

const threatOf = (t: HeroTags): string => sig(t).threat ?? genericThreat(t);
const weaknessOf = (t: HeroTags): string => sig(t).weakness ?? genericWeakness(t);
const setupOf = (t: HeroTags): string => sig(t).setup ?? genericSetup(t);

// ---------------------------------------------------------------------------
// Counters
// ---------------------------------------------------------------------------
//
// Each hero's page lists many matchups in which that hero is always the same side. Leading
// every sentence with the fixed hero's signature phrase made whole lists read identically, so
// every rule now has two sets of phrasings:
//   winnerLed — used when the WINNER varies down the list (a hero's "Countered by" section):
//               the varying winner's threat leads, followed by a rotating tail.
//   loserLed  — used when the LOSER varies (a hero's "Counters" section): the varying loser's
//               weakness leads, with a short mechanism for the fixed winner.
// `variant` rotates phrasings within one list so neighbouring rows don't repeat.

type Phrase = (w: HeroTags, l: HeroTags) => string;

interface CounterRule {
  when: (w: HeroTags, l: HeroTags) => boolean;
  winnerLed: Phrase[];
  loserLed: Phrase[];
}

const W = (t: HeroTags): string => cap(t.localizedName);
const N = (t: HeroTags): string => t.localizedName;

/** Ordered most-specific first; the first matching rule wins. reasonsTh.ts indexes into this. */
const COUNTER_RULES: CounterRule[] = [
  {
    // Lockdown removes an escape-reliant hero's main defence.
    when: (w, l) => w.hasLockdown && l.mobile,
    winnerLed: [
      (w, l) => `${W(w)} ${threatOf(w)}, and the lockdown cancels ${N(l)}'s escape.`,
      (w, l) => `${W(w)} ${threatOf(w)}, so ${N(l)} gets caught before escaping.`,
      (w, l) => `${W(w)} ${threatOf(w)}, pinning ${N(l)} down before any escape.`,
    ],
    loserLed: [
      (w, l) => `${W(l)} lives on escapes, and ${N(w)}'s lockdown lands before ${N(l)} can use them.`,
      (w, l) => `${W(w)}'s disables pin ${N(l)} in place, taking away the mobility ${N(l)} depends on.`,
      (w, l) => `${W(l)} ${weaknessOf(l)}, and ${N(w)} has the lockdown to exploit that.`,
    ],
  },
  {
    // Magical burst deletes a fragile target before it acts.
    when: (w, l) => w.burstThreat && l.squishy,
    winnerLed: [
      (w, l) => `${W(w)} ${threatOf(w)} — ${N(l)} ${weaknessOf(l)}.`,
      (w, l) => `${W(w)} ${threatOf(w)}, and ${N(l)} can't survive the burst.`,
      (w, l) => `${W(w)} ${threatOf(w)}, more damage than ${N(l)}'s low HP can take.`,
    ],
    loserLed: [
      (w, l) => `${W(l)} ${weaknessOf(l)}, which ${N(w)}'s burst punishes hard.`,
      (w, l) => `${W(w)} can burst ${N(l)} from full health before ${N(l)} gets to act.`,
      (w, l) => `${W(l)} has too little HP to survive ${N(w)}'s magical burst.`,
    ],
  },
  {
    // A tank simply outlasts a right-click carry's physical damage.
    when: (w, l) => w.isDurable && l.physicalCarry,
    winnerLed: [
      (w, l) => `${W(w)} ${threatOf(w)}, soaking ${N(l)}'s physical damage and winning the long fight.`,
      (w, l) => `${W(w)} ${threatOf(w)}, and ${N(l)}'s right-clicks can't break through.`,
      (w, l) => `${W(w)} ${threatOf(w)}, outlasting ${N(l)} in extended fights.`,
    ],
    loserLed: [
      (w, l) => `${W(l)}'s right-clicks struggle to get through ${N(w)}'s tankiness.`,
      (w, l) => `${W(w)} soaks ${N(l)}'s physical damage and wins the long fight.`,
      (w, l) => `${W(l)} needs long fights to deal damage, and ${N(w)} is built to survive them.`,
    ],
  },
  {
    // Durable melee bully out-trades another melee carry up close.
    when: (w, l) => w.isDurable && w.isMelee && l.isMelee && l.isCarry,
    winnerLed: [
      (w, l) => `${W(w)} ${threatOf(w)}, out-trading ${N(l)} in melee range.`,
      (w, l) => `${W(w)} ${threatOf(w)}, winning the melee brawl against ${N(l)}.`,
      (w, l) => `${W(w)} ${threatOf(w)}, and ${N(l)} can't match that up close.`,
    ],
    loserLed: [
      (w, l) => `${W(w)} out-trades ${N(l)} in melee range.`,
      (w, l) => `${W(l)} has to fight ${N(w)} up close, where ${N(w)} is stronger and tankier.`,
      (w, l) => `${W(l)} ${weaknessOf(l)}, and ${N(w)} wins the melee brawl.`,
    ],
  },
  {
    // Hard disables shut a carry down before it can deal damage.
    when: (w, l) => w.hasLockdown && l.isCarry,
    winnerLed: [
      (w, l) => `${W(w)} ${threatOf(w)}, shutting ${N(l)} down before the farm comes online.`,
      (w, l) => `${W(w)} ${threatOf(w)}, keeping ${N(l)} from farming or fighting freely.`,
      (w, l) => `${W(w)} ${threatOf(w)}, and ${N(l)} can't farm through that pressure.`,
    ],
    loserLed: [
      (w, l) => `${W(w)}'s disables stop ${N(l)} from farming freely or fighting back.`,
      (w, l) => `${W(l)} ${weaknessOf(l)}, and ${N(w)}'s lockdown makes the early game miserable.`,
      (w, l) => `${W(w)} can chain-disable ${N(l)} before ${N(l)}'s items come online.`,
    ],
  },
  {
    // Mobile pickoff hero hunts an immobile or squishy target.
    when: (w, l) => w.mobile && (l.squishy || (!l.mobile && l.isCarry)),
    winnerLed: [
      (w, l) => `${W(w)} ${threatOf(w)}, and ${N(l)} ${weaknessOf(l)}.`,
      (w, l) => `${W(w)} ${threatOf(w)}, catching ${N(l)} out of position.`,
      (w, l) => `${W(w)} ${threatOf(w)}, turning ${N(l)} into an easy pickoff.`,
    ],
    loserLed: [
      (w, l) => `${W(w)} catches ${N(l)} out of position, and ${N(l)} ${weaknessOf(l)}.`,
      (w, l) => `${W(l)} ${weaknessOf(l)}, which makes ${N(l)} an easy pickoff for ${N(w)}.`,
      (w, l) => `${W(l)} can't get away once ${N(w)} commits to a gank.`,
    ],
  },
  {
    // Ranged hero kites a melee hero that can't close the gap.
    when: (w, l) => w.isRanged && l.isMelee && !l.mobile,
    winnerLed: [
      (w, l) => `${W(w)} ${threatOf(w)}, fighting from range while ${N(l)} ${weaknessOf(l)}.`,
      (w, l) => `${W(w)} ${threatOf(w)}, and ${N(l)} struggles to close the gap.`,
      (w, l) => `${W(w)} ${threatOf(w)} while staying out of ${N(l)}'s reach.`,
    ],
    loserLed: [
      (w, l) => `${W(l)} ${weaknessOf(l)}, and ${N(w)} fights from range.`,
      (w, l) => `${W(w)} kites ${N(l)} from range, and ${N(l)} struggles to close the gap.`,
      (w, l) => `${W(l)} has trouble reaching ${N(w)}, who fights from a distance.`,
    ],
  },
];

const COUNTER_FALLBACK: Omit<CounterRule, "when"> = {
  winnerLed: [
    (w, l) => `${W(w)} ${threatOf(w)}, while ${N(l)} ${weaknessOf(l)}.`,
    (w, l) => `${W(w)} ${threatOf(w)}, and ${N(l)} ${weaknessOf(l)}.`,
    (w, l) => `${W(w)} ${threatOf(w)}; meanwhile ${N(l)} ${weaknessOf(l)}.`,
  ],
  loserLed: [
    (w, l) => `${W(l)} ${weaknessOf(l)}, and ${N(w)} is well placed to exploit it.`,
    (w, l) => `${W(w)} tends to have the edge here: ${N(l)} ${weaknessOf(l)}.`,
    (w, l) => `${W(l)} ${weaknessOf(l)}, which suits ${N(w)}'s game plan.`,
  ],
};

/** Index of the first matching counter rule, or -1 for the fallback. Shared with reasonsTh.ts. */
export function counterRuleIndex(winner: HeroTags, loser: HeroTags): number {
  return COUNTER_RULES.findIndex((r) => r.when(winner, loser));
}

export interface ReasonOptions {
  /** Which side varies down the list and should lead the sentence. Default "winner". */
  lead?: "winner" | "loser";
  /** Phrasing variant (rotates within a list). Default 0. */
  variant?: number;
}

const pick = <T>(arr: T[], i: number): T => arr[((i % arr.length) + arr.length) % arr.length]!;

export function counterReason(winner: HeroTags, loser: HeroTags, opts: ReasonOptions = {}): string {
  const idx = counterRuleIndex(winner, loser);
  const rule = idx >= 0 ? COUNTER_RULES[idx]! : COUNTER_FALLBACK;
  const set = opts.lead === "loser" ? rule.loserLed : rule.winnerLed;
  return pick(set, opts.variant ?? 0)(winner, loser);
}

// ---------------------------------------------------------------------------
// Synergies
// ---------------------------------------------------------------------------

/** How much of a "setter-upper" a hero is, used to orient the reason sentence. */
function setupScore(t: HeroTags): number {
  return (
    (t.isDisabler ? 2 : 0) +
    (t.isInitiator ? 2 : 0) +
    (t.isSupport ? 1 : 0) +
    (t.hasLockdown ? 1 : 0)
  );
}

/**
 * Why `a` and `b` work well together, phrased for hero `a`'s "Works well with" list: `a` is the
 * same on every row, so the sentence leads with `b` (the hero that changes) and rotates between
 * phrasings via `variant`. Without this, a strong setter like Alchemist opened all 14 rows with
 * the same signature line.
 */
export function synergyReason(a: HeroTags, b: HeroTags, variant = 0): string {
  // Orient: `s` enables, `f` capitalises.
  const [s, f] = setupScore(a) >= setupScore(b) ? [a, b] : [b, a];
  const fixedIsSetter = s === a;
  const v = variant % 2;

  // Both push objectives.
  if (a.isPusher && b.isPusher) {
    return v === 0
      ? `${W(b)} and ${N(a)} both excel at pushing, taking towers before the enemy can group.`
      : `${W(b)} and ${N(a)} can take towers fast together, before the enemy has time to group.`;
  }

  // Initiation into AoE follow-up.
  if (s.isInitiator && (f.isNuker || f.burstThreat)) {
    if (fixedIsSetter) {
      return v === 0
        ? `${W(f)} lands ${damageNoun(f)} on the enemies ${N(s)} catches in the initiation.`
        : `${W(f)} is ready with ${damageNoun(f)} the moment ${N(s)} starts the fight.`;
    }
    return v === 0
      ? `${W(s)} ${setupOf(s)}, letting ${N(f)} land ${damageNoun(f)} on the grouped enemies.`
      : `${W(s)} ${setupOf(s)}, and ${N(f)} cashes in with ${damageNoun(f)}.`;
  }

  // Lockdown into burst/carry follow-up.
  if (s.hasLockdown && (f.burstThreat || f.isNuker || f.isCarry)) {
    if (fixedIsSetter) {
      return v === 0
        ? `${W(f)} follows up with ${damageNoun(f)} whenever ${N(s)} lands a disable.`
        : `${W(f)} turns every ${N(s)} disable into a kill with ${damageNoun(f)}.`;
    }
    return v === 0
      ? `${W(s)} ${setupOf(s)}, and ${N(f)} follows up with ${damageNoun(f)}.`
      : `${W(s)} ${setupOf(s)}, giving ${N(f)} a free window for ${damageNoun(f)}.`;
  }

  // Support enabling a carry to scale.
  if (s.isSupport && f.isCarry) {
    if (fixedIsSetter) {
      return v === 0
        ? `${W(f)} gets room to farm and scale while ${N(s)} keeps the lane safe.`
        : `${W(f)} can play greedy for items with ${N(s)} protecting the lane.`;
    }
    return v === 0
      ? `${W(s)} ${setupOf(s)} so ${N(f)} can farm safely and scale into a hard carry.`
      : `${W(s)} ${setupOf(s)}, buying ${N(f)} the time to reach late-game items.`;
  }

  // Frontline tank + squishy backline damage.
  if (a.frontline !== b.frontline && (a.squishy || b.squishy)) {
    const front = a.frontline ? a : b;
    const back = a.frontline ? b : a;
    if (front === a) {
      return v === 0
        ? `${W(back)} deals damage safely from the back while ${N(front)} holds the frontline.`
        : `${W(back)} stays out of danger behind ${N(front)}'s frontline.`;
    }
    return v === 0
      ? `${W(front)} ${threatOf(front)} up front, letting ${N(back)} deal damage safely from the back.`
      : `${W(front)} ${threatOf(front)}, soaking the attention that would otherwise go to ${N(back)}.`;
  }

  // Generic complementary pairing.
  if (fixedIsSetter) {
    return v === 0
      ? `${W(f)} adds ${damageNoun(f)} to what ${N(s)} sets up, and each covers the other's weaknesses.`
      : `${W(f)} brings the ${damageNoun(f)} that ${N(s)}'s setup needs.`;
  }
  return v === 0
    ? `${W(s)} ${setupOf(s)} and ${N(f)} adds ${damageNoun(f)}, covering each other's weaknesses.`
    : `${W(s)} ${setupOf(s)}, a good match for ${N(f)}'s ${damageNoun(f)}.`;
}
