import type { Metadata } from "next";
import { LabClient } from "@/components/lab/LabClient";

/**
 * Page de test isolée — /lab.
 *
 * Elle n'est référencée nulle part : absente de app/sitemap.ts (qui liste ses
 * URLs explicitement), absente du maillage interne, aucun lien depuis le site.
 *
 * `robots: noindex, nofollow` au niveau de la page, ce qui écrase l'`index: true`
 * du layout racine. Volontairement PAS de `Disallow: /lab` dans robots.txt :
 * interdire le crawl empêcherait justement le robot de lire le noindex, et une
 * URL bloquée peut malgré tout finir indexée sur la foi de liens externes.
 * Laisser crawler + noindex est la combinaison qui désindexe vraiment.
 */
export const metadata: Metadata = {
  title: "Lab — test WebGPU",
  description: "Page de test interne. Non indexée.",
  alternates: { canonical: "/lab" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function LabPage() {
  return <LabClient />;
}
