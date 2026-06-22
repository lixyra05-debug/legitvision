import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales de LegitVision : éditeur, hébergeur, coordonnées de contact et informations obligatoires sur l'entreprise et le service d'authentification IA.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
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
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Mentions légales
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : mars 2026</p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed">

          {/* Éditeur */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              1. Éditeur du site
            </h2>
            <div className="rounded-xl border border-white/5 bg-card p-5 space-y-2 text-muted-foreground">
              <p><span className="text-foreground font-medium">Nom commercial :</span> LegitVision</p>
              <p><span className="text-foreground font-medium">Statut :</span> Société en cours d&apos;immatriculation</p>
              <p><span className="text-foreground font-medium">Siège social :</span> Paris, France</p>
              <p>
                <span className="text-foreground font-medium">Responsable de la publication :</span>{" "}
                [Nom du responsable à compléter lors de l&apos;immatriculation]
              </p>
              <p>
                <span className="text-foreground font-medium">Contact :</span>{" "}
                <a href="mailto:legitvision.contact@gmail.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  legitvision.contact@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Hébergeur */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              2. Hébergeur
            </h2>
            <div className="rounded-xl border border-white/5 bg-card p-5 space-y-2 text-muted-foreground">
              <p><span className="text-foreground font-medium">Société :</span> Vercel Inc.</p>
              <p><span className="text-foreground font-medium">Adresse :</span> 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
              <p>
                <span className="text-foreground font-medium">Site web :</span>{" "}
                <span className="text-foreground">vercel.com</span>
              </p>
            </div>
          </section>

          {/* Nature du service */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              3. Nature du service
            </h2>
            <p className="text-muted-foreground">
              LegitVision est un outil d&apos;aide à la décision basé sur l&apos;intelligence artificielle.
              Les analyses produites par notre service constituent une <strong className="text-foreground">estimation probabiliste</strong>,
              non une certification d&apos;authenticité.
            </p>
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
              <p className="text-amber-400 font-medium text-xs uppercase tracking-wide mb-1">Important</p>
              <p className="text-muted-foreground">
                LegitVision <strong className="text-foreground">ne délivre pas de certificat d&apos;authenticité</strong>.
                Les résultats fournis sont des scores de probabilité destinés à orienter votre jugement,
                et ne sauraient constituer une garantie juridique ou commerciale.
              </p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              4. Propriété intellectuelle
            </h2>
            <p className="text-muted-foreground">
              L&apos;ensemble des éléments composant ce site (textes, graphismes, logo, interface, code source)
              est la propriété exclusive de LegitVision et est protégé par les dispositions du Code de la propriété intellectuelle.
              Toute reproduction, représentation ou diffusion, en tout ou partie, est interdite sans autorisation écrite préalable.
            </p>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              5. Données personnelles
            </h2>
            <p className="text-muted-foreground">
              Le traitement des données personnelles des utilisateurs est décrit dans notre{" "}
              <Link href="/confidentialite" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                Politique de confidentialité
              </Link>.
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
              de droits sur vos données personnelles. Pour les exercer, contactez-nous à{" "}
              <a href="mailto:legitvision.contact@gmail.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                legitvision.contact@gmail.com
              </a>.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              6. Cookies
            </h2>
            <p className="text-muted-foreground">
              Ce site utilise uniquement des cookies techniques strictement nécessaires au fonctionnement
              du service (gestion de la session d&apos;authentification). Aucun cookie publicitaire ou de suivi
              n&apos;est déposé sur votre terminal.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              7. Droit applicable et juridiction
            </h2>
            <p className="text-muted-foreground">
              Les présentes mentions légales sont régies par le droit français. En cas de litige,
              et après tentative de résolution amiable, les tribunaux français seront seuls compétents.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12">
        <div className="mx-auto max-w-3xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Image
              src="/images/legitvision-logo.png"
              alt="LegitVision"
              width={90}
              height={24}
              className="h-6 w-auto"
            />
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/mentions-legales" className="text-foreground">Mentions légales</Link>
            <Link href="/cgu" className="transition-colors hover:text-foreground">CGU</Link>
            <Link href="/confidentialite" className="transition-colors hover:text-foreground">Confidentialité</Link>
            <a href="mailto:legitvision.contact@gmail.com" className="transition-colors hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
