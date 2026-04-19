import type { Metadata } from "next";
import Link from "next/link";
import {
  Camera,
  Cpu,
  Eye,
  FileCheck,
  FileText,
  ShieldCheck,
  Zap,
  BarChart3,
  Check,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";
import { FadeIn } from "@/components/layout/FadeIn";
import { UserMenu } from "@/components/auth/UserMenu";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { FAQ_ITEMS } from "@/components/landing/faq-data";
import { BrandSearch } from "@/components/landing/BrandSearch";
import { BrandsTabs } from "@/components/landing/BrandsTabs";

const SITE_URL = "https://legitvision.vercel.app";

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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LegitVision — Authentification d'articles de luxe par IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LegitVision — Scannez avant d'acheter.",
    description:
      "Authentification d'articles de luxe par IA. 3,99 € / scan, 30 secondes, 8 zones analysées.",
    images: ["/og-image.png"],
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

const STEPS = [
  {
    icon: Camera,
    step: "01",
    title: "Prenez vos photos",
    description:
      "Suivez notre guide photo interactif pour capturer les détails essentiels de votre article.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "L'IA analyse",
    description:
      "Notre modèle de vision compare chaque détail avec des milliers de points d'authentification.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Rapport détaillé",
    description:
      "Recevez un score de confiance, des observations zone par zone et une recommandation claire.",
  },
];

const STATS = [
  { value: "IA Vision", label: "Analyse en temps réel" },
  { value: "8 zones", label: "Points d'authentification" },
  { value: "< 30s", label: "Temps d'analyse" },
  { value: "24/7", label: "Disponibilité" },
];

const TESTIMONIALS = [
  {
    initials: "S.M.",
    stars: 5,
    quote:
      "J'ai acheté une paire de Jordan 1 sur Vinted et j'avais un doute. LegitVision m'a donné un score de 35/100 avec des détails précis sur les coutures et le logo. J'ai annulé l'achat. Deux semaines plus tard, le vendeur a été signalé pour contrefaçon.",
    name: "Sarah M.",
    role: "Acheteuse sneakers",
    city: "Paris",
  },
  {
    initials: "K.B.",
    stars: 5,
    quote:
      "Je revends des sacs Louis Vuitton vintage. Avant LegitVision, je payais 30€ par authentification chez un expert. Maintenant je fais une pré-vérification en 30 secondes pour quelques euros. Ça me fait gagner un temps fou.",
    name: "Kevin B.",
    role: "Revendeur luxe",
    city: "Lyon",
  },
  {
    initials: "L.D.",
    stars: 4,
    quote:
      "Le rapport est super détaillé : score par zone, OCR des étiquettes, recommandations. C'est pas une certification officielle mais ça donne une très bonne indication avant d'acheter. Je recommande pour le prix.",
    name: "Laura D.",
    role: "Collectionneuse",
    city: "Bordeaux",
  },
];

const PLANS = [
  {
    name: "Utilisation unique",
    price: "3,99€",
    period: "/ analyse",
    description: "Pour une vérification ponctuelle",
    credits: "1 analyse complète",
    features: [
      "Toutes catégories",
      "Rapport détaillé",
      "Résultats < 30s",
    ],
    cta: "Analyser maintenant",
    popular: false,
    badge: null as string | null,
    href: "/checkout?plan=single",
  },
  {
    name: "Mensuel",
    price: "19,99€",
    period: "/mois",
    description: "Pour les acheteurs réguliers",
    credits: "10 analyses / mois",
    features: [
      "Toutes catégories",
      "Revue expert si doute",
      "Support prioritaire",
      "Historique complet",
    ],
    cta: "Choisir ce forfait",
    popular: true,
    badge: "Le plus populaire" as string | null,
    href: "/checkout?plan=pro",
  },
  {
    name: "Premium",
    price: "29,99€",
    period: "/mois",
    description: "Pour les revendeurs et pros",
    credits: "50 analyses / mois",
    features: [
      "Toutes catégories",
      "Revue expert incluse",
      "Support 24/7",
      "Rapport PDF",
      "Historique illimité",
    ],
    cta: "Choisir ce forfait",
    popular: false,
    badge: "Meilleure valeur" as string | null,
    href: "/checkout?plan=business",
  },
];

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
          <Link href="/" className="flex items-center gap-2.5">
            <ShieldCheck className="size-5 text-emerald-500" />
            <span className="font-heading text-base font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              LegitVision
            </span>
          </Link>
          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-6 md:flex">
              {[
                { href: "#how-it-works", label: "Comment ça marche" },
                { href: "#brands", label: "Marques" },
                { href: "#faq", label: "FAQ" },
                { href: "#pricing", label: "Tarifs" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </nav>
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
                  Propulsé par l&apos;IA Vision
                </span>

                <h1
                  className="font-heading text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  Vérifiez l&apos;authenticité
                  <br />
                  <span style={{ color: "#10B981" }}>de vos articles</span>
                  <br />
                  de luxe
                </h1>

                <p
                  className="mt-6 max-w-lg text-base leading-relaxed sm:text-lg"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Prenez quelques photos, notre IA analyse chaque détail et vous
                  donne un score de confiance en moins de 30 secondes.
                  Sneakers, sacs, vêtements.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/auth?redirect=%2Fcheck%2Fnew"
                    className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl px-8 text-base font-semibold text-white transition-all"
                    style={{
                      background: "#10B981",
                      animation: "pulse-glow 3s ease-in-out infinite",
                    }}
                  >
                    Analyser un article
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
                    Comment ça marche
                  </Link>
                </div>

                {/* Trust signals */}
                <div className="mt-8 flex flex-wrap gap-5">
                  {["< 30s résultat", "RGPD", "Hébergé EU"].map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 text-xs"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      <Check className="size-3 text-emerald-500" />
                      {item}
                    </span>
                  ))}
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

                    {/* Photo grid simulation */}
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      {[
                        { label: "Semelle", progress: 94 },
                        { label: "Logo", progress: 88 },
                        { label: "Coutures", progress: 91 },
                        { label: "Languette", progress: 85 },
                        { label: "Intérieur", progress: 90 },
                        { label: "Hardware", progress: 87 },
                      ].map((zone, i) => (
                        <div
                          key={zone.label}
                          className="flex flex-col items-center justify-end rounded-lg p-2"
                          style={{
                            background: i === 1
                              ? "rgba(16,185,129,0.08)"
                              : "rgba(255,255,255,0.025)",
                            border: i === 1
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
                                background: zone.progress >= 90
                                  ? "#10B981"
                                  : zone.progress >= 80
                                  ? "#FBBF24"
                                  : "#F87171",
                              }}
                            />
                          </div>
                          <span
                            className="text-[8px] font-medium"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {zone.label}
                          </span>
                        </div>
                      ))}
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

      {/* ── Stats band ── */}
      <section style={{ borderTop: "1px solid var(--border-subtle)", padding: "0" }}>
        <FadeIn>
          <div
            className="mx-auto max-w-6xl px-4 py-10"
          >
            <div
              className="grid grid-cols-2 gap-0 overflow-hidden rounded-2xl sm:grid-cols-4"
              style={{
                background: "var(--bg-glass)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--border-glass)",
              }}
            >
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center py-8"
                  style={{
                    borderRight: i < STATS.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  }}
                >
                  <span
                    className="font-heading text-2xl font-bold sm:text-3xl"
                    style={{ color: "#10B981" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="mt-1.5 text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
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
              Processus
            </p>
            <h2
              className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Comment ça marche
            </h2>
            <p className="mt-4 text-base" style={{ color: "var(--text-secondary)" }}>
              Trois étapes simples pour vérifier votre article
            </p>
          </FadeIn>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 120}>
                <div
                  className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/15"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {/* Ghost step number */}
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
                    Étape {step.step}
                  </div>

                  <h3
                    className="font-heading text-xl font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
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
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                  Vos photos sont analysées de manière sécurisée et ne sont jamais partagées.
                </span>{" "}
                Données hébergées en Europe, supprimées après 30 jours, conformément au RGPD.
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
              Exemple
            </p>
            <h2
              className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Découvrez nos rapports
            </h2>
            <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
              Un rapport clair et détaillé pour chaque article analysé
            </p>
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

                    {/* Subscores */}
                    <div className="w-full space-y-3">
                      {[
                        { label: "Alignement monogramme", score: 90 },
                        { label: "Qualité des coutures", score: 85 },
                        { label: "Texture canvas", score: 90 },
                        { label: "Ferrures & hardware", score: 85 },
                      ].map((s) => (
                        <div key={s.label}>
                          <div className="mb-1.5 flex items-center justify-between text-xs">
                            <span style={{ color: "var(--text-secondary)" }}>{s.label}</span>
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
                    </div>
                  </div>

                  {/* Right — Findings */}
                  <div className="flex flex-col gap-3">
                    <p
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Observations détaillées
                    </p>
                    {[
                      {
                        zone: "Alignement monogramme",
                        score: 90,
                        obs: "Le monogramme LV est parfaitement centré et symétrique sur les coutures, conforme aux standards des ateliers Vuitton.",
                      },
                      {
                        zone: "Qualité des coutures",
                        score: 85,
                        obs: "Points réguliers au fil jaune moutarde caractéristique, tension uniforme sans irrégularités visibles.",
                      },
                      {
                        zone: "Ferrures & hardware",
                        score: 85,
                        obs: "Les clips et fermoirs dorés présentent le relief et la finition attendus sur une pièce authentique.",
                      },
                    ].map((f) => (
                      <div
                        key={f.zone}
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
                        <div className="flex flex-wrap items-center gap-2">
                          <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                          <span
                            className="text-sm font-semibold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {f.zone}
                          </span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                            style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}
                          >
                            Conforme
                          </span>
                          <span
                            className="ml-auto text-xs tabular-nums"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {f.score}/100
                          </span>
                        </div>
                        <p
                          className="mt-2 text-xs leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {f.obs}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/auth?redirect=%2Fcheck%2Fnew"
                  className="group inline-flex h-11 items-center gap-2 rounded-xl px-7 text-sm font-semibold text-white transition-all hover:shadow-lg"
                  style={{ background: "#10B981" }}
                >
                  Vérifiez votre prochain article
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <p className="mt-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
                  Première analyse à 3,99€ · Sans abonnement
                </p>
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
              Avis
            </p>
            <h2
              className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Ce que disent nos utilisateurs
            </h2>
            <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
              Ils ont vérifié leurs articles avec LegitVision
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 120}>
                <div
                  className="flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className="flex size-10 items-center justify-center rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}
                    >
                      <span
                        className="font-heading text-sm font-bold"
                        style={{ color: "#10B981" }}
                      >
                        {t.initials}
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star
                          key={j}
                          className="size-3.5"
                          style={{ fill: "#D4A843", color: "#D4A843" }}
                        />
                      ))}
                      {Array.from({ length: 5 - t.stars }).map((_, j) => (
                        <Star
                          key={`e${j}`}
                          className="size-3.5"
                          style={{ color: "rgba(255,255,255,0.1)" }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
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
                      {t.quote}
                    </p>
                  </div>

                  {/* Author */}
                  <div
                    className="mt-5 pt-5"
                    style={{ borderTop: "1px solid var(--border-subtle)" }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {t.role} · {t.city}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
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
              Catalogue
            </p>
            <h2
              className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Marques et catégories
            </h2>
            <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
              Des protocoles d&apos;authentification spécifiques à chaque marque
            </p>
            <div
              className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
              style={{
                border: "1px solid rgba(16,185,129,0.2)",
                background: "rgba(16,185,129,0.06)",
                color: "#10B981",
              }}
            >
              <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
              340+ modèles disponibles dans 3 catégories
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
              Fonctionnalités
            </p>
            <h2
              className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              L&apos;outil d&apos;authentification ultime
            </h2>
            <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
              Tout ce dont vous avez besoin en un seul endroit
            </p>
          </FadeIn>

          <div className="mt-16 grid gap-5 sm:grid-cols-2">
            {[
              {
                icon: Eye,
                title: "Analyse IA avancée",
                desc: "Notre modèle de vision artificielle analyse chaque photo selon 8 zones d'authentification spécifiques : coutures, matériaux, logos, étiquettes, hardware, alignement, typographie et finitions.",
                tag: "8 zones analysées",
                highlight: true,
              },
              {
                icon: Zap,
                title: "Résultats en 30 secondes",
                desc: "Pas besoin d'attendre des heures. Uploadez vos photos, notre IA traite l'analyse en temps réel et vous délivre un rapport complet avec score de confiance en moins de 30 secondes.",
                tag: "< 30 secondes",
                highlight: false,
              },
              {
                icon: FileText,
                title: "Rapport ultra-détaillé",
                desc: "Score global sur 100, sous-scores par zone, détection OCR des codes et numéros de série, comparaison avec les standards du fabricant, et recommandations personnalisées.",
                tag: "Score sur 100",
                highlight: false,
              },
              {
                icon: ShieldCheck,
                title: "Données protégées RGPD",
                desc: "Vos photos sont hébergées en Europe sur des serveurs sécurisés. Elles sont automatiquement supprimées après 30 jours. Nous ne partageons jamais vos données avec des tiers.",
                tag: "Hébergé en EU 🇪🇺",
                highlight: false,
              },
            ].map((feat, i) => (
              <FadeIn key={feat.title} delay={i * 80}>
                <div
                  className={`group relative flex h-full flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${!feat.highlight ? "hover:border-emerald-500/15" : ""}`}
                  style={{
                    background: feat.highlight ? "rgba(16,185,129,0.04)" : "var(--bg-card)",
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
                    {feat.title}
                  </h3>
                  <p
                    className="mt-3 flex-1 text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {feat.desc}
                  </p>
                  <div className="mt-6">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}
                    >
                      {feat.tag}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
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
              Tarifs
            </p>
            <h2
              className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Simples, sans surprise
            </h2>
            <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
              Des tarifs clairs, adaptés à chaque usage
            </p>
          </FadeIn>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {PLANS.map((plan, i) => {
              const isPremium = plan.name === "Premium";
              const isPopular = plan.popular;

              return (
                <FadeIn key={plan.name} delay={i * 120}>
                  {isPremium ? (
                    <div
                      className="relative rounded-2xl p-[1.5px] shadow-xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(180,130,50,0.5), rgba(230,180,60,0.2), rgba(180,130,50,0.5))",
                        boxShadow: "0 20px 60px rgba(180,130,50,0.15)",
                      }}
                    >
                      <div
                        className="relative flex flex-col rounded-2xl p-8"
                        style={{ background: "var(--bg-card)" }}
                      >
                        <span
                          className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1 text-xs font-bold text-black shadow-lg"
                          style={{ background: "linear-gradient(90deg, #D4A843, #F0C040)" }}
                        >
                          ⭐ {plan.badge}
                        </span>
                        <h3
                          className="font-heading text-lg font-semibold"
                          style={{ color: "#D4A843" }}
                        >
                          {plan.name}
                        </h3>
                        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{plan.description}</p>
                        <div className="mt-6">
                          <span className="font-heading text-4xl font-bold" style={{ color: "#D4A843" }}>
                            {plan.price}
                          </span>
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{plan.period}</span>
                        </div>
                        <div className="mt-2 text-sm font-medium" style={{ color: "#D4A843" }}>{plan.credits}</div>
                        <ul className="mt-8 flex-1 space-y-3">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                              <Check className="mt-0.5 size-4 shrink-0" style={{ color: "#D4A843" }} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-8">
                          <Link
                            href={plan.href}
                            className="inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold text-black transition-all hover:shadow-lg"
                            style={{ background: "linear-gradient(90deg, #D4A843, #F0C040)" }}
                          >
                            {plan.cta}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="relative flex flex-col rounded-2xl p-8 transition-all duration-300"
                      style={{
                        background: isPopular ? "rgba(16,185,129,0.04)" : "var(--bg-card)",
                        border: isPopular
                          ? "1px solid rgba(16,185,129,0.35)"
                          : "1px solid var(--border-subtle)",
                        boxShadow: isPopular ? "0 0 40px rgba(16,185,129,0.08)" : "none",
                      }}
                    >
                      {isPopular && (
                        <span
                          className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold text-white"
                          style={{ background: "#10B981" }}
                        >
                          {plan.badge}
                        </span>
                      )}
                      <h3
                        className="font-heading text-lg font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {plan.name}
                      </h3>
                      <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {plan.description}
                      </p>
                      <div className="mt-6">
                        <span
                          className="font-heading text-4xl font-bold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {plan.price}
                        </span>
                        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                          {plan.period}
                        </span>
                      </div>
                      <div className="mt-2 text-sm font-medium text-emerald-400">{plan.credits}</div>
                      <ul className="mt-8 flex-1 space-y-3">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                            <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8">
                        <Link
                          href={plan.href}
                          className="inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition-all hover:shadow-lg"
                          style={
                            isPopular
                              ? { background: "#10B981", color: "#fff", animation: "pulse-glow 3s ease-in-out infinite" }
                              : {
                                  border: "1px solid rgba(255,255,255,0.08)",
                                  color: "var(--text-primary)",
                                  background: "transparent",
                                }
                          }
                        >
                          {plan.cta}
                        </Link>
                      </div>
                    </div>
                  )}
                </FadeIn>
              );
            })}
          </div>
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
            <h2
              className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Questions fréquentes
            </h2>
            <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
              Tout ce que vous devez savoir avant de commencer
            </p>
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
              À propos
            </p>
            <h2
              className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Qui sommes-nous ?
            </h2>
            <p
              className="mx-auto mt-5 max-w-2xl"
              style={{ color: "var(--text-secondary)" }}
            >
              LegitVision est propulsé par <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>LYXIRIA</span>, une entreprise naissante fondée par de jeunes passionnés de tech et de luxe.
              Nous avons décidé de créer ce service pour aider les gens à vérifier l&apos;authenticité de leurs produits.
              Parce qu&apos;on a tous déjà eu peur de se faire arnaquer en achetant un article de luxe au prix fort,
              alors qu&apos;il s&apos;agit d&apos;une contrefaçon.
              Notre mission : rendre l&apos;authentification accessible à tous grâce à l&apos;IA.
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <div
                className="flex flex-col items-center gap-5 rounded-2xl p-8 text-center"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
              >
                <div
                  className="flex size-16 items-center justify-center rounded-2xl"
                  style={{
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.2)",
                  }}
                >
                  <span className="font-heading text-xl font-bold" style={{ color: "#10B981" }}>H.V.</span>
                </div>
                <div>
                  <p className="font-heading font-semibold" style={{ color: "var(--text-primary)" }}>H.V.</p>
                  <p
                    className="mt-0.5 text-xs font-medium uppercase tracking-widest"
                    style={{ color: "#10B981" }}
                  >
                    Co-fondateur &amp; Tech
                  </p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Passionné de sneakers et développeur, je construis la technologie derrière LegitVision.
                </p>
              </div>

              <div
                className="flex flex-col items-center gap-5 rounded-2xl p-8 text-center"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }}
              >
                <div
                  className="flex size-16 items-center justify-center rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span className="font-heading text-xl font-bold" style={{ color: "var(--text-tertiary)" }}>A.</span>
                </div>
                <div>
                  <p className="font-heading font-semibold" style={{ color: "var(--text-primary)" }}>Associé</p>
                  <p
                    className="mt-0.5 text-xs font-medium uppercase tracking-widest"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Co-fondateur &amp; Business
                  </p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Expert du marché luxe, je m&apos;assure que LegitVision répond aux vrais besoins
                  des acheteurs.
                </p>
              </div>
            </div>
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
                Pour les articles de grande valeur, nous recommandons de croiser nos résultats avec un expert indépendant.{" "}
                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                  Notre analyse IA est un outil de pré-authentification, pas une certification.
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
            <h2
              className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Vérifiez votre prochain achat maintenant
            </h2>
            <p
              className="mx-auto mt-4 max-w-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Résultat en moins de 30 secondes. Sneakers, sacs, vêtements.
            </p>
            <Link
              href="/auth?redirect=%2Fcheck%2Fnew"
              className="group mt-10 inline-flex h-12 items-center gap-2 rounded-xl px-8 text-base font-semibold text-white transition-all"
              style={{
                background: "#10B981",
                animation: "pulse-glow 3s ease-in-out infinite",
              }}
            >
              Commencer maintenant
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
              Première analyse à 3,99€ · Sans abonnement
            </p>
          </div>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid var(--border-subtle)", padding: "40px 0" }}>
        <div
          className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 sm:flex-row sm:justify-between"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              © {new Date().getFullYear()} LegitVision
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm sm:justify-end" style={{ color: "var(--text-tertiary)" }}>
            <Link href="#faq" className="transition-colors hover:text-foreground">FAQ</Link>
            <Link href="#team" className="transition-colors hover:text-foreground">À propos</Link>
            <Link href="/mentions-legales" className="transition-colors hover:text-foreground">Mentions légales</Link>
            <Link href="/cgu" className="transition-colors hover:text-foreground">CGU</Link>
            <Link href="/confidentialite" className="transition-colors hover:text-foreground">Confidentialité</Link>
            <a href="mailto:legitvision.contact@gmail.com" className="transition-colors hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
