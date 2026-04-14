-- ============================================================
-- LegitVision — Migration 010 : Fix marques multi-catégories (v2)
-- Réécrit en DO $$ block pour garantir l'ordre d'exécution :
--   1. INSERT brands (A/B/C) → ID capturé dans variable
--   2. RAISE EXCEPTION si un brand_id est NULL après INSERT
--   3. UPDATE models utilise les variables — jamais de subquery NULL
-- Idempotent : ON CONFLICT DO NOTHING + SELECT id après INSERT.
-- ============================================================

DO $$
DECLARE
  -- ── Protocoles photo (définis une seule fois, réutilisés) ──────────────
  v_proto_sneaker JSONB := '[
    {"name":"overall_front",        "label":"Vue de face",                    "required":true, "min_resolution":"800x800"},
    {"name":"overall_back",         "label":"Vue arriere",                    "required":true, "min_resolution":"800x800"},
    {"name":"overall_side_lateral", "label":"Vue laterale",                   "required":true, "min_resolution":"800x800"},
    {"name":"outsole",              "label":"Semelle exterieure (dessous)",   "required":true, "min_resolution":"800x800"},
    {"name":"toe_box_closeup",      "label":"Bout de chaussure (gros plan)", "required":true, "min_resolution":"800x800"},
    {"name":"tongue_label",         "label":"Etiquette de languette",         "required":true, "min_resolution":"800x800"},
    {"name":"size_tag",             "label":"Etiquette de taille",            "required":true, "min_resolution":"800x800"},
    {"name":"insole",               "label":"Semelle interieure",             "required":true, "min_resolution":"800x800"}
  ]';

  v_proto_clothing JSONB := '[
    {"name":"front_full",       "label":"Vue de face",      "required":true},
    {"name":"back_full",        "label":"Vue arriere",      "required":true},
    {"name":"label_neck",       "label":"Etiquette col",    "required":true},
    {"name":"label_wash",       "label":"Etiquette lavage", "required":true},
    {"name":"logo_closeup",     "label":"Logo gros plan",   "required":true},
    {"name":"material_closeup", "label":"Matiere gros plan","required":true}
  ]';

  v_proto_bag JSONB := '[
    {"name":"front",          "label":"Face avant",            "required":true, "min_resolution":"800x800"},
    {"name":"back",           "label":"Face arriere",          "required":true, "min_resolution":"800x800"},
    {"name":"interior",       "label":"Interieur complet",     "required":true, "min_resolution":"800x800"},
    {"name":"base",           "label":"Base du sac",           "required":true, "min_resolution":"800x800"},
    {"name":"hardware",       "label":"Quincaillerie",         "required":true, "min_resolution":"800x800"},
    {"name":"logo_closeup",   "label":"Logo / monogramme",     "required":true, "min_resolution":"800x800"},
    {"name":"interior_stamp", "label":"Estampille interieure", "required":true, "min_resolution":"800x800"},
    {"name":"date_code",      "label":"Code date / serie",     "required":true, "min_resolution":"800x800"},
    {"name":"zipper",         "label":"Fermeture eclair",      "required":false,"min_resolution":"800x800"},
    {"name":"packaging",      "label":"Dustbag / emballage",   "required":false,"min_resolution":"800x800"}
  ]';

  v_auth_sneaker JSONB := '[
    {"zone":"logo_placement","label":"Logo placement",   "weight":0.20},
    {"zone":"materials",     "label":"Materiaux",        "weight":0.20},
    {"zone":"sole_pattern",  "label":"Semelle",          "weight":0.20},
    {"zone":"stitching",     "label":"Coutures",         "weight":0.15},
    {"zone":"tongue_label",  "label":"Etiquette langue", "weight":0.15},
    {"zone":"product_code",  "label":"Code produit",     "weight":0.10}
  ]';

  -- ── IDs nouvelles marques sneakers ───────────────────────────────────────
  v_bal_snk    UUID;   -- balenciaga-sneakers
  v_lv_snk     UUID;   -- louis-vuitton-sneakers
  v_dior_snk   UUID;   -- dior-sneakers
  v_gucci_snk  UUID;   -- gucci-sneakers
  v_prada_snk  UUID;   -- prada-sneakers
  v_chanel_snk UUID;   -- chanel-sneakers
  v_hermes_snk UUID;   -- hermes-sneakers
  v_bv_snk     UUID;   -- bottega-veneta-sneakers

  -- ── IDs nouvelles marques vêtements ─────────────────────────────────────
  v_bal_clo    UUID;   -- balenciaga-clothing
  v_lv_clo     UUID;   -- louis-vuitton-clothing
  v_dior_clo   UUID;   -- dior-clothing
  v_gucci_clo  UUID;   -- gucci-clothing

  -- ── IDs nouvelles marques sacs ───────────────────────────────────────────
  v_bal_bags   UUID;   -- balenciaga-bags
  v_dior_bags  UUID;   -- dior-bags

  -- ── IDs anciennes marques (sources de migration) ─────────────────────────
  v_bal_old    UUID;   -- balenciaga     (category=bag, doit exister)
  v_dior_old   UUID;   -- dior           (category=bag, doit exister)
  v_lv_old     UUID;   -- louis-vuitton
  v_gucci_old  UUID;   -- gucci
  v_prada_old  UUID;   -- prada
  v_chanel_old UUID;   -- chanel
  v_hermes_old UUID;   -- hermes
  v_bv_old     UUID;   -- bottega-veneta

BEGIN

  -- ==========================================================
  -- SECTION A : INSERT nouvelles marques SNEAKERS
  -- INSERT puis SELECT immédiat → ID garanti non-NULL
  -- ==========================================================

  INSERT INTO public.brands (name, slug, category, photo_protocol)
  VALUES
    ('Balenciaga',     'balenciaga-sneakers',     'sneakers', v_proto_sneaker),
    ('Louis Vuitton',  'louis-vuitton-sneakers',  'sneakers', v_proto_sneaker),
    ('Dior',           'dior-sneakers',           'sneakers', v_proto_sneaker),
    ('Gucci',          'gucci-sneakers',          'sneakers', v_proto_sneaker),
    ('Prada',          'prada-sneakers',          'sneakers', v_proto_sneaker),
    ('Chanel',         'chanel-sneakers',         'sneakers', v_proto_sneaker),
    ('Hermès',         'hermes-sneakers',         'sneakers', v_proto_sneaker),
    ('Bottega Veneta', 'bottega-veneta-sneakers', 'sneakers', v_proto_sneaker)
  ON CONFLICT DO NOTHING;

  -- SELECT après INSERT : fonctionne que la ligne vienne d'être insérée
  -- ou qu'elle existait déjà (idempotent).
  SELECT id INTO v_bal_snk    FROM public.brands WHERE slug = 'balenciaga-sneakers';
  SELECT id INTO v_lv_snk     FROM public.brands WHERE slug = 'louis-vuitton-sneakers';
  SELECT id INTO v_dior_snk   FROM public.brands WHERE slug = 'dior-sneakers';
  SELECT id INTO v_gucci_snk  FROM public.brands WHERE slug = 'gucci-sneakers';
  SELECT id INTO v_prada_snk  FROM public.brands WHERE slug = 'prada-sneakers';
  SELECT id INTO v_chanel_snk FROM public.brands WHERE slug = 'chanel-sneakers';
  SELECT id INTO v_hermes_snk FROM public.brands WHERE slug = 'hermes-sneakers';
  SELECT id INTO v_bv_snk     FROM public.brands WHERE slug = 'bottega-veneta-sneakers';

  IF v_bal_snk    IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → balenciaga-sneakers'; END IF;
  IF v_lv_snk     IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → louis-vuitton-sneakers'; END IF;
  IF v_dior_snk   IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → dior-sneakers'; END IF;
  IF v_gucci_snk  IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → gucci-sneakers'; END IF;
  IF v_prada_snk  IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → prada-sneakers'; END IF;
  IF v_chanel_snk IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → chanel-sneakers'; END IF;
  IF v_hermes_snk IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → hermes-sneakers'; END IF;
  IF v_bv_snk     IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → bottega-veneta-sneakers'; END IF;

  RAISE NOTICE '[010] Section A OK — 8 marques sneakers prêtes';

  -- ==========================================================
  -- SECTION B : INSERT nouvelles marques VÊTEMENTS
  -- ==========================================================

  INSERT INTO public.brands (name, slug, category, photo_protocol)
  VALUES
    ('Balenciaga',    'balenciaga-clothing',    'clothing', v_proto_clothing),
    ('Louis Vuitton', 'louis-vuitton-clothing', 'clothing', v_proto_clothing),
    ('Dior',          'dior-clothing',          'clothing', v_proto_clothing),
    ('Gucci',         'gucci-clothing',         'clothing', v_proto_clothing)
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_bal_clo   FROM public.brands WHERE slug = 'balenciaga-clothing';
  SELECT id INTO v_lv_clo    FROM public.brands WHERE slug = 'louis-vuitton-clothing';
  SELECT id INTO v_dior_clo  FROM public.brands WHERE slug = 'dior-clothing';
  SELECT id INTO v_gucci_clo FROM public.brands WHERE slug = 'gucci-clothing';

  IF v_bal_clo   IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → balenciaga-clothing'; END IF;
  IF v_lv_clo    IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → louis-vuitton-clothing'; END IF;
  IF v_dior_clo  IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → dior-clothing'; END IF;
  IF v_gucci_clo IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → gucci-clothing'; END IF;

  RAISE NOTICE '[010] Section B OK — 4 marques clothing prêtes';

  -- ==========================================================
  -- SECTION C : INSERT nouvelles marques SACS (slugs dédiés)
  -- Balenciaga et Dior ont désormais des slugs *-bags distincts
  -- de leurs anciens slugs "balenciaga"/"dior" (qui seront désactivés).
  -- ==========================================================

  INSERT INTO public.brands (name, slug, category, photo_protocol)
  VALUES
    ('Balenciaga', 'balenciaga-bags', 'bag', v_proto_bag),
    ('Dior',       'dior-bags',       'bag', v_proto_bag)
  ON CONFLICT DO NOTHING;

  SELECT id INTO v_bal_bags  FROM public.brands WHERE slug = 'balenciaga-bags';
  SELECT id INTO v_dior_bags FROM public.brands WHERE slug = 'dior-bags';

  IF v_bal_bags  IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → balenciaga-bags'; END IF;
  IF v_dior_bags IS NULL THEN RAISE EXCEPTION 'FATAL: brand not found → dior-bags'; END IF;

  RAISE NOTICE '[010] Section C OK — 2 marques sacs prêtes';

  -- ==========================================================
  -- Récupération des IDs des anciennes marques (sources)
  -- Ces brands existent depuis migration 003/006.
  -- Si elles n'existent pas (DB vierge), les UPDATEs skippent.
  -- ==========================================================

  SELECT id INTO v_bal_old    FROM public.brands WHERE slug = 'balenciaga';
  SELECT id INTO v_dior_old   FROM public.brands WHERE slug = 'dior';
  SELECT id INTO v_lv_old     FROM public.brands WHERE slug = 'louis-vuitton';
  SELECT id INTO v_gucci_old  FROM public.brands WHERE slug = 'gucci';
  SELECT id INTO v_prada_old  FROM public.brands WHERE slug = 'prada';
  SELECT id INTO v_chanel_old FROM public.brands WHERE slug = 'chanel';
  SELECT id INTO v_hermes_old FROM public.brands WHERE slug = 'hermes';
  SELECT id INTO v_bv_old     FROM public.brands WHERE slug = 'bottega-veneta';

  RAISE NOTICE '[010] IDs sources récupérés (NULL = brand absente, UPDATEs correspondants skippés)';

  -- ==========================================================
  -- SECTION D : MIGRATION MODÈLES SNEAKERS
  -- Modèles insérés sous les brands "bag" par migration 008 →
  -- déplacés vers les nouveaux brands sneakers dédiés.
  -- Les IF IS NOT NULL garantissent qu'on ne met jamais brand_id = NULL.
  -- ==========================================================

  IF v_bal_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_bal_snk
    WHERE brand_id = v_bal_old
      AND slug IN ('triple-s', 'track', 'runner', 'speed-trainer');
    RAISE NOTICE '[010] Balenciaga sneakers migrés';
  END IF;

  IF v_dior_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_dior_snk
    WHERE brand_id = v_dior_old
      AND slug IN ('b22', 'b23', 'b27', 'b30');
    RAISE NOTICE '[010] Dior sneakers migrés';
  END IF;

  IF v_lv_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_lv_snk
    WHERE brand_id = v_lv_old
      AND slug IN ('lv-trainer', 'lv-skate', 'lv-archlight');
    RAISE NOTICE '[010] LV sneakers migrés';
  END IF;

  IF v_gucci_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_gucci_snk
    WHERE brand_id = v_gucci_old
      AND slug IN ('rhyton', 'ace', 'screener', 'run');
    RAISE NOTICE '[010] Gucci sneakers migrés';
  END IF;

  IF v_prada_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_prada_snk
    WHERE brand_id = v_prada_old
      AND slug IN ('cloudbust', 'americas-cup', 'downtown');
    RAISE NOTICE '[010] Prada sneakers migrés';
  END IF;

  IF v_chanel_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_chanel_snk
    WHERE brand_id = v_chanel_old
      AND slug IN ('trainer', 'cc-low-top');
    RAISE NOTICE '[010] Chanel sneakers migrés';
  END IF;

  IF v_hermes_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_hermes_snk
    WHERE brand_id = v_hermes_old
      AND slug IN ('bouncing', 'trail');
    RAISE NOTICE '[010] Hermès sneakers migrés';
  END IF;

  IF v_bv_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_bv_snk
    WHERE brand_id = v_bv_old
      AND slug IN ('orbit', 'puddle-boot');
    RAISE NOTICE '[010] Bottega Veneta sneakers migrés';
  END IF;

  RAISE NOTICE '[010] Section D OK — modèles sneakers migrés';

  -- ==========================================================
  -- SECTION E : MIGRATION MODÈLES VÊTEMENTS
  -- Modèles clothing insérés sous les brands "bag" (mig 006/009)
  -- → déplacés vers les nouveaux brands clothing dédiés.
  -- ==========================================================

  IF v_bal_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_bal_clo
    WHERE brand_id = v_bal_old
      AND slug IN (
        'bal-speed-t-shirt', 'bal-logo-hoodie', 'triple-s-t-shirt',
        'bal-track-jacket',  'tape-logo-tee',   'wfp-jacket',
        'bal-puffer-jacket'
      );
  END IF;

  IF v_lv_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_lv_clo
    WHERE brand_id = v_lv_old
      AND slug IN (
        'lv-monogram-t-shirt', 'lv-hoodie', 'lv-jacket',
        'lv-track-pant',       'virgil-abloh-fw21'
      );
  END IF;

  IF v_gucci_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_gucci_clo
    WHERE brand_id = v_gucci_old
      AND slug IN (
        'gucci-logo-t-shirt', 'gucci-hoodie',       'gucci-jacket',
        'gucci-track-pant',   'gucci-jumper',        'gucci-logo-sweatshirt'
      );
  END IF;

  IF v_dior_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_dior_clo
    WHERE brand_id = v_dior_old
      AND slug IN (
        'dior-bee-t-shirt',    'dior-oblique-jacket', 'dior-saddle-hoodie',
        'dior-track-jacket',   'dior-oblique-t-shirt'
      );
  END IF;

  -- Prada clothing : SUPPRIMER (aucun brand Prada clothing voulu)
  IF v_prada_old IS NOT NULL THEN
    DELETE FROM public.models
    WHERE brand_id = v_prada_old
      AND slug IN ('prada-logo-t-shirt', 'prada-nylon-jacket', 're-nylon-backpack');
  END IF;

  RAISE NOTICE '[010] Section E OK — modèles clothing migrés / Prada clothing supprimé';

  -- ==========================================================
  -- SECTION F : MIGRATION DES SACS RESTANTS
  -- Après extraction des sneakers et clothing, les modèles encore
  -- présents sous "balenciaga" et "dior" sont les sacs.
  -- On les déplace vers balenciaga-bags / dior-bags.
  -- Les autres brands (LV, Gucci, Prada, Chanel, Hermès, BV)
  -- gardent leur slug existant (GARDER tel quel).
  -- ==========================================================

  IF v_bal_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_bal_bags
    WHERE brand_id = v_bal_old;
    RAISE NOTICE '[010] Balenciaga bags restants migrés vers balenciaga-bags';
  END IF;

  IF v_dior_old IS NOT NULL THEN
    UPDATE public.models
    SET brand_id = v_dior_bags
    WHERE brand_id = v_dior_old;
    RAISE NOTICE '[010] Dior bags restants migrés vers dior-bags';
  END IF;

  -- Désactiver les anciens brands maintenant vides.
  -- is_active = false les exclut des requêtes check/new (.eq("is_active", true)).
  -- On ne DELETE pas pour préserver les FK des analyses existantes.
  UPDATE public.brands
  SET is_active = false
  WHERE slug IN ('balenciaga', 'dior');

  RAISE NOTICE '[010] Section F OK — sacs migrés, anciens brands désactivés';

  -- ==========================================================
  -- SECTION G : MODÈLES MANQUANTS
  -- LV Run Away absent de migration 008.
  -- ==========================================================

  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  VALUES (
    v_lv_snk,
    'LV Run Away',
    'lv-run-away',
    v_auth_sneaker,
    8, 10
  )
  ON CONFLICT (brand_id, slug) DO NOTHING;

  RAISE NOTICE '[010] Section G OK — LV Run Away inséré sous louis-vuitton-sneakers';

  -- ==========================================================
  -- SECTION H : specific_auth_points (filet de sécurité)
  -- Migration 008 les avait définis sur les rows sous les anciens
  -- brand_ids (balenciaga / dior). Après migration, les rows ont
  -- changé de brand_id mais conservent leurs colonnes — ces UPDATEs
  -- ne s'appliquent qu'aux rows où la valeur est encore NULL
  -- (cas d'une exécution partielle précédente).
  -- ==========================================================

  UPDATE public.models
  SET specific_auth_points = '["Police Balenciaga precise","Semelle Triple S 3 couches","Mesh qualite","Etiquette composition"]'::jsonb
  WHERE brand_id = v_bal_snk
    AND slug IN ('triple-s', 'track', 'runner', 'speed-trainer')
    AND specific_auth_points IS NULL;

  UPDATE public.models
  SET specific_auth_points = '["Oblique canvas alignement","B logo broderie","Semelle profil","Etiquette Made in Italy"]'::jsonb
  WHERE brand_id = v_dior_snk
    AND slug IN ('b22', 'b23', 'b27', 'b30')
    AND specific_auth_points IS NULL;

  RAISE NOTICE '[010] Section H OK — specific_auth_points vérifiés';
  RAISE NOTICE '[010] Migration 010 terminée avec succès ✓';

END $$;
