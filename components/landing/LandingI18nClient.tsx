"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

/**
 * Composants client qui rendent les zones i18n-isées de la landing.
 * Le fichier app/page.tsx reste server (pour exporter metadata) ;
 * ces sous-composants client consomment useTranslation pour basculer FR/EN.
 */

export function HeroI18n() {
  const { t } = useTranslation();
  return (
    <>
      <h1
        className="font-heading text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
        style={{ color: "var(--text-primary)" }}
      >
        {t("hero.title")}
      </h1>
      <p
        className="mt-6 max-w-lg text-base leading-relaxed sm:text-lg"
        style={{ color: "var(--text-secondary)" }}
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
        className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
        style={{ color: "var(--text-primary)" }}
      >
        {t("landing.brandsTitle")}
      </h2>
      <p
        className="mx-auto mt-4 max-w-2xl"
        style={{ color: "var(--text-secondary)" }}
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
        className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
        style={{ color: "var(--text-primary)" }}
      >
        {t("landing.howItWorksTitle")}
      </h2>
      <p
        className="mx-auto mt-4 max-w-2xl"
        style={{ color: "var(--text-secondary)" }}
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
        className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
        style={{ color: "var(--text-primary)" }}
      >
        {t("landing.pricingTitle")}
      </h2>
      <p
        className="mx-auto mt-4 max-w-2xl"
        style={{ color: "var(--text-secondary)" }}
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
      className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
      style={{ color: "var(--text-primary)" }}
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
        className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
        style={{ color: "var(--text-primary)" }}
      >
        {t("landing.ctaFinalTitle")}
      </h2>
      <p
        className="mx-auto mt-4 max-w-lg"
        style={{ color: "var(--text-secondary)" }}
      >
        {t("landing.ctaFinalSubtitle")}
      </p>
      <Link
        href="/auth?redirect=%2Fcheck%2Fnew"
        className="group mt-10 inline-flex h-12 items-center gap-2 rounded-xl px-8 text-base font-semibold text-white transition-all"
        style={{
          background: "#10B981",
          animation: "pulse-glow 3s ease-in-out infinite",
        }}
      >
        {t("landing.ctaFinalButton")}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
      <p
        className="mt-4 text-xs"
        style={{ color: "var(--text-tertiary)" }}
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
