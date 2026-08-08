"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Média qui s'agrandit au fil du scroll — SANS détourner le scroll.
 *
 * Le composant d'origine dont ce concept est repris appelait `preventDefault`
 * sur `wheel` et `touchmove` et forçait `window.scrollTo(0, 0)` : la page était
 * verrouillée tant que l'animation n'était pas finie. Inacceptable, et sur iOS
 * ça casse en plus le rubber-band et le geste de retour.
 *
 * Ici, tout passe par `useScroll` avec `offset: ["start end", "end start"]` :
 * la progression est mesurée sur la traversée de l'élément dans le viewport, et
 * le scroll natif n'est jamais touché. L'utilisateur descend à son rythme,
 * remonte, saute la section — rien ne lui est confisqué.
 *
 * On anime `scale` et non `width` : le scale est composité par le GPU, alors
 * qu'animer la largeur déclencherait un reflow à chaque frame de scroll — le
 * jank vient de là sur mobile.
 *
 * La course est raccourcie sur mobile : l'écran est plus petit, l'effet doit
 * être consommé plus vite sous le pouce.
 *
 * prefers-reduced-motion : état final rendu directement, aucun useTransform actif.
 */
export function ScrollExpandMedia({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const end = isMobile ? 0.3 : 0.45;

  const scale = useTransform(
    scrollYProgress,
    [0, end],
    reduced ? [1, 1] : [0.62, 1],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, end * 0.6],
    reduced ? [1, 1] : [0.55, 1],
  );

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ scale, opacity }}
        className="origin-center will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
