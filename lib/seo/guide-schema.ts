import type { GuidePageData } from "./guide-types";
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
 * TechArticle (ex-HowTo). HowTo est déprécié depuis 2023 côté Google, n'a plus
 * aucune surface SERP et ne porte pas `dateModified` — d'où l'absence totale de
 * date sur les pages guide, qui plombait la citabilité par les moteurs IA.
 * Les étapes partent dans un ItemList séparé (voir buildAllGuideSchemas).
 */
export function buildGuideArticleSchema(data: GuidePageData): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${data.canonical}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": data.canonical },
    url: data.canonical,
    headline: `Comment vérifier ${data.signal.name} sur un ${data.brand.name} authentique`,
    name: `Comment vérifier ${data.signal.name} sur un ${data.brand.name} authentique`,
    description: `Guide en ${data.steps.length} étapes pour pré-authentifier ${data.signal.name} sur ${data.brand.name} et détecter les contrefaçons.`,
    image: siteUrl(data.ogImage),
    inLanguage: "fr-FR",
    datePublished: CONTENT_PUBLISHED,
    dateModified: CONTENT_REVISED.guide,
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

export function buildGuideFAQSchema(data: GuidePageData): JsonLd {
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

export function buildGuideBreadcrumbSchema(data: GuidePageData): JsonLd {
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

export function buildAllGuideSchemas(data: GuidePageData): JsonLd[] {
  return [
    buildGuideBreadcrumbSchema(data),
    buildGuideArticleSchema(data),
    buildStepsItemListSchema(
      `Protocole de vérification — ${data.signal.name} (${data.brand.name})`,
      data.canonical,
      data.steps,
    ),
    buildGuideFAQSchema(data),
  ];
}
