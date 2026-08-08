import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { FAQ_ITEMS } from "@/components/landing/faq-data";
import { BrandSearch } from "@/components/landing/BrandSearch";
import { BrandsTabs } from "@/components/landing/BrandsTabs";
import { AuthenticityCompare } from "@/components/landing/AuthenticityCompare";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ScrollExpandMedia } from "@/components/landing/ScrollExpandMedia";
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

// Design system : l'emerald de marque, DOSÉ. Il ne porte que les CTA principaux,
// les liens, les états actifs (scanner en cours, point live) et les verdicts.
// Tout le décoratif — labels de section, encadrés, badges, icônes secondaires —
// passe aux neutres. Inter pour le corps, Space Grotesk pour les titres.
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

      {/* ── Hero ──
          Le texte devient l'en-tête de la ContainerScroll (il remonte au scroll),
          et la carte 3D qui se redresse contient le comparateur. Le mouvement
          amène, puis rend la main : la poignée ne devient active qu'une fois la
          carte posée — sa géométrie inclinée fausserait le calcul de position. */}
      <section className="relative overflow-hidden">
        <ContainerScroll
          titleComponent={
            <div className="px-4">
              <span
                className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-caption font-medium uppercase"
                style={{
                  border: "1px solid hsl(var(--line))",
                  background: "hsl(var(--surface))",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                <span className="relative flex size-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                    style={{ background: "hsl(var(--line-strong))" }}
                  />
                  <span
                    className="relative inline-flex size-2 rounded-full"
                    style={{ background: "hsl(var(--accent))" }}
                  />
                </span>
                <HeroPoweredByI18n />
              </span>

              <HeroI18n />

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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

              <div className="mt-8 flex flex-wrap justify-center gap-6">
                <HeroTrustTags />
              </div>

              <p className="mt-8 text-caption text-muted-foreground">
                Faites glisser la poignée. Vous ne verrez pas la différence — l&apos;IA, si.
              </p>
            </div>
          }
        >
          <AuthenticityCompare className="h-full" />
        </ContainerScroll>
      </section>

      {/* ── Stats band ── */}
      <section className="border-t border-line-subtle">
        <Reveal>
          <div className="mx-auto max-w-6xl px-4 py-12">
            <StatsSection />
          </div>
        </Reveal>
      </section>

      {/* ── Comment ça marche ── */}
      <section
        id="how-it-works"
        className="border-t border-line-subtle py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase text-muted-foreground"
            >
              <LandingLabel tkey="landing.labelProcess" />
            </p>
            <HowItWorksI18n />
          </Reveal>

          <StepsSection />
        </div>
      </section>

      {/* ── Encadré sécurité ── */}
      <section className="border-t border-line-subtle py-12">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div
              className="flex flex-col items-center gap-3 rounded-lg px-6 py-6 text-center sm:flex-row sm:text-left"
              style={{
                border: "1px solid hsl(var(--line))",
                background: "hsl(var(--surface))",
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
          </Reveal>
        </div>
      </section>

      {/* ── Vidéo de présentation ──
          Remontée entre le hero et le rapport-exemple, et enveloppée dans
          ScrollExpandMedia : le média grandit à mesure qu'on descend, sans que le
          scroll soit détourné. Le cadre est plafonné à max-w-3xl — la source fait
          600 px de large depuis le ré-encodage, l'étirer en pleine largeur la
          rendrait floue. */}
      <section className="border-t border-line-subtle py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <p className="mb-3 text-caption font-medium uppercase text-muted-foreground">
              <LandingLabel tkey="landing.videoLabel" />
            </p>
            <SectionH2 tkey="landing.videoTitle" />
            <SectionSub tkey="landing.videoSubtitle" />
          </Reveal>
          <ScrollExpandMedia className="mt-12 flex justify-center">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/images/hero-poster.webp"
              className="w-full max-w-3xl rounded-lg border border-line-subtle shadow-card"
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
          </ScrollExpandMedia>
        </div>
      </section>

      {/* ── Exemple de rapport ── */}
      <section className="border-t border-line-subtle py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase text-muted-foreground"
            >
              <LandingLabel tkey="landing.labelExample" />
            </p>
            <SectionH2 tkey="landing.reportsTitle" />
            <SectionSub tkey="landing.reportsSubtitle" />
          </Reveal>

          <Reveal delay={150}>
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
                      className="text-caption font-semibold uppercase text-subtle"
                    >
                      Rapport d&apos;analyse · Exemple
                    </p>
                    <p
                      className="mt-0.5 font-heading text-lead font-semibold"
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
                          className="font-heading text-[40px] font-bold leading-none tabular-nums"
                          style={{ color: "hsl(var(--verdict-authentic))" }}
                        >
                          84
                        </span>
                        <span
                          className="text-[10px] uppercase tracking-widest text-subtle"
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
          </Reveal>
        </div>
      </section>



      {/* ── Témoignages ── */}
      <section className="border-t border-line-subtle py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase text-muted-foreground"
            >
              <LandingLabel tkey="landing.labelTestimonials" />
            </p>
            <SectionH2 tkey="landing.testimonialsMainTitle" />
            <SectionSub tkey="landing.testimonialsMainSubtitle" />
          </Reveal>

          <TestimonialsSection />
        </div>
      </section>

      {/* ── Marques et catégories ── */}
      <section
        id="brands"
        className="border-t border-line-subtle bg-surface/40 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase text-muted-foreground"
            >
              <LandingLabel tkey="landing.labelCatalog" />
            </p>
            <SectionH2 tkey="landing.brandsCategoriesTitle" />
            <SectionSub tkey="landing.brandsCategoriesSubtitle" />
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-caption font-medium"
              style={{
                border: "1px solid hsl(var(--line))",
                background: "hsl(var(--surface))",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ background: "hsl(var(--muted-foreground))" }}
              />
              <LandingLabel tkey="landing.brandsCategoriesCount" />
            </div>
          </Reveal>

          <Reveal delay={150}>
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
          </Reveal>
        </div>
      </section>

      {/* ── Fonctionnalités ── */}
      <section className="border-t border-line-subtle py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase text-muted-foreground"
            >
              <LandingLabel tkey="landing.labelFeatures" />
            </p>
            <SectionH2 tkey="landing.featuresMainTitle" />
            <SectionSub tkey="landing.featuresMainSubtitle" />
          </Reveal>

          <FeaturesSection />
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        id="pricing"
        className="border-t border-line-subtle py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase text-muted-foreground"
            >
              <LandingLabel tkey="landing.labelPricing" />
            </p>
            <SectionH2 tkey="landing.pricingMainTitle" />
            <SectionSub tkey="landing.pricingMainSubtitle" />
          </Reveal>

          <PlansSection />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="border-t border-line-subtle py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <Reveal className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase text-muted-foreground"
            >
              FAQ
            </p>
            <FaqTitleI18n />
          </Reveal>
          <Reveal delay={150} className="mt-12">
            <FaqAccordion />
          </Reveal>
        </div>
      </section>

      {/* ── Qui sommes-nous ── */}
      <section
        id="team"
        className="border-t border-line-subtle bg-surface/40 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-4xl px-4">
          <Reveal className="text-center">
            <p
              className="mb-3 text-caption font-medium uppercase text-muted-foreground"
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
          </Reveal>
        </div>
      </section>

      {/* ── Disclaimer expert ── */}
      <section className="border-t border-line-subtle py-12">
        <div className="mx-auto max-w-3xl px-4">
          <Reveal>
            <div
              className="rounded-lg px-6 py-6 text-center"
              style={{
                border: "1px solid hsl(var(--line))",
                background: "hsl(var(--surface))",
              }}
            >
              <ShieldCheck
                className="mx-auto mb-3 size-8"
                style={{ color: "hsl(var(--muted-foreground))" }}
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
          </Reveal>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="border-t border-line-subtle py-16 sm:py-24">
        <Reveal className="mx-auto max-w-6xl px-4 text-center">
          <div
            className="relative overflow-hidden rounded-lg bg-surface px-8 py-16"
            style={{ border: "1px solid hsl(var(--line))" }}
          >
            {/* Filet lumineux haut */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(var(--line-strong)), transparent)",
              }}
            />

            <BarChart3
              className="mx-auto mb-6 size-10"
              style={{ color: "hsl(var(--muted-foreground))" }}
            />
            <FinalCtaI18n />
          </div>
        </Reveal>
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
                className="text-ui text-subtle"
              >
                © {new Date().getFullYear()}
              </span>
            </div>
            <div
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-ui sm:justify-end text-subtle"
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
