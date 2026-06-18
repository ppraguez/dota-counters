// Shareable draft links: encode both teams into a `?d=` URL param so a draft
// can be sent to a teammate and opened pre-filled.
//
// Format: `?d=<allies>_<enemies>` where each side is a dot-separated list of
// hero ids, e.g. `?d=5.27.41_34.12` (empty side allowed: `?d=_34.12`).

export function encodeDraft(allies: number[], enemies: number[]): string {
  return `${allies.join(".")}_${enemies.join(".")}`;
}

const toIds = (s?: string): number[] =>
  (s ?? "")
    .split(".")
    .map(Number)
    .filter((n) => Number.isInteger(n) && n > 0);

/** Parse + sanitize the `?d=` param from the current URL (null if absent/empty). */
export function parseDraftFromUrl(): { allies: number[]; enemies: number[] } | null {
  try {
    const raw = new URLSearchParams(window.location.search).get("d");
    if (!raw) return null;
    const [a, e] = raw.split("_");
    const allies = [...new Set(toIds(a))].slice(0, 5);
    const enemies = [...new Set(toIds(e))].filter((id) => !allies.includes(id)).slice(0, 5);
    if (allies.length === 0 && enemies.length === 0) return null;
    return { allies, enemies };
  } catch {
    return null;
  }
}

/** Build a full shareable URL for the given draft. */
export function buildDraftUrl(allies: number[], enemies: number[]): string {
  return `${window.location.origin}${window.location.pathname}?d=${encodeDraft(allies, enemies)}`;
}
