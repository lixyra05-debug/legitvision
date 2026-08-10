"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";

/**
 * Bac à sable /lab — détection WebGPU et montage conditionnel.
 *
 * Trois gardes, parce qu'un seul ne suffit pas :
 *
 * 1. `navigator.gpu` absent  -> on ne monte JAMAIS le Canvas. C'est le cas des
 *    Safari iOS antérieurs au support, donc potentiellement l'essentiel du parc
 *    iPhone. Sans ce garde, l'utilisateur voit un écran noir.
 * 2. `requestAdapter()` peut renvoyer null même quand `navigator.gpu` existe
 *    (GPU sur liste noire, machine virtuelle, économie d'énergie). On le teste
 *    réellement au lieu de se fier à la présence de l'API.
 * 3. `renderer.init()` peut encore échouer après tout ça — une frontière
 *    d'erreur attrape la casse et affiche le repli au lieu de démonter la page.
 *
 * Le composant three est en import dynamique `ssr: false` : three au SSR
 * planterait, et ses ~600 Ko n'ont rien à faire dans le bundle partagé.
 */

const HeroFuturistic = dynamic(
  () => import("@/components/ui/hero-futuristic").then((m) => m.HeroFuturistic),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-svh items-center justify-center text-ui text-muted-foreground">
        Chargement du moteur de rendu…
      </div>
    ),
  },
);

type Support =
  | { state: "checking" }
  | { state: "unsupported"; reason: string }
  | { state: "supported"; adapter: string };

class CanvasBoundary extends Component<
  { children: ReactNode; onError: (message: string) => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error.message || "erreur inconnue");
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function StatusLine({ support, crashed }: { support: Support; crashed: string | null }) {
  const label =
    crashed !== null
      ? "WebGPU : non supporté"
      : support.state === "checking"
        ? "WebGPU : détection…"
        : support.state === "supported"
          ? "WebGPU : supporté"
          : "WebGPU : non supporté";

  const tone =
    crashed !== null || support.state === "unsupported"
      ? "--verdict-fake"
      : support.state === "supported"
        ? "--verdict-authentic"
        : "--verdict-inconclusive";

  const detail =
    crashed !== null
      ? `le rendu a échoué — ${crashed}`
      : support.state === "supported"
        ? support.adapter
        : support.state === "unsupported"
          ? support.reason
          : "";

  return (
    <div className="fixed left-4 top-4 z-[100] max-w-[calc(100vw-2rem)] rounded-md border border-line bg-surface-raised px-4 py-3 shadow-card">
      <p className="text-ui font-semibold" style={{ color: `hsl(var(${tone}))` }}>
        {label}
      </p>
      {detail ? (
        <p className="mt-1 break-words text-caption text-muted-foreground">{detail}</p>
      ) : null}
      <p className="mt-2 text-caption text-subtle">
        {typeof navigator !== "undefined" ? navigator.userAgent : ""}
      </p>
    </div>
  );
}

export function LabClient() {
  const [support, setSupport] = useState<Support>({ state: "checking" });
  const [crashed, setCrashed] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function probe() {
      const gpu = (navigator as Navigator & { gpu?: unknown }).gpu;
      if (!gpu) {
        if (!cancelled) {
          setSupport({
            state: "unsupported",
            reason: "navigator.gpu est absent — ce navigateur n'expose pas WebGPU.",
          });
        }
        return;
      }
      try {
        const adapter = await (
          gpu as { requestAdapter: () => Promise<unknown> }
        ).requestAdapter();
        if (cancelled) return;
        if (!adapter) {
          setSupport({
            state: "unsupported",
            reason:
              "navigator.gpu existe mais requestAdapter() n'a renvoyé aucun adaptateur.",
          });
          return;
        }
        const info = (adapter as { info?: { vendor?: string; architecture?: string } })
          .info;
        setSupport({
          state: "supported",
          adapter: info
            ? `adaptateur : ${info.vendor ?? "?"} ${info.architecture ?? ""}`.trim()
            : "adaptateur obtenu",
        });
      } catch (err) {
        if (!cancelled) {
          setSupport({
            state: "unsupported",
            reason: `requestAdapter() a levé une erreur — ${
              err instanceof Error ? err.message : String(err)
            }`,
          });
        }
      }
    }

    probe();
    return () => {
      cancelled = true;
    };
  }, []);

  const canRender = support.state === "supported" && crashed === null;

  return (
    <main className="relative min-h-svh bg-background">
      <StatusLine support={support} crashed={crashed} />

      {canRender ? (
        <CanvasBoundary onError={setCrashed}>
          <HeroFuturistic />
        </CanvasBoundary>
      ) : (
        <div className="flex h-svh flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-heading text-h2 font-bold">
            {support.state === "checking"
              ? "Détection du support WebGPU…"
              : "Repli — pas de rendu WebGPU"}
          </h1>
          <p className="max-w-md text-body text-muted-foreground">
            {support.state === "checking"
              ? "Un instant."
              : "Cet appareil ne peut pas exécuter le hero WebGPU. Aucun Canvas n'a été monté : pas d'écran noir, pas de crash — c'est exactement ce que verrait un visiteur si ce composant partait en production."}
          </p>
        </div>
      )}
    </main>
  );
}
