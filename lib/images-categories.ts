/**
 * Images des catégories : bandeau de l'accueil (BrandsTabs) et cartes de
 * « Nouvelle analyse » (CategoryPicker), dans un cadre 4:5.
 *
 * `ia` : image générée par IA, qui porte la mention « Image d'illustration »
 * (décision d'Hector du 14/10/2026 ; tests/unit/mention-illustration.test.ts).
 * - sneakers : photo de la paire Air Jordan 1 Low Travis Scott
 *   (travis-reference.png), affichée telle quelle, sans retouche, sur décision
 *   d'Hector du 15/10/2026. Ce n'est pas une image générée : pas de mention.
 *   Elle n'est PAS dans le dépôt (public) : son hébergement attend l'accord
 *   d'Hector, et le test vérifie qu'elle n'est jamais suivie par Git.
 * - sacs, vêtements : images générées par ChatGPT (originaux signés C2PA par
 *   OpenAI).
 */
export const IMAGES_CATEGORIES = {
  sneakers: { src: "/images/categories/travis.png", ia: false },
  sacs: { src: "/images/categories/sacs.webp", ia: true },
  vetements: { src: "/images/categories/vetements.webp", ia: true },
} as const;

export type ImageCategorie = (typeof IMAGES_CATEGORIES)[keyof typeof IMAGES_CATEGORIES];
