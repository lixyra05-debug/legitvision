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
      <div className="my-12 overflow-hidden rounded-lg border border-accent/20 bg-surface p-6 sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h3 className="font-heading text-h3 font-semibold text-foreground">
              Un doute sur votre {brandName} ?
            </h3>
            <p className="mt-2 text-ui text-muted-foreground">
              Uploadez 8 à 12 photos, obtenez un diagnostic IA détaillé en 90 secondes.
            </p>
          </div>
          <Link
            href={href}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-6 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card"
          >
            Analyser — 3,99 €
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "final") {
    return (
      <section className="relative mt-16 overflow-hidden rounded-lg border border-line bg-surface p-8 sm:p-12">
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-caption font-medium text-muted-foreground">
            Analyse 3,99 €
          </span>
          <h2 className="mt-4 font-heading text-h2 font-bold">
            Ne pariez plus sur votre prochain achat {brandName} sur {platformName}
          </h2>
          <p className="mt-4 max-w-2xl text-body text-muted-foreground">
            3,99 € pour éviter 150 € à 15 000 € de perte. Résultat en 90 secondes avec verdict,
            score de confiance et recommandations détaillées.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={href}
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover hover:shadow-card"
            >
              Lancer mon analyse
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
    );
  }

  return null;
}
