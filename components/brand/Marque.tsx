import Link from "next/link";
import { archivoMarque } from "./police-marque";

/**
 * Le mot LEGITVISION, en texte, partout où l'interface affichait l'image du
 * logo : en-têtes, pieds de page, /auth, 404 (décision d'Hector du 04/10).
 * L'icône de l'onglet et les images de partage gardent l'ancien logo en
 * attendant le nouveau.
 *
 * Style de texte « Marque » de Figma : Archivo, graisse 800, largeur 125,
 * espacement des lettres 2 % (0,02 em), interligne 100 %, 17 px sur téléphone
 * et 20 px à partir de 640 px (`sm`, le point de rupture des en-têtes).
 * Couleur : --foreground. Mêmes valeurs dans les pieds de page.
 *
 * Le texte source reste « LegitVision » et les capitales viennent du CSS.
 * Chromium transmet pourtant « LEGITVISION » à l'arbre d'accessibilité ; la
 * voix française de macOS le lit comme un seul mot. Le nom des liens vient de
 * leur aria-label.
 *
 * La police est réduite aux neuf capitales du mot (police-marque.ts) : changer
 * le texte impose de régénérer le sous-ensemble (commande pyftsubset dans
 * police-marque.ts), sinon les lettres absentes s'affichent dans une autre
 * police. tests/unit/marque.test.ts le vérifie.
 *
 * Largeur réservée, 8,588 em : 8,368 em d'avances en 800/125 (HarfBuzz, police
 * complète), plus 11 × 0,02 em d'espacement ; soit 146 px à 17 px et
 * 171,8 px à 20 px. Pendant le chargement de la police, le repli (Arial) est
 * 24 % plus étroit : sans cette largeur, le mot s'élargissait à l'arrivée de la
 * police et poussait ses voisins. À recalculer si le texte ou le style change.
 */

/** Nom accessible du lien, selon sa destination. Il commence par le mot affiché. */
const NOM_DU_LIEN = {
  "/": "LegitVision, accueil",
  "/dashboard": "LegitVision, tableau de bord",
} as const;

export type DestinationMarque = keyof typeof NOM_DU_LIEN;

export function Marque({ href }: { href?: DestinationMarque }) {
  const mot = (
    <span
      translate="no"
      className={`${archivoMarque.variable} inline-block w-[8.588em] shrink-0 whitespace-nowrap font-marque text-[1.0625rem] font-extrabold uppercase leading-none tracking-[0.02em] text-foreground [font-stretch:125%] sm:text-[1.25rem]`}
    >
      LegitVision
    </span>
  );

  if (!href) return mot;

  // Cible de 48 px de haut (24 px au minimum) ; w-fit : le lien épouse le mot,
  // même dans une colonne flex qui étirerait ses enfants. lang="fr" : le nom du
  // lien est en français, même pour un visiteur resté en anglais (<html lang="en">).
  return (
    <Link
      href={href}
      lang="fr"
      aria-label={NOM_DU_LIEN[href]}
      className="inline-flex min-h-12 w-fit shrink-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {mot}
    </Link>
  );
}
