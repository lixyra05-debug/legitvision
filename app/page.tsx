import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { FadeIn } from "@/components/layout/FadeIn";
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { FAQ_ITEMS } from "@/components/landing/faq-data";
import { BrandSearch } from "@/components/landing/BrandSearch";
import { BrandsTabs } from "@/components/landing/BrandsTabs";
import {
  HeroI18n,
  DisclaimerI18n,
  FooterLinksI18n,
  FooterSeoLinksI18n,
  HowItWorksI18n,
  FaqTitleI18n,
  FinalCtaI18n,
} from "@/components/landing/LandingI18nClient";
import {
  StepsSection,
  StatsSection,
  TestimonialsSection,
  FeaturesSection,
  PlansSection,
  LandingLabel,
  SecurityNoteI18n,
  SectionH2,
  SectionSub,
  NavLinks,
  HeroTrustTags,
  AboutI18n,
  SmallCtaI18n,
  MockPhotoGrid,
  MockSubscores,
  MockFindings,
} from "@/components/landing/LandingSectionsClient";
import {
  HeroPoweredByI18n,
  ExpertNoteI18n,
} from "@/components/landing/LandingI18nClient";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title:
    "Authentification sneakers, sacs & luxe par IA — 30 secondes, 3,99 €",
  description:
    "Scannez vos articles de luxe avant d'acheter. IA Vision, 8 zones d'authentification analysées, score de confiance en moins de 30 secondes. Sneakers, sacs, vêtements. À partir de 3,99 €.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "LegitVision — Scannez avant d'acheter.",
    description:
      "1 paire sur 4 est une contrefaçon. Vérifiez l'authenticité de vos articles de luxe par IA en 30 secondes, pour 3,99 €.",
    url: SITE_URL,
    type: "website",
    // images fournies par app/opengraph-image.tsx (file convention).
  },
  twitter: {
    card: "summary_large_image",
    title: "LegitVision — Scannez avant d'acheter.",
    description:
      "Authentification d'articles de luxe par IA. 3,99 € / scan, 30 secondes, 8 zones analysées.",
    // twitter:image retombe automatiquement sur openGraph.images (next/og).
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Authentification d'articles de luxe par IA",
  provider: { "@id": `${SITE_URL}/#organization` },
  areaServed: { "@type": "Country", name: "France" },
  description:
    "Vérification d'authenticité par IA Vision pour sneakers, sacs et vêtements de luxe. Analyse de 8 zones d'authentification en moins de 30 secondes.",
  offers: {
    "@type": "Offer",
    price: "3.99",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
    url: `${SITE_URL}/auth?redirect=%2Fcheck%2Fnew`,
  },
};

// Arrays statiques FR remplacés par composants client i18n :
// → StepsSection, StatsSection, TestimonialsSection, PlansSection
// (cf. components/landing/LandingSectionsClient.tsx)

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* ── Navigation ── */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: "rgba(10, 10, 11, 0.75)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/legitvision-logo.png"
              alt="LegitVision"
              width={240}
              height={64}
              className="h-16 w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-6 md:flex">
              <NavLinks />
            </nav>
            <LanguageToggle />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pb-20 pt-24 sm:pb-32 sm:pt-36">
        {/* Ambient emerald glow */}
        <div
          className="pointer-events-none absolute -top-20 right-0 h-[700px] w-[700px] rounded-full"
          style={{ background: "radial-gradient(circle at 70% 30%, rgba(16,185,129,0.08) 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

            {/* Left: text */}
            <FadeIn>
              <div>
                <span
                  className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest"
                  style={{
                    border: "1px solid rgba(16,185,129,0.2)",
                    background: "rgba(16,185,129,0.06)",
                    color: "#10B981",
                  }}
                >
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <HeroPoweredByI18n />
                </span>

                <HeroI18n />

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/auth?redirect=%2Fcheck%2Fnew"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-8 text-base font-semibold text-white transition-all"
                    style={{
                      background: "#10B981",
                      animation: "pulse-glow 3s ease-in-out infinite",
                    }}
                  >
                    <LandingLabel tkey="hero.analyzeItem" />
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="inline-flex h-12 items-center justify-center rounded-xl px-8 text-base font-medium transition-all"
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <LandingLabel tkey="nav.howItWorks" />
                  </Link>
                </div>

                {/* Trust signals */}
                <div className="mt-8 flex flex-wrap gap-5">
                  <HeroTrustTags />
                </div>
              </div>
            </FadeIn>

            {/* Right: scanner visualization */}
            <FadeIn delay={200}>
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                {/* Scanner frame */}
                <div
                  className="relative overflow-hidden rounded-2xl"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    aspectRatio: "4/5",
                    maxHeight: 460,
                  }}
                >
                  {/* Viewfinder corners */}
                  <div className="corner-tl" />
                  <div className="corner-tr" />
                  <div className="corner-bl" />
                  <div className="corner-br" />

                  {/* Animated scan line */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      height: 2,
                      background: "linear-gradient(90deg, transparent 0%, #10B981 20%, #10B981 80%, transparent 100%)",
                      boxShadow: "0 0 16px rgba(16,185,129,0.6), 0 0 32px rgba(16,185,129,0.3)",
                      animation: "scan-line 3s linear infinite",
                      zIndex: 10,
                    }}
                  />

                  {/* Scanner content — simulated article photo grid */}
                  <div className="absolute inset-0 flex flex-col gap-2 p-6">
                    {/* Header label */}
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="size-1.5 rounded-full"
                        style={{ background: "#10B981", animation: "blink 1.5s ease-in-out infinite" }}
                      />
                      <span
                        className="text-[10px] font-medium uppercase tracking-widest"
                        style={{ color: "#10B981" }}
                      >
                        Analyse en cours
                      </span>
                    </div>

                    {/* Photo grid simulation — bilingue */}
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      <MockPhotoGrid />
                    </div>
                  </div>

                  {/* Bottom scan info bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-3"
                    style={{
                      background: "rgba(10,10,11,0.8)",
                      backdropFilter: "blur(10px)",
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      Nike · Air Jordan 1 Retro High
                    </span>
                    <span className="text-[10px]" style={{ color: "#10B981" }}>
                      Score en calcul...
                    </span>
                  </div>
                </div>

                {/* Floating score card */}
                <div
                  className="absolute -bottom-6 -right-4 rounded-2xl p-4 shadow-2xl"
                  style={{
                    background: "rgba(20, 20, 22, 0.85)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    animation: "float 4s ease-in-out infinite",
                    minWidth: 140,
                  }}
                >
                  <p className="text-[9px] font-medium uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
                    Score final
                  </p>
                  <p className="mt-1 font-heading text-3xl font-bold" style={{ color: "#10B981" }}>
                    89
                    <span className="text-sm font-normal" style={{ color: "var(--text-tertiary)" }}>/100</span>
                  </p>
                  <div
                    className="mt-2 flex items-center gap-1.5 rounded-full px-2 py-0.5"
                    style={{ background: "rgba(16,185,129,0.1)" }}
                  >
                    <CheckCircle2 className="size-3 text-emerald-500" />
                    <span className="text-[10px] font-semibold text-emerald-400">Probablement authentique</span>
                  </div>
                </div>

                {/* Floating scan point indicators */}
                <div
                  className="absolute -left-3 top-1/3 size-6 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    animation: "blink 2s ease-in-out infinite",
                  }}
                >
                  <div className="size-2 rounded-full bg-emerald-500" />
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── Vidéo de présentation ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "80px 0" }}>
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "#10B981" }}
            >
              <LandingLabel tkey="landing.videoLabel" />
            </p>
            <SectionH2 tkey="landing.videoTitle" />
            <SectionSub tkey="landing.videoSubtitle" />
          </FadeIn>
          <FadeIn delay={150}>
            <div className="mt-12 flex justify-center">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster="/images/hero-poster.webp"
                className="w-full max-w-[300px] rounded-2xl border border-white/5 shadow-2xl shadow-emerald-500/10"
              >
                <source src="/videos/hero-video.mp4" type="video/mp4" />
              </video>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Stats band ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "0" }}>
        <FadeIn>
          <div
            className="mx-auto max-w-6xl px-4 py-10"
          >
            <StatsSection />
          </div>
        </FadeIn>
      </section>

      {/* ── Comment ça marche ── */}
      <section id="how-it-works" style={{ borderTop: "1px solid var(--border-subtle)", padding: "80px 0" }}>
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "#10B981" }}
            >
              <LandingLabel tkey="landing.labelProcess" />
            </p>
            <HowItWorksI18n />
          </FadeIn>

          <StepsSection />
        </div>
      </section>

      {/* ── Encadré sécurité ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "40px 0" }}>
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn>
            <div
              className="flex flex-col items-center gap-3 rounded-2xl px-6 py-5 text-center sm:flex-row sm:text-left"
              style={{
                border: "1px solid rgba(16,185,129,0.12)",
                background: "rgba(16,185,129,0.04)",
              }}
            >
              <span className="shrink-0 text-2xl">🔒</span>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <SecurityNoteI18n />
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Exemple de rapport ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "80px 0" }}>
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "#10B981" }}
            >
              <LandingLabel tkey="landing.labelExample" />
            </p>
            <SectionH2 tkey="landing.reportsTitle" />
            <SectionSub tkey="landing.reportsSubtitle" />
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mx-auto mt-14 max-w-3xl">
              <div
                className="overflow-hidden rounded-2xl shadow-2xl"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                  transform: "perspective(1200px) rotateX(2deg) rotateY(-4deg)",
                }}
              >
                {/* Report header */}
                <div
                  className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <div>
                    <p
                      className="text-[10px] font-semibold uppercase tracking-widest"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Rapport d&apos;analyse · Exemple
                    </p>
                    <p
                      className="mt-0.5 font-heading text-lg font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Louis Vuitton Neverfull MM
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Maroquinerie · Sac à main</p>
                  </div>
                  <div
                    className="flex items-center gap-2 self-start rounded-full px-4 py-1.5 sm:self-auto"
                    style={{
                      border: "1px solid rgba(16,185,129,0.25)",
                      background: "rgba(16,185,129,0.08)",
                    }}
                  >
                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">
                      Probablement authentique
                    </span>
                  </div>
                </div>

                {/* Report body */}
                <div className="grid gap-6 p-6 sm:grid-cols-2 sm:gap-8">
                  {/* Left — Gauge + subscores */}
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative flex items-center justify-center" style={{ width: 148, height: 148 }}>
                      <svg width={148} height={148} style={{ transform: "rotate(-90deg)" }}>
                        <circle
                          cx={74} cy={74} r={62}
                          fill="none"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth={12}
                        />
                        <circle
                          cx={74} cy={74} r={62}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth={12}
                          strokeLinecap="round"
                          strokeDasharray="389.56"
                          strokeDashoffset="62.33"
                          style={{ filter: "drop-shadow(0 0 14px rgba(16, 185, 129, 0.6))" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                        <span
                          className="font-heading text-[40px] font-bold leading-none tabular-nums"
                          style={{ color: "#10B981" }}
                        >
                          84
                        </span>
                        <span
                          className="text-[10px] uppercase tracking-widest"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          sur 100
                        </span>
                      </div>
                    </div>

                    {/* Subscores — bilingue */}
                    <div className="w-full space-y-3">
                      <MockSubscores />
                    </div>
                  </div>

                  {/* Right — Findings — bilingue */}
                  <div className="flex flex-col gap-3">
                    <MockFindings />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <SmallCtaI18n />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Témoignages ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "80px 0" }}>
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "#10B981" }}
            >
              <LandingLabel tkey="landing.labelTestimonials" />
            </p>
            <SectionH2 tkey="landing.testimonialsMainTitle" />
            <SectionSub tkey="landing.testimonialsMainSubtitle" />
          </FadeIn>

          <TestimonialsSection />
        </div>
      </section>

      {/* ── Marques et catégories ── */}
      <section
        id="brands"
        style={{
          borderTop: "1px solid var(--border-subtle)",
          background: "rgba(255,255,255,0.012)",
          padding: "80px 0",
        }}
      >
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "#10B981" }}
            >
              <LandingLabel tkey="landing.labelCatalog" />
            </p>
            <SectionH2 tkey="landing.brandsCategoriesTitle" />
            <SectionSub tkey="landing.brandsCategoriesSubtitle" />
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
              style={{
                border: "1px solid rgba(16,185,129,0.2)",
                background: "rgba(16,185,129,0.06)",
                color: "#10B981",
              }}
            >
              <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
              <LandingLabel tkey="landing.brandsCategoriesCount" />
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mt-10">
              <BrandSearch />
            </div>
            <div className="mt-8">
              <BrandsTabs />
            </div>
            <p className="mt-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
              Une marque manquante ?{" "}
              <a
                href="mailto:legitvision.contact@gmail.com"
                className="transition-colors"
                style={{ color: "#10B981" }}
              >
                Contactez-nous
              </a>{" "}
              pour la demander.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Fonctionnalités ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "80px 0" }}>
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "#10B981" }}
            >
              <LandingLabel tkey="landing.labelFeatures" />
            </p>
            <SectionH2 tkey="landing.featuresMainTitle" />
            <SectionSub tkey="landing.featuresMainSubtitle" />
          </FadeIn>

          <FeaturesSection />
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ borderTop: "1px solid var(--border-subtle)", padding: "80px 0" }}>
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "#10B981" }}
            >
              <LandingLabel tkey="landing.labelPricing" />
            </p>
            <SectionH2 tkey="landing.pricingMainTitle" />
            <SectionSub tkey="landing.pricingMainSubtitle" />
          </FadeIn>

          <PlansSection />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ borderTop: "1px solid var(--border-subtle)", padding: "80px 0" }}>
        <div className="mx-auto max-w-3xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "#10B981" }}
            >
              FAQ
            </p>
            <FaqTitleI18n />
          </FadeIn>
          <FadeIn delay={150} className="mt-10">
            <FaqAccordion />
          </FadeIn>
        </div>
      </section>

      {/* ── Qui sommes-nous ── */}
      <section
        id="team"
        style={{
          borderTop: "1px solid var(--border-subtle)",
          background: "rgba(255,255,255,0.012)",
          padding: "80px 0",
        }}
      >
        <div className="mx-auto max-w-4xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-[11px] font-medium uppercase tracking-widest"
              style={{ color: "#10B981" }}
            >
              <LandingLabel tkey="footer.about" />
            </p>
            <SectionH2 tkey="landing.aboutTitle" />
            <p
              className="mx-auto mt-5 max-w-2xl"
              style={{ color: "var(--text-secondary)" }}
            >
              <AboutI18n />
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Disclaimer expert ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "56px 0" }}>
        <div className="mx-auto max-w-3xl px-4">
          <FadeIn>
            <div
              className="rounded-2xl px-6 py-6 text-center"
              style={{
                border: "1px solid rgba(212,168,67,0.2)",
                background: "rgba(212,168,67,0.04)",
              }}
            >
              <ShieldCheck className="mx-auto mb-3 size-8" style={{ color: "#D4A843" }} />
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                <ExpertNoteI18n />{" "}
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                  <DisclaimerI18n />
                </span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "80px 0" }}>
        <FadeIn className="mx-auto max-w-6xl px-4 text-center">
          <div
            className="relative overflow-hidden rounded-3xl px-8 py-16"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.15) 0%, rgba(10,10,11,0) 70%), var(--bg-card)",
              border: "1px solid rgba(16,185,129,0.12)",
            }}
          >
            {/* Ambient glow */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)" }}
            />

            <BarChart3 className="mx-auto mb-6 size-10 text-emerald-500" />
            <FinalCtaI18n />
          </div>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "40px 0" }}>
        <div className="mx-auto max-w-6xl px-4">
          {/* Maillage interne SEO : liens vers les hubs d'authentification */}
          <div className="mb-8 flex justify-center sm:justify-start">
            <FooterSeoLinksI18n />
          </div>
          <div
            className="flex flex-col items-center gap-6 border-t pt-8 sm:flex-row sm:justify-between"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/images/legitvision-logo.png"
                alt="LegitVision"
                width={90}
                height={24}
                className="h-6 w-auto"
              />
              <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                © {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm sm:justify-end" style={{ color: "var(--text-tertiary)" }}>
              <Link href="#faq" className="transition-colors hover:text-foreground">FAQ</Link>
              <Link href="#team" className="transition-colors hover:text-foreground">À propos</Link>
              <FooterLinksI18n />
              <a href="mailto:legitvision.contact@gmail.com" className="transition-colors hover:text-foreground">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
