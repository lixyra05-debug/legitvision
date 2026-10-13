-- ============================================================================
-- LegitVision — noms des photos à l'envoi : REQUÊTE D'ÉTAT (lecture seule)
-- Préparée d'après le relevé de production du 2026-10-13 (lecture seule).
-- Fichier généré : ne pas le retoucher (outils/2026-10-13-noms-photos/generer.mjs).
--
-- EN BREF
--   Ce fichier ne contient qu'UNE requête, qui ne fait que lire. La coller
--   seule dans l'éditeur SQL de Supabase (projet de production) et cliquer
--   « Run ». Elle se lance trois fois : avant l'aller, après l'aller, et
--   après un éventuel retour arrière.
--   La première ligne du tableau (n = 0) donne le verdict :
--   - « PRÊT : 284 noms de photos à corriger dans 71 lignes de marque » :
--     les photos demandées sont celles du relevé. On peut lancer la
--     correction (l'aller).
--   - « APPLIQUÉ : les 34 corrections sont en place » : l'aller est passé.
--   - « ÉCARTS » : les photos demandées ne sont dans aucun de ces deux
--     états. Ne rien lancer, transmettre cette première ligne.
--   Juste après le verdict, deux empreintes : « empreinte_noms » (toutes les
--   photos demandées de toutes les lignes de marque : leurs noms, leur
--   ordre, leurs autres clés), celle qui fait le verdict, et
--   « empreinte_autres_colonnes » (le reste de public.brands, que ni l'aller
--   ni le retour ne changent ; elle n'entre pas dans le verdict).
--     empreinte_noms avant l'aller  : 5dd4011eb6d10aafc4dc4f645d2df213
--     empreinte_noms après l'aller  : a7935327f8a1c045d2ef70267e238aca
--     empreinte_autres_colonnes     : 7df0492cd93fb8e3c5c97d88401abf5c
--       (au relevé du 2026-10-13, la même avant et après)
--   Les lignes 1 à 34 : une par correction. « a_corriger » : les photos
--   qui portent encore l'ancien nom (autant qu'« au_releve » avant l'aller,
--   0 après) ; « portent_le_nouveau » : celles qui portent déjà le nouveau
--   (d'autres lignes de marque l'avaient avant toute correction).
--
-- SI ÇA NE SE PASSE PAS COMME PRÉVU
--   Cette requête ne peut rien abîmer : elle ne fait que lire.
--   - Erreur « relation "public.brands" does not exist » : ce n'est pas le
--     projet de LegitVision. Ouvrir le bon projet.
--   - Toute autre erreur, ou « ÉCARTS » : ne rien lancer d'autre et
--     transmettre le message ou la première ligne.
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
  select b.id, t.e->>'name' as nom, t.e->>'label' as libelle
  from public.brands b
  cross join lateral jsonb_array_elements(b.photo_protocol) as t(e)
),
par_correction as (
  select c.n, c.nom, c.ancien, c.nouveau, c.emplacements as au_releve,
         (select count(*) from emplacements e where e.nom = c.nom and e.libelle = c.ancien)::integer as a_corriger,
         (select count(*) from emplacements e where e.nom = c.nom and e.libelle = c.nouveau)::integer as portent_le_nouveau
  from corrections c
),
totaux as (
  select
    (select count(*) from public.brands)::integer as lignes,
    (select count(*) from emplacements)::integer as emplacements,
    (select coalesce(sum(p.a_corriger), 0) from par_correction p)::integer as a_corriger,
    (select count(distinct e.id) from emplacements e join corrections c on c.nom = e.nom and c.ancien = e.libelle)::integer as lignes_a_corriger,
    (select md5(coalesce(string_agg(b.id::text || '=' || b.photo_protocol::text, E'\n' order by b.id), '')) from public.brands b) as empreinte_noms,
    (select md5(coalesce(string_agg(((to_jsonb(b) - 'photo_protocol' - 'created_at') || jsonb_build_object('created_at', to_char(b.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US')))::text, E'\n' order by b.id), '')) from public.brands b) as empreinte_autres_colonnes
)
select 0 as n,
       case
         when t.empreinte_noms = '5dd4011eb6d10aafc4dc4f645d2df213'
           then 'PRÊT : ' || t.a_corriger || ' noms de photos à corriger dans ' || t.lignes_a_corriger || ' lignes de marque (table : ' || t.lignes || ' lignes, ' || t.emplacements || ' photos demandées). On peut lancer la correction.'
         when t.empreinte_noms = 'a7935327f8a1c045d2ef70267e238aca'
           then 'APPLIQUÉ : les 34 corrections sont en place (284 noms corrigés dans 71 lignes de marque), ' || t.a_corriger || ' nom à corriger.'
         else 'ÉCARTS : les photos demandées ne sont ni celles du relevé du 2026-10-13 ni celles de l''état corrigé (' || t.a_corriger || ' nom(s) à corriger, 284 attendus avant la correction et 0 après, table : ' || t.lignes || ' lignes, ' || t.emplacements || ' photos demandées). Ne rien lancer : transmettre cette ligne.'
       end as resultat,
       t.empreinte_noms,
       t.empreinte_autres_colonnes,
       t.a_corriger,
       null::integer as au_releve,
       null::integer as portent_le_nouveau
from totaux t
union all
select p.n,
       p.nom || ' : « ' || p.ancien || ' » → « ' || p.nouveau || ' »',
       null,
       null,
       p.a_corriger,
       p.au_releve,
       p.portent_le_nouveau
from par_correction p
order by n;
-- FIN — noms des photos : requête d'état (lecture seule)
