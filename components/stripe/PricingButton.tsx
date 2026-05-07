"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { PlanId } from "@/lib/stripe/config";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface PricingButtonProps {
  planId: PlanId;
  isPopular?: boolean;
  children: React.ReactNode;
  /** Si true, redirige vers /auth au lieu de Stripe (plan Free) */
  isAuthRedirect?: boolean;
}

export function PricingButton({
  planId,
  isPopular = false,
  children,
  isAuthRedirect = false,
}: PricingButtonProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    // Plan Free → aller s'inscrire
    if (isAuthRedirect) {
      router.push("/auth");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      // Réponse non-JSON possible si crash serveur
      let data: { url?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        setError(t("stripe.errorUnexpected"));
        return;
      }

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/auth?redirect=${encodeURIComponent("/")}`);
          return;
        }
        setError(data.error ?? t("stripe.errorGeneric"));
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(t("stripe.errorNoUrl"));
      }
    } catch {
      setError(t("stripe.errorNetwork"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
          isPopular
            ? "bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
            : "border border-white/10 text-foreground hover:border-white/20 hover:bg-white/5"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {t("stripe.redirecting")}
          </>
        ) : (
          children
        )}
      </button>
      {error && (
        <p className="text-center text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
