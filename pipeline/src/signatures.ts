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
};
