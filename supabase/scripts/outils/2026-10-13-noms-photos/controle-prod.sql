-- ============================================================================
-- LegitVision — noms des photos : CONTRÔLE DE PRODUCTION (lecture seule)
-- Fichier généré (outils/2026-10-13-noms-photos/generer.mjs). Une seule requête, qui ne fait
-- que lire : elle rejoue l'aller « à blanc », sans rien écrire, et compare aux
-- empreintes prévues par le générateur. Elle recalcule aussi, depuis la base,
-- la liste que le retour arrière porte (ligne de marque, position, ancien nom)
-- et compare son empreinte à celle de la liste écrite dans le script.
-- Attendu avant l'aller : les quatre colonnes « …_conforme » à true,
-- corrections_au_mauvais_compte et doublons_apres à 0.
-- ============================================================================

with
corrections as (
  select c.n, c.nom, c.ancien, c.nouveau, c.emplacements
  from jsonb_to_recordset($corrections$[
  {"n":1,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière","emplacements":15},
  {"n":2,"nom":"overall_side_lateral","ancien":"Vue laterale","nouveau":"Vue latérale","emplacements":11},
  {"n":3,"nom":"outsole","ancien":"Semelle exterieure (dessous)","nouveau":"Semelle extérieure (dessous)","emplacements":11},
  {"n":4,"nom":"sole_bottom","ancien":"Semelle (dessous)","nouveau":"Semelle extérieure (dessous)","emplacements":6},
  {"n":5,"nom":"sole_bottom","ancien":"Semelle dessous","nouveau":"Semelle extérieure (dessous)","emplacements":8},
  {"n":6,"nom":"tongue_label","ancien":"Étiquette de langue","nouveau":"Étiquette de languette","emplacements":8},
  {"n":7,"nom":"tongue_label","ancien":"Etiquette de languette","nouveau":"Étiquette de languette","emplacements":11},
  {"n":8,"nom":"size_tag","ancien":"Etiquette de taille","nouveau":"Étiquette de taille","emplacements":11},
  {"n":9,"nom":"tag_size","ancien":"Étiquette taille","nouveau":"Étiquette de taille","emplacements":5},
  {"n":10,"nom":"tag_size","ancien":"Étiquette taille / QR code","nouveau":"Étiquette de taille / QR code","emplacements":1},
  {"n":11,"nom":"insole","ancien":"Semelle interieure","nouveau":"Semelle intérieure","emplacements":11},
  {"n":12,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte","emplacements":13},
  {"n":13,"nom":"box_label","ancien":"Etiquette de la boite","nouveau":"Étiquette de la boîte","emplacements":7},
  {"n":14,"nom":"logo_closeup","ancien":"Logo gros plan","nouveau":"Logo (gros plan)","emplacements":8},
  {"n":15,"nom":"stitching_detail","ancien":"Détail coutures","nouveau":"Coutures (gros plan)","emplacements":8},
  {"n":16,"nom":"overall_side","ancien":"Vue de cote","nouveau":"Vue de côté","emplacements":4},
  {"n":17,"nom":"interior","ancien":"Interieur du sac","nouveau":"Intérieur du sac","emplacements":4},
  {"n":18,"nom":"hardware","ancien":"Quincaillerie / fermetures","nouveau":"Pièces métalliques et fermetures","emplacements":5},
  {"n":19,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)","emplacements":15},
  {"n":20,"nom":"serial_tag","ancien":"Numero de serie / code date","nouveau":"Numéro de série / code date","emplacements":4},
  {"n":21,"nom":"zipper_closeup","ancien":"Fermeture eclair (gros plan)","nouveau":"Fermeture éclair (gros plan)","emplacements":4},
  {"n":22,"nom":"front_full","ancien":"Vue de face complete","nouveau":"Vue de face complète","emplacements":10},
  {"n":23,"nom":"back_full","ancien":"Vue arriere complete","nouveau":"Vue arrière complète","emplacements":10},
  {"n":24,"nom":"label_neck","ancien":"Etiquette col / encolure","nouveau":"Étiquette de col","emplacements":10},
  {"n":25,"nom":"label_neck","ancien":"Étiquette col / encolure","nouveau":"Étiquette de col","emplacements":9},
  {"n":26,"nom":"neck_label","ancien":"Étiquette col","nouveau":"Étiquette de col","emplacements":7},
  {"n":27,"nom":"label_wash","ancien":"Etiquette entretien lavage","nouveau":"Étiquette d'entretien","emplacements":10},
  {"n":28,"nom":"label_wash","ancien":"Étiquette entretien lavage","nouveau":"Étiquette d'entretien","emplacements":9},
  {"n":29,"nom":"wash_label","ancien":"Étiquette de lavage","nouveau":"Étiquette d'entretien","emplacements":7},
  {"n":30,"nom":"material_closeup","ancien":"Texture matiere (gros plan)","nouveau":"Texture de la matière (gros plan)","emplacements":10},
  {"n":31,"nom":"material_closeup","ancien":"Texture matière (gros plan)","nouveau":"Texture de la matière (gros plan)","emplacements":9},
  {"n":32,"nom":"print_detail","ancien":"Détail print/broderie","nouveau":"Imprimé et broderie (gros plan)","emplacements":7},
  {"n":33,"nom":"tags_packaging","ancien":"Tags et emballage","nouveau":"Étiquettes volantes et emballage","emplacements":7},
  {"n":34,"nom":"zipper_detail","ancien":"Fermeture zip (gros plan)","nouveau":"Fermeture éclair (gros plan)","emplacements":9}
]$corrections$::jsonb)
    as c(n integer, nom text, ancien text, nouveau text, emplacements integer)
),
emplacements as (
  select b.id, t.ord as pos, t.e, t.e->>'name' as nom, t.e->>'label' as libelle
  from public.brands b
  cross join lateral jsonb_array_elements(b.photo_protocol) with ordinality as t(e, ord)
),
a_corriger as (
  select e.id, e.pos, c.n, c.nom, c.ancien, c.nouveau
  from emplacements e
  join corrections c on c.nom = e.nom and c.ancien = e.libelle
),
apres as (
  select e.id,
         jsonb_agg(case when k.nouveau is null then e.e else jsonb_set(e.e, '{label}', to_jsonb(k.nouveau)) end order by e.pos) as photo_protocol
  from emplacements e
  left join a_corriger k on k.id = e.id and k.pos = e.pos
  group by e.id
),
comptes as (
  select c.n, c.emplacements, (select count(*) from a_corriger k where k.n = c.n)::integer as trouves
  from corrections c
)
select
  to_char(now() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as controle_le,
  (select count(*) from public.brands)::integer as lignes,
  (select count(*) from emplacements)::integer as emplacements,
  (select count(*) from a_corriger)::integer as a_corriger,
  (select count(distinct k.id) from a_corriger k)::integer as lignes_a_corriger,
  (select count(*) from comptes k where k.trouves <> k.emplacements)::integer as corrections_au_mauvais_compte,
  (select count(*) from (select a.id, t.e->>'label' from apres a cross join lateral jsonb_array_elements(a.photo_protocol) as t(e) group by 1, 2 having count(*) > 1) d)::integer as doublons_apres,
  (select count(*) from (select e.id, e.nom from emplacements e group by 1, 2 having count(*) > 1) d)::integer as identifiants_en_double,
  (select md5(coalesce(string_agg(b.id::text || '=' || b.photo_protocol::text, E'\n' order by b.id), '')) from public.brands b) as empreinte_noms,
  (select md5(coalesce(string_agg(a.id::text || '=' || a.photo_protocol::text, E'\n' order by a.id), '')) from apres a) as empreinte_apres_simulee,
  (select md5(coalesce(string_agg(((to_jsonb(b) - 'photo_protocol' - 'created_at') || jsonb_build_object('created_at', to_char(b.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US')))::text, E'\n' order by b.id), '')) from public.brands b) as empreinte_autres_colonnes,
  (select md5(coalesce(string_agg(b.id::text || '=' || b.photo_protocol::text, E'\n' order by b.id), '')) from public.brands b) = '5dd4011eb6d10aafc4dc4f645d2df213' as avant_conforme,
  (select md5(coalesce(string_agg(a.id::text || '=' || a.photo_protocol::text, E'\n' order by a.id), '')) from apres a) = 'a7935327f8a1c045d2ef70267e238aca' as apres_simule_conforme,
  (select md5(coalesce(string_agg(k.id::text || '|' || k.pos || '|' || k.nom || '|' || k.ancien || '|' || k.nouveau, E'\n' order by k.id, k.pos), '')) from a_corriger k) = '07a6f0dd6a91680d8a9a7df5b3074da8' as liste_du_retour_conforme,
  (select count(*) from apres a) = (select count(*) from public.brands) as toutes_les_lignes_simulees_conforme;
