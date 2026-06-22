import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/seo/og-template";

export const alt = "LegitVision — Legit Check";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Legit Check",
    title: "Authentifier marque par marque",
    subtitle: "72 guides — sneakers, sacs de luxe, streetwear",
  });
}
