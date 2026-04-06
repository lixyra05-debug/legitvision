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
  Star,
  UserCheck,
  FileText,
} from "lucide-react";
import { FadeIn } from "@/components/layout/FadeIn";
import { UserMenu } from "@/components/auth/UserMenu";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

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
    badge: null as string | null,
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
    badge: null as string | null,
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
      "Support prioritaire par email",
      "Revue expert incluse",
      "Rapport PDF exportable",
    ],
    cta: "Passer au Business",
    popular: false,
    badge: "Idéal revendeurs" as string | null,
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
          <div className="flex items-center gap-4">
            <nav className="hidden items-center gap-5 md:flex">
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

      {/* ── Témoignages ── */}
      <section className="border-t border-white/5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Ce que disent nos utilisateurs
            </h2>
            <p className="mt-4 text-muted-foreground">
              Ils ont vérifié leurs articles avec LegitVision
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 150}>
                <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-card p-6">
                  {/* En-tête : avatar + étoiles */}
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                      <span className="font-heading text-sm font-bold text-emerald-400">
                        {t.initials}
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star
                          key={j}
                          className="size-3.5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      {Array.from({ length: 5 - t.stars }).map((_, j) => (
                        <Star
                          key={`e${j}`}
                          className="size-3.5 text-white/15"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Citation */}
                  <div className="mt-5 flex-1">
                    <div className="mb-2 font-heading text-3xl leading-none text-emerald-500/25 select-none">
                      &ldquo;
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t.quote}
                    </p>
                  </div>

                  {/* Auteur */}
                  <div className="mt-5 border-t border-white/5 pt-5">
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
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
      <section id="brands" className="border-t border-white/5 bg-card/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Marques et catégories
            </h2>
            <p className="mt-4 text-muted-foreground">
              Des protocoles d&apos;authentification spécifiques à chaque marque
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
              70+ modèles disponibles dans 4 catégories
            </div>
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
                  {[
                    "Nike",
                    "Jordan",
                    "adidas",
                    "New Balance",
                    "Yeezy",
                    "Travis Scott",
                    "Off-White",
                  ].map((brand) => (
                    <li key={brand} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
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
                  {[
                    "Louis Vuitton",
                    "Gucci",
                    "Chanel",
                    "Dior",
                    "Hermès",
                    "Prada",
                    "Saint Laurent",
                    "Goyard",
                    "Balenciaga",
                    "Celine",
                    "Fendi",
                    "Bottega Veneta",
                  ].map((brand) => (
                    <li key={brand} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {brand}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Montres */}
              <div className="rounded-2xl border border-white/5 bg-card p-6">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Watch className="size-5 text-emerald-500" />
                </div>
                <h3 className="font-heading text-base font-semibold">Montres</h3>
                <ul className="mt-4 space-y-2">
                  {[
                    "Rolex",
                    "Omega",
                    "Audemars Piguet",
                    "Patek Philippe",
                    "Cartier",
                    "TAG Heuer",
                    "Richard Mille",
                    "Hublot",
                  ].map((brand) => (
                    <li key={brand} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {brand}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vêtements */}
              <div className="rounded-2xl border border-white/5 bg-card p-6">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Shirt className="size-5 text-emerald-500" />
                </div>
                <h3 className="font-heading text-base font-semibold">Vêtements</h3>
                <ul className="mt-4 space-y-2">
                  {[
                    "Supreme",
                    "Moncler",
                    "Canada Goose",
                    "Stone Island",
                    "Palm Angels",
                    "The North Face",
                    "Essentials",
                    "Arc'teryx",
                  ].map((brand) => (
                    <li key={brand} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {brand}
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Une marque manquante ?{" "}
              <a
                href="mailto:contact@legitvision.com"
                className="text-emerald-400 transition-colors hover:text-emerald-300"
              >
                Contactez-nous
              </a>{" "}
              pour la demander.
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
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-card px-4 py-1 text-xs font-semibold text-foreground">
                      {plan.badge}
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

      {/* ── FAQ ── */}
      <section id="faq" className="border-t border-white/5 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4">
          <FadeIn className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Questions fréquentes
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tout ce que vous devez savoir avant de commencer
            </p>
          </FadeIn>
          <FadeIn delay={150} className="mt-10">
            <FaqAccordion />
          </FadeIn>
        </div>
      </section>

      {/* ── Qui sommes-nous ── */}
      <section id="team" className="border-t border-white/5 bg-card/30 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4">
          <FadeIn className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Qui sommes-nous ?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
              LegitVision est né d&apos;une passion pour le streetwear et le luxe, et d&apos;une frustration
              face aux contrefaçons. Notre mission : rendre l&apos;authentification accessible à tous
              grâce à l&apos;intelligence artificielle.
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">

              {/* Fondateur Tech */}
              <div className="flex flex-col items-center gap-5 rounded-2xl border border-white/5 bg-card p-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  <span className="font-heading text-xl font-bold text-emerald-400">H.V.</span>
                </div>
                <div>
                  <p className="font-heading font-semibold">H.V.</p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-emerald-500">
                    Co-fondateur &amp; Tech
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Passionné de sneakers et développeur, je construis la technologie derrière LegitVision.
                </p>
              </div>

              {/* Co-fondateur Business */}
              <div className="flex flex-col items-center gap-5 rounded-2xl border border-white/5 bg-card p-8 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <span className="font-heading text-xl font-bold text-muted-foreground">A.</span>
                </div>
                <div>
                  <p className="font-heading font-semibold">Associé</p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Co-fondateur &amp; Business
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Expert du marché luxe, je m&apos;assure que LegitVision répond aux vrais besoins
                  des acheteurs.
                </p>
              </div>

            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Revue expert ── */}
      <section className="border-t border-white/5 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4">
          <FadeIn className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Besoin d&apos;un avis d&apos;expert ?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
              Pour les articles de grande valeur ou les cas ambigus, notre équipe
              d&apos;experts peut réaliser une revue manuelle approfondie de votre analyse.
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Clock,
                  title: "Revue sous 24h",
                  desc: "Résultat garanti en moins d'une journée ouvrable.",
                },
                {
                  icon: UserCheck,
                  title: "Expert spécialisé par marque",
                  desc: "Chaque revue est assignée à un expert de la marque concernée.",
                },
                {
                  icon: FileText,
                  title: "Rapport complémentaire détaillé",
                  desc: "Observations supplémentaires et recommandation finale argumentée.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-card p-6 text-center"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10">
                    <Icon className="size-5 text-emerald-500" />
                  </div>
                  <p className="font-heading font-semibold">{title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/5 bg-card px-6 py-5 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Inclus dans le plan Pro et Business.
                </span>{" "}
                Disponible à l&apos;unité pour le plan Free{" "}
                <span className="font-medium text-foreground">(4,99€)</span>.
              </p>
              <a
                href="mailto:contact@legitvision.com"
                className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
              >
                En savoir plus
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </FadeIn>
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
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground sm:justify-end">
            <Link href="#faq" className="transition-colors hover:text-foreground">FAQ</Link>
            <Link href="#team" className="transition-colors hover:text-foreground">À propos</Link>
            <Link href="/mentions-legales" className="transition-colors hover:text-foreground">Mentions légales</Link>
            <Link href="/cgu" className="transition-colors hover:text-foreground">CGU</Link>
            <Link href="/confidentialite" className="transition-colors hover:text-foreground">Confidentialité</Link>
            <a href="mailto:contact@legitvision.com" className="transition-colors hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
