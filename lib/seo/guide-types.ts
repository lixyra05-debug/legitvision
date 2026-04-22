import type { Brand, BreadcrumbItem, RelatedPage } from "./types";

export type GuideCategory = "sneakers" | "bags" | "clothing";

export type GuideStep = {
  title: string;
  description: string;
};

export type GuideError = {
  title: string;
  description: string;
};

export type GuideFAQ = {
  question: string;
  answer: string;
};

export type GuideSignal = {
  slug: string;
  name: string;
  brandSlug: string;
  category: GuideCategory;
  tagline: string;
  intro: string;
  steps: GuideStep[];
  commonErrors: GuideError[];
  counterfeiterTactics: string;
  faqs: GuideFAQ[];
};

export type GuidePageData = {
  brand: Brand;
  signal: GuideSignal;
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  canonical: string;
  ogImage: string;
  breadcrumbs: BreadcrumbItem[];
  intro: string;
  steps: GuideStep[];
  commonErrors: GuideError[];
  counterfeiterTactics: string;
  faqs: GuideFAQ[];
  relatedPages: RelatedPage[];
  trackingRef: string;
  checkUrl: string;
};
