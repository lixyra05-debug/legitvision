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

const SITE_URL = "https://legitvision.vercel.app";

export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "Guides d'authentification signal × marque : 66 protocoles détaillés — LegitVision",
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

  return (
    <div className="min-h-screen bg-background">
      <SeoNav />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-background to-background" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li className="text-white/20">/</li>
              <li className="text-foreground">Guides</li>
            </ol>
          </nav>

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            {totalSignals} guides signal × marque
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Comment reconnaître chaque signal, marque par marque.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {totalSignals} guides 2026 pour pré-authentifier signal par signal : box logo, date code, hologramme, étiquette, badge, broderie, impression. Chaque protocole détaille 4-6 étapes mesurables, les erreurs fréquentes, les techniques des faussaires, et intègre une pré-authentification IA à 3,99 €.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/check/new?source=seo&ref=hub-guide"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Pré-authentifier — 3,99 €
            </Link>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
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
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {categoryTotalSignals} signaux
                  </span>
                  <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
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
                      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.03]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            fill
                            className="object-contain p-1.5"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-emerald-300 transition-colors">
                            {brand.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {signalCount} signaux · {brand.priceRange}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                        {brand.tagline}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 backdrop-blur-xl sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Pré-authentification 3,99 €
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Pas le temps de lire les guides ?
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              L&apos;IA LegitVision analyse 8-12 signaux simultanément et retourne un score de confiance en 90 secondes. 3,99 € pour éviter une perte de plusieurs centaines d&apos;euros.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/check/new?source=seo&ref=hub-guide-cta"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                Lancer ma pré-authentification
              </Link>
              <Link
                href="/legit-check"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
              >
                Voir les guides modèle
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          LegitVision — Pré-authentification IA pour sneakers, sacs et streetwear.
        </div>
      </footer>
    </div>
  );
}
