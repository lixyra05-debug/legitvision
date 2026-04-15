import Link from "next/link";
import { Check, CheckCircle2 } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { BrandSearch } from "@/components/landing/BrandSearch";
import { BrandsTabs } from "@/components/landing/BrandsTabs";

const STEPS = [
  {
    num: "01",
    title: "Prenez vos photos",
    description:
      "Suivez notre guide photo interactif pour capturer les détails essentiels de votre article.",
  },
  {
    num: "02",
    title: "L'IA analyse",
    description:
      "Notre modèle de vision compare chaque détail avec des milliers de points d'authentification.",
  },
  {
    num: "03",
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
    quote:
      "J'ai acheté une paire de Jordan 1 sur Vinted et j'avais un doute. LegitVision m'a donné un score de 35/100 avec des détails précis sur les coutures et le logo. J'ai annulé l'achat. Deux semaines plus tard, le vendeur a été signalé pour contrefaçon.",
    name: "Sarah M.",
    role: "Acheteuse sneakers",
    city: "Paris",
  },
  {
    quote:
      "Je revends des sacs Louis Vuitton vintage. Avant LegitVision, je payais 30€ par authentification chez un expert. Maintenant je fais une pré-vérification en 30 secondes pour quelques euros. Ça me fait gagner un temps fou.",
    name: "Kevin B.",
    role: "Revendeur luxe",
    city: "Lyon",
  },
  {
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
    features: ["Toutes catégories", "Rapport détaillé", "Résultats < 30s"],
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

const FEATURES = [
  {
    num: "01",
    title: "Analyse IA avancée",
    description:
      "Notre modèle de vision artificielle analyse chaque photo selon 8 zones d'authentification spécifiques : coutures, matériaux, logos, étiquettes, hardware, alignement, typographie et finitions.",
    tag: "8 zones analysées",
  },
  {
    num: "02",
    title: "Résultats en 30 secondes",
    description:
      "Pas besoin d'attendre des heures. Uploadez vos photos, notre IA traite l'analyse en temps réel et vous délivre un rapport complet avec score de confiance en moins de 30 secondes.",
    tag: "< 30 secondes",
  },
  {
    num: "03",
    title: "Rapport ultra-détaillé",
    description:
      "Score global sur 100, sous-scores par zone, détection OCR des codes et numéros de série, comparaison avec les standards du fabricant, et recommandations personnalisées.",
    tag: "Score sur 100",
  },
  {
    num: "04",
    title: "Données protégées RGPD",
    description:
      "Vos photos sont hébergées en Europe sur des serveurs sécurisés. Elles sont automatiquement supprimées après 30 jours. Nous ne partageons jamais vos données avec des tiers.",
    tag: "Hébergé en EU",
  },
];

/* ── Label de section réutilisable ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#808080]">
      {children}
    </p>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-sm font-bold uppercase tracking-[0.18em] text-white"
          >
            LEGITVISION
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-8 md:flex">
              {[
                { href: "#how-it-works", label: "Processus" },
                { href: "#brands", label: "Marques" },
                { href: "#pricing", label: "Tarifs" },
                { href: "#faq", label: "FAQ" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#808080] transition-colors duration-200 hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>
            <UserMenu />
            <Link
              href="/auth?redirect=%2Fcheck%2Fnew"
              className="hidden h-9 items-center bg-white px-6 text-[11px] font-semibold uppercase tracking-[0.1em] text-black transition-opacity duration-200 hover:opacity-80 md:inline-flex"
            >
              Analyser
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-4 pb-28 pt-32 sm:pb-40 sm:pt-48">
          <p className="mb-8 text-[11px] font-medium uppercase tracking-[0.2em] text-[#808080]">
            Authentification d&apos;articles de luxe par IA
          </p>
          <h1
            className="font-bold uppercase leading-[0.92] tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(48px, 7.5vw, 92px)" }}
          >
            Vérifiez<br />
            l&apos;authenticité<br />
            <span className="text-[#808080]">de vos articles</span><br />
            de luxe.
          </h1>
          <p className="mt-10 max-w-sm text-base font-light leading-relaxed text-[#808080]">
            Prenez quelques photos, notre IA analyse chaque détail et vous
            donne un score de confiance en moins de 30 secondes.
            Sneakers, sacs, vêtements.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Link
              href="/auth?redirect=%2Fcheck%2Fnew"
              className="inline-flex h-12 items-center bg-white px-10 text-[11px] font-semibold uppercase tracking-[0.12em] text-black transition-opacity duration-200 hover:opacity-80"
            >
              Analyser un article
            </Link>
            <Link
              href="#how-it-works"
              className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#808080] underline underline-offset-4 transition-colors duration-200 hover:text-white"
            >
              Comment ça marche
            </Link>
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section id="how-it-works" className="border-b border-white/[0.06] py-32">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel>Processus</SectionLabel>
          <h2 className="mb-20 text-3xl font-bold uppercase tracking-[-0.02em] text-white sm:text-4xl">
            Comment ça marche
          </h2>

          <div className="grid gap-16 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((step) => (
              <div key={step.num}>
                <div
                  className="mb-6 font-light text-[#1E1E1E]"
                  style={{ fontSize: "52px", lineHeight: 1 }}
                >
                  {step.num}
                </div>
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-[#808080]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Encadré sécurité ── */}
      <section className="border-b border-white/[0.06] py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="border border-white/[0.06] bg-card px-6 py-5">
            <p className="text-sm font-light leading-relaxed text-[#808080]">
              <span className="font-medium text-white">
                Vos photos sont analysées de manière sécurisée et ne sont jamais partagées.
              </span>{" "}
              Données hébergées en Europe, supprimées après 30 jours, conformément au RGPD.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-b border-white/[0.06] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.08em] text-[#808080]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exemple de rapport ── */}
      <section className="border-b border-white/[0.06] py-32">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel>Exemple de rapport</SectionLabel>
          <h2 className="mb-16 text-3xl font-bold uppercase tracking-[-0.02em] text-white sm:text-4xl">
            Découvrez nos rapports
          </h2>

          <div className="mx-auto max-w-3xl">
            {/* Card rapport */}
            <div className="overflow-hidden border border-white/[0.06] bg-card">
              {/* En-tête */}
              <div className="flex flex-col gap-3 border-b border-white/[0.06] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#808080]">
                    Rapport d&apos;analyse · Exemple
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    Louis Vuitton Neverfull MM
                  </p>
                  <p className="text-xs text-[#808080]">Maroquinerie · Sac à main</p>
                </div>
                <div className="flex items-center gap-2 self-start border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 sm:self-auto">
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">
                    Probablement authentique
                  </span>
                </div>
              </div>

              {/* Corps */}
              <div className="grid gap-6 p-6 sm:grid-cols-2 sm:gap-8">
                {/* Jauge + sous-scores */}
                <div className="flex flex-col items-center gap-6">
                  <div
                    className="relative flex items-center justify-center"
                    style={{ width: 148, height: 148 }}
                  >
                    <svg
                      width={148}
                      height={148}
                      style={{ transform: "rotate(-90deg)" }}
                    >
                      <circle
                        cx={74} cy={74} r={62}
                        fill="none"
                        stroke="rgba(255,255,255,0.07)"
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
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                      <span className="text-[40px] font-bold leading-none tabular-nums text-emerald-500">
                        84
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#808080]">
                        sur 100
                      </span>
                    </div>
                  </div>

                  <div className="w-full space-y-4">
                    {[
                      { label: "Alignement monogramme", score: 90 },
                      { label: "Qualité des coutures", score: 85 },
                      { label: "Texture canvas", score: 90 },
                      { label: "Ferrures & hardware", score: 85 },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <span className="text-[#808080]">{s.label}</span>
                          <span className="font-medium tabular-nums text-white">
                            {s.score}/100
                          </span>
                        </div>
                        <div className="h-px w-full bg-white/[0.06]">
                          <div
                            className="h-px bg-emerald-500"
                            style={{ width: `${s.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Observations */}
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#808080]">
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
                      className="border border-emerald-500/15 bg-emerald-500/5 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                        <span className="text-sm font-semibold text-white">
                          {f.zone}
                        </span>
                        <span className="bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                          Conforme
                        </span>
                        <span className="ml-auto text-xs tabular-nums text-[#808080]">
                          {f.score}/100
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-light leading-relaxed text-[#808080]">
                        {f.obs}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/auth?redirect=%2Fcheck%2Fnew"
                className="inline-flex h-11 items-center bg-white px-8 text-[11px] font-semibold uppercase tracking-[0.1em] text-black transition-opacity duration-200 hover:opacity-80"
              >
                Vérifiez votre prochain article
              </Link>
              <p className="mt-3 text-xs text-[#808080]">
                Première analyse à 3,99€ · Sans abonnement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Témoignages ── */}
      <section className="border-b border-white/[0.06] py-32">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel>Témoignages</SectionLabel>
          <h2 className="mb-16 text-3xl font-bold uppercase tracking-[-0.02em] text-white sm:text-4xl">
            Ce que disent<br />nos utilisateurs
          </h2>

          {/* Grid avec séparateurs fins entre cards */}
          <div className="grid gap-px bg-white/[0.06] sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col bg-background p-8"
              >
                <p className="flex-1 text-sm italic font-light leading-relaxed text-[#808080]">
                  &laquo;&thinsp;{t.quote}&thinsp;&raquo;
                </p>
                <div className="mt-8 border-t border-white/[0.06] pt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                    {t.name}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[#808080]">
                    {t.role} · {t.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marques et catégories ── */}
      <section id="brands" className="border-b border-white/[0.06] py-32">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel>Couverture</SectionLabel>
          <h2 className="mb-4 text-3xl font-bold uppercase tracking-[-0.02em] text-white sm:text-4xl">
            Marques et catégories
          </h2>
          <p className="mb-12 max-w-md text-sm font-light text-[#808080]">
            Des protocoles d&apos;authentification spécifiques à chaque marque
            — 340+ modèles disponibles
          </p>

          <BrandSearch />
          <div className="mt-8">
            <BrandsTabs />
          </div>
          <p className="mt-8 text-sm text-[#808080]">
            Une marque manquante ?{" "}
            <a
              href="mailto:contact@legitvision.com"
              className="text-white underline underline-offset-4 transition-opacity hover:opacity-70"
            >
              Contactez-nous
            </a>{" "}
            pour la demander.
          </p>
        </div>
      </section>

      {/* ── Fonctionnalités ── */}
      <section className="border-b border-white/[0.06] py-32">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel>Fonctionnalités</SectionLabel>
          <h2 className="mb-16 text-3xl font-bold uppercase tracking-[-0.02em] text-white sm:text-4xl">
            Fonctionnalités complètes
          </h2>

          <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.num}
                className="flex flex-col bg-background p-8 transition-colors duration-200 hover:bg-card"
              >
                <span className="mb-8 text-[11px] font-medium uppercase tracking-[0.15em] text-[#2A2A2A]">
                  {f.num}
                </span>
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-white">
                  {f.title}
                </h3>
                <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-[#808080]">
                  {f.description}
                </p>
                <div className="mt-8">
                  <span className="border border-white/[0.08] px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-[#4A4A4A]">
                    {f.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="border-b border-white/[0.06] py-32">
        <div className="mx-auto max-w-6xl px-4">
          <SectionLabel>Tarifs</SectionLabel>
          <h2 className="mb-16 text-3xl font-bold uppercase tracking-[-0.02em] text-white sm:text-4xl">
            Tarifs simples,<br />sans surprise
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.map((plan) => {
              const isPopular = plan.popular;
              return (
                <div
                  key={plan.name}
                  className={`relative flex flex-col bg-card p-8 ${
                    isPopular
                      ? "border border-white"
                      : "border border-white/[0.06]"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="mb-6">
                      <span
                        className={`inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                          isPopular
                            ? "border border-white text-white"
                            : "border border-white/[0.1] text-[#808080]"
                        }`}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-xs font-light text-[#808080]">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mt-8">
                    <span className="text-[42px] font-bold leading-none text-white">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-sm text-[#808080]">
                      {plan.period}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[#808080]">
                    {plan.credits}
                  </div>

                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm font-light text-[#808080]"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-white" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      href={plan.href}
                      className={`inline-flex h-11 w-full items-center justify-center text-[11px] font-semibold uppercase tracking-[0.1em] transition-opacity duration-200 hover:opacity-80 ${
                        isPopular
                          ? "bg-white text-black"
                          : "border border-white/20 text-white"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="border-b border-white/[0.06] py-32">
        <div className="mx-auto max-w-3xl px-4">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mb-16 text-3xl font-bold uppercase tracking-[-0.02em] text-white sm:text-4xl">
            Questions fréquentes
          </h2>
          <FaqAccordion />
        </div>
      </section>

      {/* ── Qui sommes-nous ── */}
      <section id="team" className="border-b border-white/[0.06] py-32">
        <div className="mx-auto max-w-4xl px-4">
          <SectionLabel>L&apos;équipe</SectionLabel>
          <h2 className="mb-6 text-3xl font-bold uppercase tracking-[-0.02em] text-white sm:text-4xl">
            Qui sommes-nous ?
          </h2>
          <p className="mb-16 max-w-2xl text-sm font-light leading-relaxed text-[#808080]">
            LegitVision est propulsé par{" "}
            <span className="font-medium text-white">LYXIRIA</span>, une
            entreprise naissante fondée par de jeunes passionnés de tech et de
            luxe. Notre mission : rendre l&apos;authentification accessible à
            tous grâce à l&apos;IA.
          </p>

          <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2">
            <div className="flex flex-col items-center gap-5 bg-card p-10 text-center">
              <div className="flex size-14 items-center justify-center border border-white/[0.08]">
                <span className="text-base font-bold text-white">H.V.</span>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
                  H.V.
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-[#808080]">
                  Co-fondateur &amp; Tech
                </p>
              </div>
              <p className="text-sm font-light leading-relaxed text-[#808080]">
                Passionné de sneakers et développeur, je construis la
                technologie derrière LegitVision.
              </p>
            </div>

            <div className="flex flex-col items-center gap-5 bg-card p-10 text-center">
              <div className="flex size-14 items-center justify-center border border-white/[0.06]">
                <span className="text-base font-bold text-[#808080]">A.</span>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
                  Associé
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-[#808080]">
                  Co-fondateur &amp; Business
                </p>
              </div>
              <p className="text-sm font-light leading-relaxed text-[#808080]">
                Expert du marché luxe, je m&apos;assure que LegitVision répond
                aux vrais besoins des acheteurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Disclaimer expert ── */}
      <section className="border-b border-white/[0.06] py-14">
        <div className="mx-auto max-w-3xl px-4">
          <div className="border border-white/[0.06] bg-card px-6 py-6 text-center">
            <p className="text-sm font-light leading-relaxed text-[#808080]">
              Pour les articles de grande valeur, nous recommandons de croiser
              nos résultats avec un expert indépendant.{" "}
              <span className="font-medium text-white">
                Notre analyse IA est un outil de pré-authentification, pas une
                certification.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="border-b border-white/[0.06] py-32">
        <div className="mx-auto max-w-6xl px-4">
          <h2
            className="font-bold uppercase leading-[0.92] tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(40px, 6vw, 76px)" }}
          >
            Vérifiez votre<br />
            prochain achat.
          </h2>
          <p className="mt-6 text-sm font-light text-[#808080]">
            Résultat en moins de 30 secondes. Sneakers, sacs, vêtements.
          </p>
          <Link
            href="/auth?redirect=%2Fcheck%2Fnew"
            className="mt-10 inline-flex h-12 items-center bg-white px-10 text-[11px] font-semibold uppercase tracking-[0.12em] text-black transition-opacity duration-200 hover:opacity-80"
          >
            Commencer maintenant
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-white">
              LEGITVISION
            </span>
            <nav className="flex flex-wrap gap-x-8 gap-y-2">
              <Link
                href="#faq"
                className="text-[10px] uppercase tracking-[0.1em] text-[#808080] transition-colors duration-200 hover:text-white"
              >
                FAQ
              </Link>
              <Link
                href="#team"
                className="text-[10px] uppercase tracking-[0.1em] text-[#808080] transition-colors duration-200 hover:text-white"
              >
                À propos
              </Link>
              <Link
                href="/mentions-legales"
                className="text-[10px] uppercase tracking-[0.1em] text-[#808080] transition-colors duration-200 hover:text-white"
              >
                Mentions légales
              </Link>
              <Link
                href="/cgu"
                className="text-[10px] uppercase tracking-[0.1em] text-[#808080] transition-colors duration-200 hover:text-white"
              >
                CGU
              </Link>
              <Link
                href="/confidentialite"
                className="text-[10px] uppercase tracking-[0.1em] text-[#808080] transition-colors duration-200 hover:text-white"
              >
                Confidentialité
              </Link>
              <a
                href="mailto:contact@legitvision.com"
                className="text-[10px] uppercase tracking-[0.1em] text-[#808080] transition-colors duration-200 hover:text-white"
              >
                Contact
              </a>
            </nav>
            <p className="text-[10px] uppercase tracking-[0.08em] text-[#4A4A4A]">
              © {new Date().getFullYear()} LEGITVISION
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
