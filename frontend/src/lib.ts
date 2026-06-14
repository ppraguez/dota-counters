import type { Hero, HeroDataFile, HeroWithId, Meta } from "./types";

export interface LoadedData {
  meta: Meta;
  heroes: HeroWithId[];
  byId: Map<number, HeroWithId>;
}

/** Fetch + normalize heroData.json into a list + id lookup. */
export async function loadHeroData(): Promise<LoadedData> {
  // BASE_URL keeps this working under a subpath (GitHub Pages project site).
  const url = `${import.meta.env.BASE_URL}heroData.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load hero data (HTTP ${res.status})`);
  const raw = (await res.json()) as HeroDataFile;

  const heroes: HeroWithId[] = [];
  for (const [key, value] of Object.entries(raw)) {
    if (key === "meta") continue;
    const hero = value as Hero;
    heroes.push({ ...hero, id: Number(key) });
  }
  heroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name));

  const byId = new Map<number, HeroWithId>();
  for (const h of heroes) byId.set(h.id, h);

  return { meta: raw.meta, heroes, byId };
}

/** "3 hours ago", "just now", "2 days ago" from an ISO timestamp. */
export function formatRelativeTime(iso: string, now = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "unknown";
  const diffMs = now.getTime() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/** Human attribute label from OpenDota's short code. */
export function attrLabel(code: string): string {
  switch (code) {
    case "str":
      return "Strength";
    case "agi":
      return "Agility";
    case "int":
      return "Intelligence";
    case "all":
      return "Universal";
    default:
      return code;
  }
}

/** Signed win-rate delta as a percentage-point string, e.g. "+6.2%" / "-4.8%". */
export function formatDelta(delta: number): string {
  const pct = delta * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}
