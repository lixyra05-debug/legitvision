import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/seo/og-template";
import { getBrandBySlug } from "@/lib/seo/data/brands";
import { getPlatformBySlug } from "@/lib/seo/data/platforms";
import { getAllPlatformBrandParams } from "@/lib/seo/page-data-builder";

export const alt = "LegitVision — Acheter authentique";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return getAllPlatformBrandParams();
}

type Props = { params: { plateforme: string; marque: string } };

export default function Image({ params }: Props) {
  const brand = getBrandBySlug(params.marque);
  const platform = getPlatformBySlug(params.plateforme);
  const title =
    brand && platform
      ? `${brand.name} sur ${platform.name}`
      : "Acheter authentique";

  return renderOgImage({
    eyebrow: platform
      ? `Acheter authentique sur ${platform.name}`
      : "Acheter authentique",
    title,
    subtitle: "Éviter les contrefaçons",
  });
}
