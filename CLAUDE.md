# CLAUDE.md — Projet Authentification Luxe par IA
# Ce fichier est lu automatiquement par Claude Code à chaque session.

## Projet
Nom de code : LegitVision (nom temporaire)
Description : Application web d'authentification d'articles de luxe par IA (sneakers, sacs, montres, vêtements)
Fondateurs : Hector + associé
Localisation : Paris, France

## Stack Technique
- **Framework** : Next.js 14 (App Router, TypeScript, Server Components)
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
│   │   ├── server.ts       # Client Supabase (server)
│   │   └── middleware.ts    # Auth middleware
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

## Flux Principal (Happy Path)
1. User se connecte → /dashboard
2. User clique "Nouvelle analyse" → /check/new
3. Step 1 : Choix catégorie (sneakers/sac/montre/vêtement)
4. Step 2 : Choix marque + modèle (search autocomplete)
5. Step 3 : Upload guidé (8-12 photos selon protocole, avec preview + validation qualité)
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

## Commandes Utiles
```bash
pnpm dev          # Dev server
pnpm build        # Build production
pnpm lint         # ESLint
pnpm db:push      # Push Supabase migrations
pnpm db:generate  # Generate types from Supabase
```
