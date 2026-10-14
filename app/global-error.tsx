"use client";

import "./globals.css";
import { useEffect, useLayoutEffect } from "react";
import type { ErrorInfo } from "next/error";
import { storedTheme } from "@/components/ThemeProvider";
import { errorDigest, errorName } from "@/lib/error-digest";

/**
 * Erreur de la mise en page racine (app/layout.tsx), ou de ce qu'elle affiche
 * autour des pages (ThemeProvider, LanguageProvider, ChatWidget) : app/error.tsx
 * ne la couvre pas. Sans ce fichier, Next affichait sa propre page, en anglais
 * (« This page couldn’t load », « Reload », « Back ») ; le site est en
 * français seul (CLAUDE.md, règle 16).
 *
 * Cet écran remplace alors la mise en page racine. Il porte ses propres
 * <html lang="fr"> et <body>, la feuille globale (jetons du thème), et pose
 * lui-même la classe du thème, avec la règle du script de <head>, qui ne
 * tourne pas ici. Les polices de la mise en page ne sont pas chargées : texte
 * en police système. Mêmes textes que app/error.tsx ; « Retour à l'accueil »
 * recharge le document, puisque la mise en page est en cause.
 */
export default function GlobalError({ error, retry }: ErrorInfo) {
  const digest = errorDigest(error);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(storedTheme());
  }, []);

  useEffect(() => {
    console.error("[racine] erreur inattendue", errorDigest(error) ?? errorName(error));
  }, [error]);

  return (
    <html lang="fr">
      <body
        className="min-h-screen bg-background text-foreground antialiased"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        <title>Une erreur est survenue — LegitVision</title>
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="max-w-md">
            <h1 className="text-h3 font-bold">Une erreur est survenue</h1>
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
            {/* Un lien simple, pas next/link : on recharge le document entier. */}
            <a
              href="/"
              className="rounded-md border border-line px-5 py-2.5 text-ui font-medium transition-colors hover:border-line-strong hover:bg-surface-raised focus-visible:outline-none focus-visible:ring focus-visible:ring-ring"
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
