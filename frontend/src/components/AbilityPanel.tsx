import { useState } from "react";
import type { AbilityCounterEntry } from "../types";
import { useI18n } from "../i18n";

/** Ability/item icon with a fallback box if the URL is missing or the CDN image fails. */
function AbilityIcon({ src, name }: { src: string | null | undefined; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return <span className="ability-card__icon ability-card__icon--fallback" aria-hidden="true" />;
  }
  return (
    <img
      className="ability-card__icon"
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      title={name}
    />
  );
}

interface Props {
  items: AbilityCounterEntry[];
}

/**
 * "Ability counters" — curated spell-vs-spell interactions. Offense entries (green) are this hero's
 * tools; defense entries (red) are enemy abilities to respect. Hidden entirely when there's no data.
 */
export function AbilityPanel({ items }: Props) {
  const { t, reasonOf } = useI18n();
  if (items.length === 0) return null;

  return (
    <section className="ability-section">
      <header className="relation__header">
        <h3 className="relation__title ability-section__title">{t("ability.title")}</h3>
        <span className="relation__count">{items.length}</span>
      </header>
      <p className="relation__subtitle muted">{t("ability.subtitle")}</p>

      <ul className="ability-list">
        {items.map((a, i) => (
          <li key={`${a.kind}-${a.ability}-${i}`} className={`ability-card ability-card--${a.kind}`}>
            <span className="ability-card__tag">{t(`ability.${a.kind}`)}</span>
            <AbilityIcon src={a.icon_url} name={a.ability} />
            <div className="ability-card__text">
              <span className="ability-card__name">{a.ability}</span>
              <span className="ability-card__reason">{reasonOf(a)}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
