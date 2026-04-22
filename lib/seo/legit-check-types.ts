import type { Brand, BreadcrumbItem, RelatedPage } from "./types";

export type ModelCategory = "sneakers" | "bags" | "clothing";

export type ModelSignal = {
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
};

export type ModelScam = {
  title: string;
  description: string;
};

export type ModelFAQ = {
  question: string;
  answer: string;
};

export type ModelData = {
  slug: string;
  name: string;
  brandSlug: string;
  category: ModelCategory;
  priceRange: string;
  retailYear: string;
  tagline: string;
  intro: string;
  signals: ModelSignal[];
  scams: ModelScam[];
  faqs: ModelFAQ[];
};

export type LegitCheckPageData = {
  brand: Brand;
  model: ModelData;
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  canonical: string;
  ogImage: string;
  breadcrumbs: BreadcrumbItem[];
  intro: string;
  signals: ModelSignal[];
  scams: ModelScam[];
  faqs: ModelFAQ[];
  relatedPages: RelatedPage[];
  trackingRef: string;
  checkUrl: string;
};
