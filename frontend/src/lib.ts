import type { Hero, HeroDataFile, HeroWithId, Meta, RolesMeta } from "./types";

export interface LoadedData {
  meta: Meta;
  heroes: HeroWithId[];
  byId: Map<number, HeroWithId>;
  rolesMeta: RolesMeta | null;
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
    // Top-level non-hero keys: skip them (numeric keys are heroes).
    if (key === "meta" || key === "roles_meta") continue;
    const hero = value as Hero;
    heroes.push({ ...hero, id: Number(key) });
  }
  heroes.sort((a, b) => a.localized_name.localeCompare(b.localized_name));

  const byId = new Map<number, HeroWithId>();
  for (const h of heroes) byId.set(h.id, h);

  return { meta: raw.meta, heroes, byId, rolesMeta: raw.roles_meta ?? null };
}

/** Translate function shape (from i18n). */
type TFn = (key: string, vars?: Record<string, string | number>) => string;

/**
 * Locale-aware "3 hours ago" / "just now" from an ISO timestamp. The `{s}` plural marker is only
 * present in the English templates; Thai templates ignore it (Thai has no plural form).
 */
export function formatRelativeTime(iso: string, t: TFn, now = new Date()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return t("time.unknown");
  const diffMs = now.getTime() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return t("time.justNow");
  if (mins < 60) return t("time.minutes", { n: mins, s: mins === 1 ? "" : "s" });
  const hours = Math.round(mins / 60);
  if (hours < 24) return t("time.hours", { n: hours, s: hours === 1 ? "" : "s" });
  const days = Math.round(hours / 24);
  return t("time.days", { n: days, s: days === 1 ? "" : "s" });
}

/** Signed win-rate delta as a percentage-point string, e.g. "+6.2%" / "-4.8%". */
export function formatDelta(delta: number): string {
  const pct = delta * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}
