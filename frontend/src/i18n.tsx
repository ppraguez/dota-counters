import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import en from "./locales/en.json";
import th from "./locales/th.json";

export type Lang = "en" | "th";

const DICTS: Record<Lang, unknown> = { en, th };
const STORAGE_KEY = "dota-lang";

/** Anything in the data that carries an English reason plus its Thai translation. */
export interface Localizable {
  reason: string;
  reason_th?: string;
}

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a dot-path key (e.g. "sections.counters.title") with optional {var} interpolation. */
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Pick the Thai reason when in Thai mode, falling back to English. */
  reasonOf: (entry: Localizable) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function lookup(dict: unknown, key: string): string | undefined {
  let cur: unknown = dict;
  for (const part of key.split(".")) {
    if (cur && typeof cur === "object" && part in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in vars ? String(vars[name]) : whole,
  );
}

function readInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "th") return stored;
  } catch {
    /* localStorage unavailable (private mode, etc.) — fall through */
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  // Persist choice + keep <html lang> in sync (affects font fallback + a11y).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const template = lookup(DICTS[lang], key) ?? lookup(DICTS.en, key) ?? key;
      return interpolate(template, vars);
    },
    [lang],
  );

  const reasonOf = useCallback(
    (entry: Localizable): string =>
      lang === "th" && entry.reason_th ? entry.reason_th : entry.reason,
    [lang],
  );

  const value = useMemo<I18nValue>(() => ({ lang, setLang, t, reasonOf }), [lang, setLang, t, reasonOf]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
