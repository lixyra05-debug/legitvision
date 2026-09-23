import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/seo/og-template";
import { getBrandBySlug } from "@/lib/seo/data/brands";
import { getAllBrandSlugsWithSignals } from "@/lib/seo/data/signals";

export const alt = "LegitVision — Guides d'authentification";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return getAllBrandSlugsWithSignals().map((brand) => ({ brand }));
}

type Props = { params: Promise<{ brand: string }> };

export default async function Image(props: Props) {
  const params = await props.params;
  const brand = getBrandBySlug(params.brand);
  return renderOgImage({
    eyebrow: "Guides d'authentification",
    title: brand ? brand.name : "Guides",
    subtitle: "Signaux d'authentification à maîtriser",
  });
}
