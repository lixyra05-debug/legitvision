import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GuidePageTemplate } from "@/components/seo/GuidePageTemplate";
import {
  buildGuidePageData,
  getAllGuideParams,
} from "@/lib/seo/guide-page-data-builder";
import { buildAllGuideSchemas } from "@/lib/seo/guide-schema";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuideParams();
}

type Props = { params: { brand: string; signal: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = buildGuidePageData(params.brand, params.signal);
  if (!data) return {};

  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: `/guide/${params.brand}/${params.signal}` },
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

export default function GuideSignalPage({ params }: Props) {
  const data = buildGuidePageData(params.brand, params.signal);
  if (!data) notFound();

  const schemas = buildAllGuideSchemas(data);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <GuidePageTemplate data={data} />
    </>
  );
}
