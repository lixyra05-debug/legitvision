"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { CancelButton } from "@/app/(dashboard)/dashboard/subscription/CancelButton";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

/**
 * Composants client pour la page /dashboard/subscription (server component
 * async avec stripe API). Permet l'i18n FR/EN.
 */

export function SubscriptionPageHeader() {
  const { t } = useTranslation();
  return (
    <>
      <h1 className="font-heading text-h2 font-bold">
        {t("subscription.pageTitle")}
      </h1>
      <p className="mt-2 text-ui text-muted-foreground">
        {t("subscription.pageSubtitle")}
      </p>
    </>
  );
}

export function SubscriptionNoActive({ credits }: { credits: number }) {
  const { t } = useTranslation();
  return (
    <div className="relative mt-10 overflow-hidden rounded-lg border border-line bg-surface p-10">
      <div className="relative flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-lg border border-line bg-surface-raised">
          <Sparkles className="size-8 text-muted-foreground" />
        </div>
        <h2 className="mt-6 font-heading text-h3 font-bold">
          {t("subscription.noActiveTitle")}
        </h2>
        <p className="mt-2 max-w-sm text-ui text-muted-foreground">
          {t("subscription.noActiveDesc")}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1.5 text-caption text-muted-foreground">
          <span>{t("subscription.creditsAvailable")}</span>
          <span className="font-semibold text-foreground">{credits}</span>
        </div>
        <Link
          href="/#pricing"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-accent px-6 text-ui font-semibold text-accent-foreground transition-colors duration-fast hover:bg-accent-hover"
        >
          {t("subscription.seeOffers")}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export function SubscriptionActive({
  plan,
  credits,
  cancelAtPeriodEnd,
  periodEndUnix,
}: {
  plan: string;
  credits: number;
  cancelAtPeriodEnd: boolean;
  periodEndUnix: number | null;
}) {
  const { t, locale } = useTranslation();
  const isMultiple = credits > 1;
  const intlLocale = locale === "en" ? "en-US" : "fr-FR";
  const planLabelKey =
    plan === "pro"
      ? "subscription.planPro"
      : plan === "business"
        ? "subscription.planBusiness"
        : "subscription.planFree";
  const planLabel = t(planLabelKey);
  const formattedPeriodEnd = periodEndUnix
    ? new Date(periodEndUnix * 1000).toLocaleDateString(intlLocale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
  return (
    <div className="relative mt-10 overflow-hidden rounded-lg border border-line bg-surface p-6">
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-caption uppercase tracking-wider text-muted-foreground">
              {t("subscription.currentPlan")}
            </p>
            <p className="mt-1 font-heading text-h4 font-semibold">
              {planLabel}
            </p>
            <p className="mt-1 text-ui text-muted-foreground">
              {credits}{" "}
              {isMultiple
                ? t("subscription.creditsRemainingPlural")
                : t("subscription.creditsRemaining")}
            </p>
          </div>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md border border-line bg-surface-raised">
            <ShieldCheck className="size-6 text-muted-foreground" />
          </div>
        </div>

        {cancelAtPeriodEnd && formattedPeriodEnd && (
          <div className="mt-6 rounded-md border border-warning/20 bg-warning/5 p-4">
            <p className="text-ui text-warning">
              {t("subscription.cancelScheduled")}{" "}
              <span className="font-semibold">{formattedPeriodEnd}</span>.{" "}
              {t("subscription.cancelScheduledEnd")}
            </p>
          </div>
        )}

        {!cancelAtPeriodEnd && (
          <div className="mt-6 border-t border-line-subtle pt-6">
            <p className="text-ui text-muted-foreground">
              {t("subscription.cancelInfo")}
            </p>
            <div className="mt-4">
              <CancelButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function SubscriptionContactNote() {
  const { t } = useTranslation();
  return (
    <p className="mt-6 text-caption text-muted-foreground">
      {t("subscription.needHelp")}{" "}
      <a
        href="mailto:legitvision.contact@gmail.com"
        className="text-accent transition-colors duration-fast hover:text-accent-hover"
      >
        legitvision.contact@gmail.com
      </a>
    </p>
  );
}
