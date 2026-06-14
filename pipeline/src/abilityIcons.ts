/**
 * Resolves an icon URL for each ability-counter entry.
 *
 * Strategy (best-effort, every entry gets an icon):
 *   1. Hero-scoped ability match — if the headline equals one of THIS hero's own ability display
 *      names, use that ability's real icon (handles all the "offense" entries precisely; avoids the
 *      cross-hero name collisions a global match would hit, e.g. two heroes both having "Blink").
 *   2. Curated fallback (HEADLINE_ICON) — the remaining labels are mostly defensive *tactics*
 *      ("Gap-closers", "Detection", "Spell immunity", …) or combined labels, which don't map to a
 *      single ability. Each is mapped by hand to a representative item or ability icon.
 *
 * Ability icons come from OpenDota's /constants/abilities (authoritative `img` path); item icons
 * reuse the Steam items CDN via itemIconUrl. The two constants are cached to disk so offline
 * rebuilds (MATCHUPS_OFFLINE) still resolve icons.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { config } from "./config.js";
import { itemIconUrl } from "./itemCounters.js";

const CDN = "https://cdn.cloudflare.steamstatic.com";

export type AbilitiesConstant = Record<string, { dname?: string; img?: string }>;
export type HeroAbilitiesConstant = Record<string, { abilities?: string[] }>;

/** Curated icon for headlines that aren't one of the hero's own abilities. */
const HEADLINE_ICON: Record<string, string> = {
  // Items / item-like tactics
  "Spell immunity": "item:black_king_bar",
  "Gap-closers": "item:blink",
  "Gap-close her": "item:blink",
  "Gap-close the back": "item:blink",
  "Dodge Ice Shards": "item:blink",
  Detection: "item:dust",
  "Detection + AoE": "item:dust",
  "Detection / lockdown": "item:dust",
  "Detection / sustain": "item:dust",
  "AoE + detection": "item:dust",
  "Catch the rat": "item:dust",
  "Catch her out": "item:dust",
  "Catch the escape": "item:dust",
  "Catch the phase": "item:dust",
  Lockdown: "item:sheepstick",
  "Lockdown the squishy": "item:sheepstick",
  "Lockdown after Omni": "item:sheepstick",
  "Lockdown / silence": "item:sheepstick",
  "Lockdown / burst": "item:sheepstick",
  "Hex / disable": "item:sheepstick",
  "Disable at range": "item:sheepstick",
  "Heavy disable": "item:sheepstick",
  "Heal cut": "item:spirit_vessel",
  "Heal cut + Break": "item:spirit_vessel",
  "Heal cut / Break": "item:spirit_vessel",
  "Heal cut for him?": "item:spirit_vessel",
  "AoE clear": "item:mjollnir",
  "Illusion clear": "item:mjollnir",
  "Clear the summons": "item:mjollnir",
  "Clear the birds": "item:mjollnir",
  "Linken's Sphere": "item:sphere",
  "Linken's / Lotus": "item:sphere",
  "Linken's / BKB": "item:sphere",
  Interrupts: "item:cyclone",
  "Interrupt Chaotic Offering": "item:cyclone",
  "Stop the charge": "item:cyclone",
  "Euls / Lotus": "item:cyclone",
  "Block the roll": "item:cyclone",
  Kiting: "item:force_staff",
  "Kite / Ghost": "item:ghost",
  "Slows / kite": "item:force_staff",
  "Range / kite": "item:force_staff",
  "Ghost / kite": "item:ghost",
  Mobility: "item:force_staff",
  "Spread out": "item:force_staff",
  "Spread vs Vacuum": "item:force_staff",
  "Force Staff / blink": "item:force_staff",
  "Force him out": "item:force_staff",
  "Force the back": "item:force_staff",
  Break: "item:silver_edge",
  "Break / heal cut": "item:silver_edge",
  "Pure damage / Break": "item:silver_edge",
  "Magic burst / Break": "item:silver_edge",
  "Magic damage / Break": "item:silver_edge",
  "Burst before items": "item:dagon_5",
  "Burst through Windrun": "item:dagon_5",
  "Burst him first": "item:dagon_5",
  "Burst the squishy": "item:dagon_5",
  "Burst the egg": "item:dagon_5",
  "AoE burst": "item:dagon_5",
  "Magic burst": "item:dagon_5",
  "Focus the support": "item:dagon_5",
  "Kill the brewmaster": "item:dagon_5",
  "Kill the Io": "item:dagon_5",
  "Focus / silence": "item:orchid",
  "Orchid / mana burn": "item:orchid",
  "Ghost / Halberd": "item:ghost",
  "Ghost / armor": "item:ghost",
  "Dodge the combo": "item:black_king_bar",
  "BKB / interrupt": "item:black_king_bar",
  "Bait the Chrono": "item:black_king_bar",
  "True strike": "item:monkey_king_bar",
  "Magic resist": "item:pipe",
  "Survive the night": "item:pipe",
  "Mana burn": "item:diffusal_blade",
  "Mana burn / kite": "item:diffusal_blade",
  "Mana burn / lockdown": "item:diffusal_blade",
  "Early aggression": "item:smoke_of_deceit",
  "Early pressure": "item:smoke_of_deceit",
  // Specific enemy abilities / units
  Doom: "ability:doom_bringer_doom",
  "Doom / silence": "ability:doom_bringer_doom",
  "Poison Nova": "ability:venomancer_poison_nova",
  Familiars: "ability:visage_summon_familiars",
  Darkness: "ability:night_stalker_darkness",
  "Ice Blast": "ability:ancient_apparition_ice_blast",
  "Spirit Bear": "ability:lone_druid_spirit_bear",
  "Kill or split the bear": "ability:lone_druid_spirit_bear",
  "Kill the Tombstone": "ability:undying_tombstone",
  "Kill the Spirit": "ability:elder_titan_ancestral_spirit",
  "Ice Path + Macropyre": "ability:jakiro_macropyre",
  "Tornado + EMP": "ability:invoker_tornado",
};

export interface IconResolver {
  resolve(heroInternalName: string, headline: string): string | null;
  /** Headlines that resolved to nothing this run (for a build-time warning). */
  misses: Set<string>;
}

function abilityImg(constant: AbilitiesConstant, internalName: string): string | null {
  const a = constant[internalName];
  if (!a || !a.img) return null;
  return `${CDN}${a.img}`;
}

export function buildIconResolver(
  abilities: AbilitiesConstant,
  heroAbilities: HeroAbilitiesConstant,
): IconResolver {
  // hero internal name -> Map(lowercased ability dname -> icon url)
  const heroDnameToImg = new Map<string, Map<string, string>>();
  for (const [heroName, rec] of Object.entries(heroAbilities)) {
    const m = new Map<string, string>();
    for (const an of rec.abilities ?? []) {
      const a = abilities[an];
      if (a?.dname && a.img) m.set(a.dname.toLowerCase(), `${CDN}${a.img}`);
    }
    heroDnameToImg.set(heroName, m);
  }

  const misses = new Set<string>();

  function resolveRef(ref: string): string | null {
    if (ref.startsWith("item:")) return itemIconUrl(ref.slice(5));
    if (ref.startsWith("ability:")) return abilityImg(abilities, ref.slice(8));
    return null;
  }

  return {
    misses,
    resolve(heroInternalName: string, headline: string): string | null {
      // 1. Hero's own ability (offense entries).
      const own = heroDnameToImg.get(heroInternalName);
      const ownHit = own?.get(headline.toLowerCase());
      if (ownHit) return ownHit;
      // 2. Curated fallback.
      const ref = HEADLINE_ICON[headline];
      if (ref) {
        const url = resolveRef(ref);
        if (url) return url;
      }
      misses.add(headline);
      return null;
    },
  };
}

// ---- Disk cache so offline rebuilds resolve icons too ----

const abilitiesCacheFile = path.join(config.dataDir, ".cache", "abilities.json");
const heroAbilitiesCacheFile = path.join(config.dataDir, ".cache", "heroAbilities.json");

export async function saveAbilityConstantsCache(
  abilities: AbilitiesConstant,
  heroAbilities: HeroAbilitiesConstant,
): Promise<void> {
  await fs.mkdir(path.dirname(abilitiesCacheFile), { recursive: true });
  await fs.writeFile(abilitiesCacheFile, JSON.stringify(abilities), "utf8");
  await fs.writeFile(heroAbilitiesCacheFile, JSON.stringify(heroAbilities), "utf8");
}

export async function loadAbilityConstantsCache(): Promise<{
  abilities: AbilitiesConstant;
  heroAbilities: HeroAbilitiesConstant;
} | null> {
  try {
    const abilities = JSON.parse(await fs.readFile(abilitiesCacheFile, "utf8")) as AbilitiesConstant;
    const heroAbilities = JSON.parse(
      await fs.readFile(heroAbilitiesCacheFile, "utf8"),
    ) as HeroAbilitiesConstant;
    return { abilities, heroAbilities };
  } catch {
    return null;
  }
}
