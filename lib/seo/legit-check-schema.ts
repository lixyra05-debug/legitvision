import type { LegitCheckPageData } from "./legit-check-types";

const SITE_URL = "https://legitvision.vercel.app";

type JsonLd = Record<string, unknown>;

export function buildLegitCheckHowToSchema(data: LegitCheckPageData): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Comment authentifier ${data.brand.name} ${data.model.name}`,
    description: `Guide en ${data.signals.length} étapes pour pré-authentifier un ${data.brand.name} ${data.model.name} et détecter les contrefaçons.`,
    image: `${SITE_URL}${data.ogImage}`,
    totalTime: "PT5M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: "0",
    },
    tool: [
      {
        "@type": "HowToTool",
        name: "Smartphone avec appareil photo",
      },
      {
        "@type": "HowToTool",
        name: "Éclairage naturel",
      },
    ],
    step: data.signals.map((signal, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: signal.title,
      text: signal.description,
    })),
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
    buildLegitCheckHowToSchema(data),
    buildLegitCheckFAQSchema(data),
  ];
}
