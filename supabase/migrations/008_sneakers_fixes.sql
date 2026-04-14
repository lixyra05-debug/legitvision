-- ============================================================
-- LegitVision — Migration 008 : Sneakers luxe + corrections
-- Nouvelles marques sneakers (Maison Margiela, MMY, Loro Piana,
-- Burberry) · Modèles luxe sneakers (Balenciaga, Dior, LV, etc.)
-- Corrections Jordan variants, NB 2002R, Yeezy, Off-White, BAPE
-- Sûr à rejouer : ON CONFLICT DO NOTHING sur toutes les insertions
-- ============================================================

-- ============================================================
-- PHOTO PROTOCOL SNEAKERS (8 photos obligatoires)
-- ============================================================

-- Utilisé pour toutes les nouvelles marques sneakers de cette migration

-- ============================================================
-- SECTION A : NOUVELLES MARQUES SNEAKERS LUXE
-- ============================================================
-- NOTE : Balenciaga, Dior, Hermès, Louis Vuitton, Bottega Veneta,
-- Prada, Gucci, Chanel existent déjà en category='bag' dans la DB
-- (migrations 001 + 003). On n'insère PAS de doublon de marque.
-- Les modèles sneakers seront rattachés à ces brand_id existants.
--
-- On insère uniquement les marques vraiment nouvelles :
-- Maison Mihara Yasuhiro, Maison Margiela, Loro Piana, Burberry.
-- ============================================================

INSERT INTO public.brands (name, slug, category, photo_protocol)
VALUES
  ('Maison Mihara Yasuhiro', 'maison-mihara-yasuhiro', 'sneakers', '[
    {"name": "overall_front",        "label": "Vue de face",                    "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                    "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                   "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure (dessous)",   "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)", "required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",         "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",            "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",             "required": true,  "min_resolution": "800x800"}
  ]'::jsonb),
  ('Maison Margiela', 'maison-margiela', 'sneakers', '[
    {"name": "overall_front",        "label": "Vue de face",                    "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                    "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                   "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure (dessous)",   "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)", "required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",         "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",            "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",             "required": true,  "min_resolution": "800x800"}
  ]'::jsonb),
  ('Loro Piana', 'loro-piana', 'sneakers', '[
    {"name": "overall_front",        "label": "Vue de face",                    "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                    "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                   "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure (dessous)",   "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)", "required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",         "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",            "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",             "required": true,  "min_resolution": "800x800"}
  ]'::jsonb),
  ('Burberry', 'burberry', 'sneakers', '[
    {"name": "overall_front",        "label": "Vue de face",                    "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                    "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                   "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure (dessous)",   "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)", "required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",         "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",            "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",             "required": true,  "min_resolution": "800x800"}
  ]'::jsonb)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SECTION B : MODELES SNEAKERS LUXE
-- Points d'authentification communs aux sneakers luxe
-- ============================================================

-- ---- Balenciaga sneakers (brand déjà existant, category='bag') ----
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('Triple S',      'triple-s'),
  ('Track',         'track'),
  ('Runner',        'runner'),
  ('Speed Trainer', 'speed-trainer')
) AS m(name, slug) ON b.slug = 'balenciaga'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Dior sneakers (brand déjà existant, category='bag') ----
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('B22', 'b22'),
  ('B23', 'b23'),
  ('B27', 'b27'),
  ('B30', 'b30')
) AS m(name, slug) ON b.slug = 'dior'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Hermès sneakers (brand déjà existant, category='bag') ----
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('Bouncing', 'bouncing'),
  ('Trail',    'trail')
) AS m(name, slug) ON b.slug = 'hermes'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Louis Vuitton sneakers (brand déjà existant, category='bag') ----
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('LV Trainer',  'lv-trainer'),
  ('LV Skate',    'lv-skate'),
  ('LV Archlight', 'lv-archlight')
) AS m(name, slug) ON b.slug = 'louis-vuitton'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Bottega Veneta sneakers (brand déjà existant, category='bag') ----
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('Orbit',       'orbit'),
  ('Puddle Boot', 'puddle-boot')
) AS m(name, slug) ON b.slug = 'bottega-veneta'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Prada sneakers (brand déjà existant, category='bag') ----
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('Cloudbust',    'cloudbust'),
  ('Americas Cup', 'americas-cup'),
  ('Downtown',     'downtown')
) AS m(name, slug) ON b.slug = 'prada'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Gucci sneakers (brand déjà existant, category='bag') ----
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('Rhyton',   'rhyton'),
  ('Ace',      'ace'),
  ('Screener', 'screener'),
  ('Run',      'run')
) AS m(name, slug) ON b.slug = 'gucci'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Chanel sneakers (brand déjà existant, category='bag') ----
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('Trainer',    'trainer'),
  ('CC Low-Top', 'cc-low-top')
) AS m(name, slug) ON b.slug = 'chanel'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Maison Mihara Yasuhiro sneakers (nouvelle marque) ----
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('Peterson OG Sole', 'peterson-og-sole'),
  ('Blakey',           'blakey')
) AS m(name, slug) ON b.slug = 'maison-mihara-yasuhiro'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Maison Margiela sneakers (nouvelle marque) ----
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('Replica Low', 'replica-low'),
  ('Fusion',      'fusion'),
  ('Tabi',        'tabi')
) AS m(name, slug) ON b.slug = 'maison-margiela'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Loro Piana sneakers (nouvelle marque) ----
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('Summer Walk', 'summer-walk')
) AS m(name, slug) ON b.slug = 'loro-piana'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Burberry sneakers (nouvelle marque) ----
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('Check Sneaker', 'check-sneaker'),
  ('Arthur',        'arthur')
) AS m(name, slug) ON b.slug = 'burberry'
ON CONFLICT (brand_id, slug) DO NOTHING;


-- ============================================================
-- SECTION C : CORRECTIONS
-- ============================================================

-- ── C1. Off-White sneakers ────────────────────────────────────────────────────
-- Off-White est en category='sneakers' (migration 003).
-- On insère les modèles sneakers manquants sous ce brand_id.
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('Out of Office',    'out-of-office'),
  ('Odsy-1000',        'odsy-1000'),
  ('Vulcanized Low',   'vulcanized-low')
) AS m(name, slug) ON b.slug = 'off-white'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ── C2. BAPE sneakers ─────────────────────────────────────────────────────────
-- Déjà insérés dans migration 006 — ON CONFLICT DO NOTHING garantit la sécurité.
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone": "logo_placement", "label": "Logo placement",    "weight": 0.20},
    {"zone": "materials",      "label": "Materiaux",         "weight": 0.20},
    {"zone": "sole_pattern",   "label": "Semelle",           "weight": 0.20},
    {"zone": "stitching",      "label": "Coutures",          "weight": 0.15},
    {"zone": "tongue_label",   "label": "Etiquette langue",  "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit",      "weight": 0.10}
  ]'::jsonb,
  8, 10
FROM public.brands b
JOIN (VALUES
  ('Bapesta',  'bapesta'),
  ('STA',      'sta'),
  ('Road STA', 'road-sta')
) AS m(name, slug) ON b.slug = 'bape'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ── C3. Travis Scott — suppression de la marque séparée ───────────────────────
-- Travis Scott est un artiste / collaborateur, pas une marque.
-- Ses modèles sont référencés via le champ collaborations des modèles Nike/Jordan.
DELETE FROM public.models
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'travis-scott');

DELETE FROM public.brands
WHERE slug = 'travis-scott';

-- ── C4. Jordan variants — Air Jordan 1 & Air Jordan 4 ────────────────────────
-- Ajoute les variants détaillés si le champ est encore vide ('[]').
-- air-jordan-1 peut matcher plusieurs slugs (migration 001 : 'air-jordan-1-high',
-- migration 006 : 'air-jordan-1', migration 006 : 'air-jordan-1-low').
-- On cible les slugs explicites.

-- Air Jordan 1 (slug 'air-jordan-1', brand 'jordan')
UPDATE public.models
SET variants = '["Low","Mid","High","Retro High OG","Chicago","Bred","Royal","Shadow","Black Toe","Pine Green OG"]'::jsonb
WHERE slug = 'air-jordan-1'
  AND brand_id = (SELECT id FROM public.brands WHERE slug = 'jordan')
  AND variants = '[]'::jsonb;

-- Air Jordan 4 (slug 'air-jordan-4', brand 'jordan')
UPDATE public.models
SET variants = '["Thunder","White Cement","Bred","Military Blue","Cactus Jack","Retro"]'::jsonb
WHERE slug = 'air-jordan-4'
  AND brand_id = (SELECT id FROM public.brands WHERE slug = 'jordan')
  AND variants = '[]'::jsonb;

-- ── C5. New Balance 2002R — suppression de 'protection-pack' comme modèle ─────
-- La Protection Pack est une variante du 2002R, pas un modèle séparé.
DELETE FROM public.models
WHERE slug = 'protection-pack'
  AND brand_id = (SELECT id FROM public.brands WHERE slug = 'new-balance');

-- S'assurer que le modèle 2002r existe avec les variants corrects.
-- L'insertion est déjà dans migration 006 (slug '2002r').
-- On met à jour les variants si encore vides.
UPDATE public.models
SET variants = '["Protection Pack","Rain Cloud","Sea Salt","Turtledove"]'::jsonb
WHERE slug = '2002r'
  AND brand_id = (SELECT id FROM public.brands WHERE slug = 'new-balance')
  AND variants = '[]'::jsonb;

-- ── C6. Yeezy — suppression des coloris comme modèles séparés ────────────────
-- Zebra, Beluga, Beluga 2.0 sont des coloris/variants du Yeezy 350 V2,
-- pas des modèles à part entière.
DELETE FROM public.models
WHERE slug IN ('zebra', 'beluga', 'beluga-2-0', 'beluga-20')
  AND brand_id = (SELECT id FROM public.brands WHERE slug = 'adidas');


-- ============================================================
-- SECTION D : specific_auth_points pour sneakers luxe
-- ============================================================

-- ── Balenciaga sneakers ───────────────────────────────────────────────────────
UPDATE public.models
SET specific_auth_points = '["Police Balenciaga precise","Semelle Triple S 3 couches","Mesh qualite","Etiquette composition"]'::jsonb
WHERE slug IN ('triple-s', 'track', 'runner', 'speed-trainer')
  AND brand_id = (SELECT id FROM public.brands WHERE slug = 'balenciaga');

-- ── Dior sneakers ────────────────────────────────────────────────────────────
UPDATE public.models
SET specific_auth_points = '["Oblique canvas alignement","B logo broderie","Semelle profil","Etiquette Made in Italy"]'::jsonb
WHERE slug IN ('b22', 'b23', 'b27', 'b30')
  AND brand_id = (SELECT id FROM public.brands WHERE slug = 'dior');
