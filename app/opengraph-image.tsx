import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/seo/og-template";

// Image OG par défaut du site (home + fallback global pour toute page sans
// opengraph-image dédié). Répare og:image ET twitter:image (twitter retombe
// automatiquement sur openGraph.images en l'absence de twitter.images).
export const alt = "LegitVision — Authentification d'articles de luxe par IA";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Authentification par IA",
    title: "Scannez avant d'acheter",
    subtitle: "Sneakers · Sacs · Montres · Vêtements de luxe",
  });
}
