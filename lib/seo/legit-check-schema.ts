import type { LegitCheckPageData } from "./legit-check-types";
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
export function buildLegitCheckArticleSchema(
  data: LegitCheckPageData,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${data.canonical}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": data.canonical },
    url: data.canonical,
    headline: `Comment authentifier ${data.brand.name} ${data.model.name}`,
    name: `Comment authentifier ${data.brand.name} ${data.model.name}`,
    description: `Guide en ${data.signals.length} étapes pour pré-authentifier un ${data.brand.name} ${data.model.name} et détecter les contrefaçons.`,
    image: siteUrl(data.ogImage),
    inLanguage: "fr-FR",
    datePublished: CONTENT_PUBLISHED,
    dateModified: CONTENT_REVISED.legitCheck,
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

export function buildLegitCheckFAQSchema(data: LegitCheckPageData): JsonLd {
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

export function buildLegitCheckBreadcrumbSchema(
  data: LegitCheckPageData,
): JsonLd {
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

export function buildAllLegitCheckSchemas(
  data: LegitCheckPageData,
): JsonLd[] {
  return [
    buildLegitCheckBreadcrumbSchema(data),
    buildLegitCheckArticleSchema(data),
    buildStepsItemListSchema(
      `Signaux d'authentification — ${data.brand.name} ${data.model.name}`,
      data.canonical,
      data.signals,
    ),
    buildLegitCheckFAQSchema(data),
  ];
}
