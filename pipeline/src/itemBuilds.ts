/**
 * "Items that best suit each hero" — built from OpenDota's real itemPopularity data (what
 * players actually buy on a hero), not guesses.
 *
 * Pipeline:
 *   1. Pull /constants/items once to map item id -> {shortname, display name, cost, recipe}.
 *   2. Derive the set of "component" items (anything that appears in another item's recipe).
 *   3. For each hero, take its mid+late game item popularity, drop components / consumables /
 *      cheap basics, and keep the most-built FINAL items.
 *   4. Attach a short benefit reason (curated per item, generic fallback otherwise).
 *
 * The item-metadata index is cached to disk so offline rebuilds (MATCHUPS_OFFLINE) still work.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import { itemIconUrl } from "./itemCounters.js";
import type {
  OpenDotaItemConstants,
  OpenDotaItemPopularity,
  RecommendedItemEntry,
} from "./types.js";

export interface ItemMeta {
  key: string; // shortname, also the icon slug
  dname: string;
  cost: number;
  qual: string;
  components: string[] | null;
}

export interface ItemIndex {
  byId: Record<number, ItemMeta>;
  /** Keys used as a recipe component of some other item. */
  componentKeys: Set<string>;
}

/** Items that are technically components of something but are still common END items. */
const KEEP_EVEN_IF_COMPONENT = new Set([
  "black_king_bar",
  "manta",
  "skadi",
  "basher",
  "abyssal_blade",
  "maelstrom",
  "diffusal_blade",
  "helm_of_the_dominator",
]);

/** Drop items cheaper than this (boots-of-speed components, wands, wraith bands, …). */
const MIN_ITEM_COST = 900;

export function buildIndexFromConstants(constants: OpenDotaItemConstants): ItemIndex {
  const byId: Record<number, ItemMeta> = {};
  const componentKeys = new Set<string>();
  for (const [key, v] of Object.entries(constants)) {
    if (!v || typeof v.id !== "number") continue;
    byId[v.id] = {
      key,
      dname: v.dname ?? key,
      cost: typeof v.cost === "number" ? v.cost : 0,
      qual: v.qual ?? "",
      components: v.components ?? null,
    };
    if (Array.isArray(v.components)) for (const c of v.components) componentKeys.add(c);
  }
  return { byId, componentKeys };
}

function isFinalItem(m: ItemMeta, index: ItemIndex): boolean {
  if (m.qual === "consumable" || m.qual === "recipe") return false;
  if (m.cost < MIN_ITEM_COST) return false;
  if (m.key.startsWith("recipe")) return false;
  if (index.componentKeys.has(m.key) && !KEEP_EVEN_IF_COMPONENT.has(m.key)) return false;
  return true;
}

/** Short, item-centric benefit phrases keyed by item shortname. */
const ITEM_BENEFITS: Record<string, string> = {
  // Boots
  power_treads: "attack speed plus stat-swapping for any role",
  phase_boots: "burst move speed and bonus physical damage",
  arcane_boots: "a burst of mana for the whole team",
  tranquil_boots: "move speed and steady self-healing",
  travel_boots: "global map presence via teleport",
  travel_boots_2: "upgraded global teleport mobility",
  boots_of_bearing: "a team move and attack-speed aura with an active",
  guardian_greaves: "a team heal, mana, and dispel in one",
  // Spell immunity / dispels / saves
  black_king_bar: "spell immunity to fight through disables and magic",
  manta: "a dispel plus illusions and attack speed",
  lotus_orb: "a reflecting, dispelling save",
  aeon_disk: "a clutch save when you get bursted",
  glimmer_cape: "a magic-resist save with invisibility",
  linkens_sphere: "a single-target spell block with strong stats",
  sphere: "a single-target spell block with strong stats",
  // Right-click cores
  butterfly: "evasion, agility, and big attack speed",
  daedalus: "massive critical-strike damage",
  desolator: "armor reduction to ramp up physical damage",
  devastator: "spell amp and an armor-shredding attack aura", // Parasma
  monkey_king_bar: "true strike and bonus magic damage",
  bloodthorn: "a silencing burst with true strike and crit",
  silver_edge: "an invis burst that breaks enemy passives",
  abyssal_blade: "a hard bash to lock a target down",
  basher: "a chance to bash and stun in fights",
  satanic: "lifesteal with a huge sustain active",
  mjollnir: "attack speed and chain-lightning clear",
  maelstrom: "farming speed with chain lightning",
  bfury: "fast farming with cleave", // Battle Fury
  greater_crit: "massive critical-strike damage", // Daedalus
  mask_of_madness: "berserk attack speed for farming and fights",
  armlet: "cheap, powerful right-click stats",
  rapier: "all-in glass-cannon damage", // Divine Rapier
  disperser: "a dispel and slow with strong stats",
  skadi: "huge stats and a healing-cutting slow",
  sange_and_yasha: "stats, status resistance, and a slow",
  diffusal_blade: "mana burn and a reliable slow",
  echo_sabre: "a double-attack burst with mana sustain",
  nullifier: "to dispel and mute an enemy's items",
  moon_shard: "a large permanent attack-speed boost",
  hurricane_pike: "range and repositioning against melee",
  harpoon: "a gap-closer to stick to targets",
  // Tanky / utility
  heart: "enormous health and regeneration",
  assault: "an armor and attack-speed aura",
  shivas_guard: "armor and an AoE slow that cuts healing",
  crimson_guard: "physical damage block for the team",
  pipe: "a team magic-damage shield",
  vladmir: "lifesteal and armor for the team",
  helm_of_the_dominator: "a lifesteal aura and a dominated creep",
  helm_of_the_overlord: "a lifesteal aura and a powerful dominated creep",
  blade_mail: "to return burst damage to attackers",
  eternal_shroud: "magic resistance and spell lifesteal",
  // Caster cores
  blink: "instant initiation and repositioning",
  swift_blink: "an upgraded Blink with bonus attack speed",
  overwhelming_blink: "an upgraded Blink with tanky stats and an AoE slow",
  arcane_blink: "an upgraded Blink with cast range and mana",
  aghanims_scepter: "a powerful ultimate or ability upgrade",
  ultimate_scepter: "a powerful ultimate or ability upgrade",
  ultimate_scepter_2: "a permanent Scepter upgrade", // Aghanim's Blessing
  aghanims_shard: "an ability upgrade for extra utility",
  aether_lens: "extra cast range and mana",
  octarine_core: "cooldown reduction and spell lifesteal",
  kaya_and_sange: "spell amplification with sustain",
  yasha_and_kaya: "spell amp, attack speed, and sustain",
  ethereal_blade: "a magic burst and a defensive save",
  dagon: "a single-target magic nuke",
  dagon_5: "a heavy single-target magic nuke",
  veil_of_discord: "magic-resistance reduction for your nukes",
  sheepstick: "a guaranteed hex to disable a key target", // Scythe of Vyse
  mage_slayer: "magic resistance and a silence on hit",
  refresher: "to recast your ultimate twice in a fight",
  bloodstone: "mana sustain and spell lifesteal",
  wind_waker: "a cyclone save with mana and stats",
  rod_of_atos: "a long root with intelligence",
  gungir: "a chain root with attack speed",
  orchid: "a silence with mana and burst",
  meteor_hammer: "wave-clear and a building nuke",
  // Farming / scaling
  radiance: "a farming burn and evasion aura",
  hand_of_midas: "gold and experience acceleration",
  // Supports
  spirit_vessel: "an HP and regen-cutting damage tool",
  solar_crest: "armor manipulation to amplify a target",
  force_staff: "repositioning for offense or escape",
  holy_locket: "amplified healing for your saves",
  medallion_of_courage: "armor swing to set up kills",
  drum_of_endurance: "team move and attack speed",
};

function reasonFor(m: ItemMeta): string {
  // Dagon is recorded at its current level (dagon_2..dagon_5); collapse to the base benefit.
  const key = /^dagon_\d$/.test(m.key) ? "dagon" : m.key;
  const benefit = ITEM_BENEFITS[key] ?? "a popular core pickup on this hero";
  return benefit.charAt(0).toUpperCase() + benefit.slice(1) + ".";
}

/** Top finished items from a hero's mid+late game popularity. */
export function selectBuildItems(
  pop: OpenDotaItemPopularity,
  index: ItemIndex,
  max: number,
): RecommendedItemEntry[] {
  const counts: Record<number, number> = {};
  for (const stage of ["mid_game_items", "late_game_items"] as const) {
    const bucket = pop[stage];
    if (!bucket) continue;
    for (const [idStr, count] of Object.entries(bucket)) {
      const id = Number(idStr);
      const m = index.byId[id];
      if (!m || !isFinalItem(m, index)) continue;
      counts[id] = (counts[id] ?? 0) + count;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([idStr]) => {
      const m = index.byId[Number(idStr)]!;
      return { item: m.dname, icon_url: itemIconUrl(m.key), reason: reasonFor(m) };
    });
}

// ---- Cache of the item-metadata index (so offline rebuilds work) ----

const metaCacheFile = path.join(config.dataDir, ".cache", "itemMeta.json");

export async function saveItemIndexCache(index: ItemIndex): Promise<void> {
  await fs.mkdir(path.dirname(metaCacheFile), { recursive: true });
  await fs.writeFile(metaCacheFile, JSON.stringify({ byId: index.byId }), "utf8");
}

export async function loadItemIndexCache(): Promise<ItemIndex | null> {
  try {
    const raw = await fs.readFile(metaCacheFile, "utf8");
    const parsed = JSON.parse(raw) as { byId: Record<number, ItemMeta> };
    if (!parsed.byId) return null;
    const componentKeys = new Set<string>();
    for (const m of Object.values(parsed.byId)) {
      if (Array.isArray(m.components)) for (const c of m.components) componentKeys.add(c);
    }
    return { byId: parsed.byId, componentKeys };
  } catch {
    return null;
  }
}
