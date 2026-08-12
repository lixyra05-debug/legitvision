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
        className="inline-flex h-10 items-center rounded-md border border-destructive/30 bg-destructive/10 px-4 text-ui font-medium text-destructive transition-colors duration-fast hover:bg-destructive/20"
      >
        Résilier mon abonnement
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-ui text-foreground">Confirmer la résiliation ?</p>
      <button
        onClick={handleConfirm}
        disabled={state === "submitting"}
        className="inline-flex h-9 items-center rounded-md bg-destructive px-4 text-ui font-medium text-destructive-foreground transition-colors duration-fast hover:bg-destructive/90 disabled:opacity-60"
      >
        {state === "submitting" ? "Résiliation…" : "Oui, résilier"}
      </button>
      <button
        onClick={() => {
          setState("idle");
          setError(null);
        }}
        disabled={state === "submitting"}
        className="inline-flex h-9 items-center rounded-md px-3 text-ui text-muted-foreground transition-colors duration-fast hover:text-foreground disabled:opacity-60"
      >
        Annuler
      </button>
      {error && <p className="w-full text-ui text-destructive">{error}</p>}
    </div>
  );
}
