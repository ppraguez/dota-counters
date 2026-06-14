/**
 * Curated, hand-written "signature" phrases for iconic heroes.
 *
 * These are OPTIONAL flavour on top of the generic tag-based rules engine. Each phrase is a
 * grammatical *predicate* that reads naturally after the hero's name:
 *   threat   -> "{Hero} {threat}."        e.g. "Axe punishes melee attackers with Counter Helix"
 *   setup    -> "{Hero} {setup}, ..."     e.g. "Crystal Maiden chains a long-range stun"
 *   weakness -> "..., and {Hero} {weakness}."  e.g. "Anti-Mage is fragile and dies to lockdown"
 *
 * Keys are the Steam hero slug (internal name without the "npc_dota_hero_" prefix). Any hero
 * not listed here simply falls back to the generic role/attribute templates in reasons.ts, so
 * this map can grow over time without touching the engine.
 */
export interface HeroSignature {
  threat?: string;
  setup?: string;
  weakness?: string;
}

export const SIGNATURES: Record<string, HeroSignature> = {
  axe: {
    threat: "punishes melee attackers with Counter Helix and forces fights with Berserker's Call",
    setup: "locks enemies in Berserker's Call for the team to pile damage onto",
  },
  antimage: {
    threat: "burns away the mana of spell-reliant heroes and blinks out of danger",
    weakness: "is fragile early and hates being caught by lockdown",
  },
  crystal_maiden: {
    setup: "chains a long-range stun and feeds the team mana",
    weakness: "is slow, squishy, and easily killed once caught",
  },
  lina: {
    threat: "deletes squishy targets with huge single-target burst",
    setup: "follows up stuns with massive magical and physical burst",
    weakness: "is fragile and dies quickly to early lockdown",
  },
  lion: {
    threat: "chains two disables into a point-blank Finger of Death execute",
    setup: "provides reliable lockdown to set up kills",
    weakness: "is extremely squishy with no escape",
  },
  juggernaut: {
    threat: "ignores disables during Blade Fury and Omnislash to dodge ganks",
    weakness: "can be kited and burst before Omnislash comes online",
  },
  pudge: {
    threat: "yanks a single target out of position with Hook and Dismember",
    setup: "drags priority targets into the team with Meat Hook",
  },
  invoker: {
    threat: "combos Sun Strike, Meteor and a chain stun for huge AoE burst",
    weakness: "is slow to come online and vulnerable to early aggression",
  },
  phantom_assassin: {
    threat: "blinks onto carries and crits them down before they can react",
    weakness: "is countered by armor, evasion break, and burst before items",
  },
  legion_commander: {
    threat: "forces an inescapable 1v1 with Duel and snowballs the damage",
    weakness: "can be kited and bursted once Duel is on cooldown",
  },
  nevermore: {
    threat: "shreds armor and bursts targets down with stacked Souls",
    weakness: "is fragile and easily disrupted out of his ultimate",
  },
  sven: {
    threat: "stuns then cleaves entire teams during God's Strength",
    setup: "opens fights with Storm Hammer for allies to follow up",
  },
  tidehunter: {
    threat: "flips fights with the AoE Ravage stun and tanks return damage",
    setup: "lands a multi-target Ravage that allies can immediately follow up",
  },
  enigma: {
    threat: "catches grouped enemies in Black Hole for the team to delete",
    setup: "channels a massive AoE disable for follow-up damage",
    weakness: "is helpless if interrupted before Black Hole lands",
  },
  faceless_void: {
    threat: "freezes a fight inside Chronosphere and dodges damage with Time Walk",
    setup: "traps multiple enemies in Chronosphere for the team to burst",
  },
  earthshaker: {
    threat: "combos Echo Slam off blink to wipe clustered teams",
    setup: "opens with Fissure and Echo Slam for huge follow-up burst",
  },
  tiny: {
    threat: "tosses and stuns a single target for instant burst",
    setup: "tosses an enemy into the team and stuns for follow-up",
  },
  bane: {
    threat: "single-handedly removes a hero from the fight with Fiend's Grip",
    setup: "disables a key target for the duration of a teamfight",
  },
  witch_doctor: {
    setup: "locks a target in Maledict and Paralyzing Cask stuns for follow-up",
    weakness: "is squishy and easy to blow up once focused",
  },
  zuus: {
    threat: "chunks the whole enemy team with no-counterplay magical nukes",
    weakness: "has no escape and folds to gap-closers",
  },
  sniper: {
    threat: "kills from extreme range before melee heroes can close in",
    weakness: "has no escape and dies instantly to any gap-closer",
  },
  drow_ranger: {
    threat: "kites melee heroes with Gust silence and long-range physical damage",
    weakness: "is helpless when gap-closed and her aura drops near enemies",
  },
  bloodseeker: {
    threat: "punishes fleeing or spell-casting heroes with Rupture and Thirst",
    weakness: "relies on Rupture and can be locked down before he ramps up",
  },
  spirit_breaker: {
    threat: "charges across the map to stun and isolate a single target",
    setup: "opens fights with a guaranteed long-range Charge stun",
  },
  slardar: {
    threat: "blinks, stuns, and shreds armor to amplify physical damage",
    setup: "reduces a target's armor with Corrosive Haze for the carry",
  },
  ursa: {
    threat: "melts single targets with stacking Fury Swipes once locked on",
    weakness: "is kited easily and has no answer to being disabled at range",
  },
  bristleback: {
    threat: "shrugs off frontal damage and snowballs with Quill stacks",
    weakness: "struggles against magical burst and percent-based damage",
  },
  huskar: {
    threat: "dives low-health heroes and gets stronger the lower his HP",
    weakness: "is melted by pure damage and break effects like Silver Edge",
  },
  viper: {
    threat: "slows and corrodes armor, winning every early lane trade",
    weakness: "is slow with no escape once enemies build mobility",
  },
  windrunner: {
    threat: "locks a single target in Shackleshot and focuses it down",
    setup: "roots a key target with Shackleshot for the team to kill",
  },
  templar_assassin: {
    threat: "bursts squishy heroes through her Refraction-protected dives",
    weakness: "is shut down by detection and AoE that strips Refraction",
  },
  queenofpain: {
    threat: "blinks in, bursts a target, and blinks out before retaliation",
    weakness: "is fragile and dies to lockdown that pins her in place",
  },
  storm_spirit: {
    threat: "zips around the map with Ball Lightning to pick off stragglers",
    weakness: "is mana-dependent and can be burst before he gets going",
  },
  doom_bringer: {
    threat: "silences and disarms a key hero for a full 16 seconds with Doom",
    setup: "removes one hero from the fight entirely with Doom",
  },
  silencer: {
    threat: "shuts down spell-reliant teams with Global Silence",
    setup: "denies the enemy's combo with a global silence",
  },
  skywrath_mage: {
    threat: "deletes squishy heroes with stacked magical burst and a silence",
    setup: "silences and amplifies magic damage for a kill",
    weakness: "is one of the squishiest heroes and dies to any lockdown",
  },
  rubick: {
    threat: "steals and turns the enemy's best spell against them",
    setup: "lifts a target with Telekinesis to set up follow-up",
  },
  magnataur: {
    threat: "Reverse Polarity stuns a clumped team for a guaranteed wipe",
    setup: "clumps and stuns the enemy team with Reverse Polarity",
  },
  tusk: {
    setup: "rolls in, punches a target back, and traps it for the team",
    threat: "isolates a target with Snowball and Walrus Punch",
  },
  necrolyte: {
    threat: "out-sustains enemies and executes low-health heroes with Reaper's Scythe",
    weakness: "is slow and easy to kite before he ramps up",
  },
  dazzle: {
    setup: "keeps allies alive through Shallow Grave and shreds armor with Weave",
    weakness: "is squishy and must be focused before he can save the carry",
  },
  omniknight: {
    setup: "saves allies with Guardian Angel and Purification heals",
    threat: "makes a carry immune to physical damage during fights",
  },
  wisp: {
    setup: "teleports a core into the fight and overheals it with Tether",
  },
  warlock: {
    setup: "binds enemies together and drops a Golem into the chaos",
    threat: "amplifies a clumped fight with Fatal Bonds and a Golem",
  },
  jakiro: {
    threat: "zones teams off objectives with layered AoE damage",
    setup: "stuns and slows a clustered enemy team with Macropyre and Ice Path",
  },
  disruptor: {
    setup: "traps enemies in Static Storm and Kinetic Field for a guaranteed combo",
    threat: "silences and pins a whole team inside Static Storm",
  },
  centaur: {
    threat: "blinks in with a huge Hoof Stomp and returns damage to attackers",
    setup: "opens with an AoE Hoof Stomp stun for follow-up",
  },
  sand_king: {
    threat: "blinks in for an AoE Epicenter and Burrowstrike stun",
    setup: "stuns a clumped team with Burrowstrike for follow-up",
  },
  spectre: {
    threat: "punishes teamfights with global Haunt pressure and ramping damage",
    weakness: "is weak early and can be shut down before she farms up",
  },
  medusa: {
    threat: "out-sustains physical fights with Mana Shield and Stone Gaze",
    weakness: "is immobile and folds to magical burst and lockdown",
  },
  troll_warlord: {
    threat: "out-DPSes other carries and self-disables with Battle Trance",
    weakness: "is melee with no escape and dies to kiting and lockdown",
  },
  life_stealer: {
    threat: "dives and chases with Rage immunity and percent-based damage",
    weakness: "is purely melee and is kited by slows and disengage",
  },
  terrorblade: {
    threat: "shreds armor with illusions and Metamorphosis right-clicks",
    weakness: "is extremely fragile early and dies to ganks before items",
  },
  weaver: {
    threat: "swaps back in time to dodge burst and harasses from range",
    weakness: "dies to detection and AoE that catches him out of Shukuchi",
  },
  abaddon: {
    threat: "shrugs off focus with Aphotic Shield and Borrowed Time",
    setup: "shields and heals an ally with Aphotic Shield",
  },
  alchemist: {
    threat: "stacks Acid Spray and Unstable Concoction while out-farming everyone",
    setup: "stuns with Unstable Concoction and gifts an ally an Aghanim's Scepter",
  },
  ancient_apparition: {
    threat: "snipes from across the map with Ice Blast and shuts off all healing",
    setup: "freezes a target with Cold Feet and shatters it with Ice Blast",
    weakness: "is squishy and immobile with no escape",
  },
  arc_warden: {
    threat: "splits into a Tempest Double to deal double the damage from afar",
    weakness: "is weak early and dies if caught before his items come online",
  },
  batrider: {
    threat: "lassos a target with Flaming Lasso and drags it into the team",
    setup: "Flaming Lasso pulls a key target out of position for the team",
  },
  beastmaster: {
    threat: "summons hawks and boars and locks a target with Primal Roar",
    setup: "Primal Roar stuns and isolates a target for the team to kill",
  },
  bounty_hunter: {
    threat: "tracks targets through invisibility and bursts them with Shuriken Toss",
    weakness: "falls off late and relies on an early snowball",
  },
  brewmaster: {
    threat: "splits into elemental spirits that cyclone and stun during Primal Split",
    setup: "softens a clumped team with Cinder Brew and Thunder Clap before the split",
  },
  broodmother: {
    threat: "overwhelms a lane with spiderlings and webs",
    weakness: "is weak in the early laning stage and vulnerable to AoE",
  },
  chaos_knight: {
    threat: "stuns with Chaos Bolt and overwhelms with Phantasm illusions",
    setup: "lands a long Chaos Bolt stun for the team to pile onto",
  },
  chen: {
    setup: "heals allies globally and converts neutral creeps into an army",
    weakness: "is helpless if his creeps die and he is caught out",
  },
  clinkz: {
    threat: "burns targets down from range while invisible with Skeleton Walk",
    weakness: "is extremely fragile and dies to detection and burst",
  },
  rattletrap: {
    threat: "hooks in with Hookshot and pins a target alone with Power Cogs and Battery Assault",
    setup: "traps a target in Power Cogs for the team",
  },
  dark_seer: {
    threat: "walls off fights with Wall of Replica and snowballs with Ion Shell",
    setup: "clumps the enemy team with Vacuum for AoE follow-up",
  },
  dark_willow: {
    threat: "locks a target with Bramble Maze and Cursed Crown, then bursts it down",
    setup: "stuns a clumped team with Cursed Crown and Bramble Maze",
  },
  dawnbreaker: {
    threat: "leaps across the map with Solar Guardian and heals through fights",
    setup: "stuns and heals allies from anywhere with Solar Guardian",
  },
  death_prophet: {
    threat: "pushes towers and melts targets with a swarm of Exorcism spirits",
    weakness: "is immobile during Exorcism and vulnerable to burst",
  },
  dragon_knight: {
    threat: "tanks fights in Dragon Form and stuns with Dragon Tail",
    setup: "stuns a target with Dragon Tail for the team to follow up",
  },
  earth_spirit: {
    threat: "rolls in with Rolling Boulder and chains Geomagnetic Grip and Boulder Smash stuns",
    setup: "kicks and pulls enemies into the team with Boulder Smash",
  },
  elder_titan: {
    threat: "shreds armor with Natural Order and stuns with Echo Stomp",
    setup: "sets up a clumped team with Echo Stomp and Earth Splitter",
  },
  ember_spirit: {
    threat: "dashes around with Sleight of Fist and Fire Remnant to dodge and burst",
    weakness: "is mana-hungry and can be locked down before he gets going",
  },
  enchantress: {
    threat: "kites with Impetus while tanking with healing and creeps",
    weakness: "is squishy if caught without distance",
  },
  grimstroke: {
    threat: "binds two enemies together with Soulbind and silences with Ink Swell",
    setup: "chains two targets with Soulbind so the team's disables hit both",
  },
  gyrocopter: {
    threat: "clears waves and teams with Flak Cannon and Call Down",
    setup: "slows and reveals a clumped team with Call Down",
  },
  hoodwink: {
    threat: "snipes from range with Sharpshooter and escapes through the trees",
    weakness: "is fragile and dies if her escape is cut off",
  },
  keeper_of_the_light: {
    threat: "blasts a lane with Illuminate and recharges the team's mana",
    setup: "disrupts and blinds the enemy team with Will-O-Wisp and Blinding Light",
  },
  kez: {
    threat: "switches stances to dash, parry, and burst single targets",
    weakness: "is fragile and relies on landing his combo cleanly",
  },
  kunkka: {
    threat: "combos Torrent, X Marks the Spot, and Ghostship for huge AoE burst",
    setup: "sets a target up with X Marks the Spot and Torrent for the team",
  },
  largo: {
    threat: "controls space and tanks the frontline with heavy disables",
    setup: "lands a heavy disable to open the fight for the team",
  },
  leshrac: {
    threat: "melts everything around him with Diabolic Edict and Pulse Nova",
    setup: "pins a clumped team with Split Earth and Lightning Storm",
  },
  lich: {
    threat: "bounces Chain Frost between clustered enemies for massive burst",
    setup: "protects and sets up for the team with Frost Shield and Sinister Gaze",
  },
  lone_druid: {
    threat: "snowballs with a tanky Spirit Bear that carries the items",
    weakness: "is weak himself if the Spirit Bear is killed or split off",
  },
  luna: {
    threat: "bounces Lucent Beams and clears teams with Moon Glaives and Eclipse",
    weakness: "is short-ranged for a carry and dies to lockdown",
  },
  lycan: {
    threat: "transforms into a wolf pack and pushes objectives relentlessly",
    weakness: "is kited by slows and falls off if the game stalls",
  },
  marci: {
    threat: "bursts a target with Unleash and rebounds in with Dispose",
    setup: "tosses an enemy into the team with Dispose and buffs an ally with Sidekick",
  },
  mars: {
    threat: "spears enemies into Arena of Blood and blocks ranged attacks",
    setup: "walls a fight off with Arena of Blood and pins a target with Spear",
  },
  meepo: {
    threat: "swarms with clones that Poof and Earthbind a single target",
    weakness: "dies instantly if one clone is bursted down",
  },
  mirana: {
    threat: "lands a long-range Sacred Arrow stun and bursts with Starstorm",
    setup: "sets up picks with Sacred Arrow and Moonlight Shadow",
  },
  monkey_king: {
    threat: "drops on a clumped team with Wukong's Command and stuns with Boundless Strike",
    setup: "pins a clumped team with Boundless Strike and Wukong's Command",
  },
  morphling: {
    threat: "shifts stats to burst with Adaptive Strike and dodges damage with Waveform",
    weakness: "is item-reliant and dies before he has them",
  },
  muerta: {
    threat: "kills from range and ignores physical attacks during Pierce the Veil",
    weakness: "is immobile and dies to gap-closers and lockdown",
  },
  naga_siren: {
    threat: "ensnares a target and overwhelms with a wall of illusions",
    setup: "sleeps the enemy team with Song of the Siren to reset or initiate",
  },
  furion: {
    threat: "teleports anywhere to split-push and summons treants",
    weakness: "is squishy and dies if caught without his teleport",
  },
  night_stalker: {
    threat: "owns the night with silence and flight, hunting single targets",
    setup: "silences with Crippling Fear and slows a target with Void for the team",
  },
  nyx_assassin: {
    threat: "blinks in with Impale and Spiked Carapace to punish casters",
    setup: "stuns with Impale and burns a key caster's mana with Mana Burn",
  },
  ogre_magi: {
    threat: "tanks fights and lands multi-cast Fireblast and Ignite",
    setup: "stuns with Fireblast and speeds up an ally with Bloodlust",
  },
  oracle: {
    setup: "saves an ally with False Promise and disarms with Fortune's End",
    weakness: "is squishy and must be stopped before he saves the carry",
  },
  obsidian_destroyer: {
    threat: "bursts with Arcane Orb and removes a target with Astral Imprisonment",
    setup: "imprisons a target with Astral and nukes the team with Sanity's Eclipse",
  },
  pangolier: {
    threat: "rolls through the team with Rolling Thunder and Swashbuckle",
    setup: "stuns a clumped team with Rolling Thunder for follow-up",
  },
  phantom_lancer: {
    threat: "drowns the enemy in an endless army of illusions",
    weakness: "is weak before items and dies to AoE that clears illusions",
  },
  phoenix: {
    threat: "dives with Icarus Dive and stuns the team inside Supernova",
    setup: "forces the fight on the team's terms with Supernova and Sun Ray",
  },
  primal_beast: {
    threat: "stomps in with Pulverize and Trample to crush a target",
    setup: "stuns with Pulverize and pins a target with Onslaught for the team",
  },
  puck: {
    threat: "phases in and out with Illusory Orb and Phase Shift, then silences with Dream Coil",
    setup: "tethers and stuns a clumped team with Dream Coil",
  },
  pugna: {
    threat: "shreds towers and burns mana with Nether Blast and Life Drain",
    weakness: "is squishy and dies to lockdown before he drains a target",
  },
  razor: {
    threat: "steals damage with Static Link and chases with Plasma Field",
    weakness: "is short-ranged and kited if he cannot link a target",
  },
  riki: {
    threat: "stays permanently invisible, blinks behind a target and Smoke Screens it",
    weakness: "is shut down entirely by detection and AoE",
  },
  ringmaster: {
    threat: "tangles the enemy with Tame the Beasts and Escape Act tricks",
    setup: "locks targets for the team with Spike Trap and Tame the Beasts",
  },
  shadow_demon: {
    threat: "isolates a target with Disruption and slows it to a crawl with Demonic Purge",
    setup: "locks a target with Disruption and Demonic Purge for the team to delete",
  },
  shadow_shaman: {
    threat: "chains Shackles and Hex while pushing with Mass Serpent Ward",
    setup: "locks a target down with Hex and Shackles for the team",
  },
  slark: {
    threat: "steals stats with Essence Shift and escapes in the dark with Shadow Dance",
    weakness: "is weak early and dies if caught before he snowballs",
  },
  snapfire: {
    threat: "bursts from range with Mortimer Kisses and stuns with Scatterblast",
    setup: "hops and stuns a target with Firesnap Cookie for the team",
  },
  techies: {
    threat: "litters the map with mines and bursts targets with Blast Off",
    setup: "disarms with Reactive Tazer and zones the enemy team with mines",
  },
  shredder: {
    threat: "shrugs off damage with Reactive Armor and chains Timber Chain",
    weakness: "struggles against pure damage and break effects",
  },
  tinker: {
    threat: "rearms to spam Laser and missiles, deleting heroes from afar",
    weakness: "is extremely squishy and dies to any gap-closer",
  },
  treant: {
    threat: "heals allies invisibly and roots a target with Overgrowth",
    setup: "roots a clumped team with Overgrowth for the team to follow up",
  },
  abyssal_underlord: {
    threat: "controls space with Firestorm and Pit of Malice while tanking fights",
    setup: "traps a clumped team with Pit of Malice for follow-up",
  },
  undying: {
    threat: "drains strength with Decay and tanks fights with a Tombstone zombie horde",
    setup: "softens and slows the enemy team with Decay and Tombstone",
  },
  vengefulspirit: {
    threat: "swaps a target out of position with Nether Swap and shreds its armor",
    setup: "stuns with Magic Missile and shreds armor with Wave of Terror for the team",
  },
  venomancer: {
    threat: "blankets fights in Poison Nova and Plague Wards",
    setup: "slows and zones the enemy team with Venomous Gale and wards",
  },
  visage: {
    threat: "swarms with Familiars that stun and shred armored targets",
    weakness: "is immobile and loses power if his Familiars die",
  },
  void_spirit: {
    threat: "blinks through the fight with Dissimilate and bursts with Resonant Pulse",
    weakness: "is mana-reliant and vulnerable once his escape is down",
  },
  winter_wyvern: {
    setup: "curses a target with Winter's Curse, turning the team's damage onto it",
    weakness: "is slow and squishy if caught out of position",
  },
  skeleton_king: {
    threat: "stuns with Wraithfire Blast and fights through death with Reincarnation",
    weakness: "is kited and useless while Reincarnation is on cooldown",
  },
};
