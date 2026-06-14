/**
 * Shared types for the OpenDota responses we consume and the output file we emit.
 * The output shape here is the single source of truth that the frontend also imports.
 */

// ---- OpenDota API shapes (only the fields we use) ----

/** GET https://api.opendota.com/api/heroes */
export interface OpenDotaHero {
  id: number;
  /** Internal name, e.g. "npc_dota_hero_antimage" */
  name: string;
  /** Display name, e.g. "Anti-Mage" */
  localized_name: string;
  /** "str" | "agi" | "int" | "all" (Universal) */
  primary_attr: string;
  /** "Melee" | "Ranged" */
  attack_type: string;
  /** e.g. ["Carry", "Escape", "Nuker"] */
  roles: string[];
}

/** GET https://api.opendota.com/api/heroes/{id}/matchups */
export interface OpenDotaMatchup {
  /** The opposing hero's id */
  hero_id: number;
  /** Games in which the queried hero faced hero_id on the enemy team */
  games_played: number;
  /** Of those games, how many the queried hero won */
  wins: number;
}

/** One entry from GET https://api.opendota.com/api/constants/patch */
export interface OpenDotaPatch {
  name: string;
  date: string;
  id: number;
}

/** GET https://api.opendota.com/api/heroes/{id}/itemPopularity */
export interface OpenDotaItemPopularity {
  start_game_items?: Record<string, number>;
  early_game_items?: Record<string, number>;
  mid_game_items?: Record<string, number>;
  late_game_items?: Record<string, number>;
}

/** One value from GET https://api.opendota.com/api/constants/items (keyed by item shortname). */
export interface OpenDotaItemConstant {
  id?: number;
  dname?: string;
  cost?: number | null;
  qual?: string;
  components?: string[] | null;
}

export type OpenDotaItemConstants = Record<string, OpenDotaItemConstant>;

// ---- Output shapes (data/heroData.json) ----

export interface CounterEntry {
  hero_id: number;
  /** (win rate vs this hero) - (overall win rate). Signed; magnitude = strength. */
  delta: number;
  reason: string;
  /** Thai translation of `reason` (hero names kept in English). */
  reason_th: string;
}

export interface SynergyEntry {
  hero_id: number;
  /** Rules-based synergy score (higher = stronger pairing). */
  score: number;
  reason: string;
  /** Thai translation of `reason` (hero names kept in English). */
  reason_th: string;
}

export interface ItemCounterEntry {
  /** Display name, e.g. "Black King Bar". */
  item: string;
  icon_url: string;
  reason: string;
  /** Thai translation of `reason` (item/hero names kept in English). */
  reason_th: string;
}

export interface RecommendedItemEntry {
  /** Display name, e.g. "Manta Style". */
  item: string;
  icon_url: string;
  reason: string;
  /** Thai translation of `reason` (item names kept in English). */
  reason_th: string;
}

export interface HeroAttributes {
  primary_attr: string;
  attack_type: string;
}

export interface HeroOutput {
  name: string;
  localized_name: string;
  icon_url: string;
  roles: string[];
  attributes: HeroAttributes;
  /** Heroes that beat this hero (this hero's negative-delta matchups). */
  countered_by: CounterEntry[];
  /** Heroes this hero beats (this hero's positive-delta matchups). */
  counters: CounterEntry[];
  /** Heroes that pair well with this hero on the same team. */
  synergies: SynergyEntry[];
  /** Items the enemy can buy to counter this hero. */
  item_counters: ItemCounterEntry[];
  /** Items that best suit this hero (most-built core items from real match data). */
  recommended_items: RecommendedItemEntry[];
}

export interface OutputMeta {
  last_updated: string;
  patch: string;
  patch_first_seen: string;
  low_sample_warning: boolean;
}

export interface HeroDataFile {
  meta: OutputMeta;
  /** Keyed by stringified hero id. */
  [heroId: string]: HeroOutput | OutputMeta;
}

/** Persisted patch-detection state (data/patchState.json). */
export interface PatchState {
  patch: string;
  /** ISO timestamp this patch was first observed by the pipeline. */
  first_seen: string;
}
