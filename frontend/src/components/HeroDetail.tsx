import type { HeroWithId, Meta } from "../types";
import { attrLabel, formatDelta } from "../lib";
import { HeroAvatar } from "./HeroAvatar";
import { RelationSection, type RelationItem } from "./RelationSection";
import { ItemPanel } from "./ItemPanel";

interface Props {
  hero: HeroWithId;
  byId: Map<number, HeroWithId>;
  meta: Meta;
}

export function HeroDetail({ hero, byId, meta }: Props) {
  const counteredBy: RelationItem[] = hero.countered_by.map((e) => ({
    hero_id: e.hero_id,
    reason: e.reason,
    detail: `${formatDelta(e.delta)} win rate vs this hero's average`,
  }));

  const counters: RelationItem[] = hero.counters.map((e) => ({
    hero_id: e.hero_id,
    reason: e.reason,
    detail: `${formatDelta(e.delta)} win rate vs this hero's average`,
  }));

  const synergies: RelationItem[] = hero.synergies.map((e) => ({
    hero_id: e.hero_id,
    reason: e.reason,
    detail: `Synergy score ${e.score}`,
  }));

  return (
    <div className="detail">
      <div className="detail__hero">
        <HeroAvatar src={hero.icon_url} name={hero.localized_name} width={132} />
        <div className="detail__heroInfo">
          <h2 className="detail__name">{hero.localized_name}</h2>
          <div className="detail__tags">
            <span className={`tag tag--attr tag--${hero.attributes.primary_attr}`}>
              {attrLabel(hero.attributes.primary_attr)}
            </span>
            <span className="tag">{hero.attributes.attack_type}</span>
            {hero.roles.map((r) => (
              <span key={r} className="tag tag--role">
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      {meta.low_sample_warning && (
        <div className="banner" role="status">
          <span className="banner__dot" aria-hidden="true" />
          Patch {meta.patch} is new — counter data may still be settling.
        </div>
      )}

      <div className="detail__sections">
        <RelationSection
          title="Countered by"
          subtitle="Heroes that tend to beat this hero — avoid or respect them."
          accent="danger"
          items={counteredBy}
          byId={byId}
          emptyText="No strong counters at the current sample size."
        />
        <RelationSection
          title="Counters"
          subtitle="Heroes this hero beats well — good picks into them."
          accent="good"
          items={counters}
          byId={byId}
          emptyText="No standout favourable matchups at the current sample size."
        />
        <RelationSection
          title="Works well with"
          subtitle="Teammates whose kits combine well with this hero."
          accent="synergy"
          items={synergies}
          byId={byId}
          emptyText="No notable synergies found."
        />
      </div>

      <div className="item-panels">
        <ItemPanel
          title="Best items"
          subtitle={`Most-built core items on ${hero.localized_name} (from real match data).`}
          accent="build"
          items={hero.recommended_items}
          emptyText="No item-build data for this hero yet."
        />
        <ItemPanel
          title="Counter items"
          subtitle={`Itemization that blunts ${hero.localized_name}'s strengths.`}
          accent="counter"
          items={hero.item_counters}
          emptyText="No standout item counters for this hero."
        />
      </div>

      <p className="detail__hint muted">Tap any hero to reveal the win-rate / synergy detail.</p>
    </div>
  );
}
