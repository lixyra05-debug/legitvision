"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (next: Theme) => void;
}

const STORAGE_KEY = "legitvision-theme";
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Thème enregistré, avec la règle du script de <head> (app/layout.tsx) :
 * « light » s'il est enregistré, sinon « dark », y compris si le stockage est
 * indisponible.
 */
export function storedTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initial value mirrors the inline <head> script's default (dark).
  // Real value is reconciled in the effect below to match what the
  // script already wrote on <html> — preventing hydration mismatch.
  const [theme, setThemeState] = useState<Theme>("dark");

  // Le script de <head> pose la classe avant le premier affichage, sauf quand
  // le navigateur reconstruit lui-même la page : après une erreur serveur au
  // premier chargement, Next envoie un document de secours
  // (<html id="__next_error__">) que React affiche avec createRoot, sans
  // exécuter le script. <html> n'a alors ni « light » ni « dark », et le thème
  // clair enregistré serait perdu jusqu'au prochain chargement complet (écran
  // d'erreur, « Réessayer », navigation côté client). On pose donc la classe
  // ici, avant l'affichage (useLayoutEffect), avec la même règle que le script.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("light") && !root.classList.contains("dark")) {
      root.classList.add(storedTheme());
    }
    setThemeState(root.classList.contains("light") ? "light" : "dark");
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode, quota) — DOM class still applied.
    }
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [applyTheme, theme]);

  const setTheme = useCallback(
    (next: Theme) => {
      applyTheme(next);
    },
    [applyTheme],
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme doit être utilisé à l'intérieur de <ThemeProvider>");
  }
  return ctx;
}
