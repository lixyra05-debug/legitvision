import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { brands } from "@/lib/seo/data/brands";
import {
  getBrandSlugsWithModels,
  getModelsByBrand,
} from "@/lib/seo/data/models";
import { SeoNav } from "@/components/seo/SeoNav";

const SITE_URL = "https://legitvision.vercel.app";

export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "Legit Check : 72 guides d'authentification par marque et modèle — LegitVision",
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

  return (
    <div className="min-h-screen bg-background">
      <SeoNav />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-background to-background" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            {totalModels} guides d&apos;authentification
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Legit Check : authentifier marque par marque, modèle par modèle.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Guides 2026 pour pré-authentifier {totalModels} modèles des marques les plus contrefaites : sneakers hype, sacs de luxe iconiques, streetwear japonais et italien. Signaux techniques propres à chaque modèle, arnaques spécifiques, prix marché actuel, et pré-authentification IA en 90 secondes à 3,99 €.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth?source=seo&ref=hub-legit-check"
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
          const categoryTotalModels = categoryBrands.reduce(
            (sum, b) => sum + getModelsByBrand(b.slug).length,
            0,
          );

          return (
            <section key={categoryKey} className="mb-16">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
                    {categoryTotalModels} modèles
                  </span>
                  <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                    {CATEGORY_LABELS[categoryKey]}
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryBrands.map((brand) => {
                  const modelCount = getModelsByBrand(brand.slug).length;
                  return (
                    <Link
                      key={brand.slug}
                      href={`/legit-check/${brand.slug}`}
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
                            {modelCount} modèle{modelCount > 1 ? "s" : ""} · {brand.priceRange}
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
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          LegitVision — Pré-authentification IA pour sneakers, sacs et streetwear.
        </div>
      </footer>
    </div>
  );
}
