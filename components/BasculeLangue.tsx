"use client";

import { Languages } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { Locale } from "@/lib/i18n/translations";

/**
 * Commande de langue affichée à toutes les largeurs (décision d'Hector du
 * 05/10). Sur téléphone, le bouton FR/EN des en-têtes est masqué
 * (LanguageToggle) ; la langue se change alors ici, pour tout visiteur, en
 * français comme en anglais :
 * - dans le pied de page de l'accueil (FooterLinksI18n) ;
 * - dans le menu du compte (UserMenu : tableau de bord, nouvelle analyse, et
 *   accueil une fois connecté).
 * tests/unit/langue-telephone.test.ts échoue si l'une des deux disparaît.
 *
 * Libellé écrit dans la langue de destination, avec son attribut lang
 * (WCAG 3.1.2) : « English version » pour le visiteur en français, « Version
 * française » pour le visiteur en anglais. Ce texte est aussi le nom
 * accessible (WCAG 2.5.3) ; l'icône est décorative.
 *
 * Cible : 24 px de haut au moins dans le pied de page (WCAG 2.5.8), 36 px
 * dans le menu. Anneau de focus --ring, opaque, comme les boutons des
 * en-têtes. Dans le menu, la commande le laisse ouvert : son libellé change
 * sous le doigt, et le focus reste en place.
 *
 * Couleur --muted-foreground, pas --subtle-foreground comme les liens voisins
 * du pied de page : cette commande est nécessaire, et --subtle-foreground
 * (4,3:1) ne tient pas le 4,5:1 du texte courant (app/globals.css).
 *
 * Disparaît avec la version anglaise, dans la refonte.
 */

/** Libellé de la commande, selon la langue de destination. */
export const VERS_LA_LANGUE: Record<Locale, { texte: string; lang: Locale }> = {
  en: { texte: "English version", lang: "en" },
  fr: { texte: "Version française", lang: "fr" },
};

const CLASSES = {
  "pied-de-page":
    "inline-flex min-h-6 items-center gap-1.5 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  menu: "flex min-h-9 w-full items-center gap-2 rounded-sm px-3 py-2 text-ui text-muted-foreground transition-colors duration-fast hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
} as const;

export function BasculeLangue({ variante }: { variante: keyof typeof CLASSES }) {
  const { locale, toggleLocale } = useTranslation();
  const { texte, lang } = VERS_LA_LANGUE[locale === "fr" ? "en" : "fr"];

  return (
    <button type="button" lang={lang} onClick={toggleLocale} className={CLASSES[variante]}>
      <Languages aria-hidden="true" className="size-4 shrink-0" />
      {texte}
    </button>
  );
}
