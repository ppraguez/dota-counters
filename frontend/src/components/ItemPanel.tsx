import { useState } from "react";

interface Item {
  item: string;
  icon_url: string;
  reason: string;
}

/** Item image with a small fallback box if the CDN icon fails. */
function ItemIcon({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className="item-card__icon item-card__icon--fallback" aria-hidden="true" />;
  }
  return (
    <img
      className="item-card__icon"
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
  title: string;
  subtitle: string;
  /** "build" = items this hero should buy; "counter" = items to buy against this hero. */
  accent: "build" | "counter";
  items: Item[];
  emptyText: string;
}

export function ItemPanel({ title, subtitle, accent, items, emptyText }: Props) {
  return (
    <section className={`item-panel item-panel--${accent}`}>
      <header className="relation__header">
        <h3 className="relation__title item-panel__title">{title}</h3>
        <span className="relation__count">{items.length}</span>
      </header>
      <p className="relation__subtitle muted">{subtitle}</p>

      {items.length === 0 ? (
        <p className="muted relation__empty">{emptyText}</p>
      ) : (
        <ul className="items__grid">
          {items.map((it) => (
            <li key={it.item} className="item-card">
              <ItemIcon src={it.icon_url} name={it.item} />
              <div className="item-card__text">
                <span className="item-card__name">{it.item}</span>
                <span className="item-card__reason">{it.reason}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
