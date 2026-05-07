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
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        {t("subscription.pageTitle")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("subscription.pageSubtitle")}
      </p>
    </>
  );
}

export function SubscriptionNoActive({ credits }: { credits: number }) {
  const { t } = useTranslation();
  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-10 backdrop-blur-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <div className="relative flex flex-col items-center text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
          <Sparkles className="size-8 text-emerald-400" />
        </div>
        <h2 className="mt-6 font-heading text-xl font-bold tracking-tight">
          {t("subscription.noActiveTitle")}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {t("subscription.noActiveDesc")}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground">
          <span>{t("subscription.creditsAvailable")}</span>
          <span className="font-semibold text-foreground">{credits}</span>
        </div>
        <Link
          href="/#pricing"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
        >
          {t("subscription.seeOffers")}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export function SubscriptionActive({
  planLabel,
  credits,
  cancelAtPeriodEnd,
  formattedPeriodEnd,
}: {
  planLabel: string;
  credits: number;
  cancelAtPeriodEnd: boolean;
  formattedPeriodEnd: string | null;
}) {
  const { t } = useTranslation();
  const isMultiple = credits > 1;
  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 size-48 rounded-full bg-emerald-500/10 blur-3xl"
      />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("subscription.currentPlan")}
            </p>
            <p className="mt-1 font-heading text-xl font-semibold">
              {planLabel}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {credits}{" "}
              {isMultiple
                ? t("subscription.creditsRemainingPlural")
                : t("subscription.creditsRemaining")}
            </p>
          </div>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
            <ShieldCheck className="size-6 text-emerald-400" />
          </div>
        </div>

        {cancelAtPeriodEnd && formattedPeriodEnd && (
          <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-sm text-amber-400">
              {t("subscription.cancelScheduled")}{" "}
              <span className="font-semibold">{formattedPeriodEnd}</span>.{" "}
              {t("subscription.cancelScheduledEnd")}
            </p>
          </div>
        )}

        {!cancelAtPeriodEnd && (
          <div className="mt-6 border-t border-white/5 pt-6">
            <p className="text-sm text-muted-foreground">
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
    <p className="mt-6 text-xs text-muted-foreground">
      {t("subscription.needHelp")}{" "}
      <a
        href="mailto:legitvision.contact@gmail.com"
        className="text-emerald-400 hover:text-emerald-300"
      >
        legitvision.contact@gmail.com
      </a>
    </p>
  );
}
