import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { brands } from "@/lib/seo/data/brands";
import {
  getBrandSlugsWithModels,
  getModelsByBrand,
} from "@/lib/seo/data/models";
import { SeoNav } from "@/components/seo/SeoNav";
import { RevealGroup, RevealItem } from "@/components/landing/Reveal";
import {
  buildBreadcrumbListSchema,
  buildItemListSchema,
} from "@/lib/seo/hub-schema";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "Legit Check : 72 guides d'authentification par marque et modèle",
  description:
    "Guides 2026 pour authentifier 72 modèles de sneakers (Nike, Jordan, Adidas, Yeezy, New Balance), sacs de luxe (Louis Vuitton, Chanel, Hermès, Gucci, Dior, Prada) et streetwear (Supreme, Off-White, Stone Island, BAPE). Signaux techniques, arnaques, pré-authentification IA 3,99 €.",
  alternates: { canonical: "/legit-check" },
  openGraph: {
    title: "Legit Check — 72 guides LegitVision",
    description:
      "Sélection de 72 guides d'authentification par marque et modèle pour sneakers, sacs de luxe et streetwear.",
    url: `${SITE_URL}/legit-check`,
    type: "website",
  },
};

const CATEGORY_LABELS = {
  sneakers: "Sneakers",
  bags: "Sacs de luxe",
  clothing: "Streetwear",
} as const;

export default function LegitCheckHubPage() {
  const brandSlugs = getBrandSlugsWithModels();
  const brandsWithModels = brandSlugs
    .map((slug) => brands.find((b) => b.slug === slug))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  const byCategory = {
    sneakers: brandsWithModels.filter((b) => b.category === "sneakers"),
    bags: brandsWithModels.filter((b) => b.category === "bags"),
    clothing: brandsWithModels.filter((b) => b.category === "clothing"),
  };

  const totalModels = brandsWithModels.reduce(
    (sum, b) => sum + getModelsByBrand(b.slug).length,
    0,
  );

  const hubSchemas = [
    buildBreadcrumbListSchema([
      { name: "Accueil", url: `${SITE_URL}/` },
      { name: "Legit Check", url: `${SITE_URL}/legit-check` },
    ]),
    buildItemListSchema(
      "Marques disponibles en Legit Check",
      brandsWithModels.map((b) => ({
        name: b.name,
        url: `${SITE_URL}/legit-check/${b.slug}`,
      })),
    ),
  ];

  return (
    <div className="min-h-screen bg-background">
      {hubSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SeoNav />

      <section className="relative overflow-hidden border-b border-line-subtle">
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
            {totalModels} guides d&apos;authentification
          </span>
          <h1 className="mt-4 font-heading text-display font-bold">
            Legit Check : authentifier marque par marque, modèle par modèle.
          </h1>
          <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
            Guides 2026 pour pré-authentifier {totalModels} modèles des marques les plus contrefaites : sneakers hype, sacs de luxe iconiques, streetwear japonais et italien. Signaux techniques propres à chaque modèle, arnaques spécifiques, prix marché actuel, et pré-authentification IA en 90 secondes à 3,99 €.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth?source=seo&ref=hub-legit-check"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card"
            >
              Pré-authentifier — 3,99 €
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center rounded-full border border-line bg-surface-raised px-6 py-3 text-ui font-semibold text-foreground transition-colors duration-fast hover:bg-surface-hover"
            >
              Voir les forfaits
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        {(
          [
            ["sneakers", byCategory.sneakers],
            ["bags", byCategory.bags],
            ["clothing", byCategory.clothing],
          ] as const
        ).map(([categoryKey, categoryBrands]) => {
          if (categoryBrands.length === 0) return null;
          const categoryTotalModels = categoryBrands.reduce(
            (sum, b) => sum + getModelsByBrand(b.slug).length,
            0,
          );

          return (
            <section key={categoryKey} className="mb-16">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
                    {categoryTotalModels} modèles
                  </span>
                  <h2 className="mt-3 font-heading text-h2 font-bold">
                    {CATEGORY_LABELS[categoryKey]}
                  </h2>
                </div>
              </div>

              <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryBrands.map((brand) => {
                  const modelCount = getModelsByBrand(brand.slug).length;
                  return (
                    <RevealItem key={brand.slug}>
                      <Link
                        href={`/legit-check/${brand.slug}`}
                        className="group relative block h-full overflow-hidden rounded-lg border border-line-subtle bg-surface p-5 transition-colors duration-fast hover:border-line hover:bg-surface-hover"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white">
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              fill
                              className="object-contain p-1.5"
                              sizes="48px"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-heading text-h4 font-semibold text-foreground group-hover:text-accent transition-colors duration-fast">
                              {brand.name}
                            </h3>
                            <p className="text-caption text-muted-foreground">
                              {modelCount} modèle{modelCount > 1 ? "s" : ""} · {brand.priceRange}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-caption text-muted-foreground line-clamp-2">
                          {brand.tagline}
                        </p>
                      </Link>
                    </RevealItem>
                  );
                })}
              </RevealGroup>
            </section>
          );
        })}
      </main>

      <footer className="border-t border-line-subtle py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-caption text-muted-foreground">
          LegitVision — Pré-authentification IA pour sneakers, sacs et streetwear.
        </div>
      </footer>
    </div>
  );
}
