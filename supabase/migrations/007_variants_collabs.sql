-- ============================================================
-- LegitVision — Migration 007 : Variantes, collaborations,
-- points d'authentification spécifiques
-- Ajout de 3 colonnes sur models + 2 sur analyses
-- Sûr à rejouer grâce aux IF NOT EXISTS
-- ============================================================

-- ── 1. Colonnes sur models ────────────────────────────────────────────────────
ALTER TABLE public.models
  ADD COLUMN IF NOT EXISTS variants             JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS collaborations       JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS specific_auth_points JSONB          DEFAULT NULL;

-- ── 2. Colonnes sur analyses ──────────────────────────────────────────────────
ALTER TABLE public.analyses
  ADD COLUMN IF NOT EXISTS variant_selected TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS collab_selected  TEXT DEFAULT NULL;

-- ── 3. Fonction helper ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION _lv_set_model(
  p_brand_slug TEXT,
  p_model_slug TEXT,
  p_variants   JSONB,
  p_collabs    JSONB,
  p_auth       JSONB
) RETURNS void LANGUAGE sql AS $$
  UPDATE public.models
  SET
    variants             = p_variants,
    collaborations       = p_collabs,
    specific_auth_points = p_auth
  WHERE slug     = p_model_slug
    AND brand_id = (
      SELECT id FROM public.brands WHERE slug = p_brand_slug
    );
$$;

-- ============================================================
-- 4. SNEAKERS
-- ============================================================

-- ── Nike — Air Jordan 1 ──────────────────────────────────────────────────────
SELECT _lv_set_model('nike','air-jordan-1',
  '["Low","Mid","High","Retro High OG","Golf","Element","KO"]'::jsonb,
  '[{"name":"Travis Scott","detail":"Mocha / Fragment / Reverse Mocha / Cactus Jack"},{"name":"Off-White","detail":"The Ten / Chicago / Royal / Black Toe / Pine Green"},{"name":"Dior","detail":"Air Dior Low/High"},{"name":"Union LA","detail":"Storm Blue / Stealth / NRG"},{"name":"Nigel Sylvester","detail":"Go"}]'::jsonb,
  '["Swoosh qualité cuir/daim","Strobel board couture","Boîte orange/noire authentique","Numéro SKU intérieur"]'::jsonb
);

-- ── Nike — Air Jordan 3 ──────────────────────────────────────────────────────
SELECT _lv_set_model('nike','air-jordan-3',
  '["Retro","OG","Black Cement","True Blue","Midnight Navy"]'::jsonb,
  '[{"name":"Off-White","detail":"Muslin"},{"name":"Fragment","detail":""}]'::jsonb,
  '["Éléphant print texture","Visible Air unit","Jumpman étiquette langue","Semelle motif crampons"]'::jsonb
);

-- ── Nike — Air Jordan 4 ──────────────────────────────────────────────────────
SELECT _lv_set_model('nike','air-jordan-4',
  '["Retro","Retro SE","OG","Thunder","White Cement","Bred","Military Blue"]'::jsonb,
  '[{"name":"Travis Scott","detail":"Cactus Jack / Military Black"},{"name":"Off-White","detail":"Sail"},{"name":"Union","detail":"Guava Ice / Desert Moss"},{"name":"KAWS","detail":""}]'::jsonb,
  '["Cage latérale shape","Languette hauteur/angle","Semelle Jumpman placement","Tab arrière position"]'::jsonb
);

-- ── Nike — Air Jordan 11 ─────────────────────────────────────────────────────
SELECT _lv_set_model('nike','air-jordan-11',
  '["Low","High","Concord","Bred","Legend Blue","Space Jam"]'::jsonb,
  '[{"name":"Off-White","detail":""}]'::jsonb,
  '["Patent leather brillance","Lace tips qualité","Carbon fiber plate","Semelle translucide"]'::jsonb
);

-- ── Nike — Air Force 1 ──────────────────────────────────────────────────────
SELECT _lv_set_model('nike','air-force-1',
  '["Low","Mid","High","07 LV8","Shadow","Pixel","Jewel","Utility"]'::jsonb,
  '[{"name":"Travis Scott","detail":"Wheat / Triple Black"},{"name":"Off-White","detail":"The Ten / MCA"},{"name":"Supreme","detail":"Box Logo"},{"name":"Louis Vuitton","detail":"Virgil Abloh"},{"name":"Tiffany & Co","detail":""},{"name":"PEACEMINUSONE","detail":"Para-Noise"}]'::jsonb,
  '["Swoosh placement/taille","Coutures au talon","Semelle bulles d''air","Étiquette langue qualité"]'::jsonb
);

-- ── Nike — Dunk ──────────────────────────────────────────────────────────────
SELECT _lv_set_model('nike','dunk',
  '["Low","High","SB Low","SB High","SB Mid","Retro"]'::jsonb,
  '[{"name":"Travis Scott","detail":"SB Low Jackboys"},{"name":"Off-White","detail":"The 50"},{"name":"Supreme","detail":"Mosaic / Barkroot Brown"},{"name":"Concepts","detail":"Lobster"},{"name":"Ben & Jerry''s","detail":"Chunky Dunky"}]'::jsonb,
  '["Swoosh épaisseur/placement","Coutures talon","Toe box forme","Étiquette langue"]'::jsonb
);

-- ── Nike — Air Max 90 ────────────────────────────────────────────────────────
SELECT _lv_set_model('nike','air-max-90',
  '["OG","Essential","Ultra","Terrascape","2090"]'::jsonb,
  '[{"name":"Off-White","detail":"Desert Ore"},{"name":"Supreme","detail":""}]'::jsonb,
  '["Air unit visibilité","Mesh qualité/densité","Swoosh coutures","Semelle waffle"]'::jsonb
);

-- ── Nike — Air Max 95 ────────────────────────────────────────────────────────
SELECT _lv_set_model('nike','air-max-95',
  '["OG","Essential","Premium","Neon"]'::jsonb,
  '[{"name":"Supreme","detail":""}]'::jsonb,
  '["Air windows latéraux","Graduation lines","Nubuck qualité","Semelle gradient"]'::jsonb
);

-- ── Nike — Air Max 97 ────────────────────────────────────────────────────────
SELECT _lv_set_model('nike','air-max-97',
  '["OG","Silver Bullet","Premium","Plus"]'::jsonb,
  '[{"name":"Supreme","detail":""},{"name":"Off-White","detail":"Menta"},{"name":"ACRONYM","detail":""}]'::jsonb,
  '["Air full-length unité","Ripple design","3M réflectif bandes","Semelle gradient"]'::jsonb
);

-- ── Nike — Blazer ────────────────────────────────────────────────────────────
SELECT _lv_set_model('nike','blazer',
  '["Low","Mid","High","77","SE"]'::jsonb,
  '[{"name":"Supreme","detail":""},{"name":"Comme des Garçons","detail":"PLAY"},{"name":"Off-White","detail":"Grim Reaper"}]'::jsonb,
  '["Cuir pleine fleur qualité","Swoosh coutures/placement","Semelle caoutchouc vulcanisé","Étiquette langue taille"]'::jsonb
);

-- ── adidas — Yeezy Boost 350 V2 ─────────────────────────────────────────────
SELECT _lv_set_model('adidas','yeezy-boost-350-v2',
  '["Zebra","Beluga 2.0","Butter","Static","CMPCT","Oreo","Bone","Natural"]'::jsonb,
  '[{"name":"Kanye West / Ye","detail":"Toutes coloris Yeezy"}]'::jsonb,
  '["Boost semelle texture/couleur","Pull tab position","Knit pattern régularité","Boîte + papier de soie"]'::jsonb
);

-- ── adidas — Yeezy Boost 700 ─────────────────────────────────────────────────
SELECT _lv_set_model('adidas','yeezy-boost-700',
  '["Wave Runner","Mauve","Inertia","Static","Magnet"]'::jsonb,
  '[{"name":"Kanye West / Ye","detail":""}]'::jsonb,
  '["Boost fenêtre semelle","Panneaux 3M réflectif","Lacets forme/texture","Semelle intérieure logo"]'::jsonb
);

-- ── adidas — Yeezy 500 ───────────────────────────────────────────────────────
SELECT _lv_set_model('adidas','yeezy-500',
  '["Blush","Desert Rat","Utility Black","Super Moon Yellow"]'::jsonb,
  '[{"name":"Kanye West / Ye","detail":""}]'::jsonb,
  '["Adiprene+ semelle","Mesh/suède panneaux","Boost dans talon","Lettre Y broderie"]'::jsonb
);

-- ── adidas — Stan Smith ──────────────────────────────────────────────────────
SELECT _lv_set_model('adidas','stan-smith',
  '["OG","Lux","Vegan","Mylo","80s","Parley"]'::jsonb,
  '[{"name":"Gucci","detail":""},{"name":"Pharrell Williams","detail":"Human Race"},{"name":"Prada","detail":""}]'::jsonb,
  '["3 perforations régularité","Talon logo couleur","Adidas wordmark police","Semelle caoutchouc"]'::jsonb
);

-- ── adidas — Superstar ───────────────────────────────────────────────────────
SELECT _lv_set_model('adidas','superstar',
  '["OG","Shell Toe","Slip-On","Vegan"]'::jsonb,
  '[{"name":"Run DMC","detail":""},{"name":"Supreme","detail":""},{"name":"Prada","detail":""}]'::jsonb,
  '["Shell toe forme","3 bandes régularité","Talon Trefoil","Semelle caoutchouc coquille"]'::jsonb
);

-- ── adidas — Samba ───────────────────────────────────────────────────────────
SELECT _lv_set_model('adidas','samba',
  '["OG","Classic","Vegan","Wales Bonner","Prada"]'::jsonb,
  '[{"name":"Wales Bonner","detail":""},{"name":"Prada","detail":""},{"name":"NOAH","detail":""}]'::jsonb,
  '["T-toe broderie qualité","Gum sole couleur/dureté","3 bandes placement","Semelle intérieure logo"]'::jsonb
);

-- ── adidas — NMD R1 ──────────────────────────────────────────────────────────
SELECT _lv_set_model('adidas','nmd-r1',
  '["OG","V2","S1","Primeblue","Stlt"]'::jsonb,
  '[{"name":"Pharrell Williams","detail":"Human Race"},{"name":"BAPE","detail":""}]'::jsonb,
  '["Boost pods couleur","EVA plug placement","Knit qualité/densité","Semelle Boost texture"]'::jsonb
);

-- ── New Balance — 550 ────────────────────────────────────────────────────────
SELECT _lv_set_model('new-balance','550',
  '["OG","Dome Runner"]'::jsonb,
  '[{"name":"Aimé Leon Dore","detail":""},{"name":"Joe Freshgoods","detail":""}]'::jsonb,
  '["N latéral broderie qualité","Semelle gomme texture","Étiquette langue","Numéro modèle intérieur"]'::jsonb
);

-- ── New Balance — 990 ────────────────────────────────────────────────────────
SELECT _lv_set_model('new-balance','990',
  '["v1","v2","v3","v4","v5","v6"]'::jsonb,
  '[{"name":"Teddy Santis / Aimé Leon Dore","detail":"v3/v4/v5"},{"name":"JJJJound","detail":"v3/v4"}]'::jsonb,
  '["N latéral réflectif/suède","ENCAP semelle visible","Made in USA étiquette","Mesh qualité/densité"]'::jsonb
);

-- ── New Balance — 2002R ──────────────────────────────────────────────────────
SELECT _lv_set_model('new-balance','2002r',
  '["Protection Pack","Rain Cloud","Sea Salt"]'::jsonb,
  '[{"name":"Aimé Leon Dore","detail":""},{"name":"Miu Miu","detail":""}]'::jsonb,
  '["N suède qualité","ABZORB midsole","Semelle gomme waffle","Mesh respirant"]'::jsonb
);

-- ── BAPE — Bapesta ───────────────────────────────────────────────────────────
SELECT _lv_set_model('bape','bapesta',
  '["Classic","ABC Camo","College","Mirror"]'::jsonb,
  '[{"name":"Nigo","detail":""},{"name":"Pharrell","detail":""}]'::jsonb,
  '["STA star placement","Camo ABC pixels","Semelle dentée","Étiquette langue BAPE"]'::jsonb
);

-- ── Converse — Chuck Taylor All Star ────────────────────────────────────────
SELECT _lv_set_model('converse','chuck-taylor-all-star',
  '["Low","High","Mid","Platform","Lift"]'::jsonb,
  '[{"name":"JW Anderson","detail":""},{"name":"Comme des Garçons","detail":"PLAY"},{"name":"Travis Scott","detail":""}]'::jsonb,
  '["Étoile All Star placement","Semelle vulcanisée motif","Étiquette talon police","Œillets métal régularité"]'::jsonb
);

-- ── Vans — Old Skool ─────────────────────────────────────────────────────────
SELECT _lv_set_model('vans','old-skool',
  '["Classic","Pro","36 DX","Stack","Surge"]'::jsonb,
  '[{"name":"Supreme","detail":""},{"name":"Harry Potter","detail":""},{"name":"Disney","detail":""}]'::jsonb,
  '["Jazz stripe régularité","Waffle sole motif","Logo Vans talon","Coutures latérales"]'::jsonb
);

-- ── Vans — Sk8-Hi ────────────────────────────────────────────────────────────
SELECT _lv_set_model('vans','sk8-hi',
  '["Classic","Pro","MTE","Platform"]'::jsonb,
  '[{"name":"Supreme","detail":""},{"name":"Fear of God","detail":""}]'::jsonb,
  '["Side stripe continuité","Semelle waffle","Col reinforcement","Étiquette langue"]'::jsonb
);

-- ── Salomon — XT-6 ───────────────────────────────────────────────────────────
SELECT _lv_set_model('salomon','xt-6',
  '["Classic","Advanced","Sportstyle","FT"]'::jsonb,
  '[{"name":"Atmos","detail":""},{"name":"MM6 Maison Margiela","detail":""},{"name":"And Wander","detail":""}]'::jsonb,
  '["Contagrip semelle profondeur","QuickLace système","TPU overlays qualité","Étiquette taille code usine"]'::jsonb
);

-- ── Salomon — XT-4 ───────────────────────────────────────────────────────────
SELECT _lv_set_model('salomon','xt-4',
  '["Classic","Advanced","OG"]'::jsonb,
  '[{"name":"Comme des Garçons","detail":""}]'::jsonb,
  '["Semelle Contagrip","Chassis Chassis-Chassis","EnergyCell+ mousse","Étiquette usine"]'::jsonb
);

-- ============================================================
-- 5. VÊTEMENTS
-- ============================================================

-- ── Supreme — Box Logo Hoodie ────────────────────────────────────────────────
SELECT _lv_set_model('supreme','box-logo-hoodie',
  '["Boxy","Regular","Mini","Cropped"]'::jsonb,
  '[{"name":"LV (Louis Vuitton)","detail":"Collection 2017"},{"name":"BAPE","detail":""},{"name":"Nike","detail":""}]'::jsonb,
  '["Broderie Box Logo densité/régularité","Grain du fleece","Étiquette col watermark","Coutures épaules renfort"]'::jsonb
);

-- ── Supreme — Box Logo T-Shirt ───────────────────────────────────────────────
SELECT _lv_set_model('supreme','box-logo-t-shirt',
  '["Classic","Boxy","Cropped"]'::jsonb,
  '[{"name":"Hanes","detail":"Blank tee sous-jacent"},{"name":"BAPE","detail":""}]'::jsonb,
  '["Print Box Logo qualité/cracking","Tag Hanes sous fond","Col ribbed régularité","Composition 100% coton"]'::jsonb
);

-- ── Supreme — Camp Cap ───────────────────────────────────────────────────────
SELECT _lv_set_model('supreme','camp-cap',
  '["6-Panel","Wool","Corduroy","Denim"]'::jsonb,
  '[{"name":"The North Face","detail":""},{"name":"Nike","detail":""}]'::jsonb,
  '["Broderie logo front","Bande ajustement fermeture","Tissu qualité","Étiquette intérieure"]'::jsonb
);

-- ── Supreme — Box Logo Crewneck ──────────────────────────────────────────────
SELECT _lv_set_model('supreme','box-logo-crewneck',
  '["Classic","Small Box","Boxy"]'::jsonb,
  '[{"name":"The North Face","detail":""}]'::jsonb,
  '["Broderie Box Logo alignement","Tissu poids french terry","Côtes bords-côtes","Étiquette col"]'::jsonb
);

-- ── Off-White — Arrows T-Shirt ───────────────────────────────────────────────
SELECT _lv_set_model('off-white','arrows-t-shirt',
  '["Classic","Oversized","Slim"]'::jsonb,
  '[]'::jsonb,
  '["Print Arrows alignement exact","Étiquette zip-tie","Tag MAIN LABEL","Coutures bord-côte"]'::jsonb
);

-- ── Off-White — Off-White Hoodie ─────────────────────────────────────────────
SELECT _lv_set_model('off-white','off-white-hoodie',
  '["Classic","Oversized","Caravaggio"]'::jsonb,
  '[]'::jsonb,
  '["Print quotes Helvetica Neue","Zip-tie tag orange","Étiquette industrielle grille","Coutures extérieures exposées"]'::jsonb
);

-- ── Off-White — Industrial Belt ──────────────────────────────────────────────
SELECT _lv_set_model('off-white','industrial-belt',
  '["Classic","Mini","2cm","3.5cm"]'::jsonb,
  '[]'::jsonb,
  '["Police texte Industrial Belt","Largeur exacte ceinture","Boucle Talon qualité","Coutures zigzag"]'::jsonb
);

-- ── Palace — Tri-Ferg Hoodie ─────────────────────────────────────────────────
SELECT _lv_set_model('palace','tri-ferg-hoodie',
  '["Classic","Oversized","Fleece"]'::jsonb,
  '[{"name":"Adidas","detail":""},{"name":"Reebok","detail":""}]'::jsonb,
  '["Broderie Tri-Ferg symétrie 3 faces","Tissu épaisseur/poids","Étiquette col Palace","Zip métal qualité"]'::jsonb
);

-- ── Stone Island — Patch Hoodie ──────────────────────────────────────────────
SELECT _lv_set_model('stone-island','si-patch-hoodie',
  '["Classic","Shadow Project","Nylon Metal"]'::jsonb,
  '[]'::jsonb,
  '["Badge compass broderie qualité","Boutons snap badge","Étiquette CERTILOGO scan","Tissu grammage/texture"]'::jsonb
);

-- ── Stone Island — Jacket ────────────────────────────────────────────────────
SELECT _lv_set_model('stone-island','si-jacket',
  '["Nylon Metal","Ghost","Ice","Shadow Project","Lamy"]'::jsonb,
  '[{"name":"Supreme","detail":""},{"name":"Nike","detail":""}]'::jsonb,
  '["Badge compass détachable velcro","Coutures soudées régularité","Zip YKK qualité fluidité","CERTILOGO authenticité"]'::jsonb
);

-- ── CP Company — Goggle Jacket ───────────────────────────────────────────────
SELECT _lv_set_model('cp-company','goggle-jacket',
  '["Classic","Metropolis","Flatt"]'::jsonb,
  '[]'::jsonb,
  '["Lunettes goggle fonctionnelles","Lentille qualité","Zip YKK main","CP logo broderie"]'::jsonb
);

-- ── BAPE — Shark Hoodie ──────────────────────────────────────────────────────
SELECT _lv_set_model('bape','shark-hoodie',
  '["Double Head","Oversized","Full Zip"]'::jsonb,
  '[{"name":"Supreme","detail":""},{"name":"Kaws","detail":""}]'::jsonb,
  '["Dents shark print alignement symétrique","WGM broderie qualité","Zip YKK fluidité","Camo pattern pixels réguliers"]'::jsonb
);

-- ── BAPE — ABC Camo Hoodie ───────────────────────────────────────────────────
SELECT _lv_set_model('bape','abc-camo-hoodie',
  '["Classic","Heavy","Wide"]'::jsonb,
  '[{"name":"Comme des Garçons","detail":""},{"name":"Stussy","detail":""}]'::jsonb,
  '["Camo ABC pixels régularité/résolution","Broderie BAPE chest qualité","Zip YKK","Étiquette col"]'::jsonb
);

-- ── Comme des Garçons — PLAY T-Shirt ────────────────────────────────────────
SELECT _lv_set_model('comme-des-garcons','play-t-shirt-coeur',
  '["Classic","Striped","Oversized"]'::jsonb,
  '[{"name":"Converse","detail":""},{"name":"Nike","detail":"Dunk"}]'::jsonb,
  '["Heart patch embroidery","Proportions cœur/placement","CDG Shirt label authentification","Composition tissu"]'::jsonb
);

-- ── Carhartt WIP — Chore Coat ────────────────────────────────────────────────
SELECT _lv_set_model('carhartt-wip','chore-coat',
  '["Classic","Heavy","Relaxed"]'::jsonb,
  '[{"name":"Brain Dead","detail":""},{"name":"A.P.C","detail":""}]'::jsonb,
  '["Patch Carhartt WIP broderie","Boutons métal gravure","Canvas poids/texture","Coutures triple piqûre"]'::jsonb
);

-- ── Fear of God — Essentials Hoodie ─────────────────────────────────────────
SELECT _lv_set_model('fear-of-god','essentials-hoodie',
  '["Classic","Relaxed","Core"]'::jsonb,
  '[{"name":"Nike","detail":""},{"name":"Converse","detail":""}]'::jsonb,
  '["Print Essentials rubber/flocked","Tissu french terry poids","Étiquette woven qualité","Coutures raglan/drop"]'::jsonb
);

-- ── Trapstar — Irongate Hoodie ───────────────────────────────────────────────
SELECT _lv_set_model('trapstar','irongate-hoodie',
  '["Classic","Oversized","Archive"]'::jsonb,
  '[{"name":"Puma","detail":""}]'::jsonb,
  '["Broderie Irongate qualité","IT''S A SECRET watermark","Tissu poids/texture","Zip YKK"]'::jsonb
);

-- ── Kith — Treats Logo Tee ───────────────────────────────────────────────────
SELECT _lv_set_model('kith','kith-treats-logo-tee',
  '["Classic","Vintage","Heavy"]'::jsonb,
  '[{"name":"Coca-Cola","detail":""},{"name":"Pokemon","detail":""},{"name":"adidas","detail":""}]'::jsonb,
  '["Print/Broderie Kith qualité","Tissu 100% coton poids","Étiquette col woven","Finitions ourlets"]'::jsonb
);

-- ============================================================
-- 6. SACS
-- ============================================================

-- ── Louis Vuitton — Neverfull ────────────────────────────────────────────────
SELECT _lv_set_model('louis-vuitton','neverfull',
  '["MM","GM","PM","Damier Ebene","Damier Azur","Monogram","Empreinte","Escale"]'::jsonb,
  '[{"name":"Yayoi Kusama","detail":"Polka Dots"},{"name":"Stephen Sprouse","detail":"Graffiti"}]'::jsonb,
  '["Monogramme alignement symétrique","Code date format LO/SD/VI","Rivets laiton gravure","Coutures moutarde régulières"]'::jsonb
);

-- ── Louis Vuitton — Speedy ───────────────────────────────────────────────────
SELECT _lv_set_model('louis-vuitton','speedy',
  '["Bandoulière 20","25","30","35","Nano","Soft"]'::jsonb,
  '[{"name":"Supreme","detail":"2017"},{"name":"Virgil Abloh","detail":""}]'::jsonb,
  '["Monogramme alignement / jamais coupé","Cadenas + clé LV gravure","Code date","Anse vachette patine naturelle"]'::jsonb
);

-- ── Louis Vuitton — Alma ─────────────────────────────────────────────────────
SELECT _lv_set_model('louis-vuitton','alma',
  '["BB","PM","MM","GM"]'::jsonb,
  '[{"name":"Kusama","detail":"Pumpkin dots"}]'::jsonb,
  '["Monogramme centrage coutures","Ferrures laiton gravure LV","Code date","Fermoir tourne-clé"]'::jsonb
);

-- ── Louis Vuitton — Keepall ──────────────────────────────────────────────────
SELECT _lv_set_model('louis-vuitton','keepall',
  '["45","50","55","60","Bandoulière"]'::jsonb,
  '[{"name":"Supreme","detail":""},{"name":"Nigo","detail":""}]'::jsonb,
  '["Monogramme alignement centré","Zip tirage LV","Code date","Cuir vachette naturel patine"]'::jsonb
);

-- ── Louis Vuitton — Pochette Accessoires ────────────────────────────────────
SELECT _lv_set_model('louis-vuitton','pochette-accessoires',
  '["Classic","NM","Métis"]'::jsonb,
  '[]'::jsonb,
  '["Monogramme centrage/coutures","Code date LO/SD format","Zip fluidité gravure LV","Anneau D laiton poids"]'::jsonb
);

-- ── Chanel — Classic Flap ────────────────────────────────────────────────────
SELECT _lv_set_model('chanel','classic-flap',
  '["Mini","Small","Medium/Large","Jumbo","Maxi","2.55 Reissue"]'::jsonb,
  '[]'::jsonb,
  '["Sticker holographique 11 chiffres","Matelassé diamants alignement","Fermoir CC symétrie/gravure","Chaîne poids/qualité maillons"]'::jsonb
);

-- ── Chanel — Boy Bag ─────────────────────────────────────────────────────────
SELECT _lv_set_model('chanel','boy-bag',
  '["Mini","Small","Medium","Large","XL"]'::jsonb,
  '[]'::jsonb,
  '["Fermoir loquet rectangle","Matelassé régularité","Chaîne maillons alternés","Sticker holographique"]'::jsonb
);

-- ── Chanel — Chanel 19 ───────────────────────────────────────────────────────
SELECT _lv_set_model('chanel','chanel-19',
  '["Micro","Mini","Flap","Large","Maxi"]'::jsonb,
  '[]'::jsonb,
  '["Matelassé double C","Mixed chain qualité","Pochette intérieure","Sticker série"]'::jsonb
);

-- ── Hermès — Birkin ──────────────────────────────────────────────────────────
SELECT _lv_set_model('hermes','birkin',
  '["25","30","35","40","50","Sellier","To Go","Baby"]'::jsonb,
  '[]'::jsonb,
  '["Lettre artisan aveugle (format/emplacement)","Coutures sellier main régularité","Clochette + cadenas gravure","Cuir grain/odeur/souplesse"]'::jsonb
);

-- ── Hermès — Kelly ───────────────────────────────────────────────────────────
SELECT _lv_set_model('hermes','kelly',
  '["Mini","20","25","28","32","35","40","Sellier","Retourné"]'::jsonb,
  '[]'::jsonb,
  '["Lettre artisan aveugle","Clochette gravure H","Coutures sellier tension","Fermoir tourniquets précision"]'::jsonb
);

-- ── Hermès — Constance ───────────────────────────────────────────────────────
SELECT _lv_set_model('hermes','constance',
  '["18","24","Slim"]'::jsonb,
  '[]'::jsonb,
  '["H fermoir gravure précision","Cuir lézard/box qualité","Lettre artisan","Coutures sellier"]'::jsonb
);

-- ── Dior — Lady Dior ─────────────────────────────────────────────────────────
SELECT _lv_set_model('dior','lady-dior',
  '["My ABCDior","Micro","Mini","Small","Medium","Large","XXL"]'::jsonb,
  '[]'::jsonb,
  '["Cannage matelassé régularité carrés","Breloques D.I.O.R lettres alignement","Hardware doré/argenté gravure profondeur","Étiquette intérieure Made in Italy"]'::jsonb
);

-- ── Dior — Saddle Bag ────────────────────────────────────────────────────────
SELECT _lv_set_model('dior','saddle-bag',
  '["Mini","Regular","Compact","Large"]'::jsonb,
  '[{"name":"ERL","detail":""},{"name":"Cactus Jack","detail":""},{"name":"Kim Jones","detail":""}]'::jsonb,
  '["CD oblique canvas alignement","Forme selle asymétrique","Anse D anneau métal","Hardware D logo gravure"]'::jsonb
);

-- ── Gucci — GG Marmont ───────────────────────────────────────────────────────
SELECT _lv_set_model('gucci','gg-marmont',
  '["Mini","Small","Medium","Large","XL","Matelassé","Belt Bag"]'::jsonb,
  '[]'::jsonb,
  '["Double G symétrie/proportion","Matelassé régularité diamants","Cuir grain Marmont","Doublure microfibre rouge"]'::jsonb
);

-- ── Gucci — Dionysus ─────────────────────────────────────────────────────────
SELECT _lv_set_model('gucci','dionysus',
  '["Mini","Small","Medium","Super Mini"]'::jsonb,
  '[{"name":"Disney","detail":""},{"name":"Adidas","detail":""}]'::jsonb,
  '["Fermoir tigre tête détail","Boucle chaîne GG","Cuir suède texture","Doublure intérieure"]'::jsonb
);

-- ── Prada — Re-Edition 2000 ──────────────────────────────────────────────────
SELECT _lv_set_model('prada','re-edition-2000',
  '["Mini","Regular","Nylon","Satin","Leather"]'::jsonb,
  '[{"name":"Adidas","detail":""}]'::jsonb,
  '["Triangle Prada vissé précision","Logo placement/police Helvetica","Nylon Re-Nylon poids","Zip Lampo fluidité"]'::jsonb
);

-- ── Prada — Galleria ─────────────────────────────────────────────────────────
SELECT _lv_set_model('prada','galleria',
  '["Micro","Mini","Small","Medium","Large"]'::jsonb,
  '[]'::jsonb,
  '["Saffiano croix texture régularité","Triangle Prada vissé","Poignées cuir qualité","Logo intérieur"]'::jsonb
);

-- ── Balenciaga — City Bag ────────────────────────────────────────────────────
SELECT _lv_set_model('balenciaga','city-bag',
  '["Mini","Small","Medium","Large","Giant","RH","SGH"]'::jsonb,
  '[]'::jsonb,
  '["Agneau cuir grain fripé naturel","Tassels fringe qualité cuir","Hardware poids/gravure","Étiquette miroir intérieur"]'::jsonb
);

-- ── Balenciaga — Hourglass ───────────────────────────────────────────────────
SELECT _lv_set_model('balenciaga','hourglass',
  '["Mini","XS","Small","Medium","Top Handle"]'::jsonb,
  '[]'::jsonb,
  '["Forme hourglass symétrie","Logo Balenciaga police exacte","Hardware B gravure","Cuir veau texture"]'::jsonb
);

-- ── Bottega Veneta — Cassette ────────────────────────────────────────────────
SELECT _lv_set_model('bottega-veneta','cassette',
  '["Mini","Regular","Large","Padded","Stretch"]'::jsonb,
  '[]'::jsonb,
  '["Intrecciato maille 45° régulière","Nappa veau souplesse/grain","Flap closure magnétique","Coutures intérieures cachées"]'::jsonb
);

-- ── Bottega Veneta — Jodie ───────────────────────────────────────────────────
SELECT _lv_set_model('bottega-veneta','jodie',
  '["Mini","Small","Regular","Large"]'::jsonb,
  '[]'::jsonb,
  '["Intrecciato tressage","Knot fermoir cuir","Cuir nappa souplesse","Proportions sac"]'::jsonb
);

-- ── Saint Laurent — Loulou ───────────────────────────────────────────────────
SELECT _lv_set_model('saint-laurent','loulou',
  '["Mini","Small","Medium","Large","XL","Chain"]'::jsonb,
  '[]'::jsonb,
  '["Matelassé chevrons diagonaux","YSL logo fermoir gravure","Chaîne maillons cuir alternés","Cuir veau grain"]'::jsonb
);

-- ── Celine — Triomphe ────────────────────────────────────────────────────────
SELECT _lv_set_model('celine','triomphe',
  '["Chain","Shoulder","Canvas","Cuir"]'::jsonb,
  '[]'::jsonb,
  '["Logo CELINE PARIS sans accent (police)","Triomphe hardware gravure","Cuir box brillance/rigidité","Doublure tan"]'::jsonb
);

-- ── Fendi — Baguette ─────────────────────────────────────────────────────────
SELECT _lv_set_model('fendi','baguette',
  '["Nano","Mini","Regular","Large","1997","Sequins"]'::jsonb,
  '[{"name":"Marc Jacobs","detail":"2019"},{"name":"Versace","detail":"Fendace"},{"name":"Nicki Minaj","detail":""}]'::jsonb,
  '["FF logo broderie/print qualité","Fermoir FF qualité","Soie/Cuir texture authentique","Doublure bordeaux"]'::jsonb
);

-- ── Goyard — Saint Louis ─────────────────────────────────────────────────────
SELECT _lv_set_model('goyard','saint-louis',
  '["PM","GM","Tote","Clutch"]'::jsonb,
  '[]'::jsonb,
  '["Motif Goyardine Y-dots régularité","Chevrons alignement continu","Cuir vachette naturel","Gravure Goyard Paris ferrures"]'::jsonb
);

-- ── Jacquemus — Le Chiquito ──────────────────────────────────────────────────
SELECT _lv_set_model('jacquemus','le-chiquito',
  '["Micro","Nœud","Long","Mini","Moyen"]'::jsonb,
  '[{"name":"Nike","detail":""},{"name":"J&W Anderson","detail":""}]'::jsonb,
  '["Cuir souplesse/finition bords","Logo JACQUEMUS police/placement","Fermeture magnétique alignement","Proportions micro-sac symétrie"]'::jsonb
);

-- ── Valentino — Rockstud ─────────────────────────────────────────────────────
SELECT _lv_set_model('valentino','rockstud-bag',
  '["Mini","Small","Medium","Large"]'::jsonb,
  '[]'::jsonb,
  '["Rockstuds placement/solidité","VALENTINO GARAVANI police","Cuir qualité/grain","Hardware poids/finition"]'::jsonb
);

-- ── Miu Miu — Wander Bag ─────────────────────────────────────────────────────
SELECT _lv_set_model('miu-miu','wander-bag',
  '["Micro","Mini","Small","Large"]'::jsonb,
  '[]'::jsonb,
  '["Logo MIU MIU police/espacement","Cuir matelassé/nappa","Ferrures poids","Coutures régulières"]'::jsonb
);

-- ── Givenchy — Antigona ──────────────────────────────────────────────────────
SELECT _lv_set_model('givenchy','antigona-bag',
  '["Micro","Mini","Small","Medium","Large"]'::jsonb,
  '[]'::jsonb,
  '["Logo G fermoir gravure","Cuir veau grain texture","Bords finis qualité","Étiquette intérieure GIVENCHY PARIS"]'::jsonb
);

-- ============================================================
-- 7. Cleanup
-- ============================================================
DROP FUNCTION IF EXISTS _lv_set_model(TEXT, TEXT, JSONB, JSONB, JSONB);
