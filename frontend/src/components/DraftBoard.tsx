import type { HeroWithId } from "../types";
import type { DraftSuggestion } from "../draft";
import { formatDelta } from "../lib";
import { useI18n } from "../i18n";
import { HeroAvatar } from "./HeroAvatar";

const TEAM_SIZE = 5;

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
  const hasPicks = allies.length > 0 || enemies.length > 0;

  return (
    <div className="draft-teams">
      <div className="draft-teams__board">
        <TeamRow side="ally" heroes={allies} onRemove={onRemove} />
        <TeamRow side="enemy" heroes={enemies} onRemove={onRemove} />
      </div>
      {hasPicks && (
        <button type="button" className="draft-teams__clear" onClick={onClear}>
          {t("draft.clear")}
        </button>
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
