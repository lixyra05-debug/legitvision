-- ============================================================
-- LegitVision — Migration 004 : Modèles manquants
-- 10 marques sans modèles · 24 nouveaux modèles
-- Catégories : bag · watch · clothing
-- Sûr à rejouer : toutes les insertions utilisent ON CONFLICT DO NOTHING
-- ============================================================


-- ============================================================
-- SACS — Marques sans modèles
-- ============================================================

-- ---- Balenciaga (3 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'balenciaga'),
    'Triple S Sneakers', 'triple-s-sneakers',
    '[
      {"zone": "sole_layers",         "label": "Couches semelle (3 superpositions visibles)",   "weight": 0.25},
      {"zone": "balenciaga_logo",     "label": "Logo Balenciaga (police, espacement)",           "weight": 0.25},
      {"zone": "mesh_quality",        "label": "Qualité mesh et superpositions matières",        "weight": 0.20},
      {"zone": "tongue_tag",          "label": "Étiquette languette (police, couleur)",          "weight": 0.15},
      {"zone": "outsole_pattern",     "label": "Motif semelle extérieure (relief, symétrie)",    "weight": 0.15}
    ]'::jsonb,
    8, 10
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'balenciaga'),
    'Speed Runner', 'speed-runner',
    '[
      {"zone": "sock_knit_texture",   "label": "Texture tricot chaussette (maille, élasticité)","weight": 0.30},
      {"zone": "balenciaga_logo",     "label": "Logo Balenciaga brodé (police, alignement)",    "weight": 0.25},
      {"zone": "sole_attachment",     "label": "Attache semelle au knit (finition, colle)",     "weight": 0.20},
      {"zone": "size_label",          "label": "Étiquette taille intérieure",                   "weight": 0.15},
      {"zone": "heel_detail",         "label": "Détail talon (finition, asymétrie intentionnelle)","weight": 0.10}
    ]'::jsonb,
    8, 10
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'balenciaga'),
    'Le Cagole XS', 'le-cagole-xs',
    '[
      {"zone": "stud_pattern",        "label": "Pattern de clous (disposition, alignement)",    "weight": 0.25},
      {"zone": "croc_embossing",      "label": "Embossage croco (profondeur, régularité)",      "weight": 0.20},
      {"zone": "balenciaga_charm",    "label": "Breloque Balenciaga (police, finition métal)",  "weight": 0.20},
      {"zone": "buckle_hardware",     "label": "Boucle et quincaillerie (finition, marquage)",  "weight": 0.20},
      {"zone": "interior_stamp",      "label": "Estampille intérieure (police, placement)",     "weight": 0.15}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- Celine (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'celine'),
    'Classic Box Bag Small', 'classic-box-bag-small',
    '[
      {"zone": "box_clasp",           "label": "Fermoir boîte (mécanisme, gravure Celine)",    "weight": 0.30},
      {"zone": "smooth_leather",      "label": "Cuir box lisse (brillance, souplesse, grain)",  "weight": 0.25},
      {"zone": "interior_stamp",      "label": "Estampille CELINE PARIS (police, placement)",   "weight": 0.20},
      {"zone": "stitching",           "label": "Coutures bord (régularité, tension)",           "weight": 0.15},
      {"zone": "hardware_color",      "label": "Couleur quincaillerie (or ou argent, finition)","weight": 0.10}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'celine'),
    'Triomphe Canvas Tote', 'triomphe-canvas-tote',
    '[
      {"zone": "triomphe_pattern",    "label": "Motif Triomphe canvas (alignement, netteté)",   "weight": 0.30},
      {"zone": "leather_trim",        "label": "Garniture cuir naturel (coutures, patine)",     "weight": 0.20},
      {"zone": "celine_logo_clasp",   "label": "Fermoir logo CELINE (police, finition métal)",  "weight": 0.20},
      {"zone": "interior_stamp",      "label": "Estampille intérieure CELINE PARIS",            "weight": 0.15},
      {"zone": "handle_attachment",   "label": "Fixation anses (coutures, symétrie)",           "weight": 0.15}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- Fendi (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'fendi'),
    'Baguette Medium', 'baguette-medium',
    '[
      {"zone": "ff_logo_clasp",       "label": "Fermoir FF (alignement, relief, mécanisme)",   "weight": 0.30},
      {"zone": "zucca_pattern",       "label": "Motif Zucca (alignement, netteté, densité)",    "weight": 0.25},
      {"zone": "stitching",           "label": "Coutures (régularité, couleur fil)",             "weight": 0.15},
      {"zone": "serial_tag",          "label": "Étiquette série intérieure (police, hologramme)","weight": 0.15},
      {"zone": "strap_attachment",    "label": "Fixation bandoulière (coutures, finition)",     "weight": 0.15}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'fendi'),
    'Peekaboo Medium', 'peekaboo-medium',
    '[
      {"zone": "internal_frame",      "label": "Structure intérieure rigide (finition, symétrie)","weight": 0.25},
      {"zone": "ff_lining",           "label": "Doublure motif FF (netteté, couleur)",           "weight": 0.20},
      {"zone": "clasp_hardware",      "label": "Fermoir (mécanisme, gravure Fendi)",             "weight": 0.25},
      {"zone": "leather_quality",     "label": "Qualité cuir (grain, souplesse, coutures)",      "weight": 0.20},
      {"zone": "serial_tag",          "label": "Étiquette série intérieure",                    "weight": 0.10}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ---- Bottega Veneta (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'bottega-veneta'),
    'Jodie Hobo', 'jodie-hobo',
    '[
      {"zone": "intrecciato_weave",   "label": "Tressage Intrecciato (régularité, densité)",    "weight": 0.35},
      {"zone": "leather_softness",    "label": "Souplesse cuir nappa (qualité, uniformité)",    "weight": 0.25},
      {"zone": "knot_closure",        "label": "Fermeture nœud (finition, symétrie)",           "weight": 0.20},
      {"zone": "interior_stamp",      "label": "Estampille BOTTEGA VENETA (police, placement)", "weight": 0.10},
      {"zone": "hardware",            "label": "Quincaillerie (finition or/argent vieilli)",    "weight": 0.10}
    ]'::jsonb,
    10, 12
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'bottega-veneta'),
    'Cassette Bag', 'cassette-bag',
    '[
      {"zone": "maxi_intrecciato",    "label": "Grand tressage Intrecciato (régularité, tension)","weight": 0.35},
      {"zone": "pillow_shape",        "label": "Forme matelassée (symétrie, rembourrage)",      "weight": 0.20},
      {"zone": "turn_lock",           "label": "Serrure tournante (mécanisme, finition)",       "weight": 0.20},
      {"zone": "interior_stamp",      "label": "Estampille intérieure (police, placement)",     "weight": 0.15},
      {"zone": "strap_quality",       "label": "Qualité bandoulière (tressage, coutures)",      "weight": 0.10}
    ]'::jsonb,
    10, 12
  )
ON CONFLICT DO NOTHING;


-- ============================================================
-- MONTRES — Marques sans modèles
-- ============================================================

-- ---- TAG Heuer (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'tag-heuer'),
    'Carrera Heuer 02', 'carrera-heuer-02',
    '[
      {"zone": "dial_subdials",       "label": "Sous-cadrans (couleur, police, alignement)",    "weight": 0.25},
      {"zone": "pushers_crown",       "label": "Poussoirs et couronne (forme, gravure TAG)",    "weight": 0.20},
      {"zone": "caseback_engraving",  "label": "Gravure fond de boîtier (hippocampe, numéro)", "weight": 0.20},
      {"zone": "bezel_tachymeter",    "label": "Lunette tachymètre (police, finition aluminium)","weight": 0.20},
      {"zone": "bracelet_clasp",      "label": "Boucle déployante (gravure, mécanisme)",       "weight": 0.15}
    ]'::jsonb,
    7, 8
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'tag-heuer'),
    'Monaco Calibre 11', 'monaco-calibre-11',
    '[
      {"zone": "square_case",         "label": "Boîtier carré (proportions, finition brushée)", "weight": 0.25},
      {"zone": "blue_dial_layout",    "label": "Cadran bleu (sous-cadrans, police, couleur)",   "weight": 0.25},
      {"zone": "crown_position",      "label": "Couronne côté gauche (position caractéristique)","weight": 0.20},
      {"zone": "caseback",            "label": "Fond de boîtier (gravures, numéro de série)",   "weight": 0.15},
      {"zone": "bracelet",            "label": "Bracelet cuir ou acier (boucle, marquage)",     "weight": 0.15}
    ]'::jsonb,
    7, 8
  )
ON CONFLICT DO NOTHING;


-- ---- Richard Mille (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'richard-mille'),
    'RM 011', 'rm-011',
    '[
      {"zone": "tonneau_case_finishing","label": "Finition boîtier tonneau (angles, brossé/poli)","weight": 0.25},
      {"zone": "skeletonized_dial",     "label": "Cadran squelette (découpes, finition ponts)",  "weight": 0.25},
      {"zone": "flyback_pusher",        "label": "Poussoir flyback (position, forme, marquage)", "weight": 0.20},
      {"zone": "rm_logo_crown",         "label": "Logo RM et couronne (gravure, position)",      "weight": 0.15},
      {"zone": "caseback_movement",     "label": "Fond saphir / mouvement visible (finition)",   "weight": 0.15}
    ]'::jsonb,
    7, 8
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'richard-mille'),
    'RM 055 Bubba Watson', 'rm-055',
    '[
      {"zone": "carbon_tpt_texture",    "label": "Texture Carbon TPT (strates, irrégularité naturelle)","weight": 0.30},
      {"zone": "skeletonized_movement", "label": "Mouvement squelette (ponts, finition anglage)", "weight": 0.25},
      {"zone": "crown_pusher",          "label": "Couronne et poussoir (position, marquage RM)",  "weight": 0.20},
      {"zone": "caseback_sapphire",     "label": "Fond saphir (clarté, gravures)",               "weight": 0.15},
      {"zone": "strap_attachment",      "label": "Fixation bracelet (vis titane, finition)",     "weight": 0.10}
    ]'::jsonb,
    7, 8
  )
ON CONFLICT DO NOTHING;


-- ---- Hublot (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'hublot'),
    'Big Bang Unico', 'big-bang-unico',
    '[
      {"zone": "bezel_screws_6",      "label": "6 vis H lunette (alignement, finition hexagonale)","weight": 0.25},
      {"zone": "skeletonized_dial",   "label": "Cadran squelette (découpes, couleur)",            "weight": 0.25},
      {"zone": "integrated_lugs",     "label": "Cornes intégrées (finition, symétrie)",           "weight": 0.20},
      {"zone": "caseback",            "label": "Fond saphir / gravures (numéro série, logo)",     "weight": 0.15},
      {"zone": "crown_pushers",       "label": "Couronne et poussoirs (forme, gravure H)",        "weight": 0.15}
    ]'::jsonb,
    7, 8
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'hublot'),
    'Classic Fusion Titanium', 'classic-fusion-titanium',
    '[
      {"zone": "titanium_finishing",  "label": "Finition titane brossé (texture, uniformité)",   "weight": 0.25},
      {"zone": "bezel_screws_6",      "label": "6 vis H lunette (alignement, finition)",         "weight": 0.25},
      {"zone": "dial_markers",        "label": "Index cadran (alignement, luminescence)",         "weight": 0.20},
      {"zone": "caseback_engraving",  "label": "Gravure fond de boîtier (numéro série, logo)",   "weight": 0.15},
      {"zone": "rubber_strap",        "label": "Bracelet caoutchouc (texture, boucle Hublot)",   "weight": 0.15}
    ]'::jsonb,
    7, 8
  )
ON CONFLICT DO NOTHING;


-- ============================================================
-- VÊTEMENTS — Marques sans modèles
-- ============================================================

-- ---- Palm Angels (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'palm-angels'),
    'Track Jacket', 'track-jacket',
    '[
      {"zone": "side_stripe_alignment","label": "Bandes latérales (alignement, épaisseur)",     "weight": 0.25},
      {"zone": "palm_angels_embroidery","label": "Broderie Palm Angels (police, placement)",     "weight": 0.25},
      {"zone": "label_neck",          "label": "Étiquette col (police, contenu, hologramme)",   "weight": 0.25},
      {"zone": "zipper_quality",      "label": "Fermeture éclair (curseur, marquage)",          "weight": 0.15},
      {"zone": "fabric_texture",      "label": "Texture tissu (qualité, brillance)",            "weight": 0.10}
    ]'::jsonb,
    6, 8
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'palm-angels'),
    'Bear Hoodie', 'bear-hoodie',
    '[
      {"zone": "bear_embroidery",     "label": "Broderie ours (détail, couleurs, positionnement)","weight": 0.35},
      {"zone": "label_neck",          "label": "Étiquette col (police, contenu, anti-contrefaçon)","weight": 0.25},
      {"zone": "drawstring_tips",     "label": "Embouts cordons (forme, matière, logo)",        "weight": 0.15},
      {"zone": "fleece_quality",      "label": "Qualité molleton (grammage, texture)",          "weight": 0.15},
      {"zone": "pocket_stitching",    "label": "Coutures poche (régularité, tension)",          "weight": 0.10}
    ]'::jsonb,
    6, 8
  )
ON CONFLICT DO NOTHING;


-- ---- Essentials (Fear of God) (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'essentials'),
    'Essentials Hoodie', 'essentials-hoodie',
    '[
      {"zone": "essentials_logo_puff", "label": "Logo ESSENTIALS puff print (relief, alignement)","weight": 0.30},
      {"zone": "label_neck",           "label": "Étiquette woven col (police, couleur, contenu)", "weight": 0.25},
      {"zone": "rubberized_tag",       "label": "Tag caoutchouté poitrine (positionnement, relief)","weight": 0.20},
      {"zone": "fleece_weight",        "label": "Grammage molleton (qualité, souplesse)",         "weight": 0.15},
      {"zone": "drawstring_tips",      "label": "Embouts cordons (matière, forme)",               "weight": 0.10}
    ]'::jsonb,
    6, 8
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'essentials'),
    'Essentials Crewneck', 'essentials-crewneck',
    '[
      {"zone": "essentials_logo_puff", "label": "Logo ESSENTIALS puff print (relief, alignement)","weight": 0.30},
      {"zone": "label_neck",           "label": "Étiquette woven col (police, couleur, contenu)", "weight": 0.25},
      {"zone": "rubberized_tag",       "label": "Tag caoutchouté (positionnement, police, relief)","weight": 0.20},
      {"zone": "rib_cuffs_collar",     "label": "Bords-côtes poignets et col (régularité, tension)","weight": 0.15},
      {"zone": "fleece_weight",        "label": "Grammage molleton (qualité, souplesse)",         "weight": 0.10}
    ]'::jsonb,
    6, 8
  )
ON CONFLICT DO NOTHING;


-- ---- Arc'teryx (2 modèles) ----

INSERT INTO public.models (brand_id, name, slug, authentication_points, min_photos, max_photos)
VALUES
  (
    (SELECT id FROM public.brands WHERE slug = 'arcteryx'),
    'Beta AR Jacket', 'beta-ar-jacket',
    '[
      {"zone": "bird_logo_embroidery", "label": "Broderie logo oiseau (détail, couleur, placement)","weight": 0.25},
      {"zone": "gore_tex_label",       "label": "Étiquette Gore-Tex Pro (police, hologramme)",    "weight": 0.25},
      {"zone": "seam_taping",          "label": "Soudure coutures (régularité, adhérence)",       "weight": 0.20},
      {"zone": "zipper_quality",       "label": "Fermetures YKK Aquaguard (marquage, fluidité)",  "weight": 0.15},
      {"zone": "serial_tag",           "label": "Étiquette série intérieure (police, QR code)",   "weight": 0.15}
    ]'::jsonb,
    6, 8
  ),
  (
    (SELECT id FROM public.brands WHERE slug = 'arcteryx'),
    'Atom LT Hoody', 'atom-lt-hoody',
    '[
      {"zone": "bird_logo_embroidery", "label": "Broderie logo oiseau (détail, couleur, placement)","weight": 0.25},
      {"zone": "coreloft_fill_quality","label": "Qualité rembourrage Coreloft (gonflant, chicanes)","weight": 0.25},
      {"zone": "polartec_fleece_panels","label": "Panneaux Polartec fleece (texture, coutures)",   "weight": 0.20},
      {"zone": "zipper_quality",       "label": "Fermetures YKK (marquage, fluidité)",            "weight": 0.15},
      {"zone": "serial_tag",           "label": "Étiquette série intérieure (police, QR code)",   "weight": 0.15}
    ]'::jsonb,
    6, 8
  )
ON CONFLICT DO NOTHING;


-- ============================================================
-- FIN MIGRATION 004
-- Résumé :
--   Nouvelles marques  : 0
--   Nouveaux modèles   : 24
--     Balenciaga×3, Celine×2, Fendi×2, Bottega Veneta×2,
--     TAG Heuer×2, Richard Mille×2, Hublot×2,
--     Palm Angels×2, Essentials×2, Arc'teryx×2
-- ============================================================
