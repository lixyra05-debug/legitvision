import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBrandBySlug } from "@/lib/seo/data/brands";
import {
  getSignalsByBrand,
  getAllBrandSlugsWithSignals,
} from "@/lib/seo/data/signals";
import { SeoNav } from "@/components/seo/SeoNav";

const SITE_URL = "https://legitvision.vercel.app";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBrandSlugsWithSignals().map((brand) => ({ brand }));
}

type Props = { params: { brand: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = getBrandBySlug(params.brand);
  if (!brand) return {};
  const brandSignals = getSignalsByBrand(brand.slug);

  const title = `Guides ${brand.name} : ${brandSignals.length} signaux pour authentifier en 2026`;
  const description = `Guides 2026 pour pré-authentifier ${brand.name} signal par signal — ${brandSignals.length} protocoles détaillés avec étapes mesurables, erreurs fréquentes et techniques des faussaires. Pré-authentification IA à 3,99 €.`;

  return {
    title,
    description,
    alternates: { canonical: `/guide/${brand.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/guide/${brand.slug}`,
      type: "website",
    },
  };
}

export default function BrandGuideHub({ params }: Props) {
  const brand = getBrandBySlug(params.brand);
  if (!brand) notFound();

  const brandSignals = getSignalsByBrand(brand.slug);
  if (brandSignals.length === 0) notFound();

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
                  href="/guide"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Guides
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
                sizes="64px"
              />
            </div>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                Guides 2026
              </span>
              <p className="mt-1 text-xs text-muted-foreground">{brand.priceRange}</p>
            </div>
          </div>

          <h1 className="mt-6 font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Guides {brand.name} : {brandSignals.length} signaux à maîtriser
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {brand.tagline}. Sélectionnez le signal — chaque guide détaille le protocole photo, les dimensions de référence, les polices, les couleurs Pantone, et les erreurs qui font rater une pré-authentification visuelle.
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
            Choisissez votre signal
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {brandSignals.length} signaux documentés avec protocole photo, étapes mesurables, erreurs fréquentes et FAQ.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brandSignals.map((signal) => (
              <Link
                key={signal.slug}
                href={`/guide/${brand.slug}/${signal.slug}`}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl transition-all hover:border-emerald-500/30 hover:bg-emerald-500/[0.03]"
              >
                <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-emerald-300 transition-colors">
                  {signal.name}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
                  {signal.tagline}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                    {signal.steps.length} étapes
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-muted-foreground">
                    {signal.faqs.length} FAQ
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
              Photo + IA + 90 secondes = score de confiance détaillé sur l&apos;ensemble des signaux. Estimation probabiliste, jamais une garantie.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/check/new?brand=${encodeURIComponent(brand.name)}&source=seo&ref=guide-hub-${brand.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                Lancer ma pré-authentification
              </Link>
              <Link
                href={`/legit-check/${brand.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
              >
                Guides modèle {brand.name}
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
