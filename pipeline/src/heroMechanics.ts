/**
 * Curated per-hero mechanic flags.
 *
 * OpenDota's roles tell us "Carry/Disabler/Nuker/…" but NOT the mechanics that determine which
 * *items* counter a hero — evasion, Break-able passives, invisibility, illusions/summons, big
 * single-target disables, heavy self/team sustain, or important channels. Those are stable,
 * well-known properties of each hero's kit, so we encode them here by hand.
 *
 * Only the TRUE flags are listed per hero (everything omitted is false). Heroes not listed fall
 * back to flags derived from their roles/attributes (see deriveMechanics), so they still get
 * sensible item suggestions — they just won't trigger the mechanic-specific ones (e.g. "buy
 * Monkey King Bar vs evasion") that we can't infer from roles alone.
 *
 * Keys are the Steam hero slug (internal name minus "npc_dota_hero_").
 */
import type { HeroTags } from "./heroTags.js";
import { heroSlug } from "./config.js";

export interface Mechanics {
  /** Strong physical right-click damage. */
  physical: boolean;
  /** Significant single-target magical burst. */
  magicBurst: boolean;
  /** AoE magical damage. */
  aoeMagic: boolean;
  /** A strong single-target disable (Linken's / Lotus relevant). */
  bigDisable: boolean;
  /** Has evasion (Monkey King Bar relevant). */
  evasion: boolean;
  /** Relies on a Break-able passive. */
  passive: boolean;
  /** Heavy self or team healing/regen/lifesteal. */
  sustain: boolean;
  /** Can turn invisible (detection relevant). */
  invis: boolean;
  /** Illusion-based. */
  illusions: boolean;
  /** Summon-based. */
  summons: boolean;
  /** Has an important channelled spell (interrupt relevant). */
  channel: boolean;
}

type Flags = Partial<Mechanics>;

const CURATED: Record<string, Flags> = {
  // ---- Physical / right-click cores (passives, evasion, sustain, illusions…) ----
  phantom_assassin: { physical: true, evasion: true, passive: true },
  juggernaut: { physical: true, passive: true },
  faceless_void: { physical: true, evasion: true, passive: true },
  ursa: { physical: true, passive: true },
  sven: { physical: true, passive: true },
  troll_warlord: { physical: true, passive: true },
  slark: { physical: true, passive: true, invis: true },
  riki: { physical: true, invis: true, passive: true },
  bloodseeker: { physical: true, passive: true, sustain: true },
  life_stealer: { physical: true, passive: true, sustain: true },
  skeleton_king: { physical: true, passive: true }, // Wraith King (Reincarnation, crit)
  spectre: { physical: true, passive: true, illusions: true },
  terrorblade: { physical: true, illusions: true },
  phantom_lancer: { physical: true, illusions: true },
  naga_siren: { physical: true, illusions: true },
  chaos_knight: { physical: true, illusions: true },
  meepo: { physical: true, illusions: true },
  medusa: { physical: true },
  drow_ranger: { physical: true, passive: true },
  sniper: { physical: true },
  luna: { physical: true },
  gyrocopter: { physical: true, aoeMagic: true },
  clinkz: { physical: true, invis: true },
  arc_warden: { physical: true, summons: true },
  lone_druid: { physical: true, summons: true },
  monkey_king: { physical: true, passive: true },
  bristleback: { physical: true, passive: true, sustain: true },
  huskar: { physical: true, sustain: true, passive: true },
  dragon_knight: { physical: true, sustain: true, passive: true },
  alchemist: { physical: true, sustain: true },
  abaddon: { physical: true, sustain: true },
  night_stalker: { physical: true, passive: true },
  bounty_hunter: { physical: true, invis: true },
  weaver: { physical: true, invis: true },
  mirana: { physical: true, invis: true, aoeMagic: true },
  broodmother: { physical: true, summons: true },
  lycan: { physical: true, summons: true, passive: true },
  beastmaster: { physical: true, summons: true },
  ember_spirit: { physical: true, magicBurst: true },
  templar_assassin: { physical: true, magicBurst: true, passive: true },
  razor: { physical: true },
  viper: { physical: true },
  morphling: { physical: true },
  tiny: { physical: true, magicBurst: true },
  kunkka: { physical: true, aoeMagic: true },
  dawnbreaker: { physical: true, sustain: true },
  marci: { physical: true },
  primal_beast: { physical: true, channel: true },

  // ---- Magic / disable casters ----
  lion: { magicBurst: true, bigDisable: true, aoeMagic: true },
  shadow_shaman: { bigDisable: true, aoeMagic: true, summons: true, channel: true },
  lina: { magicBurst: true, aoeMagic: true, bigDisable: true },
  zuus: { aoeMagic: true },
  skywrath_mage: { magicBurst: true, aoeMagic: true },
  crystal_maiden: { aoeMagic: true, bigDisable: true, channel: true },
  jakiro: { aoeMagic: true },
  leshrac: { aoeMagic: true },
  disruptor: { aoeMagic: true, bigDisable: true },
  pugna: { aoeMagic: true },
  death_prophet: { aoeMagic: true, summons: true },
  ancient_apparition: { aoeMagic: true, bigDisable: true }, // Ice Blast also blocks healing
  warlock: { aoeMagic: true, summons: true },
  witch_doctor: { aoeMagic: true, bigDisable: true, channel: true },
  enigma: { aoeMagic: true, summons: true, channel: true },
  sand_king: { aoeMagic: true, invis: true, bigDisable: true, channel: true },
  tinker: { aoeMagic: true },
  invoker: { aoeMagic: true, magicBurst: true },
  queenofpain: { aoeMagic: true, magicBurst: true },
  storm_spirit: { magicBurst: true },
  puck: { aoeMagic: true },
  doom_bringer: { bigDisable: true, magicBurst: true },
  bane: { bigDisable: true, channel: true },
  batrider: { bigDisable: true, channel: true, aoeMagic: true },
  legion_commander: { physical: true, bigDisable: true },
  pudge: { bigDisable: true, channel: true },
  silencer: { aoeMagic: true, bigDisable: true },
  rubick: { bigDisable: true, aoeMagic: true },
  necrolyte: { aoeMagic: true, sustain: true, bigDisable: true },
  oracle: { sustain: true, bigDisable: true },
  dazzle: { sustain: true },
  omniknight: { sustain: true },
  wisp: { sustain: true }, // Io
  treant: { sustain: true, invis: true },
  enchantress: { summons: true, sustain: true },
  chen: { summons: true, sustain: true },
  undying: { summons: true, sustain: true },
  visage: { summons: true },
  furion: { summons: true }, // Nature's Prophet
  venomancer: { aoeMagic: true, summons: true },
  shredder: { aoeMagic: true, sustain: true }, // Timbersaw
  obsidian_destroyer: { magicBurst: true, aoeMagic: true }, // Outworld Destroyer
  windrunner: { physical: true, evasion: true },
  tidehunter: { aoeMagic: true, passive: true }, // Kraken Shell (Break) + Ravage
  centaur: { passive: true }, // Return
  magnataur: { physical: true, bigDisable: true },
  earthshaker: { aoeMagic: true, bigDisable: true },
  axe: { passive: true, bigDisable: true }, // Counter Helix passive + Berserker's Call
  spirit_breaker: { bigDisable: true },
  slardar: { physical: true, bigDisable: true },
  nyx_assassin: { magicBurst: true },
  vengefulspirit: { bigDisable: true },
  shadow_demon: { illusions: true, bigDisable: true },
};

/** Flags we can reasonably infer from roles/attributes when a hero isn't curated. */
function derivedFromTags(t: HeroTags): Mechanics {
  return {
    physical: t.physicalCarry,
    magicBurst: t.isNuker && (t.primaryAttr === "int" || t.primaryAttr === "all"),
    aoeMagic: false, // can't tell single-target vs AoE from roles; only curation sets this
    bigDisable: t.isDisabler,
    evasion: false,
    passive: false,
    sustain: false,
    invis: false,
    illusions: false,
    summons: false,
    channel: false,
  };
}

/** Merge curated TRUE flags over the role-derived baseline. */
export function getMechanics(t: HeroTags): Mechanics {
  const base = derivedFromTags(t);
  const curated = CURATED[heroSlug(t.name)];
  if (!curated) return base;
  return { ...base, ...curated };
}

/** Exposed so the pipeline can warn about curated keys that don't match any real hero. */
export const CURATED_MECHANIC_KEYS = Object.keys(CURATED);
