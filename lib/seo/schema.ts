import type { SeoPageData } from "./types";

const SITE_URL = "https://legitvision.vercel.app";

type JsonLd = Record<string, unknown>;

export function buildHowToSchema(data: SeoPageData): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Comment vérifier l'authenticité d'${data.brand.productPossessive} ${data.brand.name} sur ${data.platform.name}`,
    description: `Guide en ${data.signals.length} étapes pour distinguer ${data.brand.productPossessive} ${data.brand.name} authentique d'une contrefaçon sur ${data.platform.name}.`,
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
    buildHowToSchema(data),
    buildFAQSchema(data),
  ];
}
