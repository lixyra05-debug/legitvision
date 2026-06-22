import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LegitCheckPageTemplate } from "@/components/seo/LegitCheckPageTemplate";
import { buildLegitCheckPageData } from "@/lib/seo/legit-check-page-data-builder";
import { buildAllLegitCheckSchemas } from "@/lib/seo/legit-check-schema";
import { getAllModelParams } from "@/lib/seo/data/models";

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
    // og:image / twitter:image fournis par opengraph-image.tsx (file convention).
    openGraph: {
      title: data.title,
      description: data.description,
      url: data.canonical,
      type: "article",
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
