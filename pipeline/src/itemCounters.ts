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
  /** Thai translation of `reason` (item/hero names kept in English). */
  reason_th: string;
}

interface Rule {
  key: ItemKey;
  priority: number;
  reason: string;
  reason_th: string;
}

/** Build the counter-item list for one hero (highest-priority first, capped by caller). */
export function buildItemCounters(t: HeroTags, max: number): ItemCounter[] {
  const m = getMechanics(t);
  const H = t.localizedName;
  const rules: Rule[] = [];
  const add = (
    cond: boolean,
    key: ItemKey,
    priority: number,
    reason: string,
    reason_th: string,
  ): void => {
    if (cond) rules.push({ key, priority, reason, reason_th });
  };

  // Detection trumps everything else against an invisible hero.
  add(m.invis, "dust", 98,
    `Dust of Appearance reveals ${H} through invisibility.`,
    `Dust of Appearance เปิดเผย ${H} ที่ล่องหนอยู่`);
  // Evasion makes physical damage whiff until you have true strike.
  add(m.evasion, "mkb", 96,
    `Monkey King Bar's true strike pierces ${H}'s evasion.`,
    `true strike ของ Monkey King Bar เจาะ evasion ของ ${H}`);
  // A single big disable is neutralised by a block/reflect.
  add(m.bigDisable, "linkens", 94,
    `Linken's Sphere blocks ${H}'s key single-target spell.`,
    `Linken's Sphere บล็อกสกิลเดี่ยวสำคัญของ ${H}`);
  add(m.magicBurst || m.aoeMagic, "bkb", 92,
    `Black King Bar's spell immunity ignores ${H}'s magic damage and disables.`,
    `ภูมิคุ้มกันเวทย์ของ Black King Bar กันดาเมจเวทย์และการคุมของ ${H}`);
  // Break removes the passive that makes some heroes work at all.
  add(m.passive, "silver_edge", 90,
    `Silver Edge's Break shuts off ${H}'s passive abilities.`,
    `Break ของ Silver Edge ปิดสกิล passive ของ ${H}`);
  add(m.sustain, "spirit_vessel", 88,
    `Spirit Vessel cuts ${H}'s healing and regeneration.`,
    `Spirit Vessel ลดการฮีลและการฟื้นเลือดของ ${H}`);
  add(m.illusions || m.summons, "mjollnir", 86,
    `Mjollnir / Maelstrom's chain lightning clears ${H}'s ${m.illusions ? "illusions" : "summons"}.`,
    `chain lightning ของ Mjollnir / Maelstrom ล้าง${m.illusions ? "อิลลูชัน" : "ลูกสมุน"}ของ ${H}`);
  add(m.bigDisable, "lotus", 80,
    `Lotus Orb reflects and dispels ${H}'s targeted disable.`,
    `Lotus Orb สะท้อนและดิสเพลการคุมแบบเจาะเป้าของ ${H}`);
  add(m.aoeMagic, "pipe", 78,
    `Pipe of Insight shields your team from ${H}'s AoE magic damage.`,
    `Pipe of Insight กันทีมจากดาเมจเวทย์ AoE ของ ${H}`);
  add(m.channel, "euls", 76,
    `Eul's Scepter (or any stun) interrupts ${H}'s channelled spell.`,
    `Eul's Scepter (หรือสตันใด ๆ) ขัดจังหวะสกิลที่ต้องร่ายค้างของ ${H}`);
  add(m.physical && t.isMelee, "halberd", 74,
    `Heaven's Halberd disarms melee ${H} for several seconds.`,
    `Heaven's Halberd ปลดอาวุธ ${H} สายประชิดได้หลายวินาที`);
  add(m.physical, "ghost", 72,
    `Ghost Scepter makes you immune to ${H}'s physical attacks.`,
    `Ghost Scepter ทำให้คุณภูมิคุ้มกันการโจมตีกายภาพของ ${H}`);
  add(m.magicBurst && !m.aoeMagic, "glimmer", 70,
    `Glimmer Cape's magic resistance and fade help dodge ${H}'s burst.`,
    `ความต้านทานเวทย์และการล่องหนของ Glimmer Cape ช่วยหลบเบิร์สต์ของ ${H}`);
  add(m.sustain && m.physical, "skadi", 66,
    `Eye of Skadi's healing reduction cripples ${H}'s lifesteal.`,
    `การลดการฮีลของ Eye of Skadi ตัดพลัง lifesteal ของ ${H}`);
  add(m.physical && t.isMelee, "force_staff", 60,
    `Force Staff creates distance from melee ${H}.`,
    `Force Staff สร้างระยะห่างจาก ${H} สายประชิด`);
  add(m.physical && !m.illusions, "assault", 58,
    `Assault Cuirass's armor aura blunts ${H}'s physical damage.`,
    `ออร่าเกราะของ Assault Cuirass ลดทอนดาเมจกายภาพของ ${H}`);

  // Highest priority first; de-dupe by item key (no key is added twice today, but be safe).
  rules.sort((a, b) => b.priority - a.priority);
  const seen = new Set<ItemKey>();
  const out: ItemCounter[] = [];
  for (const r of rules) {
    if (seen.has(r.key)) continue;
    seen.add(r.key);
    out.push({
      item: ITEMS[r.key].dname,
      icon_url: itemIconUrl(ITEMS[r.key].slug),
      reason: r.reason,
      reason_th: r.reason_th,
    });
    if (out.length >= max) break;
  }
  return out;
}
