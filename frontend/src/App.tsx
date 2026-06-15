import { useEffect, useMemo, useState } from "react";
import { HeroGrid, type TileMark } from "./components/HeroGrid";
import { HeroDetail } from "./components/HeroDetail";
import { LangToggle } from "./components/LangToggle";
import { FilterBar, type AttrFilter, type RoleFilter } from "./components/FilterBar";
import { DraftBoard } from "./components/DraftBoard";
import { BrandLogo } from "./components/BrandLogo";
import { loadHeroData, formatRelativeTime, type LoadedData } from "./lib";
import { rankPicks } from "./draft";
import { useI18n } from "./i18n";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: LoadedData };

type Mode = "browse" | "draft";
const TEAM_SIZE = 5;

export default function App() {
  const { t } = useI18n();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [mode, setMode] = useState<Mode>("browse");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [attrFilter, setAttrFilter] = useState<AttrFilter>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(null);

  // Draft mode state.
  const [allies, setAllies] = useState<number[]>([]);
  const [enemies, setEnemies] = useState<number[]>([]);
  const [addTarget, setAddTarget] = useState<TileMark>("ally");

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

  // Add/remove a hero from a draft team. Clicking a hero already on a team
  // removes it; otherwise it joins the active team (if there's room and it's
  // not already on the other team).
  function draftClick(id: number) {
    if (allies.includes(id)) {
      setAllies((xs) => xs.filter((x) => x !== id));
      return;
    }
    if (enemies.includes(id)) {
      setEnemies((xs) => xs.filter((x) => x !== id));
      return;
    }
    if (addTarget === "ally") {
      if (allies.length < TEAM_SIZE) setAllies((xs) => [...xs, id]);
    } else {
      if (enemies.length < TEAM_SIZE) setEnemies((xs) => [...xs, id]);
    }
  }

  function removeFromDraft(id: number) {
    setAllies((xs) => xs.filter((x) => x !== id));
    setEnemies((xs) => xs.filter((x) => x !== id));
  }

  function addAlly(id: number) {
    if (allies.length < TEAM_SIZE && !allies.includes(id) && !enemies.includes(id)) {
      setAllies((xs) => [...xs, id]);
    }
  }

  function clearDraft() {
    setAllies([]);
    setEnemies([]);
  }

  const heroes = state.status === "ready" ? state.data.heroes : [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return heroes.filter((h) => {
      if (attrFilter && h.attributes.primary_attr !== attrFilter) return false;
      if (roleFilter && !h.roles.includes(roleFilter)) return false;
      if (!q) return true;
      return (
        h.localized_name.toLowerCase().includes(q) ||
        h.roles.some((r) => r.toLowerCase().includes(q)) ||
        h.attributes.primary_attr.toLowerCase().includes(q)
      );
    });
  }, [heroes, search, attrFilter, roleFilter]);

  const selected =
    state.status === "ready" && selectedId !== null ? state.data.byId.get(selectedId) ?? null : null;

  const byId = state.status === "ready" ? state.data.byId : null;
  const allyHeroes = useMemo(
    () => (byId ? allies.map((id) => byId.get(id)).filter((h): h is NonNullable<typeof h> => !!h) : []),
    [byId, allies],
  );
  const enemyHeroes = useMemo(
    () => (byId ? enemies.map((id) => byId.get(id)).filter((h): h is NonNullable<typeof h> => !!h) : []),
    [byId, enemies],
  );
  const suggestions = useMemo(
    () => rankPicks(heroes, allyHeroes, enemyHeroes),
    [heroes, allyHeroes, enemyHeroes],
  );

  const marks = useMemo(() => {
    const m = new Map<number, TileMark>();
    for (const id of allies) m.set(id, "ally");
    for (const id of enemies) m.set(id, "enemy");
    return m;
  }, [allies, enemies]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <BrandLogo />
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

      {state.status === "ready" && (
        <nav className="mode-nav" role="tablist" aria-label="Mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "browse"}
            className={`mode-nav__btn mode-nav__btn--browse ${mode === "browse" ? "mode-nav__btn--active" : ""}`}
            onClick={() => setMode("browse")}
          >
            <span className="mode-nav__icon" aria-hidden="true">🔍</span>
            {t("mode.browse")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "draft"}
            className={`mode-nav__btn mode-nav__btn--draft ${mode === "draft" ? "mode-nav__btn--active" : ""}`}
            onClick={() => setMode("draft")}
          >
            <span className="mode-nav__icon" aria-hidden="true">⚔️</span>
            {t("mode.draft")}
          </button>
        </nav>
      )}

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
            {mode === "draft" && (
              <div className="add-target" role="tablist" aria-label={t("draft.addTo")}>
                <span className="add-target__label muted">{t("draft.addTo")}</span>
                <button
                  type="button"
                  role="tab"
                  aria-selected={addTarget === "ally"}
                  className={`add-target__btn add-target__btn--ally ${addTarget === "ally" ? "add-target__btn--active" : ""}`}
                  onClick={() => setAddTarget("ally")}
                >
                  {t("draft.allies")}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={addTarget === "enemy"}
                  className={`add-target__btn add-target__btn--enemy ${addTarget === "enemy" ? "add-target__btn--active" : ""}`}
                  onClick={() => setAddTarget("enemy")}
                >
                  {t("draft.enemies")}
                </button>
              </div>
            )}
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
            <FilterBar
              attr={attrFilter}
              role={roleFilter}
              onAttr={setAttrFilter}
              onRole={setRoleFilter}
            />
            <HeroGrid
              heroes={filtered}
              selectedId={mode === "browse" ? selectedId : null}
              onSelect={mode === "browse" ? select : draftClick}
              marks={mode === "draft" ? marks : undefined}
            />
          </section>

          <div id="detail-anchor" />
          <section className="detail-pane">
            {mode === "draft" ? (
              <DraftBoard
                allies={allyHeroes}
                enemies={enemyHeroes}
                suggestions={suggestions}
                onRemove={removeFromDraft}
                onClear={clearDraft}
                onPickAlly={addAlly}
              />
            ) : selected ? (
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
