import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/seo/og-template";

export const alt = "LegitVision — Acheter authentique";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Acheter authentique",
    title: "Éviter les contrefaçons en ligne",
    subtitle: "Vinted · Vestiaire Collective · eBay · Depop",
  });
}
