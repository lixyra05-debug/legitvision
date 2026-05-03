"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initial value mirrors the inline <head> script's default (dark).
  // Real value is reconciled in the effect below to match what the
  // script already wrote on <html> — preventing hydration mismatch.
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const root = document.documentElement;
    const current: Theme = root.classList.contains("light") ? "light" : "dark";
    setThemeState(current);
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
