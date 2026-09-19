/**
 * Thai port of reasons.ts. The branch logic is IDENTICAL to the English engine — the same rule
 * fires for the same hero pair — only the emitted text is Thai. Hero names are interpolated as-is
 * (they're already English display names), so they stay in English inside the Thai sentence, which
 * is exactly what we want. Rule selection is shared with reasons.ts (counterRuleIndex); keep COUNTER_PHRASES_TH index-aligned with COUNTER_RULES there.
 */
import type { HeroTags } from "./heroTags.js";
import { heroSlug } from "./config.js";
import { SIGNATURES_TH } from "./signaturesTh.js";
import type { HeroSignature } from "./signatures.js";
import { counterRuleIndex, type ReasonOptions } from "./reasons.js";

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
// Rule selection is shared with reasons.ts via counterRuleIndex(), so EN and TH always pick the
// same rule. Each array below is index-aligned with COUNTER_RULES in reasons.ts; see that file
// for what winnerLed / loserLed / variant mean.

type Phrase = (w: HeroTags, l: HeroTags) => string;
interface PhraseSet {
  winnerLed: Phrase[];
  loserLed: Phrase[];
}

const N = (t: HeroTags): string => t.localizedName;

const COUNTER_PHRASES_TH: PhraseSet[] = [
  {
    // lockdown vs mobile
    winnerLed: [
      (w, l) => `${N(w)} ${threatOf(w)} และการล็อกตัดทางหนีของ ${N(l)}`,
      (w, l) => `${N(w)} ${threatOf(w)} ทำให้ ${N(l)} หนีไม่รอด`,
      (w, l) => `${N(w)} ${threatOf(w)} จับ ${N(l)} ได้ก่อนจะหนีทัน`,
    ],
    loserLed: [
      (w, l) => `${N(l)} พึ่งการเคลื่อนที่เอาตัวรอด แต่สกิลล็อกของ ${N(w)} จับได้ก่อนจะหนีทัน`,
      (w, l) => `สกิลคุมของ ${N(w)} ตรึง ${N(l)} ไว้กับที่ ตัดความคล่องตัวที่ ${N(l)} ต้องพึ่ง`,
      (w, l) => `${N(l)} ${weaknessOf(l)} และ ${N(w)} มีสกิลล็อกที่ใช้จุดนี้ได้เต็มที่`,
    ],
  },
  {
    // burst vs squishy
    winnerLed: [
      (w, l) => `${N(w)} ${threatOf(w)} — ${N(l)} ${weaknessOf(l)}`,
      (w, l) => `${N(w)} ${threatOf(w)} และ ${N(l)} ไม่รอดจากเบิร์สต์นั้น`,
      (w, l) => `${N(w)} ${threatOf(w)} ซึ่ง ${N(l)} เลือดน้อยเกินจะรับไหว`,
    ],
    loserLed: [
      (w, l) => `${N(l)} ${weaknessOf(l)} ซึ่งโดนเบิร์สต์ของ ${N(w)} ลงโทษหนัก`,
      (w, l) => `${N(w)} เบิร์สต์ ${N(l)} จากเลือดเต็มให้ตายได้ก่อนที่ ${N(l)} จะได้ทำอะไร`,
      (w, l) => `${N(l)} เลือดน้อยเกินกว่าจะรอดจากเบิร์สต์เวทย์ของ ${N(w)}`,
    ],
  },
  {
    // durable vs physical carry
    winnerLed: [
      (w, l) => `${N(w)} ${threatOf(w)} รับดาเมจกายภาพของ ${N(l)} ไว้และชนะในการต่อสู้ที่ยืดเยื้อ`,
      (w, l) => `${N(w)} ${threatOf(w)} และดาเมจกายภาพของ ${N(l)} ตีไม่เข้า`,
      (w, l) => `${N(w)} ${threatOf(w)} ยืนระยะได้นานกว่า ${N(l)} ในไฟต์ยาว`,
    ],
    loserLed: [
      (w, l) => `ดาเมจกายภาพของ ${N(l)} ตีไม่เข้าความถึกของ ${N(w)}`,
      (w, l) => `${N(w)} รับดาเมจกายภาพของ ${N(l)} ไว้ได้และชนะในไฟต์ที่ยืดเยื้อ`,
      (w, l) => `${N(l)} ต้องการไฟต์ยาวเพื่อทำดาเมจ แต่ ${N(w)} ยืนระยะในไฟต์แบบนั้นได้สบาย`,
    ],
  },
  {
    // durable melee vs melee carry
    winnerLed: [
      (w, l) => `${N(w)} ${threatOf(w)} และเทรดดาเมจชนะ ${N(l)} ในระยะประชิด`,
      (w, l) => `${N(w)} ${threatOf(w)} ชนะการตะลุมบอนกับ ${N(l)}`,
      (w, l) => `${N(w)} ${threatOf(w)} และ ${N(l)} สู้ไม่ได้ในระยะประชิด`,
    ],
    loserLed: [
      (w, l) => `${N(w)} เทรดดาเมจชนะ ${N(l)} ในระยะประชิด`,
      (w, l) => `${N(l)} ต้องสู้กับ ${N(w)} ในระยะประชิด ซึ่ง ${N(w)} ทั้งแรงกว่าและถึกกว่า`,
      (w, l) => `${N(l)} ${weaknessOf(l)} และ ${N(w)} ชนะการตะลุมบอนระยะประชิด`,
    ],
  },
  {
    // lockdown vs carry
    winnerLed: [
      (w, l) => `${N(w)} ${threatOf(w)} และกด ${N(l)} ไม่ให้ขึ้นมาเป็นแครรี่ได้`,
      (w, l) => `${N(w)} ${threatOf(w)} ทำให้ ${N(l)} ฟาร์มหรือสู้ได้ไม่สะดวก`,
      (w, l) => `${N(w)} ${threatOf(w)} และ ${N(l)} ฟาร์มผ่านแรงกดดันนี้ได้ยาก`,
    ],
    loserLed: [
      (w, l) => `สกิลคุมของ ${N(w)} ทำให้ ${N(l)} ฟาร์มหรือสู้กลับได้ไม่สะดวก`,
      (w, l) => `${N(l)} ${weaknessOf(l)} และสกิลล็อกของ ${N(w)} ทำให้ต้นเกมลำบากมาก`,
      (w, l) => `${N(w)} ร้อยสกิลคุมใส่ ${N(l)} ได้ก่อนที่ไอเทมของ ${N(l)} จะมาครบ`,
    ],
  },
  {
    // mobile pickoff vs squishy / immobile carry
    winnerLed: [
      (w, l) => `${N(w)} ${threatOf(w)} ส่วน ${N(l)} ${weaknessOf(l)}`,
      (w, l) => `${N(w)} ${threatOf(w)} จับ ${N(l)} ได้ตอนยืนผิดตำแหน่ง`,
      (w, l) => `${N(w)} ${threatOf(w)} ทำให้ ${N(l)} เป็นเป้าเก็บง่าย`,
    ],
    loserLed: [
      (w, l) => `${N(w)} จับ ${N(l)} ได้ตอนยืนผิดตำแหน่ง และ ${N(l)} ${weaknessOf(l)}`,
      (w, l) => `${N(l)} ${weaknessOf(l)} ทำให้เป็นเป้าเก็บง่ายสำหรับ ${N(w)}`,
      (w, l) => `${N(l)} หนีไม่พ้นเมื่อ ${N(w)} ตัดสินใจเข้าแกงค์`,
    ],
  },
  {
    // ranged vs immobile melee
    winnerLed: [
      (w, l) => `${N(w)} ${threatOf(w)} สู้จากระยะไกล ขณะที่ ${N(l)} ${weaknessOf(l)}`,
      (w, l) => `${N(w)} ${threatOf(w)} และ ${N(l)} เข้าประชิดได้ยาก`,
      (w, l) => `${N(w)} ${threatOf(w)} โดยอยู่นอกระยะของ ${N(l)}`,
    ],
    loserLed: [
      (w, l) => `${N(l)} ${weaknessOf(l)} ส่วน ${N(w)} สู้จากระยะไกลได้`,
      (w, l) => `${N(w)} ไคต์ ${N(l)} จากระยะไกล และ ${N(l)} เข้าประชิดได้ยาก`,
      (w, l) => `${N(l)} เข้าถึงตัว ${N(w)} ได้ยากเพราะ ${N(w)} สู้จากระยะไกล`,
    ],
  },
];

const COUNTER_FALLBACK_TH: PhraseSet = {
  winnerLed: [
    (w, l) => `${N(w)} ${threatOf(w)} ขณะที่ ${N(l)} ${weaknessOf(l)}`,
    (w, l) => `${N(w)} ${threatOf(w)} และ ${N(l)} ${weaknessOf(l)}`,
    (w, l) => `${N(w)} ${threatOf(w)} ส่วน ${N(l)} ${weaknessOf(l)}`,
  ],
  loserLed: [
    (w, l) => `${N(l)} ${weaknessOf(l)} และ ${N(w)} อยู่ในจุดที่ใช้ประโยชน์จากตรงนั้นได้`,
    (w, l) => `${N(w)} มักได้เปรียบในแมตช์นี้ เพราะ ${N(l)} ${weaknessOf(l)}`,
    (w, l) => `${N(l)} ${weaknessOf(l)} ซึ่งเข้าทางแผนการเล่นของ ${N(w)}`,
  ],
};

const pick = <T>(arr: T[], i: number): T => arr[((i % arr.length) + arr.length) % arr.length]!;

export function counterReasonTh(winner: HeroTags, loser: HeroTags, opts: ReasonOptions = {}): string {
  const idx = counterRuleIndex(winner, loser);
  const set = (idx >= 0 ? COUNTER_PHRASES_TH[idx] : undefined) ?? COUNTER_FALLBACK_TH;
  const list = opts.lead === "loser" ? set.loserLed : set.winnerLed;
  return pick(list, opts.variant ?? 0)(winner, loser);
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

/** Thai port of synergyReason in reasons.ts: `a` is the fixed hero, so `b` leads. */
export function synergyReasonTh(a: HeroTags, b: HeroTags, variant = 0): string {
  const [s, f] = setupScore(a) >= setupScore(b) ? [a, b] : [b, a];
  const fixedIsSetter = s === a;
  const v = variant % 2;

  if (a.isPusher && b.isPusher) {
    return v === 0
      ? `${N(b)} และ ${N(a)} เก่งเรื่องผลักเลนทั้งคู่ เก็บป้อมได้ก่อนที่ศัตรูจะรวมตัว`
      : `${N(b)} และ ${N(a)} ช่วยกันทุบป้อมได้เร็ว ก่อนที่ศัตรูจะทันรวมตัว`;
  }

  if (s.isInitiator && (f.isNuker || f.burstThreat)) {
    if (fixedIsSetter) {
      return v === 0
        ? `${N(f)} ลง${damageNoun(f)}ใส่ศัตรูที่ ${N(s)} เปิดไฟต์จับไว้`
        : `${N(f)} พร้อมปล่อย${damageNoun(f)}ทันทีที่ ${N(s)} เปิดไฟต์`;
    }
    return v === 0
      ? `${N(s)} ${setupOf(s)} เปิดโอกาสให้ ${N(f)} ลง${damageNoun(f)}ใส่ศัตรูที่รวมกลุ่มกัน`
      : `${N(s)} ${setupOf(s)} แล้ว ${N(f)} เก็บเกี่ยวด้วย${damageNoun(f)}`;
  }

  if (s.hasLockdown && (f.burstThreat || f.isNuker || f.isCarry)) {
    if (fixedIsSetter) {
      return v === 0
        ? `${N(f)} ตามด้วย${damageNoun(f)}ทุกครั้งที่ ${N(s)} ลงสกิลคุมได้`
        : `${N(f)} เปลี่ยนสกิลคุมของ ${N(s)} ให้เป็นคิลด้วย${damageNoun(f)}`;
    }
    return v === 0
      ? `${N(s)} ${setupOf(s)} แล้ว ${N(f)} ตามด้วย${damageNoun(f)}`
      : `${N(s)} ${setupOf(s)} เปิดจังหวะให้ ${N(f)} ลง${damageNoun(f)}ได้เต็มที่`;
  }

  if (s.isSupport && f.isCarry) {
    if (fixedIsSetter) {
      return v === 0
        ? `${N(f)} มีพื้นที่ฟาร์มและสเกลได้เต็มที่ โดยมี ${N(s)} คอยดูแลเลนให้ปลอดภัย`
        : `${N(f)} เล่นเก็บไอเทมได้เต็มที่ เพราะมี ${N(s)} คอยคุ้มกันเลน`;
    }
    return v === 0
      ? `${N(s)} ${setupOf(s)} ให้ ${N(f)} ฟาร์มได้อย่างปลอดภัยและสเกลขึ้นเป็นฮาร์ดแครรี่`
      : `${N(s)} ${setupOf(s)} ซื้อเวลาให้ ${N(f)} ได้ไอเทมท้ายเกม`;
  }

  if (a.frontline !== b.frontline && (a.squishy || b.squishy)) {
    const front = a.frontline ? a : b;
    const back = a.frontline ? b : a;
    if (front === a) {
      return v === 0
        ? `${N(back)} ปล่อยดาเมจจากด้านหลังได้อย่างปลอดภัย ขณะที่ ${N(front)} ยืนรับแถวหน้า`
        : `${N(back)} อยู่ห่างจากอันตรายได้ โดยมี ${N(front)} ยืนแถวหน้าให้`;
    }
    return v === 0
      ? `${N(front)} ยืนรับแถวหน้า เปิดให้ ${N(back)} ปล่อยดาเมจจากด้านหลังได้อย่างปลอดภัย`
      : `${N(front)} ดึงความสนใจของศัตรูไว้ ไม่ให้ไปลงที่ ${N(back)}`;
  }

  if (fixedIsSetter) {
    return v === 0
      ? `${N(f)} เสริม${damageNoun(f)}ต่อจากที่ ${N(s)} เปิดทางไว้ ช่วยกลบจุดอ่อนของกันและกัน`
      : `${N(f)} มี${damageNoun(f)}ที่การเปิดทางของ ${N(s)} ต้องการ`;
  }
  return v === 0
    ? `${N(s)} ${setupOf(s)} และ ${N(f)} เสริม${damageNoun(f)} ช่วยกลบจุดอ่อนของกันและกัน`
    : `${N(s)} ${setupOf(s)} เข้ากันดีกับ${damageNoun(f)}ของ ${N(f)}`;
}
