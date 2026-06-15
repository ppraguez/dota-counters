import { useI18n } from "../i18n";

const ATTRS = ["str", "agi", "int", "all"] as const;
const ROLES = [
  "Carry", "Support", "Nuker", "Disabler",
  "Initiator", "Durable", "Escape", "Pusher", "Jungler",
] as const;

export type AttrFilter = (typeof ATTRS)[number] | null;
export type RoleFilter = (typeof ROLES)[number] | null;

interface Props {
  attr: AttrFilter;
  role: RoleFilter;
  onAttr: (v: AttrFilter) => void;
  onRole: (v: RoleFilter) => void;
}

export function FilterBar({ attr, role, onAttr, onRole }: Props) {
  const { t } = useI18n();

  return (
    <div className="filter-bar">
      <div className="filter-bar__group">
        {ATTRS.map((a) => (
          <button
            key={a}
            type="button"
            className={`filter-chip filter-chip--attr filter-chip--${a} ${attr === a ? "filter-chip--active" : ""}`}
            onClick={() => onAttr(attr === a ? null : a)}
          >
            {t(`attr.${a}`)}
          </button>
        ))}
      </div>
      <div className="filter-bar__group filter-bar__group--roles">
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            className={`filter-chip ${role === r ? "filter-chip--active filter-chip--role-active" : ""}`}
            onClick={() => onRole(role === r ? null : r)}
          >
            {t(`roles.${r}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
