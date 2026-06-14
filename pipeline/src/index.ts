/**
 * Pipeline entry point (`npm run fetch-data`).
 *
 * Steps:
 *   1. Fetch the hero list and derive tags for every hero.
 *   2. Detect the current patch and reconcile patchState.json.
 *   3. For each hero, fetch its matchups (rate-limited) and compute counter/countered-by deltas.
 *   4. Compute rules-based synergies for every hero pair.
 *   5. Write data/heroData.json.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { config, iconUrl } from "./config.js";
import {
  fetchHeroes,
  fetchMatchups,
  fetchCurrentPatch,
  fetchItemPopularity,
  fetchItemConstants,
} from "./opendota.js";
import { buildTagIndex } from "./heroTags.js";
import { counterReason, synergyReason } from "./reasons.js";
import { counterReasonTh, synergyReasonTh } from "./reasonsTh.js";
import { synergyScore } from "./synergy.js";
import { resolvePatchState, loadStoredPatchState } from "./patch.js";
import { readMatchupCache, writeMatchupCache } from "./matchupsCache.js";
import { buildItemCounters } from "./itemCounters.js";
import { CURATED_MECHANIC_KEYS } from "./heroMechanics.js";
import {
  buildIndexFromConstants,
  selectBuildItems,
  saveItemIndexCache,
  loadItemIndexCache,
  type ItemIndex,
} from "./itemBuilds.js";
import { readPopularityCache, writePopularityCache } from "./itemPopularityCache.js";
import type { OpenDotaItemPopularity, RecommendedItemEntry } from "./types.js";
import type {
  CounterEntry,
  HeroDataFile,
  HeroOutput,
  OpenDotaMatchup,
  SynergyEntry,
} from "./types.js";

/** Optional: process only the first N heroes' matchups (for a fast smoke test). 0 = all. */
const HERO_LIMIT = Number(process.env.HERO_LIMIT ?? 0) || 0;

async function main(): Promise<void> {
  const now = new Date();
  const startedAt = Date.now();
  console.log(`\n▶ Dota counter/synergy pipeline — ${now.toISOString()}`);
  console.log(
    `  config: minGames=${config.minGames}, rateLimit=${config.rateLimitMs}ms, ` +
      `topCounters=${config.maxCountersPerHero}, topSynergies=${config.maxSynergiesPerHero}`,
  );

  // --- 1. Heroes + tags ---
  const heroes = await fetchHeroes();
  console.log(`  fetched ${heroes.length} heroes`);
  const tags = buildTagIndex(heroes);
  const allTagList = [...tags.values()];

  // Sanity-check curated mechanic keys against the real roster so typos surface loudly.
  const validSlugs = new Set(allTagList.map((t) => t.name.replace("npc_dota_hero_", "")));
  const badKeys = CURATED_MECHANIC_KEYS.filter((k) => !validSlugs.has(k));
  if (badKeys.length > 0) {
    console.warn(`  ⚠ curated mechanic keys with no matching hero (typos?): ${badKeys.join(", ")}`);
  }

  // --- 2. Patch detection ---
  // Offline rebuilds reuse the stored patch state instead of hitting the API.
  const patchState = config.matchupsOffline
    ? await loadStoredPatchState(now)
    : await resolvePatchState(await fetchCurrentPatch(), now);
  console.log(
    `  patch: ${patchState.patch} (first seen ${patchState.firstSeen})` +
      (patchState.lowSampleWarning ? "  ⚠ low sample" : "") +
      (config.matchupsOffline ? "  [offline rebuild]" : ""),
  );

  // --- 2b. Item metadata (for recommended builds) ---
  // Online: fetch /constants/items and cache it. Offline: read the cache. Either may be null,
  // in which case recommended_items is simply omitted (empty) for this run.
  let itemIndex: ItemIndex | null = null;
  try {
    if (config.matchupsOffline) {
      itemIndex = await loadItemIndexCache();
      if (!itemIndex) console.warn("  ~ no cached item metadata; recommended_items empty this run");
    } else {
      itemIndex = buildIndexFromConstants(await fetchItemConstants());
      await saveItemIndexCache(itemIndex);
    }
  } catch (err) {
    console.warn(`  ✗ item constants failed: ${(err as Error).message}; recommended_items empty`);
  }

  // --- 3. Matchups -> counters (+ itemPopularity -> recommended builds) ---
  // We process counters per hero so each hero's countered_by/counters only need that hero's
  // own matchup feed (plus the global tag index for reasons).
  const counteredBy = new Map<number, CounterEntry[]>();
  const counters = new Map<number, CounterEntry[]>();
  const recommendedItems = new Map<number, RecommendedItemEntry[]>();
  const failedHeroes: string[] = [];
  const stats = { fetched: 0, cachedFresh: 0, cachedStale: 0, failed: 0 };
  for (const h of heroes) {
    counteredBy.set(h.id, []);
    counters.set(h.id, []);
  }

  const toProcess = HERO_LIMIT > 0 ? heroes.slice(0, HERO_LIMIT) : heroes;
  if (HERO_LIMIT > 0) {
    console.log(`  HERO_LIMIT=${HERO_LIMIT} — processing matchups for a subset only`);
  }

  let i = 0;
  for (const h of toProcess) {
    i += 1;
    const hTags = tags.get(h.id)!;
    let matchups: OpenDotaMatchup[];
    if (config.matchupsOffline) {
      // Offline mode: use cached matchups (any age), never touch the network.
      const c = await readMatchupCache(h.id, now);
      matchups = c?.matchups ?? [];
      if (c) stats.cachedStale += 1;
      else stats.failed += 1;
    } else {
      // 1) Fresh cache hit -> skip the (slow) API call entirely. Makes interrupted runs resumable.
      const cached = config.useMatchupCache ? await readMatchupCache(h.id, now) : null;
      if (cached && cached.ageHours < config.matchupCacheTtlHours) {
        matchups = cached.matchups;
        stats.cachedFresh += 1;
      } else {
        try {
          matchups = await fetchMatchups(h.id);
          if (config.useMatchupCache) await writeMatchupCache(h.id, matchups, now);
          stats.fetched += 1;
        } catch (err) {
          // 2) Fetch failed. Fall back to stale cache if we have any; else empty + record it.
          if (cached) {
            matchups = cached.matchups;
            stats.cachedStale += 1;
            console.warn(
              `  ~ matchups fetch failed for ${h.localized_name} (${h.id}); using cached data ` +
                `(${cached.ageHours.toFixed(1)}h old)`,
            );
          } else {
            console.warn(
              `  ✗ matchups failed for ${h.localized_name} (${h.id}): ${(err as Error).message}`,
            );
            matchups = [];
            failedHeroes.push(h.localized_name);
            stats.failed += 1;
          }
        }
      }
    }

    // Overall win rate from the sum of all matchup rows. Each game is counted once per enemy
    // hero, so the wins/games ratio still equals the hero's true overall win rate.
    let totalGames = 0;
    let totalWins = 0;
    for (const m of matchups) {
      totalGames += m.games_played;
      totalWins += m.wins;
    }
    const overall = totalGames > 0 ? totalWins / totalGames : 0;

    for (const m of matchups) {
      if (m.games_played < config.minGames) continue; // drop noisy small samples
      const oppTags = tags.get(m.hero_id);
      if (!oppTags) continue;

      const wr = m.wins / m.games_played;
      const delta = wr - overall;
      if (delta < 0) {
        // The opponent beats this hero -> opponent counters h.
        counteredBy.get(h.id)!.push({
          hero_id: m.hero_id,
          delta: round4(delta),
          reason: counterReason(oppTags, hTags),
          reason_th: counterReasonTh(oppTags, hTags),
        });
      } else if (delta > 0) {
        // This hero beats the opponent.
        counters.get(h.id)!.push({
          hero_id: m.hero_id,
          delta: round4(delta),
          reason: counterReason(hTags, oppTags),
          reason_th: counterReasonTh(hTags, oppTags),
        });
      }
    }

    const cb = counteredBy.get(h.id)!;
    const co = counters.get(h.id)!;
    // Strongest counters first = largest magnitude delta.
    cb.sort((a, b) => a.delta - b.delta); // most negative first
    co.sort((a, b) => b.delta - a.delta); // most positive first
    counteredBy.set(h.id, cb.slice(0, config.maxCountersPerHero));
    counters.set(h.id, co.slice(0, config.maxCountersPerHero));

    // Recommended (best-suited) items from real itemPopularity. Same cache/offline policy as
    // matchups; failures just leave this hero's recommended_items empty.
    if (itemIndex) {
      let popularity: OpenDotaItemPopularity | null = null;
      const pc = await readPopularityCache(h.id, now);
      if (config.matchupsOffline) {
        popularity = pc?.popularity ?? null;
      } else if (pc && pc.ageHours < config.matchupCacheTtlHours) {
        popularity = pc.popularity;
      } else {
        try {
          popularity = await fetchItemPopularity(h.id);
          await writePopularityCache(h.id, popularity, now);
        } catch {
          popularity = pc?.popularity ?? null; // stale fallback
        }
      }
      if (popularity) {
        recommendedItems.set(h.id, selectBuildItems(popularity, itemIndex, config.maxBuildItemsPerHero));
      }
    }

    if (i % 10 === 0 || i === toProcess.length) {
      console.log(`  matchups ${i}/${toProcess.length} (${h.localized_name})`);
    }
  }

  // --- 4. Synergies (pure computation over all pairs) ---
  const synergies = new Map<number, SynergyEntry[]>();
  for (const a of allTagList) {
    const list: SynergyEntry[] = [];
    for (const b of allTagList) {
      if (a.id === b.id) continue;
      const score = synergyScore(a, b);
      if (score >= config.minSynergyScore) {
        list.push({ hero_id: b.id, score, reason: synergyReason(a, b), reason_th: synergyReasonTh(a, b) });
      }
    }
    list.sort((x, y) => y.score - x.score);
    synergies.set(a.id, list.slice(0, config.maxSynergiesPerHero));
  }

  // --- 5. Assemble + write ---
  const output: HeroDataFile = {
    meta: {
      last_updated: now.toISOString(),
      patch: patchState.patch,
      patch_first_seen: patchState.firstSeen,
      low_sample_warning: patchState.lowSampleWarning,
    },
  };

  for (const h of heroes) {
    const hero: HeroOutput = {
      name: h.name,
      localized_name: h.localized_name,
      icon_url: iconUrl(h.name),
      roles: h.roles,
      attributes: { primary_attr: h.primary_attr, attack_type: h.attack_type },
      countered_by: counteredBy.get(h.id)!,
      counters: counters.get(h.id)!,
      synergies: synergies.get(h.id)!,
      item_counters: buildItemCounters(tags.get(h.id)!, config.maxItemsPerHero),
      recommended_items: recommendedItems.get(h.id) ?? [],
    };
    output[String(h.id)] = hero;
  }

  await fs.mkdir(config.dataDir, { recursive: true });
  const outPath = path.join(config.dataDir, "heroData.json");
  await fs.writeFile(outPath, JSON.stringify(output, null, 2) + "\n", "utf8");

  const secs = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(
    `  matchups: ${stats.fetched} fetched, ${stats.cachedFresh} fresh-cache, ` +
      `${stats.cachedStale} stale-fallback, ${stats.failed} empty`,
  );
  if (failedHeroes.length > 0) {
    console.warn(
      `  ⚠ ${failedHeroes.length} hero(es) had no matchup data this run: ${failedHeroes.join(", ")}`,
    );
  }
  console.log(`✔ wrote ${outPath} (${heroes.length} heroes) in ${secs}s\n`);
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

main().catch((err) => {
  console.error("\n✖ pipeline failed:", err);
  process.exitCode = 1;
});
