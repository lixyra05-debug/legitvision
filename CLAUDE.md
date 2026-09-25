# CLAUDE.md — Projet Authentification Luxe par IA
# Ce fichier est lu automatiquement par Claude Code à chaque session.

## Projet
Nom de code : LegitVision (nom temporaire)
Description : Application web d'authentification d'articles de luxe par IA (sneakers, sacs, montres, vêtements)
Fondateurs : Hector + associé
Localisation : Paris, France

## Stack Technique
- **Framework** : Next.js 16 (App Router, TypeScript, Server Components) + React 19
- **Styling** : Tailwind CSS + shadcn/ui
- **Backend** : Supabase (Auth, PostgreSQL, Storage, Edge Functions, Realtime)
- **Paiement** : Stripe (Checkout, Webhooks, système de crédits)
- **IA** : API Anthropic Claude Vision (claude-opus-4-8) — voir skill claude-vision-expert
- **Orchestration** : n8n (pipeline IA, notifications, HITL)
- **Déploiement** : Vercel
- **Package Manager** : pnpm

## Architecture du Projet
```
/
├── app/
│   ├── (public)/           # Pages publiques (landing, pages SEO)
│   │   └── page.tsx        # Landing page
│   ├── (auth)/             # Pages auth
│   │   └── auth/page.tsx   # Login / Register
│   ├── (dashboard)/        # Pages protégées (auth required)
│   │   ├── dashboard/page.tsx
│   │   └── check/
│   │       ├── new/page.tsx        # Nouvelle analyse (stepper 3 étapes)
│   │       └── [id]/page.tsx       # Rapport d'analyse
│   ├── api/
│   │   ├── analyze/route.ts        # Endpoint analyse IA
│   │   ├── webhooks/
│   │   │   └── stripe/route.ts     # Webhook Stripe
│   │   └── credits/route.ts        # Gestion crédits
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                 # Composants shadcn/ui
│   ├── auth/               # Composants auth
│   ├── check/              # Composants analyse
│   │   ├── PhotoUploader.tsx    # Upload guidé photo par photo
│   │   ├── CategoryPicker.tsx   # Choix catégorie/marque/modèle
│   │   ├── ScoreGauge.tsx       # Jauge de score visuelle
│   │   ├── FindingCard.tsx      # Carte d'observation
│   │   └── ReportView.tsx       # Vue complète du rapport
│   ├── dashboard/          # Composants dashboard
│   └── layout/             # Header, Footer, Sidebar
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Client Supabase (browser)
│   │   └── server.ts       # Client Supabase (server)
│   ├── stripe/
│   │   ├── client.ts       # Stripe client
│   │   └── config.ts       # Produits et prix
│   ├── ai/
│   │   ├── analyze.ts      # Fonction d'analyse vision
│   │   ├── prompts.ts      # System + User prompts
│   │   └── scoring.ts      # Calcul score pondéré
│   ├── utils.ts
│   └── types.ts            # Types TypeScript globaux
├── supabase/
│   └── migrations/         # Migrations SQL
├── public/
│   └── guides/             # Images guides photo
├── proxy.ts                # Auth (ex-middleware.ts, runtime Node depuis Next 16)
├── CLAUDE.md               # Ce fichier
└── .env.local              # Variables d'environnement
```

## Base de Données (Supabase PostgreSQL)
Tables principales :
- `profiles` : extension de auth.users (role, credits_remaining, subscription_plan)
- `brands` : marques supportées (name, category, photo_protocol JSONB)
- `models` : modèles par marque (authentication_points JSONB)
- `analyses` : chaque analyse (scores, verdict, findings JSONB, status)
- `analysis_photos` : photos par analyse (storage_path, photo_type, quality_check)
- `credits_transactions` : historique crédits (type, amount, balance_after)

RLS OBLIGATOIRE sur toutes les tables. Un user ne voit que ses propres données.

## Variables d'Environnement Requises
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## Design System
- **Thème** : Dark mode premium (fond #0A0A0B, cartes #141416, accent emerald-500)
- **Typographie** : Inter pour le body, Space Grotesk pour les titres
- **Couleurs de score** : emerald (90-100), yellow (70-89), orange (50-69), red (0-49)
- **Style** : inspiration StockX/GOAT — propre, minimal, premium
- **Mobile-first** : 80% des utilisateurs seront sur mobile

## Conventions de Code
- TypeScript strict (no any)
- Server Components par défaut, "use client" seulement quand nécessaire
- Composants dans /components, logique dans /lib
- Nommage : PascalCase composants, camelCase fonctions, UPPER_SNAKE constantes
- Utiliser les Server Actions pour les mutations simples
- Zod pour la validation des inputs
- Pas de console.log en production — utiliser un logger

## Règles Critiques
1. JAMAIS écrire "certifié authentique" ou "garanti" — toujours "estimation", "probabilité", "score de confiance"
2. TOUJOURS vérifier les crédits avant de lancer une analyse
3. TOUJOURS valider la qualité des photos avant envoi à l'API (résolution min 800x800, format JPEG/PNG/WebP)
4. Les photos sont stockées dans Supabase Storage bucket "analysis-photos" avec path: {user_id}/{analysis_id}/{photo_type}.jpg
5. L'API route /api/analyze ne doit JAMAIS exposer la clé API Anthropic au client
6. Stripe webhooks doivent être vérifiés avec la signature
7. Le scoring utilise une moyenne pondérée (voir lib/ai/scoring.ts)
8. Toujours gérer le cas où l'API Vision retourne une erreur ou un JSON invalide
9. Les chiffres affichés — marques et modèles analysables, durée d'analyse, prix, quotas des formules, zones, points — viennent de `lib/site-facts.ts`, la source unique. Ne jamais les écrire à la main dans un texte : les lire depuis ce fichier (`facts()` pour les textes, `PRICES` / `CATALOG` pour les valeurs brutes). Une valeur ne change qu'après une nouvelle mesure, datée dans ce fichier.
10. Les comptes des guides SEO (guides modèle, signal, plateforme × marque, plateformes, marques, étapes, signaux par guide) sont CALCULÉS depuis `lib/seo/data` par `lib/seo/seo-facts.ts`. Jamais écrits à la main, même dans un titre ou une image OG.
11. Aucune statistique sans source dans le contenu (SEO compris) : proportion ou probabilité de contrefaçons, efficacité d'un signal, taux, volumes, chiffres d'affaires, évolutions de prix en %, classements « les plus contrefaits / populaires ». « Selon les estimations » ou « selon les douanes » ne sont pas des sources. Le 2026-09-25, toutes celles du contenu SEO ont été retirées ; n'en remettre une qu'avec sa source citée et vérifiée. Restent permis : mesures d'objet, prix, règles publiées par une plateforme ou une marque, seuils de conseil.
12. Les photos d'analyse sont supprimées `PHOTO_RETENTION_DAYS` jours (30) après leur envoi par la purge quotidienne (`lib/purge-photos.ts`, route `/api/cron/purge-photos` appelée par Vercel Cron, `CRON_SECRET` requis). La politique de confidentialité le promet : ne jamais afficher de photo dans un rapport ni en garder de copie ailleurs ; quand la revue expert existera, la faire avant l'échéance.
13. Le nombre de photos affiché vient du protocole de la ligne de marque (`brands.photo_protocol` : emplacements obligatoires, puis au total), jamais de `models.min_photos` / `max_photos`, qui ne sont pas tenus à jour.
14. Contenu d'authentification : une couleur, une date, une gravure ou un résultat de scan présentés comme obligatoires font soupçonner des articles authentiques. N'en écrire qu'avec une source vérifiée (corrigés le 2026-09-25 : fermoir du 2.55 et du Classic Flap, pieds du GST, codes millésime Hermès, puce LV).

## Flux Principal (Happy Path)
1. User se connecte → /dashboard
2. User clique "Nouvelle analyse" → /check/new
3. Step 1 : Choix catégorie (sneakers/sac/montre/vêtement)
4. Step 2 : Choix marque + modèle (search autocomplete)
5. Step 3 : Upload guidé (6-11 photos selon le protocole de la ligne de marque — sneakers 8-11, sacs 10-11, vêtements 6-8, relevé du 2026-09-25 sur les lignes ayant un modèle analysable — avec preview + validation qualité)
6. User confirme → débit 1 crédit → POST /api/analyze
7. API route : fetch photos Supabase → build payload → call Claude Vision → parse JSON → calcul score → save en DB → update status
8. User voit le rapport → /check/[id] avec score, sous-scores, findings, recommandations
9. Si score entre 40-60 OU confiance "low" → flag pour expert review

## Phase Actuelle : EN PRODUCTION
En prod : Landing, Auth, Dashboard, Nouvelle analyse (stepper + upload), Rapport, route API analyze, **paiements Stripe** (achat unique + abonnements Pro/Business).
PAS ENCORE : Admin panel, HITL, notifications email transactionnelles (stub `lib/emails/send.ts`, non branché).

## Audit 2026-06-21 — les 3 P0 sont RÉSOLUS (déployés en prod)
- **P0-1 — Webhook Stripe** ✅ RÉSOLU. Avant : aucun endpoint enregistré → les clients payaient sans recevoir crédits/plan (`stripe_events` vide). Endpoint créé sur le compte **LYXIRIA `acct_1SITaCCMKNVmORd6`** (mode LIVE) → `https://legitvision.vercel.app/api/webhooks/stripe`, events `checkout.session.completed` + `invoice.paid` + `customer.subscription.deleted`. Vérifié en prod (2026-06-22) : `checkout.session.completed` reçu et enregistré dans `stripe_events`, crédit ajouté automatiquement (`credits_transactions`). Testé en réel.
- **P0-2 — Modèle Claude Vision** ✅ RÉSOLU. `claude-sonnet-4-20250514` était retiré (404 sur chaque analyse). Remplacé dans `lib/ai/analyze.ts` par `claude-opus-4-8` + `thinking: { type: "adaptive" }` (les modèles 4.6+ rejettent `budget_tokens`).
- **P0-3 — Faille RLS `profiles`** ✅ RÉSOLU. La policy UPDATE de `profiles` n'avait aucune restriction de colonne → un user pouvait se mettre `role='admin'` / crédits illimités / changer de plan (escalade + fuite cross-tenant). Fix en prod : fonction `lock_privileged_profile_cols()` + trigger `guard_profiles` (BEFORE UPDATE, bloque toute modif de `role`/`credits_remaining`/`subscription_plan`/`stripe_*` hors `service_role`). Audit prod confirmé : **0 compte compromis**.

Autres correctifs déployés (post-audit) : route `/auth/callback` (OAuth Google), suppression du dossier `pages/` legacy (404 blanches → `app/not-found.tsx`), fix paiement iOS Safari (navigation top-level vers `/checkout`), CTA pricing `/pricing` (404) → `/#pricing`.
P1 restants connus : catégorie « montres » absente du CategoryPicker, photos HEIC iPhone, double-abonnement à l'upgrade Pro↔Business.

## Catalogue — état au 2026-09-25, après le SQL de rattachement

La base Supabase (`brands`, `models`) est la référence. Relevé du 2026-09-25 en lecture publique, après
`supabase/scripts/2026-09-25-rattachement-modeles.sql` (exécuté par Hector) :

| | lignes | analysables |
|---|---|---|
| `brands` | 80 lignes : une par marque ET par catégorie, dont 8 de montres | 56 noms de marque, 70 lignes |
| `models` | 494 actifs, dont 10 montres et 10 sans point | 474 |

Le site n'affiche que l'analysable (règle de `lib/analyzable.ts` : modèle actif, marque active hors
montres, au moins un point d'authentification), lu dans `lib/site-facts.ts` : 56 marques et 474 modèles,
jamais 80 ni 494. « Rien n'est affiché s'il n'est pas prouvé vrai. »

**Résolu le 2026-09-25 :**
- 43 modèles porteurs de points de sneaker ou de vêtement, rangés sous `bag`, rattachés à la ligne de
  leur catégorie ; 35 jumeaux sans point désactivés. Le jumeau de Dior B30, référencé par une analyse,
  reste actif (slug `b30-sans-point`) et invisible dans la sélection.
- Protocoles photo des 12 lignes créées le 2026-04-14 : emplacements obligatoires posés (sneakers 7/8,
  vêtements 5/6). Avant, une analyse pouvait partir sans les photos prévues.
- Lignes `clothing` créées pour Nike, adidas et Prada (protocole vêtements) : 9 modèles y sont rangés.
- « Prada Re-Nylon Bag Pack » désactivé : points de vêtement sur un sac.
- Tuiles de la landing (`BrandsTabs`) : comptes lus en base par ligne (`lib/catalog-counts.ts`, ISR 1 h) ;
  une tuile n'apparaît que si sa ligne a un modèle analysable. Aucun compteur écrit à la main.
- Pré-sélection `/check/new` : la recherche (`BrandSearch`) transmet la catégorie de la ligne. Sans
  catégorie, la ligne qui porte le modèle demandé l'emporte, sinon la plus ancienne (les sacs pour les
  maisons de luxe). La sélection survit à la connexion (proxy → `/auth?redirect=`).
- Libellés : `BrandsTabs` et les guides SEO envoient `Jordan`, le nom en base (`checkBrand`) ;
  `BrandSearch` traduit `bag` (clés au singulier).
- Off-White et BAPE, présentes en base uniquement en `sneakers` : les pages SEO générales de la marque
  envoient vers ses sneakers (`checkCategory`) ; les pages consacrées à un vêtement n'ont pas de bouton.

**Reste ouvert :**
- 10 modèles actifs sans point d'authentification, exclus de la sélection jusqu'à ce qu'ils en reçoivent.
  Lignes sans modèle analysable : Essentials (`clothing`), Balenciaga (`sneakers`).
- Off-White et BAPE en `clothing` : lignes à créer avec leurs modèles (Off-White est d'abord une marque de
  vêtements, très contrefaite), puis remettre tuiles et boutons.
- `models.min_photos` / `max_photos` ne correspondent pas aux protocoles : ne pas les afficher (règle 13).
- `public/images/brands` n'a pas de logo pour toutes les marques (repli texte dans `BrandsTabs`).

## Commandes Utiles
```bash
pnpm dev          # Dev server
pnpm build        # Build production
pnpm lint         # ESLint
pnpm db:push      # Push Supabase migrations
pnpm db:generate  # Generate types from Supabase
```
