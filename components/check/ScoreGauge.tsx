"use client";

import { useEffect, useState } from "react";

import { getScoreColor, getScoreHsl } from "@/lib/types";

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 220 }: ScoreGaugeProps) {
  const [displayed, setDisplayed] = useState(0);

  const sw = 14;
  const r = (size - sw * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const dur = 1400;

    const frame = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
      setDisplayed(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const dashoffset = circ * (1 - displayed / 100);

  return (
    <div
      className="relative mx-auto flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="hsl(var(--surface-raised))"
          strokeWidth={sw}
        />
        {/* Colored arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={getScoreHsl(score)}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashoffset}
          style={{ filter: `drop-shadow(0 0 10px ${getScoreHsl(score, 0.4)})` }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span
          className={`font-heading tabular-nums font-bold leading-none ${getScoreColor(score)}`}
          style={{ fontSize: Math.round(size * 0.27) }}
        >
          {displayed}
        </span>
        <span className="text-caption uppercase tracking-widest text-muted-foreground">
          sur 100
        </span>
      </div>
    </div>
  );
}
