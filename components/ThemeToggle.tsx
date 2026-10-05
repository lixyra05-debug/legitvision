"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/**
 * Anneau de focus : --ring, opaque, comme le lien de la marque (l'accent à 50 % ne tenait pas 3:1).
 *
 * `masqueSous360` : le bouton ne s'affiche qu'à partir de 360 px. Seulement
 * dans l'en-tête de l'accueil (option B, décision d'Hector du 05/10) : avec
 * lui, le mot LEGITVISION et « Se connecter » se touchaient jusqu'à 347 px
 * (352 px en anglais), les boutons ronds s'écrasaient et le libellé passait
 * sur deux lignes (mesures du 05/10).
 */
export function ThemeToggle({ masqueSous360 = false }: { masqueSous360?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const affichage = masqueSous360 ? "hidden min-[360px]:flex" : "flex";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
      className={`${affichage} relative size-9 items-center justify-center rounded-full border border-line bg-surface text-muted-foreground transition-[color,background-color,border-color] duration-fast hover:border-accent/40 hover:bg-surface-raised hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
    >
      <Sun
        className={`absolute size-4 transition-[transform,opacity] duration-base ${
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`absolute size-4 transition-[transform,opacity] duration-base ${
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
