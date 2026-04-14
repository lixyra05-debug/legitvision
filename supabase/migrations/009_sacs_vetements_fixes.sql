-- ============================================================
-- LegitVision — Migration 009 : Vêtements fixes + nouvelles marques
-- Ajout modèles clothing Nike/Adidas/Fear of God
-- Nouvelles marques : Canada Goose, Palm Angels, Moncler, Arc'teryx
-- Modèles complémentaires : Dior, Gucci, Prada clothing
-- specific_auth_points pour marques premium outdoor
-- Sûr à rejouer : ON CONFLICT DO NOTHING sur toutes les insertions
-- ============================================================

-- ============================================================
-- SECTION A : VÊTEMENTS — Authentication points partagés
-- ============================================================

-- Format authentication_points clothing (min_photos=6, max_photos=8)
-- Utilisé pour tous les modèles clothing de cette migration

-- ============================================================
-- A.1 : Nike — modèles clothing
-- (brand slug 'nike' existe déjà en category='sneakers',
--  multi-catégorie autorisé via brand_id/slug unique sur models)
-- ============================================================

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone":"neck_label",       "label":"Etiquette col",    "weight":0.20},
    {"zone":"print_embroidery", "label":"Print/Broderie",   "weight":0.20},
    {"zone":"stitching",        "label":"Coutures",         "weight":0.15},
    {"zone":"fabric",           "label":"Tissu",            "weight":0.15},
    {"zone":"tags",             "label":"Tags",             "weight":0.15},
    {"zone":"closures",         "label":"Fermetures",       "weight":0.10},
    {"zone":"packaging",        "label":"Emballage",        "weight":0.05}
  ]'::jsonb,
  6, 8
FROM public.brands b
JOIN (VALUES
  ('Tech Fleece Hoodie',  'tech-fleece-hoodie'),
  ('Tech Fleece Jogger',  'tech-fleece-jogger'),
  ('Windrunner Jacket',   'windrunner-jacket'),
  ('NSW Club Fleece',     'nsw-club-fleece')
) AS m(name, slug) ON b.slug = 'nike'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ============================================================
-- A.2 : Adidas — modèles clothing
-- (brand slug 'adidas' existe déjà en category='sneakers')
-- ============================================================

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone":"neck_label",       "label":"Etiquette col",    "weight":0.20},
    {"zone":"print_embroidery", "label":"Print/Broderie",   "weight":0.20},
    {"zone":"stitching",        "label":"Coutures",         "weight":0.15},
    {"zone":"fabric",           "label":"Tissu",            "weight":0.15},
    {"zone":"tags",             "label":"Tags",             "weight":0.15},
    {"zone":"closures",         "label":"Fermetures",       "weight":0.10},
    {"zone":"packaging",        "label":"Emballage",        "weight":0.05}
  ]'::jsonb,
  6, 8
FROM public.brands b
JOIN (VALUES
  ('Trefoil Track Jacket', 'trefoil-track-jacket'),
  ('Firebird Track Jacket','firebird-track-jacket'),
  ('Adicolor Crewneck',    'adicolor-crewneck')
) AS m(name, slug) ON b.slug = 'adidas'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ============================================================
-- A.3 : Canada Goose — nouvelle marque + modèles
-- ============================================================

INSERT INTO public.brands (name, slug, category, photo_protocol)
VALUES (
  'Canada Goose',
  'canada-goose',
  'clothing',
  '[
    {"name":"front_full",        "label":"Vue de face",         "required":true},
    {"name":"back_full",         "label":"Vue arriere",         "required":true},
    {"name":"label_neck",        "label":"Etiquette col",       "required":true},
    {"name":"label_wash",        "label":"Etiquette lavage",    "required":true},
    {"name":"logo_closeup",      "label":"Logo gros plan",      "required":true},
    {"name":"material_closeup",  "label":"Matiere gros plan",   "required":true}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone":"neck_label",       "label":"Etiquette col",    "weight":0.20},
    {"zone":"print_embroidery", "label":"Print/Broderie",   "weight":0.20},
    {"zone":"stitching",        "label":"Coutures",         "weight":0.15},
    {"zone":"fabric",           "label":"Tissu",            "weight":0.15},
    {"zone":"tags",             "label":"Tags",             "weight":0.15},
    {"zone":"closures",         "label":"Fermetures",       "weight":0.10},
    {"zone":"packaging",        "label":"Emballage",        "weight":0.05}
  ]'::jsonb,
  6, 8
FROM public.brands b
JOIN (VALUES
  ('Chilliwack Bomber', 'chilliwack-bomber'),
  ('Expedition Parka',  'expedition-parka'),
  ('Snow Mantra',       'snow-mantra'),
  ('Freestyle Vest',    'freestyle-vest')
) AS m(name, slug) ON b.slug = 'canada-goose'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ============================================================
-- A.4 : Palm Angels — nouvelle marque + modèles
-- ============================================================

INSERT INTO public.brands (name, slug, category, photo_protocol)
VALUES (
  'Palm Angels',
  'palm-angels',
  'clothing',
  '[
    {"name":"front_full",        "label":"Vue de face",         "required":true},
    {"name":"back_full",         "label":"Vue arriere",         "required":true},
    {"name":"label_neck",        "label":"Etiquette col",       "required":true},
    {"name":"label_wash",        "label":"Etiquette lavage",    "required":true},
    {"name":"logo_closeup",      "label":"Logo gros plan",      "required":true},
    {"name":"material_closeup",  "label":"Matiere gros plan",   "required":true}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone":"neck_label",       "label":"Etiquette col",    "weight":0.20},
    {"zone":"print_embroidery", "label":"Print/Broderie",   "weight":0.20},
    {"zone":"stitching",        "label":"Coutures",         "weight":0.15},
    {"zone":"fabric",           "label":"Tissu",            "weight":0.15},
    {"zone":"tags",             "label":"Tags",             "weight":0.15},
    {"zone":"closures",         "label":"Fermetures",       "weight":0.10},
    {"zone":"packaging",        "label":"Emballage",        "weight":0.05}
  ]'::jsonb,
  6, 8
FROM public.brands b
JOIN (VALUES
  ('PA Logo T-Shirt',  'pa-logo-t-shirt'),
  ('PA Track Jacket',  'pa-track-jacket'),
  ('PA Hoodie',        'pa-hoodie'),
  ('PA Bear T-Shirt',  'pa-bear-t-shirt')
) AS m(name, slug) ON b.slug = 'palm-angels'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ============================================================
-- A.5 : Fear of God / Essentials — modèles complémentaires
-- (brand slug 'fear-of-god' existe déjà depuis migration 006)
-- ============================================================

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone":"neck_label",       "label":"Etiquette col",    "weight":0.20},
    {"zone":"print_embroidery", "label":"Print/Broderie",   "weight":0.20},
    {"zone":"stitching",        "label":"Coutures",         "weight":0.15},
    {"zone":"fabric",           "label":"Tissu",            "weight":0.15},
    {"zone":"tags",             "label":"Tags",             "weight":0.15},
    {"zone":"closures",         "label":"Fermetures",       "weight":0.10},
    {"zone":"packaging",        "label":"Emballage",        "weight":0.05}
  ]'::jsonb,
  6, 8
FROM public.brands b
JOIN (VALUES
  ('Essentials Pullover',  'essentials-pullover'),
  ('Essentials Sweatpant', 'essentials-sweatpant')
) AS m(name, slug) ON b.slug = 'fear-of-god'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ============================================================
-- A.6 : Moncler — nouvelle marque + modèles
-- ============================================================

INSERT INTO public.brands (name, slug, category, photo_protocol)
VALUES (
  'Moncler',
  'moncler',
  'clothing',
  '[
    {"name":"front_full",        "label":"Vue de face",              "required":true},
    {"name":"back_full",         "label":"Vue arriere",              "required":true},
    {"name":"label_neck",        "label":"Etiquette col",            "required":true},
    {"name":"label_wash",        "label":"Etiquette lavage",         "required":true},
    {"name":"logo_closeup",      "label":"Logo gros plan",           "required":true},
    {"name":"material_closeup",  "label":"Matiere gros plan",        "required":true},
    {"name":"stitching_detail",  "label":"Coutures gros plan",       "required":true}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone":"neck_label",       "label":"Etiquette col",    "weight":0.20},
    {"zone":"print_embroidery", "label":"Print/Broderie",   "weight":0.20},
    {"zone":"stitching",        "label":"Coutures",         "weight":0.15},
    {"zone":"fabric",           "label":"Tissu",            "weight":0.15},
    {"zone":"tags",             "label":"Tags",             "weight":0.15},
    {"zone":"closures",         "label":"Fermetures",       "weight":0.10},
    {"zone":"packaging",        "label":"Emballage",        "weight":0.05}
  ]'::jsonb,
  6, 8
FROM public.brands b
JOIN (VALUES
  ('Maya Jacket',    'maya-jacket'),
  ('Montcla Jacket', 'montcla-jacket'),
  ('Branson Jacket', 'branson-jacket'),
  ('Poldo Vest',     'poldo-vest')
) AS m(name, slug) ON b.slug = 'moncler'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ============================================================
-- A.7 : Arc'teryx — nouvelle marque + modèles
-- (apostrophe dans le nom — utiliser la syntaxe d'échappement SQL)
-- ============================================================

INSERT INTO public.brands (name, slug, category, photo_protocol)
VALUES (
  'Arc''teryx',
  'arcteryx',
  'clothing',
  '[
    {"name":"front_full",        "label":"Vue de face",         "required":true},
    {"name":"back_full",         "label":"Vue arriere",         "required":true},
    {"name":"label_neck",        "label":"Etiquette col",       "required":true},
    {"name":"label_wash",        "label":"Etiquette lavage",    "required":true},
    {"name":"logo_closeup",      "label":"Logo gros plan",      "required":true},
    {"name":"material_closeup",  "label":"Matiere gros plan",   "required":true}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone":"neck_label",       "label":"Etiquette col",    "weight":0.20},
    {"zone":"print_embroidery", "label":"Print/Broderie",   "weight":0.20},
    {"zone":"stitching",        "label":"Coutures",         "weight":0.15},
    {"zone":"fabric",           "label":"Tissu",            "weight":0.15},
    {"zone":"tags",             "label":"Tags",             "weight":0.15},
    {"zone":"closures",         "label":"Fermetures",       "weight":0.10},
    {"zone":"packaging",        "label":"Emballage",        "weight":0.05}
  ]'::jsonb,
  6, 8
FROM public.brands b
JOIN (VALUES
  ('Beta LT Jacket',   'beta-lt-jacket'),
  ('Alpha SV Jacket',  'alpha-sv-jacket'),
  ('Atom LT Hoody',    'atom-lt-hoody'),
  ('Squamish Hoody',   'squamish-hoody')
) AS m(name, slug) ON b.slug = 'arcteryx'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ============================================================
-- SECTION B : SACS — Note Balenciaga multi-catégories
-- ============================================================

-- Balenciaga: marque bag avec modeles multi-categories (sneakers, clothing, bag) — comportement voulu
-- Les modèles clothing (bal-speed-t-shirt, bal-logo-hoodie, etc.) ajoutés en migration 006
-- sous la marque balenciaga (category='bag') sont intentionnellement laissés en place.
-- Une marque peut avoir des modèles de plusieurs catégories — la contrainte unique est (brand_id, slug).

-- ============================================================
-- SECTION C : MARQUES MULTI-CATÉGORIES — modèles clothing complémentaires
-- Dior, Gucci, Prada : s'assurer que les modèles clothing clés sont présents
-- (toutes ces marques existent déjà en DB depuis migrations précédentes)
-- ============================================================

-- ---- Dior clothing — modèle complémentaire ----
-- (brand slug 'dior' existe comme marque 'bag' ; clothing déjà ajouté en 006)
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone":"neck_label",       "label":"Etiquette col",    "weight":0.20},
    {"zone":"print_embroidery", "label":"Print/Broderie",   "weight":0.20},
    {"zone":"stitching",        "label":"Coutures",         "weight":0.15},
    {"zone":"fabric",           "label":"Tissu",            "weight":0.15},
    {"zone":"tags",             "label":"Tags",             "weight":0.15},
    {"zone":"closures",         "label":"Fermetures",       "weight":0.10},
    {"zone":"packaging",        "label":"Emballage",        "weight":0.05}
  ]'::jsonb,
  6, 8
FROM public.brands b
JOIN (VALUES
  ('Dior Oblique T-Shirt', 'dior-oblique-t-shirt')
) AS m(name, slug) ON b.slug = 'dior'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Gucci clothing — modèle complémentaire ----
-- (brand slug 'gucci' existe comme marque 'bag' ; clothing déjà ajouté en 006)
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone":"neck_label",       "label":"Etiquette col",    "weight":0.20},
    {"zone":"print_embroidery", "label":"Print/Broderie",   "weight":0.20},
    {"zone":"stitching",        "label":"Coutures",         "weight":0.15},
    {"zone":"fabric",           "label":"Tissu",            "weight":0.15},
    {"zone":"tags",             "label":"Tags",             "weight":0.15},
    {"zone":"closures",         "label":"Fermetures",       "weight":0.10},
    {"zone":"packaging",        "label":"Emballage",        "weight":0.05}
  ]'::jsonb,
  6, 8
FROM public.brands b
JOIN (VALUES
  ('Gucci Logo Sweatshirt', 'gucci-logo-sweatshirt')
) AS m(name, slug) ON b.slug = 'gucci'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ---- Prada clothing — modèles (pas encore ajoutés dans les migrations précédentes) ----
-- (brand slug 'prada' existe comme marque 'bag')
INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
SELECT b.id, m.name, m.slug,
  '[
    {"zone":"neck_label",       "label":"Etiquette col",    "weight":0.20},
    {"zone":"print_embroidery", "label":"Print/Broderie",   "weight":0.20},
    {"zone":"stitching",        "label":"Coutures",         "weight":0.15},
    {"zone":"fabric",           "label":"Tissu",            "weight":0.15},
    {"zone":"tags",             "label":"Tags",             "weight":0.15},
    {"zone":"closures",         "label":"Fermetures",       "weight":0.10},
    {"zone":"packaging",        "label":"Emballage",        "weight":0.05}
  ]'::jsonb,
  6, 8
FROM public.brands b
JOIN (VALUES
  ('Prada Logo T-Shirt',    'prada-logo-t-shirt'),
  ('Prada Nylon Jacket',    'prada-nylon-jacket'),
  ('Prada Re-Nylon Bag Pack','re-nylon-backpack')
) AS m(name, slug) ON b.slug = 'prada'
ON CONFLICT (brand_id, slug) DO NOTHING;

-- ============================================================
-- SECTION D : specific_auth_points pour nouvelles marques outdoor premium
-- Mise à jour uniquement des modèles sans specific_auth_points (IS NULL)
-- ============================================================

-- ---- Moncler : points d'authentification spécifiques ----
UPDATE public.models
SET specific_auth_points = '["Down fill power (verif. etiquette)","Coutures YKK zip","Badge Moncler broderie qualite","Logo MONCLER police"]'::jsonb
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'moncler')
  AND specific_auth_points IS NULL;

-- ---- Arc'teryx : points d'authentification spécifiques ----
UPDATE public.models
SET specific_auth_points = '["Gore-Tex membrane tag","Seam sealing qualite","Arc''teryx bird logo broderie","Zip YKK Aquaguard"]'::jsonb
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'arcteryx')
  AND specific_auth_points IS NULL;

-- ---- Canada Goose : points d'authentification spécifiques ----
UPDATE public.models
SET specific_auth_points = '["Patch Canada Goose Arctic Programme","Down fill tag","YKK zip","Country of manufacture Canada"]'::jsonb
WHERE brand_id = (SELECT id FROM public.brands WHERE slug = 'canada-goose')
  AND specific_auth_points IS NULL;
