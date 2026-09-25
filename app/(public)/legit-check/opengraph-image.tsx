import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/seo/og-template";
import { SEO_COUNTS } from "@/lib/seo/seo-facts";

export const alt = "LegitVision — Legit Check";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Legit Check",
    title: "Authentifier marque par marque",
    subtitle: `${SEO_COUNTS.modelGuides} guides — sneakers, sacs de luxe, streetwear`,
  });
}
