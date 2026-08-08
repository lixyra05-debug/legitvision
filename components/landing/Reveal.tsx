"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Révélations au scroll, en cascade.
 *
 * Remplace components/layout/FadeIn.tsx sur la landing. FadeIn révélait chaque
 * bloc isolément et les décalages se réglaient à la main (`delay={i * 120}`) ;
 * ici le décalage est porté par le parent via `staggerChildren`, ce qui donne la
 * cascade sans arithmétique au point d'usage.
 *
 * L'easing et les durées viennent du design system : var(--ease) et les trois
 * durées canoniques, converties en secondes pour framer-motion.
 *
 * prefers-reduced-motion : plus aucun déplacement ni fondu, le contenu est là
 * d'emblée. Les variantes sont neutralisées plutôt que court-circuitées, pour que
 * `whileInView` continue de fonctionner sans changer la structure du DOM.
 */

// cubic-bezier(0.2, 0, 0, 1) — la courbe unique du design system.
const EASE = [0.2, 0, 0, 1] as const;
const DUR_BASE = 0.22; // --dur-base
const DUR_SLOW = 0.42; // --dur-slow
const STAGGER = 0.08;

const VIEWPORT = { once: true, amount: 0.2 } as const;

function itemVariants(reduced: boolean): Variants {
  if (reduced) {
    return { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } };
  }
  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DUR_SLOW, ease: EASE },
    },
  };
}

function groupVariants(reduced: boolean): Variants {
  return {
    hidden: {},
    visible: {
      transition: reduced
        ? {}
        : { staggerChildren: STAGGER, delayChildren: DUR_BASE / 2 },
    },
  };
}

/** Conteneur : ses enfants RevealItem apparaissent en cascade. */
export function RevealGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      className={className}
      variants={groupVariants(reduced)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

/** Enfant d'un RevealGroup — son décalage vient du parent, pas d'un delay manuel. */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div className={className} variants={itemVariants(reduced)}>
      {children}
    </motion.div>
  );
}

/**
 * Révélation isolée, hors cascade. Remplacement direct de FadeIn : mêmes props,
 * `delay` en millisecondes pour ne rien changer aux points d'usage existants.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion() ?? false;
  return (
    <motion.div
      className={cn(className)}
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR_SLOW, ease: EASE, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}
