import { useState } from "react";
import type { HeroWithId } from "../types";
import { HeroAvatar } from "./HeroAvatar";

export interface RelationItem {
  hero_id: number;
  reason: string;
  /** Numeric detail shown only when the row is expanded (e.g. "+6.2% win rate"). */
  detail: string;
}

type Accent = "danger" | "good" | "synergy";

interface Props {
  title: string;
  subtitle: string;
  accent: Accent;
  items: RelationItem[];
  byId: Map<number, HeroWithId>;
  emptyText: string;
}

export function RelationSection({ title, subtitle, accent, items, byId, emptyText }: Props) {
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
            <RelationRow key={item.hero_id} item={item} hero={byId.get(item.hero_id)} />
          ))}
        </ul>
      )}
    </section>
  );
}

function RelationRow({ item, hero }: { item: RelationItem; hero: HeroWithId | undefined }) {
  const [open, setOpen] = useState(false);
  const name = hero?.localized_name ?? `Hero ${item.hero_id}`;

  return (
    <li className="row">
      <button
        type="button"
        className="row__main"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {hero && <HeroAvatar src={hero.icon_url} name={name} width={56} className="row__icon" />}
        <span className="row__text">
          <span className="row__name">{name}</span>
          <span className="row__reason">{item.reason}</span>
        </span>
        <span className={`row__chevron ${open ? "row__chevron--open" : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div className="row__detail">
          <span className="row__metric">{item.detail}</span>
        </div>
      )}
    </li>
  );
}
