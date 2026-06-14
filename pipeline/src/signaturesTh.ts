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
  abaddon: {
    threat: "ทนการโฟกัสด้วย Aphotic Shield และ Borrowed Time",
    setup: "เกราะและฮีลให้เพื่อนด้วย Aphotic Shield",
  },
  alchemist: {
    threat: "สแต็ก Acid Spray และ Unstable Concoction พร้อมฟาร์มไวกว่าใคร",
    setup: "สตันด้วย Unstable Concoction และมอบ Aghanim's Scepter ให้เพื่อน",
  },
  ancient_apparition: {
    threat: "ยิงข้ามแมพด้วย Ice Blast และตัดการฮีลทั้งหมด",
    setup: "แช่แข็งเป้าด้วย Cold Feet แล้วทำให้แตกด้วย Ice Blast",
    weakness: "ตัวบางและเคลื่อนที่ช้าไม่มีสกิลหนี",
  },
  arc_warden: {
    threat: "แยกร่างเป็น Tempest Double เพื่อออกดาเมจสองเท่าจากระยะไกล",
    weakness: "อ่อนแอช่วงต้นเกมและตายถ้าโดนจับก่อนมีของ",
  },
  batrider: {
    threat: "ล็อกเป้าด้วย Flaming Lasso แล้วลากเข้าหาทีม",
    setup: "Flaming Lasso ลากเป้าหมายสำคัญออกจากตำแหน่งให้ทีม",
  },
  beastmaster: {
    threat: "เรียกเหยี่ยวและหมูป่า และล็อกเป้าด้วย Primal Roar",
    setup: "Primal Roar สตันและแยกเป้าหมายให้ทีมเก็บ",
  },
  bounty_hunter: {
    threat: "ตามรอยเป้าหมายทะลุการล่องหนและเบิร์สต์ด้วย Shuriken Toss",
    weakness: "อ่อนลงช่วงปลายเกมและพึ่งการสโนว์บอลช่วงต้น",
  },
  brewmaster: {
    threat: "แยกเป็นวิญญาณธาตุที่ไซโคลนและสตันระหว่าง Primal Split",
    setup: "ทำให้ทีมที่รวมกลุ่มอ่อนลงด้วย Cinder Brew และ Thunder Clap ก่อนแยกร่าง",
  },
  broodmother: {
    threat: "ถล่มเลนด้วยสไปเดอร์ลิงและใยแมงมุม",
    weakness: "อ่อนแอช่วงเลนต้นเกมและเสี่ยงต่อ AoE",
  },
  chaos_knight: {
    threat: "สตันด้วย Chaos Bolt และถล่มด้วยอิลลูชันจาก Phantasm",
    setup: "ลงสตันยาวจาก Chaos Bolt ให้ทีมรุม",
  },
  chen: {
    setup: "ฮีลเพื่อนทั่วแมพและเปลี่ยนครีปกลางเป็นกองทัพ",
    weakness: "ทำอะไรไม่ได้ถ้าครีปตายและตัวเองโดนจับ",
  },
  clinkz: {
    threat: "เผาเป้าหมายจากระยะไกลขณะล่องหนด้วย Skeleton Walk",
    weakness: "ตัวบางมากและตายให้กับการเปิดแมพและเบิร์สต์",
  },
  rattletrap: {
    threat: "เกี่ยวเข้ามาด้วย Hookshot และขังเป้าไว้คนเดียวด้วย Power Cogs และ Battery Assault",
    setup: "ขังเป้าหมายใน Power Cogs ให้ทีม",
  },
  dark_seer: {
    threat: "กั้นการต่อสู้ด้วย Wall of Replica และสโนว์บอลด้วย Ion Shell",
    setup: "รวบทีมศัตรูด้วย Vacuum เพื่อลง AoE ตาม",
  },
  dark_willow: {
    threat: "ล็อกเป้าด้วย Bramble Maze และ Cursed Crown แล้วเบิร์สต์เก็บ",
    setup: "สตันทีมที่รวมกลุ่มด้วย Cursed Crown และ Bramble Maze",
  },
  dawnbreaker: {
    threat: "กระโดดข้ามแมพด้วย Solar Guardian และฮีลตลอดการต่อสู้",
    setup: "สตันและฮีลเพื่อนจากทุกที่ด้วย Solar Guardian",
  },
  death_prophet: {
    threat: "ผลักป้อมและละลายเป้าหมายด้วยฝูงวิญญาณ Exorcism",
    weakness: "เคลื่อนที่ช้าระหว่าง Exorcism และเสี่ยงต่อเบิร์สต์",
  },
  dragon_knight: {
    threat: "ทนการต่อสู้ในร่าง Dragon Form และสตันด้วย Dragon Tail",
    setup: "สตันเป้าหมายด้วย Dragon Tail ให้ทีมตามเก็บ",
  },
  earth_spirit: {
    threat: "กลิ้งเข้ามาด้วย Rolling Boulder และร้อยสตันจาก Geomagnetic Grip และ Boulder Smash",
    setup: "เตะและดึงศัตรูเข้าหาทีมด้วย Boulder Smash",
  },
  elder_titan: {
    threat: "ลดเกราะด้วย Natural Order และสตันด้วย Echo Stomp",
    setup: "เปิดทีมที่รวมกลุ่มด้วย Echo Stomp และ Earth Splitter",
  },
  ember_spirit: {
    threat: "พุ่งไปมาด้วย Sleight of Fist และ Fire Remnant เพื่อหลบและเบิร์สต์",
    weakness: "ใช้มานาเยอะและถูกล็อกได้ก่อนจะออกตัว",
  },
  enchantress: {
    threat: "ไคต์ด้วย Impetus พร้อมทนด้วยการฮีลและครีป",
    weakness: "ตัวบางถ้าโดนจับโดยไม่มีระยะ",
  },
  grimstroke: {
    threat: "มัดศัตรูสองตัวเข้าด้วยกันด้วย Soulbind และไซเลนซ์ด้วย Ink Swell",
    setup: "มัดสองเป้าด้วย Soulbind ให้การคุมของทีมโดนทั้งคู่",
  },
  gyrocopter: {
    threat: "เคลียร์เวฟและทีมด้วย Flak Cannon และ Call Down",
    setup: "สโลว์และเปิดเผยทีมที่รวมกลุ่มด้วย Call Down",
  },
  hoodwink: {
    threat: "ยิงจากระยะไกลด้วย Sharpshooter และหนีผ่านต้นไม้",
    weakness: "ตัวบางและตายถ้าทางหนีถูกตัด",
  },
  keeper_of_the_light: {
    threat: "ยิงเลนด้วย Illuminate และเติมมานาให้ทีม",
    setup: "กวนและทำให้ทีมศัตรูตาบอดด้วย Will-O-Wisp และ Blinding Light",
  },
  kez: {
    threat: "สลับสแตนซ์เพื่อพุ่ง ปัด และเบิร์สต์เป้าหมายเดี่ยว",
    weakness: "ตัวบางและพึ่งการลงคอมโบให้แม่น",
  },
  kunkka: {
    threat: "คอมโบ Torrent, X Marks the Spot และ Ghostship เพื่อเบิร์สต์ AoE มหาศาล",
    setup: "ตั้งเป้าด้วย X Marks the Spot และ Torrent ให้ทีม",
  },
  largo: {
    threat: "คุมพื้นที่และยืนถือแถวหน้าด้วยการคุมหนัก ๆ",
    setup: "ลงการคุมหนักเพื่อเปิดการต่อสู้ให้ทีม",
  },
  leshrac: {
    threat: "ละลายทุกอย่างรอบตัวด้วย Diabolic Edict และ Pulse Nova",
    setup: "ตรึงทีมที่รวมกลุ่มด้วย Split Earth และ Lightning Storm",
  },
  lich: {
    threat: "เด้ง Chain Frost ระหว่างศัตรูที่รวมกลุ่มเพื่อเบิร์สต์มหาศาล",
    setup: "ปกป้องและเปิดให้ทีมด้วย Frost Shield และ Sinister Gaze",
  },
  lone_druid: {
    threat: "สโนว์บอลด้วย Spirit Bear ที่ถึกและถือไอเทม",
    weakness: "ตัวเองอ่อนแอถ้า Spirit Bear ตายหรือถูกแยก",
  },
  luna: {
    threat: "เด้ง Lucent Beam และเคลียร์ทีมด้วย Moon Glaives และ Eclipse",
    weakness: "ระยะสั้นสำหรับแครรี่และตายให้กับการคุม",
  },
  lycan: {
    threat: "แปลงร่างเป็นฝูงหมาป่าและผลักออบเจกทีฟอย่างต่อเนื่อง",
    weakness: "ถูกไคต์ด้วยสโลว์และอ่อนลงถ้าเกมยืดเยื้อ",
  },
  marci: {
    threat: "เบิร์สต์เป้าด้วย Unleash และพุ่งเข้ามาด้วย Dispose",
    setup: "โยนศัตรูเข้าหาทีมด้วย Dispose และบัฟเพื่อนด้วย Sidekick",
  },
  mars: {
    threat: "พุ่งหอกดันศัตรูเข้า Arena of Blood และบล็อกการโจมตีระยะไกล",
    setup: "กั้นการต่อสู้ด้วย Arena of Blood และตรึงเป้าด้วย Spear",
  },
  meepo: {
    threat: "รุมด้วยร่างโคลนที่ Poof และ Earthbind เป้าหมายเดี่ยว",
    weakness: "ตายทันทีถ้าร่างโคลนหนึ่งถูกเบิร์สต์",
  },
  mirana: {
    threat: "ลงสตันระยะไกลจาก Sacred Arrow และเบิร์สต์ด้วย Starstorm",
    setup: "เปิดการเก็บคิลด้วย Sacred Arrow และ Moonlight Shadow",
  },
  monkey_king: {
    threat: "ลงใส่ทีมที่รวมกลุ่มด้วย Wukong's Command และสตันด้วย Boundless Strike",
    setup: "ตรึงทีมที่รวมกลุ่มด้วย Boundless Strike และ Wukong's Command",
  },
  morphling: {
    threat: "สลับสเตตัสเพื่อเบิร์สต์ด้วย Adaptive Strike และหลบดาเมจด้วย Waveform",
    weakness: "พึ่งไอเทมและตายก่อนที่จะมีของ",
  },
  muerta: {
    threat: "เก็บคิลจากระยะไกลและกันการโจมตีกายภาพระหว่าง Pierce the Veil",
    weakness: "เคลื่อนที่ช้าและตายให้กับการเข้าระยะและการคุม",
  },
  naga_siren: {
    threat: "จับเป้าด้วย Ensnare และถล่มด้วยกำแพงอิลลูชัน",
    setup: "ทำให้ทีมศัตรูหลับด้วย Song of the Siren เพื่อรีเซ็ตหรือเปิดเกม",
  },
  furion: {
    threat: "เทเลพอร์ตไปได้ทุกที่เพื่อ split-push และเรียกทรีนต์",
    weakness: "ตัวบางและตายถ้าโดนจับโดยไม่มีเทเลพอร์ต",
  },
  night_stalker: {
    threat: "ครองเวลากลางคืนด้วยไซเลนซ์และการบิน ไล่ล่าเป้าหมายเดี่ยว",
    setup: "ไซเลนซ์ด้วย Crippling Fear และสโลว์เป้าด้วย Void ให้ทีม",
  },
  nyx_assassin: {
    threat: "blink เข้ามาด้วย Impale และ Spiked Carapace เพื่อลงโทษสายคาสเตอร์",
    setup: "สตันด้วย Impale และเผามานาคาสเตอร์สำคัญด้วย Mana Burn",
  },
  ogre_magi: {
    threat: "ทนการต่อสู้และลง Fireblast กับ Ignite แบบมัลติคาสต์",
    setup: "สตันด้วย Fireblast และเร่งความเร็วเพื่อนด้วย Bloodlust",
  },
  oracle: {
    setup: "เซฟเพื่อนด้วย False Promise และปลดอาวุธด้วย Fortune's End",
    weakness: "ตัวบางและต้องถูกหยุดก่อนที่จะเซฟแครรี่",
  },
  obsidian_destroyer: {
    threat: "เบิร์สต์ด้วย Arcane Orb และถอดเป้าหมายด้วย Astral Imprisonment",
    setup: "ขังเป้าด้วย Astral และนุกทีมด้วย Sanity's Eclipse",
  },
  pangolier: {
    threat: "กลิ้งทะลุทีมด้วย Rolling Thunder และ Swashbuckle",
    setup: "สตันทีมที่รวมกลุ่มด้วย Rolling Thunder ให้ตามเก็บ",
  },
  phantom_lancer: {
    threat: "จมศัตรูด้วยกองทัพอิลลูชันไม่รู้จบ",
    weakness: "อ่อนแอก่อนมีของและตายให้กับ AoE ที่ล้างอิลลูชัน",
  },
  phoenix: {
    threat: "ไดฟ์ด้วย Icarus Dive และสตันทีมภายใน Supernova",
    setup: "บังคับการต่อสู้ตามจังหวะของทีมด้วย Supernova และ Sun Ray",
  },
  primal_beast: {
    threat: "กระทืบเข้ามาด้วย Pulverize และ Trample เพื่อบดเป้าหมาย",
    setup: "สตันด้วย Pulverize และตรึงเป้าด้วย Onslaught ให้ทีม",
  },
  puck: {
    threat: "เข้าออกด้วย Illusory Orb และ Phase Shift แล้วไซเลนซ์ด้วย Dream Coil",
    setup: "ตรึงและสตันทีมที่รวมกลุ่มด้วย Dream Coil",
  },
  pugna: {
    threat: "ทำลายป้อมและเผามานาด้วย Nether Blast และ Life Drain",
    weakness: "ตัวบางและตายให้กับการคุมก่อนที่จะดูดเป้าหมาย",
  },
  razor: {
    threat: "ขโมยดาเมจด้วย Static Link และไล่ด้วย Plasma Field",
    weakness: "ระยะสั้นและถูกไคต์ถ้าลิงก์เป้าไม่ได้",
  },
  riki: {
    threat: "ล่องหนถาวร blink ไปหลังเป้าและ Smoke Screen ใส่",
    weakness: "ถูกกดสนิทด้วยการเปิดแมพและ AoE",
  },
  ringmaster: {
    threat: "พันศัตรูด้วย Tame the Beasts และลูกเล่น Escape Act",
    setup: "ล็อกเป้าให้ทีมด้วย Spike Trap และ Tame the Beasts",
  },
  shadow_demon: {
    threat: "แยกเป้าด้วย Disruption และสโลว์จนคลานด้วย Demonic Purge",
    setup: "ล็อกเป้าด้วย Disruption และ Demonic Purge ให้ทีมลบ",
  },
  shadow_shaman: {
    threat: "ร้อย Shackles และ Hex พร้อมผลักด้วย Mass Serpent Ward",
    setup: "ล็อกเป้าด้วย Hex และ Shackles ให้ทีม",
  },
  slark: {
    threat: "ขโมยสเตตัสด้วย Essence Shift และหนีในความมืดด้วย Shadow Dance",
    weakness: "อ่อนแอช่วงต้นเกมและตายถ้าโดนจับก่อนสโนว์บอล",
  },
  snapfire: {
    threat: "เบิร์สต์จากระยะไกลด้วย Mortimer Kisses และสตันด้วย Scatterblast",
    setup: "กระโดดและสตันเป้าด้วย Firesnap Cookie ให้ทีม",
  },
  techies: {
    threat: "โปรยทุ่นระเบิดทั่วแมพและเบิร์สต์เป้าด้วย Blast Off",
    setup: "ปลดอาวุธด้วย Reactive Tazer และกันพื้นที่ด้วยระเบิด",
  },
  shredder: {
    threat: "ทนดาเมจด้วย Reactive Armor และร้อย Timber Chain",
    weakness: "ลำบากเมื่อเจอ pure damage และเอฟเฟกต์ Break",
  },
  tinker: {
    threat: "Rearm เพื่อสแปม Laser และมิสไซล์ ลบฮีโร่จากระยะไกล",
    weakness: "ตัวบางมากและตายให้กับการเข้าระยะ",
  },
  treant: {
    threat: "ฮีลเพื่อนแบบล่องหนและรูทเป้าด้วย Overgrowth",
    setup: "รูททีมที่รวมกลุ่มด้วย Overgrowth ให้ทีมตามเก็บ",
  },
  abyssal_underlord: {
    threat: "คุมพื้นที่ด้วย Firestorm และ Pit of Malice พร้อมทนการต่อสู้",
    setup: "ขังทีมที่รวมกลุ่มด้วย Pit of Malice ให้ตามเก็บ",
  },
  undying: {
    threat: "ดูดพลังด้วย Decay และทนการต่อสู้ด้วยฝูงซอมบี้จาก Tombstone",
    setup: "ทำให้ทีมศัตรูอ่อนลงและสโลว์ด้วย Decay และ Tombstone",
  },
  vengefulspirit: {
    threat: "สลับเป้าหมายออกจากตำแหน่งด้วย Nether Swap และลดเกราะ",
    setup: "สตันด้วย Magic Missile และลดเกราะด้วย Wave of Terror ให้ทีม",
  },
  venomancer: {
    threat: "ปกคลุมการต่อสู้ด้วย Poison Nova และ Plague Ward",
    setup: "สโลว์และกันพื้นที่ทีมศัตรูด้วย Venomous Gale และวอร์ด",
  },
  visage: {
    threat: "รุมด้วย Familiars ที่สตันและลดเกราะเป้าหมาย",
    weakness: "เคลื่อนที่ช้าและอ่อนลงถ้า Familiars ตาย",
  },
  void_spirit: {
    threat: "blink ทะลุการต่อสู้ด้วย Dissimilate และเบิร์สต์ด้วย Resonant Pulse",
    weakness: "พึ่งมานาและเสี่ยงเมื่อสกิลหนีหมด",
  },
  winter_wyvern: {
    setup: "สาปเป้าด้วย Winter's Curse บังคับให้ทีมหันมาตีเป้านั้น",
    weakness: "เดินช้าและตัวบางถ้าโดนจับนอกตำแหน่ง",
  },
  skeleton_king: {
    threat: "สตันด้วย Wraithfire Blast และสู้ต่อข้ามความตายด้วย Reincarnation",
    weakness: "ถูกไคต์และไร้ประโยชน์ขณะ Reincarnation ติดคูลดาวน์",
  },
};
