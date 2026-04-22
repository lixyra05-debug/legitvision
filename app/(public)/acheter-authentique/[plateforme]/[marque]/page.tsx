import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SeoPageTemplate } from "@/components/seo/SeoPageTemplate";
import {
  buildPlatformBrandPageData,
  getAllPlatformBrandParams,
} from "@/lib/seo/page-data-builder";
import { buildAllSchemas } from "@/lib/seo/schema";

const SITE_URL = "https://legitvision.vercel.app";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPlatformBrandParams();
}

type Props = { params: { plateforme: string; marque: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = buildPlatformBrandPageData(params.plateforme, params.marque);
  if (!data) return {};

  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: data.canonical.replace(SITE_URL, "") },
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

export default function PlatformBrandPage({ params }: Props) {
  const data = buildPlatformBrandPageData(params.plateforme, params.marque);
  if (!data) notFound();

  const schemas = buildAllSchemas(data);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SeoPageTemplate data={data} />
    </>
  );
}
