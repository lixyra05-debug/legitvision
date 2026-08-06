import type { SeoPageData } from "./types";
import { siteUrl } from "@/lib/site-url";
import { CONTENT_PUBLISHED, CONTENT_REVISED } from "./content-dates";
import {
  ARTICLE_AUTHOR,
  ARTICLE_IS_PART_OF,
  ARTICLE_PUBLISHER,
  buildStepsItemListSchema,
} from "./schema-parts";

type JsonLd = Record<string, unknown>;

/**
 * TechArticle (ex-HowTo) — voir lib/seo/guide-schema.ts pour le raisonnement.
 * Les signaux d'authentification partent dans un ItemList séparé.
 */
export function buildArticleSchema(data: SeoPageData): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${data.canonical}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": data.canonical },
    url: data.canonical,
    headline: `Comment vérifier l'authenticité d'${data.brand.productPossessive} ${data.brand.name} sur ${data.platform.name}`,
    name: `Comment vérifier l'authenticité d'${data.brand.productPossessive} ${data.brand.name} sur ${data.platform.name}`,
    description: `Guide en ${data.signals.length} étapes pour distinguer ${data.brand.productPossessive} ${data.brand.name} authentique d'une contrefaçon sur ${data.platform.name}.`,
    image: siteUrl(data.ogImage),
    inLanguage: "fr-FR",
    datePublished: CONTENT_PUBLISHED,
    dateModified: CONTENT_REVISED.acheterAuthentique,
    author: ARTICLE_AUTHOR,
    publisher: ARTICLE_PUBLISHER,
    isPartOf: ARTICLE_IS_PART_OF,
    proficiencyLevel: "Beginner",
    about: {
      "@type": "Brand",
      name: data.brand.name,
    },
  };
}

export function buildFAQSchema(data: SeoPageData): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(data: SeoPageData): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: data.breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function buildAllSchemas(data: SeoPageData): JsonLd[] {
  return [
    buildBreadcrumbSchema(data),
    buildArticleSchema(data),
    buildStepsItemListSchema(
      `Signaux d'authentification — ${data.brand.name} sur ${data.platform.name}`,
      data.canonical,
      data.signals,
    ),
    buildFAQSchema(data),
  ];
}
