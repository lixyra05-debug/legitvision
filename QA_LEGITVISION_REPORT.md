# QA LegitVision — Rapport d'audit Production Readiness

**Date** : 2026-05-07
**Lead Agent** : Claude Opus 4.7 (QA Lead Engineer mode)
**Sous-agents dispatch** : 3 parallèles (E2E Playwright / Backend Logic / Security RLS)
**Skills consommés** : `webapp-testing` (alternative Playwright manuelle), `systematic-debugging`
**Validations Hector** : R2 confirmé (auto-fix mineurs), R3 confirmé (validation préalable bugs majeurs)

---

## 🎯 Score final Production Readiness : **94/100**

| Catégorie | Score | Pondération |
|---|---|---|
| Tests E2E (Playwright) | 20/20 | ✅ |
| Sécurité (secrets + RLS + Storage) | 24/25 | ✅ après mig 017 |
| Logic robustness (race, idempotence, error handling) | 24/25 | ✅ |
| UI/UX (Dark Premium, mobile, i18n) | 15/15 | ✅ |
| DevOps (build, deploy, env vars, hooks) | 11/15 | ⚠️ env vars Stripe à compléter Vercel + mig 017 à exécuter |
| **TOTAL** | **94/100** | **Prod-ready conditionnel** |

**Bloquant restant pour mise en prod** :
1. ⚠️ Exécuter manuellement `supabase/migrations/017_fix_rls_security.sql` dans Supabase SQL Editor
2. ⚠️ Vérifier dans Vercel que `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_*_PRICE_ID`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` sont bien configurés en production
3. ⚠️ Configurer le webhook Stripe (Dashboard → Developers → Webhooks) sur `https://legitvision.vercel.app/api/webhooks/stripe`

---

## 1. Happy paths testés (Playwright E2E)

**Setup** : `@playwright/test 1.59.1`, chromium, dev server `localhost:3000`, projets `desktop (1280×720)` + `mobile (375×667)`.

**Résultats** : **18/18 tests PASS** (9 tests × 2 viewports).

### tests/e2e/landing.spec.ts (6 tests)
| # | Test | Verdict |
|---|---|---|
| 1 | Landing renders (H1 visible, lien `/auth?redirect=...`) | ✅ |
| 2 | Navbar elements (logo, ThemeToggle, LanguageToggle, UserMenu) | ✅ |
| 3 | Footer i18n links (`/mentions-legales`, `/cgu`, `/confidentialite`) | ✅ |
| 4 | Theme toggle works (`<html>` switch dark↔light) | ✅ |
| 5 | Language toggle works (FR↔EN, H1 change) | ✅ |
| 6 | Mobile responsive 375×667 (no overflow, logo visible) | ✅ |

### tests/e2e/auth-guard.spec.ts (3 tests)
| # | Test | Verdict |
|---|---|---|
| 1 | `/check/new` sans auth → redirect 307 → `/auth?redirect=%2Fcheck%2Fnew` | ✅ |
| 2 | `/dashboard` sans auth → redirect 307 → `/auth?redirect=%2Fdashboard` | ✅ |
| 3 | `/auth` page renders (input email, formulaire) | ✅ |

### Charte Dark Premium vérifiée
- ✅ `<html class="dark">` au mount initial (script inline avant React, anti-FOUC)
- ✅ Variables CSS conformes : `--bg-primary: #0A0A0B`, `--bg-card: #141416`, `--accent: #10B981`
- ✅ Glassmorphism actif : `backdrop-filter: blur(20px) saturate(150%)`
- ✅ Grain texture conditionnée (0.025 dark, 0.015 light)

### Screenshots de référence
- `tests/e2e/screenshots/landing-dark-desktop.png`
- `tests/e2e/screenshots/landing-light-desktop.png`
- `tests/e2e/screenshots/landing-mobile-375.png`
- `tests/e2e/screenshots/auth-page-desktop.png`

(Gitignorés — non commit, regénérables via `npx playwright test`)

---

## 2. Bugs corrigés (R2 auto-fix + R3 validés)

### Failles RLS / Storage (CRITIQUES — fixées via migration 017)

| ID | Sévérité | Fichier | Description | Action |
|---|---|---|---|---|
| **B-RLS-1** | 🔴 Critique | `supabase` policy `service_update_analyses` | `qual=true` sur PUBLIC → un user pouvait UPDATE l'analyse d'un autre (manipulation scores/verdict) | DROP + CREATE `analyses_update_own` (`auth.uid() = user_id`) |
| **B-RLS-2** | 🔴 Critique | `supabase` policy `service_insert_credits` | `with_check=true` sur PUBLIC → user pouvait s'auto-créditer avec amount arbitraire | DROP — service_role bypass RLS pour les insertions code |
| **B-RLS-3** | 🔴 Critique | `storage.buckets.analysis-photos` | Bucket PUBLIC + policy ALL ouverte → anyone (anon) GET les photos privées (OCR sensible) | `public=false` + DROP policies + 4 nouvelles policies scopées `auth.uid()::text = (storage.foldername(name))[1]` |

### Webhook Stripe (CRITIQUE — fixé code)

| ID | Sévérité | Fichier:ligne | Description | Action |
|---|---|---|---|---|
| **B-WHK-8** | 🔴 Critique | `app/api/webhooks/stripe/route.ts:306-310` | Insertion `stripe_events` AVANT le switch → si erreur runtime, event marqué traité, Stripe ne retente pas, user paye sans crédit | Catch global → `DELETE FROM stripe_events WHERE id = event.id` + return 500 → permet retry Stripe |

### Race condition crédits (CRITIQUE — fixée RPC)

| ID | Sévérité | Fichier | Description | Action |
|---|---|---|---|---|
| **B-RACE** | 🟠 Majeure | `app/api/analyze/route.ts:202-219` | TOCTOU : 2 POST simultanés (analysisIds différents) pouvaient passer le check à 1 crédit et débiter à 0 chacun (2 analyses pour 1 crédit) | Migration 017 : RPC `decrement_credits_atomic(p_user_id, p_analysis_id, p_description)` avec `UPDATE ... WHERE credits_remaining >= 1 RETURNING` (atomique row-level lock). API route appelle le RPC au lieu du Promise.all manuel. |

### Décisions business (R3 — validées Hector)

| ID | Décision | Action code |
|---|---|---|
| **B-BIZ-1** | Option A : zéro crédit gratuit à la résiliation | Retiré le bloc `customer.subscription.deleted` qui donnait 3 crédits + tx bonus. User repasse à plan "free" sans bonus. |
| **B-BIZ-2** | Option A : aligner code sur marketing (Pro=10, Business=50) | `lib/stripe/config.ts` : `PLAN_CREDITS.pro=10`, `PLAN_CREDITS.business=50`. Retiré `bypass isBusinessPlan` dans `/api/analyze`. Retiré branche "illimité" dans `invoice.paid`. |

### Bugs mineurs (R2 — auto-fix appliqué)

| # | Fichier:ligne | Description | Fix |
|---|---|---|---|
| M1 | `lib/ai/analyze.ts:181-198` | Pas de validation champs JSON requis (NaN possible) | Check `typeof aiResult.overall_score !== "number"` + `!aiResult.sub_scores` → throw `INVALID_RESPONSE` |
| M2 | `lib/ai/analyze.ts:163-169` | Pas de check `stop_reason === "max_tokens"` | Throw `AnalysisError MAX_TOKENS` avant le find textBlock |
| M3 | `app/api/analyze/route.ts:184` | Storage path leaké dans message d'erreur | `"Impossible de télécharger une photo. Réessayez."` (sans interpolation) |
| M4 | `app/api/stripe/checkout/route.ts:92` | `session.url` peut être null sans guard | `if (!session.url) return 500 "URL manquante"` avant return |
| M5 | `app/(dashboard)/check/new/page.tsx:362-372` | Banner `?error=stripe_unavailable` invisible si user a des crédits | Banner ajouté en haut du `<main>` (visible dans tous les états) |
| M6 | `app/checkout/page.tsx:60-78` | Stripe instancié localement au lieu du singleton | `import { stripe, getOrCreateCustomer }` du `lib/stripe/server` |
| M7 | `lib/ai/analyze.ts:22-23` | Type `confidence_level: string` trop lâche | Union literal `"high" \| "medium" \| "low" \| "insufficient"` + verdict idem |
| M8 | `lib/i18n/LanguageProvider.tsx:60-68` | `<html lang>` ne changeait pas au mount initial | `document.documentElement.lang = stored` dans le useEffect réconciliation |

### Infrastructure ajoutée

| Fichier | Description |
|---|---|
| `.claude/settings.json` | Hook `PostToolUse` matchant `Edit\|Write\|MultiEdit` → `npx tsc --noEmit` (timeout 60s) |
| `playwright.config.ts` | Config minimaliste : 2 projets desktop+mobile, retries 0, headless |
| `tests/e2e/landing.spec.ts` | 6 tests landing (H1, navbar, footer, theme, lang, mobile) |
| `tests/e2e/auth-guard.spec.ts` | 3 tests redirect middleware |
| `tests/e2e/screenshots.spec.ts` | Génération de 4 screenshots de référence |
| `.gitignore` | Ajout `/test-results`, `/playwright-report`, `/tests/e2e/screenshots` |
| `supabase/migrations/017_fix_rls_security.sql` | Migration SQL : 3 fixes RLS critiques + bucket privé + 4 policies storage + RPC `decrement_credits_atomic` |

---

## 3. Bugs flaggés (non-bloquants ou hors scope)

| # | Fichier | Description | Impact | Recommandation |
|---|---|---|---|---|
| F1 | Webhook Stripe — labels emails | `app/api/webhooks/stripe/route.ts:11-12` mentionnait `(10 analyses)` / `(50 analyses)` (déjà corrects après B-BIZ-2) | Cosmétique | Aucune action — alignés avec PLAN_CREDITS |
| F2 | `lib/stripe/server.ts:48-52` | `getPlanFromPriceId` ne reconnaît pas `single` (mais OK car appelé uniquement pour `invoice.paid` = subscriptions) | Architecture | Ajout commentaire si nécessaire |
| F3 | Photos orphelines après logout | Si user logout pendant upload, photos restent dans Storage | Stockage | Job cron quotidien nettoyant photos liées à analyses `failed` > 24h |
| F4 | Magic link cliqué 2× | 2e clic → `error=callback_error` côté UX | Cosmétique | Acceptable (1er onglet a déjà la session) |
| F5 | `<html lang>` SEO | OK depuis M8 mais pas critical pour FR-only SEO | i18n SEO | Si extension multi-langue SEO, ajouter `<link rel="alternate" hreflang>` |

---

## 4. Vérifications passées (✅)

### Sécurité secrets
- ✅ `ANTHROPIC_API_KEY` jamais importé dans `components/**`, `app/(public)/**`, `app/(dashboard)/**` (grep exhaustif)
- ✅ `getAnthropicClient()` lazy + 500 explicite si absent
- ✅ `getStripe()` lazy + throw "STRIPE_SECRET_KEY is not set"
- ✅ Service role `createAdminClient()` réservé code serveur (`/api/**`, server components)
- ✅ Auth callback : validation `next` (`startsWith("/")`, pas `//`, pas `://`)

### Robustesse API
- ✅ `/api/analyze` : auth user vérifiée AVANT toute opération
- ✅ Race guard 5b (autre `analyzing` <30s pour cet user → 429)
- ✅ UPDATE atomique status `pending|uploading → analyzing` avec rowcount check (429 si race)
- ✅ try/catch englobe Vision + sauvegarde + status='failed' en cas d'erreur
- ✅ `handleAnalysisError` mappe RATE_LIMITED (429), BAD_REQUEST (400)
- ✅ JSON parsing dans try/catch + validation champs requis (post-M1)

### Webhook Stripe
- ✅ Signature vérifiée via `stripe.webhooks.constructEvent`
- ✅ `STRIPE_WEBHOOK_SECRET` check explicite
- ✅ Idempotence : INSERT atomique `stripe_events` + PG 23505 → 200 duplicate (mig 013)
- ✅ Cleanup en cas d'erreur runtime (B-WHK-8 fix)
- ✅ 3 events : `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`

### Migrations cohérentes
- ✅ 013 : table `stripe_events` PRIMARY KEY (id), RLS enabled
- ✅ 014 : fix brand/model associations (Balenciaga, LV, Dior, Gucci, Prada multi-cat)
- ✅ 015 : Maison Margiela GATS
- ✅ 016 : zéro crédit à l'inscription (`handle_new_user` réécrit)
- ✅ 017 : fix RLS critiques + bucket privé + RPC TOCTOU (à exécuter manuellement)

### Vocabulaire pré-authentification
- ✅ Aucune occurrence de "certifié authentique" / "garanti 100%" / "certification officielle" dans `lib/seo/`, `components/seo/`, `app/(public)/{acheter-authentique,legit-check,guide}/`
- ✅ Faux positif unique dans `lib/ai/prompts.ts:6` (règle interdisant ce vocabulaire au modèle)

### UI/UX
- ✅ Dark mode default + light toggle (script inline anti-FOUC)
- ✅ i18n FR/EN avec localStorage persistance (`legitvision-lang`)
- ✅ ThemeToggle + LanguageToggle visibles dans toutes les navbars (landing + dashboard + check/new + ReportView + subscription)
- ✅ Glassmorphism, scanner-line, pulse-glow, viewfinder corners, grain texture préservés
- ✅ Mobile responsive 375px (pas d'overflow, logo h-12 sm:h-16, navbar flex-col sm:flex-row)
- ✅ Paywall plein écran si 0 crédits + modal race condition au submit

---

## 5. Architecture sécurité résultante

### Flow d'analyse — couches de protection

```
[Frontend mount /check/new]
  └─ creditsLoading=true → spinner
  └─ fetch profile (credits + plan)
  └─ Garde 1 : si !hasCredits → écran paywall plein écran
                 (3 CTA Stripe : single 3,99€ / pro 19,99€ / business 29,99€)
[User clique Lancer l'analyse]
  └─ Garde 2 : showPaywall modal au submit (filet race condition cross-tab)
  └─ POST /api/analyze
       └─ supabase.auth.getUser() → 401 si session invalide
       └─ ANTHROPIC_API_KEY check → 500 si absent
       └─ profile.credits_remaining < 1 → 402
       └─ Race 5b : autre analyse "analyzing" <30s → 429
       └─ Fetch brand/model/photos
       └─ UPDATE atomique status pending|uploading → analyzing → 429 si race
       └─ try {
            Run Claude Vision (max 60s timeout Vercel)
            stop_reason check → MAX_TOKENS si tronqué
            JSON.parse + validation champs requis
            Save results
            RPC decrement_credits_atomic (mig 017) — atomique row-level
          } catch {
            UPDATE status='failed' + 500 with error code
          }
[Webhook Stripe]
  └─ Signature verify → 400 si invalide
  └─ INSERT stripe_events.id → 23505 = 200 duplicate (mig 013)
  └─ try { switch(event.type) ... }
       catch { DELETE stripe_events.id + 500 → permet retry Stripe (B-WHK-8) }
```

### RLS finale (post-mig 017)

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | own + admin | trigger only | own + admin | — |
| `analyses` | own + admin + expert | own (auth.uid()=user_id) | **own (post-fix)** + expert + admin | — |
| `analysis_photos` | own + admin + expert | own (auth.uid()=user_id) | — | — |
| `credits_transactions` | own + admin | **service_role only (post-fix)** | — | — |
| `brands`, `models` | public actifs | admin | admin | admin |
| `stripe_events` | service_role only | service_role only | — | service_role only |
| `storage.objects` (analysis-photos) | **own (post-fix)** | **own (post-fix)** | **own (post-fix)** | **own (post-fix)** |

---

## 6. Score breakdown détaillé

### Tests E2E : **20/20**
- Landing renders : 5/5
- Navbar interactions : 5/5
- Theme/i18n switching : 5/5
- Mobile responsive 375px : 5/5

### Sécurité : **24/25** (post-mig 017)
- Secrets non exposés : 5/5
- RLS profiles : 5/5
- RLS analyses + photos : 5/5 (post-fix B-RLS-1)
- RLS credits + stripe_events : 5/5 (post-fix B-RLS-2)
- Storage bucket : 4/5 (post-fix B-RLS-3, -1 pour cleanup orphelins F3)

### Logic robustness : **24/25**
- API auth + guards : 5/5
- Race conditions (idempotence, atomic) : 5/5 (post-fix B-RACE)
- Error handling JSON + tokens + Stripe : 5/5 (post-fix M1, M2, B-WHK-8)
- Edge cases (auth, photos, webhook) : 5/5
- Cohérence migrations : 4/5 (-1 pour photos orphelines F3)

### UI/UX : **15/15**
- Dark Premium charte : 5/5
- Mobile responsive : 5/5
- i18n FR/EN + accessibility : 5/5

### DevOps : **11/15**
- Build vert (0 erreur, 0 warning, 255 pages) : 4/4
- Hook PostToolUse tsc : 2/2
- Playwright tests automatisés : 2/2
- Env vars Stripe Vercel : **2/4** (à compléter manuellement)
- Migration 017 exécutée : **1/3** (à exécuter manuellement)

---

## 7. Actions manuelles Hector — bloquantes pour mise en prod

### Étape 1 — Exécuter migration 017 dans Supabase SQL Editor
Ouvrir Supabase Dashboard → SQL Editor, coller et exécuter :
```bash
cat ~/legitvision/supabase/migrations/017_fix_rls_security.sql | pbcopy
```
Vérifier après exécution :
```sql
-- Vérifier policy analyses_update_own existe
SELECT policyname FROM pg_policies WHERE tablename='analyses' AND policyname='analyses_update_own';

-- Vérifier bucket privé
SELECT id, public FROM storage.buckets WHERE id='analysis-photos'; -- doit retourner public=false

-- Vérifier RPC créée
SELECT proname FROM pg_proc WHERE proname='decrement_credits_atomic';

-- Vérifier service_insert_credits supprimé
SELECT policyname FROM pg_policies WHERE tablename='credits_transactions' AND policyname='service_insert_credits'; -- doit retourner 0 row
```

### Étape 2 — Vérifier env vars Vercel
Dashboard Vercel → Settings → Environment Variables. Confirmer présence de :
- `STRIPE_SECRET_KEY` (sk_live_...)
- `STRIPE_WEBHOOK_SECRET` (whsec_...)
- `STRIPE_SINGLE_PRICE_ID=price_1TPjRlQUOTEQkgjXdKw3omkm`
- `STRIPE_PRO_PRICE_ID=price_1TPjSnQUOTEQkgjXKX8huAjw`
- `STRIPE_BUSINESS_PRICE_ID=price_1TPjTiQUOTEQkgjXMUTertC8`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...)
- `NEXT_PUBLIC_APP_URL=https://legitvision.vercel.app`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`

### Étape 3 — Configurer webhook Stripe production
Dashboard Stripe → Developers → Webhooks → Add endpoint :
- URL : `https://legitvision.vercel.app/api/webhooks/stripe`
- Events : `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`
- Récupérer le `whsec_` généré et le mettre dans Vercel `STRIPE_WEBHOOK_SECRET`

### Étape 4 — Test post-déploiement
1. Créer un user de test (signup magic link)
2. Vérifier dashboard : `credits_remaining = 0` (cohérent mig 016)
3. Aller sur `/check/new` → écran paywall plein écran (3 CTA Stripe)
4. Cliquer "Analyse unique 3,99 €" → redirige vers Stripe Checkout
5. Test card `4242 4242 4242 4242` → paiement → retour `/dashboard?session_id=...&purchased=single`
6. Vérifier `credits_remaining = 1` après webhook
7. Lancer une analyse → vérifier débit atomique (RPC) → `credits_remaining = 0` post-analyse

---

## 8. Conclusion

Le projet **LegitVision** est désormais **prod-ready à 94/100** sous condition d'exécution des 3 actions manuelles ci-dessus.

**Points forts** :
- Architecture sécurité multi-couches (frontend paywall, middleware, API guards, RLS, atomic RPC)
- Build vert, 255 pages SEO programmatiques générées en 45s
- Tests E2E automatisés (Playwright) intégrés au workflow
- Hook tsc PostToolUse pour catch erreurs TS silencieuses
- Charte Dark Premium intégralement préservée + light mode + i18n FR/EN
- Vocabulaire pré-authentification respecté (jamais "certifié authentique")
- Idempotence webhooks + retry Stripe sur erreur runtime

**Points d'attention restants** (non-bloquants) :
- Cleanup photos orphelines (job cron à mettre en place — F3)
- Coût Claude double en cas de race extrême (2 analyses simultanées) — guard frontend mitige

**Méthodologie** : 3 sous-agents parallèles + Lead Agent consolidator + skill `systematic-debugging` (Iron Law NO FIXES WITHOUT ROOT CAUSE) + R2 (auto-fix mineurs) + R3 (validation Hector pour bugs majeurs avant fix).

---

*Rapport généré par Claude Opus 4.7 — QA Lead Engineer mode*
