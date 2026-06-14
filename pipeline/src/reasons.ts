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

interface CounterRule {
  when: (w: HeroTags, l: HeroTags) => boolean;
  make: (w: HeroTags, l: HeroTags) => string;
}

/** Ordered most-specific first; the first matching rule wins. */
const COUNTER_RULES: CounterRule[] = [
  {
    // Lockdown removes an escape-reliant hero's main defence.
    when: (w, l) => w.hasLockdown && l.mobile,
    make: (w, l) =>
      `${cap(w.localizedName)} ${threatOf(w)}, and the lockdown cancels ${l.localizedName}'s escape.`,
  },
  {
    // Magical burst deletes a fragile target before it acts.
    when: (w, l) => w.burstThreat && l.squishy,
    make: (w, l) =>
      `${cap(w.localizedName)} ${threatOf(w)} — ${l.localizedName} ${weaknessOf(l)}.`,
  },
  {
    // A tank simply outlasts a right-click carry's physical damage.
    when: (w, l) => w.isDurable && l.physicalCarry,
    make: (w, l) =>
      `${cap(w.localizedName)} ${threatOf(w)}, soaking ${l.localizedName}'s physical damage and winning the long fight.`,
  },
  {
    // Durable melee bully out-trades another melee carry up close.
    when: (w, l) => w.isDurable && w.isMelee && l.isMelee && l.isCarry,
    make: (w, l) =>
      `${cap(w.localizedName)} ${threatOf(w)}, out-trading ${l.localizedName} in melee range.`,
  },
  {
    // Hard disables shut a carry down before it can deal damage.
    when: (w, l) => w.hasLockdown && l.isCarry,
    make: (w, l) =>
      `${cap(w.localizedName)} ${threatOf(w)}, shutting ${l.localizedName} down before it can take over.`,
  },
  {
    // Mobile pickoff hero hunts an immobile or squishy target.
    when: (w, l) => w.mobile && (l.squishy || (!l.mobile && l.isCarry)),
    make: (w, l) =>
      `${cap(w.localizedName)} ${threatOf(w)}, and ${l.localizedName} ${weaknessOf(l)}.`,
  },
  {
    // Ranged hero kites a melee hero that can't close the gap.
    when: (w, l) => w.isRanged && l.isMelee && !l.mobile,
    make: (w, l) =>
      `${cap(w.localizedName)} keeps the distance while ${l.localizedName} ${weaknessOf(l)}.`,
  },
];

const COUNTER_FALLBACK = (w: HeroTags, l: HeroTags): string =>
  `${cap(w.localizedName)} ${threatOf(w)}, while ${l.localizedName} ${weaknessOf(l)}.`;

export function counterReason(winner: HeroTags, loser: HeroTags): string {
  for (const rule of COUNTER_RULES) {
    if (rule.when(winner, loser)) return rule.make(winner, loser);
  }
  return COUNTER_FALLBACK(winner, loser);
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

export function synergyReason(a: HeroTags, b: HeroTags): string {
  // Orient: `setter` enables, `follower` capitalises.
  const [setter, follower] = setupScore(a) >= setupScore(b) ? [a, b] : [b, a];

  // Both push objectives.
  if (a.isPusher && b.isPusher) {
    return `${cap(a.localizedName)} and ${b.localizedName} both excel at pushing, taking towers and objectives before the enemy can group.`;
  }

  // Initiation into AoE follow-up.
  if (setter.isInitiator && (follower.isNuker || follower.burstThreat)) {
    return `${cap(setter.localizedName)} ${setupOf(setter)}, letting ${follower.localizedName} land ${damageNoun(follower)} on the grouped enemies.`;
  }

  // Lockdown into burst/carry follow-up.
  if (setter.hasLockdown && (follower.burstThreat || follower.isNuker || follower.isCarry)) {
    return `${cap(setter.localizedName)} ${setupOf(setter)}, and ${follower.localizedName} follows up with ${damageNoun(follower)}.`;
  }

  // Support enabling a carry to scale.
  if (setter.isSupport && follower.isCarry) {
    return `${cap(setter.localizedName)} ${setupOf(setter)} so ${follower.localizedName} can farm safely and scale into a hard carry.`;
  }

  // Frontline tank + squishy backline damage.
  if (a.frontline !== b.frontline && (a.squishy || b.squishy)) {
    const front = a.frontline ? a : b;
    const back = a.frontline ? b : a;
    return `${cap(front.localizedName)} ${threatOf(front)} up front, letting ${back.localizedName} deal damage safely from the back.`;
  }

  // Generic complementary pairing.
  return `${cap(setter.localizedName)} ${setupOf(setter)} and ${follower.localizedName} adds ${damageNoun(follower)}, covering each other's weaknesses.`;
}
