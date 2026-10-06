// Page rendue dans le navigateur des tests (support/navigateur.ts) : le contenu
// d'une page et l'assistant, montés comme dans app/layout.tsx. Le contenu est
// un rapport (ReportView), le tableau de bord (la vraie page, lue par un faux
// Supabase), ou l'un des deux écrans qui peuvent s'afficher à l'adresse d'un
// rapport sans en être un : analyse introuvable, erreur.
import { useEffect, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
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
  | { ecran: "erreur" };

declare global {
  interface Window {
    __PAGE: PageRendue;
  }
}

/** Le tableau de bord est un composant serveur : sa page est exécutée d'abord, puis son rendu monté. */
async function contenu(): Promise<ReactNode> {
  const page = window.__PAGE;
  if (page.ecran === "rapport") return <ReportView data={page.donnees} />;
  if (page.ecran === "tableau-de-bord") return DashboardPage({ searchParams: Promise.resolve({}) });
  if (page.ecran === "introuvable") return <NotFound />;
  return <ErrorPage error={{ digest: "essai" }} reset={() => {}} retry={() => {}} />;
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
