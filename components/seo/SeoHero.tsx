import Link from "next/link";
import Image from "next/image";
import type { SeoPageData } from "@/lib/seo/types";

export function SeoHero({ data }: { data: SeoPageData }) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-background to-background" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(60% 50% at 50% 0%, ${data.platform.accentColor}25 0%, transparent 70%)`,
        }}
      />

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

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl font-heading text-xl font-bold text-white shadow-lg"
              style={{ backgroundColor: data.platform.accentColor }}
            >
              {data.platform.shortLabel}
            </div>
            <span className="text-2xl text-white/30">×</span>
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white shadow-lg">
              <Image
                src={data.brand.logo}
                alt={data.brand.name}
                fill
                className="object-contain p-1.5"
                sizes="56px"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Guide 2026
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
              {data.signals.length} signaux d&apos;authentification
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
              Analyse IA 3,99 €
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
            href={`/auth?source=seo&ref=${data.trackingRef}&intent=analyze`}
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Analyser ma photo — 3,99 €
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
            IA entraînée sur &gt; 100 000 paires
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Protocole photo guidé
          </div>
        </div>
      </div>
    </section>
  );
}
