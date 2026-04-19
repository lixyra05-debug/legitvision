-- ============================================================
-- LegitVision — Migration 012 : 7 nouvelles marques
-- Asics, ON Running (sneakers) · Chrome Hearts (clothing)
-- Longchamp, Guess, Michael Kors, Vanessa Bruno (bag)
-- Réutilise les photo_protocol et auth_points existants (mig 006)
-- Sûr à rejouer : ON CONFLICT DO NOTHING
-- ============================================================

DO $$
DECLARE
  auth_sneakers JSONB;
  auth_clothing JSONB;
  auth_bag      JSONB;
  proto_sneakers JSONB;
  proto_clothing JSONB;
  proto_bag      JSONB;
BEGIN

  -- Récupère les protocoles déjà seedés en migration 006 (sans les redéfinir)
  SELECT photo_protocol INTO proto_sneakers FROM public.brands WHERE slug = 'nike'           LIMIT 1;
  SELECT photo_protocol INTO proto_clothing FROM public.brands WHERE slug = 'supreme'        LIMIT 1;
  SELECT photo_protocol INTO proto_bag      FROM public.brands WHERE slug = 'louis-vuitton'  LIMIT 1;

  -- Auth points par catégorie — format identique à migration 006
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

  -- ============================================================
  -- BRANDS (7)
  -- ============================================================

  -- Sneakers (2)
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Asics',      'asics',      'sneakers', proto_sneakers) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('ON Running', 'on-running', 'sneakers', proto_sneakers) ON CONFLICT DO NOTHING;

  -- Clothing (1)
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Chrome Hearts', 'chrome-hearts', 'clothing', proto_clothing) ON CONFLICT DO NOTHING;

  -- Bags (4)
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Longchamp',     'longchamp',      'bag', proto_bag) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Guess',         'guess',          'bag', proto_bag) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Michael Kors',  'michael-kors',   'bag', proto_bag) ON CONFLICT DO NOTHING;
  INSERT INTO public.brands (name, slug, category, photo_protocol) VALUES ('Vanessa Bruno', 'vanessa-bruno',  'bag', proto_bag) ON CONFLICT DO NOTHING;

  -- ============================================================
  -- MODELS
  -- ============================================================

  -- ---- Asics (5) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Gel-Lyte III',   'gel-lyte-iii'),
    ('Gel-Kayano 14',  'gel-kayano-14'),
    ('Gel-NYC',        'gel-nyc'),
    ('Gel-1130',       'gel-1130'),
    ('Gel-Nimbus 9',   'gel-nimbus-9')
  ) AS m(name, slug) ON b.slug = 'asics'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- ON Running (5) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_sneakers, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Cloud 5',      'cloud-5'),
    ('Cloudmonster', 'cloudmonster'),
    ('Cloudnova',    'cloudnova'),
    ('Cloudswift',   'cloudswift'),
    ('Roger Pro',    'roger-pro')
  ) AS m(name, slug) ON b.slug = 'on-running'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Chrome Hearts (7) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_clothing, 6, 8
  FROM public.brands b
  JOIN (VALUES
    ('Cemetery Cross T-Shirt', 'cemetery-cross-t-shirt'),
    ('Horseshoe Hoodie',       'horseshoe-hoodie'),
    ('Floral Cross Jacket',    'floral-cross-jacket'),
    ('Dagger Pendant Tee',     'dagger-pendant-tee'),
    ('Matty Boy T-Shirt',      'matty-boy-t-shirt'),
    ('Leather Pants',          'leather-pants'),
    ('Trucker Cap',            'trucker-cap')
  ) AS m(name, slug) ON b.slug = 'chrome-hearts'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Longchamp (6) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Le Pliage',          'le-pliage'),
    ('Le Pliage Original', 'le-pliage-original'),
    ('Roseau',             'roseau'),
    ('Épure',              'epure'),
    ('Le Foulonné',        'le-foulonne'),
    ('Box-Trot',           'box-trot')
  ) AS m(name, slug) ON b.slug = 'longchamp'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Guess (5) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Vikky Tote',       'vikky-tote'),
    ('Cessily Tote',     'cessily-tote'),
    ('Katey Girlfriend', 'katey-girlfriend'),
    ('Noelle Crossbody', 'noelle-crossbody'),
    ('Power Play Tote',  'power-play-tote')
  ) AS m(name, slug) ON b.slug = 'guess'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Michael Kors (6) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Jet Set',  'jet-set'),
    ('Mercer',   'mercer'),
    ('Hamilton', 'hamilton'),
    ('Selma',    'selma'),
    ('Cece',     'cece'),
    ('Parker',   'parker')
  ) AS m(name, slug) ON b.slug = 'michael-kors'
  ON CONFLICT (brand_id, slug) DO NOTHING;

  -- ---- Vanessa Bruno (5) ----
  INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
  SELECT b.id, m.name, m.slug, auth_bag, 8, 10
  FROM public.brands b
  JOIN (VALUES
    ('Cabas Toile', 'cabas-toile'),
    ('Cabas Moyen', 'cabas-moyen'),
    ('Moon Bag',    'moon-bag'),
    ('Holly Bag',   'holly-bag'),
    ('Lune Bag',    'lune-bag')
  ) AS m(name, slug) ON b.slug = 'vanessa-bruno'
  ON CONFLICT (brand_id, slug) DO NOTHING;

END $$;
