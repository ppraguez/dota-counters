// Output shape of data/heroData.json, mirroring pipeline/src/types.ts.
// (Kept as an independent copy so the frontend has no build dependency on the pipeline.)

export interface CounterEntry {
  hero_id: number;
  /** (hero's win rate vs this opponent) - (hero's overall win rate). */
  delta: number;
  reason: string;
  /** Thai translation of `reason` (hero names kept in English). */
  reason_th?: string;
}

export interface SynergyEntry {
  hero_id: number;
  score: number;
  reason: string;
  /** Thai translation of `reason` (hero names kept in English). */
  reason_th?: string;
}

export interface ItemCounterEntry {
  item: string;
  icon_url: string;
  reason: string;
  /** Thai translation of `reason` (item/hero names kept in English). */
  reason_th?: string;
}

export interface RecommendedItemEntry {
  item: string;
  icon_url: string;
  reason: string;
  /** Thai translation of `reason` (item names kept in English). */
  reason_th?: string;
}

export interface AbilityCounterEntry {
  /** "offense" = this hero's ability counters others; "defense" = an enemy ability counters this hero. */
  kind: "offense" | "defense";
  /** Headline ability name (kept in English). */
  ability: string;
  /** Icon URL for the ability/item (null when no representative icon exists). */
  icon_url?: string | null;
  reason: string;
  /** Thai translation of `reason` (ability/hero names kept in English). */
  reason_th?: string;
}

export interface HeroAttributes {
  primary_attr: string;
  attack_type: string;
}

export interface Hero {
  name: string;
  localized_name: string;
  icon_url: string;
  roles: string[];
  attributes: HeroAttributes;
  countered_by: CounterEntry[];
  counters: CounterEntry[];
  synergies: SynergyEntry[];
  item_counters: ItemCounterEntry[];
  recommended_items: RecommendedItemEntry[];
  ability_counters?: AbilityCounterEntry[];
}

export interface Meta {
  last_updated: string;
  patch: string;
  patch_first_seen: string;
  low_sample_warning: boolean;
}

/** One hero's standing within a role's current meta (high-skill bracket data). */
export interface RolesMetaEntry {
  hero_id: number;
  /** Win rate 0..1 in the high-skill brackets. */
  win_rate: number;
  /** Share of all high-skill picks, 0..1 (popularity). */
  pick_rate: number;
}

/** Current meta heroes per role, derived from OpenDota /heroStats. */
export interface RolesMeta {
  source: string;
  roles: Record<string, RolesMetaEntry[]>;
}

/** Raw file: { meta, roles_meta?, "1": Hero, "2": Hero, ... } */
export type HeroDataFile = { meta: Meta; roles_meta?: RolesMeta } & Record<
  string,
  Hero | Meta | RolesMeta | undefined
>;

/** A hero with its id attached, used throughout the UI. */
export interface HeroWithId extends Hero {
  id: number;
}
