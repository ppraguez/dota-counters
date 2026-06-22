/**
 * One-off / manual: fetch /heroStats, compute role meta, and inject `roles_meta`
 * into existing heroData.json file(s) WITHOUT re-running the full (slow) pipeline.
 *
 *   tsx src/injectRolesMeta.ts <path-to-heroData.json> [<more paths>...]
 *
 * Future scheduled refreshes produce roles_meta natively (see index.ts); this is
 * just to backfill the current artifacts.
 */
import { promises as fs } from "node:fs";
import { fetchPositionStats } from "./stratz.js";
import { writePositionStatsCache } from "./heroStatsCache.js";
import { buildRolesMeta } from "./rolesMeta.js";
import type { HeroDataFile } from "./types.js";

async function main(): Promise<void> {
  const targets = process.argv.slice(2);
  if (targets.length === 0) {
    console.error("usage: tsx src/injectRolesMeta.ts <heroData.json> [more...]");
    process.exitCode = 1;
    return;
  }

  console.log("Fetching STRATZ position stats…");
  const stats = await fetchPositionStats();
  await writePositionStatsCache(stats);
  const rolesMeta = buildRolesMeta(stats);
  const total = Object.values(rolesMeta.roles).reduce((a, r) => a + r.length, 0);
  console.log(`Built role meta: ${total} entries across ${Object.keys(rolesMeta.roles).length} positions.`);

  for (const path of targets) {
    const data = JSON.parse(await fs.readFile(path, "utf8")) as HeroDataFile;
    // Re-assemble so meta + roles_meta lead the file, heroes follow.
    const { meta, roles_meta: _drop, ...heroes } = data;
    const next: HeroDataFile = { meta, roles_meta: rolesMeta, ...heroes };
    await fs.writeFile(path, JSON.stringify(next, null, 2) + "\n", "utf8");
    console.log(`  ✔ injected roles_meta -> ${path}`);
  }
}

main().catch((err) => {
  console.error("✖ inject failed:", err);
  process.exitCode = 1;
});
