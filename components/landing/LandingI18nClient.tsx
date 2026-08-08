"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

/**
 * Composants client qui rendent les zones i18n-isées de la landing.
 * Le fichier app/page.tsx reste server (pour exporter metadata) ;
 * ces sous-composants client consomment useTranslation pour basculer FR/EN.
 *
 * Design system : Inter pour le corps, Space Grotesk pour les titres.
 * L'emerald de marque est dosé : il ne porte ici que le CTA final.
 */

export function HeroI18n() {
  const { t } = useTranslation();
  return (
    <>
      <h1
        className="font-heading text-display font-bold"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {t("hero.title")}
      </h1>
      <p
        className="mx-auto mt-6 max-w-lg text-body sm:text-lead"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {t("hero.subtitle")}
      </p>
    </>
  );
}

export function HeroPoweredByI18n() {
  const { t } = useTranslation();
  return <>{t("hero.poweredBy")}</>;
}

export function HeroCtaI18n() {
  const { t } = useTranslation();
  return <>{t("hero.cta")}</>;
}

export function BrandsTitleI18n() {
  const { t } = useTranslation();
  return (
    <>
      <h2
        className="font-heading text-h2 font-bold"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {t("landing.brandsTitle")}
      </h2>
      <p
        className="mx-auto mt-4 max-w-2xl text-body"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {t("landing.brandsSubtitle")}
      </p>
    </>
  );
}

export function HowItWorksI18n() {
  const { t } = useTranslation();
  return (
    <>
      <h2
        className="font-heading text-h2 font-bold"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {t("landing.howItWorksTitle")}
      </h2>
      <p
        className="mx-auto mt-4 max-w-2xl text-body"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {t("landing.howItWorksSubtitle")}
      </p>
    </>
  );
}

export function PricingTitleI18n() {
  const { t } = useTranslation();
  return (
    <>
      <h2
        className="font-heading text-h2 font-bold"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {t("landing.pricingTitle")}
      </h2>
      <p
        className="mx-auto mt-4 max-w-2xl text-body"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {t("landing.pricingSubtitle")}
      </p>
    </>
  );
}

export function FaqTitleI18n() {
  const { t } = useTranslation();
  return (
    <h2
      className="font-heading text-h2 font-bold"
      style={{ color: "hsl(var(--foreground))" }}
    >
      {t("landing.faqTitle")}
    </h2>
  );
}

export function FinalCtaI18n() {
  const { t } = useTranslation();
  return (
    <>
      <h2
        className="font-heading text-h2 font-bold"
        style={{ color: "hsl(var(--foreground))" }}
      >
        {t("landing.ctaFinalTitle")}
      </h2>
      <p
        className="mx-auto mt-4 max-w-lg text-body"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {t("landing.ctaFinalSubtitle")}
      </p>
      <Link
        href="/auth?redirect=%2Fcheck%2Fnew"
        className="group mt-8 inline-flex h-12 items-center gap-2 rounded-md px-8 text-body font-semibold transition-[background-color,box-shadow]"
        style={{
          background: "hsl(var(--accent))",
          color: "hsl(var(--accent-foreground))",
          animation: "pulse-glow var(--dur-ambient) ease-in-out infinite",
        }}
      >
        {t("landing.ctaFinalButton")}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
      <p
        className="mt-4 text-caption text-subtle"
      >
        {t("landing.ctaFinalNote")}
      </p>
    </>
  );
}

export function ExpertNoteI18n() {
  const { t } = useTranslation();
  return <>{t("landing.expertNote")}</>;
}

export function DisclaimerI18n() {
  const { t } = useTranslation();
  return <>{t("footer.disclaimer")}</>;
}

export function FooterLinksI18n() {
  const { t } = useTranslation();
  return (
    <>
      <Link
        href="/mentions-legales"
        className="transition-colors hover:text-foreground"
      >
        {t("footer.legal")}
      </Link>
      <Link href="/cgu" className="transition-colors hover:text-foreground">
        {t("footer.cgu")}
      </Link>
      <Link
        href="/confidentialite"
        className="transition-colors hover:text-foreground"
      >
        {t("footer.privacy")}
      </Link>
    </>
  );
}

/**
 * Maillage interne SEO : liens depuis la home vers les 3 hubs programmatiques
 * (legit-check / acheter-authentique / guide). Indispensable pour que le
 * PageRank de la home circule vers les pages SEO (auparavant orphelines).
 */
export function FooterSeoLinksI18n() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <span
        className="text-caption font-semibold uppercase text-subtle"
      >
        {t("footer.guidesTitle")}
      </span>
      <div
        className="flex flex-wrap gap-x-6 gap-y-2 text-ui text-subtle"
      >
        <Link
          href="/legit-check"
          className="transition-colors hover:text-foreground"
        >
          {t("footer.verifyAuth")}
        </Link>
        <Link
          href="/acheter-authentique"
          className="transition-colors hover:text-foreground"
        >
          {t("footer.whereBuy")}
        </Link>
        <Link
          href="/guide"
          className="transition-colors hover:text-foreground"
        >
          {t("footer.brandGuides")}
        </Link>
      </div>
    </div>
  );
}
