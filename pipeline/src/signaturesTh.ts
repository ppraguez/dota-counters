/**
 * Thai translations of the curated "signature" phrases in signatures.ts.
 *
 * Same keys, same grammatical role (a predicate that reads after the hero name), but written in
 * natural Thai. Ability names (Counter Helix, Black Hole, …), hero names, and item names are kept
 * in English on purpose — only the surrounding description is translated. Any hero without a Thai
 * signature falls back to the generic Thai templates in reasonsTh.ts.
 */
import type { HeroSignature } from "./signatures.js";

export const SIGNATURES_TH: Record<string, HeroSignature> = {
  axe: {
    threat: "ลงโทษศัตรูสายประชิดด้วย Counter Helix และบังคับเปิดการต่อสู้ด้วย Berserker's Call",
    setup: "ดึงศัตรูเข้า Berserker's Call ให้ทีมรุมลงดาเมจ",
  },
  antimage: {
    threat: "เผามานาของฮีโร่ที่พึ่งสกิลและ blink หนีจากอันตราย",
    weakness: "ต้นเกมตัวบางและกลัวการโดนล็อก",
  },
  crystal_maiden: {
    setup: "ปล่อยสตันระยะไกลและเติมมานาให้ทีม",
    weakness: "เดินช้า ตัวบาง และตายง่ายเมื่อโดนจับได้",
  },
  lina: {
    threat: "ลบเป้าหมายตัวบางด้วยเบิร์สต์เดี่ยวที่รุนแรง",
    setup: "ตามหลังสตันด้วยเบิร์สต์เวทย์และกายภาพมหาศาล",
    weakness: "ตัวเปราะและตายไวเมื่อโดนล็อกตั้งแต่ต้นเกม",
  },
  lion: {
    threat: "ร้อยสองสกิลคุมก่อนปิดจ๊อบด้วย Finger of Death ระยะประชิด",
    setup: "มีสกิลคุมที่ไว้ใจได้เพื่อเปิดการเก็บคิล",
    weakness: "ตัวบางมากและไม่มีสกิลหนี",
  },
  juggernaut: {
    threat: "กันการคุมระหว่าง Blade Fury และ Omnislash เพื่อเลี่ยงการแกงค์",
    weakness: "ถูกไคต์และเบิร์สต์ได้ก่อนที่ Omnislash จะพร้อม",
  },
  pudge: {
    threat: "ลากเป้าหมายออกจากตำแหน่งด้วย Hook และ Dismember",
    setup: "ลากเป้าหมายสำคัญเข้าหาทีมด้วย Meat Hook",
  },
  invoker: {
    threat: "คอมโบ Sun Strike, Meteor และสตันต่อเนื่องเพื่อเบิร์สต์ AoE มหาศาล",
    weakness: "ขึ้นช้าและเสี่ยงต่อการโดนกดดันตั้งแต่ต้นเกม",
  },
  phantom_assassin: {
    threat: "blink เข้าหาแครรี่และคริติคอลเก็บก่อนที่จะตั้งตัวทัน",
    weakness: "ถูกเคาน์เตอร์ด้วยเกราะ การล้าง evasion และเบิร์สต์ก่อนมีของ",
  },
  legion_commander: {
    threat: "บังคับ 1v1 ที่หนีไม่ได้ด้วย Duel และสะสมดาเมจให้พุ่ง",
    weakness: "ถูกไคต์และเบิร์สต์ได้เมื่อ Duel ติดคูลดาวน์",
  },
  nevermore: {
    threat: "ลดเกราะและเบิร์สต์เป้าหมายด้วยพลัง Souls ที่สะสมไว้",
    weakness: "ตัวเปราะและถูกขัดจังหวะอัลติได้ง่าย",
  },
  sven: {
    threat: "สตันแล้วฟันโดนทั้งทีมในช่วง God's Strength",
    setup: "เปิดการต่อสู้ด้วย Storm Hammer ให้เพื่อนตามเก็บ",
  },
  tidehunter: {
    threat: "พลิกการต่อสู้ด้วยสตัน AoE จาก Ravage และทนรับดาเมจ",
    setup: "ลง Ravage โดนหลายเป้าให้เพื่อนตามเก็บทันที",
  },
  enigma: {
    threat: "จับศัตรูที่รวมกลุ่มด้วย Black Hole ให้ทีมรุมลบ",
    setup: "ร่าย AoE คุมขนาดใหญ่เพื่อให้ทีมตามลงดาเมจ",
    weakness: "ทำอะไรไม่ได้ถ้าถูกขัดก่อนปล่อย Black Hole",
  },
  faceless_void: {
    threat: "หยุดเวลาการต่อสู้ด้วย Chronosphere และหลบดาเมจด้วย Time Walk",
    setup: "ขังศัตรูหลายตัวใน Chronosphere ให้ทีมเบิร์สต์",
  },
  earthshaker: {
    threat: "คอมโบ Echo Slam หลัง blink เพื่อล้างทีมที่รวมกลุ่ม",
    setup: "เปิดด้วย Fissure และ Echo Slam เพื่อเบิร์สต์ตามมหาศาล",
  },
  tiny: {
    threat: "Toss และสตันเป้าหมายเดี่ยวเพื่อเบิร์สต์ทันที",
    setup: "Toss ศัตรูเข้าหาทีมและสตันให้ตามเก็บ",
  },
  bane: {
    threat: "ถอดฮีโร่หนึ่งตัวออกจากการต่อสู้ได้ด้วย Fiend's Grip",
    setup: "คุมเป้าหมายสำคัญไว้ตลอดการตีทีม",
  },
  witch_doctor: {
    setup: "ล็อกเป้าด้วย Maledict และ Paralyzing Cask สตันให้ตามเก็บ",
    weakness: "ตัวบางและถูกเก็บง่ายเมื่อโดนโฟกัส",
  },
  zuus: {
    threat: "กดเลือดทั้งทีมศัตรูด้วยสกิลเวทย์ที่แทบไม่มีทางเลี่ยง",
    weakness: "ไม่มีสกิลหนีและตายให้กับฮีโร่ที่เข้าระยะได้ไว",
  },
  sniper: {
    threat: "เก็บคิลจากระยะไกลมากก่อนที่สายประชิดจะเข้าถึง",
    weakness: "ไม่มีสกิลหนีและตายทันทีเมื่อโดนเข้าระยะ",
  },
  drow_ranger: {
    threat: "ไคต์สายประชิดด้วยไซเลนซ์ Gust และดาเมจกายภาพระยะไกล",
    weakness: "ทำอะไรไม่ได้เมื่อโดนเข้าระยะ และออร่าหายเมื่ออยู่ใกล้ศัตรู",
  },
  bloodseeker: {
    threat: "ลงโทษฮีโร่ที่วิ่งหนีหรือร่ายสกิลด้วย Rupture และ Thirst",
    weakness: "พึ่ง Rupture และถูกล็อกได้ก่อนที่จะแรงขึ้น",
  },
  spirit_breaker: {
    threat: "Charge ข้ามแมพเพื่อสตันและแยกเป้าหมายเดี่ยว",
    setup: "เปิดการต่อสู้ด้วยสตันระยะไกลจาก Charge ที่การันตี",
  },
  slardar: {
    threat: "blink เข้าไปสตันและลดเกราะเพื่อเพิ่มดาเมจกายภาพ",
    setup: "ลดเกราะเป้าหมายด้วย Corrosive Haze ให้แครรี่",
  },
  ursa: {
    threat: "ละลายเป้าหมายเดี่ยวด้วย Fury Swipes ที่สะสมเมื่อจับเป้าได้",
    weakness: "ถูกไคต์ได้ง่ายและไม่มีทางแก้เมื่อโดนคุมจากระยะไกล",
  },
  bristleback: {
    threat: "ทนดาเมจจากด้านหน้าและสโนว์บอลด้วยสแต็ก Quill",
    weakness: "ลำบากเมื่อเจอเบิร์สต์เวทย์และดาเมจแบบเปอร์เซ็นต์",
  },
  huskar: {
    threat: "ไดฟ์ฮีโร่เลือดน้อยและยิ่งเลือดน้อยยิ่งแรง",
    weakness: "ละลายเมื่อเจอ pure damage และเอฟเฟกต์ Break อย่าง Silver Edge",
  },
  viper: {
    threat: "สโลว์และลดเกราะ ชนะการเทรดในเลนช่วงต้นเกมทุกครั้ง",
    weakness: "เดินช้าและไม่มีสกิลหนีเมื่อศัตรูมีของเพิ่มความคล่องตัว",
  },
  windrunner: {
    threat: "ล็อกเป้าหมายเดี่ยวด้วย Shackleshot แล้วโฟกัสเก็บ",
    setup: "รูทเป้าหมายสำคัญด้วย Shackleshot ให้ทีมเก็บ",
  },
  templar_assassin: {
    threat: "เบิร์สต์ฮีโร่ตัวบางผ่านการไดฟ์ที่มี Refraction ป้องกัน",
    weakness: "ถูกกดด้วยการเปิดแมพและ AoE ที่ลอก Refraction",
  },
  queenofpain: {
    threat: "blink เข้ามาเบิร์สต์เป้าหมายแล้ว blink ออกก่อนโดนสวน",
    weakness: "ตัวเปราะและตายให้กับการคุมที่ตรึงอยู่กับที่",
  },
  storm_spirit: {
    threat: "ซิ่งทั่วแมพด้วย Ball Lightning เพื่อเก็บคนที่หลุดกลุ่ม",
    weakness: "พึ่งมานาและถูกเบิร์สต์ได้ก่อนจะเริ่มออกตัว",
  },
  doom_bringer: {
    threat: "ไซเลนซ์และปลดอาวุธฮีโร่สำคัญนานถึง 16 วินาทีด้วย Doom",
    setup: "ถอดฮีโร่หนึ่งตัวออกจากการต่อสู้ทั้งหมดด้วย Doom",
  },
  silencer: {
    threat: "ปิดทีมที่พึ่งสกิลด้วย Global Silence",
    setup: "ตัดคอมโบของศัตรูด้วยไซเลนซ์ทั้งแมพ",
  },
  skywrath_mage: {
    threat: "ลบฮีโร่ตัวบางด้วยเบิร์สต์เวทย์ที่ซ้อนกันและไซเลนซ์",
    setup: "ไซเลนซ์และเพิ่มดาเมจเวทย์เพื่อปิดการเก็บคิล",
    weakness: "เป็นหนึ่งในฮีโร่ที่ตัวบางที่สุดและตายให้กับการคุมทุกชนิด",
  },
  rubick: {
    threat: "ขโมยสกิลที่ดีที่สุดของศัตรูมาใช้สวนกลับ",
    setup: "ยกเป้าหมายด้วย Telekinesis เพื่อเปิดให้ทีมตามเก็บ",
  },
  magnataur: {
    threat: "Reverse Polarity สตันทีมที่รวมกลุ่มเพื่อล้างทั้งทีมแบบการันตี",
    setup: "รวบและสตันทีมศัตรูด้วย Reverse Polarity",
  },
  tusk: {
    setup: "กลิ้งเข้ามา ต่อยเป้าหมายถอยและขังไว้ให้ทีม",
    threat: "แยกเป้าหมายด้วย Snowball และ Walrus Punch",
  },
  necrolyte: {
    threat: "อึดกว่าศัตรูและปิดจ๊อบฮีโร่เลือดน้อยด้วย Reaper's Scythe",
    weakness: "เดินช้าและถูกไคต์ได้ง่ายก่อนที่จะแรงขึ้น",
  },
  dazzle: {
    setup: "ช่วยเพื่อนไม่ให้ตายด้วย Shallow Grave และลดเกราะด้วย Weave",
    weakness: "ตัวบางและต้องถูกเก็บก่อนที่จะเซฟแครรี่ได้",
  },
  omniknight: {
    setup: "เซฟเพื่อนด้วย Guardian Angel และฮีลจาก Purification",
    threat: "ทำให้แครรี่ภูมิคุ้มกันดาเมจกายภาพระหว่างการต่อสู้",
  },
  wisp: {
    setup: "เทเลพอร์ตคอร์เข้าการต่อสู้และฮีลเกินด้วย Tether",
  },
  warlock: {
    setup: "มัดศัตรูเข้าด้วยกันและปล่อย Golem ลงกลางวง",
    threat: "ขยายความเสียหายในการต่อสู้ที่รวมกลุ่มด้วย Fatal Bonds และ Golem",
  },
  jakiro: {
    threat: "กันทีมศัตรูออกจากออบเจกทีฟด้วยดาเมจ AoE ที่ซ้อนกัน",
    setup: "สตันและสโลว์ทีมศัตรูที่รวมกลุ่มด้วย Macropyre และ Ice Path",
  },
  disruptor: {
    setup: "ขังศัตรูใน Static Storm และ Kinetic Field เพื่อคอมโบแบบการันตี",
    threat: "ไซเลนซ์และตรึงทั้งทีมไว้ใน Static Storm",
  },
  centaur: {
    threat: "blink เข้ามาด้วย Hoof Stomp และสะท้อนดาเมจใส่ผู้โจมตี",
    setup: "เปิดด้วยสตัน AoE จาก Hoof Stomp ให้ทีมตามเก็บ",
  },
  sand_king: {
    threat: "blink เข้ามาด้วย Epicenter AoE และสตันจาก Burrowstrike",
    setup: "สตันทีมที่รวมกลุ่มด้วย Burrowstrike ให้ทีมตามเก็บ",
  },
  spectre: {
    threat: "ลงโทษการตีทีมด้วยแรงกดดันจาก Haunt ทั้งแมพและดาเมจที่พุ่งขึ้นเรื่อย ๆ",
    weakness: "อ่อนแอช่วงต้นเกมและถูกกดได้ก่อนที่จะฟาร์มขึ้น",
  },
  medusa: {
    threat: "อึดในการต่อสู้กายภาพด้วย Mana Shield และ Stone Gaze",
    weakness: "เคลื่อนที่ช้าและตายให้กับเบิร์สต์เวทย์และการคุม",
  },
  troll_warlord: {
    threat: "DPS เหนือกว่าแครรี่ตัวอื่นและปลดการคุมตัวเองด้วย Battle Trance",
    weakness: "เป็นสายประชิดที่ไม่มีสกิลหนีและตายให้กับการไคต์และการคุม",
  },
  life_stealer: {
    threat: "ไดฟ์และไล่ล่าด้วยภูมิคุ้มกันจาก Rage และดาเมจแบบเปอร์เซ็นต์",
    weakness: "เป็นสายประชิดล้วนและถูกไคต์ด้วยสโลว์และการถอย",
  },
  terrorblade: {
    threat: "ลดเกราะด้วยอิลลูชันและการตีจาก Metamorphosis",
    weakness: "ต้นเกมตัวเปราะมากและตายให้กับการแกงค์ก่อนมีของ",
  },
  weaver: {
    threat: "ย้อนเวลาด้วย Time Lapse เพื่อหลบเบิร์สต์และกวนจากระยะไกล",
    weakness: "ตายให้กับการเปิดแมพและ AoE ที่จับได้ตอนหลุด Shukuchi",
  },
};
