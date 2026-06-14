/**
 * Curated, hand-written "ability counters" for each hero — the famous spell-vs-spell interactions
 * that win or lose a matchup. There is no API for this (OpenDota only exposes win-rate matchups),
 * so this is deliberately hand-authored Dota knowledge, the iconic interactions per hero.
 *
 * Each entry is one of:
 *   - kind "offense": one of THIS hero's abilities and what it shuts down.
 *   - kind "defense": an enemy ability to respect, and how it shuts THIS hero down.
 * `ability` is the headline spell name (kept in English, like hero/item names). `text` / `text_th`
 * are the English / Thai explanations. Keyed by the Steam hero slug (no "npc_dota_hero_" prefix).
 */
export interface AbilityCounterSource {
  kind: "offense" | "defense";
  /** Headline ability name, shown in English. */
  ability: string;
  text: string;
  text_th: string;
}

export const ABILITY_COUNTERS: Record<string, AbilityCounterSource[]> = {
  antimage: [
    { kind: "offense", ability: "Mana Break", text: "Mana Break and Mana Void punish mana-reliant heroes like Medusa, Storm Spirit, and Invoker.", text_th: "Mana Break และ Mana Void ลงโทษฮีโร่ที่พึ่งมานาอย่าง Medusa, Storm Spirit และ Invoker" },
    { kind: "offense", ability: "Blink", text: "Blink lets Anti-Mage dodge most single-target stuns and chase or escape at will.", text_th: "Blink ช่วยให้ Anti-Mage หลบสตันเดี่ยวส่วนใหญ่และไล่หรือหนีได้ตามใจ" },
    { kind: "defense", ability: "Doom", text: "Doom Bringer's Doom silences Blink and Mana Void for 16 seconds, removing him from the fight.", text_th: "Doom ของ Doom Bringer ไซเลนซ์ Blink และ Mana Void นาน 16 วินาที ถอดเขาออกจากการต่อสู้" },
  ],
  axe: [
    { kind: "offense", ability: "Berserker's Call", text: "Berserker's Call forces every nearby enemy to attack Axe, cancelling channels and blinks.", text_th: "Berserker's Call บังคับให้ศัตรูรอบข้างตี Axe ยกเลิกการร่ายค้างและ blink" },
    { kind: "defense", ability: "Break", text: "Silver Edge's Break disables Counter Helix, gutting Axe's main source of damage.", text_th: "Break จาก Silver Edge ปิด Counter Helix ตัดแหล่งดาเมจหลักของ Axe" },
  ],
  bane: [
    { kind: "offense", ability: "Fiend's Grip", text: "Fiend's Grip locks a key target out of a teamfight for its full duration.", text_th: "Fiend's Grip ขังเป้าหมายสำคัญออกจากการตีทีมตลอดระยะเวลาสกิล" },
    { kind: "defense", ability: "Spell immunity", text: "BKB or Black King Bar shrugs off Nightmare and Fiend's Grip entirely.", text_th: "BKB หรือ Black King Bar กัน Nightmare และ Fiend's Grip ได้ทั้งหมด" },
  ],
  bloodseeker: [
    { kind: "offense", ability: "Rupture", text: "Rupture punishes mobile heroes — moving deals huge damage, so blinks and dashes backfire.", text_th: "Rupture ลงโทษฮีโร่ที่เคลื่อนที่เยอะ — การขยับสร้างดาเมจมหาศาล ทำให้ blink และการพุ่งย้อนกลับมาทำร้ายตัวเอง" },
    { kind: "defense", ability: "Heal cut", text: "Spirit Vessel and Skadi cut the lifesteal Bloodseeker relies on to stay alive while diving.", text_th: "Spirit Vessel และ Skadi ตัด lifesteal ที่ Bloodseeker พึ่งเพื่อเอาตัวรอดขณะไดฟ์" },
  ],
  crystal_maiden: [
    { kind: "offense", ability: "Frostbite", text: "Frostbite roots a single target in place while Crystal Nova slows the group.", text_th: "Frostbite รูทเป้าหมายเดี่ยวให้อยู่กับที่ ขณะที่ Crystal Nova สโลว์ทั้งกลุ่ม" },
    { kind: "defense", ability: "Gap-closers", text: "Any blink or charge (Spirit Breaker, Storm) reaches slow, squishy CM before she can react.", text_th: "blink หรือ charge ใด ๆ (Spirit Breaker, Storm) เข้าถึง CM ที่ช้าและตัวบางก่อนที่เธอจะตั้งตัว" },
  ],
  drow_ranger: [
    { kind: "offense", ability: "Gust", text: "Gust silences and knocks back melee heroes trying to close the gap on Drow.", text_th: "Gust ไซเลนซ์และผลักฮีโร่สายประชิดที่พยายามเข้าระยะ Drow" },
    { kind: "defense", ability: "Marksmanship", text: "Any hero that gets in her face drops her Marksmanship aura and bonus damage.", text_th: "ฮีโร่ที่เข้ามาประชิดทำให้ออร่า Marksmanship และดาเมจเสริมของเธอหายไป" },
  ],
  earthshaker: [
    { kind: "offense", ability: "Echo Slam", text: "Echo Slam deals massive damage off clustered enemies and illusions/summons.", text_th: "Echo Slam สร้างดาเมจมหาศาลจากศัตรูที่รวมกลุ่มและอิลลูชัน/ลูกสมุน" },
    { kind: "defense", ability: "Spell immunity", text: "BKB lets initiators walk through Fissure and ignore Echo Slam's stun.", text_th: "BKB ทำให้ฮีโร่เปิดเกมเดินผ่าน Fissure และกันสตันจาก Echo Slam" },
  ],
  juggernaut: [
    { kind: "offense", ability: "Blade Fury", text: "Blade Fury makes Juggernaut spell-immune, dodging stuns and silences while dealing damage.", text_th: "Blade Fury ทำให้ Juggernaut กันเวทย์ หลบสตันและไซเลนซ์ขณะออกดาเมจ" },
    { kind: "defense", ability: "Lockdown after Omni", text: "A stun or hex that lands after Omnislash ends catches Jugg with no escape.", text_th: "สตันหรือ hex ที่ลงหลัง Omnislash จบ จับ Jugg ได้โดยไม่มีทางหนี" },
  ],
  lina: [
    { kind: "offense", ability: "Laguna Blade", text: "Laguna Blade deletes a squishy target instantly after a Light Strike Array stun.", text_th: "Laguna Blade ลบเป้าหมายตัวบางทันทีหลังสตันจาก Light Strike Array" },
    { kind: "defense", ability: "Lockdown", text: "Fragile Lina dies to any stun chain before she can land her burst.", text_th: "Lina ตัวเปราะตายให้กับการร้อยสตันก่อนที่จะลงเบิร์สต์ได้" },
  ],
  lion: [
    { kind: "offense", ability: "Hex", text: "Hex plus Earth Spike chains two disables into a Finger of Death execute.", text_th: "Hex บวก Earth Spike ร้อยสองการคุมเข้าสู่การปิดจ๊อบด้วย Finger of Death" },
    { kind: "defense", ability: "Linken's Sphere", text: "Linken's Sphere blocks Hex or Finger of Death, ruining Lion's single-target combo.", text_th: "Linken's Sphere บล็อก Hex หรือ Finger of Death ทำลายคอมโบเดี่ยวของ Lion" },
  ],
  invoker: [
    { kind: "offense", ability: "Tornado + EMP", text: "Tornado lifts and disjoints, then EMP burns the mana off casters and Storm/Medusa types.", text_th: "Tornado ยกและตัดโพรเจกไทล์ แล้ว EMP เผามานาของสายคาสเตอร์และพวก Storm/Medusa" },
    { kind: "defense", ability: "Doom / silence", text: "Doom or any long silence shuts off Invoker's whole spell-combo identity.", text_th: "Doom หรือไซเลนซ์ยาว ๆ ปิดตัวตนคอมโบสกิลทั้งหมดของ Invoker" },
  ],
  phantom_assassin: [
    { kind: "offense", ability: "Phantom Strike", text: "Phantom Strike blinks onto a target and Coup de Grace crits delete it.", text_th: "Phantom Strike blink เข้าหาเป้าและคริติคอล Coup de Grace ลบทิ้ง" },
    { kind: "defense", ability: "True strike", text: "Monkey King Bar's true strike ignores Blur evasion, and armor blunts her crits.", text_th: "true strike ของ Monkey King Bar เจาะ evasion จาก Blur และเกราะลดทอนคริติคอลของเธอ" },
  ],
  legion_commander: [
    { kind: "offense", ability: "Duel", text: "Duel forces a no-escape 1v1 that Legion almost always wins with damage stacked.", text_th: "Duel บังคับ 1v1 ที่หนีไม่ได้ ซึ่ง Legion มักชนะด้วยดาเมจที่สะสมไว้" },
    { kind: "defense", ability: "Euls / Lotus", text: "Eul's or a dispel breaks Duel's lock, and Lotus Orb reflects it back.", text_th: "Eul's หรือดิสเพลปลดการล็อกของ Duel และ Lotus Orb สะท้อนกลับ" },
  ],
  nevermore: [
    { kind: "offense", ability: "Requiem of Souls", text: "Requiem of Souls bursts and fears clustered enemies after a Shadowraze combo.", text_th: "Requiem of Souls เบิร์สต์และทำให้ศัตรูที่รวมกลุ่มกลัวหลังคอมโบ Shadowraze" },
    { kind: "defense", ability: "Interrupts", text: "Any stun interrupts Requiem mid-cast and bursts fragile Shadow Fiend down.", text_th: "สตันใด ๆ ขัด Requiem ระหว่างร่ายและเบิร์สต์ Shadow Fiend ที่ตัวเปราะ" },
  ],
  pudge: [
    { kind: "offense", ability: "Meat Hook", text: "Meat Hook yanks a single target out of position into the team for a Dismember.", text_th: "Meat Hook ลากเป้าหมายเดี่ยวออกจากตำแหน่งเข้าหาทีมเพื่อ Dismember" },
    { kind: "defense", ability: "Linken's Sphere", text: "Linken's Sphere blocks Dismember, and BKB ignores the Hook's stun and rot.", text_th: "Linken's Sphere บล็อก Dismember และ BKB กันสตันและพิษจาก Hook" },
  ],
  sven: [
    { kind: "offense", ability: "Storm Hammer", text: "Storm Hammer stuns a target and God's Strength cleaves the team for huge burst.", text_th: "Storm Hammer สตันเป้าและ God's Strength ฟันโดนทั้งทีมเพื่อเบิร์สต์มหาศาล" },
    { kind: "defense", ability: "Ghost / Halberd", text: "Ghost Scepter and Heaven's Halberd shut off Sven's all-physical right-click.", text_th: "Ghost Scepter และ Heaven's Halberd ปิดการตีกายภาพล้วนของ Sven" },
  ],
  tidehunter: [
    { kind: "offense", ability: "Ravage", text: "Ravage is an AoE stun that flips entire teamfights and ignores positioning.", text_th: "Ravage คือสตัน AoE ที่พลิกการตีทีมทั้งหมดและไม่สนตำแหน่ง" },
    { kind: "defense", ability: "Spell immunity", text: "BKB on the carry lets it fight through Ravage; Anchor Smash counters right-clickers.", text_th: "BKB บนแครรี่ทำให้สู้ผ่าน Ravage ได้ ส่วน Anchor Smash เคาน์เตอร์สายตี" },
  ],
  tiny: [
    { kind: "offense", ability: "Toss", text: "Toss + Avalanche combos a single target for huge early burst and saves allies.", text_th: "Toss + Avalanche คอมโบเป้าหมายเดี่ยวเพื่อเบิร์สต์ต้นเกมมหาศาลและเซฟเพื่อน" },
    { kind: "defense", ability: "Lockdown", text: "Tiny is melee with no escape, so any reliable stun pins and kites him.", text_th: "Tiny เป็นสายประชิดที่ไม่มีสกิลหนี สตันที่ไว้ใจได้จึงตรึงและไคต์เขาได้" },
  ],
  zuus: [
    { kind: "offense", ability: "Thundergod's Wrath", text: "Thundergod's Wrath hits the whole enemy team globally and reveals invisible heroes.", text_th: "Thundergod's Wrath โดนทั้งทีมศัตรูทั่วแมพและเปิดเผยฮีโร่ล่องหน" },
    { kind: "defense", ability: "Gap-closers", text: "Zeus has no escape, so any blink or charge deletes him before he nukes.", text_th: "Zeus ไม่มีสกิลหนี blink หรือ charge ใด ๆ จึงลบเขาก่อนที่จะปล่อยสกิล" },
  ],
  sniper: [
    { kind: "offense", ability: "Assassinate", text: "Assassinate snipes a low target from a screen away, and his range out-trades melee.", text_th: "Assassinate ยิงเป้าเลือดน้อยจากระยะไกลข้ามจอ และระยะของเขาเทรดชนะสายประชิด" },
    { kind: "defense", ability: "Gap-closers", text: "Blink/charge heroes like Spirit Breaker or Phantom Assassin delete no-escape Sniper.", text_th: "ฮีโร่ blink/charge อย่าง Spirit Breaker หรือ Phantom Assassin ลบ Sniper ที่ไม่มีสกิลหนี" },
  ],
  spirit_breaker: [
    { kind: "offense", ability: "Charge of Darkness", text: "Charge of Darkness is a global stun that isolates and bashes a single target.", text_th: "Charge of Darkness คือสตันทั่วแมพที่แยกและบาชเป้าหมายเดี่ยว" },
    { kind: "defense", ability: "Stop the charge", text: "Fog, a blocker, or a counter-stun cancels his Charge before it lands.", text_th: "หมอก ตัวบัง หรือสตันสวนยกเลิก Charge ของเขาก่อนที่จะลง" },
  ],
  slardar: [
    { kind: "offense", ability: "Corrosive Haze", text: "Corrosive Haze shreds armor and reveals invisible heroes for the team to burst.", text_th: "Corrosive Haze ลดเกราะและเปิดเผยฮีโร่ล่องหนให้ทีมเบิร์สต์" },
    { kind: "defense", ability: "Kiting", text: "Without his blink+stun landing, melee Slardar is kited by ranged cores.", text_th: "ถ้า blink+สตันของเขาไม่ลง Slardar สายประชิดจะถูกไคต์โดยคอร์ระยะไกล" },
  ],
  ursa: [
    { kind: "offense", ability: "Fury Swipes", text: "Fury Swipes stacks per hit to melt single targets and Roshan in seconds.", text_th: "Fury Swipes สะสมต่อการตีเพื่อละลายเป้าหมายเดี่ยวและ Roshan ในไม่กี่วินาที" },
    { kind: "defense", ability: "Disable at range", text: "Hex, root, or Ghost Scepter stops Ursa cold once Enrage is committed.", text_th: "Hex, รูท หรือ Ghost Scepter หยุด Ursa ได้ทันทีเมื่อใช้ Enrage ไปแล้ว" },
  ],
  bristleback: [
    { kind: "offense", ability: "Quill Spray", text: "Quill Spray stacks while Bristleback shrugs off frontal damage in extended fights.", text_th: "Quill Spray สะสมขณะที่ Bristleback ทนดาเมจจากด้านหน้าในการต่อสู้ที่ยืดเยื้อ" },
    { kind: "defense", ability: "Magic burst / Break", text: "Magic burst and break (Silver Edge) bypass his armor and Warpath stacks.", text_th: "เบิร์สต์เวทย์และ Break (Silver Edge) ข้ามเกราะและสแต็ก Warpath ของเขา" },
  ],
  huskar: [
    { kind: "offense", ability: "Life Break", text: "Life Break leaps onto and slows a target while low HP makes Huskar hit hardest.", text_th: "Life Break กระโดดใส่และสโลว์เป้า ขณะที่เลือดน้อยทำให้ Huskar ตีแรงที่สุด" },
    { kind: "defense", ability: "Heal cut + Break", text: "Spirit Vessel and Silver Edge's Break strip his lifesteal and Berserker's Blood.", text_th: "Spirit Vessel และ Break จาก Silver Edge ตัด lifesteal และ Berserker's Blood ของเขา" },
  ],
  viper: [
    { kind: "offense", ability: "Corrosive Skin", text: "Corrosive Skin and Poison Attack win every early lane trade with slows and resist.", text_th: "Corrosive Skin และ Poison Attack ชนะการเทรดในเลนช่วงต้นทุกครั้งด้วยสโลว์และความต้านทาน" },
    { kind: "defense", ability: "Mobility", text: "Viper is slow with no escape, so mobile heroes kite him once they have items.", text_th: "Viper เดินช้าไม่มีสกิลหนี ฮีโร่ที่คล่องตัวจึงไคต์เขาได้เมื่อมีของ" },
  ],
  windrunner: [
    { kind: "offense", ability: "Shackleshot", text: "Shackleshot roots a target (off another unit or tree) for a focused kill.", text_th: "Shackleshot รูทเป้าหมาย (โดยอาศัยยูนิตหรือต้นไม้ด้านหลัง) เพื่อโฟกัสเก็บ" },
    { kind: "defense", ability: "Burst through Windrun", text: "Magic burst ignores Windrun's physical evasion and deletes squishy Windranger.", text_th: "เบิร์สต์เวทย์ข้าม evasion กายภาพจาก Windrun และลบ Windranger ที่ตัวบาง" },
  ],
  templar_assassin: [
    { kind: "offense", ability: "Refraction", text: "Refraction soaks instances of damage while she bursts squishy targets with Meld.", text_th: "Refraction ดูดซับดาเมจหลายครั้งขณะที่เธอเบิร์สต์เป้าตัวบางด้วย Meld" },
    { kind: "defense", ability: "AoE + detection", text: "AoE damage strips Refraction charges and dust reveals her Psionic Trap escapes.", text_th: "ดาเมจ AoE ลอกชาร์จ Refraction และ dust เปิดเผยการหนีด้วย Psionic Trap" },
  ],
  queenofpain: [
    { kind: "offense", ability: "Blink", text: "Blink lets QoP burst with Scream and Shadow Strike, then escape before retaliation.", text_th: "Blink ช่วยให้ QoP เบิร์สต์ด้วย Scream และ Shadow Strike แล้วหนีก่อนโดนสวน" },
    { kind: "defense", ability: "Lockdown / silence", text: "A stun or silence pins her in place since she is fragile without Blink up.", text_th: "สตันหรือไซเลนซ์ตรึงเธอไว้ เพราะเธอตัวเปราะเมื่อไม่มี Blink พร้อม" },
  ],
  storm_spirit: [
    { kind: "offense", ability: "Ball Lightning", text: "Ball Lightning chases down stragglers across the map and dodges projectiles.", text_th: "Ball Lightning ไล่เก็บคนที่หลุดกลุ่มทั่วแมพและหลบโพรเจกไทล์" },
    { kind: "defense", ability: "Orchid / mana burn", text: "Orchid, mana burn, or Glimpse strands Storm out of position with no mana.", text_th: "Orchid, mana burn หรือ Glimpse ทำให้ Storm ค้างนอกตำแหน่งโดยไม่มีมานา" },
  ],
  doom_bringer: [
    { kind: "offense", ability: "Doom", text: "Doom silences, disarms, and stops all healing on a key hero for 16 seconds.", text_th: "Doom ไซเลนซ์ ปลดอาวุธ และหยุดการฮีลทั้งหมดของฮีโร่สำคัญนาน 16 วินาที" },
    { kind: "defense", ability: "Linken's / Lotus", text: "Linken's Sphere blocks Doom and Lotus Orb reflects it back onto Doom himself.", text_th: "Linken's Sphere บล็อก Doom และ Lotus Orb สะท้อนกลับใส่ Doom เอง" },
  ],
  silencer: [
    { kind: "offense", ability: "Global Silence", text: "Global Silence shuts off every enemy spell — a hard counter to combo teams.", text_th: "Global Silence ปิดสกิลศัตรูทุกตัว — เคาน์เตอร์ทีมที่เล่นคอมโบอย่างหนัก" },
    { kind: "defense", ability: "Spell immunity", text: "BKB and Manta dispel let key enemies ignore Global Silence and his Curse.", text_th: "BKB และการดิสเพลของ Manta ทำให้ศัตรูสำคัญกัน Global Silence และ Curse ของเขา" },
  ],
  skywrath_mage: [
    { kind: "offense", ability: "Ancient Seal", text: "Ancient Seal silences and amplifies magic damage, setting up a guaranteed burst kill.", text_th: "Ancient Seal ไซเลนซ์และเพิ่มดาเมจเวทย์ เปิดการเบิร์สต์เก็บแบบการันตี" },
    { kind: "defense", ability: "Magic resist", text: "Pipe, BKB, or any gap-closer ends one of the squishiest heroes in the game.", text_th: "Pipe, BKB หรือการเข้าระยะใด ๆ จบหนึ่งในฮีโร่ที่ตัวบางที่สุดในเกม" },
  ],
  rubick: [
    { kind: "offense", ability: "Spell Steal", text: "Spell Steal turns the enemy's best ultimate against them after a Telekinesis lift.", text_th: "Spell Steal เปลี่ยนอัลติที่ดีที่สุดของศัตรูมาใช้สวนหลังยกด้วย Telekinesis" },
    { kind: "defense", ability: "Burst the squishy", text: "Rubick is fragile, so quick lockdown and burst kill him before he steals anything.", text_th: "Rubick ตัวเปราะ การคุมและเบิร์สต์เร็ว ๆ จึงเก็บเขาก่อนที่จะขโมยอะไรได้" },
  ],
  enigma: [
    { kind: "offense", ability: "Black Hole", text: "Black Hole channels a massive AoE disable that wins fights outright.", text_th: "Black Hole ร่าย AoE คุมขนาดใหญ่ที่ตัดสินการต่อสู้ได้เลย" },
    { kind: "defense", ability: "Interrupts", text: "Any stun, Euls, or BKB-blink interrupts or ignores Black Hole's channel.", text_th: "สตัน, Euls หรือ BKB-blink ใด ๆ ขัดหรือกันการร่าย Black Hole" },
  ],
  faceless_void: [
    { kind: "offense", ability: "Chronosphere", text: "Chronosphere freezes everyone caught inside for the team to delete.", text_th: "Chronosphere หยุดทุกคนที่ติดอยู่ข้างในให้ทีมรุมลบ" },
    { kind: "defense", ability: "Bait the Chrono", text: "Forcing a bad Chronosphere (or BKB-ing out) wastes Void's entire teamfight.", text_th: "การล่อให้ลง Chronosphere เสีย (หรือ BKB ออก) ทำให้การตีทีมของ Void สูญเปล่า" },
  ],
  medusa: [
    { kind: "offense", ability: "Mana Shield", text: "Mana Shield soaks enormous physical damage, letting Medusa out-last right-clickers.", text_th: "Mana Shield ดูดซับดาเมจกายภาพมหาศาล ทำให้ Medusa อึดกว่าสายตี" },
    { kind: "defense", ability: "Mana burn", text: "Anti-Mage's Mana Break and Diffusal empty her Mana Shield, collapsing her tankiness.", text_th: "Mana Break ของ Anti-Mage และ Diffusal ทำให้ Mana Shield หมด ทำให้ความถึกของเธอพังลง" },
  ],
  spectre: [
    { kind: "offense", ability: "Haunt", text: "Haunt sends a global illusion to every enemy, ramping Spectre into any teamfight.", text_th: "Haunt ส่งอิลลูชันไปหาศัตรูทุกตัวทั่วแมพ ทำให้ Spectre แรงขึ้นในการตีทีมทุกครั้ง" },
    { kind: "defense", ability: "Early aggression", text: "Spectre is weak before items, so heavy early pressure shuts her down for good.", text_th: "Spectre อ่อนแอก่อนมีของ การกดดันหนัก ๆ ช่วงต้นเกมจึงปิดเธอได้สนิท" },
  ],
  troll_warlord: [
    { kind: "offense", ability: "Battle Trance", text: "Battle Trance is a self-dispel attack-speed steroid that out-DPSes other carries.", text_th: "Battle Trance คือสกิลดิสเพลตัวเองเพิ่มความเร็วโจมตีที่ DPS เหนือกว่าแครรี่ตัวอื่น" },
    { kind: "defense", ability: "Kite / Ghost", text: "Ghost Scepter and slows kite melee Troll, who has no built-in escape.", text_th: "Ghost Scepter และสโลว์ไคต์ Troll สายประชิดที่ไม่มีสกิลหนีในตัว" },
  ],
  life_stealer: [
    { kind: "offense", ability: "Rage", text: "Rage grants spell immunity to dive through disables with percent-based damage.", text_th: "Rage ให้ภูมิคุ้มกันเวทย์เพื่อไดฟ์ผ่านการคุมด้วยดาเมจแบบเปอร์เซ็นต์" },
    { kind: "defense", ability: "Kiting", text: "Pure melee Naix is kited by slows, Force Staff, and disengage once Rage is down.", text_th: "Naix สายประชิดล้วนถูกไคต์ด้วยสโลว์, Force Staff และการถอยเมื่อ Rage หมด" },
  ],
  terrorblade: [
    { kind: "offense", ability: "Metamorphosis", text: "Metamorphosis plus Conjure Image floods the fight with armor-shredding ranged illusions.", text_th: "Metamorphosis บวก Conjure Image ถล่มการต่อสู้ด้วยอิลลูชันระยะไกลที่ลดเกราะ" },
    { kind: "defense", ability: "Illusion clear", text: "Mjollnir and AoE wipe his illusions, and early ganks kill fragile early Terrorblade.", text_th: "Mjollnir และ AoE ล้างอิลลูชันของเขา และการแกงค์ช่วงต้นเก็บ Terrorblade ที่เปราะ" },
  ],
  weaver: [
    { kind: "offense", ability: "Time Lapse", text: "Time Lapse rewinds Weaver to full HP and a safe spot, undoing a whole burst combo.", text_th: "Time Lapse ย้อน Weaver กลับไปเลือดเต็มและจุดที่ปลอดภัย ลบล้างคอมโบเบิร์สต์ทั้งชุด" },
    { kind: "defense", ability: "Detection + AoE", text: "Dust and AoE catch him out of Shukuchi before Time Lapse is back up.", text_th: "Dust และ AoE จับเขาตอนหลุด Shukuchi ก่อนที่ Time Lapse จะพร้อมอีกครั้ง" },
  ],
  witch_doctor: [
    { kind: "offense", ability: "Maledict", text: "Maledict deals ramping damage based on HP lost, brutal after a Paralyzing Cask stun.", text_th: "Maledict สร้างดาเมจเพิ่มตามเลือดที่เสียไป โหดมากหลังสตันจาก Paralyzing Cask" },
    { kind: "defense", ability: "Burst him first", text: "Squishy WD must be focused before he channels Death Ward in a fight.", text_th: "WD ตัวบางต้องถูกโฟกัสก่อนที่จะร่าย Death Ward ในการต่อสู้" },
  ],
  necrolyte: [
    { kind: "offense", ability: "Reaper's Scythe", text: "Reaper's Scythe executes low-HP heroes and adds respawn time on the kill.", text_th: "Reaper's Scythe ปิดจ๊อบฮีโร่เลือดน้อยและเพิ่มเวลาเกิดใหม่เมื่อเก็บได้" },
    { kind: "defense", ability: "Heal cut", text: "Spirit Vessel slices through Heartstopper Aura and his huge sustain.", text_th: "Spirit Vessel ตัด Heartstopper Aura และความอึดมหาศาลของเขา" },
  ],
  dazzle: [
    { kind: "offense", ability: "Shallow Grave", text: "Shallow Grave keeps an ally un-killable for a few seconds, denying a guaranteed kill.", text_th: "Shallow Grave ทำให้เพื่อนฆ่าไม่ตายไม่กี่วินาที ปฏิเสธการเก็บที่การันตีไว้แล้ว" },
    { kind: "defense", ability: "Focus the support", text: "Dazzle is squishy, so he must be locked down before he casts Shallow Grave.", text_th: "Dazzle ตัวบาง ต้องถูกล็อกก่อนที่จะร่าย Shallow Grave" },
  ],
  omniknight: [
    { kind: "offense", ability: "Guardian Angel", text: "Guardian Angel grants the team full physical immunity, hard-countering right-click carries.", text_th: "Guardian Angel ให้ทีมภูมิคุ้มกันกายภาพเต็ม เคาน์เตอร์แครรี่สายตีอย่างหนัก" },
    { kind: "defense", ability: "Magic damage / Break", text: "Magic burst ignores Guardian Angel, and Break removes Heavenly Grace's benefits.", text_th: "เบิร์สต์เวทย์ข้าม Guardian Angel และ Break ลบผลของ Heavenly Grace" },
  ],
  wisp: [
    { kind: "offense", ability: "Relocate", text: "Relocate teleports a core anywhere for a gank, then yanks it back to safety.", text_th: "Relocate เทเลพอร์ตคอร์ไปไหนก็ได้เพื่อแกงค์ แล้วดึงกลับมาที่ปลอดภัย" },
    { kind: "defense", ability: "Kill the Io", text: "Io is fragile; killing it cancels Relocate and removes the enemy's Tether buff.", text_th: "Io เปราะบาง การเก็บมันยกเลิก Relocate และลบบัฟ Tether ของศัตรู" },
  ],
  warlock: [
    { kind: "offense", ability: "Fatal Bonds", text: "Fatal Bonds links enemies so every hit and nuke spreads across the bonded group.", text_th: "Fatal Bonds เชื่อมศัตรูให้ทุกการตีและสกิลกระจายไปทั่วกลุ่มที่ถูกมัด" },
    { kind: "defense", ability: "Interrupt Chaotic Offering", text: "A stun or silence stops his Golem ult mid-cast and blunts the teamfight.", text_th: "สตันหรือไซเลนซ์หยุดอัลติ Golem ระหว่างร่ายและลดทอนการตีทีม" },
  ],
  jakiro: [
    { kind: "offense", ability: "Ice Path + Macropyre", text: "Ice Path stuns a clumped team into a Macropyre burn lane.", text_th: "Ice Path สตันทีมที่รวมกลุ่มเข้าสู่เลนเผาของ Macropyre" },
    { kind: "defense", ability: "Spread out", text: "Jakiro's value is AoE, so spreading and BKB neutralise his layered damage.", text_th: "จุดเด่นของ Jakiro คือ AoE การกระจายตัวและ BKB จึงลดทอนดาเมจที่ซ้อนกันของเขา" },
  ],
  disruptor: [
    { kind: "offense", ability: "Glimpse", text: "Glimpse yanks a target back to where it stood, stranding blinkers like Storm and QoP.", text_th: "Glimpse ดึงเป้ากลับไปยังจุดที่เคยอยู่ ทำให้สาย blink อย่าง Storm และ QoP ค้าง" },
    { kind: "defense", ability: "Spell immunity", text: "BKB walks out of Static Storm and Kinetic Field's trap.", text_th: "BKB เดินออกจาก Static Storm และกับดัก Kinetic Field" },
  ],
  centaur: [
    { kind: "offense", ability: "Hoof Stomp", text: "Blink into Hoof Stomp is an instant AoE stun, and Return punishes attackers.", text_th: "blink เข้า Hoof Stomp คือสตัน AoE ทันที และ Return ลงโทษผู้โจมตี" },
    { kind: "defense", ability: "Heal cut", text: "Spirit Vessel and break effects cut the regen Centaur tanks with.", text_th: "Spirit Vessel และเอฟเฟกต์ Break ตัดการฟื้นเลือดที่ Centaur ใช้ทนทาน" },
  ],
  sand_king: [
    { kind: "offense", ability: "Epicenter", text: "Blink + Burrowstrike + Epicenter is a classic AoE stun-and-nuke teamfight opener.", text_th: "blink + Burrowstrike + Epicenter คือการเปิดตีทีมสตันและนุก AoE สุดคลาสสิก" },
    { kind: "defense", ability: "Detection", text: "Sentries and dust reveal his Sand Storm escape and stop the blink initiation.", text_th: "Sentry และ dust เปิดเผยการหนีด้วย Sand Storm และหยุดการเปิดด้วย blink" },
  ],
  magnataur: [
    { kind: "offense", ability: "Reverse Polarity", text: "Reverse Polarity pulls and stuns the whole enemy team for a guaranteed teamfight wipe.", text_th: "Reverse Polarity ดึงและสตันทีมศัตรูทั้งหมดเพื่อล้างทีมแบบการันตี" },
    { kind: "defense", ability: "Spell immunity", text: "BKB lets cores walk out of Reverse Polarity and ignore Skewer.", text_th: "BKB ทำให้คอร์เดินออกจาก Reverse Polarity และกัน Skewer" },
  ],
  tusk: [
    { kind: "offense", ability: "Snowball", text: "Snowball rolls in to isolate a target, then Walrus Punch knocks it back stunned.", text_th: "Snowball กลิ้งเข้ามาแยกเป้าหมาย แล้ว Walrus Punch ต่อยถอยพร้อมสตัน" },
    { kind: "defense", ability: "Dodge Ice Shards", text: "Sidestepping Ice Shards and bursting melee Tusk down removes his initiation.", text_th: "การหลบ Ice Shards และเบิร์สต์ Tusk สายประชิดลบการเปิดเกมของเขา" },
  ],
  // --- formerly generic heroes ---
  abaddon: [
    { kind: "offense", ability: "Aphotic Shield", text: "Aphotic Shield dispels stuns and silences off an ally, then bursts nearby enemies.", text_th: "Aphotic Shield ดิสเพลสตันและไซเลนซ์ออกจากเพื่อน แล้วระเบิดใส่ศัตรูรอบข้าง" },
    { kind: "defense", ability: "Ice Blast", text: "Ancient Apparition's Ice Blast shuts off Borrowed Time and Aphotic Shield healing.", text_th: "Ice Blast ของ Ancient Apparition ตัดการฮีลจาก Borrowed Time และ Aphotic Shield" },
  ],
  alchemist: [
    { kind: "offense", ability: "Unstable Concoction", text: "Unstable Concoction lands a long single-target stun to open a kill.", text_th: "Unstable Concoction ลงสตันยาวใส่เป้าหมายเดี่ยวเพื่อเปิดการเก็บคิล" },
    { kind: "defense", ability: "Doom / silence", text: "Doom or a long silence stops his spells while a gank punishes his greedy farm.", text_th: "Doom หรือไซเลนซ์ยาวหยุดสกิลของเขา ขณะที่การแกงค์ลงโทษการฟาร์มแบบโลภ" },
  ],
  ancient_apparition: [
    { kind: "offense", ability: "Ice Blast", text: "Ice Blast applies a global heal cut, then shatters frozen low-HP targets instantly.", text_th: "Ice Blast ใส่การตัดการฮีลทั่วแมพ แล้วทำให้เป้าเลือดน้อยที่ถูกแช่แข็งแตกทันที" },
    { kind: "defense", ability: "Gap-closers", text: "AA is immobile and squishy, so any blink or charge kills him before Ice Blast.", text_th: "AA เคลื่อนที่ช้าและตัวบาง blink หรือ charge ใด ๆ จึงเก็บเขาก่อน Ice Blast" },
  ],
  arc_warden: [
    { kind: "offense", ability: "Tempest Double", text: "Tempest Double clones Arc Warden and his items to double his damage from afar.", text_th: "Tempest Double โคลน Arc Warden และไอเทมเพื่อออกดาเมจสองเท่าจากระยะไกล" },
    { kind: "defense", ability: "Early pressure", text: "Arc is weak and farm-reliant early, so aggressive ganks shut him down before items.", text_th: "Arc อ่อนแอและพึ่งการฟาร์มช่วงต้น การแกงค์ดุดันจึงกดเขาก่อนมีของ" },
  ],
  batrider: [
    { kind: "offense", ability: "Flaming Lasso", text: "Flaming Lasso drags a key target into the team with no way to break free.", text_th: "Flaming Lasso ลากเป้าหมายสำคัญเข้าหาทีมโดยไม่มีทางหลุด" },
    { kind: "defense", ability: "Linken's / BKB", text: "Linken's blocks Lasso and BKB lets the target ignore it entirely.", text_th: "Linken's บล็อก Lasso และ BKB ทำให้เป้ากันได้ทั้งหมด" },
  ],
  beastmaster: [
    { kind: "offense", ability: "Primal Roar", text: "Primal Roar is a long stun that isolates a target and pushes others aside.", text_th: "Primal Roar คือสตันยาวที่แยกเป้าหมายและดันคนอื่นออกไป" },
    { kind: "defense", ability: "Clear the summons", text: "Mjollnir and AoE wipe his hawks and boars, removing his vision and pressure.", text_th: "Mjollnir และ AoE ล้างเหยี่ยวและหมูป่าของเขา ลบการมองเห็นและแรงกดดัน" },
  ],
  bounty_hunter: [
    { kind: "offense", ability: "Track", text: "Track reveals an invisible target, grants gold, and speeds allies for a pickoff.", text_th: "Track เปิดเผยเป้าที่ล่องหน ให้ทอง และเร่งความเร็วเพื่อนเพื่อเก็บเป้า" },
    { kind: "defense", ability: "Detection", text: "Sentries and dust strip Shadow Walk, leaving a fragile hero exposed.", text_th: "Sentry และ dust ลอก Shadow Walk ทำให้ฮีโร่ตัวบางถูกเปิดโล่ง" },
  ],
  brewmaster: [
    { kind: "offense", ability: "Primal Split", text: "Primal Split turns Brewmaster into three spell-immune panda spirits that cyclone and stun.", text_th: "Primal Split เปลี่ยน Brewmaster เป็นวิญญาณแพนด้าสามตัวที่กันเวทย์ ไซโคลนและสตัน" },
    { kind: "defense", ability: "Kill the brewmaster", text: "Bursting him before the Split, or out-DPSing the spirits, ends his fight.", text_th: "เบิร์สต์เขาก่อน Split หรือ DPS ชนะวิญญาณ จบการต่อสู้ของเขา" },
  ],
  broodmother: [
    { kind: "offense", ability: "Spin Web", text: "Spin Web gives huge regen and movement, letting her overwhelm a lane with spiderlings.", text_th: "Spin Web ให้การฟื้นเลือดและความเร็วมหาศาล ทำให้เธอถล่มเลนด้วยสไปเดอร์ลิง" },
    { kind: "defense", ability: "AoE clear", text: "AoE spells clear her spiderlings and tower defense shuts down her early push.", text_th: "สกิล AoE ล้างสไปเดอร์ลิงของเธอ และการป้องกันป้อมหยุดการผลักช่วงต้น" },
  ],
  chaos_knight: [
    { kind: "offense", ability: "Phantasm", text: "Phantasm spawns real illusions that pile damage after a Chaos Bolt stun.", text_th: "Phantasm สร้างอิลลูชันจริงที่รุมดาเมจหลังสตันจาก Chaos Bolt" },
    { kind: "defense", ability: "Illusion clear", text: "Mjollnir, Radiance, and AoE delete his Phantasm illusions instantly.", text_th: "Mjollnir, Radiance และ AoE ลบอิลลูชัน Phantasm ของเขาทันที" },
  ],
  chen: [
    { kind: "offense", ability: "Holy Persuasion", text: "Holy Persuasion converts neutral creeps into an early-game pushing army.", text_th: "Holy Persuasion เปลี่ยนครีปกลางเป็นกองทัพผลักช่วงต้นเกม" },
    { kind: "defense", ability: "AoE clear", text: "AoE damage clears his creep army and leaves a squishy support exposed.", text_th: "ดาเมจ AoE ล้างกองทัพครีปของเขา ทำให้ซัพพอร์ตตัวบางถูกเปิดโล่ง" },
  ],
  clinkz: [
    { kind: "offense", ability: "Skeleton Walk", text: "Skeleton Walk lets Clinkz reposition invisibly and burst a target from range.", text_th: "Skeleton Walk ให้ Clinkz ขยับแบบล่องหนและเบิร์สต์เป้าจากระยะไกล" },
    { kind: "defense", ability: "Detection", text: "Sentries, dust, and Gem reveal him; he is extremely fragile once seen.", text_th: "Sentry, dust และ Gem เปิดเผยเขา และเขาตัวบางมากเมื่อถูกเห็น" },
  ],
  rattletrap: [
    { kind: "offense", ability: "Hookshot", text: "Hookshot stuns and pulls Clockwerk to a target, trapping it in Power Cogs.", text_th: "Hookshot สตันและดึง Clockwerk ไปหาเป้า ขังไว้ใน Power Cogs" },
    { kind: "defense", ability: "Force Staff / blink", text: "Force Staff or a blink escapes the Power Cogs prison before Battery Assault ticks.", text_th: "Force Staff หรือ blink หนีจากคุก Power Cogs ก่อนที่ Battery Assault จะลง" },
  ],
  dark_seer: [
    { kind: "offense", ability: "Wall of Replica", text: "Wall of Replica turns the enemy team into illusions that fight for Dark Seer.", text_th: "Wall of Replica เปลี่ยนทีมศัตรูเป็นอิลลูชันที่สู้ให้ Dark Seer" },
    { kind: "defense", ability: "Spread vs Vacuum", text: "Staying spread stops Vacuum + Wall from clumping the team for an easy wipe.", text_th: "การอยู่กระจายหยุด Vacuum + Wall จากการรวบทีมเพื่อล้างง่าย ๆ" },
  ],
  dark_willow: [
    { kind: "offense", ability: "Cursed Crown", text: "Cursed Crown delays an AoE stun, and Bramble Maze roots anyone who walks through.", text_th: "Cursed Crown หน่วงสตัน AoE และ Bramble Maze รูทใครก็ตามที่เดินผ่าน" },
    { kind: "defense", ability: "Catch the escape", text: "Detection and lockdown stop Shadow Realm fade before she bursts from safety.", text_th: "การเปิดแมพและการคุมหยุดการล่องหน Shadow Realm ก่อนที่เธอจะเบิร์สต์จากที่ปลอดภัย" },
  ],
  dawnbreaker: [
    { kind: "offense", ability: "Solar Guardian", text: "Solar Guardian lands anywhere on the map to stun, heal, and turn a fight.", text_th: "Solar Guardian ลงได้ทุกที่บนแมพเพื่อสตัน ฮีล และพลิกการต่อสู้" },
    { kind: "defense", ability: "Heal cut / Break", text: "Spirit Vessel and Break cut the Luminosity healing that keeps her alive.", text_th: "Spirit Vessel และ Break ตัดการฮีลจาก Luminosity ที่ทำให้เธออยู่รอด" },
  ],
  death_prophet: [
    { kind: "offense", ability: "Exorcism", text: "Exorcism unleashes a swarm of spirits that shred heroes and towers alike.", text_th: "Exorcism ปล่อยฝูงวิญญาณที่ฉีกทั้งฮีโร่และป้อม" },
    { kind: "defense", ability: "Lockdown / burst", text: "She is immobile during Exorcism, so lockdown and burst end her before it pays off.", text_th: "เธอเคลื่อนที่ช้าระหว่าง Exorcism การคุมและเบิร์สต์จึงเก็บเธอก่อนที่จะคุ้ม" },
  ],
  dragon_knight: [
    { kind: "offense", ability: "Elder Dragon Form", text: "Dragon Form gives splash, range, and tankiness to siege towers and teamfight.", text_th: "Dragon Form ให้ดาเมจกระจาย ระยะ และความถึกเพื่อตีป้อมและตีทีม" },
    { kind: "defense", ability: "Break / heal cut", text: "Silver Edge's Break removes Dragon Blood's armor and regen, melting his tankiness.", text_th: "Break จาก Silver Edge ลบเกราะและการฟื้นเลือดจาก Dragon Blood ละลายความถึก" },
  ],
  earth_spirit: [
    { kind: "offense", ability: "Boulder Smash", text: "Boulder Smash kicks his stone or an enemy into the team, chaining stuns with Geomagnetic Grip.", text_th: "Boulder Smash เตะหินหรือศัตรูเข้าหาทีม ร้อยสตันกับ Geomagnetic Grip" },
    { kind: "defense", ability: "Spell immunity", text: "BKB ignores his magic-based stuns and silences during his roll-in.", text_th: "BKB กันสตันและไซเลนซ์เวทย์ของเขาระหว่างการกลิ้งเข้ามา" },
  ],
  elder_titan: [
    { kind: "offense", ability: "Natural Order", text: "Natural Order strips enemy armor and magic resistance, amplifying all your team's damage.", text_th: "Natural Order ลดเกราะและความต้านเวทย์ของศัตรู เพิ่มดาเมจให้ทั้งทีม" },
    { kind: "defense", ability: "Kill the Spirit", text: "Damaging his detached Astral Spirit weakens Echo Stomp and his whole kit.", text_th: "การทำดาเมจใส่ Astral Spirit ที่แยกออกไปทำให้ Echo Stomp และสกิลทั้งชุดอ่อนลง" },
  ],
  ember_spirit: [
    { kind: "offense", ability: "Sleight of Fist", text: "Sleight of Fist dashes through enemies dealing damage while dodging all retaliation.", text_th: "Sleight of Fist พุ่งผ่านศัตรูสร้างดาเมจขณะหลบการสวนทั้งหมด" },
    { kind: "defense", ability: "Hex / disable", text: "Hex or a long disable pins Ember before he chains Fire Remnant escapes.", text_th: "Hex หรือการคุมยาวตรึง Ember ก่อนที่เขาจะร้อยการหนีด้วย Fire Remnant" },
  ],
  enchantress: [
    { kind: "offense", ability: "Untouchable", text: "Untouchable slows the attack speed of anyone hitting her, kiting right-click carries.", text_th: "Untouchable ลดความเร็วโจมตีของใครก็ตามที่ตีเธอ ไคต์แครรี่สายตี" },
    { kind: "defense", ability: "Magic burst", text: "Nukers ignore Untouchable and blow up a hero with no escape once caught.", text_th: "สายนุกข้าม Untouchable และเก็บฮีโร่ที่ไม่มีสกิลหนีเมื่อจับได้" },
  ],
  grimstroke: [
    { kind: "offense", ability: "Soulbind", text: "Soulbind chains two heroes so one disable or nuke lands on both at once.", text_th: "Soulbind มัดสองฮีโร่ให้การคุมหรือนุกครั้งเดียวโดนทั้งคู่" },
    { kind: "defense", ability: "Spell immunity", text: "BKB ignores Soulbind and Ink Swell's stun, breaking his combo.", text_th: "BKB กัน Soulbind และสตันจาก Ink Swell ทำลายคอมโบของเขา" },
  ],
  gyrocopter: [
    { kind: "offense", ability: "Flak Cannon", text: "Flak Cannon hits every nearby enemy for a few attacks, shredding grouped teams.", text_th: "Flak Cannon โดนศัตรูรอบข้างทุกตัวเป็นบางการตี ฉีกทีมที่รวมกลุ่ม" },
    { kind: "defense", ability: "Ghost / armor", text: "Ghost Scepter and armor items blunt his all-physical Flak damage.", text_th: "Ghost Scepter และไอเทมเกราะลดทอนดาเมจกายภาพล้วนจาก Flak ของเขา" },
  ],
  hoodwink: [
    { kind: "offense", ability: "Sharpshooter", text: "Sharpshooter charges a long-range piercing snipe with a heavy stun and damage.", text_th: "Sharpshooter ชาร์จการยิงทะลุระยะไกลพร้อมสตันหนักและดาเมจ" },
    { kind: "defense", ability: "Catch her out", text: "Lockdown stops Scurry's tree escape and kills a fragile hero quickly.", text_th: "การคุมหยุดการหนีผ่านต้นไม้ของ Scurry และเก็บฮีโร่ตัวบางได้ไว" },
  ],
  keeper_of_the_light: [
    { kind: "offense", ability: "Illuminate", text: "Illuminate blasts a whole wave or lane from a safe distance and pushes hard.", text_th: "Illuminate ยิงทั้งเวฟหรือเลนจากระยะปลอดภัยและผลักอย่างหนัก" },
    { kind: "defense", ability: "Gap-close the back", text: "KotL is squishy and far back, so a blink or charge ends him fast.", text_th: "KotL ตัวบางและอยู่แถวหลัง blink หรือ charge จึงเก็บเขาได้ไว" },
  ],
  kez: [
    { kind: "offense", ability: "Grappling Claw", text: "Kez switches stances to dash in, parry attacks, and burst a single target down.", text_th: "Kez สลับสแตนซ์เพื่อพุ่งเข้า ปัดการโจมตี และเบิร์สต์เป้าหมายเดี่ยว" },
    { kind: "defense", ability: "Lockdown", text: "A hard disable interrupts his combo and kills a fairly fragile carry.", text_th: "การคุมหนักขัดคอมโบของเขาและเก็บแครรี่ที่ค่อนข้างเปราะ" },
  ],
  kunkka: [
    { kind: "offense", ability: "X Marks the Spot", text: "X Marks the Spot recalls a target into Torrent and Ghostship for a big combo.", text_th: "X Marks the Spot ดึงเป้ากลับเข้า Torrent และ Ghostship เพื่อคอมโบใหญ่" },
    { kind: "defense", ability: "Dodge the combo", text: "BKB or a status dispel removes X Mark before the Torrent and stun land.", text_th: "BKB หรือการดิสเพลลบ X Mark ก่อนที่ Torrent และสตันจะลง" },
  ],
  largo: [
    { kind: "offense", ability: "Heavy disable", text: "Largo controls space and locks down a key target to open the fight for the team.", text_th: "Largo คุมพื้นที่และล็อกเป้าหมายสำคัญเพื่อเปิดการต่อสู้ให้ทีม" },
    { kind: "defense", ability: "Spell immunity", text: "BKB lets cores fight through his disables and tanky frontline.", text_th: "BKB ทำให้คอร์สู้ผ่านการคุมและแนวหน้าที่ถึกของเขา" },
  ],
  leshrac: [
    { kind: "offense", ability: "Diabolic Edict", text: "Diabolic Edict plus Pulse Nova melts everything around Leshrac, towers included.", text_th: "Diabolic Edict บวก Pulse Nova ละลายทุกอย่างรอบ Leshrac รวมถึงป้อม" },
    { kind: "defense", ability: "Lockdown the squishy", text: "He has to stand in the fight to deal damage, so lockdown and burst end him.", text_th: "เขาต้องยืนในการต่อสู้เพื่อออกดาเมจ การคุมและเบิร์สต์จึงเก็บเขาได้" },
  ],
  lich: [
    { kind: "offense", ability: "Chain Frost", text: "Chain Frost bounces between clustered enemies for repeated heavy burst.", text_th: "Chain Frost เด้งระหว่างศัตรูที่รวมกลุ่มเพื่อเบิร์สต์หนักซ้ำ ๆ" },
    { kind: "defense", ability: "Spread out", text: "Spacing out stops Chain Frost from bouncing and limits Lich to one target.", text_th: "การอยู่ห่างกันหยุด Chain Frost ไม่ให้เด้งและจำกัด Lich ไว้ที่เป้าเดียว" },
  ],
  lone_druid: [
    { kind: "offense", ability: "Spirit Bear", text: "The item-carrying Spirit Bear is a tanky right-click monster that pushes and brawls.", text_th: "Spirit Bear ที่ถือไอเทมคือสัตว์ประหลาดสายตีที่ถึก ผลักและตีได้" },
    { kind: "defense", ability: "Kill or split the bear", text: "Killing the bear or separating it from Lone Druid removes most of his power.", text_th: "การเก็บหมีหรือแยกมันจาก Lone Druid ลบพลังส่วนใหญ่ของเขา" },
  ],
  luna: [
    { kind: "offense", ability: "Eclipse", text: "Eclipse rains Lucent Beams on enemies trapped near her in a fight.", text_th: "Eclipse สาด Lucent Beam ใส่ศัตรูที่ติดอยู่ใกล้เธอในการต่อสู้" },
    { kind: "defense", ability: "Lockdown", text: "Short-ranged Luna dies to lockdown and gap-closers before she ramps up.", text_th: "Luna ระยะสั้นตายให้กับการคุมและการเข้าระยะก่อนที่จะแรงขึ้น" },
  ],
  lycan: [
    { kind: "offense", ability: "Shapeshift", text: "Shapeshift gives max move speed and wolves to end games with fast pushes.", text_th: "Shapeshift ให้ความเร็วเดินสูงสุดและหมาป่าเพื่อจบเกมด้วยการผลักไว" },
    { kind: "defense", ability: "Slows / kite", text: "Heavy slows and Force Staff kite the melee wolf pack and stall his push.", text_th: "สโลว์หนักและ Force Staff ไคต์ฝูงหมาป่าสายประชิดและถ่วงการผลักของเขา" },
  ],
  marci: [
    { kind: "offense", ability: "Unleash", text: "Unleash turns Marci into a fast-attacking bruiser that bursts and slows a target.", text_th: "Unleash เปลี่ยน Marci เป็นนักสู้ที่ตีไวซึ่งเบิร์สต์และสโลว์เป้า" },
    { kind: "defense", ability: "Ghost / kite", text: "Ghost Scepter and slows kite her physical Unleash since she must be in melee.", text_th: "Ghost Scepter และสโลว์ไคต์ Unleash กายภาพของเธอ เพราะเธอต้องอยู่ระยะประชิด" },
  ],
  mars: [
    { kind: "offense", ability: "Arena of Blood", text: "Arena of Blood walls off a fight and blocks ranged attacks from outside.", text_th: "Arena of Blood กั้นการต่อสู้และบล็อกการโจมตีระยะไกลจากด้านนอก" },
    { kind: "defense", ability: "Force Staff / blink", text: "Force Staff or a blink escapes the Arena before Spear and allies collapse.", text_th: "Force Staff หรือ blink หนีออกจาก Arena ก่อนที่ Spear และเพื่อนจะรุม" },
  ],
  meepo: [
    { kind: "offense", ability: "Poof", text: "Poof teleports all Meepo clones onto a target Earthbound in place for huge burst.", text_th: "Poof เทเลพอร์ตร่างโคลน Meepo ทั้งหมดใส่เป้าที่ถูก Earthbind เพื่อเบิร์สต์มหาศาล" },
    { kind: "defense", ability: "AoE burst", text: "AoE magic damage hits every clone at once, and killing one kills them all.", text_th: "ดาเมจเวทย์ AoE โดนทุกร่างพร้อมกัน และการเก็บร่างเดียวเก็บได้ทั้งหมด" },
  ],
  mirana: [
    { kind: "offense", ability: "Sacred Arrow", text: "Sacred Arrow lands a long-range stun that sets up picks across the map.", text_th: "Sacred Arrow ลงสตันระยะไกลที่เปิดการเก็บคิลทั่วแมพ" },
    { kind: "defense", ability: "Detection", text: "Dust and sentries reveal the team during Moonlight Shadow's invisibility.", text_th: "Dust และ sentry เปิดเผยทีมระหว่างการล่องหนจาก Moonlight Shadow" },
  ],
  monkey_king: [
    { kind: "offense", ability: "Wukong's Command", text: "Wukong's Command rings a clumped team in spinning clones for sustained AoE.", text_th: "Wukong's Command ล้อมทีมที่รวมกลุ่มด้วยร่างโคลนที่หมุนเพื่อ AoE ต่อเนื่อง" },
    { kind: "defense", ability: "Force him out", text: "AoE and knockbacks push him off his Command ring, cancelling its damage.", text_th: "AoE และการผลักดันเขาออกจากวง Command ยกเลิกดาเมจ" },
  ],
  morphling: [
    { kind: "offense", ability: "Waveform", text: "Waveform dashes through enemies dealing damage and dodging projectiles.", text_th: "Waveform พุ่งผ่านศัตรูสร้างดาเมจและหลบโพรเจกไทล์" },
    { kind: "defense", ability: "Burst before items", text: "Item-reliant Morph is fragile early, and a fast stun chain kills him before Morph.", text_th: "Morph ที่พึ่งไอเทมเปราะช่วงต้น และการร้อยสตันไวเก็บเขาก่อนใช้ Morph" },
  ],
  muerta: [
    { kind: "offense", ability: "Pierce the Veil", text: "Pierce the Veil makes Muerta ignore physical attacks and deal pure magic damage.", text_th: "Pierce the Veil ทำให้ Muerta กันการโจมตีกายภาพและออกดาเมจเวทย์ล้วน" },
    { kind: "defense", ability: "Gap-closers", text: "Immobile Muerta dies to blinks and lockdown once her ult is down.", text_th: "Muerta ที่เคลื่อนที่ช้าตายให้กับ blink และการคุมเมื่ออัลติหมด" },
  ],
  naga_siren: [
    { kind: "offense", ability: "Song of the Siren", text: "Song of the Siren sleeps the whole enemy team for a free reset or initiation.", text_th: "Song of the Siren ทำให้ทีมศัตรูทั้งหมดหลับเพื่อรีเซ็ตหรือเปิดเกมฟรี ๆ" },
    { kind: "defense", ability: "Illusion clear", text: "Mjollnir, Radiance, and AoE shred her Mirror Image wall.", text_th: "Mjollnir, Radiance และ AoE ฉีกกำแพง Mirror Image ของเธอ" },
  ],
  furion: [
    { kind: "offense", ability: "Teleportation", text: "Teleportation lets Nature's Prophet split-push and gank from anywhere on the map.", text_th: "Teleportation ให้ Nature's Prophet split-push และแกงค์จากทุกที่บนแมพ" },
    { kind: "defense", ability: "Catch the rat", text: "He is squishy, so a smoke gank or a blink-stun ends his split-push instantly.", text_th: "เขาตัวบาง การแกงค์ด้วย smoke หรือ blink-stun จึงจบการ split-push ทันที" },
  ],
  night_stalker: [
    { kind: "offense", ability: "Darkness", text: "Darkness forces permanent night, where Night Stalker flies, silences, and hunts.", text_th: "Darkness บังคับให้เป็นกลางคืนถาวร ที่ Night Stalker บิน ไซเลนซ์ และไล่ล่า" },
    { kind: "defense", ability: "Survive the night", text: "His power spikes at night; defensive items and grouping ride out his window.", text_th: "พลังของเขาพุ่งตอนกลางคืน ไอเทมเชิงรับและการรวมกลุ่มช่วยรอดช่วงนั้น" },
  ],
  nyx_assassin: [
    { kind: "offense", ability: "Spiked Carapace", text: "Spiked Carapace reflects and stuns the next attack or spell back at the caster.", text_th: "Spiked Carapace สะท้อนและสตันการโจมตีหรือสกิลถัดไปกลับใส่ผู้ใช้" },
    { kind: "defense", ability: "Detection", text: "Sentries and dust reveal his Vendetta ganks before the burst lands.", text_th: "Sentry และ dust เปิดเผยการแกงค์ Vendetta ของเขาก่อนเบิร์สต์จะลง" },
  ],
  ogre_magi: [
    { kind: "offense", ability: "Fireblast", text: "Fireblast stuns reliably and can multicast for a huge chunk of damage.", text_th: "Fireblast สตันได้แน่นอนและสามารถมัลติคาสต์เพื่อดาเมจก้อนใหญ่" },
    { kind: "defense", ability: "Spell immunity", text: "BKB ignores his magic stun, and he has little to offer against it.", text_th: "BKB กันสตันเวทย์ของเขา และเขาแทบไม่มีอะไรสู้ได้" },
  ],
  oracle: [
    { kind: "offense", ability: "False Promise", text: "False Promise delays all damage and healing, then heals it back to save an ally.", text_th: "False Promise หน่วงดาเมจและการฮีลทั้งหมด แล้วฮีลกลับเพื่อเซฟเพื่อน" },
    { kind: "defense", ability: "Focus / silence", text: "Silencing or bursting fragile Oracle stops the save before it lands.", text_th: "การไซเลนซ์หรือเบิร์สต์ Oracle ที่ตัวบางหยุดการเซฟก่อนที่จะลง" },
  ],
  obsidian_destroyer: [
    { kind: "offense", ability: "Astral Imprisonment", text: "Astral Imprisonment banishes a target out of the fight and steals its intelligence.", text_th: "Astral Imprisonment เนรเทศเป้าออกจากการต่อสู้และขโมยค่า intelligence" },
    { kind: "defense", ability: "Lockdown", text: "OD is immobile; a stun chain kills him before Astral and Sanity's Eclipse.", text_th: "OD เคลื่อนที่ช้า การร้อยสตันเก็บเขาก่อน Astral และ Sanity's Eclipse" },
  ],
  pangolier: [
    { kind: "offense", ability: "Rolling Thunder", text: "Rolling Thunder rolls through and stuns a clumped team, knocking them around.", text_th: "Rolling Thunder กลิ้งผ่านและสตันทีมที่รวมกลุ่ม กระเด็นไปมา" },
    { kind: "defense", ability: "Block the roll", text: "Terrain, stuns, and Cogs stop his roll, and Shield Crash relies on hitting enemies.", text_th: "ภูมิประเทศ สตัน และ Cogs หยุดการกลิ้งของเขา และ Shield Crash พึ่งการชนศัตรู" },
  ],
  phantom_lancer: [
    { kind: "offense", ability: "Juxtapose", text: "Juxtapose floods the fight with an endless army of self-replicating illusions.", text_th: "Juxtapose ถล่มการต่อสู้ด้วยกองทัพอิลลูชันที่แตกตัวเองไม่รู้จบ" },
    { kind: "defense", ability: "AoE clear", text: "Mjollnir, Radiance, Ravage, and Eblade hard-counter his illusion army.", text_th: "Mjollnir, Radiance, Ravage และ Eblade เคาน์เตอร์กองทัพอิลลูชันของเขาอย่างหนัก" },
  ],
  phoenix: [
    { kind: "offense", ability: "Supernova", text: "Supernova stuns nearby enemies and forces them to break it before Phoenix revives.", text_th: "Supernova สตันศัตรูรอบข้างและบังคับให้ทำลายก่อนที่ Phoenix จะฟื้น" },
    { kind: "defense", ability: "Burst the egg", text: "High burst kills the Supernova egg fast, turning his ult into a death.", text_th: "เบิร์สต์สูงเก็บไข่ Supernova ได้ไว เปลี่ยนอัลติของเขาเป็นความตาย" },
  ],
  primal_beast: [
    { kind: "offense", ability: "Pulverize", text: "Pulverize grabs and repeatedly stuns a target while Trample tanks Primal Beast up.", text_th: "Pulverize จับและสตันเป้าซ้ำ ๆ ขณะที่ Trample ทำให้ Primal Beast ถึกขึ้น" },
    { kind: "defense", ability: "Linken's / Lotus", text: "Linken's blocks Pulverize and Lotus Orb reflects it back at him.", text_th: "Linken's บล็อก Pulverize และ Lotus Orb สะท้อนกลับใส่เขา" },
  ],
  puck: [
    { kind: "offense", ability: "Dream Coil", text: "Dream Coil tethers and stuns a clumped team, punishing anyone who breaks free.", text_th: "Dream Coil ตรึงและสตันทีมที่รวมกลุ่ม ลงโทษใครก็ตามที่หลุดออก" },
    { kind: "defense", ability: "Catch the phase", text: "Lockdown that lands through Phase Shift kills slippery, fragile Puck.", text_th: "การคุมที่ลงทะลุ Phase Shift เก็บ Puck ที่ลื่นและตัวบาง" },
  ],
  pugna: [
    { kind: "offense", ability: "Nether Ward", text: "Nether Ward punishes every enemy spell cast with heavy damage, and Decrepify isolates.", text_th: "Nether Ward ลงโทษทุกการร่ายสกิลของศัตรูด้วยดาเมจหนัก และ Decrepify แยกเป้า" },
    { kind: "defense", ability: "Lockdown the squishy", text: "Pugna is fragile, so locking him down stops Life Drain and his tower push.", text_th: "Pugna เปราะบาง การล็อกเขาหยุด Life Drain และการผลักป้อม" },
  ],
  razor: [
    { kind: "offense", ability: "Static Link", text: "Static Link steals a target's damage, crippling an enemy carry while empowering Razor.", text_th: "Static Link ขโมยดาเมจของเป้า ทำให้แครรี่ศัตรูอ่อนลงขณะเสริม Razor" },
    { kind: "defense", ability: "Range / kite", text: "Short-ranged Razor is kited by longer-range cores he cannot keep a Link on.", text_th: "Razor ระยะสั้นถูกไคต์โดยคอร์ระยะไกลที่เขารักษา Link ไว้ไม่ได้" },
  ],
  riki: [
    { kind: "offense", ability: "Smoke Screen", text: "Smoke Screen silences and miss-chances a group while Riki backstabs from invisibility.", text_th: "Smoke Screen ไซเลนซ์และทำให้พลาดทั้งกลุ่ม ขณะที่ Riki แทงหลังจากการล่องหน" },
    { kind: "defense", ability: "Detection", text: "Dust, sentries, and Gem fully shut down a hero built around permanent invisibility.", text_th: "Dust, sentry และ Gem ปิดฮีโร่ที่สร้างมาเพื่อการล่องหนถาวรได้สนิท" },
  ],
  ringmaster: [
    { kind: "offense", ability: "Tame the Beasts", text: "Tame the Beasts tangles and disables enemies while Ringmaster sets traps and tricks.", text_th: "Tame the Beasts พันและคุมศัตรูขณะที่ Ringmaster วางกับดักและลูกเล่น" },
    { kind: "defense", ability: "Spell immunity", text: "BKB lets cores ignore his disables and trap-based control.", text_th: "BKB ทำให้คอร์กันการคุมและการควบคุมด้วยกับดักของเขา" },
  ],
  shadow_demon: [
    { kind: "offense", ability: "Disruption", text: "Disruption banishes a target and spawns illusions, setting up a Demonic Purge pickoff.", text_th: "Disruption เนรเทศเป้าและสร้างอิลลูชัน เปิดการเก็บด้วย Demonic Purge" },
    { kind: "defense", ability: "Spell immunity", text: "BKB ignores Demonic Purge's slow and Disruption's control.", text_th: "BKB กันสโลว์จาก Demonic Purge และการควบคุมจาก Disruption" },
  ],
  shadow_shaman: [
    { kind: "offense", ability: "Shackles", text: "Shackles channels a long single-target stun, chained with Hex for total lockdown.", text_th: "Shackles ร่ายสตันเดี่ยวยาว ร้อยกับ Hex เพื่อคุมเบ็ดเสร็จ" },
    { kind: "defense", ability: "BKB / interrupt", text: "BKB ignores his disables and any stun interrupts the channelled Shackles.", text_th: "BKB กันการคุมของเขา และสตันใด ๆ ขัด Shackles ที่ต้องร่ายค้าง" },
  ],
  slark: [
    { kind: "offense", ability: "Essence Shift", text: "Essence Shift permanently steals stats per hit, snowballing Slark off any kill.", text_th: "Essence Shift ขโมยสเตตัสถาวรต่อการตี ทำให้ Slark สโนว์บอลจากทุกการเก็บ" },
    { kind: "defense", ability: "Detection / lockdown", text: "Dust reveals Shadow Dance and lockdown holds him still before he escapes into the dark.", text_th: "Dust เปิดเผย Shadow Dance และการคุมตรึงเขาไว้ก่อนที่จะหนีเข้าความมืด" },
  ],
  snapfire: [
    { kind: "offense", ability: "Mortimer Kisses", text: "Mortimer Kisses rains slowing globs from long range to zone and burst a team.", text_th: "Mortimer Kisses สาดก้อนกระสุนสโลว์จากระยะไกลเพื่อกันพื้นที่และเบิร์สต์ทีม" },
    { kind: "defense", ability: "Gap-close her", text: "She is squishy, so a blink or charge ends her before Scatterblast stuns.", text_th: "เธอตัวบาง blink หรือ charge จึงเก็บเธอก่อนที่ Scatterblast จะสตัน" },
  ],
  techies: [
    { kind: "offense", ability: "Proximity Mines", text: "Proximity Mines zone the map and delete unwary heroes who walk into them.", text_th: "Proximity Mines กันพื้นที่ทั่วแมพและเก็บฮีโร่ที่เผลอเดินเข้าไป" },
    { kind: "defense", ability: "Detection / sustain", text: "Gem, sentries, and high regen clear mines and survive his burst.", text_th: "Gem, sentry และการฟื้นเลือดสูงเคลียร์ระเบิดและรอดจากเบิร์สต์ของเขา" },
  ],
  shredder: [
    { kind: "offense", ability: "Reactive Armor", text: "Reactive Armor stacks armor and regen per hit, letting Timbersaw win attrition fights.", text_th: "Reactive Armor สะสมเกราะและการฟื้นเลือดต่อการตี ให้ Timbersaw ชนะการต่อสู้ระยะยาว" },
    { kind: "defense", ability: "Pure damage / Break", text: "Pure damage and Break (Silver Edge) bypass Reactive Armor and melt him.", text_th: "Pure damage และ Break (Silver Edge) ข้าม Reactive Armor และละลายเขา" },
  ],
  tinker: [
    { kind: "offense", ability: "Rearm", text: "Rearm resets his spells, letting Tinker chain Laser and missiles to delete heroes.", text_th: "Rearm รีเซ็ตสกิลของเขา ให้ Tinker ร้อย Laser และมิสไซล์เพื่อลบฮีโร่" },
    { kind: "defense", ability: "Gap-closers", text: "A blink or charge reaches no-escape Tinker, who is extremely squishy up close.", text_th: "blink หรือ charge เข้าถึง Tinker ที่ไม่มีสกิลหนี ซึ่งตัวบางมากในระยะประชิด" },
  ],
  treant: [
    { kind: "offense", ability: "Overgrowth", text: "Overgrowth roots an entire clumped team in place for the team to pile on.", text_th: "Overgrowth รูททีมที่รวมกลุ่มทั้งหมดให้อยู่กับที่เพื่อให้ทีมรุม" },
    { kind: "defense", ability: "Spell immunity", text: "BKB walks out of Overgrowth and ignores his Leech Seed control.", text_th: "BKB เดินออกจาก Overgrowth และกันการควบคุมจาก Leech Seed" },
  ],
  abyssal_underlord: [
    { kind: "offense", ability: "Pit of Malice", text: "Pit of Malice repeatedly roots anyone inside, holding a team in Firestorm damage.", text_th: "Pit of Malice รูทใครก็ตามที่อยู่ข้างในซ้ำ ๆ ตรึงทีมไว้ในดาเมจ Firestorm" },
    { kind: "defense", ability: "Spell immunity", text: "BKB ignores Pit of Malice's root and lets cores fight through his zone.", text_th: "BKB กันการรูทจาก Pit of Malice และให้คอร์สู้ผ่านพื้นที่ของเขา" },
  ],
  undying: [
    { kind: "offense", ability: "Tombstone", text: "Tombstone spawns a zombie horde that slows and chases the whole enemy team.", text_th: "Tombstone สร้างฝูงซอมบี้ที่สโลว์และไล่ทีมศัตรูทั้งหมด" },
    { kind: "defense", ability: "Kill the Tombstone", text: "Focusing down the Tombstone removes the zombies and most of his fight pressure.", text_th: "การโฟกัสเก็บ Tombstone ลบซอมบี้และแรงกดดันส่วนใหญ่ของเขา" },
  ],
  vengefulspirit: [
    { kind: "offense", ability: "Nether Swap", text: "Nether Swap instantly pulls an enemy out of position or saves an ally from danger.", text_th: "Nether Swap ดึงศัตรูออกจากตำแหน่งทันที หรือเซฟเพื่อนจากอันตราย" },
    { kind: "defense", ability: "Linken's Sphere", text: "Linken's Sphere blocks Nether Swap, denying her signature initiation.", text_th: "Linken's Sphere บล็อก Nether Swap ปฏิเสธการเปิดเกมเอกลักษณ์ของเธอ" },
  ],
  venomancer: [
    { kind: "offense", ability: "Poison Nova", text: "Poison Nova blankets a fight in heavy damage-over-time that softens the whole team.", text_th: "Poison Nova ปกคลุมการต่อสู้ด้วยดาเมจต่อเนื่องหนัก ๆ ที่ทำให้ทั้งทีมอ่อนลง" },
    { kind: "defense", ability: "Heal cut for him?", text: "BKB and strong dispels (Manta, Satanic) clear his poisons and Plague Ward slows.", text_th: "BKB และการดิสเพลแรง ๆ (Manta, Satanic) ล้างพิษและสโลว์จาก Plague Ward ของเขา" },
  ],
  visage: [
    { kind: "offense", ability: "Familiars", text: "Summoned Familiars stun from the air and shred armored targets with their attacks.", text_th: "Familiars ที่เรียกออกมาสตันจากอากาศและฉีกเป้าหมายที่มีเกราะด้วยการตี" },
    { kind: "defense", ability: "Clear the birds", text: "AoE and Mjollnir kill his Familiars, stripping most of Visage's damage and control.", text_th: "AoE และ Mjollnir เก็บ Familiars ของเขา ลบดาเมจและการควบคุมส่วนใหญ่ของ Visage" },
  ],
  void_spirit: [
    { kind: "offense", ability: "Dissimilate", text: "Dissimilate blinks Void Spirit between portals to dodge damage and reposition the burst.", text_th: "Dissimilate blink Void Spirit ระหว่างพอร์ทัลเพื่อหลบดาเมจและจัดตำแหน่งเบิร์สต์" },
    { kind: "defense", ability: "Mana burn / lockdown", text: "Mana pressure and a stun once his escape is down end a mana-reliant hero.", text_th: "แรงกดดันมานาและสตันเมื่อสกิลหนีหมด เก็บฮีโร่ที่พึ่งมานา" },
  ],
  winter_wyvern: [
    { kind: "offense", ability: "Winter's Curse", text: "Winter's Curse turns the enemy team's attacks onto its own cursed ally.", text_th: "Winter's Curse หันการโจมตีของทีมศัตรูให้ใส่เพื่อนที่ถูกสาปของตัวเอง" },
    { kind: "defense", ability: "Spell immunity", text: "BKB on the cursed target breaks Winter's Curse early.", text_th: "BKB บนเป้าที่ถูกสาปทำลาย Winter's Curse ก่อนเวลา" },
  ],
  skeleton_king: [
    { kind: "offense", ability: "Reincarnation", text: "Reincarnation revives Wraith King on the spot, forcing the enemy to kill him twice.", text_th: "Reincarnation ชุบชีวิต Wraith King ทันที บังคับให้ศัตรูต้องเก็บเขาสองครั้ง" },
    { kind: "defense", ability: "Mana burn / kite", text: "Mana burn denies Reincarnation, and kiting beats a no-escape melee carry.", text_th: "Mana burn ปฏิเสธ Reincarnation และการไคต์ชนะแครรี่สายประชิดที่ไม่มีสกิลหนี" },
  ],
};
