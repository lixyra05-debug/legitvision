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
import { Counter } from "./Counter";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

/**
 * 5 sections client de la landing — i18n FR/EN.
 *
 * Design system : l'emerald de marque, DOSÉ. Il ne porte que ce qui se clique ou
 * ce qui signale un état : CTA des forfaits, badges et bordure des plans mis en
 * avant, verdicts du rapport-exemple. Tout le reste — icônes d'étape, valeurs de
 * stats, avatars, étoiles, tags de fonctionnalité, puces de liste — passe aux
 * neutres. Étaler le vert sur le décor annulerait le seul signal qui vaut de
 * l'argent. Le gold #D4A843 de la carte Premium reste absorbé.
 *
 * Bordures opaques (--line-*), et bordures portées par des classes Tailwind et non
 * plus par un `border:` inline — le raccourci inline écrasait les `hover:border-*`,
 * qui n'ont donc jamais fonctionné.
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
            className="group relative overflow-hidden rounded-lg border border-line-subtle bg-surface p-8 transition-[transform,border-color] duration-base hover:-translate-y-1 hover:border-line"
          >
            <span
              className="pointer-events-none absolute -right-2 -top-4 select-none font-heading text-[72px] font-bold leading-none"
              style={{ color: "hsl(var(--line-strong) / 0.5)" }}
            >
              {step.step}
            </span>
            <div
              className="mb-6 flex size-12 items-center justify-center rounded-md"
              style={{ background: "hsl(var(--surface-raised))" }}
            >
              <step.icon className="size-6" style={{ color: "hsl(var(--muted-foreground))" }} />
            </div>
            <div
              className="mb-3 text-caption font-semibold uppercase"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {t("landing.stepLabel")} {step.step}
            </div>
            <h3
              className="font-heading text-h4 font-semibold"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {t(step.titleKey)}
            </h3>
            <p
              className="mt-3 text-ui"
              style={{ color: "hsl(var(--muted-foreground))" }}
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
// Les valeurs vivent dans le code : ce sont des nombres, ils ne se traduisent pas.
// Seuls les libellés restent en i18n. Les 8 clés statNValue ont donc disparu.
const STAT_DEFS: {
  value: number;
  prefix?: string;
  suffix?: string;
  labelKey: string;
}[] = [
  { value: 47, labelKey: "landing.stat1Label" },
  { value: 340, suffix: "+", labelKey: "landing.stat2Label" },
  { value: 8, labelKey: "landing.stat3Label" },
  { value: 30, prefix: "< ", suffix: "s", labelKey: "landing.stat4Label" },
];

export function StatsSection() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-lg border border-line-subtle bg-surface sm:grid-cols-4">
      {STAT_DEFS.map((stat, i) => (
        <div
          key={stat.labelKey}
          className="flex flex-col items-center py-8"
          style={{
            borderRight:
              i < STAT_DEFS.length - 1
                ? "1px solid hsl(var(--line-subtle))"
                : "none",
          }}
        >
          <Counter
            value={stat.value}
            prefix={stat.prefix}
            suffix={stat.suffix}
            className="font-heading text-h3 font-bold"
          />
          <span
            className="mt-2 text-caption"
            style={{ color: "hsl(var(--muted-foreground))" }}
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
          <div className="flex h-full flex-col rounded-lg border border-line-subtle bg-surface p-6 transition-[transform,border-color] duration-base hover:-translate-y-1 hover:border-line">
            <div className="flex items-center justify-between">
              <div
                className="flex size-10 items-center justify-center rounded-md"
                style={{
                  background: "hsl(var(--surface-raised))",
                  border: "1px solid hsl(var(--line))",
                }}
              >
                <span
                  className="font-heading text-ui font-bold"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {tm.initials}
                </span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: tm.stars }).map((_, j) => (
                  <Star
                    key={j}
                    className="size-3.5"
                    style={{
                      fill: "hsl(var(--foreground))",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                ))}
                {Array.from({ length: 5 - tm.stars }).map((_, j) => (
                  <Star
                    key={`e${j}`}
                    className="size-3.5"
                    style={{ color: "hsl(var(--line-strong))" }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6 flex-1">
              <div
                className="mb-2 select-none font-heading text-h2 leading-none"
                style={{ color: "hsl(var(--line-strong))" }}
              >
                &ldquo;
              </div>
              <p
                className="text-ui"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {t(tm.quoteKey)}
              </p>
            </div>
            <div
              className="mt-6 pt-6"
              style={{ borderTop: "1px solid hsl(var(--line-subtle))" }}
            >
              <p
                className="text-ui font-semibold"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {tm.name}
              </p>
              <p
                className="mt-0.5 text-caption text-subtle"
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
    <div className="mt-16 grid gap-6 sm:grid-cols-2">
      {FEATURE_DEFS.map((feat, i) => (
        <FadeIn key={feat.titleKey} delay={i * 80}>
          <div
            className={`group relative flex h-full flex-col rounded-lg border p-8 transition-[transform,border-color] duration-base hover:-translate-y-1 ${
              feat.highlight
                ? "border-line bg-surface-raised"
                : "border-line-subtle bg-surface hover:border-line"
            }`}
          >
            <div
              className="mb-6 flex size-14 items-center justify-center rounded-lg"
              style={{ background: "hsl(var(--surface-raised))" }}
            >
              <feat.icon className="size-7" style={{ color: "hsl(var(--muted-foreground))" }} />
            </div>
            <h3
              className="font-heading text-h4 font-semibold"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {t(feat.titleKey)}
            </h3>
            <p
              className="mt-3 flex-1 text-ui"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {t(feat.descKey)}
            </p>
            <div className="mt-6">
              <span
                className="rounded-full px-3 py-1 text-caption font-semibold"
                style={{
                  background: "hsl(var(--surface-raised))",
                  color: "hsl(var(--muted-foreground))",
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
          // Carte Premium : le dégradé or est remplacé par une bordure pleine
          // à l'accent — un seul ton, aucun dégradé.
          return (
            <FadeIn key={plan.tier} delay={i * 120}>
              <div
                className="relative flex h-full flex-col rounded-lg bg-surface p-8"
                style={{ border: "1px solid hsl(var(--accent) / 0.55)" }}
              >
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-caption font-bold"
                  style={{
                    background: "hsl(var(--accent))",
                    color: "hsl(var(--accent-foreground))",
                  }}
                >
                  {badge}
                </span>
                <h3
                  className="font-heading text-lead font-semibold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {name}
                </h3>
                <p
                  className="mt-1 text-ui"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {description}
                </p>
                <div className="mt-6">
                  <span
                    className="font-heading text-h1 font-bold"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {price}
                  </span>
                  <span
                    className="text-ui"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    {period}
                  </span>
                </div>
                <div
                  className="mt-2 text-ui font-medium"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {credits}
                </div>
                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((featKey) => (
                    <li
                      key={featKey}
                      className="flex items-start gap-3 text-ui"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      />
                      {t(`plans.${plan.tier}.${featKey}`)}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href={plan.href}
                    className="inline-flex h-11 w-full items-center justify-center rounded-md text-ui font-semibold transition-[background-color,box-shadow] hover:shadow-lg"
                    style={{
                      background: "hsl(var(--accent))",
                      color: "hsl(var(--accent-foreground))",
                    }}
                  >
                    {cta}
                  </Link>
                </div>
              </div>
            </FadeIn>
          );
        }

        return (
          <FadeIn key={plan.tier} delay={i * 120}>
            <div
              className={`relative flex h-full flex-col rounded-lg border p-8 transition-[border-color] duration-base ${
                plan.popular
                  ? "border-accent/35 bg-accent/[0.05]"
                  : "border-line-subtle bg-surface"
              }`}
            >
              {plan.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-caption font-semibold"
                  style={{
                    background: "hsl(var(--accent))",
                    color: "hsl(var(--accent-foreground))",
                  }}
                >
                  {badge}
                </span>
              )}
              <h3
                className="font-heading text-lead font-semibold"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {name}
              </h3>
              <p
                className="mt-1 text-ui"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {description}
              </p>
              <div className="mt-6">
                <span
                  className="font-heading text-h1 font-bold"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {price}
                </span>
                <span
                  className="text-ui"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {period}
                </span>
              </div>
              <div
                className="mt-2 text-ui font-medium"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {credits}
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((featKey) => (
                  <li
                    key={featKey}
                    className="flex items-start gap-3 text-ui"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    />
                    {t(`plans.${plan.tier}.${featKey}`)}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href={plan.href}
                  className="inline-flex h-11 w-full items-center justify-center rounded-md text-ui font-semibold transition-[background-color,border-color,box-shadow] hover:shadow-lg"
                  style={
                    plan.popular
                      ? {
                          background: "hsl(var(--accent))",
                          color: "hsl(var(--accent-foreground))",
                          animation:
                            "pulse-glow var(--dur-ambient) ease-in-out infinite",
                        }
                      : {
                          border: "1px solid hsl(var(--line-strong))",
                          color: "hsl(var(--foreground))",
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
          className="text-ui text-muted-foreground transition-colors hover:text-foreground"
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
          className="flex items-center gap-1.5 text-caption text-subtle"
        >
          <Check className="size-3" style={{ color: "hsl(var(--muted-foreground))" }} />
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
          className="flex flex-col items-center justify-end rounded-sm p-2"
          style={{
            background:
              i === 1
                ? "hsl(var(--surface-raised))"
                : "hsl(var(--surface))",
            border:
              i === 1
                ? "1px solid hsl(var(--line-strong))"
                : "1px solid hsl(var(--line-subtle))",
          }}
        >
          <div
            className="mb-1.5 h-1 w-full overflow-hidden rounded-full"
            style={{ background: "hsl(var(--line))" }}
          >
            <div
              className="h-1 rounded-full"
              style={{
                width: `${zone.progress}%`,
                background: "hsl(var(--muted-foreground))",
              }}
            />
          </div>
          <span
            className="text-[10px] text-subtle"
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
          <div className="mb-1.5 flex items-center justify-between text-caption">
            <span style={{ color: "hsl(var(--muted-foreground))" }}>
              {t(s.tkey)}
            </span>
            <span
              className="font-medium tabular-nums"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {s.score}/100
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: "hsl(var(--line))" }}
          >
            <div
              className="h-1.5 rounded-full"
              style={{
                width: `${s.score}%`,
                background: "hsl(var(--verdict-authentic))",
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
        className="text-caption font-semibold uppercase text-subtle"
      >
        {t("landing.mockObservations")}
      </p>
      {MOCK_FINDINGS.map((f) => (
        <div
          key={f.zoneKey}
          className="rounded-md p-4"
          style={{
            background: "hsl(var(--verdict-authentic) / 0.05)",
            borderLeft: "2px solid hsl(var(--verdict-authentic))",
          }}
        >
          <div className="flex items-center justify-between">
            <span
              className="text-caption font-semibold"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {t(f.zoneKey)}
            </span>
            <span
              className="text-caption font-medium tabular-nums"
              style={{ color: "hsl(var(--verdict-authentic))" }}
            >
              {f.score}/100
            </span>
          </div>
          <p
            className="mt-2 text-caption"
            style={{ color: "hsl(var(--muted-foreground))" }}
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
        className="group inline-flex h-11 items-center gap-2 rounded-md px-8 text-ui font-semibold transition-[background-color,box-shadow] hover:shadow-lg"
        style={{
          background: "hsl(var(--accent))",
          color: "hsl(var(--accent-foreground))",
        }}
      >
        {t("landing.smallCtaTitle")}
      </Link>
      <p
        className="mt-3 text-caption text-subtle"
      >
        {t("landing.smallCtaNote")}
      </p>
    </>
  );
}

export function SecurityNoteI18n() {
  const { t } = useTranslation();
  return (
    <>
      <span style={{ color: "hsl(var(--foreground))", fontWeight: 600 }}>
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
      className="font-heading text-h2 font-bold"
      style={{ color: "hsl(var(--foreground))" }}
    >
      {t(tkey)}
    </h2>
  );
}

export function SectionSub({ tkey }: { tkey: string }) {
  const { t } = useTranslation();
  return (
    <p className="mt-4 text-body" style={{ color: "hsl(var(--muted-foreground))" }}>
      {t(tkey)}
    </p>
  );
}
