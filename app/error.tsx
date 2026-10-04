"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { ErrorInfo } from "next/error";

/**
 * Erreur inattendue d'une page : un écran en français, aux jetons du thème, au
 * lieu de l'écran blanc du navigateur. Le détail ne s'affiche jamais ; seul
 * l'identifiant de l'erreur (digest) aide à la retrouver dans les journaux.
 *
 * Props : le type officiel ErrorInfo de next/error (Next 16.3). `error` y est
 * `unknown` : Next transmet la valeur levée telle quelle, qui n'est pas
 * forcément une Error (next/dist/client/components/error-boundary.js). On la
 * lit donc sans rien supposer de son type.
 *
 * « Réessayer » appelle `retry` (stable depuis Next 16.3.0) : il redemande la
 * page au serveur (router.refresh), puis réaffiche le segment, sans recharger
 * le document. `reset` se contenterait de réafficher : une erreur levée côté
 * serveur reviendrait telle quelle.
 */
export default function ErrorPage({ error, retry }: ErrorInfo) {
  const digest = digestOf(error);

  useEffect(() => {
    console.error("[page] erreur inattendue", digestOf(error) ?? nameOf(error));
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center text-foreground">
      <div className="max-w-md">
        <h1 className="font-heading text-h3 font-bold">Une erreur est survenue</h1>
        <p className="mt-2 text-ui text-muted-foreground">
          La page n&apos;a pas pu s&apos;afficher. Réessayez ; si l&apos;erreur revient, écrivez-nous en
          indiquant l&apos;heure.
        </p>
        {digest && (
          <p className="mt-2 text-caption text-muted-foreground">Référence : {digest}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-md bg-accent px-5 py-2.5 text-ui font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring focus-visible:ring-ring"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="rounded-md border border-line px-5 py-2.5 text-ui font-medium transition-colors hover:border-line-strong hover:bg-surface-raised focus-visible:outline-none focus-visible:ring focus-visible:ring-ring"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}

/** Identifiant de l'erreur côté serveur, s'il y en a un et que c'est un texte. */
function digestOf(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("digest" in error)) return null;
  const { digest } = error;
  return typeof digest === "string" && digest !== "" ? digest : null;
}

/** Type de l'erreur, jamais son message : il peut contenir des données. */
function nameOf(error: unknown): string {
  return error instanceof Error ? error.name : typeof error;
}
