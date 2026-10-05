"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";

/**
 * Bouton FR/EN des en-têtes. Sur téléphone (moins de 640 px), il n'apparaît
 * qu'en anglais, pour revenir au français : le site est en français (décision
 * d'Hector du 25/09) et, depuis le 04/10, le mot LEGITVISION occupe sa place
 * dans les en-têtes. `masqueSurTelephone` le masque aussi en anglais, là où la
 * place manque (en-tête du tableau de bord).
 *
 * Où changer de langue sur téléphone, en français comme en anglais (décision
 * d'Hector du 05/10) : la commande BasculeLangue, affichée à toutes les
 * largeurs, dans le pied de page de l'accueil et dans le menu du compte
 * (tableau de bord, nouvelle analyse ; accueil une fois connecté). Le rapport
 * n'a pas de menu du compte : en anglais, ce bouton y reste affiché ; en
 * français, la langue se change depuis le tableau de bord, où mène son lien
 * retour. tests/unit/langue-telephone.test.ts échoue si l'une des deux
 * commandes disparaît.
 *
 * Anneau de focus : --ring, opaque (5,07:1 en clair, 7,8:1 en sombre), comme
 * le lien de la marque ; l'accent à 50 % ne tenait pas 3:1.
 */
export function LanguageToggle({ masqueSurTelephone = false }: { masqueSurTelephone?: boolean }) {
  const { locale, toggleLocale } = useTranslation();
  const next = locale === "fr" ? "en" : "fr";
  const label = locale === "fr" ? "FR" : "EN";
  const affichage = locale === "fr" || masqueSurTelephone ? "hidden sm:flex" : "flex";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={`Switch to ${next.toUpperCase()}`}
      title={`${locale.toUpperCase()} → ${next.toUpperCase()}`}
      className={`${affichage} size-9 items-center justify-center rounded-full border border-line bg-surface text-caption font-semibold text-muted-foreground transition-[color,background-color,border-color] duration-fast hover:border-accent/40 hover:bg-surface-raised hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
    >
      {label}
    </button>
  );
}
