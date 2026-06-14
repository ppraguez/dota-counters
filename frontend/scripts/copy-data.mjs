// Copies the canonical pipeline output (../data/heroData.json) into the frontend's public/
// folder so Vite serves it at runtime. Runs automatically before `dev` and `build`.
// If the data file doesn't exist yet (pipeline never run), we warn but exit 0 so the dev
// server can still start and render an empty-state message.
import { existsSync, mkdirSync, copyFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, "../../data/heroData.json");
const destDir = resolve(here, "../public");
const dest = resolve(destDir, "heroData.json");

if (!existsSync(src)) {
  console.warn(
    `[copy-data] ${src} not found.\n` +
      `[copy-data] Run the pipeline first:  cd ../pipeline && npm run fetch-data\n` +
      `[copy-data] The app will show an empty state until data exists.`,
  );
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
const kb = (statSync(dest).size / 1024).toFixed(0);
console.log(`[copy-data] copied heroData.json (${kb} KB) -> public/`);
