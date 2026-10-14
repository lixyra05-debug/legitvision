"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ErrorInfo } from "next/error";
import { errorDigest, errorName } from "@/lib/error-digest";

const CONTACT = "legitvision.contact@gmail.com";

/**
 * Page de repli du rapport (décision d'Hector, 2026-10-13 : « le rapport ne
 * doit jamais s'afficher en erreur : dans le pire cas, une page de repli
 * propre »).
 *
 * La page du rapport ramène à sa forme tout ce qui vient de la réponse de l'IA
 * (lib/report-data.ts) : une réponse mal formée ne lève plus d'erreur. Cet
 * écran prend ce qui reste : une erreur inattendue à l'affichage, ou une
 * lecture de l'analyse en erreur (base injoignable : la page lève alors une
 * erreur au lieu de répondre « introuvable »). Il remplace, pour le rapport
 * seulement, l'écran général app/error.tsx : il donne le numéro lu dans
 * l'adresse et ramène au tableau de bord plutôt qu'à l'accueil.
 *
 * Texte fixé par Hector le 13/10 : « Ce rapport ne s'affiche pas pour le
 * moment. Réessayez dans quelques instants. Numéro de l'analyse : [numéro]. »
 * Il ne promet pas que l'analyse est enregistrée : la base peut être en
 * panne, et rien n'a lu cette analyse-ci.
 *
 * L'adresse de contact suit le numéro (décision d'Hector, 2026-10-13 : « c'est
 * là qu'un client qui a payé en a besoin »), sans promesse elle non plus.
 * Elle s'affiche en clair, pour qui n'a pas de logiciel de messagerie ; le
 * lien ouvre un message dont l'objet porte déjà le numéro.
 *
 * Le détail de l'erreur ne s'affiche jamais ; seule sa référence (digest)
 * aide à la retrouver dans les journaux. Props : ErrorInfo de next/error
 * (Next 16.3) ; « Réessayer » appelle `retry`, qui redemande la page au
 * serveur (voir app/error.tsx).
 */
export default function ReportErrorPage({ error, retry }: ErrorInfo) {
  const digest = errorDigest(error);
  // Le numéro affiché sur le rapport : les huit premiers caractères de son
  // identifiant. Lu dans l'adresse ; absent si elle n'en porte pas.
  const params = useParams<{ id?: string | string[] }>();
  const id = typeof params?.id === "string" ? params.id : null;
  const numero = id ? id.slice(0, 8).toUpperCase() : null;
  const objet = numero ? `?subject=${encodeURIComponent(`Analyse ${numero} : le rapport ne s'affiche pas`)}` : "";

  useEffect(() => {
    console.error("[rapport] affichage impossible", errorDigest(error) ?? errorName(error));
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center text-foreground">
      <div className="max-w-md">
        <h1 className="font-heading text-h3 font-bold">
          Ce rapport ne s&apos;affiche pas pour le moment.
        </h1>
        <p className="mt-2 text-ui text-muted-foreground">Réessayez dans quelques instants.</p>
        {numero && (
          <p className="mt-3 text-ui font-medium text-foreground">
            Numéro de l&apos;analyse : {numero}.
          </p>
        )}
        <p className="mt-3 text-ui text-muted-foreground">
          Si le rapport ne revient pas, écrivez-nous à{" "}
          <a
            href={`mailto:${CONTACT}${objet}`}
            className="font-medium text-foreground underline underline-offset-2"
          >
            {CONTACT}
          </a>
          {numero ? " en indiquant ce numéro." : "."}
        </p>
        {digest && (
          <p className="mt-1 text-caption text-muted-foreground">Référence : {digest}</p>
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
          href="/dashboard"
          className="rounded-md border border-line px-5 py-2.5 text-ui font-medium transition-colors hover:border-line-strong hover:bg-surface-raised focus-visible:outline-none focus-visible:ring focus-visible:ring-ring"
        >
          Tableau de bord
        </Link>
      </div>
    </main>
  );
}
