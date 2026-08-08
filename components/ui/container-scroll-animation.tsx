"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/**
 * ContainerScroll — carte qui se redresse en 3D au fil du scroll.
 *
 * Adapté du « Container Scroll Animation » d'Aceternity UI (manuarora700,
 * récupéré via 21st.dev le 2026-08-08). Choréographie conservée — rotateX 20°→0°,
 * scale, translateY de l'en-tête, perspective 1000px — mais toutes les valeurs
 * visuelles passent par nos tokens, et la hauteur est réduite (voir plus bas).
 *
 * ── Le contrat « settled » ────────────────────────────────────────────────
 * Tant que la carte est inclinée, tout composant à pointeur placé dedans est
 * inutilisable : sa géométrie projetée est un trapèze, alors que les calculs
 * de position travaillent sur la boîte englobante. Le contexte ci-dessous
 * publie donc l'état « la carte est posée », que les enfants consomment pour
 * se désactiver — et le signaler visuellement — pendant l'inclinaison.
 *
 * Hors ContainerScroll, le hook renvoie `true` : les enfants restent utilisables
 * en usage autonome.
 */

const SettledContext = createContext<boolean | null>(null);

/** `true` quand la carte est posée (ou qu'on est hors ContainerScroll). */
export function useContainerScrollSettled(): boolean {
  return useContext(SettledContext) ?? true;
}

export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent?: React.ReactNode;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Les hooks ne peuvent pas être conditionnels : on neutralise les plages
  // plutôt que de sauter les useTransform.
  const scaleRange: [number, number] = reduced
    ? [1, 1]
    : isMobile
      ? [0.85, 1]
      : [1.05, 1];

  const rotate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleRange);
  const translate = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [0, -80],
  );

  // Seuil à 0,5° : en dessous, la déformation perspective est sous le pixel.
  const [settled, setSettled] = useState(() => reduced || rotate.get() <= 0.5);
  useMotionValueEvent(rotate, "change", (v) => setSettled(v <= 0.5));

  return (
    // min-h et non h : avec le texte du hero en en-tête, une hauteur fixe
    // déborderait sur mobile et empiéterait sur la section suivante. Le plancher
    // suffit à garantir la course de scroll, useScroll mesurant l'élément réel.
    <div
      ref={containerRef}
      className="relative flex min-h-[38rem] items-center justify-center p-2 md:min-h-[52rem] md:p-8"
    >
      <div
        className="relative w-full py-8 md:py-16"
        style={{ perspective: "1000px" }}
      >
        {titleComponent ? (
          <Header translate={translate}>{titleComponent}</Header>
        ) : null}
        <Card rotate={rotate} scale={scale} hasHeader={Boolean(titleComponent)}>
          <SettledContext.Provider value={settled}>
            {children}
          </SettledContext.Provider>
        </Card>
      </div>
    </div>
  );
}

function Header({
  translate,
  children,
}: {
  translate: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="mx-auto max-w-5xl text-center"
    >
      {children}
    </motion.div>
  );
}

function Card({
  rotate,
  scale,
  hasHeader,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  hasHeader: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ rotateX: rotate, scale }}
      className={`mx-auto h-[24rem] w-full max-w-5xl rounded-lg border-4 border-line-strong bg-surface-raised p-2 shadow-card md:h-[34rem] md:p-6 ${
        hasHeader ? "-mt-8" : ""
      }`}
    >
      <div className="h-full w-full overflow-hidden rounded-md bg-surface md:p-4">
        {children}
      </div>
    </motion.div>
  );
}
