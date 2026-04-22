import Link from "next/link";
import type { Metadata } from "next";
import { platforms } from "@/lib/seo/data/platforms";
import { SeoNav } from "@/components/seo/SeoNav";

const SITE_URL = "https://legitvision.vercel.app";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Acheter authentique : guides d'authentification par plateforme",
  description:
    "60 guides 2026 pour acheter sans contrefaçon sur Vinted, Vestiaire Collective, Leboncoin, eBay, Depop et Facebook Marketplace. Nike, Jordan, Louis Vuitton, Chanel, Hermès et plus.",
  alternates: { canonical: "/acheter-authentique" },
  openGraph: {
    title: "Acheter authentique — Guides LegitVision",
    description:
      "Sélection de 60 guides d'authentification pour les 6 plateformes seconde main les plus populaires.",
    url: `${SITE_URL}/acheter-authentique`,
    type: "website",
  },
};

export default function AcheterAuthentiqueHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <SeoNav />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-background to-background" />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            60 guides d&apos;authentification
          </span>
          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Acheter authentique, sans se faire piéger.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Guides 2026 pour reconnaître les vraies sneakers et les vrais sacs de luxe sur les 6 plateformes seconde main les plus utilisées en France. Signaux techniques, arnaques récurrentes, prix marché, et analyse IA en 90 secondes à 3,99 €.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth?source=seo&ref=hub-acheter-authentique"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Analyser une photo — 3,99 €
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
            >
              Voir les forfaits
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Choisissez votre plateforme
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Chaque plateforme a ses arnaques et ses garde-fous. Accédez aux 10 guides de marques pour celle qui vous intéresse.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <Link
              key={platform.slug}
              href={`/acheter-authentique/${platform.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl transition-all hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: platform.accentColor }}
              />
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl font-heading text-base font-bold text-white shadow-lg"
                  style={{ backgroundColor: platform.accentColor }}
                >
                  {platform.shortLabel}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-emerald-300 transition-colors">
                    {platform.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{platform.userBaseFr}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                {platform.tagline}
              </p>
              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">10 guides disponibles</span>
                <span className="font-medium text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Voir les guides →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          LegitVision — Authentification IA pour sneakers et sacs de luxe.
        </div>
      </footer>
    </div>
  );
}
