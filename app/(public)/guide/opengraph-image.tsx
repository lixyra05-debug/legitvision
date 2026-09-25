import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/seo/og-template";
import { SEO_COUNTS } from "@/lib/seo/seo-facts";

export const alt = "LegitVision — Guides d'authentification";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Guides d'authentification",
    title: "Vérifier signal par signal",
    subtitle: `${SEO_COUNTS.signalGuides} protocoles détaillés par marque`,
  });
}
