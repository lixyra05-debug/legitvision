import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/seo/og-template";
import { getBrandBySlug } from "@/lib/seo/data/brands";
import { getBrandSlugsWithModels } from "@/lib/seo/data/models";

export const alt = "LegitVision — Legit Check";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return getBrandSlugsWithModels().map((brand) => ({ brand }));
}

type Props = { params: Promise<{ brand: string }> };

export default async function Image(props: Props) {
  const params = await props.params;
  const brand = getBrandBySlug(params.brand);
  return renderOgImage({
    eyebrow: "Legit Check",
    title: brand ? brand.name : "Legit Check",
    subtitle: "Guides d'authentification par modèle",
  });
}
