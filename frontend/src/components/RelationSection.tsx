import type { HeroWithId } from "../types";
import { HeroAvatar } from "./HeroAvatar";
import { useI18n } from "../i18n";

export interface RelationItem {
  hero_id: number;
  reason: string;
  /** Compact metric label shown inline, e.g. "+6.2%" (omitted for synergies). */
  value?: string;
  /** Strength bar fill, 0..1, relative to the strongest entry in the section. */
  meter: number;
}

type Accent = "danger" | "good" | "synergy";

interface Props {
  title: string;
  subtitle: string;
  accent: Accent;
  items: RelationItem[];
  byId: Map<number, HeroWithId>;
  emptyText: string;
  /** When provided, each row becomes a button that opens that hero's detail. */
  onSelect?: (id: number) => void;
}

export function RelationSection({ title, subtitle, accent, items, byId, emptyText, onSelect }: Props) {
  return (
    <section className={`relation relation--${accent}`}>
      <header className="relation__header">
        <h3 className="relation__title">{title}</h3>
        <span className="relation__count">{items.length}</span>
      </header>
      <p className="relation__subtitle muted">{subtitle}</p>

      {items.length === 0 ? (
        <p className="muted relation__empty">{emptyText}</p>
      ) : (
        <ul className="relation__list">
          {items.map((item) => (
            <RelationRow
              key={item.hero_id}
              item={item}
              hero={byId.get(item.hero_id)}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function RelationRow({
  item,
  hero,
  onSelect,
}: {
  item: RelationItem;
  hero: HeroWithId | undefined;
  onSelect?: (id: number) => void;
}) {
  const { t } = useI18n();
  const name = hero?.localized_name ?? t("detail.heroFallback", { id: item.hero_id });
  const clickable = !!onSelect && !!hero;

  const inner = (
    <>
      <span className="row__head">
        {hero && <HeroAvatar src={hero.icon_url} name={name} width={48} className="row__icon" />}
        <span className="row__name">{name}</span>
        {item.value && <span className="row__value">{item.value}</span>}
        {clickable && <span className="row__go" aria-hidden="true">›</span>}
      </span>
      <span className="row__reason">{item.reason}</span>
      <div className="row__meter" aria-hidden="true">
        <div className="row__meter-fill" style={{ width: `${Math.round(item.meter * 100)}%` }} />
      </div>
    </>
  );

  return (
    <li className={`row ${clickable ? "row--link" : ""}`}>
      {clickable ? (
        <button
          type="button"
          className="row__main row__main--btn"
          onClick={() => onSelect!(item.hero_id)}
          title={t("detail.viewHero", { name })}
        >
          {inner}
        </button>
      ) : (
        <div className="row__main">{inner}</div>
      )}
    </li>
  );
}
