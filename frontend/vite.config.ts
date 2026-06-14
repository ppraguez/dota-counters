import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" makes all asset + data URLs relative, so the static export works whether it's
// served from a domain root or a GitHub Pages project subpath (e.g. /dota-counters/).
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
