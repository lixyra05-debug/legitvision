-- ============================================================
-- LegitVision — Migration 002 : Stripe & crédits
-- ============================================================

-- 1. Ajout stripe_customer_id sur profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE;

-- 2. Mise à jour de la contrainte subscription_plan pour inclure 'business'
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_subscription_plan_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_plan_check
    CHECK (subscription_plan IN ('free', 'starter', 'pro', 'business'));

-- 3. Index pour retrouver rapidement un profil par customer Stripe
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
  ON public.profiles(stripe_customer_id);

-- 4. Mise à jour du trigger handle_new_user :
--    Accorder 3 crédits gratuits à l'inscription + logger la transaction
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, credits_remaining)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'avatar_url', ''),
    3 -- 3 crédits offerts à l'inscription
  );

  -- Tracer le crédit initial dans l'historique
  INSERT INTO public.credits_transactions (user_id, type, amount, balance_after, description)
  VALUES (new.id, 'bonus', 3, 3, 'Crédits offerts à l''inscription (plan Free)');

  RETURN new;
END;
$$;
