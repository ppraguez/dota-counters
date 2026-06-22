import type { HeroWithId, RolesMeta } from "../types";
import { useI18n } from "../i18n";
import { HeroAvatar } from "./HeroAvatar";

// Lane positions in display order — keys match the pipeline's roles_meta output.
const ROLE_ORDER = ["pos1", "pos2", "pos3", "pos4", "pos5"];

// Map a win rate to a 0..1 bar fill, anchored to a 46%–56% window so the
// spread between ~50% and ~54% reads clearly (a raw 0–100% bar would barely move).
function meterOf(winRate: number): number {
  const v = (winRate - 0.46) / (0.56 - 0.46);
  return Math.max(0.06, Math.min(1, v));
}

const pct = (n: number): string => `${(n * 100).toFixed(1)}%`;

interface Props {
  rolesMeta: RolesMeta;
  byId: Map<number, HeroWithId>;
  onSelect: (id: number) => void;
}

export function RolesMetaView({ rolesMeta, byId, onSelect }: Props) {
  const { t } = useI18n();
  const roles = ROLE_ORDER.filter((r) => (rolesMeta.roles[r]?.length ?? 0) > 0);

  return (
    <section className="meta">
      <header className="meta__head">
        <h2 className="meta__title">{t("meta.title")}</h2>
        <p className="meta__subtitle muted">{t("meta.subtitle")}</p>
      </header>

      <div className="meta__grid">
        {roles.map((role) => (
          <div key={role} className="meta-card">
            <h3 className="meta-card__title">{t(`meta.${role}`)}</h3>
            <ol className="meta-card__list">
              {(rolesMeta.roles[role] ?? []).map((e, i) => {
                const hero = byId.get(e.hero_id);
                const name = hero?.localized_name ?? t("detail.heroFallback", { id: e.hero_id });
                return (
                  <li key={e.hero_id} className="meta-row">
                    <button
                      type="button"
                      className="meta-row__btn"
                      onClick={() => onSelect(e.hero_id)}
                      title={t("detail.viewHero", { name })}
                    >
                      <span className="meta-row__rank">{i + 1}</span>
                      {hero && (
                        <HeroAvatar src={hero.icon_url} name={name} width={44} className="meta-row__icon" />
                      )}
                      <span className="meta-row__body">
                        <span className="meta-row__top">
                          <span className="meta-row__name">{name}</span>
                          <span className="meta-row__wr">{pct(e.win_rate)}</span>
                        </span>
                        <span className="meta-row__bar" aria-hidden="true">
                          <span className="meta-row__fill" style={{ width: `${Math.round(meterOf(e.win_rate) * 100)}%` }} />
                        </span>
                        <span className="meta-row__sub muted">
                          {t("meta.win")} · {pct(e.pick_rate)} {t("meta.pick")}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>

      <p className="meta__source muted">{t("meta.source")}</p>
    </section>
  );
}
