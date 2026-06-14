/**
 * Thai port of reasons.ts. The branch logic is IDENTICAL to the English engine — the same rule
 * fires for the same hero pair — only the emitted text is Thai. Hero names are interpolated as-is
 * (they're already English display names), so they stay in English inside the Thai sentence, which
 * is exactly what we want. Keep this file's rule order in lockstep with reasons.ts.
 */
import type { HeroTags } from "./heroTags.js";
import { heroSlug } from "./config.js";
import { SIGNATURES_TH } from "./signaturesTh.js";
import type { HeroSignature } from "./signatures.js";

function sig(t: HeroTags): HeroSignature {
  return SIGNATURES_TH[heroSlug(t.name)] ?? {};
}

// ---- Generic predicates (read as "{HeroName} {predicate}") ----

function genericThreat(t: HeroTags): string {
  if (t.burstThreat) return "เบิร์สต์เป้าหมายให้ตายด้วยสกิลเวทย์";
  if (t.physicalCarry) return "บดขยี้ศัตรูด้วยดาเมจกายภาพต่อเนื่อง";
  if (t.hasLockdown) return "ร้อยสกิลคุมเพื่อควบคุมการต่อสู้";
  if (t.isDurable) return "ถึกกว่าและยืนระยะในการต่อสู้ที่ยืดเยื้อ";
  if (t.isInitiator) return "เปิดการต่อสู้ได้เปรียบด้วยการบุกที่หนักหน่วง";
  if (t.mobile) return "เลือกเข้าตีเฉพาะจังหวะที่ได้เปรียบและหนีรอดได้";
  if (t.isSupport) return "พลิกการต่อสู้ด้วยสกิลซัพพอร์ตและการคุม";
  if (t.isPusher) return "กดดันเลนและป้อมอย่างต่อเนื่อง";
  return "ค่อย ๆ เก็บความได้เปรียบในแมตช์อัพนี้";
}

function genericWeakness(t: HeroTags): string {
  if (t.squishy) return "ตัวบางและถูกเก็บได้ไวมาก";
  if (t.isCarry && t.isMelee && !t.mobile) return "เป็นสายประชิดที่ไม่มีสกิลหนีและถูกไคต์ได้ง่าย";
  if (t.isCarry && !t.mobile) return "พึ่งการฟาร์มและลำบากเมื่อถูกกดตั้งแต่ต้นเกม";
  if (!t.isDurable) return "ตัวเปราะเมื่อโดนโฟกัส";
  if (t.mobile) return "เสี่ยงตายเมื่อสกิลหนีและคูลดาวน์หมด";
  return "เคลื่อนที่ช้าและถูกไคต์ได้"; // durable + immobile
}

function genericSetup(t: HeroTags): string {
  if (t.isDisabler || t.hasLockdown) return "ล็อกเป้าหมายให้อยู่กับที่";
  if (t.isInitiator) return "เปิดการต่อสู้ในจังหวะที่ได้เปรียบ";
  if (t.isSupport) return "คอยปกป้องและซัพพอร์ตทีม";
  if (t.isNuker) return "เสริมดาเมจเบิร์สต์ให้ทีม";
  if (t.isDurable) return "เปิดพื้นที่ด้านหน้าให้ทีม";
  return "มีส่วนร่วมในการต่อสู้";
}

function damageNoun(t: HeroTags): string {
  if (t.burstThreat) return "ดาเมจเวทย์เบิร์สต์";
  if (t.physicalCarry) return "ดาเมจกายภาพต่อเนื่อง";
  if (t.isNuker) return "ดาเมจจากสกิล";
  return "ดาเมจตาม";
}

const threatOf = (t: HeroTags): string => sig(t).threat ?? genericThreat(t);
const weaknessOf = (t: HeroTags): string => sig(t).weakness ?? genericWeakness(t);
const setupOf = (t: HeroTags): string => sig(t).setup ?? genericSetup(t);

// ---------------------------------------------------------------------------
// Counters
// ---------------------------------------------------------------------------

interface CounterRule {
  when: (w: HeroTags, l: HeroTags) => boolean;
  make: (w: HeroTags, l: HeroTags) => string;
}

/** Ordered most-specific first; the first matching rule wins. Mirrors COUNTER_RULES in reasons.ts. */
const COUNTER_RULES: CounterRule[] = [
  {
    when: (w, l) => w.hasLockdown && l.mobile,
    make: (w, l) => `${w.localizedName} ${threatOf(w)} และการล็อกตัดทางหนีของ ${l.localizedName}`,
  },
  {
    when: (w, l) => w.burstThreat && l.squishy,
    make: (w, l) => `${w.localizedName} ${threatOf(w)} — ${l.localizedName} ${weaknessOf(l)}`,
  },
  {
    when: (w, l) => w.isDurable && l.physicalCarry,
    make: (w, l) =>
      `${w.localizedName} ${threatOf(w)} รับดาเมจกายภาพของ ${l.localizedName} ไว้และชนะในการต่อสู้ที่ยืดเยื้อ`,
  },
  {
    when: (w, l) => w.isDurable && w.isMelee && l.isMelee && l.isCarry,
    make: (w, l) =>
      `${w.localizedName} ${threatOf(w)} และเทรดดาเมจชนะ ${l.localizedName} ในระยะประชิด`,
  },
  {
    when: (w, l) => w.hasLockdown && l.isCarry,
    make: (w, l) =>
      `${w.localizedName} ${threatOf(w)} และกด ${l.localizedName} ไม่ให้ขึ้นมาเป็นแครรี่ได้`,
  },
  {
    when: (w, l) => w.mobile && (l.squishy || (!l.mobile && l.isCarry)),
    make: (w, l) => `${w.localizedName} ${threatOf(w)} ส่วน ${l.localizedName} ${weaknessOf(l)}`,
  },
  {
    when: (w, l) => w.isRanged && l.isMelee && !l.mobile,
    make: (w, l) => `${w.localizedName} เล่นรักษาระยะ ขณะที่ ${l.localizedName} ${weaknessOf(l)}`,
  },
];

const COUNTER_FALLBACK = (w: HeroTags, l: HeroTags): string =>
  `${w.localizedName} ${threatOf(w)} ขณะที่ ${l.localizedName} ${weaknessOf(l)}`;

export function counterReasonTh(winner: HeroTags, loser: HeroTags): string {
  for (const rule of COUNTER_RULES) {
    if (rule.when(winner, loser)) return rule.make(winner, loser);
  }
  return COUNTER_FALLBACK(winner, loser);
}

// ---------------------------------------------------------------------------
// Synergies
// ---------------------------------------------------------------------------

function setupScore(t: HeroTags): number {
  return (
    (t.isDisabler ? 2 : 0) +
    (t.isInitiator ? 2 : 0) +
    (t.isSupport ? 1 : 0) +
    (t.hasLockdown ? 1 : 0)
  );
}

export function synergyReasonTh(a: HeroTags, b: HeroTags): string {
  const [setter, follower] = setupScore(a) >= setupScore(b) ? [a, b] : [b, a];

  if (a.isPusher && b.isPusher) {
    return `${a.localizedName} และ ${b.localizedName} เก่งเรื่องผลักเลนทั้งคู่ เก็บป้อมและออบเจกทีฟได้ก่อนที่ศัตรูจะรวมตัว`;
  }

  if (setter.isInitiator && (follower.isNuker || follower.burstThreat)) {
    return `${setter.localizedName} ${setupOf(setter)} เปิดโอกาสให้ ${follower.localizedName} ลง${damageNoun(follower)}ใส่ศัตรูที่รวมกลุ่มกัน`;
  }

  if (setter.hasLockdown && (follower.burstThreat || follower.isNuker || follower.isCarry)) {
    return `${setter.localizedName} ${setupOf(setter)} แล้ว ${follower.localizedName} ตามด้วย${damageNoun(follower)}`;
  }

  if (setter.isSupport && follower.isCarry) {
    return `${setter.localizedName} ${setupOf(setter)} ให้ ${follower.localizedName} ฟาร์มได้อย่างปลอดภัยและสเกลขึ้นเป็นฮาร์ดแครรี่`;
  }

  if (a.frontline !== b.frontline && (a.squishy || b.squishy)) {
    const front = a.frontline ? a : b;
    const back = a.frontline ? b : a;
    return `${front.localizedName} ยืนรับแถวหน้า เปิดให้ ${back.localizedName} ปล่อยดาเมจจากด้านหลังได้อย่างปลอดภัย`;
  }

  return `${setter.localizedName} ${setupOf(setter)} และ ${follower.localizedName} เสริม${damageNoun(follower)} ช่วยกลบจุดอ่อนของกันและกัน`;
}
