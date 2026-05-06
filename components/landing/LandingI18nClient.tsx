"use client";

import Link from "next/link";
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
