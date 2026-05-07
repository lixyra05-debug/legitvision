"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <Image
        src="/images/legitvision-logo.png"
        alt="LegitVision"
        width={180}
        height={48}
        className="h-12 w-auto"
        priority
        unoptimized
      />
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-emerald-500">404</h1>
        <p className="mt-2 text-muted-foreground">{t("notFound.message")}</p>
      </div>
      <Link
        href="/"
        className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
      >
        {t("notFound.cta")}
      </Link>
    </div>
  );
}
