"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";

export function LanguageToggle() {
  const { locale, toggleLocale } = useTranslation();
  const next = locale === "fr" ? "en" : "fr";
  const label = locale === "fr" ? "FR" : "EN";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={`Switch to ${next.toUpperCase()}`}
      title={`${locale.toUpperCase()} → ${next.toUpperCase()}`}
      className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold tracking-wider text-foreground/80 transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/10 hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
    >
      {label}
    </button>
  );
}
