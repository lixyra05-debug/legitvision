"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Erreur inattendue d'une page : un écran en français, aux jetons du thème, au
 * lieu de l'écran blanc du navigateur. Le détail ne s'affiche jamais ; seul
 * l'identifiant de l'erreur (digest) aide à la retrouver dans les journaux.
 */
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[page] erreur inattendue", error.digest ?? error.name);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center text-foreground">
      <div className="max-w-md">
        <h1 className="font-heading text-h3 font-bold">Une erreur est survenue</h1>
        <p className="mt-2 text-ui text-muted-foreground">
          La page n&apos;a pas pu s&apos;afficher. Réessayez ; si l&apos;erreur revient, écrivez-nous en
          indiquant l&apos;heure.
        </p>
        {error.digest && (
          <p className="mt-2 text-caption text-muted-foreground">Référence : {error.digest}</p>
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
