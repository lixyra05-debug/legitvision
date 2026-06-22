import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrandBySlug } from "@/lib/seo/data/brands";
import {
  getBrandSlugsWithModels,
  getModelsByBrand,
} from "@/lib/seo/data/models";
import { SeoNav } from "@/components/seo/SeoNav";

const SITE_URL = "https://legitvision.vercel.app";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return getBrandSlugsWithModels().map((brand) => ({ brand }));
}

type Props = { params: { brand: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = getBrandBySlug(params.brand);
  if (!brand) return {};
  const models = getModelsByBrand(brand.slug);

  const title = `Legit Check ${brand.name} : ${models.length} guides d'authentification par modèle`;
  const description = `Guides 2026 pour authentifier ${models.length} modèles ${brand.name} : signaux techniques spécifiques, arnaques récurrentes, prix marché et pré-authentification IA à 3,99 €.`;

  return {
    title,
    description,
    alternates: { canonical: `/legit-check/${brand.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/legit-check/${brand.slug}`,
      type: "website",
    },
  };
}

export default function BrandLegitCheckHub({ params }: Props) {
  const brand = getBrandBySlug(params.brand);
  if (!brand) notFound();

  const brandModels = getModelsByBrand(brand.slug);
  if (brandModels.length === 0) notFound();

  return (
    <div className="min-h-screen bg-background">
      <SeoNav />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-background to-background" />

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li className="text-white/20">/</li>
              <li>
                <Link
                  href="/legit-check"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Legit Check
                </Link>
              </li>
              <li className="text-white/20">/</li>
              <li className="text-foreground">{brand.name}</li>
            </ol>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-white shadow-lg">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain p-1.5"
                unoptimized
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                Legit Check 2026
              </span>
              <p className="mt-1 text-xs text-muted-foreground">{brand.priceRange}</p>
            </div>
          </div>

          <h1 className="mt-6 font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Legit Check {brand.name} : {brandModels.length} modèles à authentifier
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {brand.tagline}. Sélectionnez le modèle — chaque guide détaille les signaux techniques propres à cette référence, les arnaques spécifiques, et les prix marché 2026.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            À propos de {brand.name}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {brand.description}
          </p>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Choisissez votre modèle
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {brandModels.length} modèles documentés avec 5 signaux d&apos;authentification spécifiques chacun.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brandModels.map((model) => (
              <Link
                key={model.slug}
                href={`/legit-check/${brand.slug}/${model.slug}`}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.03]"
              >
                <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-emerald-300 transition-colors">
                  {model.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {model.priceRange} · {model.retailYear}
                </p>
                <p className="mt-3 text-xs text-muted-foreground line-clamp-3">
                  {model.tagline}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                    {model.signals.length} signaux
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-muted-foreground">
                    {model.scams.length} arnaques
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 backdrop-blur-xl sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Pré-authentification 3,99 €
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Pré-authentifier votre {brand.name}
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Photo + IA + 90 secondes = score de confiance détaillé. Évitez {brand.priceRange} de perte pour 3,99 €.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/auth?source=seo&ref=legit-check-hub-${brand.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                Lancer ma pré-authentification
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
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          LegitVision — Pré-authentification IA pour sneakers, sacs et streetwear.
        </div>
      </footer>
    </div>
  );
}
