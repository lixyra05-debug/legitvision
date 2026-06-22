import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/seo/og-template";
import { getBrandBySlug } from "@/lib/seo/data/brands";
import { getSignalBySlugs } from "@/lib/seo/data/signals";
import { getAllGuideParams } from "@/lib/seo/guide-page-data-builder";

export const alt = "LegitVision — Guide d'authentification";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return getAllGuideParams();
}

type Props = { params: { brand: string; signal: string } };

export default function Image({ params }: Props) {
  const brand = getBrandBySlug(params.brand);
  const signal = getSignalBySlugs(params.brand, params.signal);
  const title =
    brand && signal
      ? `${brand.name} — ${signal.name}`
      : "Guide d'authentification";

  return renderOgImage({
    eyebrow: "Guide d'authentification",
    title,
    subtitle: "Pré-authentification visuelle par IA",
  });
}
