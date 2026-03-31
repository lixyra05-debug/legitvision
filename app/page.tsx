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
  CheckCircle2,
  ShoppingBag,
  Watch,
  Shirt,
  Clock,
} from "lucide-react";
import { FadeIn } from "@/components/layout/FadeIn";
import { UserMenu } from "@/components/auth/UserMenu";

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
  { value: "IA Vision", label: "Analyse en temps réel" },
  { value: "8 zones", label: "Points d'authentification" },
  { value: "< 30s", label: "Temps d'analyse" },
  { value: "24/7", label: "Disponibilité" },
];

const PLANS = [
  {
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
    href: "/auth",
  },
  {
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
    href: "/checkout?plan=pro",
  },
  {
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
    href: "/checkout?plan=business",
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

      {/* ── Encadré sécurité ── */}
      <section className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-5 text-center sm:flex-row sm:text-left">
              <span className="text-2xl shrink-0">🔒</span>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Vos photos sont analysées de manière sécurisée et ne sont jamais partagées.</span>{" "}
                Données hébergées en Europe, supprimées après 30 jours, conformément au RGPD.
              </p>
            </div>
          </FadeIn>
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

      {/* ── Exemple de rapport ── */}
      <section className="border-t border-white/5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Découvrez nos rapports
            </h2>
            <p className="mt-4 text-muted-foreground">
              Un rapport clair et détaillé pour chaque article analysé
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            {/* Card avec léger effet de perspective */}
            <div className="mx-auto mt-14 max-w-3xl">
              <div
                className="overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl shadow-black/60"
                style={{ transform: "perspective(1200px) rotateX(2deg) rotateY(-4deg)" }}
              >
                {/* En-tête du rapport */}
                <div className="flex flex-col gap-3 border-b border-white/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Rapport d&apos;analyse · Exemple
                    </p>
                    <p className="mt-0.5 font-heading text-lg font-semibold">
                      Louis Vuitton Neverfull MM
                    </p>
                    <p className="text-xs text-muted-foreground">Maroquinerie · Sac à main</p>
                  </div>
                  <div className="flex items-center gap-2 self-start rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 sm:self-auto">
                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400">
                      Probablement authentique
                    </span>
                  </div>
                </div>

                {/* Corps du rapport */}
                <div className="grid gap-6 p-6 sm:grid-cols-2 sm:gap-8">
                  {/* Colonne gauche — Jauge + sous-scores */}
                  <div className="flex flex-col items-center gap-6">
                    {/* Jauge statique SVG — score 84 */}
                    <div className="relative flex items-center justify-center" style={{ width: 148, height: 148 }}>
                      <svg width={148} height={148} style={{ transform: "rotate(-90deg)" }}>
                        {/* Track de fond */}
                        <circle
                          cx={74} cy={74} r={62}
                          fill="none"
                          stroke="rgba(255,255,255,0.07)"
                          strokeWidth={12}
                        />
                        {/* Arc coloré — 84/100 */}
                        <circle
                          cx={74} cy={74} r={62}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth={12}
                          strokeLinecap="round"
                          strokeDasharray="389.56"
                          strokeDashoffset="62.33"
                          style={{ filter: "drop-shadow(0 0 10px rgba(16, 185, 129, 0.4))" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                        <span className="font-heading text-[40px] font-bold leading-none tabular-nums text-emerald-500">
                          84
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          sur 100
                        </span>
                      </div>
                    </div>

                    {/* Sous-scores */}
                    <div className="w-full space-y-3">
                      {[
                        { label: "Alignement monogramme", score: 90 },
                        { label: "Qualité des coutures", score: 85 },
                        { label: "Texture canvas", score: 90 },
                        { label: "Ferrures & hardware", score: 85 },
                      ].map((s) => (
                        <div key={s.label}>
                          <div className="mb-1 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{s.label}</span>
                            <span className="tabular-nums font-medium text-foreground">
                              {s.score}/100
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                            <div
                              className="h-1.5 rounded-full bg-emerald-500"
                              style={{ width: `${s.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Colonne droite — Observations */}
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
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
                        className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-4"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                          <span className="text-sm font-semibold text-foreground">
                            {f.zone}
                          </span>
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                            Conforme
                          </span>
                          <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                            {f.score}/100
                          </span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {f.obs}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA sous la card */}
              <div className="mt-8 text-center">
                <Link
                  href="/auth"
                  className="group inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-7 text-sm font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  Analysez votre premier article gratuitement
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <p className="mt-3 text-xs text-muted-foreground">
                  3 analyses offertes — sans carte bancaire
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Marques et catégories ── */}
      <section className="border-t border-white/5 bg-card/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Marques et catégories
            </h2>
            <p className="mt-4 text-muted-foreground">
              Des protocoles d&apos;authentification spécifiques à chaque marque
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {/* Sneakers */}
              <div className="rounded-2xl border border-white/5 bg-card p-6">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Zap className="size-5 text-emerald-500" />
                </div>
                <h3 className="font-heading text-base font-semibold">Sneakers</h3>
                <ul className="mt-4 space-y-2">
                  {["Nike", "Jordan", "adidas", "New Balance", "Yeezy"].map((brand) => (
                    <li key={brand} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {brand}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sacs */}
              <div className="rounded-2xl border border-white/5 bg-card p-6">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <ShoppingBag className="size-5 text-emerald-500" />
                </div>
                <h3 className="font-heading text-base font-semibold">Sacs</h3>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Louis Vuitton
                  </li>
                  <li className="mt-3 text-xs italic text-muted-foreground/60">
                    + d&apos;autres marques prochainement
                  </li>
                </ul>
              </div>

              {/* Montres */}
              <div className="rounded-2xl border border-white/5 bg-card/50 p-6 opacity-70">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-white/5">
                  <Watch className="size-5 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-base font-semibold text-muted-foreground">
                  Montres
                </h3>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground/60">
                  <Clock className="size-3" />
                  Bientôt disponible
                </div>
              </div>

              {/* Vêtements */}
              <div className="rounded-2xl border border-white/5 bg-card/50 p-6 opacity-70">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-white/5">
                  <Shirt className="size-5 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-base font-semibold text-muted-foreground">
                  Vêtements
                </h3>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground/60">
                  <Clock className="size-3" />
                  Bientôt disponible
                </div>
              </div>

            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Nous ajoutons régulièrement de nouvelles marques.{" "}
              <a
                href="mailto:contact@legitvision.com"
                className="text-emerald-400 transition-colors hover:text-emerald-300"
              >
                Contactez-nous
              </a>{" "}
              pour demander une marque spécifique.
            </p>
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
                    <Link
                      href={plan.href}
                      className={`inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                        plan.popular
                          ? "bg-emerald-500 text-white hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
                          : "border border-white/10 text-foreground hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      {plan.cta}
                    </Link>
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
            Vérifiez votre prochain achat gratuitement
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            3 analyses offertes à l&apos;inscription, sans carte bancaire.
            Résultat en moins de 30 secondes.
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
            <Link href="/mentions-legales" className="transition-colors hover:text-foreground">
              Mentions légales
            </Link>
            <Link href="/cgu" className="transition-colors hover:text-foreground">
              CGU
            </Link>
            <Link href="/confidentialite" className="transition-colors hover:text-foreground">
              Confidentialité
            </Link>
            <a href="mailto:contact@legitvision.com" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
