"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { PlanId } from "@/lib/stripe/config";

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
        setError("Le serveur a retourné une réponse inattendue.");
        return;
      }

      if (!res.ok) {
        if (res.status === 401) {
          // Non connecté : aller s'authentifier puis revenir sur la landing
          // pour pouvoir re-cliquer sur le bouton (maintenant connecté → Stripe s'ouvrira)
          router.push(`/auth?redirect=${encodeURIComponent("/")}`);
          return;
        }
        setError(data.error ?? "Une erreur est survenue. Réessayez.");
        return;
      }

      if (data.url) {
        // Redirection vers Stripe Checkout (page hébergée par Stripe)
        window.location.href = data.url;
      } else {
        setError("Impossible d'obtenir l'URL de paiement. Réessayez.");
      }
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion et réessayez.");
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
            Redirection…
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
