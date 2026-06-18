import type { HeroWithId, Meta } from "../types";
import { formatDelta } from "../lib";
import { useI18n } from "../i18n";
import { HeroAvatar } from "./HeroAvatar";
import { RelationSection, type RelationItem } from "./RelationSection";
import { ItemPanel } from "./ItemPanel";
import { AbilityPanel } from "./AbilityPanel";

interface Props {
  hero: HeroWithId;
  byId: Map<number, HeroWithId>;
  meta: Meta;
  onSelect?: (id: number) => void;
}

export function HeroDetail({ hero, byId, meta, onSelect }: Props) {
  const { t, reasonOf } = useI18n();

  // Scale each section's meter bars relative to that section's strongest entry,
  // so the bars read as "how strong vs the rest" at a glance (min 12% so the
  // weakest still shows a sliver).
  const meterOf = (value: number, max: number) =>
    Math.max(0.12, Math.min(1, max > 0 ? value / max : 0));

  const maxCounteredBy = Math.max(0, ...hero.countered_by.map((e) => Math.abs(e.delta)));
  const maxCounters = Math.max(0, ...hero.counters.map((e) => Math.abs(e.delta)));
  const maxSynergy = Math.max(0, ...hero.synergies.map((e) => e.score));

  const counteredBy: RelationItem[] = hero.countered_by.map((e) => ({
    hero_id: e.hero_id,
    reason: reasonOf(e),
    value: formatDelta(e.delta),
    meter: meterOf(Math.abs(e.delta), maxCounteredBy),
  }));

  const counters: RelationItem[] = hero.counters.map((e) => ({
    hero_id: e.hero_id,
    reason: reasonOf(e),
    value: formatDelta(e.delta),
    meter: meterOf(Math.abs(e.delta), maxCounters),
  }));

  const synergies: RelationItem[] = hero.synergies.map((e) => ({
    hero_id: e.hero_id,
    reason: reasonOf(e),
    meter: meterOf(e.score, maxSynergy),
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
          onSelect={onSelect}
        />
        <RelationSection
          title={t("sections.counters.title")}
          subtitle={t("sections.counters.subtitle")}
          accent="good"
          items={counters}
          byId={byId}
          emptyText={t("sections.counters.empty")}
          onSelect={onSelect}
        />
        <RelationSection
          title={t("sections.synergies.title")}
          subtitle={t("sections.synergies.subtitle")}
          accent="synergy"
          items={synergies}
          byId={byId}
          emptyText={t("sections.synergies.empty")}
          onSelect={onSelect}
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

      <AbilityPanel items={hero.ability_counters ?? []} />

      <p className="detail__hint muted">{t("detail.hint")}</p>
    </div>
  );
}
