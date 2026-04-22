import Link from "next/link";

type Variant = "hero" | "inline" | "final";

type Props = {
  variant: Variant;
  brandName: string;
  platformName: string;
  trackingRef: string;
};

export function SeoCTA({ variant, brandName, platformName, trackingRef }: Props) {
  const href = `/auth?source=seo&ref=${trackingRef}&variant=${variant}`;

  if (variant === "inline") {
    return (
      <div className="my-12 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.08] via-emerald-500/[0.03] to-transparent p-6 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h3 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
              Un doute sur votre {brandName} ?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Uploadez 8 à 12 photos, obtenez un diagnostic IA détaillé en 90 secondes.
            </p>
          </div>
          <Link
            href={href}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Analyser — 3,99 €
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "final") {
    return (
      <section className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 backdrop-blur-xl sm:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            Analyse 3,99 €
          </span>
          <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Ne pariez plus sur votre prochain achat {brandName} sur {platformName}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground">
            3,99 € pour éviter 150 € à 15 000 € de perte. Résultat en 90 secondes avec verdict,
            score de confiance et recommandations détaillées.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={href}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              Lancer mon analyse
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
    );
  }

  return null;
}
