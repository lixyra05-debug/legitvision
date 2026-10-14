"use client";

import { useRef } from "react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { VERS_LA_LANGUE } from "@/components/BasculeLangue";

/** Ce qui peut prendre le focus dans un en-tête, dans l'ordre du document. */
const FOCALISABLES = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Affiché : ni display:none, ni ancêtre masqué. */
function estAffiche(element: HTMLElement): boolean {
  return typeof element.checkVisibility === "function"
    ? element.checkVisibility()
    : element.getClientRects().length > 0;
}

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
 * commandes disparaît, ou si le tableau de bord ou la nouvelle analyse ne
 * rendent plus le menu du compte.
 *
 * Nom accessible (aria-label) : le libellé affiché d'abord (WCAG 2.5.3), puis
 * la destination, écrite dans sa langue comme celle de BasculeLangue, avec
 * l'attribut lang sur le bouton (WCAG 3.1.2) : « EN, Version française »,
 * « FR, English version ». L'ancien nom, « Switch to FR », ne contenait pas le
 * libellé affiché.
 *
 * Focus : sous 640 px, le retour au français masque le bouton. S'il avait le
 * focus (clavier), celui-ci passe à l'élément suivant de l'en-tête encore
 * affiché (thème, compte ou « Se connecter »), à défaut au précédent : sans
 * cela, il retombait sur <body> et plus rien n'était focalisé.
 *
 * Anneau de focus : --ring, opaque (5,07:1 en clair, 7,8:1 en sombre), comme
 * le lien de la marque ; l'accent à 50 % ne tenait pas 3:1.
 */
export function LanguageToggle({ masqueSurTelephone = false }: { masqueSurTelephone?: boolean }) {
  const { locale, toggleLocale } = useTranslation();
  const boutonRef = useRef<HTMLButtonElement>(null);
  const next = locale === "fr" ? "en" : "fr";
  const label = locale === "fr" ? "FR" : "EN";
  const affichage = locale === "fr" || masqueSurTelephone ? "hidden sm:flex" : "flex";

  function basculer() {
    const bouton = boutonRef.current;
    const avaitLeFocus = bouton !== null && document.activeElement === bouton;
    toggleLocale();
    if (!bouton || !avaitLeFocus) return;
    // Après le rendu : le bouton est-il encore affiché dans la nouvelle langue ?
    requestAnimationFrame(() => {
      if (estAffiche(bouton)) return;
      const entete = bouton.closest("nav") ?? bouton.parentElement;
      if (!entete) return;
      const voisins = [...entete.querySelectorAll<HTMLElement>(FOCALISABLES)];
      const rang = voisins.indexOf(bouton);
      const suivant =
        voisins.slice(rang + 1).find(estAffiche) ?? voisins.slice(0, Math.max(rang, 0)).reverse().find(estAffiche);
      suivant?.focus();
    });
  }

  return (
    <button
      ref={boutonRef}
      type="button"
      lang={next}
      onClick={basculer}
      aria-label={`${label}, ${VERS_LA_LANGUE[next].texte}`}
      title={`${locale.toUpperCase()} → ${next.toUpperCase()}`}
      className={`${affichage} size-9 items-center justify-center rounded-full border border-line bg-surface text-caption font-semibold text-muted-foreground transition-[color,background-color,border-color] duration-fast hover:border-accent/40 hover:bg-surface-raised hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
    >
      {label}
    </button>
  );
}
