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

// Design system : accent champagne (--accent) sur toute l'interface. Le vert ne
// signifie que le verdict : --verdict-authentic est réservé aux pixels qui
// affichent un score ou un verdict (carte score flottante, jauge et badge du
// rapport-exemple). Le scanner, lui, reste champagne — capturer n'est pas juger.
// Instrument Serif (font-display) sur h1/h2 uniquement, Manrope partout ailleurs.
// Surfaces opaques : plus de backdrop-filter ni de bordures white/α.

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-line-subtle bg-background">
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
          <div className="flex items-center gap-6">
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
      <section className="relative overflow-hidden pb-16 pt-24 sm:pb-24">
        {/* Halo ambiant unique, très bas en opacité — pas de dégradé coloré */}
        <div
          className="pointer-events-none absolute -top-24 right-0 h-[700px] w-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, hsl(var(--accent) / 0.05) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">

            {/* Left: text */}
            <FadeIn>
              <div>
                <span
                  className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-caption font-medium uppercase"
                  style={{
                    border: "1px solid hsl(var(--accent) / 0.28)",
                    background: "hsl(var(--accent) / 0.08)",
                    color: "hsl(var(--accent))",
                  }}
                >
                  <span className="relative flex size-2">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                      style={{ background: "hsl(var(--accent))" }}
                    />
                    <span
                      className="relative inline-flex size-2 rounded-full"
                      style={{ background: "hsl(var(--accent))" }}
                    />
                  </span>
                  <HeroPoweredByI18n />
                </span>

                <HeroI18n />

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/auth?redirect=%2Fcheck%2Fnew"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-md px-8 text-body font-semibold transition-[background-color,box-shadow]"
                    style={{
                      background: "hsl(var(--accent))",
                      color: "hsl(var(--accent-foreground))",
                      animation:
                        "pulse-glow var(--dur-ambient) ease-in-out infinite",
                    }}
                  >
                    <LandingLabel tkey="hero.analyzeItem" />
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="inline-flex h-12 items-center justify-center rounded-md px-8 text-body font-medium transition-[border-color,color]"
                    style={{
                      border: "1px solid hsl(var(--line-strong))",
                      color: "hsl(var(--muted-foreground))",
                    }}
                  >
                    <LandingLabel tkey="nav.howItWorks" />
                  </Link>
                </div>

                {/* Trust signals */}
                <div className="mt-8 flex flex-wrap gap-6">
                  <HeroTrustTags />
                </div>
              </div>
            </FadeIn>

            {/* Right: scanner visualization */}
            <FadeIn delay={200}>
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                {/* Scanner frame */}
                <div
                  className="relative overflow-hidden rounded-lg border border-line bg-surface"
                  style={{ aspectRatio: "4/5", maxHeight: 460 }}
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
                      background:
                        "linear-gradient(90deg, transparent 0%, hsl(var(--accent)) 20%, hsl(var(--accent)) 80%, transparent 100%)",
                      boxShadow: "0 0 16px hsl(var(--accent) / 0.5)",
                      animation: "scan-line var(--dur-ambient) linear infinite",
                      zIndex: 10,
                    }}
                  />

                  {/* Scanner content — simulated article photo grid */}
                  <div className="absolute inset-0 flex flex-col gap-2 p-6">
                    {/* Header label */}
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className="size-1.5 rounded-full"
                        style={{
                          background: "hsl(var(--accent))",
                          animation:
                            "blink var(--dur-ambient) ease-in-out infinite",
                        }}
                      />
                      <span
                        className="text-[10px] font-medium uppercase tracking-widest"
                        style={{ color: "hsl(var(--accent))" }}
                      >
                        Analyse en cours
                      </span>
                    </div>

                    {/* Photo grid simulation — bilingue */}
                    <div className="grid flex-1 grid-cols-3 gap-2">
                      <MockPhotoGrid />
                    </div>
                  </div>

                  {/* Bottom scan info bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3"
                    style={{
                      background: "hsl(var(--background))",
                      borderTop: "1px solid hsl(var(--line-subtle))",
                    }}
                  >
                    <span
                      className="text-[10px]"
                      style={{ color: "hsl(var(--subtle-foreground))" }}
                    >
                      Nike · Air Jordan 1 Retro High
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: "hsl(var(--accent))" }}
                    >
                      Score en calcul...
                    </span>
                  </div>
                </div>

                {/* Floating score card — affiche un VERDICT : emerald, pas champagne.
                    Le scanner autour reste en champagne : capturer n'est pas juger. */}
                <div
                  className="absolute -bottom-6 -right-4 rounded-lg p-4 shadow-2xl"
                  style={{
                    background: "hsl(var(--surface-raised))",
                    border: "1px solid hsl(var(--verdict-authentic) / 0.28)",
                    animation: "float var(--dur-ambient) ease-in-out infinite",
                    minWidth: 140,
                  }}
                >
                  <p
                    className="text-[10px] font-medium uppercase tracking-widest"
                    style={{ color: "hsl(var(--subtle-foreground))" }}
                  >
                    Score final
                  </p>
                  <p
                    className="mt-1 text-h2 font-semibold tabular-nums"
                    style={{ color: "hsl(var(--verdict-authentic))" }}
                  >
                    89
                    <span
                      className="text-ui font-normal"
                      style={{ color: "hsl(var(--subtle-foreground))" }}
                    >
                      /100
                    </span>
                  </p>
                  <div
                    className="mt-2 flex items-center gap-1.5 rounded-full px-2 py-0.5"
                    style={{ background: "hsl(var(--verdict-authentic) / 0.1)" }}
                  >
                    <CheckCircle2
                      className="size-3"
                      style={{ color: "hsl(var(--verdict-authentic))" }}
                    />
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: "hsl(var(--verdict-authentic))" }}
                    >
                      Probablement authentique
                    </span>
                  </div>
                </div>

                {/* Floating scan point indicators */}
                <div
                  className="absolute -left-3 top-1/3 flex size-6 items-center justify-center rounded-full"
                  style={{
                    background: "hsl(var(--accent) / 0.12)",
                    border: "1px solid hsl(var(--accent) / 0.3)",
                    animation: "blink var(--dur-ambient) ease-in-out infinite",
                  }}
                >
                  <div
                    className="size-2 rounded-full"
                    style={{ background: "hsl(var(--accent))" }}
                  />
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── Vidéo de présentation ── */}
      <section className="border-t border-line-subtle py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase"
              style={{ color: "hsl(var(--accent))" }}
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
                className="w-full max-w-[300px] rounded-lg border border-line-subtle shadow-2xl"
              >
                <source src="/videos/hero-video.mp4" type="video/mp4" />
              </video>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Stats band ── */}
      <section className="border-t border-line-subtle">
        <FadeIn>
          <div className="mx-auto max-w-6xl px-4 py-12">
            <StatsSection />
          </div>
        </FadeIn>
      </section>

      {/* ── Comment ça marche ── */}
      <section
        id="how-it-works"
        className="border-t border-line-subtle py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase"
              style={{ color: "hsl(var(--accent))" }}
            >
              <LandingLabel tkey="landing.labelProcess" />
            </p>
            <HowItWorksI18n />
          </FadeIn>

          <StepsSection />
        </div>
      </section>

      {/* ── Encadré sécurité ── */}
      <section className="border-t border-line-subtle py-12">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn>
            <div
              className="flex flex-col items-center gap-3 rounded-lg px-6 py-6 text-center sm:flex-row sm:text-left"
              style={{
                border: "1px solid hsl(var(--accent) / 0.18)",
                background: "hsl(var(--accent) / 0.05)",
              }}
            >
              <span className="shrink-0 text-h3">🔒</span>
              <p
                className="text-ui"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                <SecurityNoteI18n />
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Exemple de rapport ── */}
      <section className="border-t border-line-subtle py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase"
              style={{ color: "hsl(var(--accent))" }}
            >
              <LandingLabel tkey="landing.labelExample" />
            </p>
            <SectionH2 tkey="landing.reportsTitle" />
            <SectionSub tkey="landing.reportsSubtitle" />
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mx-auto mt-12 max-w-3xl">
              <div
                className="overflow-hidden rounded-lg border border-line bg-surface shadow-2xl"
                style={{
                  boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
                  transform: "perspective(1200px) rotateX(2deg) rotateY(-4deg)",
                }}
              >
                {/* Report header */}
                <div
                  className="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between"
                  style={{ borderBottom: "1px solid hsl(var(--line-subtle))" }}
                >
                  <div>
                    <p
                      className="text-caption font-semibold uppercase"
                      style={{ color: "hsl(var(--subtle-foreground))" }}
                    >
                      Rapport d&apos;analyse · Exemple
                    </p>
                    <p
                      className="mt-0.5 text-lead font-semibold"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      Louis Vuitton Neverfull MM
                    </p>
                    <p
                      className="text-caption"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      Maroquinerie · Sac à main
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 self-start rounded-full px-4 py-1.5 sm:self-auto"
                    style={{
                      border: "1px solid hsl(var(--verdict-authentic) / 0.3)",
                      background: "hsl(var(--verdict-authentic) / 0.1)",
                    }}
                  >
                    <CheckCircle2
                      className="size-3.5"
                      style={{ color: "hsl(var(--verdict-authentic))" }}
                    />
                    <span
                      className="text-caption font-semibold"
                      style={{ color: "hsl(var(--verdict-authentic))" }}
                    >
                      Probablement authentique
                    </span>
                  </div>
                </div>

                {/* Report body */}
                <div className="grid gap-6 p-6 sm:grid-cols-2 sm:gap-8">
                  {/* Left — Gauge + subscores */}
                  <div className="flex flex-col items-center gap-6">
                    <div
                      className="relative flex items-center justify-center"
                      style={{ width: 148, height: 148 }}
                    >
                      <svg width={148} height={148} style={{ transform: "rotate(-90deg)" }}>
                        <circle
                          cx={74} cy={74} r={62}
                          fill="none"
                          stroke="hsl(var(--line))"
                          strokeWidth={12}
                        />
                        <circle
                          cx={74} cy={74} r={62}
                          fill="none"
                          stroke="hsl(var(--verdict-authentic))"
                          strokeWidth={12}
                          strokeLinecap="round"
                          strokeDasharray="389.56"
                          strokeDashoffset="62.33"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                        <span
                          className="text-[40px] font-semibold leading-none tabular-nums"
                          style={{ color: "hsl(var(--verdict-authentic))" }}
                        >
                          84
                        </span>
                        <span
                          className="text-[10px] uppercase tracking-widest"
                          style={{ color: "hsl(var(--subtle-foreground))" }}
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
      <section className="border-t border-line-subtle py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase"
              style={{ color: "hsl(var(--accent))" }}
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
        className="border-t border-line-subtle bg-surface/40 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase"
              style={{ color: "hsl(var(--accent))" }}
            >
              <LandingLabel tkey="landing.labelCatalog" />
            </p>
            <SectionH2 tkey="landing.brandsCategoriesTitle" />
            <SectionSub tkey="landing.brandsCategoriesSubtitle" />
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-caption font-medium"
              style={{
                border: "1px solid hsl(var(--accent) / 0.28)",
                background: "hsl(var(--accent) / 0.08)",
                color: "hsl(var(--accent))",
              }}
            >
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ background: "hsl(var(--accent))" }}
              />
              <LandingLabel tkey="landing.brandsCategoriesCount" />
            </div>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mt-12">
              <BrandSearch />
            </div>
            <div className="mt-8">
              <BrandsTabs />
            </div>
            <p
              className="mt-8 text-center text-ui"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              Une marque manquante ?{" "}
              <a
                href="mailto:legitvision.contact@gmail.com"
                className="transition-colors"
                style={{ color: "hsl(var(--accent))" }}
              >
                Contactez-nous
              </a>{" "}
              pour la demander.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Fonctionnalités ── */}
      <section className="border-t border-line-subtle py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase"
              style={{ color: "hsl(var(--accent))" }}
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
      <section
        id="pricing"
        className="border-t border-line-subtle py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase"
              style={{ color: "hsl(var(--accent))" }}
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
      <section id="faq" className="border-t border-line-subtle py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase"
              style={{ color: "hsl(var(--accent))" }}
            >
              FAQ
            </p>
            <FaqTitleI18n />
          </FadeIn>
          <FadeIn delay={150} className="mt-12">
            <FaqAccordion />
          </FadeIn>
        </div>
      </section>

      {/* ── Qui sommes-nous ── */}
      <section
        id="team"
        className="border-t border-line-subtle bg-surface/40 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-4xl px-4">
          <FadeIn className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase"
              style={{ color: "hsl(var(--accent))" }}
            >
              <LandingLabel tkey="footer.about" />
            </p>
            <SectionH2 tkey="landing.aboutTitle" />
            <p
              className="mx-auto mt-6 max-w-2xl text-body"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <AboutI18n />
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Disclaimer expert ── */}
      <section className="border-t border-line-subtle py-12">
        <div className="mx-auto max-w-3xl px-4">
          <FadeIn>
            <div
              className="rounded-lg px-6 py-6 text-center"
              style={{
                border: "1px solid hsl(var(--accent) / 0.18)",
                background: "hsl(var(--accent) / 0.05)",
              }}
            >
              <ShieldCheck
                className="mx-auto mb-3 size-8"
                style={{ color: "hsl(var(--accent))" }}
              />
              <p
                className="text-ui"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                <ExpertNoteI18n />{" "}
                <span
                  style={{ color: "hsl(var(--foreground))", fontWeight: 500 }}
                >
                  <DisclaimerI18n />
                </span>
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="border-t border-line-subtle py-16 sm:py-24">
        <FadeIn className="mx-auto max-w-6xl px-4 text-center">
          <div
            className="relative overflow-hidden rounded-lg bg-surface px-8 py-16"
            style={{ border: "1px solid hsl(var(--accent) / 0.18)" }}
          >
            {/* Filet lumineux haut */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(var(--accent) / 0.45), transparent)",
              }}
            />

            <BarChart3
              className="mx-auto mb-6 size-10"
              style={{ color: "hsl(var(--accent))" }}
            />
            <FinalCtaI18n />
          </div>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-line-subtle py-12">
        <div className="mx-auto max-w-6xl px-4">
          {/* Maillage interne SEO : liens vers les hubs d'authentification */}
          <div className="mb-8 flex justify-center sm:justify-start">
            <FooterSeoLinksI18n />
          </div>
          <div
            className="flex flex-col items-center gap-6 border-t pt-8 sm:flex-row sm:justify-between"
            style={{ borderColor: "hsl(var(--line-subtle))" }}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/images/legitvision-logo.png"
                alt="LegitVision"
                width={90}
                height={24}
                className="h-6 w-auto"
              />
              <span
                className="text-ui"
                style={{ color: "hsl(var(--subtle-foreground))" }}
              >
                © {new Date().getFullYear()}
              </span>
            </div>
            <div
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-ui sm:justify-end"
              style={{ color: "hsl(var(--subtle-foreground))" }}
            >
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
