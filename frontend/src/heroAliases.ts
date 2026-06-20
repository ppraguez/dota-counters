// Community nicknames / shorthand for heroes, keyed by hero slug
// (the part after `npc_dota_hero_`, e.g. "antimage", "phantom_assassin").
//
// These feed the search box so players can type how they actually talk —
// "pa", "wk", "qop", "potm" — instead of the full localized name. Matching
// is prefix-based, so "p" already narrows toward "pa"/"pl"/"pango", etc.
//
// Aliases need not be unique: "bm" surfaces both Beastmaster and Broodmother,
// "es" both Earthshaker and Earth Spirit — that's fine, the player picks.

export const HERO_ALIASES: Record<string, string[]> = {
  abaddon: ["abba"],
  alchemist: ["alch"],
  ancient_apparition: ["aa"],
  antimage: ["am", "magina"],
  arc_warden: ["arc", "aw"],
  batrider: ["bat", "br"],
  beastmaster: ["bm"],
  bloodseeker: ["bs"],
  bounty_hunter: ["bh"],
  brewmaster: ["brew"],
  bristleback: ["bb", "bristle"],
  broodmother: ["brood", "bm"],
  centaur: ["cent", "centaur warrunner"],
  chaos_knight: ["ck"],
  rattletrap: ["clock", "cw", "clockwerk"],
  crystal_maiden: ["cm"],
  dark_seer: ["ds"],
  dark_willow: ["dw"],
  dawnbreaker: ["dawn", "db"],
  death_prophet: ["dp"],
  doom_bringer: ["doom"],
  dragon_knight: ["dk"],
  drow_ranger: ["drow"],
  earth_spirit: ["earth", "es"],
  earthshaker: ["es", "shaker"],
  elder_titan: ["et"],
  ember_spirit: ["ember"],
  enchantress: ["ench"],
  faceless_void: ["void", "fv"],
  furion: ["np", "furion", "natures prophet", "prophet"],
  grimstroke: ["grim", "gs"],
  gyrocopter: ["gyro"],
  hoodwink: ["hood"],
  invoker: ["invo"],
  juggernaut: ["jugg", "jug"],
  keeper_of_the_light: ["kotl"],
  legion_commander: ["lc", "legion"],
  leshrac: ["lesh"],
  life_stealer: ["ls", "naix", "lifestealer"],
  lone_druid: ["ld"],
  magnataur: ["magnus", "mag"],
  medusa: ["dusa"],
  mirana: ["potm", "priestess of the moon"],
  monkey_king: ["mk"],
  morphling: ["morph"],
  naga_siren: ["naga"],
  necrolyte: ["necro", "necrophos"],
  nevermore: ["sf", "nevermore", "shadow fiend"],
  night_stalker: ["ns"],
  nyx_assassin: ["nyx"],
  obsidian_destroyer: ["od", "outworld destroyer", "outworld devourer"],
  ogre_magi: ["ogre"],
  omniknight: ["omni"],
  pangolier: ["pango"],
  phantom_assassin: ["pa"],
  phantom_lancer: ["pl"],
  primal_beast: ["pb", "primal"],
  queenofpain: ["qop", "queen of pain"],
  sand_king: ["sk"],
  shadow_demon: ["sd"],
  shadow_shaman: ["ss", "rhasta"],
  shredder: ["timber", "timbersaw"],
  skeleton_king: ["wk", "wraith king"],
  skywrath_mage: ["sky", "swm", "skywrath"],
  spectre: ["spec"],
  spirit_breaker: ["sb", "bara"],
  storm_spirit: ["storm"],
  templar_assassin: ["ta"],
  terrorblade: ["tb"],
  tidehunter: ["tide"],
  treant: ["tree", "treant protector"],
  troll_warlord: ["troll"],
  underlord: ["underlord"],
  abyssal_underlord: ["underlord", "ul"],
  vengefulspirit: ["vs", "venge", "vengeful spirit"],
  venomancer: ["veno"],
  void_spirit: ["void spirit", "vspirit"],
  windrunner: ["wr", "windranger", "windrunner"],
  winter_wyvern: ["ww", "wyvern"],
  wisp: ["io", "wisp"],
  witch_doctor: ["wd"],
  zuus: ["zeus"],
};

/** Hero slug from its internal name, e.g. "npc_dota_hero_antimage" -> "antimage". */
export function heroSlug(name: string): string {
  return name.replace(/^npc_dota_hero_/, "");
}

/** Nicknames for a hero, given its internal `name`. Empty array if none. */
export function aliasesForName(name: string): string[] {
  return HERO_ALIASES[heroSlug(name)] ?? [];
}
