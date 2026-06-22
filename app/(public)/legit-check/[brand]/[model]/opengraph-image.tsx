import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/seo/og-template";
import { getBrandBySlug } from "@/lib/seo/data/brands";
import { getModelBySlugs, getAllModelParams } from "@/lib/seo/data/models";

export const alt = "LegitVision — Legit Check";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Aligné sur la page (generateStaticParams + dynamicParams=false) : l'image OG
// est pré-générée au build pour chaque modèle existant.
export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return getAllModelParams();
}

type Props = { params: { brand: string; model: string } };

export default function Image({ params }: Props) {
  const brand = getBrandBySlug(params.brand);
  const model = getModelBySlugs(params.brand, params.model);
  const title =
    brand && model ? `${brand.name} ${model.name}` : "Legit Check";

  return renderOgImage({
    eyebrow: "Legit Check",
    title,
    subtitle: "Pré-authentification visuelle par IA",
  });
}
