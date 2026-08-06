"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Compteur animé, sans aucune dépendance — même motif que components/layout/FadeIn.tsx :
 * IntersectionObserver pour le déclenchement, requestAnimationFrame pour l'interpolation.
 *
 * Le rendu serveur affiche directement la valeur finale : sans JavaScript, ou pour un
 * crawler, la page annonce « 47 » et non « 0 ». La remise à zéro n'a lieu qu'au montage
 * côté client, avant que la bande de stats n'entre dans le viewport.
 *
 * prefers-reduced-motion : la valeur s'affiche d'emblée, aucune boucle rAF n'est lancée.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1600,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    setDisplay(0);

    let frame = 0;
    let startedAt = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);

        const step = (now: number) => {
          if (!startedAt) startedAt = now;
          const progress = Math.min((now - startedAt) / duration, 1);
          // easeOutExpo : démarre vite, se pose sans rebond — même intention que --ease.
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          setDisplay(Math.round(eased * value));
          if (progress < 1) frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  // Le chiffre qui défile est masqué aux lecteurs d'écran : une valeur qui change
  // 60 fois par seconde les inonde. La valeur finale est exposée une seule fois.
  return (
    <>
      <span ref={ref} aria-hidden="true" className={cn("tabular-nums", className)}>
        {prefix}
        {display}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {value}
        {suffix}
      </span>
    </>
  );
}
