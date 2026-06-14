// Output shape of data/heroData.json, mirroring pipeline/src/types.ts.
// (Kept as an independent copy so the frontend has no build dependency on the pipeline.)

export interface CounterEntry {
  hero_id: number;
  /** (hero's win rate vs this opponent) - (hero's overall win rate). */
  delta: number;
  reason: string;
}

export interface SynergyEntry {
  hero_id: number;
  score: number;
  reason: string;
}

export interface ItemCounterEntry {
  item: string;
  icon_url: string;
  reason: string;
}

export interface RecommendedItemEntry {
  item: string;
  icon_url: string;
  reason: string;
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
}

export interface Meta {
  last_updated: string;
  patch: string;
  patch_first_seen: string;
  low_sample_warning: boolean;
}

/** Raw file: { meta, "1": Hero, "2": Hero, ... } */
export type HeroDataFile = { meta: Meta } & Record<string, Hero | Meta>;

/** A hero with its id attached, used throughout the UI. */
export interface HeroWithId extends Hero {
  id: number;
}
