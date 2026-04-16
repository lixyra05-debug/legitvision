-- ============================================================
-- LegitVision — Migration 011 : Category cleanup
-- Supprime les modèles vêtements/accessories mal classés sous des
-- marques sneakers, désactive travis-scott, consolide les variants
-- Yeezy et New Balance.
-- Idempotent : safe à rejouer.
-- ============================================================

DO $$
DECLARE
  v_off_white_id  UUID;
  v_bape_id       UUID;
  v_bal_bags_id   UUID;
  v_travis_id     UUID;
  v_adidas_id     UUID;
  v_nb_id         UUID;

  -- Pour la mise à jour des variants Yeezy 350 V2
  v_yeezy_v2_id   UUID;
  v_yeezy_v2_vars JSONB;

BEGIN

  -- ==========================================================
  -- Récupération des IDs de marques
  -- ==========================================================

  SELECT id INTO v_off_white_id FROM public.brands WHERE slug = 'off-white';
  SELECT id INTO v_bape_id      FROM public.brands WHERE slug = 'bape';
  SELECT id INTO v_bal_bags_id  FROM public.brands WHERE slug = 'balenciaga-bags';
  SELECT id INTO v_travis_id    FROM public.brands WHERE slug = 'travis-scott';
  SELECT id INTO v_adidas_id    FROM public.brands WHERE slug = 'adidas';
  SELECT id INTO v_nb_id        FROM public.brands WHERE slug = 'new-balance';

  RAISE NOTICE '[011] IDs récupérés — off-white:% bape:% balenciaga-bags:% travis-scott:% adidas:% new-balance:%',
    v_off_white_id, v_bape_id, v_bal_bags_id, v_travis_id, v_adidas_id, v_nb_id;

  -- ==========================================================
  -- SECTION A : Off-White — suppression des modèles vêtements
  -- La marque off-white (category=sneakers) contient des modèles
  -- clothing insérés dans migration 006 et mis à jour en 007.
  -- On supprime tout modèle dont le slug ou le nom indique
  -- un vêtement (hoodie, tee, t-shirt, jacket, sweat, zip-up,
  -- cargo, belt, pant).
  -- ==========================================================

  IF v_off_white_id IS NOT NULL THEN
    DELETE FROM public.models
    WHERE brand_id = v_off_white_id
      AND (
           slug ILIKE '%hoodie%'
        OR slug ILIKE '%tee%'
        OR slug ILIKE '%t-shirt%'
        OR slug ILIKE '%jacket%'
        OR slug ILIKE '%sweat%'
        OR slug ILIKE '%zip-up%'
        OR slug ILIKE '%cargo%'
        OR slug ILIKE '%belt%'
        OR slug ILIKE '%pant%'
        OR name ILIKE '%Hoodie%'
        OR name ILIKE '%T-Shirt%'
        OR name ILIKE '%Tee%'
        OR name ILIKE '%Jacket%'
        OR name ILIKE '%Sweatshirt%'
        OR name ILIKE '%Zip-Up%'
        OR name ILIKE '%Cargo%'
        OR name ILIKE '%Belt%'
        OR name ILIKE '%Pant%'
      );
    RAISE NOTICE '[011] Section A — modèles vêtements Off-White (sneakers brand) supprimés';
  ELSE
    RAISE NOTICE '[011] Section A — brand off-white introuvable, skip';
  END IF;

  -- ==========================================================
  -- SECTION B : BAPE — suppression des modèles vêtements
  -- La marque bape (category=sneakers) contient des modèles
  -- clothing : baby-milo-t-shirt, abc-camo-hoodie, shark-hoodie,
  -- shark-full-zip, bape-coach-jacket, bape-pants (migration 006).
  -- ==========================================================

  IF v_bape_id IS NOT NULL THEN
    DELETE FROM public.models
    WHERE brand_id = v_bape_id
      AND (
           slug ILIKE '%hoodie%'
        OR slug ILIKE '%tee%'
        OR slug ILIKE '%t-shirt%'
        OR slug ILIKE '%jacket%'
        OR slug ILIKE '%sweat%'
        OR slug ILIKE '%zip%'
        OR slug ILIKE '%pant%'
        OR slug ILIKE '%shark%'
        OR slug ILIKE '%milo%'
        OR name ILIKE '%Hoodie%'
        OR name ILIKE '%T-Shirt%'
        OR name ILIKE '%Tee%'
        OR name ILIKE '%Jacket%'
        OR name ILIKE '%Pant%'
        OR name ILIKE '%Shark%'
        OR name ILIKE '%Milo%'
      );
    RAISE NOTICE '[011] Section B — modèles vêtements BAPE (sneakers brand) supprimés';
  ELSE
    RAISE NOTICE '[011] Section B — brand bape introuvable, skip';
  END IF;

  -- ==========================================================
  -- SECTION C : Balenciaga-bags — suppression de tout modèle clothing
  -- Migration 010 Section F a basculé TOUS les modèles restants
  -- sous balenciaga vers balenciaga-bags. Si des modèles clothing
  -- n'ont pas été extraits par Section E, ils se retrouvent ici.
  -- On les supprime car balenciaga-bags ne doit contenir que des sacs.
  -- ==========================================================

  IF v_bal_bags_id IS NOT NULL THEN
    DELETE FROM public.models
    WHERE brand_id = v_bal_bags_id
      AND (
           slug ILIKE '%hoodie%'
        OR slug ILIKE '%tee%'
        OR slug ILIKE '%t-shirt%'
        OR slug ILIKE '%jacket%'
        OR slug ILIKE '%sweat%'
        OR slug ILIKE '%pant%'
        OR name ILIKE '%Hoodie%'
        OR name ILIKE '%T-Shirt%'
        OR name ILIKE '%Tee%'
        OR name ILIKE '%Jacket%'
        OR name ILIKE '%Sweatshirt%'
        OR name ILIKE '%Pant%'
      );
    RAISE NOTICE '[011] Section C — modèles clothing sous balenciaga-bags supprimés';
  ELSE
    RAISE NOTICE '[011] Section C — brand balenciaga-bags introuvable, skip';
  END IF;

  -- ==========================================================
  -- SECTION D : Travis Scott — désactivation de la marque
  -- Migration 008 C3 a déjà tenté de DELETE avec subquery.
  -- Ici on utilise la variable pour être sûr.
  -- On supprime d'abord les modèles, puis on désactive la marque
  -- (is_active = false) au lieu de DELETE pour préserver les FK
  -- des analyses existantes.
  -- ==========================================================

  IF v_travis_id IS NOT NULL THEN
    -- Supprimer les modèles d'abord
    DELETE FROM public.models
    WHERE brand_id = v_travis_id;

    -- Désactiver la marque (ne pas DELETE pour FK safety)
    UPDATE public.brands
    SET is_active = false
    WHERE id = v_travis_id;

    RAISE NOTICE '[011] Section D — travis-scott : modèles supprimés, brand désactivé';
  ELSE
    RAISE NOTICE '[011] Section D — brand travis-scott introuvable (déjà supprimé en mig 008), skip';
  END IF;

  -- ==========================================================
  -- SECTION E : Yeezy Boost 350 V2 Zebra — merge en variant
  -- Migration 008 C6 a supprimé le slug 'zebra' mais pas le slug
  -- 'yeezy-boost-350-v2-zebra' (nom complet).
  -- On s'assure que :
  --   1. Le modèle yeezy-boost-350-v2-zebra est supprimé si présent
  --   2. 'Zebra' figure dans les variants de yeezy-boost-350-v2
  -- ==========================================================

  IF v_adidas_id IS NOT NULL THEN

    -- 1. Supprimer le modèle standalone Zebra s'il existe encore
    DELETE FROM public.models
    WHERE brand_id = v_adidas_id
      AND slug IN ('yeezy-boost-350-v2-zebra', 'zebra', 'beluga', 'beluga-2-0', 'beluga-20');

    RAISE NOTICE '[011] Section E — modèles Yeezy coloris standalone supprimés';

    -- 2. S'assurer que 'Zebra' est dans les variants du yeezy-boost-350-v2
    --    Migration 007 a déjà défini les variants via _lv_set_model :
    --    ["Zebra","Beluga 2.0","Butter","Static","CMPCT","Oreo","Bone","Natural"]
    --    Migration 008 C4 a tenté de remettre [] → on s'assure que Zebra y est.

    SELECT id, variants
    INTO v_yeezy_v2_id, v_yeezy_v2_vars
    FROM public.models
    WHERE brand_id = v_adidas_id
      AND slug = 'yeezy-boost-350-v2';

    IF v_yeezy_v2_id IS NOT NULL THEN
      -- Ajouter 'Zebra' si absent des variants
      IF NOT (v_yeezy_v2_vars @> '"Zebra"'::jsonb) THEN
        UPDATE public.models
        SET variants = v_yeezy_v2_vars || '["Zebra"]'::jsonb
        WHERE id = v_yeezy_v2_id;
        RAISE NOTICE '[011] Section E — Zebra ajouté aux variants de yeezy-boost-350-v2';
      ELSE
        RAISE NOTICE '[011] Section E — Zebra déjà présent dans les variants de yeezy-boost-350-v2, skip';
      END IF;
    ELSE
      RAISE NOTICE '[011] Section E — modèle yeezy-boost-350-v2 introuvable sous adidas, skip';
    END IF;

  ELSE
    RAISE NOTICE '[011] Section E — brand adidas introuvable, skip';
  END IF;

  -- ==========================================================
  -- SECTION F : New Balance 2002R Protection Pack — suppression
  -- Ce coloris doit être un variant du modèle 2002r, pas un
  -- modèle standalone. On supprime les slugs candidats.
  -- Migration 008 C5 a déjà supprimé 'protection-pack' ;
  -- on couvre aussi 'nb-2002r-protection-pack' au cas où.
  -- ==========================================================

  IF v_nb_id IS NOT NULL THEN
    DELETE FROM public.models
    WHERE brand_id = v_nb_id
      AND slug IN ('nb-2002r-protection-pack', 'protection-pack', '2002r-protection-pack');

    RAISE NOTICE '[011] Section F — NB 2002R Protection Pack supprimé si présent';
  ELSE
    RAISE NOTICE '[011] Section F — brand new-balance introuvable, skip';
  END IF;

  RAISE NOTICE '[011] Migration 011 terminée avec succès';

END $$;
