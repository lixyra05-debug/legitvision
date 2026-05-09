"use client";

import Link from "next/link";
import {
  Camera,
  Cpu,
  FileCheck,
  Eye,
  Zap,
  FileText,
  ShieldCheck,
  Star,
  Check,
} from "lucide-react";
import { FadeIn } from "@/components/layout/FadeIn";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

/**
 * 5 sections client de la landing — i18n FR/EN.
 * Reproduction visuelle EXACTE des arrays statiques de app/page.tsx (Phase 5
 * de la refonte i18n). Charte Dark Premium préservée : tokens CSS variables,
 * accent emerald-500 + premium gold (#D4A843) sur Premium card, glassmorphism,
 * staggered FadeIn animations, hover lift, viewfinder corners cohérents.
 */

// ── 1. STEPS — Comment ça marche ────────────────────────────────────────────
const STEP_DEFS = [
  { icon: Camera, step: "01", titleKey: "landing.step1Title", descKey: "landing.step1Desc" },
  { icon: Cpu, step: "02", titleKey: "landing.step2Title", descKey: "landing.step2Desc" },
  { icon: FileCheck, step: "03", titleKey: "landing.step3Title", descKey: "landing.step3Desc" },
];

export function StepsSection() {
  const { t } = useTranslation();
  return (
    <div className="mt-16 grid gap-6 sm:grid-cols-3">
      {STEP_DEFS.map((step, i) => (
        <FadeIn key={step.step} delay={i * 120}>
          <div
            className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/15"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <span
              className="pointer-events-none absolute -right-2 -top-4 select-none font-heading text-[72px] font-bold leading-none"
              style={{ color: "rgba(255,255,255,0.03)" }}
            >
              {step.step}
            </span>
            <div
              className="mb-5 flex size-12 items-center justify-center rounded-xl"
              style={{ background: "rgba(16,185,129,0.1)" }}
            >
              <step.icon className="size-6 text-emerald-500" />
            </div>
            <div
              className="mb-3 text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "#10B981" }}
            >
              {t("landing.stepLabel")} {step.step}
            </div>
            <h3
              className="font-heading text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {t(step.titleKey)}
            </h3>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t(step.descKey)}
            </p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

// ── 2. STATS — Bandeau métriques ────────────────────────────────────────────
const STAT_DEFS = [
  { valueKey: "landing.stat1Value", labelKey: "landing.stat1Label" },
  { valueKey: "landing.stat2Value", labelKey: "landing.stat2Label" },
  { valueKey: "landing.stat3Value", labelKey: "landing.stat3Label" },
  { valueKey: "landing.stat4Value", labelKey: "landing.stat4Label" },
];

export function StatsSection() {
  const { t } = useTranslation();
  return (
    <div
      className="grid grid-cols-2 gap-0 overflow-hidden rounded-2xl sm:grid-cols-4"
      style={{
        background: "var(--bg-glass)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--border-glass)",
      }}
    >
      {STAT_DEFS.map((stat, i) => (
        <div
          key={stat.labelKey}
          className="flex flex-col items-center py-8"
          style={{
            borderRight:
              i < STAT_DEFS.length - 1 ? "1px solid var(--border-subtle)" : "none",
          }}
        >
          <span
            className="font-heading text-2xl font-bold sm:text-3xl"
            style={{ color: "#10B981" }}
          >
            {t(stat.valueKey)}
          </span>
          <span
            className="mt-1.5 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {t(stat.labelKey)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── 3. TESTIMONIALS ─────────────────────────────────────────────────────────
const TESTIMONIAL_DEFS = [
  {
    initials: "S.M.",
    name: "Sarah M.",
    stars: 5,
    quoteKey: "landing.testimonial1Quote",
    roleKey: "landing.testimonial1Role",
    cityKey: "landing.testimonial1City",
  },
  {
    initials: "K.B.",
    name: "Kevin B.",
    stars: 5,
    quoteKey: "landing.testimonial2Quote",
    roleKey: "landing.testimonial2Role",
    cityKey: "landing.testimonial2City",
  },
  {
    initials: "L.D.",
    name: "Laura D.",
    stars: 4,
    quoteKey: "landing.testimonial3Quote",
    roleKey: "landing.testimonial3Role",
    cityKey: "landing.testimonial3City",
  },
];

export function TestimonialsSection() {
  const { t } = useTranslation();
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-3">
      {TESTIMONIAL_DEFS.map((tm, i) => (
        <FadeIn key={tm.name} delay={i * 120}>
          <div
            className="flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div className="flex items-center justify-between">
              <div
                className="flex size-10 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}
              >
                <span
                  className="font-heading text-sm font-bold"
                  style={{ color: "#10B981" }}
                >
                  {tm.initials}
                </span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: tm.stars }).map((_, j) => (
                  <Star
                    key={j}
                    className="size-3.5"
                    style={{ fill: "#D4A843", color: "#D4A843" }}
                  />
                ))}
                {Array.from({ length: 5 - tm.stars }).map((_, j) => (
                  <Star
                    key={`e${j}`}
                    className="size-3.5"
                    style={{ color: "rgba(255,255,255,0.1)" }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-5 flex-1">
              <div
                className="mb-2 font-heading text-3xl leading-none select-none"
                style={{ color: "rgba(16,185,129,0.15)" }}
              >
                &ldquo;
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {t(tm.quoteKey)}
              </p>
            </div>
            <div
              className="mt-5 pt-5"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {tm.name}
              </p>
              <p
                className="mt-0.5 text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                {t(tm.roleKey)} · {t(tm.cityKey)}
              </p>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

// ── 4. FEATURES — 4 cards ───────────────────────────────────────────────────
const FEATURE_DEFS = [
  {
    icon: Eye,
    titleKey: "landing.feature1Title",
    descKey: "landing.feature1Desc",
    tagKey: "landing.feature1Tag",
    highlight: true,
  },
  {
    icon: Zap,
    titleKey: "landing.feature2Title",
    descKey: "landing.feature2Desc",
    tagKey: "landing.feature2Tag",
    highlight: false,
  },
  {
    icon: FileText,
    titleKey: "landing.feature3Title",
    descKey: "landing.feature3Desc",
    tagKey: "landing.feature3Tag",
    highlight: false,
  },
  {
    icon: ShieldCheck,
    titleKey: "landing.feature4Title",
    descKey: "landing.feature4Desc",
    tagKey: "landing.feature4Tag",
    highlight: false,
  },
];

export function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <div className="mt-16 grid gap-5 sm:grid-cols-2">
      {FEATURE_DEFS.map((feat, i) => (
        <FadeIn key={feat.titleKey} delay={i * 80}>
          <div
            className={`group relative flex h-full flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
              !feat.highlight ? "hover:border-emerald-500/15" : ""
            }`}
            style={{
              background: feat.highlight
                ? "rgba(16,185,129,0.04)"
                : "var(--bg-card)",
              border: feat.highlight
                ? "1px solid rgba(16,185,129,0.2)"
                : "1px solid var(--border-subtle)",
            }}
          >
            <div
              className="mb-5 flex size-14 items-center justify-center rounded-2xl"
              style={{ background: "rgba(16,185,129,0.1)" }}
            >
              <feat.icon className="size-7 text-emerald-500" />
            </div>
            <h3
              className="font-heading text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {t(feat.titleKey)}
            </h3>
            <p
              className="mt-3 flex-1 text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t(feat.descKey)}
            </p>
            <div className="mt-6">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  color: "#10B981",
                }}
              >
                {t(feat.tagKey)}
              </span>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

// ── 5. PLANS — 3 pricing cards (single / pro / premium) ────────────────────
type PlanTier = "single" | "pro" | "premium";

const PLAN_DEFS: {
  tier: PlanTier;
  popular: boolean;
  premium: boolean;
  href: string;
  features: string[]; // i18n keys (suffix)
}[] = [
  {
    tier: "single",
    popular: false,
    premium: false,
    href: "/checkout?plan=single",
    features: ["feature1", "feature2", "feature3"],
  },
  {
    tier: "pro",
    popular: true,
    premium: false,
    href: "/checkout?plan=pro",
    features: ["feature1", "feature2", "feature3", "feature4"],
  },
  {
    tier: "premium",
    popular: false,
    premium: true,
    href: "/checkout?plan=business",
    features: ["feature1", "feature2", "feature3", "feature4", "feature5"],
  },
];

export function PlansSection() {
  const { t } = useTranslation();
  return (
    <div className="mt-16 grid gap-6 sm:grid-cols-3">
      {PLAN_DEFS.map((plan, i) => {
        const name = t(`plans.${plan.tier}.name`);
        const price = t(`plans.${plan.tier}.price`);
        const period = t(`plans.${plan.tier}.period`);
        const description = t(`plans.${plan.tier}.description`);
        const credits = t(`plans.${plan.tier}.credits`);
        const cta = t(`plans.${plan.tier}.cta`);
        const badge = t(`plans.${plan.tier}.badge`);

        if (plan.premium) {
          return (
            <FadeIn key={plan.tier} delay={i * 120}>
              <div
                className="relative rounded-2xl p-[1.5px] shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(180,130,50,0.5), rgba(230,180,60,0.2), rgba(180,130,50,0.5))",
                  boxShadow: "0 20px 60px rgba(180,130,50,0.15)",
                }}
              >
                <div
                  className="relative flex flex-col rounded-2xl p-8"
                  style={{ background: "var(--bg-card)" }}
                >
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-bold text-black shadow-lg"
                    style={{
                      background: "linear-gradient(90deg, #D4A843, #F0C040)",
                    }}
                  >
                    ⭐ {badge}
                  </span>
                  <h3
                    className="font-heading text-lg font-semibold"
                    style={{ color: "#D4A843" }}
                  >
                    {name}
                  </h3>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {description}
                  </p>
                  <div className="mt-6">
                    <span
                      className="font-heading text-4xl font-bold"
                      style={{ color: "#D4A843" }}
                    >
                      {price}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {period}
                    </span>
                  </div>
                  <div
                    className="mt-2 text-sm font-medium"
                    style={{ color: "#D4A843" }}
                  >
                    {credits}
                  </div>
                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((featKey) => (
                      <li
                        key={featKey}
                        className="flex items-start gap-3 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0"
                          style={{ color: "#D4A843" }}
                        />
                        {t(`plans.${plan.tier}.${featKey}`)}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      href={plan.href}
                      className="inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold text-black transition-all hover:shadow-lg"
                      style={{
                        background: "linear-gradient(90deg, #D4A843, #F0C040)",
                      }}
                    >
                      {cta}
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          );
        }

        return (
          <FadeIn key={plan.tier} delay={i * 120}>
            <div
              className="relative flex flex-col rounded-2xl p-8 transition-all duration-300"
              style={{
                background: plan.popular
                  ? "rgba(16,185,129,0.04)"
                  : "var(--bg-card)",
                border: plan.popular
                  ? "1px solid rgba(16,185,129,0.35)"
                  : "1px solid var(--border-subtle)",
                boxShadow: plan.popular
                  ? "0 0 40px rgba(16,185,129,0.08)"
                  : "none",
              }}
            >
              {plan.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white"
                  style={{ background: "#10B981" }}
                >
                  {badge}
                </span>
              )}
              <h3
                className="font-heading text-lg font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {name}
              </h3>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {description}
              </p>
              <div className="mt-6">
                <span
                  className="font-heading text-4xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {price}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {period}
                </span>
              </div>
              <div className="mt-2 text-sm font-medium text-emerald-400">
                {credits}
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((featKey) => (
                  <li
                    key={featKey}
                    className="flex items-start gap-3 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                    {t(`plans.${plan.tier}.${featKey}`)}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href={plan.href}
                  className="inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition-all hover:shadow-lg"
                  style={
                    plan.popular
                      ? {
                          background: "#10B981",
                          color: "#fff",
                          animation: "pulse-glow 3s ease-in-out infinite",
                        }
                      : {
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "var(--text-primary)",
                          background: "transparent",
                        }
                  }
                >
                  {cta}
                </Link>
              </div>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}

// ── Petits labels uppercase au-dessus des H2 + securityNote ────────────────
export function LandingLabel({ tkey }: { tkey: string }) {
  const { t } = useTranslation();
  return <>{t(tkey)}</>;
}

// ── Navbar links bilingues ─────────────────────────────────────────────────
const NAV_LINKS = [
  { href: "#how-it-works", tkey: "nav.howItWorks" },
  { href: "#brands", tkey: "nav.brands" },
  { href: "#faq", tkey: "nav.faq" },
  { href: "#pricing", tkey: "nav.pricing" },
];

export function NavLinks() {
  const { t } = useTranslation();
  return (
    <>
      {NAV_LINKS.map(({ href, tkey }) => (
        <Link
          key={href}
          href={href}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t(tkey)}
        </Link>
      ))}
    </>
  );
}

// ── Hero trust signals (3 tags) ────────────────────────────────────────────
const HERO_TAGS = [
  "hero.tagFastResult",
  "hero.tagGdpr",
  "hero.tagEu",
];

export function HeroTrustTags() {
  const { t } = useTranslation();
  return (
    <>
      {HERO_TAGS.map((tkey) => (
        <span
          key={tkey}
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--text-tertiary)" }}
        >
          <Check className="size-3 text-emerald-500" />
          {t(tkey)}
        </span>
      ))}
    </>
  );
}

// ── Section about LYXIRIA ──────────────────────────────────────────────────
export function AboutI18n() {
  const { t } = useTranslation();
  return <>{t("landing.aboutBody")}</>;
}

// ── Mock report simulation (visuel marketing) ─────────────────────────────
const MOCK_PHOTO_ZONES = [
  { tkey: "landing.mockZone1", progress: 94 },
  { tkey: "landing.mockZone2", progress: 88 },
  { tkey: "landing.mockZone3", progress: 91 },
  { tkey: "landing.mockZone4", progress: 85 },
  { tkey: "landing.mockZone5", progress: 90 },
  { tkey: "landing.mockZone6", progress: 87 },
];

export function MockPhotoGrid() {
  const { t } = useTranslation();
  return (
    <>
      {MOCK_PHOTO_ZONES.map((zone, i) => (
        <div
          key={zone.tkey}
          className="flex flex-col items-center justify-end rounded-lg p-2"
          style={{
            background:
              i === 1 ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.025)",
            border:
              i === 1
                ? "1px solid rgba(16,185,129,0.2)"
                : "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="mb-1.5 h-1 w-full rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-1 rounded-full"
              style={{
                width: `${zone.progress}%`,
                background:
                  zone.progress >= 90
                    ? "#10B981"
                    : zone.progress >= 80
                      ? "#10B981"
                      : "#10B981",
              }}
            />
          </div>
          <span
            className="text-[10px]"
            style={{ color: "var(--text-tertiary)" }}
          >
            {t(zone.tkey)}
          </span>
        </div>
      ))}
    </>
  );
}

const MOCK_SUBSCORES = [
  { tkey: "landing.mockSubscore1", score: 90 },
  { tkey: "landing.mockSubscore2", score: 85 },
  { tkey: "landing.mockSubscore3", score: 90 },
  { tkey: "landing.mockSubscore4", score: 85 },
];

export function MockSubscores() {
  const { t } = useTranslation();
  return (
    <>
      {MOCK_SUBSCORES.map((s) => (
        <div key={s.tkey}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span style={{ color: "var(--text-secondary)" }}>{t(s.tkey)}</span>
            <span
              className="tabular-nums font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {s.score}/100
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${s.score}%`,
                background: "linear-gradient(90deg, #059669, #10B981)",
                boxShadow: "0 0 8px rgba(16,185,129,0.4)",
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}

const MOCK_FINDINGS = [
  {
    zoneKey: "landing.mockSubscore1",
    score: 90,
    obsKey: "landing.mockObs1",
  },
  {
    zoneKey: "landing.mockSubscore2",
    score: 85,
    obsKey: "landing.mockObs2",
  },
  {
    zoneKey: "landing.mockSubscore4",
    score: 85,
    obsKey: "landing.mockObs3",
  },
];

export function MockFindings() {
  const { t } = useTranslation();
  return (
    <>
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--text-tertiary)" }}
      >
        {t("landing.mockObservations")}
      </p>
      {MOCK_FINDINGS.map((f) => (
        <div
          key={f.zoneKey}
          className="rounded-xl p-4"
          style={{
            borderLeft: "2px solid #10B981",
            background: "rgba(16,185,129,0.04)",
            border: "none",
            borderLeftWidth: 2,
            borderLeftStyle: "solid",
            borderLeftColor: "#10B981",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {t(f.zoneKey)}
            </span>
            <span
              className="tabular-nums text-xs font-medium"
              style={{ color: "#10B981" }}
            >
              {f.score}/100
            </span>
          </div>
          <p
            className="mt-2 text-xs leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {t(f.obsKey)}
          </p>
        </div>
      ))}
    </>
  );
}

export function MockOutOf() {
  const { t } = useTranslation();
  return <>{t("landing.mockOutOf")}</>;
}

// ── Petite CTA "Vérifiez votre prochain article" ───────────────────────────
export function SmallCtaI18n() {
  const { t } = useTranslation();
  return (
    <>
      <Link
        href="/auth?redirect=%2Fcheck%2Fnew"
        className="group inline-flex h-11 items-center gap-2 rounded-xl px-7 text-sm font-semibold text-white transition-all hover:shadow-lg"
        style={{ background: "#10B981" }}
      >
        {t("landing.smallCtaTitle")}
      </Link>
      <p className="mt-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
        {t("landing.smallCtaNote")}
      </p>
    </>
  );
}

export function SecurityNoteI18n() {
  const { t } = useTranslation();
  return (
    <>
      <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
        {t("landing.securityNoteHighlight")}
      </span>{" "}
      {t("landing.securityNoteRest")}
    </>
  );
}

export function SectionH2({ tkey }: { tkey: string }) {
  const { t } = useTranslation();
  return (
    <h2
      className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
      style={{ color: "var(--text-primary)" }}
    >
      {t(tkey)}
    </h2>
  );
}

export function SectionSub({ tkey }: { tkey: string }) {
  const { t } = useTranslation();
  return (
    <p
      className="mt-4"
      style={{ color: "var(--text-secondary)" }}
    >
      {t(tkey)}
    </p>
  );
}
