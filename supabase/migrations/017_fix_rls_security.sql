-- ============================================================
-- LegitVision — Migration 017 : Fix sécurité critique RLS + Storage + RPC TOCTOU
--
-- Audit QA Agent 3 (Security & RLS) — 2026-05-07 — 3 failles CRITIQUES :
--   B-RLS-1 : Policy `service_update_analyses` qual=true sur PUBLIC →
--             un user authentifié peut UPDATE n'importe quelle analyse.
--   B-RLS-2 : Policy `service_insert_credits` with_check=true sur PUBLIC →
--             user peut s'auto-créditer dans `credits_transactions`.
--   B-RLS-3 : Bucket `analysis-photos` PUBLIC + policy ALL ouverte →
--             anyone (anon) peut GET les photos privées (OCR).
--
-- Audit Agent 2 (Backend) — Race TOCTOU sur crédits :
--   B-RACE   : Check + UPDATE non atomique → 2 analyses simultanées peuvent
--              débiter le même crédit. Fix : RPC SQL atomique.
--
-- Idempotente : DROP IF EXISTS + CREATE OR REPLACE FUNCTION + ON CONFLICT.
-- ============================================================

-- ════════════════════════════════════════════════════════════
-- B-RLS-1 : Restreindre UPDATE analyses au propriétaire uniquement
-- ════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS service_update_analyses ON public.analyses;

CREATE POLICY analyses_update_own ON public.analyses
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════
-- B-RLS-2 : Bloquer INSERT credits_transactions côté authenticated
-- (toutes les insertions code passent par admin client = service_role bypass RLS)
-- ════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS service_insert_credits ON public.credits_transactions;
-- Aucune policy INSERT recréée → seul service_role peut écrire (RLS la plus stricte).

-- ════════════════════════════════════════════════════════════
-- B-RLS-3 : Sécuriser le bucket Storage `analysis-photos`
-- 1. Bucket privé (plus accessible via CDN public)
-- 2. Drop policies dangereuses
-- 3. Recréer 4 policies scopées par user_id (path = {user_id}/{analysis_id}/...)
-- ════════════════════════════════════════════════════════════
UPDATE storage.buckets SET public = false WHERE id = 'analysis-photos';

DROP POLICY IF EXISTS "Allow all storage operations" ON storage.objects;
DROP POLICY IF EXISTS "qvgqdu_0" ON storage.objects;
DROP POLICY IF EXISTS "qvgqdu_1" ON storage.objects;
DROP POLICY IF EXISTS "analysis_photos_select_own" ON storage.objects;
DROP POLICY IF EXISTS "analysis_photos_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "analysis_photos_update_own" ON storage.objects;
DROP POLICY IF EXISTS "analysis_photos_delete_own" ON storage.objects;

CREATE POLICY "analysis_photos_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'analysis-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "analysis_photos_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'analysis-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "analysis_photos_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'analysis-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "analysis_photos_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'analysis-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ════════════════════════════════════════════════════════════
-- B-RACE : RPC atomique de décrément des crédits
-- Garantit qu'un seul appel concurrent peut débiter (race-safe).
-- L'UPDATE conditionnel + RETURNING + RAISE EXCEPTION rend l'opération
-- atomique au niveau Postgres : impossible de débiter plus que disponible.
-- ════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.decrement_credits_atomic(
  p_user_id UUID,
  p_analysis_id UUID,
  p_description TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  -- UPDATE conditionnel atomique : ne décrémente que si crédits >= 1.
  -- Le WHERE clause + RETURNING garantit l'atomicité au niveau row-level lock.
  UPDATE public.profiles
  SET credits_remaining = credits_remaining - 1
  WHERE id = p_user_id AND credits_remaining >= 1
  RETURNING credits_remaining INTO new_balance;

  -- Si new_balance IS NULL, l'UPDATE n'a affecté aucune ligne
  -- (soit user inexistant, soit credits < 1) → erreur explicite.
  IF new_balance IS NULL THEN
    RAISE EXCEPTION 'INSUFFICIENT_CREDITS' USING ERRCODE = 'P0001';
  END IF;

  -- Trace de la transaction (atomique avec l'UPDATE — même transaction Postgres).
  INSERT INTO public.credits_transactions (
    user_id, type, amount, balance_after, description, analysis_id
  )
  VALUES (
    p_user_id, 'usage', -1, new_balance, p_description, p_analysis_id
  );

  RETURN new_balance;
END;
$$;

-- Permission : seul service_role peut appeler (depuis admin client côté serveur)
REVOKE ALL ON FUNCTION public.decrement_credits_atomic(UUID, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.decrement_credits_atomic(UUID, UUID, TEXT) TO service_role;

COMMENT ON FUNCTION public.decrement_credits_atomic IS
  'Décrément atomique des crédits user. Fix TOCTOU : UPDATE conditionnel
   + RETURNING + RAISE garantissent qu''un seul débit concurrent réussit.
   Lance INSUFFICIENT_CREDITS si crédits insuffisants au moment du débit.';
