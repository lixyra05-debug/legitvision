-- ============================================================
-- LegitVision — Migration 010 : Fix marques multi-catégories
-- Crée des entrées de marques séparées par catégorie pour les
-- grandes maisons (Balenciaga, Dior, LV, Gucci, Prada, Chanel,
-- Hermès, Bottega Veneta).
-- Migre les modèles mal classifiés vers les bons brand_id.
-- Sûr à rejouer : ON CONFLICT DO NOTHING + UPDATEs idempotents.
-- ============================================================

-- ============================================================
-- SECTION A : NOUVELLES ENTRÉES MARQUES — SNEAKERS
-- Chaque grande maison obtient un slug dédié pour la catégorie
-- sneakers, distinct de son slug sacs existant.
-- ============================================================

INSERT INTO public.brands (name, slug, category, photo_protocol)
VALUES
  ('Balenciaga', 'balenciaga-sneakers', 'sneakers', '[
    {"name": "overall_front",        "label": "Vue de face",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                  "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure",            "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)","required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",        "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",           "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",            "required": true,  "min_resolution": "800x800"}
  ]'::jsonb),
  ('Louis Vuitton', 'louis-vuitton-sneakers', 'sneakers', '[
    {"name": "overall_front",        "label": "Vue de face",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                  "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure",            "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)","required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",        "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",           "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",            "required": true,  "min_resolution": "800x800"}
  ]'::jsonb),
  ('Dior', 'dior-sneakers', 'sneakers', '[
    {"name": "overall_front",        "label": "Vue de face",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                  "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure",            "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)","required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",        "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",           "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",            "required": true,  "min_resolution": "800x800"}
  ]'::jsonb),
  ('Gucci', 'gucci-sneakers', 'sneakers', '[
    {"name": "overall_front",        "label": "Vue de face",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                  "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure",            "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)","required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",        "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",           "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",            "required": true,  "min_resolution": "800x800"}
  ]'::jsonb),
  ('Prada', 'prada-sneakers', 'sneakers', '[
    {"name": "overall_front",        "label": "Vue de face",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                  "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure",            "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)","required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",        "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",           "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",            "required": true,  "min_resolution": "800x800"}
  ]'::jsonb),
  ('Chanel', 'chanel-sneakers', 'sneakers', '[
    {"name": "overall_front",        "label": "Vue de face",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                  "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure",            "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)","required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",        "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",           "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",            "required": true,  "min_resolution": "800x800"}
  ]'::jsonb),
  ('Hermès', 'hermes-sneakers', 'sneakers', '[
    {"name": "overall_front",        "label": "Vue de face",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                  "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure",            "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)","required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",        "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",           "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",            "required": true,  "min_resolution": "800x800"}
  ]'::jsonb),
  ('Bottega Veneta', 'bottega-veneta-sneakers', 'sneakers', '[
    {"name": "overall_front",        "label": "Vue de face",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                   "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                  "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure",            "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)","required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",        "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",           "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",            "required": true,  "min_resolution": "800x800"}
  ]'::jsonb)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SECTION B : NOUVELLES ENTRÉES MARQUES — VÊTEMENTS
-- Pour les grandes maisons qui ont des modèles clothing actuellement
-- sous leur brand_id sacs (migrations 006/009).
-- ============================================================

INSERT INTO public.brands (name, slug, category, photo_protocol)
VALUES
  ('Balenciaga', 'balenciaga-clothing', 'clothing', '[
    {"name": "front_full",       "label": "Vue de face",      "required": true},
    {"name": "back_full",        "label": "Vue arriere",      "required": true},
    {"name": "label_neck",       "label": "Etiquette col",    "required": true},
    {"name": "label_wash",       "label": "Etiquette lavage", "required": true},
    {"name": "logo_closeup",     "label": "Logo gros plan",   "required": true},
    {"name": "material_closeup", "label": "Matiere gros plan","required": true}
  ]'::jsonb),
  ('Louis Vuitton', 'louis-vuitton-clothing', 'clothing', '[
    {"name": "front_full",       "label": "Vue de face",      "required": true},
    {"name": "back_full",        "label": "Vue arriere",      "required": true},
    {"name": "label_neck",       "label": "Etiquette col",    "required": true},
    {"name": "label_wash",       "label": "Etiquette lavage", "required": true},
    {"name": "logo_closeup",     "label": "Logo gros plan",   "required": true},
    {"name": "material_closeup", "label": "Matiere gros plan","required": true}
  ]'::jsonb),
  ('Dior', 'dior-clothing', 'clothing', '[
    {"name": "front_full",       "label": "Vue de face",      "required": true},
    {"name": "back_full",        "label": "Vue arriere",      "required": true},
    {"name": "label_neck",       "label": "Etiquette col",    "required": true},
    {"name": "label_wash",       "label": "Etiquette lavage", "required": true},
    {"name": "logo_closeup",     "label": "Logo gros plan",   "required": true},
    {"name": "material_closeup", "label": "Matiere gros plan","required": true}
  ]'::jsonb),
  ('Gucci', 'gucci-clothing', 'clothing', '[
    {"name": "front_full",       "label": "Vue de face",      "required": true},
    {"name": "back_full",        "label": "Vue arriere",      "required": true},
    {"name": "label_neck",       "label": "Etiquette col",    "required": true},
    {"name": "label_wash",       "label": "Etiquette lavage", "required": true},
    {"name": "logo_closeup",     "label": "Logo gros plan",   "required": true},
    {"name": "material_closeup", "label": "Matiere gros plan","required": true}
  ]'::jsonb)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SECTION C : NOUVELLES ENTRÉES MARQUES — SACS (slugs dédiés)
-- Balenciaga et Dior obtiennent de nouveaux slugs pour les sacs
-- afin de ne pas conflituer avec leurs variantes sneakers/clothing.
-- Les autres (Gucci, Prada, Chanel, Hermès, BV, LV) sont gardées
-- avec leurs slugs existants (GARDER tel quel).
-- ============================================================

INSERT INTO public.brands (name, slug, category, photo_protocol)
VALUES
  ('Balenciaga', 'balenciaga-bags', 'bag', '[
    {"name": "front",          "label": "Face avant",           "required": true,  "min_resolution": "800x800"},
    {"name": "back",           "label": "Face arriere",         "required": true,  "min_resolution": "800x800"},
    {"name": "interior",       "label": "Interieur complet",    "required": true,  "min_resolution": "800x800"},
    {"name": "base",           "label": "Base du sac",          "required": true,  "min_resolution": "800x800"},
    {"name": "hardware",       "label": "Quincaillerie",        "required": true,  "min_resolution": "800x800"},
    {"name": "logo_closeup",   "label": "Logo / monogramme",    "required": true,  "min_resolution": "800x800"},
    {"name": "interior_stamp", "label": "Estampille interieure","required": true,  "min_resolution": "800x800"},
    {"name": "date_code",      "label": "Code date / serie",    "required": true,  "min_resolution": "800x800"},
    {"name": "zipper",         "label": "Fermeture eclair",     "required": false, "min_resolution": "800x800"},
    {"name": "packaging",      "label": "Dustbag / emballage",  "required": false, "min_resolution": "800x800"}
  ]'::jsonb),
  ('Dior', 'dior-bags', 'bag', '[
    {"name": "front",          "label": "Face avant",           "required": true,  "min_resolution": "800x800"},
    {"name": "back",           "label": "Face arriere",         "required": true,  "min_resolution": "800x800"},
    {"name": "interior",       "label": "Interieur complet",    "required": true,  "min_resolution": "800x800"},
    {"name": "base",           "label": "Base du sac",          "required": true,  "min_resolution": "800x800"},
    {"name": "hardware",       "label": "Quincaillerie",        "required": true,  "min_resolution": "800x800"},
    {"name": "logo_closeup",   "label": "Logo / monogramme",    "required": true,  "min_resolution": "800x800"},
    {"name": "interior_stamp", "label": "Estampille interieure","required": true,  "min_resolution": "800x800"},
    {"name": "date_code",      "label": "Code date / serie",    "required": true,  "min_resolution": "800x800"},
    {"name": "zipper",         "label": "Fermeture eclair",     "required": false, "min_resolution": "800x800"},
    {"name": "packaging",      "label": "Dustbag / emballage",  "required": false, "min_resolution": "800x800"}
  ]'::jsonb)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SECTION D : MIGRATION DES MODÈLES SNEAKERS
-- Les modèles sneakers insérés sous les brands sacs (migration 008)
-- sont déplacés vers les nouveaux brands sneakers dédiés.
-- UPDATE brand_id est sûr : les analyses référencent model_id
-- directement, et les nouveaux brands n'ont pas encore ces slugs.
-- ============================================================

-- ── Balenciaga sneakers → balenciaga-sneakers ──
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'balenciaga-sneakers')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'balenciaga')
  AND slug IN ('triple-s', 'track', 'runner', 'speed-trainer');

-- ── Dior sneakers → dior-sneakers ──
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'dior-sneakers')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'dior')
  AND slug IN ('b22', 'b23', 'b27', 'b30');

-- ── Louis Vuitton sneakers → louis-vuitton-sneakers ──
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'louis-vuitton-sneakers')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'louis-vuitton')
  AND slug IN ('lv-trainer', 'lv-skate', 'lv-archlight');

-- ── Gucci sneakers → gucci-sneakers ──
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'gucci-sneakers')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'gucci')
  AND slug IN ('rhyton', 'ace', 'screener', 'run');

-- ── Prada sneakers → prada-sneakers ──
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'prada-sneakers')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'prada')
  AND slug IN ('cloudbust', 'americas-cup', 'downtown');

-- ── Chanel sneakers → chanel-sneakers ──
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'chanel-sneakers')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'chanel')
  AND slug IN ('trainer', 'cc-low-top');

-- ── Hermès sneakers → hermes-sneakers ──
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'hermes-sneakers')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'hermes')
  AND slug IN ('bouncing', 'trail');

-- ── Bottega Veneta sneakers → bottega-veneta-sneakers ──
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'bottega-veneta-sneakers')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'bottega-veneta')
  AND slug IN ('orbit', 'puddle-boot');


-- ============================================================
-- SECTION E : MIGRATION DES MODÈLES VÊTEMENTS
-- Les modèles clothing insérés sous les brands sacs (migrations 006/009)
-- sont déplacés vers les nouveaux brands clothing dédiés.
-- ============================================================

-- ── Balenciaga clothing (migration 006 slugs) → balenciaga-clothing ──
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'balenciaga-clothing')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'balenciaga')
  AND slug IN (
    'bal-speed-t-shirt', 'bal-logo-hoodie', 'triple-s-t-shirt',
    'bal-track-jacket', 'tape-logo-tee', 'wfp-jacket', 'bal-puffer-jacket'
  );

-- ── Louis Vuitton clothing (migration 006 slugs) → louis-vuitton-clothing ──
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'louis-vuitton-clothing')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'louis-vuitton')
  AND slug IN (
    'lv-monogram-t-shirt', 'lv-hoodie', 'lv-jacket',
    'lv-track-pant', 'virgil-abloh-fw21'
  );

-- ── Gucci clothing (migrations 006+009 slugs) → gucci-clothing ──
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'gucci-clothing')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'gucci')
  AND slug IN (
    'gucci-logo-t-shirt', 'gucci-hoodie', 'gucci-jacket',
    'gucci-track-pant', 'gucci-jumper', 'gucci-logo-sweatshirt'
  );

-- ── Dior clothing (migrations 006+009 slugs) → dior-clothing ──
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'dior-clothing')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'dior')
  AND slug IN (
    'dior-bee-t-shirt', 'dior-oblique-jacket', 'dior-saddle-hoodie',
    'dior-track-jacket', 'dior-oblique-t-shirt'
  );

-- ── Prada : SUPPRIMER les modèles clothing (aucune entrée Prada clothing voulue) ──
DELETE FROM public.models
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'prada')
  AND slug IN ('prada-logo-t-shirt', 'prada-nylon-jacket', 're-nylon-backpack');


-- ============================================================
-- SECTION F : MIGRATION DES MODÈLES SACS RESTANTS
-- Après avoir extrait les sneakers et clothing des brands Balenciaga
-- et Dior, les modèles restants (sacs) sont déplacés vers les
-- nouveaux slugs dédiés balenciaga-bags et dior-bags.
-- Les autres brands (gucci, prada, chanel, hermes, bottega-veneta,
-- louis-vuitton) gardent leurs slugs existants (GARDER tel quel).
-- ============================================================

-- ── Balenciaga bags restants → balenciaga-bags ──
-- À ce stade, seuls les 12 modèles sacs restent sous balenciaga.
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'balenciaga-bags')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'balenciaga');

-- ── Dior bags restants → dior-bags ──
-- À ce stade, seuls les 10 modèles sacs restent sous dior.
UPDATE public.models
SET brand_id = (SELECT id FROM public.brands WHERE slug = 'dior-bags')
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'dior');

-- ── Désactiver les anciens brand_id devenus vides ──
-- is_active = false exclut ces entrées des requêtes check/new (.eq("is_active", true)).
-- On ne supprime pas pour préserver les foreign keys existantes (analyses.brand_id).
UPDATE public.brands
SET is_active = false
WHERE slug IN ('balenciaga', 'dior');


-- ============================================================
-- SECTION G : INSERTION DES MODÈLES MANQUANTS
-- LV Run Away non présent dans migration 008.
-- ============================================================

-- ── LV Run Away ──
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, 'LV Run Away', 'lv-run-away',
  '[
    {"zone": "logo_placement", "label": "Logo placement",   "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",        "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",          "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",         "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue", "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",     "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
WHERE b.slug = 'louis-vuitton-sneakers'
ON CONFLICT (brand_id, slug) DO NOTHING;


-- ============================================================
-- SECTION H : specific_auth_points pour les nouveaux brands sneakers
-- Les modèles déplacés conservent leurs specific_auth_points
-- (migration 008 les avait définis sur les rows). Cette section
-- s'assure que les nouvelles insertions en ont aussi.
-- ============================================================

-- ── Balenciaga sneakers (already set by migration 008 on moved rows) ──
UPDATE public.models
SET specific_auth_points = '["Police Balenciaga precise","Semelle Triple S 3 couches","Mesh qualite","Etiquette composition"]'::jsonb
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'balenciaga-sneakers')
  AND slug IN ('triple-s', 'track', 'runner', 'speed-trainer')
  AND specific_auth_points IS NULL;

-- ── Dior sneakers (already set by migration 008 on moved rows) ──
UPDATE public.models
SET specific_auth_points = '["Oblique canvas alignement","B logo broderie","Semelle profil","Etiquette Made in Italy"]'::jsonb
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'dior-sneakers')
  AND slug IN ('b22', 'b23', 'b27', 'b30')
  AND specific_auth_points IS NULL;
