"use client";

import { useEffect, useState } from "react";

const COLOR_MAP = {
  emerald: {
    stroke: "#10b981",
    glow: "rgba(16, 185, 129, 0.4)",
    text: "text-emerald-500",
  },
  yellow: {
    stroke: "#eab308",
    glow: "rgba(234, 179, 8, 0.4)",
    text: "text-yellow-500",
  },
  orange: {
    stroke: "#f97316",
    glow: "rgba(249, 115, 22, 0.4)",
    text: "text-orange-500",
  },
  red: {
    stroke: "#ef4444",
    glow: "rgba(239, 68, 68, 0.4)",
    text: "text-red-500",
  },
} as const;

type ColorVariant = keyof typeof COLOR_MAP;

function colorVariant(score: number): ColorVariant {
  if (score >= 90) return "emerald";
  if (score >= 70) return "yellow";
  if (score >= 50) return "orange";
  return "red";
}

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 220 }: ScoreGaugeProps) {
  const [displayed, setDisplayed] = useState(0);
  const variant = colorVariant(score);
  const { stroke, glow, text } = COLOR_MAP[variant];

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
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={sw}
        />
        {/* Colored arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashoffset}
          style={{ filter: `drop-shadow(0 0 10px ${glow})` }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span
          className={`font-heading tabular-nums font-bold leading-none ${text}`}
          style={{ fontSize: Math.round(size * 0.27) }}
        >
          {displayed}
        </span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          sur 100
        </span>
      </div>
    </div>
  );
}
