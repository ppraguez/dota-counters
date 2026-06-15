import type { HeroWithId } from "../types";
import { HeroAvatar } from "./HeroAvatar";
import { useI18n } from "../i18n";

export type TileMark = "ally" | "enemy";

interface Props {
  heroes: HeroWithId[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  /** Draft-mode markers: hero id → which team it's on. */
  marks?: Map<number, TileMark>;
}

/** Responsive, searchable grid of hero tiles. */
export function HeroGrid({ heroes, selectedId, onSelect, marks }: Props) {
  const { t } = useI18n();
  if (heroes.length === 0) {
    return <p className="muted grid-empty">{t("grid.noMatch")}</p>;
  }

  return (
    <ul className="hero-grid" role="listbox" aria-label="Heroes">
      {heroes.map((h) => {
        const selected = h.id === selectedId;
        const mark = marks?.get(h.id) ?? null;
        return (
          <li key={h.id}>
            <button
              type="button"
              className={`hero-tile ${selected ? "hero-tile--selected" : ""} ${
                mark ? `hero-tile--${mark}` : ""
              }`}
              aria-pressed={selected || mark !== null}
              onClick={() => onSelect(h.id)}
              title={h.localized_name}
            >
              <HeroAvatar src={h.icon_url} name={h.localized_name} width={96} />
              <span className="hero-tile__name">{h.localized_name}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
