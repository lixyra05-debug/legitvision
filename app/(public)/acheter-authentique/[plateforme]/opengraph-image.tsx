import {
  renderOgImage,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from "@/lib/seo/og-template";
import { getPlatformBySlug, platforms } from "@/lib/seo/data/platforms";

export const alt = "LegitVision — Acheter authentique";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return platforms.map((p) => ({ plateforme: p.slug }));
}

type Props = { params: Promise<{ plateforme: string }> };

export default async function Image(props: Props) {
  const params = await props.params;
  const platform = getPlatformBySlug(params.plateforme);
  return renderOgImage({
    eyebrow: "Acheter authentique",
    title: platform ? `Sur ${platform.name}` : "Acheter authentique",
    subtitle: "Les marques les plus contrefaites",
  });
}
