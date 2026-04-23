import type { SeoPageData } from "@/lib/seo/types";
import { SeoNav } from "./SeoNav";
import { SeoHero } from "./SeoHero";
import { SignalCard } from "./SignalCard";
import { ScamAlert } from "./ScamAlert";
import { SeoFAQ } from "./SeoFAQ";
import { SeoCTA } from "./SeoCTA";
import { RelatedPagesGrid } from "./RelatedPagesGrid";

export function SeoPageTemplate({ data }: { data: SeoPageData }) {
  return (
    <div className="min-h-screen bg-background">
      <SeoNav />
      <SeoHero data={data} />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <section className="mb-12">
          {data.introParagraphs.map((paragraph, i) => (
            <p
              key={i}
              className="mt-4 text-base leading-relaxed text-muted-foreground first:mt-0 sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </section>

        <section id="signaux" className="mb-16 scroll-mt-20">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Authentification
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Les {data.signals.length} signaux pour reconnaître {" "}
              {data.brand.productPossessive} vraie {data.brand.name}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Chaque signal est classé par difficulté. Plus la difficulté est élevée, plus il faut un œil entraîné ou une analyse IA pour trancher.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {data.signals.map((signal, i) => (
              <SignalCard key={i} signal={signal} index={i} />
            ))}
          </div>
        </section>

        <SeoCTA
          variant="inline"
          brandName={data.brand.name}
          platformName={data.platform.name}
          trackingRef={data.trackingRef}
        />

        <section className="mb-16">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
              Alerte arnaques
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {data.scams.length} arnaques récurrentes sur {data.platform.name}
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Ces schémas se retrouvent dans la quasi-totalité des contrefaçons {data.brand.name} signalées sur {data.platform.name}. Si vous en cochez un seul, arrêtez la transaction.
            </p>
          </div>

          <div className="grid gap-4">
            {data.scams.map((scam, i) => (
              <ScamAlert key={i} scam={scam} />
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

        <SeoCTA
          variant="final"
          brandName={data.brand.name}
          platformName={data.platform.name}
          trackingRef={data.trackingRef}
        />

        <RelatedPagesGrid pages={data.relatedPages} />
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          LegitVision — Pré-authentification IA pour sneakers et sacs de luxe.{" "}
          <span className="text-white/30">•</span>{" "}
          Les analyses fournissent une estimation probabiliste, jamais une garantie.
        </div>
      </footer>
    </div>
  );
}
