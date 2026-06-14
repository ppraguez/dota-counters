import type { HeroWithId } from "../types";
import { HeroAvatar } from "./HeroAvatar";

interface Props {
  heroes: HeroWithId[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

/** Responsive, searchable grid of hero tiles. */
export function HeroGrid({ heroes, selectedId, onSelect }: Props) {
  if (heroes.length === 0) {
    return <p className="muted grid-empty">No heroes match your search.</p>;
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
