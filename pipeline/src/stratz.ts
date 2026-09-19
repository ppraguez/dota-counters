/**
 * STRATZ GraphQL client for position-based hero stats.
 *
 * Fetches per-position win/pick data for four bracket groups in a single
 * GraphQL request (via aliases) so the IP-lock only applies once per run.
 *
 * Bracket groups:
 *   all      — Herald → Immortal (full player base)
 *   crusader — Herald → Crusader (low skill)
 *   legend   — Archon  → Legend  (mid skill)
 *   divine   — Ancient → Immortal (high skill)
 */
import { config } from "./config.js";
import type { BracketKey, BracketPositionStats, PositionKey, PositionStats, StratzPositionRow } from "./types.js";

const POSITIONS: PositionKey[] = ["pos1", "pos2", "pos3", "pos4", "pos5"];

export const BRACKET_GROUPS: Record<BracketKey, string> = {
  all:      "[HERALD, GUARDIAN, CRUSADER, ARCHON, LEGEND, ANCIENT, DIVINE, IMMORTAL]",
  crusader: "[HERALD, GUARDIAN, CRUSADER]",
  legend:   "[ARCHON, LEGEND]",
  divine:   "[ANCIENT, DIVINE, IMMORTAL]",
};

const BRACKET_KEYS = Object.keys(BRACKET_GROUPS) as BracketKey[];

function buildQuery(): string {
  const fields: string[] = [];
  for (const [bKey, brackets] of Object.entries(BRACKET_GROUPS)) {
    for (const [i, posKey] of POSITIONS.entries()) {
      fields.push(
        `${bKey}_${posKey}: winWeek(take: 1, positionIds: [POSITION_${i + 1}], bracketIds: ${brackets}) { heroId matchCount winCount }`,
      );
    }
  }
  return `{ heroStats { ${fields.join(" ")} } }`;
}

interface GraphQLResponse {
  data?: { heroStats?: Record<string, StratzPositionRow[]> };
  errors?: { message: string }[];
}

/** Fetch per-position hero win/pick rows for all bracket groups in one request. */
export async function fetchPositionStats(): Promise<BracketPositionStats> {
  if (!config.stratzToken) {
    throw new Error("no STRATZ token (set STRATZ_API_TOKEN or pipeline/.stratz-token)");
  }

  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), config.requestTimeoutMs);
  let res: Response;
  try {
    res = await fetch(config.stratzBase, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.stratzToken}`,
        "Content-Type": "application/json",
        "User-Agent": "STRATZ_API",
      },
      body: JSON.stringify({ query: buildQuery() }),
      signal: ac.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`STRATZ HTTP ${res.status}: ${text.slice(0, 160)}`);
  }

  let json: GraphQLResponse;
  try {
    json = JSON.parse(text) as GraphQLResponse;
  } catch {
    throw new Error(`STRATZ non-JSON response: ${text.slice(0, 160)}`);
  }
  if (json.errors?.length) {
    throw new Error(`STRATZ GraphQL: ${json.errors.map((e) => e.message).join("; ")}`);
  }

  const hs = json.data?.heroStats;
  if (!hs) throw new Error("STRATZ response missing heroStats");

  const out = {} as BracketPositionStats;
  for (const bKey of BRACKET_KEYS) {
    const posStats = {} as PositionStats;
    for (const posKey of POSITIONS) {
      const alias = `${bKey}_${posKey}`;
      const rows = hs[alias];
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error(`STRATZ response missing rows for ${alias}`);
      }
      posStats[posKey] = rows;
    }
    out[bKey] = posStats;
  }
  return out;
}
