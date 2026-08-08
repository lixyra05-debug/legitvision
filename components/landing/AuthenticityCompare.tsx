"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { ChevronsLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContainerScrollSettled } from "@/components/ui/container-scroll-animation";

/**
 * Comparateur du hero : deux articles côte à côte, une seule poignée, et
 * l'impossibilité de trancher à l'œil. C'est la thèse du produit démontrée
 * plutôt qu'affirmée.
 *
 * react-compare-slider : 3,4 Ko gzip, zéro dépendance, MIT, clavier natif.
 *
 * ── Pourquoi le drag se désactive parfois ─────────────────────────────────
 * Dans une ContainerScroll, la carte est inclinée en rotateX tant qu'elle n'est
 * pas posée. La librairie calcule la position du curseur par
 * `(pageX - rect.left) / rect.width`, un mapping aligné sur les axes ; sous
 * perspective, la carte projetée est un trapèze dont la boîte englobante est
 * jusqu'à 25 % plus large que le bord opposé. Le séparateur atterrirait à une
 * centaine de pixels du curseur. On désactive donc le glisser pendant
 * l'inclinaison — et la poignée l'annonce en restant à demi-opaque, faute de
 * quoi l'utilisateur croit le composant cassé.
 *
 * ── Pointer-events ────────────────────────────────────────────────────────
 * `pointer-events-auto` est OBLIGATOIRE sur les pièces visibles : la librairie
 * pose `pointer-events: none` sur le handle-root, qui couvre toute la surface,
 * pour ne pas confisquer les clics sur l'image. Le conteneur reste en hérité.
 *
 * ⚠️ PLACEHOLDER. Les deux côtés sont la MÊME photo, celui de droite passé sous
 * un filtre de teinte. Le bandeau du bas le dit — on vend de la confiance, on ne
 * simule pas une preuve. À remplacer par deux photos du même modèle, une
 * authentique et une contrefaite, cadrées à l'identique.
 */

const PLACEHOLDER_SRC = "/images/sneakers.webp";

const GRAB_STRIP =
  "pointer-events-auto relative w-px flex-1 bg-accent " +
  "before:absolute before:-inset-x-2 before:inset-y-0 before:content-['']";

function CompareHandle({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center transition-opacity duration-base",
        active ? "opacity-100" : "opacity-40",
      )}
    >
      <div className={GRAB_STRIP} />
      <div className="pointer-events-auto relative flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface-raised shadow-lg before:absolute before:-inset-1 before:rounded-full before:content-['']">
        <ChevronsLeftRight className="size-4 text-accent" aria-hidden="true" />
      </div>
      <div className={GRAB_STRIP} />
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
      className={cn(
        "pointer-events-none absolute top-3 z-20 rounded-full border px-3 py-1 text-caption font-semibold uppercase",
        side === "left" ? "left-3" : "right-3",
      )}
      style={{
        color: `hsl(var(--verdict-${tone}))`,
        borderColor: `hsl(var(--verdict-${tone}) / 0.35)`,
        background: "hsl(var(--background) / 0.85)",
      }}
    >
      {children}
    </span>
  );
}

export function AuthenticityCompare({ className }: { className?: string }) {
  // `true` hors ContainerScroll : le composant reste utilisable en autonome.
  const active = useContainerScrollSettled();

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-lg border border-line bg-surface",
        className ?? "aspect-[4/3]",
      )}
    >
      <ReactCompareSlider
        handle={<CompareHandle active={active} />}
        defaultPosition={50}
        keyboardIncrement="5%"
        onlyHandleDraggable
        disabled={!active}
        className="h-full w-full"
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

      {/* pointer-events-none : ce bandeau est en z-20 alors que le handle-root est
          en z-index 1. Sans ça il recouvrirait le bas de la poignée. */}
      <figcaption
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center justify-center gap-2 px-4 py-2 text-caption font-medium"
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
