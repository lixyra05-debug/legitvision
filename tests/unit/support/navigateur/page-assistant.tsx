// Page rendue dans le navigateur des tests (support/navigateur.ts) : le contenu
// d'une page et l'assistant, montés comme dans app/layout.tsx. Le contenu est
// un rapport (ReportView), le tableau de bord (la vraie page, lue par un faux
// Supabase), ou l'un des écrans qui peuvent s'afficher à l'adresse d'un
// rapport sans en être un : analyse introuvable, erreur générale, page de
// repli du rapport (app/(dashboard)/check/[id]/error.tsx).
import { useEffect, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import ReportErrorPage from "@/app/(dashboard)/check/[id]/error";
import DashboardPage from "@/app/(dashboard)/dashboard/page";
import ErrorPage from "@/app/error";
import NotFound from "@/app/not-found";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { ReportView, type ReportData } from "@/components/check/ReportView";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import type { DonneesTableauDeBord } from "../faux-tableau-de-bord";

export type PageRendue =
  | { ecran: "rapport"; donnees: ReportData }
  | { ecran: "tableau-de-bord"; donnees: DonneesTableauDeBord }
  | { ecran: "introuvable" }
  | { ecran: "erreur" }
  | { ecran: "repli-rapport" };

declare global {
  interface Window {
    __PAGE: PageRendue;
    /** Ce que la page a écrit par console.error, une ligne par appel, erreurs écrites avec leur message. */
    __JOURNAL: string[];
  }
}

// Les écrans d'erreur écrivent au journal : le test y vérifie que le détail de
// l'erreur n'y part pas. Relevé ici, avant le premier rendu.
window.__JOURNAL = [];
const consoleErreur = console.error.bind(console);
console.error = (...valeurs: unknown[]) => {
  window.__JOURNAL.push(valeurs.map((v) => (v instanceof Error ? `${v.name}: ${v.message}` : String(v))).join(" "));
  consoleErreur(...valeurs);
};

/** L'erreur passée aux écrans d'erreur : un détail à ne jamais montrer, et une référence. */
const ERREUR_D_ESSAI = Object.assign(new Error("détail interne à ne pas montrer"), { digest: "essai" });
/** « Réessayer » : le test lit sur <body> laquelle des deux relances l'écran a appelée. */
const relances = {
  retry: () => document.body.setAttribute("data-relance", "retry"),
  reset: () => document.body.setAttribute("data-relance", "reset"),
};

/** Le tableau de bord est un composant serveur : sa page est exécutée d'abord, puis son rendu monté. */
async function contenu(): Promise<ReactNode> {
  const page = window.__PAGE;
  if (page.ecran === "rapport") return <ReportView data={page.donnees} />;
  if (page.ecran === "tableau-de-bord") return DashboardPage({ searchParams: Promise.resolve({}) });
  if (page.ecran === "introuvable") return <NotFound />;
  if (page.ecran === "repli-rapport") return <ReportErrorPage error={ERREUR_D_ESSAI} {...relances} />;
  return <ErrorPage error={ERREUR_D_ESSAI} {...relances} />;
}

/** Signale au test que React a rendu la page. */
function Rendu() {
  useEffect(() => {
    document.body.setAttribute("data-rendu", "");
  }, []);
  return null;
}

contenu().then((page) =>
  createRoot(document.body).render(
    <ThemeProvider>
      <LanguageProvider>
        {page}
        <ChatWidget />
        <Rendu />
      </LanguageProvider>
    </ThemeProvider>,
  ),
);
