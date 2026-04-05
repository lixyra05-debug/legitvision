-- ============================================================
-- LegitVision — Migration 003 : Marques & Modèles (masse)
-- 29 nouvelles marques · 62 nouveaux modèles
-- Catégories : sneakers · bag · watch · clothing
-- Sûr à rejouer : toutes les insertions utilisent ON CONFLICT DO NOTHING
-- ============================================================

-- ============================================================
-- PHOTO PROTOCOL TEMPLATES (définis par catégorie)
--
-- SNEAKERS : overall_front, overall_back, overall_side_lateral,
--            overall_side_medial, outsole, toe_box_closeup,
--            heel_closeup, tongue_label, insole, size_tag, box_label
--
-- BAG      : overall_front, overall_back, overall_side, interior,
--            hardware_closeup, stitching_closeup, serial_tag,
--            logo_closeup, zipper_closeup, base, strap_closeup
--
-- WATCH    : dial_front, caseback, crown_side, bracelet_clasp,
--            bezel_closeup, crystal_side, lug_detail, movement_if_visible
--
-- CLOTHING : front_full, back_full, label_neck, label_wash,
--            logo_closeup, zipper_detail, material_closeup, stitching_detail
-- ============================================================


-- ============================================================
-- SECTION 1 : NOUVELLES MARQUES (29 marques)
-- Le photo_protocol est assigné par template de catégorie.
-- ============================================================

INSERT INTO public.brands (name, slug, category, photo_protocol)
SELECT
  b.brand_name,
  b.brand_slug,
  b.brand_category,
  CASE b.brand_category
    WHEN 'sneakers' THEN '[
      {"name": "overall_front",        "label": "Vue de face",                    "required": true,  "min_resolution": "800x800"},
      {"name": "overall_back",         "label": "Vue arrière",                    "required": true,  "min_resolution": "800x800"},
      {"name": "overall_side_lateral", "label": "Vue latérale (côté extérieur)", "required": true,  "min_resolution": "800x800"},
      {"name": "overall_side_medial",  "label": "Vue médiale (côté intérieur)",  "required": true,  "min_resolution": "800x800"},
      {"name": "outsole",              "label": "Semelle extérieure (dessous)",   "required": true,  "min_resolution": "800x800"},
      {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)", "required": true,  "min_resolution": "800x800"},
      {"name": "heel_closeup",         "label": "Talon (gros plan)",              "required": true,  "min_resolution": "800x800"},
      {"name": "tongue_label",         "label": "Étiquette de languette",         "required": true,  "min_resolution": "800x800"},
      {"name": "insole",               "label": "Semelle intérieure",             "required": true,  "min_resolution": "800x800"},
      {"name": "size_tag",             "label": "Étiquette de taille",            "required": true,  "min_resolution": "800x800"},
      {"name": "box_label",            "label": "Étiquette de la boîte",          "required": false, "min_resolution": "800x800"}
    ]'::jsonb
    WHEN 'bag' THEN '[
      {"name": "overall_front",     "label": "Vue de face",                       "required": true,  "min_resolution": "800x800"},
      {"name": "overall_back",      "label": "Vue arrière",                       "required": true,  "min_resolution": "800x800"},
      {"name": "overall_side",      "label": "Vue de côté",                       "required": true,  "min_resolution": "800x800"},
      {"name": "interior",          "label": "Intérieur du sac",                  "required": true,  "min_resolution": "800x800"},
      {"name": "hardware_closeup",  "label": "Quincaillerie (gros plan)",         "required": true,  "min_resolution": "800x800"},
      {"name": "stitching_closeup", "label": "Coutures (gros plan)",              "required": true,  "min_resolution": "800x800"},
      {"name": "serial_tag",        "label": "Numéro de série / code date",       "required": true,  "min_resolution": "800x800"},
      {"name": "logo_closeup",      "label": "Logo (gros plan)",                  "required": true,  "min_resolution": "800x800"},
      {"name": "zipper_closeup",    "label": "Fermeture éclair (gros plan)",      "required": false, "min_resolution": "800x800"},
      {"name": "base",              "label": "Base du sac",                       "required": true,  "min_resolution": "800x800"},
      {"name": "strap_closeup",     "label": "Bandoulière et anses (gros plan)",  "required": false, "min_resolution": "800x800"}
    ]'::jsonb
    WHEN 'watch' THEN '[
      {"name": "dial_front",          "label": "Cadran (vue de face)",            "required": true,  "min_resolution": "800x800"},
      {"name": "caseback",            "label": "Fond de boîtier",                 "required": true,  "min_resolution": "800x800"},
      {"name": "crown_side",          "label": "Couronne (vue de côté)",          "required": true,  "min_resolution": "800x800"},
      {"name": "bracelet_clasp",      "label": "Bracelet et boucle déployante",   "required": true,  "min_resolution": "800x800"},
      {"name": "bezel_closeup",       "label": "Lunette (gros plan)",             "required": true,  "min_resolution": "800x800"},
      {"name": "crystal_side",        "label": "Verre saphir (vue de côté)",      "required": true,  "min_resolution": "800x800"},
      {"name": "lug_detail",          "label": "Cornes du boîtier (gros plan)",   "required": true,  "min_resolution": "800x800"},
      {"name": "movement_if_visible", "label": "Mouvement (si visible)",          "required": false, "min_resolution": "800x800"}
    ]'::jsonb
    ELSE '[
      {"name": "front_full",       "label": "Vue de face complète",              "required": true,  "min_resolution": "800x800"},
      {"name": "back_full",        "label": "Vue arrière complète",              "required": true,  "min_resolution": "800x800"},
      {"name": "label_neck",       "label": "Étiquette col / encolure",          "required": true,  "min_resolution": "800x800"},
      {"name": "label_wash",       "label": "Étiquette entretien lavage",        "required": true,  "min_resolution": "800x800"},
      {"name": "logo_closeup",     "label": "Logo principal (gros plan)",        "required": true,  "min_resolution": "800x800"},
      {"name": "zipper_detail",    "label": "Fermeture zip (gros plan)",         "required": false, "min_resolution": "800x800"},
      {"name": "material_closeup", "label": "Texture matière (gros plan)",       "required": true,  "min_resolution": "800x800"},
      {"name": "stitching_detail", "label": "Coutures et broderie (gros plan)",  "required": true,  "min_resolution": "800x800"}
    ]'::jsonb
  END
FROM (VALUES
  -- Sneakers (collaborations)
  ('Travis Scott',    'travis-scott',    'sneakers'),
  ('Off-White',       'off-white',       'sneakers'),
  -- Sacs de luxe
  ('Gucci',           'gucci',           'bag'),
  ('Chanel',          'chanel',          'bag'),
  ('Dior',            'dior',            'bag'),
  ('Hermès',          'hermes',          'bag'),
  ('Prada',           'prada',           'bag'),
  ('Saint Laurent',   'saint-laurent',   'bag'),
  ('Balenciaga',      'balenciaga',      'bag'),
  ('Celine',          'celine',          'bag'),
  ('Fendi',           'fendi',           'bag'),
  ('Bottega Veneta',  'bottega-veneta',  'bag'),
  ('Goyard',          'goyard',          'bag'),
  -- Montres de luxe
  ('Rolex',           'rolex',           'watch'),
  ('Omega',           'omega',           'watch'),
  ('Audemars Piguet', 'audemars-piguet', 'watch'),
  ('Patek Philippe',  'patek-philippe',  'watch'),
  ('Cartier',         'cartier',         'watch'),
  ('TAG Heuer',       'tag-heuer',       'watch'),
  ('Richard Mille',   'richard-mille',   'watch'),
  ('Hublot',          'hublot',          'watch'),
  -- Vêtements streetwear / outdoor
  ('Supreme',         'supreme',         'clothing'),
  ('Moncler',         'moncler',         'clothing'),
  ('Canada Goose',    'canada-goose',    'clothing'),
  ('Stone Island',    'stone-island',    'clothing'),
  ('Palm Angels',     'palm-angels',     'clothing'),
  ('The North Face',  'the-north-face',  'clothing'),
  ('Essentials',      'essentials',      'clothing'),
  ('Arc''teryx',      'arcteryx',        'clothing')
) AS b(brand_name, brand_slug, brand_category)
ON CONFLICT DO NOTHING;


-- ============================================================
-- SECTION 2 : NOUVEAUX MODÈLES — Marques existantes
-- ============================================================

-- ---- 2.1 Nike (4 nouveaux modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'nike'),
    'Dunk Low Panda', 'dunk-low-panda',
    '[
      {"zone": "swoosh_placement",   "label": "Placement et forme du Swoosh",          "weight": 0.20},
      {"zone": "toe_box_shape",      "label": "Forme de la toe box",                   "weight": 0.20},
      {"zone": "heel_tab_stitching", "label": "Coutures du tab talon",                 "weight": 0.15},
      {"zone": "tongue_tag",         "label": "Étiquette de languette",                "weight": 0.15},
      {"zone": "insole_logo",        "label": "Logo semelle intérieure",               "weight": 0.15},
      {"zone": "midsole_paint",      "label": "Peinture et finition midsole",          "weight": 0.15}
    ]'::jsonb,
    8, 10
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'nike'),
    'Air Force 1 Low White', 'air-force-1-low-white',
    '[
      {"zone": "swoosh_stitching",     "label": "Coutures du Swoosh",                  "weight": 0.25},
      {"zone": "air_unit",             "label": "Unité Air visible (semelle)",          "weight": 0.20},
      {"zone": "heel_stamp",           "label": "Marquage talon",                      "weight": 0.20},
      {"zone": "tongue_label",         "label": "Étiquette de languette",              "weight": 0.20},
      {"zone": "toe_box_perforations", "label": "Perforations de la toe box",          "weight": 0.15}
    ]'::jsonb,
    8, 10
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'nike'),
    'Air Max 1', 'air-max-1',
    '[
      {"zone": "mudguard_shape",      "label": "Forme du mudguard",                    "weight": 0.30},
      {"zone": "swoosh_placement",    "label": "Placement du Swoosh",                  "weight": 0.25},
      {"zone": "air_unit_visibility", "label": "Visibilité de la bulle Air",           "weight": 0.25},
      {"zone": "mini_swoosh",         "label": "Mini Swoosh talon",                    "weight": 0.20}
    ]'::jsonb,
    8, 10
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'nike'),
    'Air Max 90', 'air-max-90',
    '[
      {"zone": "mudguard_panel", "label": "Panneau mudguard (forme et coutures)",      "weight": 0.30},
      {"zone": "tape_overlay",   "label": "Overlay et bandes latérales",               "weight": 0.25},
      {"zone": "air_unit",       "label": "Unité Air visible",                         "weight": 0.25},
      {"zone": "heel_patch",     "label": "Patch talon (logo, couleur)",               "weight": 0.20}
    ]'::jsonb,
    8, 10
  )
ON CONFLICT DO NOTHING;


-- ---- 2.2 Jordan (10 nouveaux modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'jordan'),
    'Air Jordan 1 Low', 'air-jordan-1-low',
    '[
      {"zone": "swoosh",          "label": "Forme et placement du Swoosh",             "weight": 0.25},
      {"zone": "wings_logo",      "label": "Logo Wings (position, profondeur)",        "weight": 0.20},
      {"zone": "toe_box",         "label": "Forme et perforations de la toe box",      "weight": 0.20},
      {"zone": "collar",          "label": "Forme et hauteur du col",                  "weight": 0.20},
      {"zone": "outsole_pattern", "label": "Motif de la semelle extérieure",           "weight": 0.15}
    ]'::jsonb,
    8, 10
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'jordan'),
    'Air Jordan 1 High Dark Mocha', 'air-jordan-1-high-dark-mocha',
    '[
      {"zone": "reversed_swoosh", "label": "Swoosh inversé (sens et coutures)",        "weight": 0.25},
      {"zone": "suede_quality",   "label": "Qualité et grain du suède",                "weight": 0.20},
      {"zone": "wings_logo",      "label": "Logo Wings (embossage, positionnement)",   "weight": 0.20},
      {"zone": "collar_height",   "label": "Hauteur et forme du col",                  "weight": 0.20},
      {"zone": "midsole",         "label": "Forme et finition de la midsole",          "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'jordan'),
    'Air Jordan 1 High Chicago', 'air-jordan-1-high-chicago',
    '[
      {"zone": "swoosh",          "label": "Forme et placement du Swoosh",             "weight": 0.25},
      {"zone": "wings_logo",      "label": "Logo Wings (position, profondeur)",        "weight": 0.20},
      {"zone": "toe_box_leather", "label": "Cuir de la toe box (grain, finition)",     "weight": 0.20},
      {"zone": "collar",          "label": "Forme du col",                             "weight": 0.20},
      {"zone": "tongue_tag",      "label": "Étiquette Nike Air de la languette",       "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'jordan'),
    'Air Jordan 3 White Cement', 'air-jordan-3-white-cement',
    '[
      {"zone": "elephant_print", "label": "Imprimé éléphant (texture, alignement)",   "weight": 0.30},
      {"zone": "jumpman_tongue", "label": "Jumpman languette (position, relief)",      "weight": 0.20},
      {"zone": "heel_tab",       "label": "Tab talon (forme, coutures)",               "weight": 0.20},
      {"zone": "midsole",        "label": "Midsole (forme, couleur)",                  "weight": 0.15},
      {"zone": "air_unit",       "label": "Unité Air visible",                         "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'jordan'),
    'Air Jordan 4 Black Cat', 'air-jordan-4-black-cat',
    '[
      {"zone": "nubuck_texture", "label": "Texture nubuck (grain, uniformité)",        "weight": 0.25},
      {"zone": "jumpman_heel",   "label": "Jumpman talon (taille, position)",          "weight": 0.20},
      {"zone": "netting",        "label": "Filet latéral (forme, maille)",             "weight": 0.20},
      {"zone": "tongue_tag",     "label": "Étiquette de languette",                    "weight": 0.20},
      {"zone": "midsole_cage",   "label": "Cage midsole (forme, alignement)",          "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'jordan'),
    'Air Jordan 4 Military Black', 'air-jordan-4-military-black',
    '[
      {"zone": "mesh_netting",  "label": "Filet mesh (texture, couleur)",              "weight": 0.25},
      {"zone": "heel_tab",      "label": "Tab talon (forme, coutures)",                "weight": 0.20},
      {"zone": "tongue_tag",    "label": "Étiquette de languette",                     "weight": 0.20},
      {"zone": "midsole_cage",  "label": "Cage midsole",                               "weight": 0.20},
      {"zone": "air_unit",      "label": "Unité Air visible",                          "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'jordan'),
    'Air Jordan 4 University Blue', 'air-jordan-4-university-blue',
    '[
      {"zone": "nubuck_quality", "label": "Qualité nubuck (grain, uniformité)",        "weight": 0.25},
      {"zone": "cage",           "label": "Cage latérale (forme, alignement)",         "weight": 0.20},
      {"zone": "heel_tab",       "label": "Tab talon",                                 "weight": 0.20},
      {"zone": "jumpman_tag",    "label": "Tag Jumpman languette",                     "weight": 0.20},
      {"zone": "midsole",        "label": "Forme et finition midsole",                 "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'jordan'),
    'Air Jordan 5 Off-White Sail', 'air-jordan-5-off-white-sail',
    '[
      {"zone": "translucent_panels", "label": "Panneaux translucides (clarté, forme)", "weight": 0.25},
      {"zone": "shark_teeth",        "label": "Dents de requin (forme, alignement)",   "weight": 0.20},
      {"zone": "heel_23",            "label": "Numéro 23 talon (police, placement)",   "weight": 0.20},
      {"zone": "lace_locks",         "label": "Lace locks (forme, matière)",           "weight": 0.20},
      {"zone": "tongue",             "label": "Languette (forme, étiquette)",          "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'jordan'),
    'Air Jordan 11 Bred', 'air-jordan-11-bred',
    '[
      {"zone": "patent_leather",     "label": "Cuir verni (brillance, alignement)",    "weight": 0.30},
      {"zone": "carbon_fiber_plate", "label": "Plaque fibre de carbone",               "weight": 0.25},
      {"zone": "jumpman",            "label": "Logo Jumpman (placement, détail)",      "weight": 0.15},
      {"zone": "heel_23",            "label": "Numéro 23 talon",                       "weight": 0.15},
      {"zone": "outsole",            "label": "Semelle extérieure (motif, couleur)",   "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'jordan'),
    'Air Jordan 11 Concord', 'air-jordan-11-concord',
    '[
      {"zone": "patent_leather", "label": "Cuir verni (brillance, découpe)",           "weight": 0.30},
      {"zone": "heel_45",        "label": "Numéro 45 talon (police, placement)",       "weight": 0.25},
      {"zone": "carbon_fiber",   "label": "Fibre de carbone (texture, alignement)",    "weight": 0.25},
      {"zone": "jumpman_tongue", "label": "Jumpman sur languette",                     "weight": 0.20}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- 2.3 adidas (5 nouveaux modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'adidas'),
    'Campus 00s Core Black', 'campus-00s-core-black',
    '[
      {"zone": "suede_quality",          "label": "Qualité suède (grain, nap)",        "weight": 0.25},
      {"zone": "trefoil_tongue",         "label": "Trefoil languette (broderie)",      "weight": 0.20},
      {"zone": "shell_toe",              "label": "Shell toe (forme, coutures)",       "weight": 0.20},
      {"zone": "three_stripes_stitching","label": "Coutures des 3 bandes",            "weight": 0.20},
      {"zone": "heel_tab",               "label": "Tab talon (forme, logo)",           "weight": 0.15}
    ]'::jsonb,
    8, 10
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'adidas'),
    'Samba OG Cloud White', 'samba-og-cloud-white',
    '[
      {"zone": "leather_grain",  "label": "Grain du cuir (texture, finition)",         "weight": 0.20},
      {"zone": "t_toe",          "label": "T-toe (forme, coutures)",                   "weight": 0.20},
      {"zone": "three_stripes",  "label": "3 bandes (placement, coutures)",            "weight": 0.15},
      {"zone": "tongue_label",   "label": "Étiquette de languette",                   "weight": 0.15},
      {"zone": "gum_sole",       "label": "Semelle gomme (couleur, motif)",            "weight": 0.15},
      {"zone": "gold_foil",      "label": "Dorure trefoil (brillance, alignement)",   "weight": 0.15}
    ]'::jsonb,
    8, 10
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'adidas'),
    'Gazelle', 'gazelle',
    '[
      {"zone": "suede_nap",    "label": "Nap du suède (orientation, longueur)",        "weight": 0.25},
      {"zone": "trefoil_heel", "label": "Trefoil talon (broderie, placement)",         "weight": 0.20},
      {"zone": "t_toe",        "label": "T-toe (forme, coutures)",                    "weight": 0.20},
      {"zone": "tongue_label", "label": "Étiquette de languette",                    "weight": 0.20},
      {"zone": "outsole",      "label": "Semelle (motif, couleur gomme)",             "weight": 0.15}
    ]'::jsonb,
    8, 10
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'adidas'),
    'Yeezy 350 V2 Zebra', 'yeezy-350-v2-zebra',
    '[
      {"zone": "primeknit_pattern", "label": "Motif Primeknit Zebra (alignement)",    "weight": 0.25},
      {"zone": "sply_350_text",     "label": "Texte SPLY-350 (police, placement)",    "weight": 0.25},
      {"zone": "boost_sole",        "label": "Semelle Boost (granularité, couleur)",  "weight": 0.20},
      {"zone": "pull_tab",          "label": "Pull tab (forme, longueur)",            "weight": 0.15},
      {"zone": "heel_shape",        "label": "Forme du talon",                        "weight": 0.15}
    ]'::jsonb,
    8, 10
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'adidas'),
    'Yeezy Slide Bone', 'yeezy-slide-bone',
    '[
      {"zone": "eva_foam_texture", "label": "Texture mousse EVA (uniformité)",        "weight": 0.30},
      {"zone": "shark_tooth_sole", "label": "Semelle dents de requin (forme)",        "weight": 0.25},
      {"zone": "sizing_stamp",     "label": "Tampon taille intérieur (lisibilité)",   "weight": 0.25},
      {"zone": "molding_lines",    "label": "Lignes de moulage (finition)",           "weight": 0.20}
    ]'::jsonb,
    6, 8
  )
ON CONFLICT DO NOTHING;


-- ---- 2.4 New Balance (3 nouveaux modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'new-balance'),
    '2002R Protection Pack', 'nb-2002r-protection-pack',
    '[
      {"zone": "n_logo_stitching", "label": "Coutures logo N (précision, profondeur)", "weight": 0.30},
      {"zone": "abzorb_midsole",   "label": "Midsole ABZORB (forme, couleur)",         "weight": 0.25},
      {"zone": "tongue_label",     "label": "Étiquette de languette",                  "weight": 0.25},
      {"zone": "suede_panels",     "label": "Panneaux suède (grain, qualité)",          "weight": 0.20}
    ]'::jsonb,
    8, 10
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'new-balance'),
    '990v5 Grey', 'nb-990v5-grey',
    '[
      {"zone": "pigskin_suede",   "label": "Suède pigskin (grain caractéristique)",    "weight": 0.25},
      {"zone": "reflective_n",    "label": "Logo N réfléchissant (coutures, angle)",   "weight": 0.25},
      {"zone": "encap_midsole",   "label": "Midsole ENCAP (forme, dégradé)",           "weight": 0.25},
      {"zone": "made_in_usa_tag", "label": "Étiquette Made in USA",                    "weight": 0.25}
    ]'::jsonb,
    8, 10
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'new-balance'),
    '530 White Silver', 'nb-530-white-silver',
    '[
      {"zone": "mesh_quality", "label": "Qualité mesh (texture, transparence)",        "weight": 0.30},
      {"zone": "n_logo",       "label": "Logo N (forme, coutures, placement)",         "weight": 0.25},
      {"zone": "abzorb_heel",  "label": "Insert ABZORB talon",                         "weight": 0.25},
      {"zone": "tongue_label", "label": "Étiquette de languette",                     "weight": 0.20}
    ]'::jsonb,
    8, 10
  )
ON CONFLICT DO NOTHING;


-- ---- 2.5 Louis Vuitton (3 nouveaux modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'louis-vuitton'),
    'Keepall 50 Bandoulière', 'keepall-50-bandouliere',
    '[
      {"zone": "monogram_alignment",  "label": "Alignement monogramme LV",              "weight": 0.20},
      {"zone": "hardware_engravings", "label": "Gravures quincaillerie (LV, profondeur)","weight": 0.20},
      {"zone": "stitching",           "label": "Coutures (régularité, couleur moutarde)","weight": 0.15},
      {"zone": "date_code",           "label": "Code date / puce RFID",                 "weight": 0.15},
      {"zone": "handles",             "label": "Anses vachetta (coutures, symétrie)",    "weight": 0.15},
      {"zone": "zipper",              "label": "Fermeture éclair (marquage, fluidité)",  "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'louis-vuitton'),
    'Pochette Métis', 'pochette-metis',
    '[
      {"zone": "monogram_alignment", "label": "Alignement monogramme LV",               "weight": 0.20},
      {"zone": "s_lock_clasp",       "label": "Serrure S-lock (gravure, alignement)",    "weight": 0.20},
      {"zone": "stitching",          "label": "Coutures (régularité, couleur)",           "weight": 0.15},
      {"zone": "date_code",          "label": "Code date / puce RFID",                   "weight": 0.15},
      {"zone": "canvas_texture",     "label": "Texture canvas Monogram",                 "weight": 0.15},
      {"zone": "strap",              "label": "Bandoulière (coutures, dorure)",           "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'louis-vuitton'),
    'Alma BB', 'alma-bb',
    '[
      {"zone": "monogram_alignment", "label": "Alignement monogramme LV",               "weight": 0.20},
      {"zone": "zipper_pull",        "label": "Tirette fermeture (gravure LV)",          "weight": 0.20},
      {"zone": "padlock",            "label": "Cadenas (gravure, numéro)",               "weight": 0.15},
      {"zone": "stitching",          "label": "Coutures (régularité, couleur)",           "weight": 0.15},
      {"zone": "vachetta_leather",   "label": "Cuir vachetta (patine, qualité)",          "weight": 0.15},
      {"zone": "date_code",          "label": "Code date / puce RFID",                   "weight": 0.15}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ============================================================
-- SECTION 3 : MODÈLES — Nouvelles marques
-- ============================================================

-- ---- 3.1 Travis Scott (3 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'travis-scott'),
    'AJ1 Low Reverse Mocha', 'aj1-low-reverse-mocha',
    '[
      {"zone": "reversed_swoosh",      "label": "Swoosh inversé (orientation, coutures)","weight": 0.25},
      {"zone": "suede_quality",        "label": "Qualité suède (grain, uniformité)",      "weight": 0.20},
      {"zone": "cactus_jack_branding", "label": "Branding Cactus Jack (broderie, logo)",  "weight": 0.25},
      {"zone": "heel_embroidery",      "label": "Broderie talon (précision, couleurs)",   "weight": 0.15},
      {"zone": "midsole_aging",        "label": "Vieillissement midsole (effet usé)",     "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'travis-scott'),
    'AJ1 Low Fragment', 'aj1-low-fragment',
    '[
      {"zone": "fragment_lightning_bolt","label": "Éclair Fragment (broderie, placement)", "weight": 0.35},
      {"zone": "reversed_swoosh",        "label": "Swoosh inversé (orientation, coutures)","weight": 0.25},
      {"zone": "heel_tab",               "label": "Tab talon (forme, coutures)",            "weight": 0.25},
      {"zone": "tooling",                "label": "Tooling semelle (forme, finition)",      "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'travis-scott'),
    'AJ4 Cactus Jack', 'aj4-cactus-jack',
    '[
      {"zone": "cage_netting",         "label": "Filet cage (forme, maille)",              "weight": 0.20},
      {"zone": "suede",                "label": "Qualité suède (grain, finition)",          "weight": 0.20},
      {"zone": "cactus_jack_branding", "label": "Branding Cactus Jack (logo, broderie)",   "weight": 0.30},
      {"zone": "midsole",              "label": "Forme et finition midsole",               "weight": 0.15},
      {"zone": "air_unit",             "label": "Unité Air visible",                       "weight": 0.15}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- 3.2 Off-White (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'off-white'),
    'Dunk Low The 50', 'dunk-low-the-50',
    '[
      {"zone": "zip_tie",            "label": "Zip tie (texte, police, couleur)",       "weight": 0.25},
      {"zone": "medial_text",        "label": "Texte médial (alignement, police)",      "weight": 0.20},
      {"zone": "swoosh_overlay",     "label": "Overlay Swoosh (découpe, coutures)",     "weight": 0.25},
      {"zone": "tongue_construction","label": "Construction languette (épaisseur)",     "weight": 0.15},
      {"zone": "laces",              "label": "Lacets (épaisseur, texture)",            "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'off-white'),
    'Air Presto The Ten', 'air-presto-the-ten',
    '[
      {"zone": "cage",       "label": "Cage extérieure (forme, découpes Off-White)",    "weight": 0.25},
      {"zone": "medial_text","label": "Texte médial (alignement, police Off-White)",    "weight": 0.20},
      {"zone": "swoosh",     "label": "Swoosh (taille, coutures caractéristiques)",     "weight": 0.25},
      {"zone": "pull_tab",   "label": "Pull tab (texte, finition)",                    "weight": 0.15},
      {"zone": "inner_tag",  "label": "Tag intérieur Off-White (police, hologramme)",   "weight": 0.15}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- 3.3 Gucci (3 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'gucci'),
    'GG Marmont Small', 'gg-marmont-small',
    '[
      {"zone": "double_g_hardware",  "label": "Fermoir double G (gravure, finition)",   "weight": 0.25},
      {"zone": "chevron_stitching",  "label": "Coutures chevron (régularité, densité)", "weight": 0.20},
      {"zone": "heart_on_back",      "label": "Broderie coeur dos du sac",              "weight": 0.15},
      {"zone": "serial_number",      "label": "Numéro de série intérieur",              "weight": 0.15},
      {"zone": "leather_grain",      "label": "Grain cuir matelassé (texture)",         "weight": 0.15},
      {"zone": "chain_strap",        "label": "Chaîne bandoulière (maillons, finition)","weight": 0.10}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'gucci'),
    'Dionysus Small', 'dionysus-small',
    '[
      {"zone": "tiger_head_clasp", "label": "Fermoir tête de tigre (détail, finition)","weight": 0.25},
      {"zone": "gg_canvas",        "label": "Canvas GG (alignement, netteté)",          "weight": 0.20},
      {"zone": "stitching",        "label": "Coutures (régularité, couleur)",            "weight": 0.15},
      {"zone": "chain_strap",      "label": "Chaîne bandoulière",                        "weight": 0.15},
      {"zone": "serial_tag",       "label": "Étiquette série intérieure",                "weight": 0.15},
      {"zone": "suede_lining",     "label": "Doublure suède (texture, couleur)",         "weight": 0.10}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'gucci'),
    'Jackie 1961 Small', 'jackie-1961-small',
    '[
      {"zone": "piston_closure",    "label": "Fermeture piston (clic, alignement)",     "weight": 0.30},
      {"zone": "gg_canvas_leather", "label": "Canvas GG ou cuir (qualité, netteté)",    "weight": 0.25},
      {"zone": "stitching",         "label": "Coutures (régularité, finition)",          "weight": 0.20},
      {"zone": "serial_number",     "label": "Numéro de série intérieur",               "weight": 0.15},
      {"zone": "hardware",          "label": "Quincaillerie (finition, gravure Gucci)",  "weight": 0.10}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- 3.4 Chanel (3 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'chanel'),
    'Classic Flap Medium', 'classic-flap-medium',
    '[
      {"zone": "cc_turn_lock",               "label": "Serrure CC tournante (alignement, relief)",      "weight": 0.25},
      {"zone": "diamond_quilting_stitch_count","label": "Matelassé losange (9-11 points par losange)",  "weight": 0.25},
      {"zone": "chain_strap_weave",          "label": "Tressage chaîne cuir (régularité)",             "weight": 0.15},
      {"zone": "serial_sticker",             "label": "Sticker hologramme série",                      "weight": 0.15},
      {"zone": "leather_grain",              "label": "Grain cuir (caviar ou agneau)",                  "weight": 0.10},
      {"zone": "authenticity_card",          "label": "Carte authenticité (police, hologramme)",        "weight": 0.10}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'chanel'),
    'Boy Bag Medium', 'boy-bag-medium',
    '[
      {"zone": "cc_boy_clasp",    "label": "Fermoir CC Boy (gravure, mécanisme)",       "weight": 0.25},
      {"zone": "quilting",        "label": "Matelassé (régularité, profondeur)",         "weight": 0.20},
      {"zone": "chain_strap",     "label": "Chaîne (maillons, cuir entrelacé)",          "weight": 0.15},
      {"zone": "serial_sticker",  "label": "Sticker hologramme série",                  "weight": 0.15},
      {"zone": "leather_quality", "label": "Qualité cuir (grain, souplesse)",            "weight": 0.15},
      {"zone": "interior_stamp",  "label": "Estampille intérieure Chanel",              "weight": 0.10}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'chanel'),
    'Wallet on Chain', 'wallet-on-chain',
    '[
      {"zone": "cc_clasp",       "label": "Serrure CC (alignement, profondeur gravure)","weight": 0.25},
      {"zone": "quilting",       "label": "Matelassé (régularité, profondeur)",          "weight": 0.20},
      {"zone": "chain",          "label": "Chaîne (maillons entrelacés, finition)",      "weight": 0.15},
      {"zone": "serial_sticker", "label": "Sticker hologramme série",                   "weight": 0.15},
      {"zone": "interior_stamp", "label": "Estampille intérieure",                      "weight": 0.15},
      {"zone": "caviar_grain",   "label": "Grain caviar (texture caractéristique)",      "weight": 0.10}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- 3.5 Dior (3 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'dior'),
    'Lady Dior Medium', 'lady-dior-medium',
    '[
      {"zone": "dior_charms",         "label": "Breloques D-I-O-R (police, finition)", "weight": 0.25},
      {"zone": "cannage_quilting",    "label": "Matelassé cannage (régularité, netteté)","weight": 0.20},
      {"zone": "serial_number",       "label": "Numéro de série intérieur",            "weight": 0.15},
      {"zone": "hardware_engravings", "label": "Gravures quincaillerie Dior",          "weight": 0.15},
      {"zone": "leather_quality",     "label": "Qualité cuir (grain, souplesse)",       "weight": 0.15},
      {"zone": "interior_tag",        "label": "Tag intérieur Christian Dior Paris",   "weight": 0.10}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'dior'),
    'Saddle Bag', 'saddle-bag',
    '[
      {"zone": "d_stirrup",               "label": "Étrier D (forme, gravure, finition)","weight": 0.30},
      {"zone": "oblique_canvas_alignment","label": "Alignement canvas Oblique",          "weight": 0.25},
      {"zone": "serial_tag",              "label": "Tag série intérieur",                "weight": 0.20},
      {"zone": "magnetic_closure",        "label": "Fermeture magnétique (alignement)", "weight": 0.15},
      {"zone": "stitching",               "label": "Coutures (régularité, couleur)",     "weight": 0.10}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'dior'),
    'Book Tote Medium', 'book-tote-medium',
    '[
      {"zone": "oblique_embroidery",  "label": "Broderie Oblique (densité, régularité)", "weight": 0.30},
      {"zone": "stitching",           "label": "Coutures bord (régularité, couleur)",    "weight": 0.25},
      {"zone": "interior_label",      "label": "Label intérieur Christian Dior Paris",   "weight": 0.20},
      {"zone": "handle_construction", "label": "Construction anses (coutures, symétrie)","weight": 0.15},
      {"zone": "canvas_weight",       "label": "Poids et rigidité du canvas",            "weight": 0.10}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- 3.6 Hermès (3 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'hermes'),
    'Birkin 30', 'birkin-30',
    '[
      {"zone": "sangles",                    "label": "Sangles rabat (coutures, symétrie)",    "weight": 0.15},
      {"zone": "tournante_clasp",            "label": "Serrure tournante (mécanisme, gravure)","weight": 0.20},
      {"zone": "blindstamp",                 "label": "Blindstamp artisan (lettre, année)",    "weight": 0.20},
      {"zone": "pearling",                   "label": "Perles bord (régularité, couleur)",     "weight": 0.10},
      {"zone": "saddle_stitching_fil_de_lin","label": "Coutures sellier fil de lin",           "weight": 0.20},
      {"zone": "clochette",                  "label": "Clochette et cadenas (numéro série)",   "weight": 0.10},
      {"zone": "lock_serial",                "label": "Numéro de série cadenas",               "weight": 0.05}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'hermes'),
    'Kelly 28', 'kelly-28',
    '[
      {"zone": "tournante_clasp",  "label": "Serrure tournante (mécanisme, gravure)",    "weight": 0.25},
      {"zone": "sangles",          "label": "Sangles et boucles (coutures, alignement)",  "weight": 0.15},
      {"zone": "blindstamp",       "label": "Blindstamp artisan",                         "weight": 0.20},
      {"zone": "saddle_stitching", "label": "Coutures sellier (régularité, fil de lin)",  "weight": 0.20},
      {"zone": "handle_attachment","label": "Fixation anses (coutures, symétrie)",        "weight": 0.10},
      {"zone": "clochette",        "label": "Clochette et cadenas",                       "weight": 0.10}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'hermes'),
    'Constance 24', 'constance-24',
    '[
      {"zone": "h_clasp",         "label": "Fermoir H (gravure, mécanisme, alignement)","weight": 0.35},
      {"zone": "stitching",       "label": "Coutures sellier (régularité, fil de lin)",  "weight": 0.20},
      {"zone": "blindstamp",      "label": "Blindstamp artisan (lettre, année)",          "weight": 0.25},
      {"zone": "snap_closure",    "label": "Snap de fermeture intérieur",                 "weight": 0.10},
      {"zone": "leather_quality", "label": "Qualité cuir (grain, souplesse, patine)",     "weight": 0.10}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- 3.7 Prada (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'prada'),
    'Re-Nylon Re-Edition 2005', 're-nylon-re-edition-2005',
    '[
      {"zone": "triangle_logo",  "label": "Logo triangle émaillé (alignement, relief)", "weight": 0.25},
      {"zone": "nylon_texture",  "label": "Texture nylon Re-Nylon (trame, densité)",    "weight": 0.20},
      {"zone": "hardware",       "label": "Quincaillerie (finition, gravure Prada)",     "weight": 0.15},
      {"zone": "serial_plate",   "label": "Plaque de série intérieure",                 "weight": 0.20},
      {"zone": "zipper_quality", "label": "Qualité fermeture éclair (curseur, logo)",   "weight": 0.10},
      {"zone": "strap_clip",     "label": "Clip bandoulière (finition, marquage)",      "weight": 0.10}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'prada'),
    'Galleria Medium Saffiano', 'galleria-medium-saffiano',
    '[
      {"zone": "saffiano_crosshatch","label": "Croisillons saffiano (régularité, profondeur)","weight": 0.30},
      {"zone": "triangle_logo",      "label": "Logo triangle (alignement, relief)",           "weight": 0.25},
      {"zone": "serial_plate",       "label": "Plaque de série intérieure",                   "weight": 0.20},
      {"zone": "zipper",             "label": "Fermeture éclair (curseur, marquage Prada)",   "weight": 0.15},
      {"zone": "leather_lining",     "label": "Doublure cuir intérieure (texture, couleur)",  "weight": 0.10}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- 3.8 Goyard (1 modèle) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'goyard'),
    'Saint Louis PM', 'saint-louis-pm',
    '[
      {"zone": "goyardine_canvas_dot_pattern","label": "Points goyardine peint main (irrégularité naturelle)","weight": 0.35},
      {"zone": "leather_trim",               "label": "Garniture cuir (coutures, patine naturelle)",          "weight": 0.20},
      {"zone": "chevron_alignment",          "label": "Alignement motif chevron",                             "weight": 0.20},
      {"zone": "pouch_snap",                 "label": "Snap pochette intérieure",                             "weight": 0.15},
      {"zone": "stitching",                  "label": "Coutures bord (régularité, couleur)",                  "weight": 0.10}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- 3.9 Saint Laurent (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'saint-laurent'),
    'Loulou Small', 'loulou-small',
    '[
      {"zone": "ysl_hardware",     "label": "Logo YSL quincaillerie (gravure, finition)","weight": 0.30},
      {"zone": "chevron_quilting", "label": "Matelassé chevron (régularité, profondeur)","weight": 0.25},
      {"zone": "chain_strap",      "label": "Chaîne bandoulière (maillons, finition)",   "weight": 0.15},
      {"zone": "serial_tag",       "label": "Étiquette série intérieure",                "weight": 0.15},
      {"zone": "leather_quality",  "label": "Qualité cuir (grain, souplesse)",           "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'saint-laurent'),
    'Sac de Jour Nano', 'sac-de-jour-nano',
    '[
      {"zone": "accordion_sides", "label": "Côtés accordéon (symétrie, finition)",       "weight": 0.20},
      {"zone": "ysl_stamp",       "label": "Estampille YSL intérieure (police, relief)",  "weight": 0.30},
      {"zone": "serial_tag",      "label": "Étiquette série intérieure",                 "weight": 0.20},
      {"zone": "zipper",          "label": "Fermeture éclair (curseur, marquage)",       "weight": 0.15},
      {"zone": "leather_grain",   "label": "Grain cuir (texture, uniformité)",            "weight": 0.15}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- 3.10 Rolex (4 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'rolex'),
    'Submariner 126610LN', 'submariner-126610ln',
    '[
      {"zone": "dial_markers_alignment","label": "Alignement index cadran (SuperLuminova)",     "weight": 0.15},
      {"zone": "bezel_click_120",       "label": "Lunette 120 clics (sens horaire uniquement)", "weight": 0.15},
      {"zone": "rehaut_engraving",      "label": "Gravure rehaut ROLEX (police, profondeur)",   "weight": 0.15},
      {"zone": "crystal_cyclops",       "label": "Lentille cyclope grossissement 2,5x",         "weight": 0.15},
      {"zone": "bracelet_clasp",        "label": "Boucle Oysterlock (gravure, mécanisme)",      "weight": 0.15},
      {"zone": "caseback",              "label": "Fond vissé lisse (absence fenêtre)",           "weight": 0.10},
      {"zone": "lume_plot",             "label": "Plots SuperLuminova (uniformité, couleur)",   "weight": 0.10},
      {"zone": "crown_guards",          "label": "Protège-couronne (symétrie, intégration)",   "weight": 0.05}
    ]'::jsonb,
    7, 8
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'rolex'),
    'Daytona 116500LN Panda', 'daytona-116500ln-panda',
    '[
      {"zone": "ceramic_bezel",    "label": "Lunette céramique tachymètre (police, finition)","weight": 0.20},
      {"zone": "dial_sub_counters","label": "Sous-cadrans (couleur, police, alignement)",      "weight": 0.25},
      {"zone": "pushers",          "label": "Poussoirs chronographe (forme, gravure)",         "weight": 0.15},
      {"zone": "bracelet",         "label": "Bracelet Oystersteel (finition, maillons)",       "weight": 0.15},
      {"zone": "crown",            "label": "Couronne trilock (gravure crown Rolex)",          "weight": 0.10},
      {"zone": "caseback_serial",  "label": "Numéro de série fond de boîte",                  "weight": 0.15}
    ]'::jsonb,
    7, 8
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'rolex'),
    'GMT-Master II Pepsi 126710BLRO', 'gmt-master-ii-pepsi',
    '[
      {"zone": "bicolor_bezel_transition","label": "Transition bicolore lunette Pepsi (netteté)","weight": 0.25},
      {"zone": "jubilee_bracelet",        "label": "Bracelet Jubilé 5 maillons (finition)",      "weight": 0.20},
      {"zone": "crown",                   "label": "Couronne (gravure, taille)",                 "weight": 0.15},
      {"zone": "24h_hand",                "label": "Aiguille 24h (couleur, alignement)",         "weight": 0.25},
      {"zone": "caseback",                "label": "Fond de boîtier (lisse, numéro série)",      "weight": 0.15}
    ]'::jsonb,
    7, 8
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'rolex'),
    'Datejust 41 126334', 'datejust-41-126334',
    '[
      {"zone": "fluted_bezel",     "label": "Lunette cannelée (côtés, finition or)",     "weight": 0.25},
      {"zone": "jubilee_bracelet", "label": "Bracelet Jubilé (finition, maillons polis)","weight": 0.20},
      {"zone": "date_cyclops",     "label": "Cyclope date (grossissement 2,5x)",         "weight": 0.20},
      {"zone": "dial_markers",     "label": "Index cadran (alignement, lume)",            "weight": 0.20},
      {"zone": "rehaut_engraving", "label": "Gravure rehaut ROLEX (police, profondeur)", "weight": 0.15}
    ]'::jsonb,
    7, 8
  )
ON CONFLICT DO NOTHING;


-- ---- 3.11 Omega (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'omega'),
    'Speedmaster Moonwatch', 'speedmaster-moonwatch',
    '[
      {"zone": "hesalite_crystal",     "label": "Verre hésalite (reflets, transparence)","weight": 0.20},
      {"zone": "subdial_spacing",      "label": "Espacement sous-cadrans (symétrie)",    "weight": 0.20},
      {"zone": "caseback_hippocampus", "label": "Fond hippocampe gravé (détail, profondeur)","weight": 0.20},
      {"zone": "bracelet",             "label": "Bracelet (maillons, finition, gravure)", "weight": 0.15},
      {"zone": "crown",                "label": "Couronne (forme, gravure Omega)",        "weight": 0.10},
      {"zone": "tachymeter_bezel",     "label": "Lunette tachymètre (police, finition)",  "weight": 0.15}
    ]'::jsonb,
    7, 8
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'omega'),
    'Seamaster 300M Blue', 'seamaster-300m-blue',
    '[
      {"zone": "wave_dial_pattern",  "label": "Motif vague cadran (régularité, relief)", "weight": 0.25},
      {"zone": "helium_valve",       "label": "Valve hélium (forme, gravure He)",         "weight": 0.20},
      {"zone": "bezel_ceramic",      "label": "Lunette céramique (police, finition)",     "weight": 0.20},
      {"zone": "bracelet_clasp",     "label": "Boucle déployante (gravure, mécanisme)",   "weight": 0.20},
      {"zone": "caseback_engraving", "label": "Gravures fond de boîtier (hippocampe)",   "weight": 0.15}
    ]'::jsonb,
    7, 8
  )
ON CONFLICT DO NOTHING;


-- ---- 3.12 Audemars Piguet (1 modèle) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'audemars-piguet'),
    'Royal Oak 15500ST Blue', 'royal-oak-15500st-blue',
    '[
      {"zone": "tapisserie_dial_pattern","label": "Motif tapisserie cadran (profondeur, régularité)","weight": 0.30},
      {"zone": "octagonal_bezel_screws","label": "8 vis lunette octogonale (alignement, torx)",      "weight": 0.25},
      {"zone": "bracelet_links",        "label": "Maillons bracelet intégrés (finition, polis)",     "weight": 0.20},
      {"zone": "caseback",              "label": "Fond saphir et rotor AP (gravure, finition)",      "weight": 0.15},
      {"zone": "ap_rotor",              "label": "Rotor AP (finition, inscriptions)",                "weight": 0.10}
    ]'::jsonb,
    7, 8
  )
ON CONFLICT DO NOTHING;


-- ---- 3.13 Patek Philippe (1 modèle) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'patek-philippe'),
    'Nautilus 5711 Blue', 'nautilus-5711-blue',
    '[
      {"zone": "dial_horizontal_embossing","label": "Rayures horizontales cadran (profondeur, régularité)","weight": 0.30},
      {"zone": "bezel_ears",              "label": "Oreilles lunette (symétrie, finition)",              "weight": 0.25},
      {"zone": "bracelet_fold",           "label": "Boucle intégrée bracelet (mécanisme, gravure PP)",   "weight": 0.20},
      {"zone": "caseback_calatrava_cross","label": "Croix Calatrava fond de boîte",                     "weight": 0.15},
      {"zone": "crown",                   "label": "Couronne (forme, gravure Calatrava)",                "weight": 0.10}
    ]'::jsonb,
    7, 8
  )
ON CONFLICT DO NOTHING;


-- ---- 3.14 Cartier (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'cartier'),
    'Santos Medium WSSA0018', 'santos-medium-wssa0018',
    '[
      {"zone": "exposed_screws",          "label": "Vis exposées lunette (alignement, forme)","weight": 0.30},
      {"zone": "dial_font",               "label": "Typographie cadran (police Cartier)",     "weight": 0.20},
      {"zone": "bracelet_quickswitch",    "label": "Système QuickSwitch bracelet",            "weight": 0.20},
      {"zone": "caseback",                "label": "Fond de boîtier (gravure, finition)",     "weight": 0.15},
      {"zone": "crown_cabochon_sapphire", "label": "Couronne cabochon saphir bleu",           "weight": 0.15}
    ]'::jsonb,
    7, 8
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'cartier'),
    'Tank Française', 'tank-francaise',
    '[
      {"zone": "case_proportions","label": "Proportions boîtier (rapport largeur/hauteur)","weight": 0.25},
      {"zone": "dial_font",       "label": "Typographie cadran (police Cartier, index)",   "weight": 0.25},
      {"zone": "crown_cabochon",  "label": "Couronne cabochon saphir",                     "weight": 0.20},
      {"zone": "bracelet_link",   "label": "Maillons bracelet intégrés (finition)",        "weight": 0.20},
      {"zone": "caseback",        "label": "Fond de boîtier (gravure Cartier, numéro)",    "weight": 0.10}
    ]'::jsonb,
    7, 8
  )
ON CONFLICT DO NOTHING;


-- ---- 3.15 Supreme (1 modèle) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'supreme'),
    'Box Logo Hoodie', 'box-logo-hoodie',
    '[
      {"zone": "box_logo_stitching", "label": "Broderie Box Logo (sens trame croisée, densité)","weight": 0.35},
      {"zone": "tag_font_watermark", "label": "Étiquette col (police, filigrane anti-contrefaçon)","weight": 0.25},
      {"zone": "drawstring_tips",    "label": "Embouts cordons (forme, matière)",               "weight": 0.15},
      {"zone": "pocket_stitching",   "label": "Coutures poche kangourou (régularité)",          "weight": 0.15},
      {"zone": "fleece_weight",      "label": "Grammage et qualité du molleton",                "weight": 0.10}
    ]'::jsonb,
    6, 8
  )
ON CONFLICT DO NOTHING;


-- ---- 3.16 Moncler (1 modèle) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'moncler'),
    'Maya Jacket', 'maya-jacket',
    '[
      {"zone": "cartoon_badge_stitching","label": "Broderie badge cartoon (détail, symétrie)", "weight": 0.30},
      {"zone": "certilogo_code",         "label": "Code Certilogo (vérification QR)",          "weight": 0.25},
      {"zone": "comic_strip_lining",     "label": "Doublure bande dessinée (couleurs, netteté)","weight": 0.20},
      {"zone": "zipper_pulls_ykk",       "label": "Curseurs zip YKK (marquage, finition)",     "weight": 0.15},
      {"zone": "down_fill_quality",      "label": "Qualité garnissage duvet (gonflant)",        "weight": 0.10}
    ]'::jsonb,
    6, 8
  )
ON CONFLICT DO NOTHING;


-- ---- 3.17 Canada Goose (1 modèle) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'canada-goose'),
    'Expedition Parka', 'expedition-parka',
    '[
      {"zone": "arctic_disc_patch_embroidery","label": "Broderie patch disque arctique (détail, couleurs)","weight": 0.30},
      {"zone": "hologram_label",              "label": "Étiquette hologramme intérieure",                  "weight": 0.25},
      {"zone": "fur_ruff_quality",            "label": "Qualité fourrure capuche (densité, fixation)",     "weight": 0.20},
      {"zone": "zipper_ykk",                  "label": "Fermetures YKK (marquage, fluidité)",              "weight": 0.15},
      {"zone": "snap_buttons",                "label": "Boutons pression (logo, finition)",                "weight": 0.10}
    ]'::jsonb,
    6, 8
  )
ON CONFLICT DO NOTHING;


-- ---- 3.18 Stone Island (1 modèle) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'stone-island'),
    'Crinkle Reps Down Jacket', 'crinkle-reps-down-jacket',
    '[
      {"zone": "compass_badge_stitching","label": "Broderie badge boussole (détail, coutures)","weight": 0.30},
      {"zone": "certilogo_code",         "label": "Code Certilogo (vérification QR)",          "weight": 0.25},
      {"zone": "ghost_badge_variant",    "label": "Variante Ghost badge (placement, coutures)", "weight": 0.20},
      {"zone": "buttons_zips",           "label": "Boutons et zips (marquage Stone Island)",    "weight": 0.15},
      {"zone": "art_number_tag",         "label": "Étiquette numéro article (police, finition)","weight": 0.10}
    ]'::jsonb,
    6, 8
  )
ON CONFLICT DO NOTHING;


-- ---- 3.19 The North Face (1 modèle) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'the-north-face'),
    '1996 Retro Nuptse', '1996-retro-nuptse',
    '[
      {"zone": "logo_embroidery", "label": "Broderie logo Half Dome (détail, couleurs)",  "weight": 0.30},
      {"zone": "hologram_tag",    "label": "Tag hologramme (authenticité, QR code)",      "weight": 0.25},
      {"zone": "fill_down_700",   "label": "Garnissage duvet 700 (gonflant, chicanes)",   "weight": 0.20},
      {"zone": "baffles",         "label": "Chicanes piqûres (régularité, symétrie)",     "weight": 0.15},
      {"zone": "zipper_ykk",      "label": "Fermetures YKK (marquage, fluidité)",         "weight": 0.10}
    ]'::jsonb,
    6, 8
  )
ON CONFLICT DO NOTHING;


-- ============================================================
-- FIN MIGRATION 003
-- Résumé :
--   Nouvelles marques  : 29 (2 sneakers, 11 bags, 8 watches, 8 clothing)
--   Nouveaux modèles   : 62
--     Marques existantes : 25 (Nike×4, Jordan×10, adidas×5, NB×3, LV×3)
--     Nouvelles marques  : 37 (Travis Scott×3, Off-White×2, Gucci×3,
--                               Chanel×3, Dior×3, Hermès×3, Prada×2,
--                               Goyard×1, Saint Laurent×2, Rolex×4,
--                               Omega×2, AP×1, Patek×1, Cartier×2,
--                               Supreme×1, Moncler×1, Canada Goose×1,
--                               Stone Island×1, The North Face×1)
-- ============================================================
