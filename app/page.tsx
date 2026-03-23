import Link from "next/link";
import {
  Camera,
  Cpu,
  FileCheck,
  ShieldCheck,
  Zap,
  BarChart3,
  Check,
  ArrowRight,
} from "lucide-react";
import { FadeIn } from "@/components/layout/FadeIn";
import { UserMenu } from "@/components/auth/UserMenu";
import { PricingButton } from "@/components/stripe/PricingButton";

const STEPS = [
  {
    icon: Camera,
    title: "Prenez vos photos",
    description:
      "Suivez notre guide photo interactif pour capturer les détails essentiels de votre article.",
  },
  {
    icon: Cpu,
    title: "L'IA analyse",
    description:
      "Notre modèle de vision compare chaque détail avec des milliers de points d'authentification.",
  },
  {
    icon: FileCheck,
    title: "Rapport détaillé",
    description:
      "Recevez un score de confiance, des observations zone par zone et une recommandation claire.",
  },
];

const STATS = [
  { value: "10 000+", label: "Articles analysés" },
  { value: "95%", label: "Taux de précision" },
  { value: "< 30s", label: "Temps d'analyse" },
  { value: "24/7", label: "Disponibilité" },
];

const PLANS = [
  {
    planId: "free" as const,
    name: "Free",
    price: "0€",
    period: "",
    description: "Pour essayer le service",
    credits: "3 analyses / mois",
    features: [
      "Rapport détaillé avec score",
      "Sneakers uniquement",
      "Résultat en 30 secondes",
    ],
    cta: "Commencer gratuitement",
    popular: false,
    isAuthRedirect: true,
  },
  {
    planId: "pro" as const,
    name: "Pro",
    price: "14,99€",
    period: "/mois",
    description: "Pour les acheteurs réguliers",
    credits: "30 analyses / mois",
    features: [
      "Toutes les catégories",
      "Rapport détaillé avec score",
      "Revue expert si doute",
      "Historique complet",
    ],
    cta: "Passer au Pro",
    popular: true,
    isAuthRedirect: false,
  },
  {
    planId: "business" as const,
    name: "Business",
    price: "29,99€",
    period: "/mois",
    description: "Pour les revendeurs et pros",
    credits: "Analyses illimitées",
    features: [
      "Analyses illimitées",
      "Toutes les catégories",
      "Revue expert prioritaire",
      "API access",
      "Support dédié",
    ],
    cta: "Passer au Business",
    popular: false,
    isAuthRedirect: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="size-6 text-emerald-500" />
            <span className="font-heading text-lg font-bold tracking-tight">
              LegitVision
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="#pricing"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              Tarifs
            </Link>
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Gradient orb background */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 sm:pb-32 sm:pt-36">
          <FadeIn className="flex flex-col items-center text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              <Zap className="size-3.5" />
              Propulsé par l&apos;IA Vision
            </span>
            <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Vérifiez l&apos;authenticité
              <br />
              <span className="text-emerald-500">de vos articles de luxe</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Prenez quelques photos, notre IA analyse chaque détail et vous
              donne un score de confiance en moins de 30 secondes. Sneakers,
              sacs, montres, vêtements.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/auth"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-500 px-8 text-base font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                Analyser un article
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-12 items-center rounded-xl border border-white/10 px-8 text-base font-medium text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
              >
                Comment ça marche
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section id="how-it-works" className="border-t border-white/5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Comment ça marche
            </h2>
            <p className="mt-4 text-muted-foreground">
              Trois étapes simples pour vérifier votre article
            </p>
          </FadeIn>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <FadeIn key={step.title} delay={i * 150}>
                <div className="group relative rounded-2xl border border-white/5 bg-card p-8 transition-colors hover:border-emerald-500/20">
                  {/* Step number */}
                  <div className="absolute -top-4 left-8 flex size-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="mb-4 mt-2 flex size-12 items-center justify-center rounded-xl bg-emerald-500/10">
                    <step.icon className="size-6 text-emerald-500" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof / Stats ── */}
      <section className="border-t border-white/5 bg-card/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-heading text-3xl font-bold text-emerald-500 sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="border-t border-white/5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Tarifs simples, sans surprise
            </h2>
            <p className="mt-4 text-muted-foreground">
              Commencez gratuitement, passez au Pro quand vous êtes prêt
            </p>
          </FadeIn>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 150}>
                <div
                  className={`relative flex flex-col rounded-2xl border p-8 transition-colors ${
                    plan.popular
                      ? "border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/10"
                      : "border-white/5 bg-card hover:border-white/10"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-xs font-semibold text-white">
                      Populaire
                    </span>
                  )}
                  <div>
                    <h3 className="font-heading text-lg font-semibold">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  <div className="mt-6">
                    <span className="font-heading text-4xl font-bold">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-emerald-400">
                    {plan.credits}
                  </div>
                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <PricingButton
                      planId={plan.planId}
                      isPopular={plan.popular}
                      isAuthRedirect={plan.isAuthRedirect}
                    >
                      {plan.cta}
                    </PricingButton>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="border-t border-white/5 py-20 sm:py-28">
        <FadeIn className="mx-auto max-w-6xl px-4 text-center">
          <BarChart3 className="mx-auto mb-6 size-10 text-emerald-500" />
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Prêt à vérifier votre prochain achat ?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Rejoignez les milliers d&apos;acheteurs qui vérifient leurs
            articles avant d&apos;acheter.
          </p>
          <Link
            href="/auth"
            className="group mt-10 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-500 px-8 text-base font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            Créer un compte gratuit
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>© {new Date().getFullYear()} LegitVision</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">
              Mentions légales
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              CGU
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Confidentialité
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
