import type { GuidePageData } from "./guide-types";

const SITE_URL = "https://legitvision.vercel.app";

type JsonLd = Record<string, unknown>;

export function buildGuideHowToSchema(data: GuidePageData): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Comment vérifier ${data.signal.name} sur un ${data.brand.name} authentique`,
    description: `Guide en ${data.steps.length} étapes pour pré-authentifier ${data.signal.name} sur ${data.brand.name} et détecter les contrefaçons.`,
    image: `${SITE_URL}${data.ogImage}`,
    totalTime: "PT3M",
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
        name: "Éclairage neutre (LED 5000K ou lumière du jour)",
      },
      {
        "@type": "HowToTool",
        name: "Règle graduée ou mètre",
      },
    ],
    step: data.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
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
    buildGuideHowToSchema(data),
    buildGuideFAQSchema(data),
  ];
}
