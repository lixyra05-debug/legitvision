"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Comment fonctionne l'analyse par IA ?",
    a: "Notre IA Vision analyse chaque photo selon 8 zones d'authentification spécifiques au modèle (coutures, logo, matériaux, étiquettes...). Elle compare ces éléments avec des milliers de points de référence pour calculer un score de confiance.",
  },
  {
    q: "Est-ce que LegitVision certifie l'authenticité ?",
    a: "Non. LegitVision fournit une estimation de probabilité basée sur l'analyse visuelle par IA. Nous ne délivrons pas de certificat d'authenticité. Pour une certification officielle, nous recommandons de consulter un expert agréé par la marque.",
  },
  {
    q: "Que se passe-t-il si l'IA se trompe ?",
    a: "L'IA peut se tromper, c'est pourquoi nous fournissons un score de confiance et non une certification. Si le score est entre 40 et 60, l'analyse est automatiquement signalée pour revue. Nous recommandons toujours de croiser nos résultats avec d'autres sources.",
  },
  {
    q: "Mes photos sont-elles stockées ?",
    a: "Vos photos sont hébergées de manière sécurisée en Europe (Supabase, région EU). Elles sont utilisées uniquement pour l'analyse et sont supprimées automatiquement après 30 jours. Nous ne partageons jamais vos images avec des tiers.",
  },
  {
    q: "Quelles marques sont supportées ?",
    a: "Nous couvrons plus de 340 modèles dans 3 catégories : sneakers, sacs et vêtements. Nike, Jordan, adidas, New Balance, Louis Vuitton et bien d'autres marques sont disponibles. Nous ajoutons régulièrement de nouveaux modèles. Contactez-nous pour demander une marque spécifique.",
  },
  {
    q: "Combien coûte une analyse ?",
    a: "L'utilisation unique coûte 3,99€. Le forfait Mensuel est à 19,99€/mois pour 10 analyses. Le Premium est à 29,99€/mois pour 50 analyses. Aucune analyse gratuite n'est incluse.",
  },
  {
    q: "Combien de temps prend une analyse ?",
    a: "L'analyse est réalisée en temps réel et prend généralement moins de 30 secondes après l'upload des photos.",
  },
  {
    q: "Comment prendre de bonnes photos pour l'analyse ?",
    a: "Suivez notre guide photo intégré qui vous indique exactement quelles vues capturer. Utilisez un bon éclairage, un fond neutre, et une résolution d'au moins 800×800 pixels. Plus vos photos sont nettes, plus l'analyse sera précise.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-white/5 bg-card transition-colors hover:border-white/10"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="text-sm font-medium text-foreground">{item.q}</span>
            <ChevronDown
              className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Animation accordéon via grid-rows */}
          <div
            className={`grid transition-[grid-template-rows] duration-200 ease-out ${
              open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-t border-white/5 px-5 py-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
