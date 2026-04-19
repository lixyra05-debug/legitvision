"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type State = "idle" | "confirming" | "submitting" | "error";

export function CancelButton() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleConfirm() {
    setState("submitting");
    setError(null);
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erreur lors de la résiliation");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      setState("error");
    }
  }

  if (state === "idle") {
    return (
      <button
        onClick={() => setState("confirming")}
        className="inline-flex h-10 items-center rounded-lg border border-red-500/30 bg-red-500/10 px-4 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
      >
        Résilier mon abonnement
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-sm text-foreground">Confirmer la résiliation ?</p>
      <button
        onClick={handleConfirm}
        disabled={state === "submitting"}
        className="inline-flex h-9 items-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white transition-colors hover:bg-red-400 disabled:opacity-60"
      >
        {state === "submitting" ? "Résiliation…" : "Oui, résilier"}
      </button>
      <button
        onClick={() => {
          setState("idle");
          setError(null);
        }}
        disabled={state === "submitting"}
        className="inline-flex h-9 items-center rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
      >
        Annuler
      </button>
      {error && <p className="w-full text-sm text-red-400">{error}</p>}
    </div>
  );
}
