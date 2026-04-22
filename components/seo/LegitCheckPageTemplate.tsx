import Link from "next/link";
import Image from "next/image";
import type { LegitCheckPageData } from "@/lib/seo/legit-check-types";
import { SeoNav } from "./SeoNav";
import { SignalCard } from "./SignalCard";
import { SeoFAQ } from "./SeoFAQ";
import { RelatedPagesGrid } from "./RelatedPagesGrid";

const CATEGORY_LABELS = {
  sneakers: "Sneakers",
  bags: "Sacs de luxe",
  clothing: "Streetwear",
} as const;

function LegitCheckDisclaimer() {
  return (
    <div className="mt-12 rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p className="text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Pré-authentification visuelle, pas garantie.</strong>{" "}
          Ce guide vous aide à détecter les signaux visuels d&apos;une contrefaçon, mais ne remplace pas une authentification humaine professionnelle. L&apos;analyse IA fournit une estimation probabiliste avec un score de confiance — jamais un certificat d&apos;authenticité. Pour les achats à haute valeur, croisez toujours plusieurs sources (authentificateur humain, receipt d&apos;origine, plateforme avec programme d&apos;authentification).
        </p>
      </div>
    </div>
  );
}

function LegitCheckScamCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-6 backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-amber-400"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-base font-semibold text-foreground">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

export function LegitCheckPageTemplate({ data }: { data: LegitCheckPageData }) {
  const categoryLabel = CATEGORY_LABELS[data.model.category];

  return (
    <div className="min-h-screen bg-background">
      <SeoNav />

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-background to-background" />

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {data.breadcrumbs.map((crumb, i) => {
                const isLast = i === data.breadcrumbs.length - 1;
                const path = crumb.url.replace("https://legitvision.vercel.app", "");
                return (
                  <li key={crumb.url} className="flex items-center gap-2">
                    {isLast ? (
                      <span className="text-foreground">{crumb.name}</span>
                    ) : (
                      <Link
                        href={path || "/"}
                        className="hover:text-emerald-400 transition-colors"
                      >
                        {crumb.name}
                      </Link>
                    )}
                    {!isLast && <span className="text-white/20">/</span>}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white shadow-lg">
              <Image
                src={data.brand.logo}
                alt={data.brand.name}
                fill
                className="object-contain p-1.5"
                unoptimized
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Legit Check 2026
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
                {categoryLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
                {data.model.priceRange}
              </span>
            </div>
          </div>

          <h1 className="mt-8 font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {data.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {data.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={data.checkUrl}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Pré-authentifier ma photo — 3,99 €
            </Link>
            <a
              href="#signaux"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
            >
              Voir les {data.signals.length} signaux
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Résultat en 90 secondes
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Score de confiance détaillé
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Protocole photo guidé
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <section className="mb-12">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {data.intro}
          </p>
        </section>

        <section id="signaux" className="mb-16 scroll-mt-20">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Authentification
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Les {data.signals.length} signaux pour authentifier {data.brand.name} {data.model.name}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Chaque signal est classé par difficulté. Plus la difficulté est élevée, plus il faut un œil entraîné ou une pré-authentification IA pour trancher.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {data.signals.map((signal, i) => (
              <SignalCard key={i} signal={signal} index={i} />
            ))}
          </div>
        </section>

        <div className="my-12 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] via-emerald-500/[0.03] to-transparent p-6 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h3 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                Un doute sur votre {data.brand.name} {data.model.name} ?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Uploadez 8 à 12 photos, obtenez une pré-authentification IA avec score de confiance en 90 secondes.
              </p>
            </div>
            <Link
              href={data.checkUrl}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Analyser — 3,99 €
            </Link>
          </div>
        </div>

        <section className="mb-16">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
              Alerte arnaques
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {data.scams.length} arnaques récurrentes sur {data.brand.name} {data.model.name}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Ces schémas se retrouvent dans la quasi-totalité des contrefaçons signalées sur {data.brand.name} {data.model.name}. Si vous en cochez un seul, ralentissez avant d&apos;acheter.
            </p>
          </div>

          <div className="grid gap-4">
            {data.scams.map((scam, i) => (
              <LegitCheckScamCard
                key={i}
                title={scam.title}
                description={scam.description}
              />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
              FAQ
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Questions fréquentes
            </h2>
          </div>
          <SeoFAQ faqs={data.faqs} />
        </section>

        <section className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 backdrop-blur-xl sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Pré-authentification 3,99 €
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Ne pariez plus sur votre prochain {data.brand.name} {data.model.name}
            </h2>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              3,99 € pour éviter {data.model.priceRange} de perte. Score de confiance, estimation de probabilité et recommandations détaillées en 90 secondes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={data.checkUrl}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                Lancer ma pré-authentification
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

        <RelatedPagesGrid pages={data.relatedPages} />

        <LegitCheckDisclaimer />
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          LegitVision — Pré-authentification IA pour sneakers, sacs et streetwear de luxe.{" "}
          <span className="text-white/30">•</span>{" "}
          Les analyses fournissent une estimation probabiliste, jamais une garantie d&apos;authenticité.
        </div>
      </footer>
    </div>
  );
}
