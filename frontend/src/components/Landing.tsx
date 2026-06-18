import { useEffect } from "react";
import { useI18n } from "../i18n";
import { LangToggle } from "./LangToggle";
import { BrandLogo } from "./BrandLogo";

const CDN = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes";
const hero = (name: string) => `${CDN}/${name}.png`;

// A scatter of portraits used as atmospheric background in the hero section.
const STRIP = [
  "antimage", "juggernaut", "phantom_assassin", "invoker", "pudge",
  "mirana", "crystal_maiden", "nevermore", "sven", "lina", "axe", "lion",
];

interface Props {
  onEnter: () => void;
}

export function Landing({ onEnter }: Props) {
  const { t } = useI18n();

  // Scroll-storytelling: reveal each chapter as it scrolls into view.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("reveal--in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="landing">
      <header className="landing__top">
        <a className="landing__brand" href="#" onClick={(e) => { e.preventDefault(); onEnter(); }}>
          <BrandLogo />
          <span className="landing__brandName">{t("title")}</span>
        </a>
        <div className="landing__topActions">
          <LangToggle />
          <button type="button" className="landing__cta landing__cta--sm" onClick={onEnter}>
            {t("landing.open")}
          </button>
        </div>
      </header>

      {/* Chapter 0 — hook */}
      <section className="landing__hero">
        <div className="landing__glow" aria-hidden="true" />
        <div className="landing__strip" aria-hidden="true">
          {STRIP.map((h) => (
            <img key={h} src={hero(h)} alt="" loading="lazy" decoding="async" width={130} height={73} />
          ))}
        </div>
        <div className="landing__heroInner">
          <p className="landing__eyebrow">{t("landing.eyebrow")}</p>
          <h1 className="landing__title">{t("landing.heroTitle")}</h1>
          <p className="landing__sub">{t("landing.heroSub")}</p>
          <button type="button" className="landing__cta" onClick={onEnter}>
            {t("landing.cta")} <span aria-hidden="true">→</span>
          </button>
          <p className="landing__scroll" aria-hidden="true">
            {t("landing.scroll")} <span className="landing__scrollArrow">↓</span>
          </p>
        </div>
      </section>

      {/* Chapter 1 — Counters */}
      <section className="landing__chapter reveal" data-accent="danger">
        <div className="landing__chapText">
          <span className="landing__kicker landing__kicker--danger">{t("landing.ch1.kicker")}</span>
          <h2 className="landing__chapTitle">{t("landing.ch1.title")}</h2>
          <p className="landing__chapBody">{t("landing.ch1.body")}</p>
        </div>
        <div className="landing__chapArt">
          <MockRow name="Anti-Mage" img="antimage" value="-14.1%" meter={1} accent="danger" />
          <MockRow name="Sven" img="sven" value="-9.4%" meter={0.66} accent="danger" />
          <MockRow name="Lion" img="lion" value="-7.8%" meter={0.5} accent="danger" />
        </div>
      </section>

      {/* Chapter 2 — Combos */}
      <section className="landing__chapter landing__chapter--alt reveal" data-accent="synergy">
        <div className="landing__chapText">
          <span className="landing__kicker landing__kicker--synergy">{t("landing.ch2.kicker")}</span>
          <h2 className="landing__chapTitle">{t("landing.ch2.title")}</h2>
          <p className="landing__chapBody">{t("landing.ch2.body")}</p>
        </div>
        <div className="landing__chapArt">
          <div className="landing__combo">
            <img src={hero("crystal_maiden")} alt="Crystal Maiden" />
            <span className="landing__comboPlus" aria-hidden="true">+</span>
            <img src={hero("lina")} alt="Lina" />
          </div>
          <p className="landing__comboCaption">Crystal Maiden + Lina — chain stun into burst</p>
        </div>
      </section>

      {/* Chapter 3 — Draft mode */}
      <section className="landing__chapter reveal" data-accent="orange">
        <div className="landing__chapText">
          <span className="landing__kicker landing__kicker--orange">{t("landing.ch3.kicker")}</span>
          <h2 className="landing__chapTitle">{t("landing.ch3.title")}</h2>
          <p className="landing__chapBody">{t("landing.ch3.body")}</p>
        </div>
        <div className="landing__chapArt">
          <div className="landing__draft">
            <div className="landing__draftRow landing__draftRow--ally">
              <img src={hero("crystal_maiden")} alt="" />
              <img src={hero("axe")} alt="" />
              <span className="landing__slot" />
            </div>
            <div className="landing__draftRow landing__draftRow--enemy">
              <img src={hero("antimage")} alt="" />
              <img src={hero("juggernaut")} alt="" />
              <span className="landing__slot" />
            </div>
            <div className="landing__pick">
              <img src={hero("phantom_assassin")} alt="Phantom Assassin" />
              <div>
                <strong>Phantom Assassin</strong>
                <span className="landing__pickTag">+21.9% best pick</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Climax CTA */}
      <section className="landing__climax reveal">
        <h2 className="landing__climaxTitle">{t("landing.climaxTitle")}</h2>
        <p className="landing__climaxBody">{t("landing.climaxBody")}</p>
        <button type="button" className="landing__cta landing__cta--big" onClick={onEnter}>
          {t("landing.cta")} <span aria-hidden="true">→</span>
        </button>
      </section>

      <footer className="landing__footer muted">
        {t("landing.footer")}{" "}
        <a href="https://www.opendota.com" target="_blank" rel="noreferrer">OpenDota</a>.
      </footer>
    </div>
  );
}

function MockRow({
  name, img, value, meter, accent,
}: { name: string; img: string; value: string; meter: number; accent: string }) {
  return (
    <div className={`landing__mock landing__mock--${accent}`}>
      <img src={hero(img)} alt="" />
      <div className="landing__mockBody">
        <div className="landing__mockTop">
          <span className="landing__mockName">{name}</span>
          <span className="landing__mockVal">{value}</span>
        </div>
        <div className="landing__mockMeter">
          <div className="landing__mockFill" style={{ width: `${Math.round(meter * 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
