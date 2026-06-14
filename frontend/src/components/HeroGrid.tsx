import type { HeroWithId } from "../types";
import { HeroAvatar } from "./HeroAvatar";
import { useI18n } from "../i18n";

interface Props {
  heroes: HeroWithId[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

/** Responsive, searchable grid of hero tiles. */
export function HeroGrid({ heroes, selectedId, onSelect }: Props) {
  const { t } = useI18n();
  if (heroes.length === 0) {
    return <p className="muted grid-empty">{t("grid.noMatch")}</p>;
  }

  return (
    <ul className="hero-grid" role="listbox" aria-label="Heroes">
      {heroes.map((h) => {
        const selected = h.id === selectedId;
        return (
          <li key={h.id}>
            <button
              type="button"
              className={`hero-tile ${selected ? "hero-tile--selected" : ""}`}
              aria-pressed={selected}
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
