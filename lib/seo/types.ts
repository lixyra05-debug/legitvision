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
  /** Nom affiché (H1, title, description). C'est lui qui porte le SEO. */
  name: string;
  /**
   * Nom de la ligne `brands` en base, lorsqu'il diffère du nom affiché.
   * Le CTA /check/new?brand= est résolu par .ilike("name", …), une égalité :
   * « Air Jordan » ne matche pas la ligne « Jordan ». Renommer la base n'est
   * PAS une option — les modèles s'y appellent déjà « Air Jordan 4 », et
   * authentication-prompts.ts:99 produirait « Air Jordan Air Jordan 4 » dans
   * le prompt Vision et en H1 du rapport.
   */
  checkBrand?: string;
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
