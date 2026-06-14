import { useEffect, useMemo, useState } from "react";
import { HeroGrid } from "./components/HeroGrid";
import { HeroDetail } from "./components/HeroDetail";
import { LangToggle } from "./components/LangToggle";
import { loadHeroData, formatRelativeTime, type LoadedData } from "./lib";
import { useI18n } from "./i18n";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: LoadedData };

export default function App() {
  const { t } = useI18n();
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
            <h1 className="topbar__title">{t("title")}</h1>
            <p className="topbar__tagline muted">{t("tagline")}</p>
          </div>
        </div>
        <div className="topbar__meta">
          {state.status === "ready" && (
            <>
              <span className="badge badge--patch">{t("badge.patch", { patch: state.data.meta.patch })}</span>
              <span className="badge">
                {t("badge.updated", { time: formatRelativeTime(state.data.meta.last_updated, t) })}
              </span>
            </>
          )}
          <LangToggle />
        </div>
      </header>

      {state.status === "loading" && <p className="status muted">{t("loading")}</p>}

      {state.status === "error" && (
        <div className="status status--error">
          <p>{t("error.load", { msg: state.message })}</p>
          <p className="muted">{t("error.hint")}</p>
        </div>
      )}

      {state.status === "ready" && (
        <main className="layout">
          <section className="picker">
            <label className="search">
              <span className="visually-hidden">{t("search.label")}</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search.placeholder")}
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
                <p className="placeholder__title">{t("placeholder.title")}</p>
                <p className="muted">{t("placeholder.body")}</p>
              </div>
            )}
          </section>
        </main>
      )}

      <footer className="footer muted">
        {state.status === "ready" ? (
          <>
            {t("footer.pre", {
              patch: state.data.meta.patch,
              time: formatRelativeTime(state.data.meta.last_updated, t),
            })}
            <a href="https://www.opendota.com" target="_blank" rel="noreferrer">
              OpenDota
            </a>
            {t("footer.post")}
          </>
        ) : (
          <>
            {t("footer.fallbackPre")}
            <a href="https://www.opendota.com" target="_blank" rel="noreferrer">
              OpenDota
            </a>
            {t("footer.fallbackPost")}
          </>
        )}
      </footer>
    </div>
  );
}
