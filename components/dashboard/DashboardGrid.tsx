"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Scan,
  Trash2,
  ArrowRight,
  CheckCircle2,
  Zap,
  Crown,
} from "lucide-react";
import { getStatusLabel, type AnalysisWithDetails, type Profile } from "@/lib/types";

// ── Constants ────────────────────────────────────────────────────────────────

const DELETABLE_STATUSES = ["failed", "uploading", "pending"];

const PLAN_CONFIG: Record<string, { label: string; price: string; color: string; icon: React.ReactNode }> = {
  free: { label: "GRATUIT", price: "Sans abonnement", color: "#555558", icon: null },
  pro: { label: "PRO", price: "19,99€/mois", color: "#10B981", icon: <Zap className="size-4" /> },
  business: { label: "BUSINESS", price: "29,99€/mois", color: "#D4A843", icon: <Crown className="size-4" /> },
};

const PLAN_MAX: Record<string, number> = { free: 5, pro: 10, business: 50 };

const GAUGE_R = 50;
const GAUGE_CIRC = 2 * Math.PI * GAUGE_R; // ≈ 314.16

const MINI_R = 15;
const MINI_CIRC = 2 * Math.PI * MINI_R; // ≈ 94.25

// ── Utilities ────────────────────────────────────────────────────────────────

function scoreColor(s: number | null): string {
  if (s == null) return "#555558";
  if (s >= 90) return "#10B981";
  if (s >= 70) return "#EAB308";
  if (s >= 50) return "#F97316";
  return "#EF4444";
}

function scoreBg(s: number | null): string {
  if (s == null) return "rgba(85,85,88,0.12)";
  if (s >= 90) return "rgba(16,185,129,0.12)";
  if (s >= 70) return "rgba(234,179,8,0.12)";
  if (s >= 50) return "rgba(249,115,22,0.12)";
  return "rgba(239,68,68,0.12)";
}

function relDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (min < 2) return "à l'instant";
  if (min < 60) return `il y a ${min}min`;
  if (h < 24) return `il y a ${h}h`;
  if (d === 1) return "hier";
  if (d < 7) return `il y a ${d}j`;
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function brandInitials(name: string): string {
  return name.split(/[\s-]+/).map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase();
}

function brandHue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h % 360);
}

function generateSparkline(analyses: AnalysisWithDetails[], w = 64, h = 24): string {
  const now = Date.now();
  const counts = Array.from({ length: 7 }, (_, i) => {
    const s = now - (6 - i) * 86400000;
    const e = s + 86400000;
    return analyses.filter((a) => {
      const t = new Date(a.created_at).getTime();
      return t >= s && t < e;
    }).length;
  });
  const max = Math.max(...counts, 1);
  return counts
    .map((c, i) => `${(i / 6) * w},${h - (c / max) * h}`)
    .join(" ");
}

// ── Hooks ────────────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1400): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let cur = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration]);
  return count;
}

// ── Framer-motion variants ────────────────────────────────────────────────────

const gridVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const cellVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

// ── Shared glass card style ───────────────────────────────────────────────────

const glass: React.CSSProperties = {
  background: "rgba(20,20,22,0.65)",
  backdropFilter: "blur(20px) saturate(150%)",
  WebkitBackdropFilter: "blur(20px) saturate(150%)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 20,
  padding: 24,
  height: "100%",
};

// ── Widget label ─────────────────────────────────────────────────────────────

function WidgetLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: "#555558", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
      {children}
    </p>
  );
}

// ── Mini score circle (40×40 SVG) ────────────────────────────────────────────

function MiniScoreCircle({ score }: { score: number | null }) {
  const ratio = score != null ? Math.min(1, score / 100) : 0;
  const offset = MINI_CIRC * (1 - ratio);
  const col = scoreColor(score);

  return (
    <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
      <svg width={40} height={40} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={20} cy={20} r={MINI_R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4} />
        <circle
          cx={20} cy={20} r={MINI_R} fill="none"
          stroke={col} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={MINI_CIRC}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 4px ${col}80)` }}
        />
      </svg>
      {score != null && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: col, fontFamily: "var(--font-space-grotesk)", lineHeight: 1 }}>
            {score}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface DashboardGridProps {
  profile: Profile | null;
  analyses: AnalysisWithDetails[];
  firstName: string;
  deleteActions: Record<string, () => Promise<void>>;
}

// ── Main Component ────────────────────────────────────────────────────────────

export function DashboardGrid({ profile, analyses, firstName, deleteActions }: DashboardGridProps) {
  const plan = (profile?.subscription_plan as string) ?? "free";
  const credits = profile?.credits_remaining ?? 0;
  const maxCredits = Math.max(PLAN_MAX[plan] ?? 5, credits);
  const planConfig = PLAN_CONFIG[plan] ?? PLAN_CONFIG.free;

  // ── Computed stats ──
  const totalAnalyses = analyses.length;
  const scored = analyses.filter((a) => a.overall_score != null);
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((s, a) => s + (a.overall_score ?? 0), 0) / scored.length)
    : null;

  const brandCounts: Record<string, number> = {};
  analyses.forEach((a) => { brandCounts[a.brand_name] = (brandCounts[a.brand_name] ?? 0) + 1; });
  const [topBrandName, topBrandCount] = Object.entries(brandCounts).sort((a, b) => b[1] - a[1])[0] ?? ["—", 0];

  const recentBrands: { name: string; slug: string }[] = [];
  const seen = new Set<string>();
  for (const a of analyses) {
    if (!seen.has(a.brand_name)) {
      seen.add(a.brand_name);
      recentBrands.push({ name: a.brand_name, slug: a.brand_slug });
      if (recentBrands.length >= 6) break;
    }
  }

  const lastAnalysis = analyses[0] ?? null;
  const lastActivity = analyses[0]?.created_at ?? null;

  const sparklinePts = generateSparkline(analyses);

  // ── Credits gauge state ──
  const [dashOffset, setDashOffset] = useState(GAUGE_CIRC);
  useEffect(() => {
    const ratio = credits / maxCredits;
    const t = setTimeout(() => setDashOffset(GAUGE_CIRC * (1 - Math.min(1, ratio))), 400);
    return () => clearTimeout(t);
  }, [credits, maxCredits]);

  const creditCount = useCountUp(credits);
  const totalCount = useCountUp(totalAnalyses);
  const avgCount = useCountUp(avgScore ?? 0);

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.1 }}>
            Bonjour, {firstName} 👋
          </h1>
          <p style={{ marginTop: 6, fontSize: 14, color: "var(--text-secondary)" }}>
            {totalAnalyses === 0
              ? "Prêt à vérifier votre premier article ?"
              : `${totalAnalyses} analyse${totalAnalyses > 1 ? "s" : ""} effectuée${totalAnalyses > 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/check/new"
          className="inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition-all hover:shadow-lg"
          style={{ background: "#10B981", animation: "pulse-glow 3s ease-in-out infinite", alignSelf: "flex-start" }}
        >
          <Scan className="size-4" />
          Nouvelle analyse
        </Link>
      </div>

      {/* ── Bento Grid ── */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "minmax(180px, auto)",
          gap: 16,
        }}
        className="bento-grid"
      >

        {/* ── 1. Credits Widget ── */}
        <motion.div variants={cellVariants} style={{ gridColumn: "1 / 2", gridRow: "1 / 2" }} className="bento-cell-credits">
          <div style={{ ...glass, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <WidgetLabel>Crédits</WidgetLabel>

            {/* Gauge */}
            <div style={{ position: "relative", width: 120, height: 120 }}>
              {/* Particles */}
              {[
                { top: "8%",  left: "50%",  delay: "0s" },
                { top: "25%", left: "90%",  delay: "0.4s" },
                { top: "70%", left: "88%",  delay: "0.8s" },
                { top: "88%", left: "50%",  delay: "1.2s" },
                { top: "70%", left: "12%",  delay: "1.6s" },
                { top: "25%", left: "10%",  delay: "2s" },
              ].map((p, i) => (
                <span
                  key={i}
                  style={{
                    position: "absolute",
                    top: p.top,
                    left: p.left,
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#10B981",
                    animation: `float-particle 3s ease-in-out ${p.delay} infinite`,
                    zIndex: 10,
                  }}
                />
              ))}

              {/* SVG Gauge */}
              <svg width={120} height={120} style={{ transform: "rotate(-90deg)", position: "absolute", inset: 0 }}>
                {/* Track */}
                <circle cx={60} cy={60} r={GAUGE_R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
                {/* Progress */}
                <circle
                  cx={60} cy={60} r={GAUGE_R}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth={8}
                  strokeLinecap="round"
                  strokeDasharray={GAUGE_CIRC}
                  strokeDashoffset={dashOffset}
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(16,185,129,0.6))",
                    transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)",
                  }}
                />
              </svg>

              {/* Center label */}
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 34, fontWeight: 700, color: "#10B981", lineHeight: 1 }}>
                  {creditCount}
                </span>
                <span style={{ fontSize: 11, color: "#8A8A8E", fontWeight: 300 }}>restants</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 2. Plan Widget ── */}
        <motion.div variants={cellVariants} style={{ gridColumn: "2 / 3", gridRow: "1 / 2" }} className="bento-cell-plan">
          <div style={{ ...glass, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <WidgetLabel>Plan actif</WidgetLabel>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
              {/* Plan name */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: planConfig.color, display: "flex" }}>{planConfig.icon}</span>
                <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 26, fontWeight: 700, color: planConfig.color, lineHeight: 1 }}>
                  {planConfig.label}
                </span>
              </div>

              {/* Badge or Upgrade */}
              {plan !== "free" ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 9999, background: `${planConfig.color}12`, border: `1px solid ${planConfig.color}30`, width: "fit-content" }}>
                  <CheckCircle2 style={{ width: 12, height: 12, color: planConfig.color }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: planConfig.color }}>ACTIF</span>
                </div>
              ) : (
                <Link
                  href="/checkout?plan=pro"
                  className="inline-flex items-center gap-1.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
                  style={{ padding: "8px 16px", background: "#10B981", animation: "pulse-glow 3s ease-in-out infinite", width: "fit-content" }}
                >
                  <Zap className="size-3.5" />
                  Upgrade
                </Link>
              )}
            </div>

            {/* Price */}
            <p style={{ fontSize: 13, color: "#8A8A8E", fontWeight: 300 }}>{planConfig.price}</p>
          </div>
        </motion.div>

        {/* ── 3. Last Analysis Widget ── */}
        <motion.div variants={cellVariants} style={{ gridColumn: "3 / 5", gridRow: "1 / 2" }} className="bento-cell-last">
          <div style={{ ...glass, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <WidgetLabel>Dernière analyse</WidgetLabel>

            {lastAnalysis ? (
              <Link href={`/check/${lastAnalysis.id}`} style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none" }}>
                {/* Brand avatar */}
                <div style={{
                  width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                  background: `hsl(${brandHue(lastAnalysis.brand_name)},55%,25%)`,
                  border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 16, fontWeight: 700, color: `hsl(${brandHue(lastAnalysis.brand_name)},55%,75%)` }}>
                    {brandInitials(lastAnalysis.brand_name)}
                  </span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {lastAnalysis.brand_name} · {lastAnalysis.model_name}
                  </p>
                  <p style={{ marginTop: 4, fontSize: 12, color: "#555558", fontWeight: 300 }}>
                    {relDate(lastAnalysis.created_at)}
                  </p>
                  {lastAnalysis.variant_selected && (
                    <span style={{ display: "inline-block", marginTop: 6, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 9999, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#8A8A8E" }}>
                      {lastAnalysis.variant_selected}
                    </span>
                  )}
                </div>

                {/* Score circle */}
                <MiniScoreCircle score={lastAnalysis.overall_score} />
              </Link>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <p style={{ fontSize: 14, color: "#555558" }}>Aucune analyse</p>
                <Link
                  href="/check/new"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 12, background: "#10B981", fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none" }}
                >
                  Lancer une analyse <ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── 4. History Widget ── */}
        <motion.div variants={cellVariants} style={{ gridColumn: "1 / 3", gridRow: "2 / 4" }} className="bento-cell-history">
          <div style={{ ...glass, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <WidgetLabel>Historique</WidgetLabel>
              <span style={{ fontSize: 11, color: "#555558", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9999, padding: "2px 10px" }}>
                ({totalAnalyses})
              </span>
            </div>

            {analyses.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                {/* Minimal empty state illustration */}
                <svg width={56} height={56} viewBox="0 0 56 56" fill="none">
                  <circle cx={28} cy={28} r={27} stroke="rgba(255,255,255,0.05)" strokeWidth={1.5} strokeDasharray="4 3" />
                  <circle cx={28} cy={28} r={16} stroke="rgba(16,185,129,0.15)" strokeWidth={1.5} />
                  <line x1={28} y1={18} x2={28} y2={28} stroke="#10B981" strokeWidth={1.5} strokeLinecap="round" />
                  <circle cx={28} cy={28} r={2} fill="#10B981" />
                </svg>
                <p style={{ fontSize: 13, color: "#555558" }}>Aucune analyse pour le moment</p>
              </div>
            ) : (
              <div className="history-scroll" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                {analyses.map((a) => {
                  const isDeletable = DELETABLE_STATUSES.includes(a.status);
                  const deleteAction = deleteActions[a.id];
                  const col = scoreColor(a.overall_score);
                  const bg = scoreBg(a.overall_score);

                  return (
                    <div
                      key={a.id}
                      style={{
                        position: "relative",
                        borderRadius: 12,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.04)",
                        borderLeft: `3px solid ${col}`,
                        overflow: "hidden",
                        transition: "background 0.2s, border-color 0.2s",
                      }}
                    >
                      <Link
                        href={`/check/${a.id}`}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", textDecoration: "none" }}
                      >
                        {/* Brand avatar */}
                        <div style={{
                          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                          background: `hsl(${brandHue(a.brand_name)},55%,20%)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 11, fontWeight: 700, color: `hsl(${brandHue(a.brand_name)},55%,70%)` }}>
                            {brandInitials(a.brand_name)}
                          </span>
                        </div>

                        {/* Labels */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {a.brand_name} · {a.model_name}
                          </p>
                          <p style={{ fontSize: 11, color: "#555558", marginTop: 2 }}>
                            {relDate(a.created_at)}
                          </p>
                        </div>

                        {/* Score badge or status */}
                        {a.overall_score != null ? (
                          <span style={{ fontSize: 11, fontWeight: 700, color: col, background: bg, borderRadius: 9999, padding: "3px 9px", flexShrink: 0 }}>
                            {a.overall_score}
                          </span>
                        ) : (
                          <span style={{ fontSize: 10, color: "#8A8A8E", background: "rgba(255,255,255,0.04)", borderRadius: 9999, padding: "3px 9px", flexShrink: 0 }}>
                            {getStatusLabel(a.status)}
                          </span>
                        )}
                      </Link>

                      {/* Delete button for stuck analyses */}
                      {isDeletable && deleteAction && (
                        <form action={deleteAction} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}>
                          <button
                            type="submit"
                            title="Supprimer"
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "#555558" }}
                          >
                            <Trash2 style={{ width: 13, height: 13 }} />
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── 5. Stats Widget ── */}
        <motion.div variants={cellVariants} style={{ gridColumn: "3 / 5", gridRow: "2 / 4" }} className="bento-cell-stats">
          <div style={{ ...glass, display: "flex", flexDirection: "column" }}>
            <WidgetLabel>Stats rapides</WidgetLabel>

            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12 }}>

              {/* Stat 1 — Total analyses */}
              <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ fontSize: 10, color: "#555558", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Analyses</p>
                  <BarChart3 style={{ width: 18, height: 18, color: "#10B981", opacity: 0.7 }} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 34, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
                    {totalCount}
                  </p>
                  {/* Sparkline */}
                  <svg width={64} height={24} style={{ marginTop: 8, display: "block" }}>
                    <polyline
                      points={sparklinePts}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={0.7}
                    />
                  </svg>
                </div>
              </div>

              {/* Stat 2 — Avg score */}
              <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ fontSize: 10, color: "#555558", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Score moyen</p>
                  <TrendingUp style={{ width: 18, height: 18, color: "#10B981", opacity: 0.7 }} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 34, fontWeight: 700, color: avgScore != null ? scoreColor(avgScore) : "#555558", lineHeight: 1 }}>
                    {avgScore != null ? avgCount : "—"}
                  </p>
                  {/* Progress bar */}
                  <div style={{ marginTop: 8, height: 4, borderRadius: 9999, background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                    <div style={{
                      height: 4, borderRadius: 9999,
                      width: avgScore != null ? `${avgScore}%` : "0%",
                      background: `linear-gradient(90deg, ${scoreColor(avgScore)}, ${scoreColor(avgScore)}cc)`,
                      boxShadow: avgScore != null ? `0 0 8px ${scoreColor(avgScore)}60` : "none",
                      transition: "width 1.5s cubic-bezier(0.16,1,0.3,1)",
                    }} />
                  </div>
                </div>
              </div>

              {/* Stat 3 — Top brand */}
              <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <p style={{ fontSize: 10, color: "#555558", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Top marque</p>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `hsl(${brandHue(topBrandName)},55%,22%)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--font-space-grotesk)", color: `hsl(${brandHue(topBrandName)},55%,70%)` }}>
                        {topBrandName !== "—" ? brandInitials(topBrandName) : "—"}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 16, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {topBrandName}
                    </p>
                  </div>
                  {topBrandCount > 0 && (
                    <p style={{ marginTop: 8, fontSize: 12, color: "#8A8A8E" }}>{topBrandCount} scan{topBrandCount > 1 ? "s" : ""}</p>
                  )}
                </div>
              </div>

              {/* Stat 4 — Last activity */}
              <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)", padding: 16, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ fontSize: 10, color: "#555558", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Activité</p>
                  <Clock style={{ width: 18, height: 18, color: "#10B981", opacity: 0.7 }} />
                </div>
                <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 18, fontWeight: 500, color: "var(--text-primary)" }}>
                  {lastActivity ? relDate(lastActivity) : "Aucune"}
                </p>
              </div>

            </div>
          </div>
        </motion.div>

        {/* ── 6. New Analysis CTA Widget ── */}
        <motion.div variants={cellVariants} style={{ gridColumn: "1 / 3", gridRow: "4 / 5" }} className="bento-cell-cta">
          <div style={{
            ...glass,
            background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))",
            border: "1px solid rgba(16,185,129,0.15)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 12,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top border light streak */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.4), transparent)" }} />

            <div>
              <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>
                NOUVELLE ANALYSE
              </p>
              <p style={{ marginTop: 6, fontSize: 14, color: "#8A8A8E", fontWeight: 300 }}>
                Vérifiez l&apos;authenticité de votre article
              </p>
            </div>

            <Link
              href="/check/new"
              className="group inline-flex items-center gap-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
              style={{ padding: "10px 20px", background: "#10B981", width: "fit-content", animation: "pulse-glow 3s ease-in-out infinite" }}
            >
              <Scan className="size-4" />
              Commencer
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* ── 7. Recent Brands Widget ── */}
        <motion.div variants={cellVariants} style={{ gridColumn: "3 / 5", gridRow: "4 / 5" }} className="bento-cell-brands">
          <div style={{ ...glass, display: "flex", flexDirection: "column" }}>
            <WidgetLabel>Marques récentes</WidgetLabel>

            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {/* Filled brand circles */}
                {recentBrands.map((b) => (
                  <Link
                    key={b.name}
                    href={`/check/new?brand=${encodeURIComponent(b.name)}`}
                    title={b.name}
                    style={{ textDecoration: "none" }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: `hsl(${brandHue(b.name)},55%,22%)`,
                      border: `1px solid hsl(${brandHue(b.name)},55%,35%)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "transform 0.2s",
                      cursor: "pointer",
                    }}>
                      <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 13, fontWeight: 700, color: `hsl(${brandHue(b.name)},55%,75%)` }}>
                        {brandInitials(b.name)}
                      </span>
                    </div>
                  </Link>
                ))}

                {/* Empty placeholder circles */}
                {Array.from({ length: Math.max(0, 6 - recentBrands.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    style={{
                      width: 44, height: 44, borderRadius: "50%",
                      border: "1px dashed rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 16, color: "rgba(255,255,255,0.05)" }}>+</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>

      {/* ── Mobile responsive override via <style> ── */}
      <style>{`
        @media (max-width: 768px) {
          .bento-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: auto !important;
          }
          .bento-cell-credits  { grid-column: 1 !important; grid-row: auto !important; }
          .bento-cell-plan     { grid-column: 1 !important; grid-row: auto !important; }
          .bento-cell-last     { grid-column: 1 !important; grid-row: auto !important; }
          .bento-cell-cta      { grid-column: 1 !important; grid-row: auto !important; }
          .bento-cell-history  { grid-column: 1 !important; grid-row: auto !important; }
          .bento-cell-stats    { grid-column: 1 !important; grid-row: auto !important; }
          .bento-cell-brands   { grid-column: 1 !important; grid-row: auto !important; }
        }
        @media (max-width: 768px) {
          .bento-grid .glass-blur-reduced {
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
          }
          span[style*="float-particle"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
