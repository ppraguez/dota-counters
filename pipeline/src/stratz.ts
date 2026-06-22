/**
 * STRATZ GraphQL client for position-based hero stats.
 *
 * OpenDota only exposes capability-role tags (Carry/Support/Nuker…), not lane
 * position, so a flexible hero floods every list. STRATZ has true per-position
 * win/pick rates (POSITION_1..5 = carry / mid / offlane / soft sup / hard sup),
 * which is what the role meta needs.
 *
 * IMPORTANT: STRATZ binds a token to the caller's IP and rejects requests from a
 * different IP ("You cannot use different IP Addresses"). We therefore fetch all
 * five positions in a SINGLE request (GraphQL aliases) so one pipeline run only
 * ever touches one IP.
 */
import { config } from "./config.js";
import type { PositionKey, PositionStats, StratzPositionRow } from "./types.js";

const POSITIONS: PositionKey[] = ["pos1", "pos2", "pos3", "pos4", "pos5"];

// Herald → Legend. STRATZ bracket enum values.
const BRACKETS = "[HERALD, GUARDIAN, CRUSADER, ARCHON, LEGEND]";

function buildQuery(): string {
  const field = (key: PositionKey, n: number) =>
    `${key}: winWeek(take: 1, positionIds: [POSITION_${n}], bracketIds: ${BRACKETS}) ` +
    `{ heroId matchCount winCount }`;
  const fields = POSITIONS.map((k, i) => field(k, i + 1)).join(" ");
  return `{ heroStats { ${fields} } }`;
}

interface GraphQLResponse {
  data?: { heroStats?: Partial<Record<PositionKey, StratzPositionRow[]>> };
  errors?: { message: string }[];
}

/** Fetch per-position hero win/pick rows in one request. Throws on any failure. */
export async function fetchPositionStats(): Promise<PositionStats> {
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
        // STRATZ rejects the default fetch UA; this identifies us as an API client.
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
    // STRATZ returns plaintext for some errors (e.g. the IP-lock message).
    throw new Error(`STRATZ non-JSON response: ${text.slice(0, 160)}`);
  }
  if (json.errors?.length) {
    throw new Error(`STRATZ GraphQL: ${json.errors.map((e) => e.message).join("; ")}`);
  }

  const hs = json.data?.heroStats;
  if (!hs) throw new Error("STRATZ response missing heroStats");

  const out = {} as PositionStats;
  for (const key of POSITIONS) {
    const rows = hs[key];
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error(`STRATZ response missing rows for ${key}`);
    }
    out[key] = rows;
  }
  return out;
}
