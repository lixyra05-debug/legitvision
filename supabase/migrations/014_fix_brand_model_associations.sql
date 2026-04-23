-- ============================================================
-- LegitVision — Migration 014 : Fix brand/model associations
--
-- ROOT CAUSE corrigée :
--   1. Mig 010 utilisait `INSERT ... ON CONFLICT DO NOTHING` SANS target column
--      avec un UNIQUE(name) sur brands, ce qui pouvait silencieusement faire
--      échouer les inserts pour les marques multi-catégories (Balenciaga, LV,
--      Dior, Gucci, Prada, Chanel, Hermès, BV).
--   2. Le `RAISE EXCEPTION` qui suivait pouvait alors ROLLBACK toute la mig 010
--      → marques sneakers/clothing/bags inaccessibles côté UI.
--   3. Bug "Puma déguisée en Runner" : `specific_auth_points` appliquait
--      "Semelle Triple S 3 couches" à TOUS les sneakers Balenciaga, dont la
--      Runner qui n'a PAS de Triple S → Claude cherchait un marqueur absent
--      et basculait sur "ressemble à Puma".
--
-- Stratégie :
--   - Noms suffixés (ex "Balenciaga (Sneakers)") pour respecter UNIQUE(name)
--   - ON CONFLICT (slug) avec target column explicite
--   - Guards IF NOT NULL pour idempotence
--   - SECTION G : auth_points distincts par modèle Balenciaga (fix Runner)
-- ============================================================

DO $$
DECLARE
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
    {"name":"front_full","label":"Vue de face","required":true},
    {"name":"back_full","label":"Vue arriere","required":true},
    {"name":"label_neck","label":"Etiquette col","required":true},
    {"name":"label_wash","label":"Etiquette lavage","required":true},
    {"name":"logo_closeup","label":"Logo gros plan","required":true},
    {"name":"material_closeup","label":"Matiere gros plan","required":true}
  ]';
  v_proto_bag JSONB := '[
    {"name":"front","label":"Face avant","required":true,"min_resolution":"800x800"},
    {"name":"back","label":"Face arriere","required":true,"min_resolution":"800x800"},
    {"name":"interior","label":"Interieur complet","required":true,"min_resolution":"800x800"},
    {"name":"base","label":"Base du sac","required":true,"min_resolution":"800x800"},
    {"name":"hardware","label":"Quincaillerie","required":true,"min_resolution":"800x800"},
    {"name":"logo_closeup","label":"Logo / monogramme","required":true,"min_resolution":"800x800"},
    {"name":"interior_stamp","label":"Estampille interieure","required":true,"min_resolution":"800x800"},
    {"name":"date_code","label":"Code date / serie","required":true,"min_resolution":"800x800"}
  ]';

  v_bal_snk    UUID; v_lv_snk     UUID; v_dior_snk  UUID; v_gucci_snk UUID;
  v_prada_snk  UUID; v_chanel_snk UUID; v_hermes_snk UUID; v_bv_snk   UUID;
  v_bal_clo    UUID; v_lv_clo  UUID; v_dior_clo UUID; v_gucci_clo UUID;
  v_bal_bags   UUID; v_dior_bags UUID;
  v_bal_old    UUID; v_dior_old UUID; v_lv_old UUID; v_gucci_old UUID;
  v_prada_old  UUID; v_chanel_old UUID; v_hermes_old UUID; v_bv_old UUID;
BEGIN
  -- ==========================================================
  -- SECTION A : Marques sneakers (noms suffixés pour UNIQUE(name))
  -- ==========================================================
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES
    ('Balenciaga (Sneakers)',     'balenciaga-sneakers',     'sneakers', v_proto_sneaker),
    ('Louis Vuitton (Sneakers)',  'louis-vuitton-sneakers',  'sneakers', v_proto_sneaker),
    ('Dior (Sneakers)',           'dior-sneakers',           'sneakers', v_proto_sneaker),
    ('Gucci (Sneakers)',          'gucci-sneakers',          'sneakers', v_proto_sneaker),
    ('Prada (Sneakers)',          'prada-sneakers',          'sneakers', v_proto_sneaker),
    ('Chanel (Sneakers)',         'chanel-sneakers',         'sneakers', v_proto_sneaker),
    ('Hermès (Sneakers)',         'hermes-sneakers',         'sneakers', v_proto_sneaker),
    ('Bottega Veneta (Sneakers)', 'bottega-veneta-sneakers', 'sneakers', v_proto_sneaker)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO v_bal_snk    FROM public.brands WHERE slug='balenciaga-sneakers';
  SELECT id INTO v_lv_snk     FROM public.brands WHERE slug='louis-vuitton-sneakers';
  SELECT id INTO v_dior_snk   FROM public.brands WHERE slug='dior-sneakers';
  SELECT id INTO v_gucci_snk  FROM public.brands WHERE slug='gucci-sneakers';
  SELECT id INTO v_prada_snk  FROM public.brands WHERE slug='prada-sneakers';
  SELECT id INTO v_chanel_snk FROM public.brands WHERE slug='chanel-sneakers';
  SELECT id INTO v_hermes_snk FROM public.brands WHERE slug='hermes-sneakers';
  SELECT id INTO v_bv_snk     FROM public.brands WHERE slug='bottega-veneta-sneakers';

  IF v_bal_snk IS NULL THEN RAISE EXCEPTION '[014] balenciaga-sneakers manquant'; END IF;

  -- ==========================================================
  -- SECTION B : Marques clothing
  -- ==========================================================
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES
    ('Balenciaga (Clothing)',    'balenciaga-clothing',    'clothing', v_proto_clothing),
    ('Louis Vuitton (Clothing)', 'louis-vuitton-clothing', 'clothing', v_proto_clothing),
    ('Dior (Clothing)',          'dior-clothing',          'clothing', v_proto_clothing),
    ('Gucci (Clothing)',         'gucci-clothing',         'clothing', v_proto_clothing)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO v_bal_clo  FROM public.brands WHERE slug='balenciaga-clothing';
  SELECT id INTO v_lv_clo   FROM public.brands WHERE slug='louis-vuitton-clothing';
  SELECT id INTO v_dior_clo FROM public.brands WHERE slug='dior-clothing';
  SELECT id INTO v_gucci_clo FROM public.brands WHERE slug='gucci-clothing';

  -- ==========================================================
  -- SECTION C : Marques bags dédiées (Bal/Dior — LV/Gucci/etc. déjà bag-only)
  -- ==========================================================
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES
    ('Balenciaga (Bags)', 'balenciaga-bags', 'bag', v_proto_bag),
    ('Dior (Bags)',       'dior-bags',       'bag', v_proto_bag)
  ON CONFLICT (slug) DO NOTHING;

  SELECT id INTO v_bal_bags  FROM public.brands WHERE slug='balenciaga-bags';
  SELECT id INTO v_dior_bags FROM public.brands WHERE slug='dior-bags';

  -- IDs des anciennes marques (sources de la migration des modèles)
  SELECT id INTO v_bal_old    FROM public.brands WHERE slug='balenciaga';
  SELECT id INTO v_dior_old   FROM public.brands WHERE slug='dior';
  SELECT id INTO v_lv_old     FROM public.brands WHERE slug='louis-vuitton';
  SELECT id INTO v_gucci_old  FROM public.brands WHERE slug='gucci';
  SELECT id INTO v_prada_old  FROM public.brands WHERE slug='prada';
  SELECT id INTO v_chanel_old FROM public.brands WHERE slug='chanel';
  SELECT id INTO v_hermes_old FROM public.brands WHERE slug='hermes';
  SELECT id INTO v_bv_old     FROM public.brands WHERE slug='bottega-veneta';

  -- ==========================================================
  -- SECTION D : Migration MODÈLES SNEAKERS vers brands sneakers dédiées
  -- ==========================================================
  IF v_bal_old IS NOT NULL AND v_bal_snk IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_bal_snk
      WHERE brand_id=v_bal_old AND slug IN ('triple-s','track','runner','speed-trainer','speed-runner');
  END IF;
  IF v_dior_old IS NOT NULL AND v_dior_snk IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_dior_snk
      WHERE brand_id=v_dior_old AND slug IN ('b22','b23','b27','b30');
  END IF;
  IF v_lv_old IS NOT NULL AND v_lv_snk IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_lv_snk
      WHERE brand_id=v_lv_old AND slug IN ('lv-trainer','lv-skate','lv-archlight','lv-run-away');
  END IF;
  IF v_gucci_old IS NOT NULL AND v_gucci_snk IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_gucci_snk
      WHERE brand_id=v_gucci_old AND slug IN ('rhyton','ace','screener','run');
  END IF;
  IF v_prada_old IS NOT NULL AND v_prada_snk IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_prada_snk
      WHERE brand_id=v_prada_old AND slug IN ('cloudbust','americas-cup','downtown');
  END IF;
  IF v_chanel_old IS NOT NULL AND v_chanel_snk IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_chanel_snk
      WHERE brand_id=v_chanel_old AND slug IN ('trainer','cc-low-top');
  END IF;
  IF v_hermes_old IS NOT NULL AND v_hermes_snk IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_hermes_snk
      WHERE brand_id=v_hermes_old AND slug IN ('bouncing','trail');
  END IF;
  IF v_bv_old IS NOT NULL AND v_bv_snk IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_bv_snk
      WHERE brand_id=v_bv_old AND slug IN ('orbit','puddle-boot');
  END IF;

  -- ==========================================================
  -- SECTION E : Migration MODÈLES CLOTHING vers brands clothing dédiées
  -- ==========================================================
  IF v_bal_old IS NOT NULL AND v_bal_clo IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_bal_clo
      WHERE brand_id=v_bal_old
        AND slug IN ('bal-speed-t-shirt','bal-logo-hoodie','triple-s-t-shirt',
                     'bal-track-jacket','tape-logo-tee','wfp-jacket','bal-puffer-jacket');
  END IF;
  IF v_lv_old IS NOT NULL AND v_lv_clo IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_lv_clo
      WHERE brand_id=v_lv_old
        AND slug IN ('lv-monogram-t-shirt','lv-hoodie','lv-jacket','lv-track-pant','virgil-abloh-fw21');
  END IF;
  IF v_gucci_old IS NOT NULL AND v_gucci_clo IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_gucci_clo
      WHERE brand_id=v_gucci_old
        AND slug IN ('gucci-logo-t-shirt','gucci-hoodie','gucci-jacket',
                     'gucci-track-pant','gucci-jumper','gucci-logo-sweatshirt');
  END IF;
  IF v_dior_old IS NOT NULL AND v_dior_clo IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_dior_clo
      WHERE brand_id=v_dior_old
        AND slug IN ('dior-bee-t-shirt','dior-oblique-jacket','dior-saddle-hoodie',
                     'dior-track-jacket','dior-oblique-t-shirt');
  END IF;

  -- ==========================================================
  -- SECTION F : Sacs restants Balenciaga/Dior → brands bags dédiées
  -- ==========================================================
  IF v_bal_old IS NOT NULL AND v_bal_bags IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_bal_bags
      WHERE brand_id=v_bal_old;
  END IF;
  IF v_dior_old IS NOT NULL AND v_dior_bags IS NOT NULL THEN
    UPDATE public.models SET brand_id=v_dior_bags
      WHERE brand_id=v_dior_old;
  END IF;

  -- Désactivation des anciennes marques génériques (devenues vides)
  UPDATE public.brands SET is_active=false
    WHERE slug IN ('balenciaga','dior')
      AND NOT EXISTS (SELECT 1 FROM public.models WHERE brand_id=brands.id);

  -- ==========================================================
  -- SECTION G : FIX BUG "Puma déguisée en Runner"
  -- specific_auth_points DISTINCTS par modèle Balenciaga (vs même chaîne pour tous)
  -- ==========================================================
  IF v_bal_snk IS NOT NULL THEN
    -- Triple S : conserve le marqueur "Triple S 3 couches" (c'est SA spécificité)
    UPDATE public.models
    SET specific_auth_points = '["Police Balenciaga precise (espacement, epaisseur)","Semelle Triple S 3 couches distinctes","Mesh engineered et overlays cuir","Etiquette composition langue"]'::jsonb
    WHERE brand_id=v_bal_snk AND slug='triple-s';

    -- Runner : silhouette running classique, semelle EVA basse, PAS de Triple S
    UPDATE public.models
    SET specific_auth_points = '["Police Balenciaga precise (espacement, epaisseur)","Mesh engineered et overlays cuir","Semelle EVA basse finitions","Etiquette composition langue","Lacets et tirants languette"]'::jsonb
    WHERE brand_id=v_bal_snk AND slug='runner';

    -- Track : semelle multi-strates colorées (pas Triple S)
    UPDATE public.models
    SET specific_auth_points = '["Police Balenciaga precise (espacement, epaisseur)","Semelle Track multi-strates colorees","Mesh ondulant et overlays","Etiquette composition langue"]'::jsonb
    WHERE brand_id=v_bal_snk AND slug='track';

    -- Speed Trainer / Speed Runner : tricot stretch sock-fit
    UPDATE public.models
    SET specific_auth_points = '["Police Balenciaga precise (espacement, epaisseur)","Tricot stretch sock-fit (densite)","Semelle Speed sock outsole","Etiquette composition langue"]'::jsonb
    WHERE brand_id=v_bal_snk AND slug IN ('speed-trainer','speed-runner');
  END IF;

  RAISE NOTICE '[014] Migration terminee — brands/models coherents + auth_points distincts';
END $$;
