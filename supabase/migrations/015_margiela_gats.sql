-- ============================================================
-- LegitVision — Migration 015 : Ajout Maison Margiela GATS
--
-- Modèle : GATS (German Army Trainer Replica) — Maison Margiela sneakers
-- 8 variants (White, Black, Grey, Off-White, Paint Splatter, Suede, Nude, Red)
-- 8 specific_auth_points pour le prompt Vision
--
-- Pré-conditions vérifiées :
--   - brands UNIQUE(name, category) → ON CONFLICT valide
--   - models UNIQUE(brand_id, slug) → ON CONFLICT valide
--   - Maison Margiela existe déjà (slug='maison-margiela', category='sneakers')
--
-- Idempotente : DO $$ block + guards IF NULL + ON CONFLICT DO NOTHING.
-- ============================================================

DO $$
DECLARE
  v_brand_id UUID;
BEGIN
  -- Étape 1 : Chercher Maison Margiela sneakers par slug
  SELECT id INTO v_brand_id FROM public.brands
  WHERE slug = 'maison-margiela' AND category = 'sneakers';

  -- Étape 2 : Fallback par nom si slug non trouvé
  IF v_brand_id IS NULL THEN
    SELECT id INTO v_brand_id FROM public.brands
    WHERE name ILIKE '%margiela%' AND category = 'sneakers';
  END IF;

  -- Étape 3 : Créer la marque si elle n'existe pas du tout
  IF v_brand_id IS NULL THEN
    INSERT INTO public.brands (name, slug, category, photo_protocol)
    VALUES (
      'Maison Margiela',
      'maison-margiela',
      'sneakers',
      '[{"name":"overall_front","label":"Vue de face","required":true},{"name":"overall_back","label":"Vue arrière","required":true},{"name":"sole_bottom","label":"Semelle dessous","required":true},{"name":"tongue_label","label":"Étiquette de langue","required":true},{"name":"inside_label","label":"Étiquette intérieure","required":true},{"name":"logo_closeup","label":"Logo gros plan","required":true},{"name":"box_label","label":"Étiquette boîte","required":true},{"name":"stitching_detail","label":"Détail coutures","required":true}]'::jsonb
    )
    ON CONFLICT (name, category) DO NOTHING;

    SELECT id INTO v_brand_id FROM public.brands
    WHERE slug = 'maison-margiela' AND category = 'sneakers';
  END IF;

  -- GARDE DE SÉCURITÉ ABSOLUE
  IF v_brand_id IS NULL THEN
    RAISE EXCEPTION '[015] ERREUR CRITIQUE : Impossible de trouver ou créer Maison Margiela sneakers. brand_id est NULL. Migration annulée.';
  END IF;

  -- Étape 4 : Insérer le modèle GATS
  INSERT INTO public.models (brand_id, name, slug, min_photos, max_photos, variants, collaborations, specific_auth_points)
  VALUES (
    v_brand_id,
    'GATS',
    'gats',
    8,
    10,
    '["White","Black","Grey","Off-White","Paint Splatter","Suede","Nude","Red"]'::jsonb,
    '[]'::jsonb,
    '["Étiquette blanche avec les 4 points de couture blancs cousus main (irréguliers, JAMAIS imprimés)","Semelle en gomme GAT militaire allemande — texture granuleuse spécifique","Cuir lisse premium grain fin — bords nets et polis à la main","Étiquette intérieure typographie Maison Margiela Paris — ligne 22 — Made in Italy","Coutures Strobel board visibles et régulières sous la semelle intérieure","Talon forme arrondie caractéristique — couture contrefort cachée","Languette cuir souple avec marquage discret sans logo visible","Boîte blanche minimaliste avec étiquette code article S57WS0236"]'::jsonb
  )
  ON CONFLICT (brand_id, slug) DO NOTHING;

  RAISE NOTICE '[015] Maison Margiela GATS ajouté avec succès (brand_id: %)', v_brand_id;
END $$;
