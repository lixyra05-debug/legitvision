import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Conditions Générales d'Utilisation",
  description:
    "Conditions Générales d'Utilisation de LegitVision : règles d'usage du service d'authentification IA, responsabilités, tarifs (à partir de 3,99 €/scan) et limites d'utilisation.",
  alternates: { canonical: "/cgu" },
};

export default function CguPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <ShieldCheck className="size-6 text-emerald-500" />
            <span className="font-heading text-lg font-bold tracking-tight">LegitVision</span>
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Conditions Générales d&apos;Utilisation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : avril 2026</p>

        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-amber-400 text-sm font-medium">
            En utilisant LegitVision, vous acceptez les présentes conditions dans leur intégralité.
            Veuillez les lire attentivement avant d&apos;utiliser le service.
          </p>
        </div>

        <div className="mt-10 space-y-10 text-sm leading-relaxed">

          {/* Description */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              1. Description du service
            </h2>
            <p className="text-muted-foreground">
              LegitVision est une plateforme en ligne proposant un service d&apos;analyse visuelle d&apos;articles
              de luxe (sneakers, maroquinerie, montres, vêtements) par intelligence artificielle.
              Le service produit un <strong className="text-foreground">score de probabilité d&apos;authenticité</strong> basé
              sur l&apos;analyse des photos soumises par l&apos;utilisateur.
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-card p-4 space-y-2">
              <p className="text-foreground font-medium">Ce que LegitVision fournit :</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Une analyse visuelle par IA de vos photos</li>
                <li>Un score de probabilité (0–100) assorti d&apos;observations détaillées</li>
                <li>Des recommandations orientant votre décision</li>
                <li>Un rapport consultable depuis votre espace personnel</li>
              </ul>
              <p className="text-foreground font-medium mt-3">Ce que LegitVision ne fournit PAS :</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li>Un certificat d&apos;authenticité au sens légal du terme</li>
                <li>Une expertise humaine certifiée</li>
                <li>Une garantie sur la valeur marchande de l&apos;article</li>
              </ul>
            </div>
          </section>

          {/* Accès */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              2. Accès au service et création de compte
            </h2>
            <p className="text-muted-foreground">
              L&apos;accès au service nécessite la création d&apos;un compte utilisateur. L&apos;utilisateur
              s&apos;engage à fournir des informations exactes et à maintenir la confidentialité de ses
              identifiants de connexion. Tout usage du service via votre compte est réputé effectué
              par vous. LegitVision se réserve le droit de suspendre ou supprimer tout compte en cas
              d&apos;utilisation abusive ou contraire aux présentes CGU.
            </p>
            <p className="mt-3 text-muted-foreground">
              L&apos;accès est réservé aux personnes majeures (18 ans et plus) ou aux mineurs disposant
              de l&apos;autorisation de leur représentant légal.
            </p>
          </section>

          {/* Crédits */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              3. Système de crédits et facturation
            </h2>
            <p className="text-muted-foreground mb-3">
              L&apos;utilisation du service est soumise à un système de crédits selon le plan souscrit :
            </p>
            <div className="rounded-xl border border-white/5 bg-card overflow-hidden">
              <div className="grid grid-cols-3 gap-px bg-white/5">
                <div className="bg-card px-4 py-3 text-foreground font-medium">Plan</div>
                <div className="bg-card px-4 py-3 text-foreground font-medium">Crédits</div>
                <div className="bg-card px-4 py-3 text-foreground font-medium">Prix</div>
              </div>
              <div className="grid grid-cols-3 gap-px bg-white/5">
                <div className="bg-card px-4 py-3 text-muted-foreground">Pro</div>
                <div className="bg-card px-4 py-3 text-muted-foreground">10 / mois</div>
                <div className="bg-card px-4 py-3 text-muted-foreground">19,99 € / mois</div>
              </div>
              <div className="grid grid-cols-3 gap-px bg-white/5">
                <div className="bg-card px-4 py-3 text-muted-foreground">Business</div>
                <div className="bg-card px-4 py-3 text-muted-foreground">Illimité</div>
                <div className="bg-card px-4 py-3 text-muted-foreground">29,99 € / mois</div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-muted-foreground">
              <p>
                Les crédits sont <strong className="text-foreground">renouvelés chaque mois</strong> à la date d&apos;anniversaire de l&apos;abonnement.
                Les crédits non utilisés ne sont pas reportés au mois suivant.
              </p>
              <p>
                Les crédits sont <strong className="text-foreground">non remboursables</strong> sauf en cas d&apos;erreur technique
                avérée de notre service empêchant la réalisation de l&apos;analyse. Dans ce cas,
                le crédit est automatiquement recrédité sur le compte de l&apos;utilisateur.
              </p>
              <p>
                Les abonnements payants sont gérés via Stripe. Vous pouvez résilier votre abonnement
                à tout moment depuis votre espace personnel. La résiliation prend effet à la fin de
                la période de facturation en cours.
              </p>
            </div>
          </section>

          {/* Obligations */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              4. Obligations de l&apos;utilisateur
            </h2>
            <p className="text-muted-foreground mb-3">L&apos;utilisateur s&apos;engage à :</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
              <li>Soumettre uniquement des photos dont il est l&apos;auteur ou pour lesquelles il dispose des droits nécessaires</li>
              <li>Ne pas utiliser le service à des fins frauduleuses, notamment pour tenter de faire authentifier des contrefaçons</li>
              <li>Ne pas tenter de contourner les mécanismes de protection du service</li>
              <li>Ne pas utiliser le service de manière automatisée (scraping, bots) sans autorisation écrite</li>
              <li>Ne pas revendre ou redistribuer les résultats obtenus sans autorisation</li>
            </ul>
          </section>

          {/* Limitation de responsabilité */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              5. Limitation de responsabilité
            </h2>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-4">
              <p className="text-amber-400 text-sm font-medium mb-2">Avertissement important</p>
              <p className="text-muted-foreground text-sm">
                Les résultats fournis par LegitVision sont des <strong className="text-foreground">estimations probabilistes</strong> produites
                par un système d&apos;intelligence artificielle. Ils ne constituent pas une expertise professionnelle
                et ne sauraient être assimilés à une certification d&apos;authenticité.
              </p>
            </div>
            <p className="text-muted-foreground">
              LegitVision décline toute responsabilité quant aux décisions d&apos;achat, de vente ou d&apos;échange
              prises sur la base des résultats fournis par son service. L&apos;utilisateur reconnaît utiliser
              le service à titre indicatif et conserve l&apos;entière responsabilité de ses décisions.
            </p>
            <p className="mt-3 text-muted-foreground">
              LegitVision ne pourra être tenu responsable en cas d&apos;interruption temporaire du service,
              de perte de données résultant d&apos;un cas de force majeure, ou de tout dommage indirect lié
              à l&apos;utilisation du service.
            </p>
            <p className="mt-3 text-muted-foreground">
              La responsabilité de LegitVision est en tout état de cause limitée au montant des sommes
              effectivement versées par l&apos;utilisateur au titre de l&apos;abonnement en cours au moment du dommage.
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              6. Propriété intellectuelle
            </h2>
            <p className="text-muted-foreground">
              Le service LegitVision, son interface, son code, ses algorithmes, ses modèles d&apos;analyse
              et l&apos;ensemble de ses contenus sont la propriété exclusive de LegitVision et sont protégés
              par les lois applicables en matière de propriété intellectuelle.
            </p>
            <p className="mt-3 text-muted-foreground">
              L&apos;utilisateur conserve la propriété des photos qu&apos;il soumet au service. En soumettant des
              photos, l&apos;utilisateur accorde à LegitVision une licence non exclusive et limitée aux seules
              finalités de l&apos;exécution du service (analyse et affichage du rapport).
            </p>
          </section>

          {/* Résiliation */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              7. Résiliation
            </h2>
            <p className="text-muted-foreground">
              L&apos;utilisateur peut résilier son compte à tout moment en contactant{" "}
              <a href="mailto:legitvison.contact@gmail.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                legitvison.contact@gmail.com
              </a>.
              La résiliation entraîne la suppression définitive du compte et des données associées
              dans un délai de 30 jours, à l&apos;exception des données devant être conservées au titre
              d&apos;obligations légales.
            </p>
            <p className="mt-3 text-muted-foreground">
              LegitVision se réserve le droit de suspendre ou résilier un compte sans préavis en cas
              de violation grave des présentes CGU ou d&apos;utilisation frauduleuse du service.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              8. Modifications des CGU
            </h2>
            <p className="text-muted-foreground">
              LegitVision se réserve le droit de modifier les présentes CGU à tout moment.
              Les utilisateurs seront informés de toute modification substantielle par email.
              La poursuite de l&apos;utilisation du service après notification vaut acceptation des nouvelles CGU.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              9. Droit applicable et litiges
            </h2>
            <p className="text-muted-foreground">
              Les présentes CGU sont soumises au droit français. En cas de litige, l&apos;utilisateur
              peut adresser une réclamation à{" "}
              <a href="mailto:legitvison.contact@gmail.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                legitvison.contact@gmail.com
              </a>.
              À défaut de résolution amiable, le litige sera soumis aux tribunaux compétents du ressort
              de Paris.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="mx-auto max-w-3xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>© {new Date().getFullYear()} LegitVision</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/mentions-legales" className="transition-colors hover:text-foreground">Mentions légales</Link>
            <Link href="/cgu" className="text-foreground">CGU</Link>
            <Link href="/confidentialite" className="transition-colors hover:text-foreground">Confidentialité</Link>
            <a href="mailto:legitvison.contact@gmail.com" className="transition-colors hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
