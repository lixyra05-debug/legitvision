-- ============================================================
-- LegitVision — Migration 016 : Zéro crédit à l'inscription
--
-- Bug : la fonction handle_new_user() (modifiée par 002_stripe.sql)
-- insère explicitement credits_remaining=3 + crée une transaction bonus
-- de 3 crédits. Conséquence : tous les nouveaux users obtiennent 3 analyses
-- gratuites — non aligné avec le paywall Stripe obligatoire dans /check/new.
--
-- État vérifié via MCP avant écriture (projet ngvdckxdvzkrlekeohoh) :
--   - profiles.credits_remaining DEFAULT déjà à 0 (ALTER idempotent confirmé)
--   - profiles.subscription_plan : NOT NULL DEFAULT 'free' (la branche IS NULL
--     du WHERE ci-dessous est morte mais conservée par défensivité future)
--   - credits_transactions.type CHECK accepte ('purchase','usage','refund','bonus')
--   - Aucune transaction 'purchase' n'existe encore (webhook Stripe non déclenché),
--     mais la clause NOT EXISTS est conservée comme filet de sécurité futur
--   - 8 users : 7 avec crédits > 0 ; UPDATE affectera 4 users (free, pas de
--     stripe_customer_id, pas de purchase tx) ; 3 payeurs préservés (ceux avec
--     stripe_customer_id IS NOT NULL) ; aucun aux plans 'pro'/'business' actuels
--   - app/api/auth/callback/route.ts ne crée pas de profil — le trigger
--     on_auth_user_created est l'unique chemin de création
-- ============================================================

-- Étape 1 : Confirmer DEFAULT à 0 (idempotent)
ALTER TABLE public.profiles
  ALTER COLUMN credits_remaining SET DEFAULT 0;

-- Étape 2 : Réécriture du trigger handle_new_user — plus de crédits offerts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  -- credits_remaining utilise le DEFAULT (0).
  -- Plus d'insertion dans credits_transactions : user commence à 0 crédit.
  -- Le paywall Stripe (/check/new modal) gère la première analyse.
  RETURN new;
END;
$$;

-- Étape 3 : Reset crédits pour les non-payeurs (préserve les payeurs Stripe)
-- Critère "n'a jamais payé" :
--   - pas de stripe_customer_id (jamais passé par checkout)
--   - plan free ou NULL
--   - aucune transaction de type 'purchase' dans l'historique
UPDATE public.profiles p
SET credits_remaining = 0
WHERE p.credits_remaining > 0
  AND p.stripe_customer_id IS NULL
  AND (p.subscription_plan IS NULL OR p.subscription_plan = 'free')
  AND NOT EXISTS (
    SELECT 1 FROM public.credits_transactions ct
    WHERE ct.user_id = p.id AND ct.type = 'purchase'
  );
