# Dota 2 Counters & Synergies

A small, fast website for Dota 2 draft decisions: pick a hero and instantly see **who counters
it**, **who it beats**, and **who it works well with** — each with a short, plain-English reason.

The project has two cleanly separated halves:

| Folder      | What it is                                                                 |
| ----------- | -------------------------------------------------------------------------- |
| `pipeline/` | A Node.js + TypeScript data pipeline that fetches OpenDota data, computes counters/synergies, generates reasons via a rules engine, and writes `data/heroData.json`. |
| `frontend/` | A React + Vite + TypeScript static site that reads `heroData.json` and renders the UI. |
| `data/`     | Pipeline output committed to the repo: `heroData.json` (the site's data) and `patchState.json` (patch-detection state). |
| `.github/`  | Scheduled GitHub Actions that refresh the data and (optionally) redeploy the site. |

---

## Quick start

Requires **Node.js 18+**.

```bash
# 1. Build the data (writes data/heroData.json + data/patchState.json)
cd pipeline
npm install
npm run fetch-data

# 2. Run the site against that data
cd ../frontend
npm install
npm run dev          # http://localhost:5173
```

To produce the static production build:

```bash
cd frontend
npm run build        # outputs frontend/dist/ (a fully static site)
npm run preview      # serve the build locally
```

The frontend automatically copies `data/heroData.json` into its bundle before `dev`/`build`
(see `frontend/scripts/copy-data.mjs`), so always run the pipeline first.

---

## The data pipeline

### What it does

1. **Heroes** — `GET /api/heroes` for the roster (id, name, roles, primary attribute, attack type).
2. **Matchups** — `GET /api/heroes/{id}/matchups` for each hero (games & wins vs every other hero),
   spaced to respect OpenDota's ~60 req/min free-tier limit.
3. **Counters** — for each opponent, `delta = (hero's win rate vs opponent) − (hero's overall win rate)`.
   A **negative** delta means the opponent counters this hero (→ `countered_by`); a **positive**
   delta means this hero counters the opponent (→ `counters`). Pairs below the games threshold are dropped.
4. **Synergies** — a rules engine scores every hero pair from roles/attributes (see below).
5. **Reasons** — a rules engine writes a one-line explanation for every counter and synergy.
6. **Patch detection** — records the current patch and when it was first seen; flags new patches as low-sample.
7. **Output** — everything is written to `data/heroData.json`.

### Run it

```bash
cd pipeline
npm run fetch-data
```

A full run makes ~127 matchup calls at ~1.1s spacing (a few minutes). It is **resumable** and
**resilient** thanks to a per-hero cache (see *Caching* below).

### Why synergies are rules-based (not from match data)

OpenDota's matchups endpoint only exposes **opposing-team** win rates — it has no same-team pair
win rates. The only way to get real same-team synergy numbers is an `/explorer` SQL query over the
public-matches table, which for a free, scheduled pipeline is unreliable: those queries are heavy,
time out often, are aggressively rate-limited, and the public sample rarely has enough games per
pair (the same small-sample problem we already guard against for counters). So synergies are
derived deterministically from hero **roles and attributes** instead (e.g. *initiator + AoE nuker*,
*disabler + burst follow-up*, *support + carry*, *frontline + squishy backline*). This needs no
extra API calls and never returns empty. If you ever want real same-team data, `pipeline/src/synergy.ts`
is the single place to swap in an `/explorer` feed. This trade-off is documented in code comments there.

### How reasons are generated

`pipeline/src/reasons.ts` is a small rules engine over hero tags (`heroTags.ts`), enriched by an
optional curated set of "signature" phrases for iconic heroes (`signatures.ts`). It runs at build
time, is fully deterministic (same heroes → same reason), and needs no LLM call at runtime. Heroes
without a curated signature fall back to generic role/attribute templates, so every pairing gets a
sensible reason. Examples:

- *"Axe punishes melee attackers with Counter Helix … out-trading Juggernaut in melee range."*
- *"Crystal Maiden chains a long-range stun, and Lina follows up with burst magical damage."*

**What "legit" means here.** The counter/synergy *relationships* are grounded in real OpenDota
win-rate data (counters) or symmetric role/attribute scoring (synergies). The *reasons* are
deterministic, attribute-consistent explanations of those relationships — they describe a plausible
mechanism for the matchup, not a statistically-proven cause. The engine is audited so reasons never
contradict a hero's own attributes (it never calls a melee hero ranged, a tank squishy, etc.), and
there is no vague catch-all phrasing — every reason names both heroes and a concrete trait.

### Items

Each hero gets two item lists:

- **`recommended_items`** — the items that best suit the hero, taken from OpenDota's real
  `itemPopularity` feed (what players actually build). The pipeline pulls each hero's mid+late game
  item popularity, drops consumables / recipe components / cheap basics (components are detected from
  `/constants/items` recipes), and keeps the most-built *finished* items, each with a short benefit
  note. See `pipeline/src/itemBuilds.ts`. This is real data, not a guess.
- **`item_counters`** — the items an enemy buys to blunt the hero: established Dota relationships
  (BKB vs magic/disables, Monkey King Bar vs evasion, Silver Edge's Break vs passives, Spirit Vessel
  vs sustain, Dust vs invisibility, Mjollnir vs illusions/summons, Ghost/Halberd/Assault vs physical,
  Eul's vs channels). Accurate picks need mechanics OpenDota's roles don't expose (evasion, Break-able
  passives, invisibility, illusions/summons, channels, sustain), so `pipeline/src/heroMechanics.ts`
  encodes those by hand (role-based fallback otherwise) and `pipeline/src/itemCounters.ts` maps them
  to items. Item icons come from the same Steam CDN as hero icons.

The per-hero `itemPopularity` responses are cached like matchups (`data/.cache/itemPopularity/`), so
reruns are fast and resilient.

### Patch detection & data maturity

The pipeline fetches the current patch from `GET /api/constants/patch` and stores it in
`data/patchState.json` with the timestamp it was first seen. If the patch changes, `first_seen`
resets. The output `meta` includes:

| Field                 | Meaning                                                              |
| --------------------- | ------------------------------------------------------------------- |
| `patch`               | Current patch identifier (e.g. `7.41`).                             |
| `patch_first_seen`    | When this patch was first detected by the pipeline.                |
| `last_updated`        | Timestamp of this pipeline run.                                    |
| `low_sample_warning`  | `true` if `patch_first_seen` is within the last 72h (configurable). |

When `low_sample_warning` is true the site shows an unobtrusive banner:
*"Patch {patch} is new — counter data may still be settling."*

### Output format (`data/heroData.json`)

```jsonc
{
  "meta": { "last_updated", "patch", "patch_first_seen", "low_sample_warning" },
  "1": {
    "name": "npc_dota_hero_antimage",
    "localized_name": "Anti-Mage",
    "icon_url": "https://cdn.cloudflare.steamstatic.com/.../antimage.png",
    "roles": ["Carry", "Escape", "Nuker"],
    "attributes": { "primary_attr": "agi", "attack_type": "Melee" },
    "countered_by":  [{ "hero_id": 85, "delta": -0.141, "reason": "…" }],
    "counters":      [{ "hero_id": 34, "delta":  0.153, "reason": "…" }],
    "synergies":         [{ "hero_id": 26, "score": 12,  "reason": "…" }],
    "recommended_items": [{ "item": "Manta Style", "icon_url": "…", "reason": "…" }],
    "item_counters":     [{ "item": "Black King Bar", "icon_url": "…", "reason": "…" }]
  }
  // … one entry per hero id
}
```

### Configuration / thresholds

Every knob is an environment variable (defaults in `pipeline/src/config.ts`):

| Variable                  | Default | Purpose |
| ------------------------- | ------- | ------- |
| `MIN_GAMES`               | `30`    | Minimum `games_played` for a matchup to count. **See note below.** |
| `MAX_COUNTERS`            | `14`    | Max entries per hero in `countered_by` / `counters`. |
| `MAX_SYNERGIES`           | `14`    | Max entries per hero in `synergies`. |
| `MAX_ITEMS`               | `6`     | Max counter-item suggestions per hero. |
| `MAX_BUILD_ITEMS`         | `6`     | Max recommended (best-suited) items per hero. |
| `MIN_SYNERGY_SCORE`       | `3`     | Minimum synergy score to surface a pairing. |
| `LOW_SAMPLE_HOURS`        | `72`    | Patch younger than this ⇒ `low_sample_warning = true`. |
| `RATE_LIMIT_MS`           | `1100`  | Delay between API calls (≈55 req/min, under the free-tier limit). |
| `REQUEST_TIMEOUT_MS`      | `45000` | Per-request timeout; the `/matchups` endpoint can be slow. |
| `MAX_RETRIES`             | `3`     | Retries on 429/5xx/timeouts (exponential backoff). |
| `MATCHUP_CACHE_TTL_HOURS` | `5`     | Skip re-fetching a hero whose cache is younger than this. |
| `USE_MATCHUP_CACHE`       | `true`  | Toggle the on-disk matchup cache. |
| `MATCHUPS_OFFLINE`        | `false` | Rebuild `heroData.json` from cache only, no API calls. |
| `OPENDOTA_API_KEY`        | —       | Optional OpenDota key to raise the rate limit. |
| `HERO_LIMIT`              | `0`     | Process only the first N heroes' matchups (fast smoke test). 0 = all. |

Example:

```bash
MIN_GAMES=100 LOW_SAMPLE_HOURS=48 npm run fetch-data
```

> **Note on `MIN_GAMES`.** The spec suggested `1000`, but OpenDota's live `/matchups` feed is a
> rolling sample of recently-parsed public matches, **not** an all-time total. Right after a new
> patch (exactly when `low_sample_warning` fires) even the most-played hero's biggest matchup is
> only ~100–150 games, so a `1000` threshold would empty the entire site. The default is therefore
> a realistic floor (`30`); raise it (e.g. `200`+) once a patch has matured and match volume grows.

### Caching & resilience

OpenDota's `/matchups` endpoint is compute-heavy and occasionally slow or flaky. The pipeline keeps
a per-hero cache under `data/.cache/matchups/{id}.json` (git-ignored):

- **Resumable** — reruns skip heroes fetched within `MATCHUP_CACHE_TTL_HOURS`, so a run interrupted
  by timeouts continues instead of starting over.
- **Resilient** — if a hero's fetch fails this run, the pipeline falls back to its last-known cached
  matchups rather than emitting empty data.
- **Offline rebuild** — `MATCHUPS_OFFLINE=true npm run fetch-data` regenerates `heroData.json` purely
  from the cache, without touching the API.

In CI the cache is persisted across runs via `actions/cache` (see the workflow).

---

## The frontend

- React + Vite + TypeScript, **static export** (`npm run build` → `frontend/dist/`).
- Dark, game-appropriate theme; mobile responsive.
- Top: a searchable hero grid (search matches name, role, or attribute).
- Selecting a hero shows three sections — **Countered by**, **Counters**, **Works well with** — each
  entry being a small icon + name + one-line reason, plus **Best items** and **Counter items** panels.
- Win-rate / synergy **numbers are hidden by default** and revealed by expanding a row.
- Header badges show the current patch and "Updated X ago"; a banner appears when `low_sample_warning`
  is set. `base: "./"` in `vite.config.ts` keeps the build working from a domain root or a GitHub
  Pages subpath.

```bash
cd frontend
npm run dev        # dev server with HMR
npm run build      # static build into dist/
npm run typecheck  # tsc --noEmit
```

---

## Scheduled refresh (GitHub Actions)

### `.github/workflows/refresh-data.yml`

- Runs every **6 hours** (`cron: "0 */6 * * *"`) and on manual **workflow_dispatch**.
- Installs `pipeline/` deps, runs `npm run fetch-data`, and **commits** `data/heroData.json` +
  `data/patchState.json` back to the repo only if they changed.
- Persists the matchup cache between runs via `actions/cache` for resilience.

**Change the cadence:** edit the `cron` expression (e.g. `"0 */12 * * *"` for every 12 hours).
**Tune thresholds:** uncomment the `env:` entries in the workflow (e.g. `MIN_GAMES`, `LOW_SAMPLE_HOURS`),
or add an `OPENDOTA_API_KEY` repo secret to raise the rate limit.

### `.github/workflows/deploy.yml` (optional)

Builds the frontend and publishes it to **GitHub Pages** whenever `frontend/**` or
`data/heroData.json` changes — so a data-refresh commit auto-redeploys the site. To enable it, set
**Settings → Pages → Source** to **GitHub Actions**.

> The refresh workflow needs write access to push commits; it uses the default `GITHUB_TOKEN` with
> `permissions: contents: write` (already set in the workflow).

---

## Project layout

```
dota-counters/
├── pipeline/
│   ├── src/
│   │   ├── index.ts          # orchestrator (npm run fetch-data)
│   │   ├── config.ts         # all env-tunable settings
│   │   ├── opendota.ts       # rate-limited API client w/ retry + timeout
│   │   ├── heroTags.ts       # role/attribute → semantic tags
│   │   ├── heroMechanics.ts  # curated mechanic flags (evasion, passives, invis, …)
│   │   ├── signatures.ts     # curated per-hero flavour phrases
│   │   ├── reasons.ts        # rules engine: counter & synergy reasons
│   │   ├── synergy.ts        # rules engine: synergy scoring
│   │   ├── itemCounters.ts   # rules engine: counter items
│   │   ├── itemBuilds.ts     # recommended items from real itemPopularity data
│   │   ├── patch.ts          # patch detection + state file
│   │   ├── matchupsCache.ts  # per-hero matchup + itemPopularity caches
│   │   └── types.ts
│   └── package.json
├── frontend/
│   ├── src/                  # React app (App, components, lib, styles)
│   ├── scripts/copy-data.mjs # copies ../data/heroData.json into the bundle
│   └── package.json
├── data/
│   ├── heroData.json         # ← the site's data (committed)
│   └── patchState.json       # ← patch-detection state (committed)
└── .github/workflows/
    ├── refresh-data.yml      # scheduled data refresh
    └── deploy.yml            # optional Pages deploy
```

---

## Data source & attribution

Hero data and matchups come from the [OpenDota API](https://docs.opendota.com/). Hero portraits are
served from Valve's Steam CDN. This project is not affiliated with Valve or OpenDota.
