import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/seo/og-template";

export const alt = "LegitVision — Guides d'authentification";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Guides d'authentification",
    title: "Vérifier signal par signal",
    subtitle: "66 protocoles détaillés par marque",
  });
}
