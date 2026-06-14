import type { HeroWithId, Meta } from "../types";
import { formatDelta } from "../lib";
import { useI18n } from "../i18n";
import { HeroAvatar } from "./HeroAvatar";
import { RelationSection, type RelationItem } from "./RelationSection";
import { ItemPanel } from "./ItemPanel";

interface Props {
  hero: HeroWithId;
  byId: Map<number, HeroWithId>;
  meta: Meta;
}

export function HeroDetail({ hero, byId, meta }: Props) {
  const { t, reasonOf } = useI18n();

  const counteredBy: RelationItem[] = hero.countered_by.map((e) => ({
    hero_id: e.hero_id,
    reason: reasonOf(e),
    detail: t("detail.winrate", { delta: formatDelta(e.delta) }),
  }));

  const counters: RelationItem[] = hero.counters.map((e) => ({
    hero_id: e.hero_id,
    reason: reasonOf(e),
    detail: t("detail.winrate", { delta: formatDelta(e.delta) }),
  }));

  const synergies: RelationItem[] = hero.synergies.map((e) => ({
    hero_id: e.hero_id,
    reason: reasonOf(e),
    detail: t("detail.synergy", { score: e.score }),
  }));

  return (
    <div className="detail">
      <div className="detail__hero">
        <HeroAvatar src={hero.icon_url} name={hero.localized_name} width={132} />
        <div className="detail__heroInfo">
          <h2 className="detail__name">{hero.localized_name}</h2>
          <div className="detail__tags">
            <span className={`tag tag--attr tag--${hero.attributes.primary_attr}`}>
              {t(`attr.${hero.attributes.primary_attr}`)}
            </span>
            <span className="tag">{t(`attack.${hero.attributes.attack_type}`)}</span>
            {hero.roles.map((r) => (
              <span key={r} className="tag tag--role">
                {t(`roles.${r}`)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {meta.low_sample_warning && (
        <div className="banner" role="status">
          <span className="banner__dot" aria-hidden="true" />
          {t("banner", { patch: meta.patch })}
        </div>
      )}

      <div className="detail__sections">
        <RelationSection
          title={t("sections.counteredBy.title")}
          subtitle={t("sections.counteredBy.subtitle")}
          accent="danger"
          items={counteredBy}
          byId={byId}
          emptyText={t("sections.counteredBy.empty")}
        />
        <RelationSection
          title={t("sections.counters.title")}
          subtitle={t("sections.counters.subtitle")}
          accent="good"
          items={counters}
          byId={byId}
          emptyText={t("sections.counters.empty")}
        />
        <RelationSection
          title={t("sections.synergies.title")}
          subtitle={t("sections.synergies.subtitle")}
          accent="synergy"
          items={synergies}
          byId={byId}
          emptyText={t("sections.synergies.empty")}
        />
      </div>

      <div className="item-panels">
        <ItemPanel
          title={t("items.best.title")}
          subtitle={t("items.best.subtitle", { name: hero.localized_name })}
          accent="build"
          items={hero.recommended_items}
          emptyText={t("items.best.empty")}
        />
        <ItemPanel
          title={t("items.counter.title")}
          subtitle={t("items.counter.subtitle", { name: hero.localized_name })}
          accent="counter"
          items={hero.item_counters}
          emptyText={t("items.counter.empty")}
        />
      </div>

      <p className="detail__hint muted">{t("detail.hint")}</p>
    </div>
  );
}
