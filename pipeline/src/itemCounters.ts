/**
 * Rules engine that maps a hero's mechanics to the items that counter it.
 *
 * These relationships are established Dota knowledge, not statistics:
 *   - Black King Bar  → ignores magic damage & disables
 *   - Linken's / Lotus → block or reflect a key single-target spell
 *   - Monkey King Bar → true strike beats evasion
 *   - Silver Edge     → Break disables passives
 *   - Spirit Vessel / Skadi → slice through healing & regen
 *   - Dust / Sentry   → reveal invisibility
 *   - Mjollnir        → chain lightning clears illusions/summons
 *   - Ghost / Halberd / Assault → blunt or disarm physical right-click
 *   - Eul's           → interrupt a channel
 * Each hero gets the few most relevant of these, with a reason that names the hero.
 */
import type { HeroTags } from "./heroTags.js";
import { getMechanics } from "./heroMechanics.js";

const ITEM_ICON_BASE =
  "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items";

const ITEMS = {
  bkb: { dname: "Black King Bar", slug: "black_king_bar" },
  linkens: { dname: "Linken's Sphere", slug: "sphere" },
  lotus: { dname: "Lotus Orb", slug: "lotus_orb" },
  mkb: { dname: "Monkey King Bar", slug: "monkey_king_bar" },
  silver_edge: { dname: "Silver Edge", slug: "silver_edge" },
  spirit_vessel: { dname: "Spirit Vessel", slug: "spirit_vessel" },
  skadi: { dname: "Eye of Skadi", slug: "skadi" },
  ghost: { dname: "Ghost Scepter", slug: "ghost" },
  halberd: { dname: "Heaven's Halberd", slug: "heavens_halberd" },
  force_staff: { dname: "Force Staff", slug: "force_staff" },
  euls: { dname: "Eul's Scepter", slug: "cyclone" },
  pipe: { dname: "Pipe of Insight", slug: "pipe" },
  glimmer: { dname: "Glimmer Cape", slug: "glimmer_cape" },
  dust: { dname: "Dust of Appearance", slug: "dust" },
  assault: { dname: "Assault Cuirass", slug: "assault" },
  mjollnir: { dname: "Mjollnir", slug: "mjollnir" },
} as const;

type ItemKey = keyof typeof ITEMS;

export function itemIconUrl(slug: string): string {
  return `${ITEM_ICON_BASE}/${slug}.png`;
}

export interface ItemCounter {
  item: string;
  icon_url: string;
  reason: string;
}

interface Rule {
  key: ItemKey;
  priority: number;
  reason: string;
}

/** Build the counter-item list for one hero (highest-priority first, capped by caller). */
export function buildItemCounters(t: HeroTags, max: number): ItemCounter[] {
  const m = getMechanics(t);
  const H = t.localizedName;
  const rules: Rule[] = [];
  const add = (cond: boolean, key: ItemKey, priority: number, reason: string): void => {
    if (cond) rules.push({ key, priority, reason });
  };

  // Detection trumps everything else against an invisible hero.
  add(m.invis, "dust", 98, `Dust of Appearance reveals ${H} through invisibility.`);
  // Evasion makes physical damage whiff until you have true strike.
  add(m.evasion, "mkb", 96, `Monkey King Bar's true strike pierces ${H}'s evasion.`);
  // A single big disable is neutralised by a block/reflect.
  add(m.bigDisable, "linkens", 94, `Linken's Sphere blocks ${H}'s key single-target spell.`);
  add(m.magicBurst || m.aoeMagic, "bkb", 92, `Black King Bar's spell immunity ignores ${H}'s magic damage and disables.`);
  // Break removes the passive that makes some heroes work at all.
  add(m.passive, "silver_edge", 90, `Silver Edge's Break shuts off ${H}'s passive abilities.`);
  add(m.sustain, "spirit_vessel", 88, `Spirit Vessel cuts ${H}'s healing and regeneration.`);
  add(m.illusions || m.summons, "mjollnir", 86, `Mjollnir / Maelstrom's chain lightning clears ${H}'s ${m.illusions ? "illusions" : "summons"}.`);
  add(m.bigDisable, "lotus", 80, `Lotus Orb reflects and dispels ${H}'s targeted disable.`);
  add(m.aoeMagic, "pipe", 78, `Pipe of Insight shields your team from ${H}'s AoE magic damage.`);
  add(m.channel, "euls", 76, `Eul's Scepter (or any stun) interrupts ${H}'s channelled spell.`);
  add(m.physical && t.isMelee, "halberd", 74, `Heaven's Halberd disarms melee ${H} for several seconds.`);
  add(m.physical, "ghost", 72, `Ghost Scepter makes you immune to ${H}'s physical attacks.`);
  add(m.magicBurst && !m.aoeMagic, "glimmer", 70, `Glimmer Cape's magic resistance and fade help dodge ${H}'s burst.`);
  add(m.sustain && m.physical, "skadi", 66, `Eye of Skadi's healing reduction cripples ${H}'s lifesteal.`);
  add(m.physical && t.isMelee, "force_staff", 60, `Force Staff creates distance from melee ${H}.`);
  add(m.physical && !m.illusions, "assault", 58, `Assault Cuirass's armor aura blunts ${H}'s physical damage.`);

  // Highest priority first; de-dupe by item key (no key is added twice today, but be safe).
  rules.sort((a, b) => b.priority - a.priority);
  const seen = new Set<ItemKey>();
  const out: ItemCounter[] = [];
  for (const r of rules) {
    if (seen.has(r.key)) continue;
    seen.add(r.key);
    out.push({ item: ITEMS[r.key].dname, icon_url: itemIconUrl(ITEMS[r.key].slug), reason: r.reason });
    if (out.length >= max) break;
  }
  return out;
}
