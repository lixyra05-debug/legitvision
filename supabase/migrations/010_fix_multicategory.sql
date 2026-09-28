-- ============================================================
-- LegitVision — Migration 010 : marques multi-catégories
-- ============================================================
-- Réécrite le 2026-09-28 (décision d'Hector) pour faire ce que la production a
-- réellement reçu. La version précédente de ce fichier n'y a jamais tourné telle
-- quelle, et elle échouait sur une base neuve (section A sous la contrainte
-- UNIQUE (name) de la 001, section C sous UNIQUE (name, category)) : les
-- migrations du dépôt ne reconstruisaient pas la base. En production :
--   1. la contrainte UNIQUE (name) de brands a été remplacée à la main par
--      UNIQUE (name, category), brands_name_category_key (la 015 la cite comme
--      pré-condition) ;
--   2. seules les 12 lignes de marque sneakers et vêtements ont été créées, le
--      2026-04-14. Aucune ligne « -bags » ; les anciennes lignes « balenciaga »
--      et « dior » (sacs) restent actives ; cette migration n'a déplacé aucun
--      modèle (rattachements faits ensuite : 014, puis
--      supabase/scripts/2026-09-25-rattachement-modeles.sql).
-- Ce fichier fait ces deux choses, et rien d'autre. En production, la 010 est
-- inscrite comme appliquée (private.migrations, par la 019) : elle n'y est
-- jamais rejouée. Sur une base qui a déjà la contrainte et les lignes, elle est
-- sans effet.
-- ============================================================

-- 1. Un nom de marque est unique par catégorie : une ligne par catégorie.
do $$
begin
  if exists (select 1 from pg_constraint
              where conrelid = 'public.brands'::regclass and conname = 'brands_name_key') then
    alter table public.brands drop constraint brands_name_key;
  end if;
  if not exists (select 1 from pg_constraint
                  where conrelid = 'public.brands'::regclass and conname = 'brands_name_category_key') then
    alter table public.brands add constraint brands_name_category_key unique (name, category);
  end if;
end $$;

-- 2. Les 12 lignes sneakers et vêtements, avec les protocoles photo de l'époque
--    (emplacements obligatoires ajustés depuis, par script de données, le 2026-09-25).
do $$
declare
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

  v_lignes integer;
begin
  insert into public.brands (name, slug, category, photo_protocol)
  values
    ('Balenciaga',     'balenciaga-sneakers',     'sneakers', v_proto_sneaker),
    ('Louis Vuitton',  'louis-vuitton-sneakers',  'sneakers', v_proto_sneaker),
    ('Dior',           'dior-sneakers',           'sneakers', v_proto_sneaker),
    ('Gucci',          'gucci-sneakers',          'sneakers', v_proto_sneaker),
    ('Prada',          'prada-sneakers',          'sneakers', v_proto_sneaker),
    ('Chanel',         'chanel-sneakers',         'sneakers', v_proto_sneaker),
    ('Hermès',         'hermes-sneakers',         'sneakers', v_proto_sneaker),
    ('Bottega Veneta', 'bottega-veneta-sneakers', 'sneakers', v_proto_sneaker),
    ('Balenciaga',     'balenciaga-clothing',     'clothing', v_proto_clothing),
    ('Louis Vuitton',  'louis-vuitton-clothing',  'clothing', v_proto_clothing),
    ('Dior',           'dior-clothing',           'clothing', v_proto_clothing),
    ('Gucci',          'gucci-clothing',          'clothing', v_proto_clothing)
  on conflict do nothing;

  select count(*) into v_lignes
    from public.brands
   where slug in ('balenciaga-sneakers', 'louis-vuitton-sneakers', 'dior-sneakers', 'gucci-sneakers',
                  'prada-sneakers', 'chanel-sneakers', 'hermes-sneakers', 'bottega-veneta-sneakers',
                  'balenciaga-clothing', 'louis-vuitton-clothing', 'dior-clothing', 'gucci-clothing');
  if v_lignes <> 12 then
    raise exception '010 : % ligne(s) de marque sur 12 après insertion', v_lignes;
  end if;
end $$;
