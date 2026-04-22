import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LegitCheckPageTemplate } from "@/components/seo/LegitCheckPageTemplate";
import { buildLegitCheckPageData } from "@/lib/seo/legit-check-page-data-builder";
import { buildAllLegitCheckSchemas } from "@/lib/seo/legit-check-schema";
import { getAllModelParams } from "@/lib/seo/data/models";

const SITE_URL = "https://legitvision.vercel.app";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllModelParams();
}

type Props = { params: { brand: string; model: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = buildLegitCheckPageData(params.brand, params.model);
  if (!data) return {};

  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: `/legit-check/${params.brand}/${params.model}` },
    openGraph: {
      title: data.title,
      description: data.description,
      url: data.canonical,
      type: "article",
      images: [
        {
          url: `${SITE_URL}${data.ogImage}`,
          width: 1200,
          height: 630,
          alt: `${data.brand.name} ${data.model.name} — Legit Check`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
    },
  };
}

export default function LegitCheckModelPage({ params }: Props) {
  const data = buildLegitCheckPageData(params.brand, params.model);
  if (!data) notFound();

  const schemas = buildAllLegitCheckSchemas(data);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <LegitCheckPageTemplate data={data} />
    </>
  );
}
