-- ============================================================
-- LegitVision — Migration 006 : Ajout massif marques & modèles
-- 21 nouvelles marques · ~342 modèles
-- Catégories : sneakers · bag · clothing
-- Sûr à rejouer : ON CONFLICT DO NOTHING sur toutes les insertions
-- ============================================================

DO $$
DECLARE
  -- ============================================================
  -- Authentication points par catégorie (format zone/label/weight)
  -- ============================================================
  auth_sneakers JSONB;
  auth_clothing JSONB;
  auth_bag      JSONB;

  -- Photo protocols pour nouvelles marques
  proto_sneakers JSONB;
  proto_clothing JSONB;
  proto_bag      JSONB;

BEGIN

  auth_sneakers := '[
    {"zone": "tongue_label",   "label": "Etiquette de langue (taille, code produit, pays)", "weight": 0.15},
    {"zone": "stitching",      "label": "Coutures et finitions",                             "weight": 0.15},
    {"zone": "sole_pattern",   "label": "Semelle (motif, texture, logo)",                    "weight": 0.15},
    {"zone": "logo_placement", "label": "Logo (placement, taille, symetrie)",                "weight": 0.15},
    {"zone": "box_label",      "label": "Boite et emballage (etiquette, code-barres)",       "weight": 0.10},
    {"zone": "materials",      "label": "Materiaux (cuir, mesh, daim)",                      "weight": 0.15},
    {"zone": "product_code",   "label": "Code produit interieur",                            "weight": 0.10},
    {"zone": "eyelets",        "label": "Oeillets et lacets",                                "weight": 0.05}
  ]'::jsonb;

  auth_clothing := '[
    {"zone": "neck_label",       "label": "Etiquette col (marque, taille, composition)",   "weight": 0.20},
    {"zone": "wash_label",       "label": "Etiquette de lavage",                           "weight": 0.10},
    {"zone": "stitching",        "label": "Coutures et finitions",                         "weight": 0.15},
    {"zone": "print_embroidery", "label": "Print/Broderie (qualite, alignement)",          "weight": 0.20},
    {"zone": "fabric",           "label": "Tissu (poids, texture, grain)",                 "weight": 0.15},
    {"zone": "tags",             "label": "Tags et etiquettes volantes",                   "weight": 0.10},
    {"zone": "closures",         "label": "Fermetures (zip YKK, boutons)",                 "weight": 0.05},
    {"zone": "packaging",        "label": "Emballage et packaging",                        "weight": 0.05}
  ]'::jsonb;

  auth_bag := '[
    {"zone": "logo_monogram",  "label": "Logo et monogramme (alignement, symetrie)",             "weight": 0.15},
    {"zone": "stitching",      "label": "Coutures (regularite, couleur du fil, tension)",         "weight": 0.15},
    {"zone": "hardware",       "label": "Hardware/ferrures (gravure, poids, finition)",           "weight": 0.15},
    {"zone": "leather",        "label": "Cuir/materiau (grain, odeur, souplesse)",                "weight": 0.15},
    {"zone": "interior_label", "label": "Etiquette interieure (police, numero de serie)",         "weight": 0.10},
    {"zone": "date_code",      "label": "Code date / puce RFID",                                  "weight": 0.10},
    {"zone": "lining",         "label": "Doublure (couleur, texture, logo)",                      "weight": 0.05},
    {"zone": "zipper",         "label": "Fermeture eclair (YKK/Lampo, fluidite)",                 "weight": 0.05},
    {"zone": "packaging",      "label": "Emballage (dust bag, boite, certificat)",                "weight": 0.05},
    {"zone": "hot_stamp",      "label": "Stamp/marquage a chaud",                                 "weight": 0.05}
  ]'::jsonb;

  proto_sneakers := '[
    {"name": "overall_front",        "label": "Vue de face",                    "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",         "label": "Vue arriere",                    "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side_lateral", "label": "Vue laterale",                   "required": true,  "min_resolution": "800x800"},
    {"name": "outsole",              "label": "Semelle exterieure (dessous)",   "required": true,  "min_resolution": "800x800"},
    {"name": "toe_box_closeup",      "label": "Bout de chaussure (gros plan)", "required": true,  "min_resolution": "800x800"},
    {"name": "tongue_label",         "label": "Etiquette de languette",         "required": true,  "min_resolution": "800x800"},
    {"name": "size_tag",             "label": "Etiquette de taille",            "required": true,  "min_resolution": "800x800"},
    {"name": "insole",               "label": "Semelle interieure",             "required": true,  "min_resolution": "800x800"},
    {"name": "box_label",            "label": "Etiquette de la boite",          "required": false, "min_resolution": "800x800"}
  ]'::jsonb;

  proto_clothing := '[
    {"name": "front_full",       "label": "Vue de face complete",              "required": true,  "min_resolution": "800x800"},
    {"name": "back_full",        "label": "Vue arriere complete",              "required": true,  "min_resolution": "800x800"},
    {"name": "label_neck",       "label": "Etiquette col / encolure",          "required": true,  "min_resolution": "800x800"},
    {"name": "label_wash",       "label": "Etiquette entretien lavage",        "required": true,  "min_resolution": "800x800"},
    {"name": "logo_closeup",     "label": "Logo principal (gros plan)",        "required": true,  "min_resolution": "800x800"},
    {"name": "material_closeup", "label": "Texture matiere (gros plan)",       "required": true,  "min_resolution": "800x800"},
    {"name": "stitching_detail", "label": "Coutures et broderie (gros plan)",  "required": true,  "min_resolution": "800x800"}
  ]'::jsonb;

  proto_bag := '[
    {"name": "overall_front",     "label": "Vue de face",                       "required": true,  "min_resolution": "800x800"},
    {"name": "overall_back",      "label": "Vue arriere",                       "required": true,  "min_resolution": "800x800"},
    {"name": "overall_side",      "label": "Vue de cote",                       "required": true,  "min_resolution": "800x800"},
    {"name": "interior",          "label": "Interieur du sac",                  "required": true,  "min_resolution": "800x800"},
    {"name": "hardware_closeup",  "label": "Quincaillerie (gros plan)",         "required": true,  "min_resolution": "800x800"},
    {"name": "stitching_closeup", "label": "Coutures (gros plan)",              "required": true,  "min_resolution": "800x800"},
    {"name": "serial_tag",        "label": "Numero de serie / code date",       "required": true,  "min_resolution": "800x800"},
    {"name": "logo_closeup",      "label": "Logo (gros plan)",                  "required": true,  "min_resolution": "800x800"},
    {"name": "base",              "label": "Base du sac",                       "required": true,  "min_resolution": "800x800"},
    {"name": "zipper_closeup",    "label": "Fermeture eclair (gros plan)",      "required": false, "min_resolution": "800x800"}
  ]'::jsonb;

  -- ============================================================
  -- SECTION 1 : NOUVELLES MARQUES (21)
  -- ============================================================

  -- Sneakers (7)
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('BAPE',     'bape',     'sneakers', proto_sneakers) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Converse', 'converse', 'sneakers', proto_sneakers) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Vans',     'vans',     'sneakers', proto_sneakers) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Puma',     'puma',     'sneakers', proto_sneakers) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Reebok',   'reebok',   'sneakers', proto_sneakers) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Salomon',  'salomon',  'sneakers', proto_sneakers) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('New Era',  'new-era',  'sneakers', proto_sneakers) ON CONFLICT DO NOTHING;

  -- Clothing (10)
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Palace',                  'palace',                  'clothing', proto_clothing) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('CP Company',              'cp-company',              'clothing', proto_clothing) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Stussy',                  'stussy',                  'clothing', proto_clothing) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Comme des Garcons',       'comme-des-garcons',       'clothing', proto_clothing) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Carhartt WIP',            'carhartt-wip',            'clothing', proto_clothing) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Anti Social Social Club', 'anti-social-social-club', 'clothing', proto_clothing) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Fear of God',             'fear-of-god',             'clothing', proto_clothing) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Trapstar',                'trapstar',                'clothing', proto_clothing) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Represent',               'represent',               'clothing', proto_clothing) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Kith',                    'kith',                    'clothing', proto_clothing) ON CONFLICT DO NOTHING;

  -- Bags (4)
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Valentino', 'valentino', 'bag', proto_bag) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Givenchy',  'givenchy',  'bag', proto_bag) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Jacquemus', 'jacquemus', 'bag', proto_bag) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Miu Miu',   'miu-miu',   'bag', proto_bag) ON CONFLICT DO NOTHING;

  -- ============================================================
  -- SECTION 2 : MODELES SNEAKERS (~81)
  -- ============================================================

  -- ---- Nike (20) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Air Jordan 1',     'air-jordan-1'),
    ('Air Jordan 3',     'air-jordan-3'),
    ('Air Jordan 4',     'air-jordan-4'),
    ('Air Jordan 11',    'air-jordan-11'),
    ('Air Force 1',      'air-force-1'),
    ('Dunk',             'dunk'),
    ('Air Max 1',        'air-max-1'),
    ('Air Max 90',       'air-max-90'),
    ('Air Max 95',       'air-max-95'),
    ('Air Max 97',       'air-max-97'),
    ('Air Max 270',      'air-max-270'),
    ('Air Max 2090',     'air-max-2090'),
    ('Air Max Plus TN',  'air-max-plus-tn'),
    ('Blazer',           'blazer'),
    ('Cortez',           'cortez'),
    ('React Element 87', 'react-element-87'),
    ('Pegasus',          'pegasus'),
    ('Vapormax',         'vapormax'),
    ('Air Huarache',     'air-huarache'),
    ('Tech Fleece Shoe', 'tech-fleece-shoe')
  ) AS m(name, slug) ON b.slug = 'nike'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- adidas (16) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Yeezy Boost 350 V2', 'yeezy-boost-350-v2'),
    ('Yeezy Boost 700',    'yeezy-boost-700'),
    ('Yeezy 500',          'yeezy-500'),
    ('Yeezy Slide',        'yeezy-slide'),
    ('Yeezy Foam Runner',  'yeezy-foam-runner'),
    ('NMD R1',             'nmd-r1'),
    ('Ultra Boost',        'ultra-boost'),
    ('Stan Smith',         'stan-smith'),
    ('Superstar',          'superstar'),
    ('Gazelle',            'gazelle'),
    ('Campus',             'campus'),
    ('Samba',              'samba'),
    ('Forum',              'forum'),
    ('Response CL',        'response-cl'),
    ('Handball Spezial',   'handball-spezial'),
    ('Adidas 4D',          'adidas-4d')
  ) AS m(name, slug) ON b.slug = 'adidas'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- New Balance (9) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('327',   '327'),
    ('480',   '480'),
    ('550',   '550'),
    ('574',   '574'),
    ('990',   '990'),
    ('2002R', '2002r'),
    ('1906R', '1906r'),
    ('860v2', '860v2'),
    ('M1500', 'm1500')
  ) AS m(name, slug) ON b.slug = 'new-balance'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Jordan (7) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Air Jordan 2',     'air-jordan-2'),
    ('Air Jordan 5',     'air-jordan-5'),
    ('Air Jordan 6',     'air-jordan-6'),
    ('Air Jordan 12',    'air-jordan-12'),
    ('Air Jordan 13',    'air-jordan-13'),
    ('Air Jordan 14',    'air-jordan-14'),
    ('Air Jordan 1 Low', 'air-jordan-1-low')
  ) AS m(name, slug) ON b.slug = 'jordan'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- BAPE sneakers (3) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Bapesta',  'bapesta'),
    ('STA',      'sta'),
    ('Road STA', 'road-sta')
  ) AS m(name, slug) ON b.slug = 'bape'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Converse (4) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Chuck Taylor All Star', 'chuck-taylor-all-star'),
    ('One Star',              'one-star'),
    ('Run Star Hike',         'run-star-hike'),
    ('Pro Leather',           'pro-leather')
  ) AS m(name, slug) ON b.slug = 'converse'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Vans (6) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Old Skool', 'old-skool'),
    ('Sk8-Hi',    'sk8-hi'),
    ('Authentic', 'authentic'),
    ('Era',       'era'),
    ('Half Cab',  'half-cab'),
    ('Slip-On',   'slip-on')
  ) AS m(name, slug) ON b.slug = 'vans'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Puma (5) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Suede',    'suede'),
    ('RS-X',     'rs-x'),
    ('Clyde',    'clyde'),
    ('LQD Cell', 'lqd-cell'),
    ('Mostro',   'mostro')
  ) AS m(name, slug) ON b.slug = 'puma'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Reebok (5) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Classic Leather',    'classic-leather'),
    ('Club C 85',          'club-c-85'),
    ('Instapump Fury',     'instapump-fury'),
    ('Question Mid',       'question-mid'),
    ('Pump Omni Zone II',  'pump-omni-zone-ii')
  ) AS m(name, slug) ON b.slug = 'reebok'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Salomon (4) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('XT-6',         'xt-6'),
    ('XT-4',         'xt-4'),
    ('Speedcross 5', 'speedcross-5'),
    ('ACS Pro',      'acs-pro')
  ) AS m(name, slug) ON b.slug = 'salomon'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- New Era (2) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('59FIFTY', '59fifty'),
    ('9FORTY',  '9forty')
  ) AS m(name, slug) ON b.slug = 'new-era'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ============================================================
  -- SECTION 3 : MODELES VETEMENTS (~106)
  -- ============================================================

  -- ---- Supreme (11) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Box Logo Hoodie',      'box-logo-hoodie'),
    ('Box Logo T-Shirt',     'box-logo-t-shirt'),
    ('Box Logo Crewneck',    'box-logo-crewneck'),
    ('Camp Cap',             'camp-cap'),
    ('5-Panel Cap',          '5-panel-cap'),
    ('Flannel Shirt',        'flannel-shirt'),
    ('Denim Trucker Jacket', 'denim-trucker-jacket'),
    ('Cargo Pant',           'cargo-pant'),
    ('Beanie',               'beanie'),
    ('Varsity Jacket',       'varsity-jacket'),
    ('Jacquard Sweater',     'jacquard-sweater')
  ) AS m(name, slug) ON b.slug = 'supreme'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Off-White clothing (8) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Arrows T-Shirt',   'arrows-t-shirt'),
    ('Quote T-Shirt',    'quote-t-shirt'),
    ('Industrial Belt',  'industrial-belt'),
    ('Off-White Hoodie', 'off-white-hoodie'),
    ('Track Jacket',     'track-jacket'),
    ('Off-White Jacket', 'off-white-jacket'),
    ('Cargo Pant',       'cargo-pant'),
    ('Zip-Up',           'zip-up')
  ) AS m(name, slug) ON b.slug = 'off-white'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Palace (5) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Tri-Ferg T-Shirt',   'tri-ferg-t-shirt'),
    ('Tri-Ferg Hoodie',    'tri-ferg-hoodie'),
    ('Tri-Ferg Jogger',    'tri-ferg-jogger'),
    ('Palace Windbreaker', 'palace-windbreaker'),
    ('Palace Jacket',      'palace-jacket')
  ) AS m(name, slug) ON b.slug = 'palace'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Stone Island (6) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Stone Island Patch T-Shirt', 'si-patch-t-shirt'),
    ('Stone Island Patch Hoodie',  'si-patch-hoodie'),
    ('Stone Island Jacket',        'si-jacket'),
    ('Stone Island Knit',          'si-knit'),
    ('Stone Island Cargo Pant',    'si-cargo-pant'),
    ('Compass Badge Patch',        'compass-badge-patch')
  ) AS m(name, slug) ON b.slug = 'stone-island'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- CP Company (6) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Goggle Jacket',         'goggle-jacket'),
    ('Goggle Overshirt',      'goggle-overshirt'),
    ('Lens T-Shirt',          'lens-t-shirt'),
    ('Lens Hoodie',           'lens-hoodie'),
    ('CP Company Cargo Pant', 'cp-cargo-pant'),
    ('CP Crossbody Bag',      'cp-crossbody-bag')
  ) AS m(name, slug) ON b.slug = 'cp-company'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Stussy (6) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Stock Logo T-Shirt', 'stock-logo-t-shirt'),
    ('Stock Logo Hoodie',  'stock-logo-hoodie'),
    ('8 Ball Hoodie',      '8-ball-hoodie'),
    ('Tribe Shorts',       'tribe-shorts'),
    ('World Tour Tee',     'world-tour-tee'),
    ('Stussy Jacket',      'stussy-jacket')
  ) AS m(name, slug) ON b.slug = 'stussy'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- BAPE clothing (6) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Baby Milo T-Shirt', 'baby-milo-t-shirt'),
    ('ABC Camo Hoodie',   'abc-camo-hoodie'),
    ('Shark Hoodie',      'shark-hoodie'),
    ('Shark Full Zip',    'shark-full-zip'),
    ('BAPE Coach Jacket', 'bape-coach-jacket'),
    ('BAPE Pants',        'bape-pants')
  ) AS m(name, slug) ON b.slug = 'bape'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Comme des Garcons (5) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('PLAY T-Shirt Coeur', 'play-t-shirt-coeur'),
    ('PLAY Polo',          'play-polo'),
    ('PLAY Hoodie',        'play-hoodie'),
    ('CDG Shirt',          'cdg-shirt'),
    ('CDG Jacket',         'cdg-jacket')
  ) AS m(name, slug) ON b.slug = 'comme-des-garcons'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- The North Face clothing (6) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Nuptse Down Jacket', 'nuptse-down-jacket'),
    ('Denali Fleece',      'denali-fleece'),
    ('McMurdo Parka',      'mcmurdo-parka'),
    ('Base Camp Duffel',   'base-camp-duffel'),
    ('Himalayan Parka',    'himalayan-parka'),
    ('TNF Tech Fleece',    'tnf-tech-fleece')
  ) AS m(name, slug) ON b.slug = 'the-north-face'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Carhartt WIP (7) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Chase Hoodie',     'chase-hoodie'),
    ('Chase T-Shirt',    'chase-t-shirt'),
    ('Active Jacket',    'active-jacket'),
    ('Chore Coat',       'chore-coat'),
    ('Double Knee Pant', 'double-knee-pant'),
    ('Dearborn Jacket',  'dearborn-jacket'),
    ('Medley Cap',       'medley-cap')
  ) AS m(name, slug) ON b.slug = 'carhartt-wip'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Anti Social Social Club (3) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('ASSC Logo Hoodie',  'assc-logo-hoodie'),
    ('ASSC Logo T-Shirt', 'assc-logo-t-shirt'),
    ('ASSC Jacket',       'assc-jacket')
  ) AS m(name, slug) ON b.slug = 'anti-social-social-club'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Fear of God (5) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Essentials Hoodie',  'essentials-hoodie'),
    ('Essentials T-Shirt', 'essentials-t-shirt'),
    ('Holy Bible Hoodie',  'holy-bible-hoodie'),
    ('FOG Jacket',         'fog-jacket'),
    ('FOG Trouser',        'fog-trouser')
  ) AS m(name, slug) ON b.slug = 'fear-of-god'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Balenciaga clothing (7) — brand exists as 'bag' ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Balenciaga Speed T-Shirt', 'bal-speed-t-shirt'),
    ('Balenciaga Logo Hoodie',   'bal-logo-hoodie'),
    ('Triple S T-Shirt',         'triple-s-t-shirt'),
    ('Balenciaga Track Jacket',  'bal-track-jacket'),
    ('Tape Logo Tee',            'tape-logo-tee'),
    ('WFP Jacket',               'wfp-jacket'),
    ('Balenciaga Puffer Jacket', 'bal-puffer-jacket')
  ) AS m(name, slug) ON b.slug = 'balenciaga'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Louis Vuitton clothing (5) — brand exists as 'bag' ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('LV Monogram T-Shirt', 'lv-monogram-t-shirt'),
    ('LV Hoodie',           'lv-hoodie'),
    ('LV Jacket',           'lv-jacket'),
    ('LV Track Pant',       'lv-track-pant'),
    ('Virgil Abloh FW21',   'virgil-abloh-fw21')
  ) AS m(name, slug) ON b.slug = 'louis-vuitton'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Gucci clothing (5) — brand exists as 'bag' ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Gucci Logo T-Shirt', 'gucci-logo-t-shirt'),
    ('Gucci Hoodie',       'gucci-hoodie'),
    ('Gucci Jacket',       'gucci-jacket'),
    ('Gucci Track Pant',   'gucci-track-pant'),
    ('Gucci Jumper',       'gucci-jumper')
  ) AS m(name, slug) ON b.slug = 'gucci'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Dior clothing (4) — brand exists as 'bag' ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Dior Bee T-Shirt',    'dior-bee-t-shirt'),
    ('Dior Oblique Jacket', 'dior-oblique-jacket'),
    ('Dior Saddle Hoodie',  'dior-saddle-hoodie'),
    ('Dior Track Jacket',   'dior-track-jacket')
  ) AS m(name, slug) ON b.slug = 'dior'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Trapstar (4) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Irongate Hoodie',  'irongate-hoodie'),
    ('Irongate T-Shirt', 'irongate-t-shirt'),
    ('Trapstar Jacket',  'trapstar-jacket'),
    ('Shooters Cap',     'shooters-cap')
  ) AS m(name, slug) ON b.slug = 'trapstar'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Represent (3) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Owners Club T-Shirt', 'owners-club-t-shirt'),
    ('Represent Hoodie',    'represent-hoodie'),
    ('Represent Jacket',    'represent-jacket')
  ) AS m(name, slug) ON b.slug = 'represent'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Kith (4) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Kith Treats Logo Tee', 'kith-treats-logo-tee'),
    ('Williams Hoodie',      'williams-hoodie'),
    ('Kith Jacket',          'kith-jacket'),
    ('Knicks Collab Tee',    'knicks-collab-tee')
  ) AS m(name, slug) ON b.slug = 'kith'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ============================================================
  -- SECTION 4 : MODELES SACS (~155)
  -- ============================================================

  -- ---- Louis Vuitton bags (20) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Neverfull',            'neverfull'),
    ('Speedy',               'speedy'),
    ('Capucines',            'capucines'),
    ('Pochette Accessoires', 'pochette-accessoires'),
    ('Twist',                'twist'),
    ('New Wave',             'new-wave'),
    ('Coussin',              'coussin'),
    ('Lockme',               'lockme'),
    ('Palm Springs',         'palm-springs'),
    ('Side Trunk',           'side-trunk'),
    ('Soft Trunk',           'soft-trunk'),
    ('Avenue Sling',         'avenue-sling'),
    ('Keepall',              'keepall'),
    ('Horizon 55',           'horizon-55'),
    ('Alma',                 'alma'),
    ('Vanity PM',            'vanity-pm'),
    ('Petite Malle',         'petite-malle'),
    ('Mini Luggage',         'mini-luggage'),
    ('Bucket PM',            'bucket-pm'),
    ('Odeon',                'odeon')
  ) AS m(name, slug) ON b.slug = 'louis-vuitton'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Chanel (11) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Chanel 19',         'chanel-19'),
    ('Classic Flap',      'classic-flap'),
    ('Boy Bag',           'boy-bag'),
    ('Gabrielle',         'gabrielle'),
    ('Coco Handle',       'coco-handle'),
    ('GST',               'gst'),
    ('PST',               'pst'),
    ('Wallet on Chain',   'wallet-on-chain'),
    ('Business Affinity', 'business-affinity'),
    ('Vanity Case',       'vanity-case'),
    ('Pearl Crush',       'pearl-crush')
  ) AS m(name, slug) ON b.slug = 'chanel'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Hermes (10) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Birkin',       'birkin'),
    ('Kelly',        'kelly'),
    ('Constance',    'constance'),
    ('Picotin',      'picotin'),
    ('Lindy',        'lindy'),
    ('Evelyne',      'evelyne'),
    ('Bolide',       'bolide'),
    ('Garden Party', 'garden-party'),
    ('Halzan',       'halzan'),
    ('Roulis',       'roulis')
  ) AS m(name, slug) ON b.slug = 'hermes'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Gucci bags (11) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('GG Marmont',      'gg-marmont'),
    ('Ophidia',         'ophidia'),
    ('Dionysus',        'dionysus'),
    ('Jackie 1961',     'jackie-1961'),
    ('Horsebit 1955',   'horsebit-1955'),
    ('Bamboo 1947',     'bamboo-1947'),
    ('Blondie',         'blondie'),
    ('Attache',         'attache'),
    ('Gucci Messenger', 'gucci-messenger'),
    ('Gucci Tote',      'gucci-tote'),
    ('Adidas x Gucci',  'adidas-x-gucci')
  ) AS m(name, slug) ON b.slug = 'gucci'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Prada (11) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Re-Edition 2000', 're-edition-2000'),
    ('Re-Edition 2005', 're-edition-2005'),
    ('Cleo',            'cleo'),
    ('Galleria',        'galleria'),
    ('Cahier',          'cahier'),
    ('Pouch',           'pouch'),
    ('Padded Nappa',    'padded-nappa'),
    ('Prada Bucket',    'prada-bucket'),
    ('Tessuto Bomber',  'tessuto-bomber'),
    ('Symbole',         'symbole'),
    ('Triangle Bag',    'triangle-bag')
  ) AS m(name, slug) ON b.slug = 'prada'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Dior bags (10) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Lady Dior',             'lady-dior'),
    ('Saddle Bag',            'saddle-bag'),
    ('30 Montaigne',          '30-montaigne'),
    ('Book Tote',             'book-tote'),
    ('Caro',                  'caro'),
    ('Toujours',              'toujours'),
    ('Oblique Jacquard Tote', 'oblique-jacquard-tote'),
    ('Diorama',               'diorama'),
    ('Rider Bag',             'rider-bag'),
    ('Diorcamp',              'diorcamp')
  ) AS m(name, slug) ON b.slug = 'dior'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Balenciaga bags (12) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('City Bag',         'city-bag'),
    ('Hourglass',        'hourglass'),
    ('Neo Classic',      'neo-classic'),
    ('Le Cagole',        'le-cagole'),
    ('Hardware Bag',     'hardware-bag'),
    ('BB Monogram Tote', 'bb-monogram-tote'),
    ('Downtown Bag',     'downtown-bag'),
    ('Crush Bag',        'crush-bag'),
    ('Stadium Bag',      'stadium-bag'),
    ('Wheel Duffle',     'wheel-duffle'),
    ('Explorer Bag',     'explorer-bag'),
    ('Speed Duffle',     'speed-duffle')
  ) AS m(name, slug) ON b.slug = 'balenciaga'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Bottega Veneta (9) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Cassette',   'cassette'),
    ('Pouch',      'pouch'),
    ('Jodie',      'jodie'),
    ('Cabat',      'cabat'),
    ('Sardine',    'sardine'),
    ('Andiamo',    'andiamo'),
    ('Loop Bag',   'loop-bag'),
    ('Teen Jodie', 'teen-jodie'),
    ('Arco',       'arco')
  ) AS m(name, slug) ON b.slug = 'bottega-veneta'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Saint Laurent (10) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Loulou',             'loulou'),
    ('Jamie',              'jamie'),
    ('Sac de Jour',        'sac-de-jour'),
    ('Niki',               'niki'),
    ('Sunset',             'sunset'),
    ('Kate',               'kate'),
    ('Sulpice',            'sulpice'),
    ('Hobo',               'hobo'),
    ('Gaby',               'gaby'),
    ('Saint Laurent Tote', 'saint-laurent-tote')
  ) AS m(name, slug) ON b.slug = 'saint-laurent'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Celine (9) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Classic Box',    'classic-box'),
    ('Trapeze',        'trapeze'),
    ('Belt Bag',       'belt-bag'),
    ('Luggage',        'luggage'),
    ('Triomphe',       'triomphe'),
    ('Ava',            'ava'),
    ('Cuir Triomphe',  'cuir-triomphe'),
    ('Vertical Cabas', 'vertical-cabas'),
    ('Bucket 16',      'bucket-16')
  ) AS m(name, slug) ON b.slug = 'celine'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Fendi (9) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Baguette',    'baguette'),
    ('Peekaboo',    'peekaboo'),
    ('First',       'first'),
    ('Mon Tresor',  'mon-tresor'),
    ('Moonlight',   'moonlight'),
    ('Pocket Bag',  'pocket-bag'),
    ('Runaway',     'runaway'),
    ('Origami Bag', 'origami-bag'),
    ('O Lock',      'o-lock')
  ) AS m(name, slug) ON b.slug = 'fendi'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Valentino (5) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Rockstud Bag',    'rockstud-bag'),
    ('Alcove',          'alcove'),
    ('VLogo Signature', 'vlogo-signature'),
    ('VSling',          'vsling'),
    ('Roman Stud Bag',  'roman-stud-bag')
  ) AS m(name, slug) ON b.slug = 'valentino'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Givenchy (5) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Antigona',    'antigona'),
    ('4G Bag',      '4g-bag'),
    ('Voyou',       'voyou'),
    ('ID95',        'id95'),
    ('Cut Out Bag', 'cut-out-bag')
  ) AS m(name, slug) ON b.slug = 'givenchy'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Goyard (7) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Saint Louis Tote', 'saint-louis-tote'),
    ('Artois Tote',      'artois-tote'),
    ('Belvedere',        'belvedere'),
    ('Alpin',            'alpin'),
    ('Saigon',           'saigon'),
    ('Vendome',          'vendome'),
    ('Cap Vert',         'cap-vert')
  ) AS m(name, slug) ON b.slug = 'goyard'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Jacquemus (9) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Le Chiquito',        'le-chiquito'),
    ('Le Bambino',         'le-bambino'),
    ('Le Grand Bambino',   'le-grand-bambino'),
    ('Le Bisou',           'le-bisou'),
    ('Le Porte-Monnaie',   'le-porte-monnaie'),
    ('Le Bambimou',        'le-bambimou'),
    ('La Bomba',           'la-bomba'),
    ('Le Grand Sac',       'le-grand-sac'),
    ('Le Petit Messenger', 'le-petit-messenger')
  ) AS m(name, slug) ON b.slug = 'jacquemus'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Miu Miu (7) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 10, 12
  FROM public.brands b
  JOIN (VALUES
    ('Wander',        'wander'),
    ('Coffer',        'coffer'),
    ('Arcadie',       'arcadie'),
    ('Club Bag',      'club-bag'),
    ('Madras',        'madras'),
    ('5-Pockets Bag', '5-pockets-bag'),
    ('Top Handle',    'top-handle')
  ) AS m(name, slug) ON b.slug = 'miu-miu'
  ON CONFLICT (brand_id, slug) DO NOTHING;

END $$;
