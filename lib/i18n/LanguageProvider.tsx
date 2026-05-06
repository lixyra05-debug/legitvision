"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  translations,
  type Locale,
} from "./translations";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  t: (key: string) => string;
}

const STORAGE_KEY = "legitvision-lang";
const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/**
 * Navigation dotted-key dans l'objet de traductions.
 * Ex: t("hero.title") → translations[locale].hero.title
 * Si la clé n'existe pas → retourne la clé brute (debug-friendly).
 */
function resolveKey(locale: Locale, key: string): string {
  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = translations[locale];
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return key;
    }
  }
  return typeof current === "string" ? current : key;
}

function isValidLocale(value: string | null): value is Locale {
  return value !== null && (SUPPORTED_LOCALES as string[]).includes(value);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initial state = défaut FR. Reconciliation dans useEffect pour matcher
  // localStorage sans casser l'hydratation SSR (server rend toujours "fr").
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isValidLocale(stored)) {
        setLocaleState(stored);
      }
    } catch {
      // localStorage indisponible (private mode, quota) — on garde le défaut.
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage indisponible — la langue est appliquée en mémoire.
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "fr" ? "en" : "fr");
  }, [locale, setLocale]);

  const t = useCallback((key: string) => resolveKey(locale, key), [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error(
      "useTranslation doit être utilisé à l'intérieur de <LanguageProvider>",
    );
  }
  return ctx;
}
