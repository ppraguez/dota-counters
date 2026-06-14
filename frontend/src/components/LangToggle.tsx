import { useI18n, type Lang } from "../i18n";

/** Compact EN | TH segmented switch for the top bar. */
export function LangToggle() {
  const { lang, setLang, t } = useI18n();
  const options: Lang[] = ["en", "th"];

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`lang-toggle__btn ${lang === opt ? "lang-toggle__btn--active" : ""}`}
          aria-pressed={lang === opt}
          onClick={() => setLang(opt)}
        >
          {t(`lang.${opt}`)}
        </button>
      ))}
    </div>
  );
}
