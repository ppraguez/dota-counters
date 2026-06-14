/**
 * Derives a normalized set of "tags" for each hero from the only attributes OpenDota's
 * /heroes endpoint reliably exposes for ALL heroes: primary_attr, attack_type, and roles.
 *
 * Why this layer exists: we deliberately avoid scraping per-ability data (disables, exact
 * damage types, BKB-piercing stuns, etc.) because that data is large, version-volatile, and
 * not uniformly available. Roles + attribute + attack type are stable, complete, and good
 * enough to produce consistent, plausible reasons and synergy scores for every hero without
 * any runtime LLM call. An optional curated "signature" layer (signatures.ts) adds flavour
 * for iconic heroes on top of these generic tags.
 */
import type { OpenDotaHero } from "./types.js";

export interface HeroTags {
  id: number;
  name: string;
  localizedName: string;
  primaryAttr: "str" | "agi" | "int" | "all";
  isMelee: boolean;
  isRanged: boolean;

  // Role-derived traits (OpenDota role strings).
  isCarry: boolean;
  isSupport: boolean;
  isDisabler: boolean;
  isNuker: boolean;
  isInitiator: boolean;
  isDurable: boolean;
  isEscape: boolean;
  isPusher: boolean;
  isJungler: boolean;

  // Higher-level derived flags used by the rules engines.
  /** Burst/magic threat: int nuker or any nuker without durability. */
  burstThreat: boolean;
  /** Sustained physical right-click threat: agi carry. */
  physicalCarry: boolean;
  /** Frontline body that wants to be in the enemy's face. */
  frontline: boolean;
  /** Squishy backliner that dies to lockdown + burst. */
  squishy: boolean;
  /** Has hard lockdown to set up or shut down a target. */
  hasLockdown: boolean;
  /** Can escape / reposition out of danger. */
  mobile: boolean;
}

function hasRole(h: OpenDotaHero, role: string): boolean {
  return h.roles.includes(role);
}

function normAttr(attr: string): HeroTags["primaryAttr"] {
  if (attr === "str" || attr === "agi" || attr === "int" || attr === "all") return attr;
  return "all";
}

export function deriveTags(h: OpenDotaHero): HeroTags {
  const primaryAttr = normAttr(h.primary_attr);
  const isMelee = h.attack_type === "Melee";
  const isRanged = !isMelee;

  const isCarry = hasRole(h, "Carry");
  const isSupport = hasRole(h, "Support");
  const isDisabler = hasRole(h, "Disabler");
  const isNuker = hasRole(h, "Nuker");
  const isInitiator = hasRole(h, "Initiator");
  const isDurable = hasRole(h, "Durable");
  const isEscape = hasRole(h, "Escape");
  const isPusher = hasRole(h, "Pusher");
  const isJungler = hasRole(h, "Jungler");

  const burstThreat = isNuker && (primaryAttr === "int" || !isDurable);
  const physicalCarry = isCarry && (primaryAttr === "agi" || primaryAttr === "all");
  const frontline = isDurable || (isMelee && isInitiator);
  const squishy = !isDurable && (isRanged || primaryAttr === "int") && !frontline;
  const hasLockdown = isDisabler || isInitiator;
  const mobile = isEscape;

  return {
    id: h.id,
    name: h.name,
    localizedName: h.localized_name,
    primaryAttr,
    isMelee,
    isRanged,
    isCarry,
    isSupport,
    isDisabler,
    isNuker,
    isInitiator,
    isDurable,
    isEscape,
    isPusher,
    isJungler,
    burstThreat,
    physicalCarry,
    frontline,
    squishy,
    hasLockdown,
    mobile,
  };
}

export function buildTagIndex(heroes: OpenDotaHero[]): Map<number, HeroTags> {
  const index = new Map<number, HeroTags>();
  for (const h of heroes) index.set(h.id, deriveTags(h));
  return index;
}
