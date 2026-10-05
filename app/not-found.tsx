"use client";

import Link from "next/link";
import { Marque } from "@/components/brand/Marque";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <Marque />
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-accent">404</h1>
        <p className="mt-2 text-muted-foreground">{t("notFound.message")}</p>
      </div>
      <Link
        href="/"
        className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        {t("notFound.cta")}
      </Link>
    </div>
  );
}
