import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de LegitVision : comment nous collectons, traitons et protégeons vos données personnelles et vos photos d'analyse. Conforme RGPD, hébergement UE.",
  alternates: { canonical: "/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/legitvision-logo.png"
              alt="LegitVision"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
              unoptimized
            />
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : mars 2026</p>

        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-emerald-400 text-sm font-medium">
            LegitVision s&apos;engage à protéger vos données personnelles et à les traiter dans le strict
            respect du Règlement Général sur la Protection des Données (RGPD — UE 2016/679).
          </p>
        </div>

        <div className="mt-10 space-y-10 text-sm leading-relaxed">

          {/* Responsable */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              1. Responsable du traitement
            </h2>
            <div className="rounded-xl border border-white/5 bg-card p-5 space-y-2 text-muted-foreground">
              <p><span className="text-foreground font-medium">Responsable :</span> LegitVision (en cours d&apos;immatriculation)</p>
              <p><span className="text-foreground font-medium">Localisation :</span> Paris, France</p>
              <p>
                <span className="text-foreground font-medium">Contact DPO :</span>{" "}
                <a href="mailto:legitvision.contact@gmail.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  legitvision.contact@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* Données collectées */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              2. Données collectées
            </h2>
            <p className="text-muted-foreground mb-4">
              Nous collectons uniquement les données strictement nécessaires à la fourniture du service :
            </p>

            <div className="space-y-3">
              <div className="rounded-xl border border-white/5 bg-card p-4">
                <p className="text-foreground font-medium mb-2">Données de compte</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Adresse email</li>
                  <li>Nom complet (facultatif, fourni lors de l&apos;inscription)</li>
                  <li>Identifiant de connexion (Google OAuth ou email/mot de passe)</li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/5 bg-card p-4">
                <p className="text-foreground font-medium mb-2">Données d&apos;utilisation</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Photos soumises pour analyse (stockées temporairement)</li>
                  <li>Résultats d&apos;analyse (scores, observations, rapport)</li>
                  <li>Historique des analyses</li>
                  <li>Données de facturation (gérées par Stripe — nous ne stockons pas vos données de carte bancaire)</li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/5 bg-card p-4">
                <p className="text-foreground font-medium mb-2">Données techniques</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Adresse IP (logs serveur, conservation 30 jours)</li>
                  <li>Type de navigateur et système d&apos;exploitation</li>
                  <li>Date et heure des connexions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Finalités */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              3. Finalités du traitement
            </h2>
            <div className="rounded-xl border border-white/5 bg-card overflow-hidden">
              <div className="grid grid-cols-2 gap-px bg-white/5">
                <div className="bg-card px-4 py-3 text-foreground font-medium">Finalité</div>
                <div className="bg-card px-4 py-3 text-foreground font-medium">Base légale</div>
              </div>
              {[
                ["Gestion du compte utilisateur", "Exécution du contrat"],
                ["Authentification et sécurité de l'accès", "Intérêt légitime"],
                ["Analyse IA des photos soumises", "Exécution du contrat"],
                ["Facturation et gestion des abonnements", "Obligation légale"],
                ["Amélioration du service (données agrégées)", "Intérêt légitime"],
                ["Communication transactionnelle (confirmations, alertes)", "Exécution du contrat"],
              ].map(([finalite, base]) => (
                <div key={finalite} className="grid grid-cols-2 gap-px bg-white/5">
                  <div className="bg-card px-4 py-3 text-muted-foreground">{finalite}</div>
                  <div className="bg-card px-4 py-3 text-muted-foreground">{base}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Durées de conservation */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              4. Durées de conservation
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex gap-3 items-start">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400">→</span>
                <p><strong className="text-foreground">Photos soumises :</strong> supprimées du stockage dans un délai de 30 jours suivant l&apos;analyse, sauf conservation explicitement demandée par l&apos;utilisateur dans son rapport.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400">→</span>
                <p><strong className="text-foreground">Données de compte et rapports :</strong> conservés pendant toute la durée du compte actif, puis supprimés dans un délai de 30 jours après résiliation.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400">→</span>
                <p><strong className="text-foreground">Données de facturation :</strong> conservées 10 ans conformément aux obligations comptables et fiscales.</p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-400">→</span>
                <p><strong className="text-foreground">Logs serveur :</strong> conservés 30 jours puis supprimés automatiquement.</p>
              </div>
            </div>
          </section>

          {/* Sous-traitants */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              5. Sous-traitants et transferts de données
            </h2>
            <p className="text-muted-foreground mb-4">
              Nous faisons appel aux sous-traitants suivants dans le cadre strict de la fourniture du service.
              Chacun d&apos;eux s&apos;engage contractuellement à respecter la confidentialité et la sécurité de vos données.
            </p>
            <div className="space-y-3">
              {[
                {
                  name: "Supabase",
                  role: "Base de données et stockage des fichiers",
                  location: "Union Européenne (AWS eu-west-1 — Irlande)",
                  note: "Vos données sont stockées en Europe.",
                  highlight: true,
                },
                {
                  name: "Anthropic",
                  role: "Analyse des images par IA (Claude Vision)",
                  location: "États-Unis",
                  note: "Les photos sont transmises de manière sécurisée (HTTPS/TLS). Anthropic ne stocke pas les images au-delà du traitement immédiat de la requête.",
                  highlight: false,
                },
                {
                  name: "Stripe",
                  role: "Traitement des paiements et gestion des abonnements",
                  location: "États-Unis / Union Européenne",
                  note: "Stripe est certifié PCI-DSS. Nous ne stockons jamais vos données de carte bancaire.",
                  highlight: false,
                },
                {
                  name: "Vercel",
                  role: "Hébergement de l&apos;application web",
                  location: "États-Unis (CDN mondial)",
                  note: "L&apos;application est servie via un CDN mondial pour garantir les performances.",
                  highlight: false,
                },
              ].map((st) => (
                <div
                  key={st.name}
                  className={`rounded-xl border p-4 ${
                    st.highlight
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-white/5 bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-foreground font-medium">{st.name}</p>
                    {st.highlight && (
                      <span className="text-xs text-emerald-400 font-medium">Hébergement EU</span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{st.role}</p>
                  <p className="text-muted-foreground mt-1">
                    <span className="text-foreground/60">Localisation :</span>{" "}
                    <span dangerouslySetInnerHTML={{ __html: st.location }} />
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs italic">
                    <span dangerouslySetInnerHTML={{ __html: st.note }} />
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-muted-foreground">
              Les transferts de données vers des pays tiers (États-Unis) s&apos;effectuent dans le cadre
              de garanties appropriées (clauses contractuelles types de la Commission Européenne).
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              6. Cookies
            </h2>
            <p className="text-muted-foreground">
              LegitVision utilise uniquement des cookies <strong className="text-foreground">strictement nécessaires</strong> au
              fonctionnement du service. Ces cookies ne sont pas soumis à consentement car ils sont
              indispensables à la fourniture du service demandé.
            </p>
            <div className="mt-4 rounded-xl border border-white/5 bg-card p-4">
              <p className="text-foreground font-medium mb-2">Cookie de session d&apos;authentification</p>
              <ul className="space-y-1 text-muted-foreground text-xs">
                <li><span className="text-foreground/60">Nom :</span> sb-* (Supabase Auth)</li>
                <li><span className="text-foreground/60">Finalité :</span> Maintien de la session utilisateur</li>
                <li><span className="text-foreground/60">Durée :</span> Session (supprimé à la déconnexion)</li>
                <li><span className="text-foreground/60">Type :</span> Strictement nécessaire — pas de consentement requis</li>
              </ul>
            </div>
            <p className="mt-3 text-muted-foreground">
              Aucun cookie publicitaire, analytique ou de suivi tiers n&apos;est déposé sur votre terminal.
            </p>
          </section>

          {/* Droits RGPD */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              7. Vos droits (RGPD)
            </h2>
            <p className="text-muted-foreground mb-4">
              Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: "Droit d'accès", desc: "Obtenir une copie de vos données personnelles que nous détenons." },
                { title: "Droit de rectification", desc: "Corriger des données inexactes ou incomplètes vous concernant." },
                { title: "Droit à l'effacement", desc: "Demander la suppression de vos données (\"droit à l'oubli\")." },
                { title: "Droit à la portabilité", desc: "Recevoir vos données dans un format structuré et lisible." },
                { title: "Droit d'opposition", desc: "Vous opposer à certains traitements basés sur notre intérêt légitime." },
                { title: "Droit à la limitation", desc: "Demander la suspension temporaire d'un traitement." },
              ].map((right) => (
                <div key={right.title} className="rounded-xl border border-white/5 bg-card p-4">
                  <p className="text-foreground font-medium text-sm mb-1">{right.title}</p>
                  <p className="text-muted-foreground text-xs">{right.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-muted-foreground">
                Pour exercer vos droits, contactez-nous à{" "}
                <a href="mailto:legitvision.contact@gmail.com" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                  legitvision.contact@gmail.com
                </a>{" "}
                en précisant votre demande. Nous nous engageons à y répondre dans un délai d&apos;un mois.
              </p>
              <p className="mt-2 text-muted-foreground">
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une plainte
                auprès de la <strong className="text-foreground">CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés —
                cnil.fr).
              </p>
            </div>
          </section>

          {/* Sécurité */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              8. Sécurité des données
            </h2>
            <p className="text-muted-foreground">
              LegitVision met en œuvre des mesures techniques et organisationnelles appropriées pour
              protéger vos données contre tout accès non autorisé, perte, divulgation ou altération :
            </p>
            <ul className="mt-3 list-disc list-inside space-y-2 text-muted-foreground ml-2">
              <li>Chiffrement des communications (HTTPS/TLS)</li>
              <li>Authentification sécurisée (Supabase Auth, PKCE flow pour OAuth)</li>
              <li>Accès aux données restreint aux seuls utilisateurs autorisés (Row Level Security)</li>
              <li>Clés d&apos;API stockées côté serveur uniquement, jamais exposées au client</li>
              <li>Accès administrateur limité aux équipes strictement nécessaires</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              9. Contact et réclamations
            </h2>
            <p className="text-muted-foreground">
              Pour toute question relative à cette politique de confidentialité ou pour exercer vos droits,
              contactez notre délégué à la protection des données à l&apos;adresse suivante :
            </p>
            <div className="mt-4 rounded-xl border border-white/5 bg-card p-5">
              <p className="text-foreground font-medium">LegitVision — Protection des données</p>
              <a href="mailto:legitvision.contact@gmail.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                legitvision.contact@gmail.com
              </a>
            </div>
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
              unoptimized
            />
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/mentions-legales" className="transition-colors hover:text-foreground">Mentions légales</Link>
            <Link href="/cgu" className="transition-colors hover:text-foreground">CGU</Link>
            <Link href="/confidentialite" className="text-foreground">Confidentialité</Link>
            <a href="mailto:legitvision.contact@gmail.com" className="transition-colors hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
