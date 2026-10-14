import localFont from "next/font/local";

/**
 * Police du mot LEGITVISION (composant Marque), et de lui seul : exposée par la
 * variable CSS --font-marque, posée sur le mot. Aucune autre police ne change.
 *
 * Archivo variable, réduite aux neuf capitales du mot (L E G I T V S O N) ; les
 * deux axes sont conservés, graisse (wght, 100-900) et largeur (wdth, 62-125).
 * Fichier source : Archivo[wdth,wght].ttf de google/fonts (ofl/archivo,
 * version 2.001, Omnibus-Type), sous licence SIL OFL 1.1 (fonts/OFL.txt).
 * Sous-ensemble produit avec fontTools 4.60 ; les champs de licence (nom 13
 * et 14) restent dans le fichier :
 *   pyftsubset 'Archivo[wdth,wght].ttf' --text=LEGITVSON --layout-features=kern \
 *     --name-IDs=0,1,2,3,4,5,6,13,14 --flavor=woff2 \
 *     --output-file=archivo-marque.woff2
 * Poids : 5 104 octets, contre 90 096 pour le sous-ensemble latin d'Archivo que
 * chargerait next/font/google avec axes: ["wdth"] (mesure du 04/10).
 *
 * font-stretch est déclaré en plage : sans elle, le navigateur prend la police
 * pour une largeur normale (100 %), et `font-stretch: 125%` n'atteint pas l'axe
 * wdth.
 */
export const archivoMarque = localFont({
  src: "./fonts/archivo-marque.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-marque",
  fallback: ["system-ui", "sans-serif"],
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});
