import { useEffect, useMemo, useState } from "react";
import { HeroGrid } from "./components/HeroGrid";
import { HeroDetail } from "./components/HeroDetail";
import { loadHeroData, formatRelativeTime, type LoadedData } from "./lib";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: LoadedData };

export default function App() {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Load data once on mount.
  useEffect(() => {
    let cancelled = false;
    loadHeroData()
      .then((data) => {
        if (cancelled) return;
        setState({ status: "ready", data });
        // Restore selection from the URL hash (e.g. #42) if valid.
        const fromHash = Number(window.location.hash.replace("#", ""));
        if (Number.isFinite(fromHash) && data.byId.has(fromHash)) {
          setSelectedId(fromHash);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({ status: "error", message: err instanceof Error ? err.message : String(err) });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function select(id: number) {
    setSelectedId(id);
    window.location.hash = String(id);
    // On small screens, bring the detail into view.
    requestAnimationFrame(() => {
      document.getElementById("detail-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const heroes = state.status === "ready" ? state.data.heroes : [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return heroes;
    return heroes.filter(
      (h) =>
        h.localized_name.toLowerCase().includes(q) ||
        h.roles.some((r) => r.toLowerCase().includes(q)) ||
        h.attributes.primary_attr.toLowerCase().includes(q),
    );
  }, [heroes, search]);

  const selected =
    state.status === "ready" && selectedId !== null ? state.data.byId.get(selectedId) ?? null : null;

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__logo" aria-hidden="true">⚔️</span>
          <div>
            <h1 className="topbar__title">Dota 2 Counters &amp; Synergies</h1>
            <p className="topbar__tagline muted">
              Who beats a hero, who it beats, and who it works well with.
            </p>
          </div>
        </div>
        {state.status === "ready" && (
          <div className="topbar__meta">
            <span className="badge badge--patch">Patch {state.data.meta.patch}</span>
            <span className="badge">Updated {formatRelativeTime(state.data.meta.last_updated)}</span>
          </div>
        )}
      </header>

      {state.status === "loading" && <p className="status muted">Loading hero data…</p>}

      {state.status === "error" && (
        <div className="status status--error">
          <p>Couldn’t load hero data: {state.message}</p>
          <p className="muted">
            Run the pipeline (<code>cd pipeline &amp;&amp; npm run fetch-data</code>) and rebuild, or
            check that <code>heroData.json</code> is present.
          </p>
        </div>
      )}

      {state.status === "ready" && (
        <main className="layout">
          <section className="picker">
            <label className="search">
              <span className="visually-hidden">Search heroes</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search heroes, roles, attributes…"
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <HeroGrid heroes={filtered} selectedId={selectedId} onSelect={select} />
          </section>

          <div id="detail-anchor" />
          <section className="detail-pane">
            {selected ? (
              <HeroDetail hero={selected} byId={state.data.byId} meta={state.data.meta} />
            ) : (
              <div className="placeholder">
                <p className="placeholder__title">Pick a hero</p>
                <p className="muted">
                  Select a hero above to see its counters, favourable matchups, and synergies.
                </p>
              </div>
            )}
          </section>
        </main>
      )}

      <footer className="footer muted">
        {state.status === "ready" ? (
          <>
            Patch {state.data.meta.patch} · updated{" "}
            {formatRelativeTime(state.data.meta.last_updated)} · data from{" "}
            <a href="https://www.opendota.com" target="_blank" rel="noreferrer">
              OpenDota
            </a>
            . Not affiliated with Valve.
          </>
        ) : (
          <>Data from OpenDota. Not affiliated with Valve.</>
        )}
      </footer>
    </div>
  );
}
