import { useState } from "react";
import type { HeroWithId } from "../types";
import type { DraftSuggestion } from "../draft";
import { formatDelta } from "../lib";
import { buildDraftUrl } from "../draftLink";
import { useI18n } from "../i18n";
import { HeroAvatar } from "./HeroAvatar";

const TEAM_SIZE = 5;

// The roles a balanced Dota draft generally wants covered.
const KEY_ROLES = ["Carry", "Support", "Initiator", "Disabler", "Durable", "Nuker"] as const;

function RoleCoverage({ heroes }: { heroes: HeroWithId[] }) {
  const { t } = useI18n();
  const counts = new Map<string, number>();
  for (const h of heroes) {
    for (const r of h.roles) counts.set(r, (counts.get(r) ?? 0) + 1);
  }

  return (
    <div className="team-roles">
      <span className="team-roles__label">{t("draft.roles")}</span>
      <ul className="team-roles__list">
        {KEY_ROLES.map((r) => {
          const n = counts.get(r) ?? 0;
          return (
            <li
              key={r}
              className={`role-chip ${n > 0 ? "role-chip--have" : "role-chip--need"}`}
              title={n > 0 ? t("draft.roleHave", { role: t(`roles.${r}`) }) : t("draft.roleNeed", { role: t(`roles.${r}`) })}
            >
              {t(`roles.${r}`)}
              {n > 1 && <span className="role-chip__n"> ×{n}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TeamRow({
  side,
  heroes,
  onRemove,
}: {
  side: "ally" | "enemy";
  heroes: HeroWithId[];
  onRemove: (id: number) => void;
}) {
  const { t } = useI18n();
  const slots = Array.from({ length: TEAM_SIZE }, (_, i) => heroes[i] ?? null);

  return (
    <div className={`team team--${side}`}>
      <div className="team__header">
        <h3 className="team__title">
          {side === "ally" ? t("draft.allies") : t("draft.enemies")}
        </h3>
        <span className="team__count">
          {heroes.length}/{TEAM_SIZE}
        </span>
      </div>
      <ul className="team__slots">
        {slots.map((h, i) => (
          <li key={h?.id ?? `empty-${i}`} className="team__slot">
            {h ? (
              <button
                type="button"
                className="team__hero"
                onClick={() => onRemove(h.id)}
                title={t("draft.remove", { name: h.localized_name })}
              >
                <HeroAvatar src={h.icon_url} name={h.localized_name} width={64} />
                <span className="team__heroName">{h.localized_name}</span>
                <span className="team__remove" aria-hidden="true">×</span>
              </button>
            ) : (
              <div className="team__slot--empty" aria-hidden="true" />
            )}
          </li>
        ))}
      </ul>
      {side === "ally" && heroes.length > 0 && <RoleCoverage heroes={heroes} />}
    </div>
  );
}

/** Full-width teams bar shown across the top of draft mode. */
export function DraftTeams({
  allies,
  enemies,
  onRemove,
  onClear,
}: {
  allies: HeroWithId[];
  enemies: HeroWithId[];
  onRemove: (id: number) => void;
  onClear: () => void;
}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const hasPicks = allies.length > 0 || enemies.length > 0;

  function share() {
    const url = buildDraftUrl(allies.map((h) => h.id), enemies.map((h) => h.id));
    navigator.clipboard
      ?.writeText(url)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {
        /* clipboard blocked — ignore */
      });
  }

  return (
    <div className="draft-teams">
      <div className="draft-teams__board">
        <TeamRow side="ally" heroes={allies} onRemove={onRemove} />
        <TeamRow side="enemy" heroes={enemies} onRemove={onRemove} />
      </div>
      {hasPicks && (
        <div className="draft-teams__actions">
          <button type="button" className="draft-teams__share" onClick={share}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {copied ? t("draft.shareCopied") : t("draft.share")}
          </button>
          <button type="button" className="draft-teams__clear" onClick={onClear}>
            {t("draft.clear")}
          </button>
        </div>
      )}
    </div>
  );
}

/** Ranked suggested-picks panel. */
export function DraftSuggestions({
  allies,
  enemies,
  suggestions,
  onPickAlly,
}: {
  allies: HeroWithId[];
  enemies: HeroWithId[];
  suggestions: DraftSuggestion[];
  onPickAlly: (id: number) => void;
}) {
  const { t } = useI18n();
  const hasPicks = allies.length > 0 || enemies.length > 0;

  return (
    <div className="draft__suggestions">
      <div className="relation__header">
        <h3 className="relation__title">{t("draft.suggestions")}</h3>
        {suggestions.length > 0 && (
          <span className="relation__count">{suggestions.length}</span>
        )}
      </div>
      <p className="relation__subtitle muted">{t("draft.suggestionsSub")}</p>

      {!hasPicks ? (
        <p className="relation__empty muted">{t("draft.empty")}</p>
      ) : suggestions.length === 0 ? (
        <p className="relation__empty muted">{t("draft.noSuggestions")}</p>
      ) : (
        <ul className="suggestion-list">
          {suggestions.map((s, i) => (
            <li key={s.hero.id} className="suggestion">
              <span className="suggestion__rank">{i + 1}</span>
              <HeroAvatar src={s.hero.icon_url} name={s.hero.localized_name} width={44} />
              <div className="suggestion__text">
                <span className="suggestion__name">{s.hero.localized_name}</span>
                <span className="suggestion__metrics">
                  {s.synergy > 0 && (
                    <span className="suggestion__metric suggestion__metric--synergy">
                      +{s.synergy} {t("draft.synergy")}
                    </span>
                  )}
                  {s.counter !== 0 && (
                    <span
                      className={`suggestion__metric ${
                        s.counter >= 0
                          ? "suggestion__metric--good"
                          : "suggestion__metric--bad"
                      }`}
                    >
                      {formatDelta(s.counter)} {t("draft.counter")}
                    </span>
                  )}
                </span>
              </div>
              <button
                type="button"
                className="suggestion__add"
                onClick={() => onPickAlly(s.hero.id)}
                title={t("draft.addAlly")}
              >
                +
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
