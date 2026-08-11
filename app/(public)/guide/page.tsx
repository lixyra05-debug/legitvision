import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { brands } from "@/lib/seo/data/brands";
import {
  signals,
  getSignalsByBrand,
  getAllBrandSlugsWithSignals,
} from "@/lib/seo/data/signals";
import { SeoNav } from "@/components/seo/SeoNav";
import {
  buildBreadcrumbListSchema,
  buildItemListSchema,
} from "@/lib/seo/hub-schema";
import { SITE_URL } from "@/lib/site-url";

export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "Guides d'authentification signal × marque : 66 protocoles détaillés",
  description:
    "66 guides 2026 pour authentifier signal par signal : box logo Supreme, date code Louis Vuitton, hologramme Chanel, étiquette langue Nike, badge compass Stone Island, camo BAPE. Pré-authentification IA à 3,99 €.",
  alternates: { canonical: "/guide" },
  openGraph: {
    title: "Guides signal × marque — 66 protocoles d'authentification",
    description:
      "Chaque signal iconique des 14 marques les plus contrefaites : sneakers, sacs de luxe, streetwear.",
    url: `${SITE_URL}/guide`,
    type: "website",
  },
};

const CATEGORY_LABELS = {
  sneakers: "Sneakers",
  bags: "Sacs de luxe",
  clothing: "Streetwear",
} as const;

export default function GuideHubPage() {
  const brandSlugs = getAllBrandSlugsWithSignals();
  const brandsWithSignals = brandSlugs
    .map((slug) => brands.find((b) => b.slug === slug))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  const byCategory = {
    sneakers: brandsWithSignals.filter((b) => b.category === "sneakers"),
    bags: brandsWithSignals.filter((b) => b.category === "bags"),
    clothing: brandsWithSignals.filter((b) => b.category === "clothing"),
  };

  const totalSignals = signals.length;

  const hubSchemas = [
    buildBreadcrumbListSchema([
      { name: "Accueil", url: `${SITE_URL}/` },
      { name: "Guides", url: `${SITE_URL}/guide` },
    ]),
    buildItemListSchema(
      "Marques avec guides d'authentification",
      brandsWithSignals.map((b) => ({
        name: b.name,
        url: `${SITE_URL}/guide/${b.slug}`,
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
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-caption text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors duration-fast">
                  Accueil
                </Link>
              </li>
              <li className="text-subtle">/</li>
              <li className="text-foreground">Guides</li>
            </ol>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
            {totalSignals} guides signal × marque
          </span>
          <h1 className="mt-4 font-heading text-display font-bold">
            Comment reconnaître chaque signal, marque par marque.
          </h1>
          <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
            {totalSignals} guides 2026 pour pré-authentifier signal par signal : box logo, date code, hologramme, étiquette, badge, broderie, impression. Chaque protocole détaille 4-6 étapes mesurables, les erreurs fréquentes, les techniques des faussaires, et intègre une pré-authentification IA à 3,99 €.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/check/new?source=seo&ref=hub-guide"
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
          const categoryTotalSignals = categoryBrands.reduce(
            (sum, b) => sum + getSignalsByBrand(b.slug).length,
            0,
          );

          return (
            <section key={categoryKey} className="mb-16">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
                    {categoryTotalSignals} signaux
                  </span>
                  <h2 className="mt-3 font-heading text-h2 font-bold">
                    {CATEGORY_LABELS[categoryKey]}
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryBrands.map((brand) => {
                  const signalCount = getSignalsByBrand(brand.slug).length;
                  return (
                    <Link
                      key={brand.slug}
                      href={`/guide/${brand.slug}`}
                      className="group relative block overflow-hidden rounded-lg border border-line-subtle bg-surface p-5 transition-colors duration-fast hover:border-line hover:bg-surface-hover"
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
                            {signalCount} signaux · {brand.priceRange}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-caption text-muted-foreground line-clamp-2">
                        {brand.tagline}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="relative mt-16 overflow-hidden rounded-lg border border-line bg-surface p-8 sm:p-12">
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
              Pré-authentification 3,99 €
            </span>
            <h2 className="mt-4 font-heading text-h2 font-bold">
              Pas le temps de lire les guides ?
            </h2>
            <p className="mt-4 max-w-2xl text-body text-muted-foreground">
              L&apos;IA LegitVision analyse 8-12 signaux simultanément et retourne un score de confiance en 90 secondes. 3,99 € pour éviter une perte de plusieurs centaines d&apos;euros.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/check/new?source=seo&ref=hub-guide-cta"
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card"
              >
                Lancer ma pré-authentification
              </Link>
              <Link
                href="/legit-check"
                className="inline-flex items-center justify-center rounded-full border border-line bg-surface-raised px-6 py-3 text-ui font-semibold text-foreground transition-colors duration-fast hover:bg-surface-hover"
              >
                Voir les guides modèle
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line-subtle py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-caption text-muted-foreground">
          LegitVision — Pré-authentification IA pour sneakers, sacs et streetwear.
        </div>
      </footer>
    </div>
  );
}
