"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { ChevronsLeftRight } from "lucide-react";

/**
 * Comparateur du hero : deux articles côte à côte, une seule poignée, et
 * l'impossibilité de trancher à l'œil. C'est la thèse du produit démontrée
 * plutôt qu'affirmée.
 *
 * react-compare-slider : 3,4 Ko gzip, zéro dépendance, MIT, clavier natif
 * (flèches sur la poignée focalisée).
 *
 * La poignée par défaut du paquet est écartée : elle applique un
 * `backdrop-filter: blur()` sur un fond translucide — du glassmorphism, et les
 * seules couleurs codées en dur de toute la bibliothèque. Celle ci-dessous
 * n'utilise que des tokens.
 *
 * ⚠️ PLACEHOLDER. Les deux côtés sont la MÊME photo, celui de droite passé sous
 * un filtre de teinte. Ce n'est pas une vraie comparaison et le bandeau du bas
 * le dit explicitement — on vend de la confiance, on ne simule pas une preuve.
 * À remplacer par deux photos du même modèle, une authentique et une
 * contrefaite, cadrées à l'identique. Passer alors sur next/image.
 */

const PLACEHOLDER_SRC = "/images/sneakers.webp";

/** Poignée maison : un filet à l'accent, un grip neutre. Aucun flou, aucune couleur en dur. */
function CompareHandle() {
  return (
    <div className="flex h-full flex-col items-center">
      <div className="w-px flex-1 bg-accent" />
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-raised shadow-lg">
        <ChevronsLeftRight className="size-4 text-accent" aria-hidden="true" />
      </div>
      <div className="w-px flex-1 bg-accent" />
    </div>
  );
}

function EndLabel({
  children,
  side,
  tone,
}: {
  children: React.ReactNode;
  side: "left" | "right";
  tone: "authentic" | "fake";
}) {
  return (
    <span
      className={`pointer-events-none absolute top-3 z-20 rounded-full border px-3 py-1 text-caption font-semibold uppercase ${
        side === "left" ? "left-3" : "right-3"
      }`}
      style={{
        color: `hsl(var(--verdict-${tone === "authentic" ? "authentic" : "fake"}))`,
        borderColor: `hsl(var(--verdict-${tone === "authentic" ? "authentic" : "fake"}) / 0.35)`,
        background: "hsl(var(--background) / 0.85)",
      }}
    >
      {children}
    </span>
  );
}

export function AuthenticityCompare() {
  return (
    <figure className="relative overflow-hidden rounded-lg border border-line bg-surface">
      <ReactCompareSlider
        handle={<CompareHandle />}
        defaultPosition={50}
        keyboardIncrement="5%"
        onlyHandleDraggable
        className="aspect-[4/3] w-full"
        itemOne={
          <ReactCompareSliderImage
            src={PLACEHOLDER_SRC}
            alt="Article présenté comme authentique"
            style={{ objectFit: "cover" }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={PLACEHOLDER_SRC}
            alt="Même article, variante générée pour l'aperçu"
            style={{
              objectFit: "cover",
              // Décalage de teinte : rend les deux côtés distinguables SANS
              // prétendre montrer une vraie contrefaçon.
              filter: "hue-rotate(-16deg) saturate(0.8) brightness(0.93)",
            }}
          />
        }
      />

      <EndLabel side="left" tone="authentic">
        Authentique
      </EndLabel>
      <EndLabel side="right" tone="fake">
        Contrefaçon
      </EndLabel>

      <figcaption
        className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 px-4 py-2 text-caption font-medium"
        style={{
          color: "hsl(var(--verdict-inconclusive))",
          background: "hsl(var(--background) / 0.9)",
          borderTop: "1px solid hsl(var(--line))",
        }}
      >
        Aperçu — photos réelles à venir
      </figcaption>
    </figure>
  );
}
