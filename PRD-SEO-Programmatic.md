# PRD — SEO Programmatique LegitVision

**Auteur** : Hector
**Date** : 2026-04-22
**Statut** : Draft v1 — prêt pour implémentation Cat. 2
**Objectif commercial** : générer 10 000 visites organiques/mois → 400 analyses payantes (3,99 €) → **1 596 €/mois MRR organique** à maturité (mois 6).

---

## 1. Vision & objectifs

### 1.1 Vision

Construire un moteur SEO programmatique à **~2 000 pages** ciblant les utilisateurs qui s'apprêtent à acheter un article de luxe d'occasion et cherchent à éviter une arnaque. Chaque page convertit vers l'analyse LegitVision à 3,99 €.

### 1.2 KPIs

| Métrique | M3 | M6 | M12 |
|----------|-----|-----|-----|
| Pages indexées | 300 | 1 300 | 2 000 |
| Visites SEO / mois | 2 500 | 10 000 | 35 000 |
| Taux conversion page → analyse | 3 % | 5 % | 6 % |
| Analyses 3,99 € / mois | 75 | 500 | 2 100 |
| Revenu SEO / mois | 299 € | 1 995 € | 8 379 € |

### 1.3 Contrainte critique

**Pas de thin content.** Chaque page doit apporter une valeur unique ≠ simple swap de variables. Voir §6 (stratégie d'unicité).

---

## 2. Architecture & priorisation

### 2.1 Ordre de déploiement validé

| # | Catégorie | URL base | Pages | Priorité |
|---|-----------|----------|-------|----------|
| **2** | **Guide plateforme × marque** | `/acheter-authentique/{plateforme}/{marque}` | ~300 | **M1** |
| 1 | Legit check marque × modèle | `/legit-check/{marque}/{modele}` | ~1000 | M3 |
| 3 | Guide signal × marque | `/guide/{marque}/{signal}` | ~700 | M5 |

### 2.2 Règles d'URL

- **Subfolders**, pas de sous-domaines (cf. skill programmatic-seo).
- **Slugs stables** : kebab-case, pas d'accents, pas de numéros d'édition.
- **Canonicals absolus** (`https://legitvision.fr/...`) pour prévenir la dilution.
- **Pas de trailing slash** pour rester cohérent avec les routes Next.js actuelles.

Exemples :
```
/acheter-authentique/vinted/jordan
/acheter-authentique/vestiaire-collective/louis-vuitton
/legit-check/nike/air-force-1
/guide/louis-vuitton/code-serie
```

---

## 3. Template universel

**Principe** : un seul composant React paramétré par un objet `SeoPageData` typé. Chaque route (Cat 1, 2, 3) construit cet objet à partir de sa source de données et passe au composant.

### 3.1 Structure des sections (ordre figé)

```
┌─────────────────────────────────────────────────┐
│ 1. Hero                                         │
│   H1 + sous-titre + CTA principal + trust row   │
├─────────────────────────────────────────────────┤
│ 2. Contexte (pourquoi c'est risqué)             │
│   Intro unique 150-250 mots + stats             │
├─────────────────────────────────────────────────┤
│ 3. Les 5 signaux à vérifier (HowTo schema)      │
│   Cards numérotées avec images + description    │
├─────────────────────────────────────────────────┤
│ 4. Arnaques spécifiques sur cette plateforme    │
│   (Cat 2 uniquement — liste platform-specific)  │
├─────────────────────────────────────────────────┤
│ 5. CTA intermédiaire (3,99 € glassmorphism)     │
│   "Un doute ? Faites analyser en 60 secondes"   │
├─────────────────────────────────────────────────┤
│ 6. FAQ (FAQPage schema)                         │
│   6-8 questions ciblées longue traîne           │
├─────────────────────────────────────────────────┤
│ 7. Pages connexes (internal linking)            │
│   8-12 liens vers autres combinaisons pertinentes│
├─────────────────────────────────────────────────┤
│ 8. CTA final + pricing                          │
│   Rappel offre 3,99 € + bouton primaire         │
└─────────────────────────────────────────────────┘
```

### 3.2 Unicité par page (anti-thin-content)

Chaque `SeoPageData` doit contenir **minimum** :
- 1 intro unique (200+ mots, pas d'auto-génération triviale)
- 5 signaux d'authentification **spécifiques à la marque**
- 3-5 arnaques courantes **spécifiques à la plateforme** (Cat 2)
- 6-8 FAQ avec réponses ≥ 60 mots chacune
- ≥ 1 image ou diagramme unique (logo marque + capture plateforme)

Total minimum par page : **~1 200 mots d'HTML visible**.

---

## 4. Design visuel & composants

### 4.1 Style cohérent avec le site

Réutilisation stricte des tokens existants :
- Background : `bg-background` (#0A0A0B)
- Cards : `bg-white/[0.02] border border-white/10 backdrop-blur-xl`
- Accent : `emerald-500` (CTA primaire) + `emerald-400` (liens)
- Warning : `amber-500/20` (encadrés arnaques)
- Typo : Inter body, Space Grotesk headlines (via `font-heading`)

### 4.2 Hero — spec visuelle

```tsx
<section className="relative overflow-hidden border-b border-white/5 py-20 sm:py-28">
  <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
  <div className="mx-auto max-w-4xl px-4">
    {/* Breadcrumb SEO-friendly */}
    <nav className="mb-6 text-xs text-muted-foreground">...</nav>
    <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
      {data.h1}
    </h1>
    <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
      {data.subtitle}
    </p>
    <div className="mt-8 flex flex-wrap gap-3">
      <Link href="/check/new" className="... bg-emerald-500 ...">
        Analyser mon {data.productType} — 3,99 €
      </Link>
      <a href="#guide" className="... border border-white/10 ...">
        Lire le guide
      </a>
    </div>
    <TrustRow /> {/* 4 badges : IA, 60s, 95% précision, RGPD */}
  </div>
</section>
```

### 4.3 Card "signal d'authentification" (schema HowTo step)

```tsx
<article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl">
  <div className="flex items-start gap-4">
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 font-heading font-bold text-emerald-400">
      {index + 1}
    </div>
    <div>
      <h3 className="font-heading text-lg font-semibold">{signal.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{signal.description}</p>
      {signal.image && <Image ... />}
    </div>
  </div>
</article>
```

### 4.4 Encadré arnaque (Cat 2)

```tsx
<div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
  <div className="flex items-start gap-3">
    <AlertTriangle className="size-5 shrink-0 text-amber-400" />
    <div>
      <h4 className="font-semibold text-amber-400">{scam.title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{scam.description}</p>
    </div>
  </div>
</div>
```

---

## 5. Schema.org (structured data)

### 5.1 JSON-LD injecté en `<head>` via `app/acheter-authentique/[plateforme]/[marque]/page.tsx`

Deux schémas combinés par page :

**A. HowTo** — le guide des 5 signaux devient un "How to check authenticity".

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Comment vérifier l'authenticité d'une paire Jordan sur Vinted",
  "description": "Guide en 5 étapes pour distinguer une vraie Jordan d'une contrefaçon sur Vinted.",
  "image": "https://legitvision.fr/og/vinted-jordan.png",
  "totalTime": "PT5M",
  "estimatedCost": { "@type": "MonetaryAmount", "currency": "EUR", "value": "0" },
  "tool": [{ "@type": "HowToTool", "name": "Smartphone avec appareil photo" }],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Vérifier la box label",
      "text": "La box label authentique Jordan doit avoir une police fine...",
      "image": "https://legitvision.fr/signals/jordan/box-label.png"
    }
    // ... 4 autres étapes
  ]
}
```

**B. FAQPage** — la section FAQ.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Est-ce que Vinted vérifie l'authenticité des Jordan ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Non. Vinted ne propose aucune authentification..."
      }
    }
    // ... 5-7 autres
  ]
}
```

**C. BreadcrumbList** — toujours présent pour rich snippets.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://legitvision.fr" },
    { "@type": "ListItem", "position": 2, "name": "Acheter authentique", "item": "https://legitvision.fr/acheter-authentique" },
    { "@type": "ListItem", "position": 3, "name": "Vinted", "item": "https://legitvision.fr/acheter-authentique/vinted" },
    { "@type": "ListItem", "position": 4, "name": "Jordan", "item": "https://legitvision.fr/acheter-authentique/vinted/jordan" }
  ]
}
```

### 5.2 Injection

Via `<script type="application/ld+json">` dans le JSX de la page, stringifié avec `JSON.stringify(schema)`. Helper partagé : `lib/seo/schema.ts`.

---

## 6. Stratégie d'unicité & data model

### 6.1 Sources de contenu (par pouvoir de défense SEO, du + fort au + faible)

1. **Proprietary** — données issues des analyses LegitVision : stats internes (% contrefaçons détectées par marque/plateforme), patterns d'arnaque récurrents. À activer dès 1 000 analyses effectuées.
2. **Editorial-crafted** — rédaction manuelle d'un intro unique par page principale. Feasible pour ~50 pages top-volume, puis templatisation supervisée.
3. **Platform-scraped** — captures et stats publiques par plateforme (taux de signalements, policy d'authentification).
4. **Brand-knowledge** — signaux d'authentification propres à chaque marque (corpus éditorial construit en amont).

### 6.2 Data model TypeScript

Fichiers source (statiques, commitables) :

```ts
// lib/seo/data/platforms.ts
export type Platform = {
  slug: string;                // "vinted"
  name: string;                // "Vinted"
  logo: string;                // "/images/platforms/vinted.svg"
  description: string;         // intro dédiée 150+ mots
  userBaseFr: string;          // "23 millions d'utilisateurs en France"
  authenticityProgram: string | null; // "Authenticité Vinted (> 500 €)" | null
  commonScams: Scam[];         // 3-5 arnaques spécifiques
  purchaseFlow: string[];      // étapes d'achat avec points de risque
};

// lib/seo/data/brands.ts
export type Brand = {
  slug: string;                // "jordan"
  name: string;                // "Jordan"
  category: 'sneakers' | 'bags' | 'watches' | 'clothing';
  logo: string;
  description: string;         // intro marque 150+ mots
  authenticitySignals: Signal[]; // 5-8 signaux visuels
  commonModels: string[];      // pour internal linking vers Cat 1
  priceRangeFr: string;        // "120-450 €" fourchette marché FR
};

export type Signal = {
  title: string;               // "Vérifier la box label"
  description: string;         // 80-150 mots
  image?: string;              // optionnel
  difficulty: 1 | 2 | 3;       // facilité de détection (UX)
};

export type Scam = {
  title: string;               // "Photos volées à un autre vendeur"
  description: string;         // 60-100 mots
  frequency: 'very-common' | 'common' | 'rare';
};

// lib/seo/data/content-fragments.ts
// Fragments d'intro paramétrables (verbes, transitions, angles)
// pour générer des textes uniques par (platform, brand) sans thin content
export const introFragments = { ... };
```

### 6.3 Génération de l'intro unique

L'intro (section 2 du template) est **assemblée** à partir de :
- Fragment marque (ex: "Jordan, marque emblématique de Nike, est l'une des plus contrefaites au monde avec 37% de répliques en circulation...")
- Fragment plateforme (ex: "Vinted, fort de ses 23 millions d'utilisateurs français, reste peu modéré sur les articles à moins de 500 €...")
- Combinateur contextuel (ex: "Acheter une paire de Jordan sur Vinted est donc un exercice délicat...")
- Stat propriétaire quand dispo (ex: "Sur nos 12 000 analyses, 41% des Jordan présentées comme authentiques sur Vinted étaient en réalité des contrefaçons...")

**Règle** : chaque intro doit faire **≥ 200 mots** et doit changer d'au moins 3 phrases d'une page sœur. Valider avec un script de similarity cosine (< 0,75 entre pages voisines).

---

## 7. Implémentation Next.js (Cat 2 — premier déploiement)

### 7.1 Arborescence à créer

```
app/(public)/acheter-authentique/
├── page.tsx                                    # Hub : liste des plateformes
├── [plateforme]/
│   ├── page.tsx                                # Sous-hub : plateforme × toutes marques
│   └── [marque]/
│       └── page.tsx                            # Page feuille programmatique
│
components/seo/
├── SeoPageTemplate.tsx                         # Template universel
├── SeoHero.tsx
├── SignalCard.tsx
├── ScamAlert.tsx
├── SeoFAQ.tsx
├── SeoCTA.tsx
└── RelatedPagesGrid.tsx
│
lib/seo/
├── data/
│   ├── platforms.ts
│   ├── brands.ts
│   └── content-fragments.ts
├── schema.ts                                   # Helpers JSON-LD
├── intro-generator.ts                          # Assemblage intro unique
└── types.ts
```

### 7.2 `app/(public)/acheter-authentique/[plateforme]/[marque]/page.tsx`

```tsx
import { notFound } from 'next/navigation';
import { SeoPageTemplate } from '@/components/seo/SeoPageTemplate';
import { platforms } from '@/lib/seo/data/platforms';
import { brands } from '@/lib/seo/data/brands';
import { buildSeoPageData } from '@/lib/seo/intro-generator';
import { buildSchemas } from '@/lib/seo/schema';

type Params = { plateforme: string; marque: string };

export async function generateStaticParams(): Promise<Params[]> {
  return platforms.flatMap((p) =>
    brands
      .filter((b) => p.supportedCategories.includes(b.category))
      .map((b) => ({ plateforme: p.slug, marque: b.slug }))
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const platform = platforms.find((p) => p.slug === params.plateforme);
  const brand = brands.find((b) => b.slug === params.marque);
  if (!platform || !brand) return {};

  const title = `Acheter ${brand.name} sur ${platform.name} sans se faire arnaquer — LegitVision`;
  const description = `${brand.name} sur ${platform.name} : 5 signaux à vérifier + arnaques courantes + analyse IA en 60 secondes pour 3,99 €.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://legitvision.fr/acheter-authentique/${platform.slug}/${brand.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      images: [`https://legitvision.fr/og/${platform.slug}-${brand.slug}.png`],
    },
  };
}

export const dynamicParams = false; // strict : 404 sur combinaisons non prévues
export const revalidate = 86400;    // ISR 24h pour régénérer avec nouvelles stats

export default function Page({ params }: { params: Params }) {
  const platform = platforms.find((p) => p.slug === params.plateforme);
  const brand = brands.find((b) => b.slug === params.marque);
  if (!platform || !brand) notFound();

  const data = buildSeoPageData({ platform, brand, category: 'platform-brand' });
  const schemas = buildSchemas(data);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SeoPageTemplate data={data} />
    </>
  );
}
```

### 7.3 `components/seo/SeoPageTemplate.tsx` (signature)

```tsx
import { SeoPageData } from '@/lib/seo/types';
import { SeoHero } from './SeoHero';
import { SignalCard } from './SignalCard';
import { ScamAlert } from './ScamAlert';
import { SeoFAQ } from './SeoFAQ';
import { SeoCTA } from './SeoCTA';
import { RelatedPagesGrid } from './RelatedPagesGrid';

export function SeoPageTemplate({ data }: { data: SeoPageData }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav (réutiliser le composant Navbar existant) */}
      <SeoHero data={data.hero} />

      {/* Section 2 — Contexte */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="prose prose-invert max-w-none">
          {data.intro.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>

      {/* Section 3 — 5 signaux */}
      <section id="guide" className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="font-heading text-2xl font-bold sm:text-3xl">
          {data.signalsSection.title}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {data.signalsSection.signals.map((s, i) => (
            <SignalCard key={i} signal={s} index={i} />
          ))}
        </div>
      </section>

      {/* Section 4 — Arnaques (Cat 2 only) */}
      {data.scamsSection && (
        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            {data.scamsSection.title}
          </h2>
          <div className="mt-8 space-y-4">
            {data.scamsSection.scams.map((s, i) => (
              <ScamAlert key={i} scam={s} />
            ))}
          </div>
        </section>
      )}

      {/* Section 5 — CTA intermédiaire */}
      <SeoCTA variant="inline" productType={data.productType} />

      {/* Section 6 — FAQ */}
      <SeoFAQ faqs={data.faqs} />

      {/* Section 7 — Pages connexes */}
      <RelatedPagesGrid pages={data.relatedPages} />

      {/* Section 8 — CTA final */}
      <SeoCTA variant="final" productType={data.productType} />

      {/* Footer existant */}
    </div>
  );
}
```

### 7.4 Dimensionnement build-time

- **Cat 2** : 6 plateformes × ~50 marques filtrées par catégorie supportée ≈ **240 pages** → `generateStaticParams` OK en build (< 30s surcharge).
- **Cat 1** : 40 marques × 25 modèles ≈ **1 000 pages** → toujours OK en build statique.
- **Cat 3** : 40 marques × ~18 signaux ≈ **720 pages** → OK.

**Build total projeté** : ~2 000 pages statiques → ajoute ~90s au `pnpm build` actuel. Acceptable.

**Fallback** : si build devient trop lent, basculer `dynamicParams = true` + `revalidate = 604800` (ISR 7j) pour générer à la volée.

---

## 8. CTA & conversion vers 3,99 €

### 8.1 3 emplacements CTA par page

| # | Position | Variant | Copy | Attendu |
|---|----------|---------|------|---------|
| 1 | Hero (above-fold) | Primary button | "Analyser ma {productType} — 3,99 €" | CTR 8-12% |
| 2 | Milieu (après signaux) | Inline card glassmorphism | "Un doute ? IA en 60 secondes — 3,99 €" | CTR 4-7% |
| 3 | Final (avant footer) | Full-width CTA | "Achetez l'esprit tranquille" + pricing | CTR 3-5% |

### 8.2 Composant `SeoCTA` — variant `inline`

```tsx
<div className="mx-auto my-16 max-w-2xl px-4">
  <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 backdrop-blur-xl">
    <div aria-hidden className="pointer-events-none absolute -top-16 right-0 size-48 rounded-full bg-emerald-500/10 blur-3xl" />
    <div className="relative">
      <div className="inline-flex size-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
        <Sparkles className="size-6 text-emerald-400" />
      </div>
      <h3 className="mt-4 font-heading text-xl font-bold">
        Un doute sur votre {productType} ?
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Notre IA analyse vos photos en 60 secondes et vous donne un score d'authenticité détaillé. Pas de certification, juste une estimation fiable pour vous rassurer avant l'achat.
      </p>
      <div className="mt-5 flex items-center gap-4">
        <Link
          href={`/check/new?source=seo&ref=${slug}`}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-semibold text-white hover:bg-emerald-400"
        >
          Lancer l'analyse — 3,99 €
          <ArrowRight className="size-4" />
        </Link>
        <span className="text-xs text-muted-foreground">Paiement unique · Résultat en 60s</span>
      </div>
    </div>
  </div>
</div>
```

### 8.3 Tracking conversion

Ajouter `?source=seo&ref={plateforme}-{marque}` sur tous les CTA SEO pour :
- mesurer CTR par page
- mesurer conversion par combinaison
- alimenter `credits_transactions.metadata.seo_ref` en DB

---

## 9. Internal linking architecture

### 9.1 Modèle hub & spoke

```
/acheter-authentique (hub principal Cat 2)
├── /acheter-authentique/vinted (hub plateforme)
│   ├── /acheter-authentique/vinted/jordan (feuille)
│   ├── /acheter-authentique/vinted/louis-vuitton (feuille)
│   └── ... 50 marques
└── /acheter-authentique/vestiaire-collective
    └── ...
```

### 9.2 Cross-linking entre Cat 1 / 2 / 3

Sur chaque page Cat 2, bloc "Pages connexes" avec :
- 2-3 liens Cat 1 même marque (`/legit-check/jordan/jordan-1`, `/legit-check/jordan/jordan-4`)
- 2-3 liens Cat 2 même plateforme, autres marques (`/acheter-authentique/vinted/nike`)
- 1-2 liens Cat 3 même marque (`/guide/jordan/box-label`)

**Total : 8-12 liens internes par page**. Algorithmique (pas codé à la main).

### 9.3 Breadcrumbs

Toujours présents en haut de page + schema.org BreadcrumbList.

---

## 10. Indexation & sitemaps

### 10.1 Sitemaps segmentés

Un sitemap par catégorie pour faciliter le monitoring :
- `/sitemap-cat2-acheter.xml` — ~300 URLs
- `/sitemap-cat1-legit-check.xml` — ~1000 URLs (M3)
- `/sitemap-cat3-guides.xml` — ~700 URLs (M5)
- `/sitemap.xml` — index pointant vers les 3

### 10.2 Robots.txt

```
User-agent: *
Allow: /acheter-authentique/
Allow: /legit-check/
Allow: /guide/
Disallow: /dashboard/
Disallow: /api/
Sitemap: https://legitvision.fr/sitemap.xml
```

### 10.3 Rollout progressif pour éviter spam flags

Ne pas publier 300 pages d'un coup :
- **Semaine 1** : 30 pages top-volume (Vinted × 30 marques populaires)
- **Semaine 2-3** : +90 pages (Vestiaire + Leboncoin)
- **Semaine 4** : +180 pages restantes
- **Semaine 5** : soumission explicite à Google Search Console

---

## 11. Roadmap

| Sprint | Durée | Livrable |
|--------|-------|----------|
| **S1** | 1 sem | Data model + 6 plateformes + 10 marques seed + composants template |
| **S2** | 1 sem | Route Cat 2 + generateStaticParams + schemas + 30 pages publiées |
| **S3** | 1 sem | Intro generator + content fragments + 90 pages cumulées |
| **S4** | 1 sem | 50 marques complètes × 6 plateformes = 240 pages Cat 2 |
| **S5** | 1 sem | Tracking conversion + A/B test CTA + fixes SEO techniques |
| **S6** | 1 sem | Audit post-lancement + optimisation pages top-10 positions |

**Go / no-go S3** : si aucune page n'est indexée après 3 semaines, pause et audit technique.

---

## 12. Quality checklist avant mise en prod (par page)

**Contenu**
- [ ] Intro ≥ 200 mots, unique (similarity cosine < 0,75 vs sœurs)
- [ ] 5 signaux d'authentification ≥ 80 mots chacun
- [ ] 3-5 arnaques plateforme-specific (Cat 2)
- [ ] 6-8 FAQ avec réponses ≥ 60 mots
- [ ] Total ≥ 1 200 mots visibles

**Technique SEO**
- [ ] Title unique (max 60 car)
- [ ] Meta description unique (max 155 car)
- [ ] Canonical absolu
- [ ] H1 unique avec keyword primaire
- [ ] H2/H3 hiérarchiques sans skip de niveau
- [ ] Schema HowTo + FAQPage + BreadcrumbList validés
- [ ] Open Graph image 1200×630 px
- [ ] Images avec `alt` descriptif, `width`/`height`, `loading="lazy"` (sauf above-fold)

**Interne & UX**
- [ ] 8-12 liens internes pertinents
- [ ] 3 CTA vers /check/new avec tracking param
- [ ] Temps de chargement < 2s (Lighthouse ≥ 90)
- [ ] Core Web Vitals verts
- [ ] Mobile-first OK (80% du trafic)

---

## 13. Risques & mitigations

| Risque | Impact | Mitigation |
|--------|--------|-----------|
| Thin content → pénalité Manual Action | 🔴 Critique | Intro unique ≥ 200 mots + stat propriétaire + rollout progressif |
| Cannibalisation entre Cat 1 (modèle) et Cat 2 (marque) | 🟡 Moyen | Intents distincts (pré-achat vs check) + internal linking hiérarchique |
| Keyword stuffing accidentel | 🟡 Moyen | Densité target 0,8-1,5 % / keyword primaire, vérif via script |
| Coût build Vercel dépassé | 🟢 Faible | Passer à ISR si > 2 000 pages |
| Concurrence legitcheck.app arrive en FR | 🟡 Moyen | Fossé : data propriétaire + tarif 3,99 € imbattable + SEO avantage primauté |

---

## 14. Hors scope v1

- Multi-langue (EN/ES/IT) — réservé v2 si traction FR prouvée
- User-generated content (reviews) — activable M6 avec vrais utilisateurs
- AI-generated intros — interdit v1 (anti-thin-content strict)
- Pages profile "vendeur de confiance" — idée v3

---

## 15. Validation requise avant dev

- [ ] Hector valide la liste des 6 plateformes : **Vinted, Vestiaire Collective, Leboncoin, eBay, Wallapop, Facebook Marketplace**
- [ ] Hector valide les 10 premières marques seed (suggestion : Nike, Jordan, Adidas, Louis Vuitton, Chanel, Hermès, Rolex, Gucci, Dior, Prada)
- [ ] Hector valide le domaine final (`legitvision.fr` ? `legitvision.vercel.app` restera canonical ?)
- [ ] Go / no-go Sprint 1
