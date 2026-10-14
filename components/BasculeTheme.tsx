"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/**
 * Commande de thème du pied de page de l'accueil, affichée seulement sous
 * 360 px. À ces largeurs, le bouton de thème de l'en-tête est masqué
 * (ThemeToggle, `masqueSous360` : option B, décision d'Hector du 05/10), et le
 * thème ne suit pas celui de l'appareil : il est sombre par défaut, clair sur
 * choix enregistré (ThemeProvider). Sans cette commande, un visiteur sans
 * compte n'aurait plus aucun moyen de changer de thème sur ces écrans.
 * tests/unit/theme-sous-360.test.ts échoue si elle disparaît.
 *
 * Libellé en français avec son attribut lang, comme le lien de la marque : on
 * n'ajoute plus de texte à la version anglaise (elle part avec la refonte).
 * Même cible (24 px), même couleur et même anneau de focus que la commande de
 * langue voisine (BasculeLangue).
 */
export function BasculeTheme() {
  const { theme, toggleTheme } = useTheme();
  const versClair = theme === "dark";
  const Icone = versClair ? Sun : Moon;

  return (
    <button
      type="button"
      lang="fr"
      onClick={toggleTheme}
      className="inline-flex min-h-6 items-center gap-1.5 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-[360px]:hidden"
    >
      <Icone aria-hidden="true" className="size-4 shrink-0" />
      {versClair ? "Thème clair" : "Thème sombre"}
    </button>
  );
}
