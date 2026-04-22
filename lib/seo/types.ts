export type BrandCategory = "sneakers" | "bags" | "accessories" | "clothing";

export type DifficultyLevel = 1 | 2 | 3;

export type AuthSignal = {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
};

export type ScamPattern = {
  title: string;
  description: string;
  frequency: "very-common" | "common" | "occasional";
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type Brand = {
  slug: string;
  name: string;
  category: BrandCategory;
  logo: string;
  tagline: string;
  description: string;
  signals: AuthSignal[];
  faqs: FAQItem[];
  priceRange: string;
  productType: string;
  productPossessive: string;
  popularModels: string[];
};

export type Platform = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  userBaseFr: string;
  authProgram: string | null;
  scams: ScamPattern[];
  faqs: FAQItem[];
  accentColor: string;
  shortLabel: string;
  externalUrl: string;
};

export type Intersection = {
  platformSlug: string;
  brandSlug: string;
  angle: string;
  faqs: FAQItem[];
};

export type RelatedPage = {
  label: string;
  href: string;
  sublabel: string;
};

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type SeoPageData = {
  category: "platform-brand" | "brand-model" | "brand-signal";
  platform: Platform;
  brand: Brand;
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  canonical: string;
  ogImage: string;
  breadcrumbs: BreadcrumbItem[];
  introParagraphs: string[];
  signals: AuthSignal[];
  scams: ScamPattern[];
  faqs: FAQItem[];
  relatedPages: RelatedPage[];
  trackingRef: string;
};
