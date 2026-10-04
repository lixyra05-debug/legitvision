"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";

/**
 * Sur téléphone (moins de 640 px), le bouton n'apparaît plus qu'en anglais,
 * pour revenir au français : le site est en français seul (CLAUDE.md, règle 16)
 * et, depuis le 04/10, le mot LEGITVISION occupe sa place dans les en-têtes.
 */
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
      className={`${locale === "fr" ? "hidden sm:flex" : "flex"} size-9 items-center justify-center rounded-full border border-line bg-surface text-caption font-semibold text-muted-foreground transition-[color,background-color,border-color] duration-fast hover:border-accent/40 hover:bg-surface-raised hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50`}
    >
      {label}
    </button>
  );
}
