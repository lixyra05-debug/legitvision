-- ============================================================================
-- LegitVision — RETOUR ARRIÈRE des libellés des points d'authentification
-- Défait exactement 2026-10-06-libelles-catalogue.sql. Préparé le 2026-10-06.
--
-- EN BREF
--   À ne lancer que pour défaire 2026-10-06-libelles-catalogue.sql.
--   1. Lancer l'ÉTAPE 1 seule. Sa première ligne doit dire « PRÊT POUR LE RETOUR ».
--   2. Lancer l'ÉTAPE 2 seule (le bloc « begin; … commit; »).
--   3. Lancer l'ÉTAPE 3 seule. Sa première ligne doit dire « À L'ÉTAT DE DÉPART ».
--   Jamais pendant la mesure des 60 paires.
--
-- CE QUE FAIT CE SCRIPT
--   Il remet les 36 anciens libellés de public.models.authentication_points,
--   fautes comprises : 2585 points. Après « aller puis retour », chaque ligne de
--   public.models est identique à l'état de départ, à l'octet près. Seule la clé
--   « label » des points listés change ; rien d'autre n'est écrit, aucun objet
--   permanent n'est créé.
--
-- POURQUOI
--   À n'utiliser que si les nouveaux libellés posent un problème. Le libellé
--   part dans la consigne envoyée à l'IA (lib/ai/authentication-prompts.ts).
--
-- ATTENTION — JAMAIS PENDANT LA CAMPAGNE DE MESURE
--   Revenir aux anciens libellés change la consigne de l'IA, comme l'aller.
--   L'outil de mesure (scripts/fiabilite, branche refonte/site) travaille sur
--   la copie du catalogue figée par « pnpm fiabilite verifier ». Un retour
--   lancé après ce « verifier » ne change donc pas la mesure, qui continue avec
--   les nouveaux libellés : c'est la production qui s'en écarte. La mesure ne
--   décrit alors plus ce que la production envoie à l'IA, et rien ne le
--   signale. Après un retour : relancer « verifier » avant tout « lancer », et
--   contrôler que l'heure « Catalogue figé le … » (UTC), affichée par
--   « verifier » et par « estimer », est postérieure à l'étape 3 de ce script.
--
-- QUAND CE RETOUR N'EST PLUS POSSIBLE
--   Il ne l'est que tant qu'aucun point portant un des 36 libellés (ancien ou
--   nouveau, dans sa zone) n'a été ajouté, retiré ou modifié depuis l'aller :
--   modèle créé, supprimé ou retouché. Le premier modèle créé avec les nouveaux
--   libellés suffit. Ensuite l'étape 1 affiche « ÉCARTS », l'étape 2 s'arrête
--   sans rien écrire, et il faut adapter le script (comptes et identifiants).
--   Le reste du catalogue peut bouger : un modèle créé sans aucun de ces
--   libellés, un modèle désactivé ou renommé, un autre libellé retouché ne
--   gênent pas le retour.
--
-- COMMENT LE LANCER
--   TROIS ÉTAPES, À LANCER UNE PAR UNE dans l'éditeur SQL de Supabase (il
--   n'affiche que le résultat de la dernière instruction exécutée) :
--   ÉTAPE 1 — aperçu AVANT le retour (lecture seule). La ligne 0 donne le
--             verdict : « PRÊT POUR LE RETOUR » (lancer l'étape 2), « DÉJÀ
--             REVENU » (ne rien lancer) ou « ÉCARTS » suivi de leur liste (ne
--             pas lancer l'étape 2 ; si aucun libellé du relevé n'est dans la
--             base, le verdict le dit : vérifier le projet ouvert). Noter le
--             verdict et l'empreinte des libellés de la ligne 0.
--   ÉTAPE 2 — le retour : UN seul bloc atomique. Au moindre écart, avant ou
--             après l'écriture, une exception annule TOUT. Un succès sans
--             message veut dire « remis » ou « déjà revenu, rien écrit » :
--             l'étape 3 ne les distingue pas (elle lit l'état de la base, le
--             même dans les deux cas). Ce qui les distingue : le verdict de
--             l'étape 1 lancée juste avant (« PRÊT POUR LE RETOUR » : l'étape 2
--             a écrit ; « DÉJÀ REVENU » : elle n'avait rien à écrire), et
--             l'empreinte des libellés, qui ne change entre l'étape 1 et
--             l'étape 3 que s'il y a eu écriture (elle porte sur toute la
--             table : un modèle créé ou supprimé, ou un authentication_points
--             modifié par ailleurs entre-temps, la change aussi). Pendant le
--             bloc, public.models est fermée à l'écriture et reste ouverte à la
--             lecture ; si la table est occupée, une erreur arrive au bout de
--             5 s, rien n'est écrit, relancer. Si une erreur est suivie de
--             « current transaction is aborted », lancer « rollback; » seul,
--             puis reprendre à l'étape 1.
--   ÉTAPE 3 — aperçu APRÈS le retour (lecture seule) : la preuve que la base
--             est dans l'état de départ. Verdict attendu : « À L'ÉTAT DE
--             DÉPART », 36 lignes « ancien en place », et les deux empreintes
--             de la ligne 0 égales à celles notées à l'étape 1 de l'aller :
--             c'est la preuve du retour à l'octet près. Elle décrit l'état de
--             la base, pas ce que l'étape 2 vient de faire : sur une base
--             jamais corrigée, elle affiche la même chose.
--   (Lancer le fichier entier d'un coup n'affiche que l'étape 3 : on perd le
--   moyen de savoir si l'étape 2 a écrit ou si la base était déjà revenue.)
--
-- COMMENT LES FUSIONS SE DÉFONT
--   Le script porte les identifiants des 28 modèles du profil « court » des
--   vêtements (relevé du 2026-10-06) :
--   tags      : « Étiquettes volantes » redevient « Tags » sur ces 28 modèles,
--               « Tags et etiquettes volantes » sur tous les autres.
--   packaging : « Emballage » redevient « Emballage et packaging », sauf sur ces
--               28 modèles, qui le portaient déjà et le gardent.
--   L'étape 2 vérifie d'abord que la base est exactement dans l'état laissé par
--   l'aller : chaque nouveau libellé a son total, 28 « Étiquettes volantes » et
--   28 « Emballage » sur les 28 modèles, 98 et 98 ailleurs, plus aucun ancien
--   libellé. Sinon elle s'arrête, rien n'est écrit (voir « QUAND CE RETOUR
--   N'EST PLUS POSSIBLE »). Base déjà revenue : un avis, aucune écriture.
--
-- CE QUE L'ÉTAPE 2 VÉRIFIE APRÈS AVOIR ÉCRIT
--   Les mêmes contrôles que l'aller : chaque ancien libellé a retrouvé son
--   nombre de points ; exactement 2585 libellés modifiés, tous d'après la table ;
--   pour chaque modèle, même nombre de points et même suite de (zone, weight) ;
--   rien d'autre que le libellé ne change dans un point ; les modèles non
--   concernés sont identiques à l'octet près ; aucune autre colonne ne change.
-- ============================================================================


-- ═══ ÉTAPE 1 — APERÇU AVANT LE RETOUR (lecture seule) ══════════════════════════
-- Colonnes des corrections : n°, zone, ancien libellé, nouveau libellé, points au relevé, profil.
-- profil ne sert qu'aux deux fusions : 'court' = points portés par les 28 modèles du profil court,
-- 'long' = points portés par les autres modèles ; nul = sans objet.
with corr (n, zone, ancien, nouveau, points, profil) as (values
  ( 1, 'box_label', 'Boite et emballage (etiquette, code-barres)', 'Boîte et emballage (étiquette, code-barres)', 84, null),
  ( 2, 'box_label', 'Étiquette boîte (code barre, SKU)', 'Étiquette boîte (code-barres, SKU)', 1, null),
  ( 3, 'eyelets', 'Oeillets et lacets', 'Œillets et lacets', 84, null),
  ( 4, 'hardware', 'Hardware/ferrures (gravure, poids, finition)', 'Pièces métalliques (gravure, poids, finition)', 175, null),
  ( 5, 'heart_on_back', 'Broderie coeur dos du sac', 'Broderie cœur dos du sac', 1, null),
  ( 6, 'heel_tab', 'Tab talon', 'Languette du talon', 1, null),
  ( 7, 'heel_tab', 'Tab talon (forme, coutures)', 'Languette du talon (forme, coutures)', 2, null),
  ( 8, 'heel_tab', 'Tab talon (forme, logo)', 'Languette du talon (forme, logo)', 1, null),
  ( 9, 'heel_tab', 'Tab talon (pull tab)', 'Languette du talon (pull tab)', 1, null),
  (10, 'heel_tab_stitching', 'Coutures du tab talon', 'Coutures de la languette du talon', 1, null),
  (11, 'hot_stamp', 'Stamp/marquage a chaud', 'Marquage à chaud', 175, null),
  (12, 'interior_label', 'Etiquette interieure (police, numero de serie)', 'Étiquette intérieure (police, numéro de série)', 175, null),
  (13, 'jumpman_logo', 'Logo Jumpman (langue)', 'Logo Jumpman (languette)', 1, null),
  (14, 'leather', 'Cuir/materiau (grain, odeur, souplesse)', 'Cuir et matières (grain, odeur, souplesse)', 175, null),
  (15, 'logo_monogram', 'Logo et monogramme (alignement, symetrie)', 'Logo et monogramme (alignement, symétrie)', 175, null),
  (16, 'logo_placement', 'Logo (placement, taille, symetrie)', 'Logo (placement, taille, symétrie)', 84, null),
  (17, 'logo_placement', 'Logo placement', 'Placement du logo', 31, null),
  (18, 'materials', 'Materiaux', 'Matériaux', 31, null),
  (19, 'materials', 'Materiaux (cuir, mesh, daim)', 'Matériaux (cuir, mesh, daim)', 84, null),
  (20, 'neck_label', 'Etiquette col', 'Étiquette de col', 28, null),
  (21, 'neck_label', 'Etiquette col (marque, taille, composition)', 'Étiquette de col (marque, taille, composition)', 98, null),
  (22, 'packaging', 'Emballage (dust bag, boite, certificat)', 'Emballage (dust bag, boîte, certificat)', 175, null),
  (23, 'packaging', 'Emballage et packaging', 'Emballage', 98, 'long'),
  (24, 'print_embroidery', 'Print/Broderie', 'Imprimé et broderie', 28, null),
  (25, 'print_embroidery', 'Print/Broderie (qualite, alignement)', 'Imprimé et broderie (qualité, alignement)', 98, null),
  (26, 'product_code', 'Code produit interieur', 'Code produit intérieur', 84, null),
  (27, 'stitching', 'Coutures (regularite, couleur du fil, tension)', 'Coutures (régularité, couleur du fil, tension)', 175, null),
  (28, 'tags', 'Tags', 'Étiquettes volantes', 28, 'court'),
  (29, 'tags', 'Tags et etiquettes volantes', 'Étiquettes volantes', 98, 'long'),
  (30, 'tongue_label', 'Etiquette de langue (taille, code produit, pays)', 'Étiquette de la languette (taille, code produit, pays)', 84, null),
  (31, 'tongue_label', 'Etiquette langue', 'Étiquette de la languette', 31, null),
  (32, 'tongue_tag', 'Étiquette de langue', 'Étiquette de la languette', 3, null),
  (33, 'tongue_tag', 'Étiquette de langue NB', 'Étiquette de la languette NB', 1, null),
  (34, 'tongue_tag', 'Étiquette de langue Nike Air', 'Étiquette de la languette Nike Air', 1, null),
  (35, 'wash_label', 'Etiquette de lavage', 'Étiquette d''entretien', 98, null),
  (36, 'zipper', 'Fermeture eclair (YKK/Lampo, fluidite)', 'Fermeture éclair (YKK/Lampo, fluidité)', 175, null)
),
courts (id) as (values                 -- les 28 modèles du profil « court » des vêtements
  ('0104836a-2e18-4ad8-b4cd-b6bf462bc2cd'::uuid), ('072ff902-9dd1-451e-96b7-ba5268d47f0d'::uuid),
  ('1a9c8307-b7f0-44d2-a3ba-3550e6d9b668'::uuid), ('2f829421-4576-4eee-ae8c-609b42950b46'::uuid),
  ('36bf299d-d39b-4d84-b01c-69c5efba84cd'::uuid), ('430a4e47-42a5-4143-b87c-d019e8dea7d5'::uuid),
  ('478af667-ce04-4774-aa6d-5a4427c28811'::uuid), ('55f36efc-f5e1-48fc-8b1b-5fa5c7c14a42'::uuid),
  ('5b556ebf-715c-45b2-9387-049d0a64a618'::uuid), ('670f31cc-b4dd-4a87-8973-0022094edd8f'::uuid),
  ('7377f678-acbc-4dc4-9be2-780ecebe0ec5'::uuid), ('79fb0a08-04c3-4c80-98a1-efd0e17896f4'::uuid),
  ('818055ed-3e6e-48a8-a45b-e29a3feb8229'::uuid), ('8278982c-3cbf-457b-b28f-2aef92c844d7'::uuid),
  ('8447cae2-3515-4fbb-b6f9-c3e40fc0c930'::uuid), ('8b1431f4-438b-4db3-94d9-6c7ab45cb536'::uuid),
  ('9d3be398-3245-4b5e-b40a-4b24bb3059c4'::uuid), ('a3920bbd-69a1-4b3e-9891-8bec17a4c3d5'::uuid),
  ('a68606c3-bfef-4c43-9489-8bacac036b79'::uuid), ('a81fa359-f733-4477-aba5-de1331f3f3d0'::uuid),
  ('b454c08b-daa9-4f60-a038-15afcf4bf166'::uuid), ('c5abacf0-fbe7-461c-b46b-5819e39a47df'::uuid),
  ('d31e42f6-70d4-4ce6-865e-ef203211c3a5'::uuid), ('d94c24d1-f757-47d3-8e3d-dfefb32b3a1a'::uuid),
  ('da03c1bd-9753-4286-8201-e36b2e2ecbf8'::uuid), ('dc05da45-d7af-4b93-8e91-899b37638e52'::uuid),
  ('e43ffcce-a1b2-4341-9ae5-5ca911bef059'::uuid), ('f3737cac-2f66-4c08-b08a-cfa105840a5b'::uuid)
),
pts as (                               -- tous les points bien formés de tous les modèles, actifs ou non
  select m.id, m.id in (select k.id from courts k) as court, e.point ->> 'zone' as zone, e.point ->> 'label' as libelle
  from public.models m
  cross join lateral jsonb_array_elements(case when jsonb_typeof(m.authentication_points) = 'array' then m.authentication_points else '[]'::jsonb end) as e(point)
  where jsonb_typeof(e.point) = 'object' and jsonb_typeof(e.point -> 'zone') = 'string' and jsonb_typeof(e.point -> 'label') = 'string'
),
attendu as (                           -- combien de points doit porter chaque libellé, au départ puis une fois corrigé
  select l.zone, l.libelle,
         sum(l.depart)::int as depart, sum(l.applique)::int as applique,
         sum(l.courts_depart)::int as courts_depart, sum(l.courts_applique)::int as courts_applique
  from (
    -- les anciens libellés : tous leurs points au départ, plus aucun ensuite
    select c.zone, c.ancien as libelle, c.points as depart, 0 as applique,
           case c.profil when 'court' then c.points when 'long' then 0 end as courts_depart,
           case when c.profil is not null then 0 end as courts_applique
    from corr c
    union all
    -- les nouveaux libellés : aucun point au départ, tous ensuite
    select c.zone, c.nouveau, 0, c.points,
           case when c.profil is not null then 0 end,
           case c.profil when 'court' then c.points when 'long' then 0 end
    from corr c
    union all
    -- « Emballage » : déjà porté par les 28 modèles du profil court, avant comme après
    select 'packaging', 'Emballage', 28, 28, 28, 28
  ) l
  group by l.zone, l.libelle
),
mesure as (                            -- points trouvés pour chaque libellé, comparés aux deux états
  select s.*,
         s.trouves = s.depart and (s.courts_depart is null or s.trouves_courts = s.courts_depart) as ok_depart,
         s.trouves = s.applique and (s.courts_applique is null or s.trouves_courts = s.courts_applique) as ok_applique
  from (
    select a.zone, a.libelle, a.depart, a.applique, a.courts_depart, a.courts_applique,
           count(p.id)::int as trouves, (count(p.id) filter (where p.court))::int as trouves_courts
    from attendu a left join pts p on p.zone = a.zone and p.libelle = a.libelle
    group by a.zone, a.libelle, a.depart, a.applique, a.courts_depart, a.courts_applique
  ) s
),
etat as (
  select coalesce(bool_and(j.ok_depart), false) as au_depart,
         coalesce(bool_and(j.ok_applique), false) as applique,
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.depart,
               case when j.courts_depart is null then ''
                    else format(' (dont profil court : %s trouvé(s), %s attendu(s))', j.trouves_courts, j.courts_depart) end), ' | ' order by j.zone, j.libelle)
           filter (where not j.ok_depart) as ecarts_depart,
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.applique,
               case when j.courts_applique is null then ''
                    else format(' (dont profil court : %s trouvé(s), %s attendu(s))', j.trouves_courts, j.courts_applique) end), ' | ' order by j.zone, j.libelle)
           filter (where not j.ok_applique) as ecarts_applique,
         count(*) filter (where not j.ok_depart) as nb_depart,
         count(*) filter (where not j.ok_applique) as nb_applique,
         coalesce(sum(j.trouves), 0)::int as trouves,   -- points portant un libellé suivi, ancien ou nouveau
         count(*)::int as suivis,                       -- libellés suivis (anciens et nouveaux)
         (select count(*) from public.models) as modeles,
         (select count(distinct p.id) from pts p join corr c on c.zone = p.zone and c.nouveau = p.libelle and (c.profil is null or (c.profil = 'court') = p.court)) as modeles_a_modifier
  from mesure j
),
t as (
  select (select sum(c.points)::int from corr c) as attendus,
         (select sum(j.trouves)::int from mesure j where exists (select 1 from corr c where c.zone = j.zone and c.ancien = j.libelle)) as trouves_anciens,
         (select count(*)::int from pts p join corr c on c.zone = p.zone and c.nouveau = p.libelle and (c.profil is null or (c.profil = 'court') = p.court)) as trouves_nouveaux,
         -- Empreintes de toute la table : celle des libellés change à l'aller et revient à l'identique
         -- après le retour ; celle des autres colonnes ne doit jamais changer.
         (select md5(string_agg(m.id::text || md5(m.authentication_points::text), ',' order by m.id)) from public.models m) as empreinte_libelles,
         (select md5(string_agg(m.id::text || md5((to_jsonb(m) - 'authentication_points')::text), ',' order by m.id)) from public.models m) as empreinte_autres_colonnes
)
select 0 as ligne,
       case when e.trouves = 0 then 'ÉCARTS, NE PAS LANCER L''ÉTAPE 2 — ' || format('aucun des %s libellés du relevé (ni ancien ni nouveau) n''est dans cette base, dont public.models compte %s modèle(s) : est-ce le bon projet ?', e.suivis, e.modeles)
              when e.applique then format('PRÊT POUR LE RETOUR : %s points à remettre dans %s modèles (sur %s). Lancer l''étape 2.', t.attendus, e.modeles_a_modifier, e.modeles)
              when e.au_depart then 'DÉJÀ REVENU : la base est dans l''état de départ (anciens libellés). Ne rien lancer.'
              else 'ÉCARTS, NE PAS LANCER L''ÉTAPE 2 — ' || case when e.nb_applique <= e.nb_depart then format('par rapport à l''état corrigé (%s libellé(s) en écart sur %s ; %s par rapport à l''état de départ) : ', e.nb_applique, e.suivis, e.nb_depart) || e.ecarts_applique
                        else format('par rapport à l''état de départ (%s libellé(s) en écart sur %s ; %s par rapport à l''état corrigé) : ', e.nb_depart, e.suivis, e.nb_applique) || e.ecarts_depart end end as etat,
       '(total)' as zone, null::text as libelle_corrige, t.attendus as points_attendus, t.trouves_nouveaux as points_trouves,
       null::text as ancien_libelle, null::int as portent_l_ancien, null::text as modeles_vises,
       t.empreinte_libelles, t.empreinte_autres_colonnes
from etat e cross join t
union all
select c.n,
       case when ja.ok_applique and jn.ok_applique then 'à remettre'
              when ja.ok_depart and jn.ok_depart then 'ancien en place'
              else 'ÉCART' end,
       c.zone, c.nouveau, c.points,
       case c.profil when 'court' then jn.trouves_courts when 'long' then jn.trouves - jn.trouves_courts else jn.trouves end,
       c.ancien, ja.trouves,
       case c.profil when 'court' then 'les 28 du profil court' when 'long' then 'tous sauf les 28 du profil court' else 'tous' end,
       null, null
from corr c
join mesure ja on ja.zone = c.zone and ja.libelle = c.ancien
join mesure jn on jn.zone = c.zone and jn.libelle = c.nouveau
order by ligne;


-- ═══ ÉTAPE 2 — RETOUR (un seul bloc atomique) ══════════════════════════════════
begin;
set local lock_timeout = '5s';   -- si la table est occupée : une erreur au bout de 5 s, rien n'est écrit, relancer

do $$
declare
  v_total constant int := 2585;   -- points à modifier, tous modèles confondus
  v_ecarts_depart text;             -- écarts avec l'état de départ (nul : aucun)
  v_ecarts_applique text;           -- écarts avec l'état corrigé (nul : aucun)
  v_nb_depart int; v_nb_applique int;
  v_trouves int;                    -- points portant un libellé suivi, ancien ou nouveau
  v_suivis int;                     -- libellés suivis (71 : les anciens et les nouveaux)
  v_modeles int;                    -- modèles à modifier
  v_n int;
  v_orphelins int; v_changes int; v_hors_table int; v_reste int;
begin
  -- Personne d'autre n'écrit dans public.models pendant le bloc ; la lecture (le site) reste ouverte.
  -- Le verrou tombe tout seul à la fin du bloc.
  lock table public.models in share row exclusive mode;

  -- Tables de travail, temporaires : elles disparaissent à la fin du bloc, écrit ou annulé.
  -- profil ne sert qu'aux deux fusions : 'court' = points portés par les 28 modèles du profil court,
  -- 'long' = points portés par les autres modèles ; nul = sans objet.
  create temp table lv_corr (n int, zone text, ancien text, nouveau text, points int, profil text,
                             primary key (zone, ancien)) on commit drop;
  insert into lv_corr (n, zone, ancien, nouveau, points, profil) values
    ( 1, 'box_label', 'Boite et emballage (etiquette, code-barres)', 'Boîte et emballage (étiquette, code-barres)', 84, null),
    ( 2, 'box_label', 'Étiquette boîte (code barre, SKU)', 'Étiquette boîte (code-barres, SKU)', 1, null),
    ( 3, 'eyelets', 'Oeillets et lacets', 'Œillets et lacets', 84, null),
    ( 4, 'hardware', 'Hardware/ferrures (gravure, poids, finition)', 'Pièces métalliques (gravure, poids, finition)', 175, null),
    ( 5, 'heart_on_back', 'Broderie coeur dos du sac', 'Broderie cœur dos du sac', 1, null),
    ( 6, 'heel_tab', 'Tab talon', 'Languette du talon', 1, null),
    ( 7, 'heel_tab', 'Tab talon (forme, coutures)', 'Languette du talon (forme, coutures)', 2, null),
    ( 8, 'heel_tab', 'Tab talon (forme, logo)', 'Languette du talon (forme, logo)', 1, null),
    ( 9, 'heel_tab', 'Tab talon (pull tab)', 'Languette du talon (pull tab)', 1, null),
    (10, 'heel_tab_stitching', 'Coutures du tab talon', 'Coutures de la languette du talon', 1, null),
    (11, 'hot_stamp', 'Stamp/marquage a chaud', 'Marquage à chaud', 175, null),
    (12, 'interior_label', 'Etiquette interieure (police, numero de serie)', 'Étiquette intérieure (police, numéro de série)', 175, null),
    (13, 'jumpman_logo', 'Logo Jumpman (langue)', 'Logo Jumpman (languette)', 1, null),
    (14, 'leather', 'Cuir/materiau (grain, odeur, souplesse)', 'Cuir et matières (grain, odeur, souplesse)', 175, null),
    (15, 'logo_monogram', 'Logo et monogramme (alignement, symetrie)', 'Logo et monogramme (alignement, symétrie)', 175, null),
    (16, 'logo_placement', 'Logo (placement, taille, symetrie)', 'Logo (placement, taille, symétrie)', 84, null),
    (17, 'logo_placement', 'Logo placement', 'Placement du logo', 31, null),
    (18, 'materials', 'Materiaux', 'Matériaux', 31, null),
    (19, 'materials', 'Materiaux (cuir, mesh, daim)', 'Matériaux (cuir, mesh, daim)', 84, null),
    (20, 'neck_label', 'Etiquette col', 'Étiquette de col', 28, null),
    (21, 'neck_label', 'Etiquette col (marque, taille, composition)', 'Étiquette de col (marque, taille, composition)', 98, null),
    (22, 'packaging', 'Emballage (dust bag, boite, certificat)', 'Emballage (dust bag, boîte, certificat)', 175, null),
    (23, 'packaging', 'Emballage et packaging', 'Emballage', 98, 'long'),
    (24, 'print_embroidery', 'Print/Broderie', 'Imprimé et broderie', 28, null),
    (25, 'print_embroidery', 'Print/Broderie (qualite, alignement)', 'Imprimé et broderie (qualité, alignement)', 98, null),
    (26, 'product_code', 'Code produit interieur', 'Code produit intérieur', 84, null),
    (27, 'stitching', 'Coutures (regularite, couleur du fil, tension)', 'Coutures (régularité, couleur du fil, tension)', 175, null),
    (28, 'tags', 'Tags', 'Étiquettes volantes', 28, 'court'),
    (29, 'tags', 'Tags et etiquettes volantes', 'Étiquettes volantes', 98, 'long'),
    (30, 'tongue_label', 'Etiquette de langue (taille, code produit, pays)', 'Étiquette de la languette (taille, code produit, pays)', 84, null),
    (31, 'tongue_label', 'Etiquette langue', 'Étiquette de la languette', 31, null),
    (32, 'tongue_tag', 'Étiquette de langue', 'Étiquette de la languette', 3, null),
    (33, 'tongue_tag', 'Étiquette de langue NB', 'Étiquette de la languette NB', 1, null),
    (34, 'tongue_tag', 'Étiquette de langue Nike Air', 'Étiquette de la languette Nike Air', 1, null),
    (35, 'wash_label', 'Etiquette de lavage', 'Étiquette d''entretien', 98, null),
    (36, 'zipper', 'Fermeture eclair (YKK/Lampo, fluidite)', 'Fermeture éclair (YKK/Lampo, fluidité)', 175, null);
  create temp table lv_courts (id uuid primary key) on commit drop;   -- les 28 modèles du profil « court »
  insert into lv_courts (id) values
    ('0104836a-2e18-4ad8-b4cd-b6bf462bc2cd'::uuid), ('072ff902-9dd1-451e-96b7-ba5268d47f0d'::uuid),
    ('1a9c8307-b7f0-44d2-a3ba-3550e6d9b668'::uuid), ('2f829421-4576-4eee-ae8c-609b42950b46'::uuid),
    ('36bf299d-d39b-4d84-b01c-69c5efba84cd'::uuid), ('430a4e47-42a5-4143-b87c-d019e8dea7d5'::uuid),
    ('478af667-ce04-4774-aa6d-5a4427c28811'::uuid), ('55f36efc-f5e1-48fc-8b1b-5fa5c7c14a42'::uuid),
    ('5b556ebf-715c-45b2-9387-049d0a64a618'::uuid), ('670f31cc-b4dd-4a87-8973-0022094edd8f'::uuid),
    ('7377f678-acbc-4dc4-9be2-780ecebe0ec5'::uuid), ('79fb0a08-04c3-4c80-98a1-efd0e17896f4'::uuid),
    ('818055ed-3e6e-48a8-a45b-e29a3feb8229'::uuid), ('8278982c-3cbf-457b-b28f-2aef92c844d7'::uuid),
    ('8447cae2-3515-4fbb-b6f9-c3e40fc0c930'::uuid), ('8b1431f4-438b-4db3-94d9-6c7ab45cb536'::uuid),
    ('9d3be398-3245-4b5e-b40a-4b24bb3059c4'::uuid), ('a3920bbd-69a1-4b3e-9891-8bec17a4c3d5'::uuid),
    ('a68606c3-bfef-4c43-9489-8bacac036b79'::uuid), ('a81fa359-f733-4477-aba5-de1331f3f3d0'::uuid),
    ('b454c08b-daa9-4f60-a038-15afcf4bf166'::uuid), ('c5abacf0-fbe7-461c-b46b-5819e39a47df'::uuid),
    ('d31e42f6-70d4-4ce6-865e-ef203211c3a5'::uuid), ('d94c24d1-f757-47d3-8e3d-dfefb32b3a1a'::uuid),
    ('da03c1bd-9753-4286-8201-e36b2e2ecbf8'::uuid), ('dc05da45-d7af-4b93-8e91-899b37638e52'::uuid),
    ('e43ffcce-a1b2-4341-9ae5-5ca911bef059'::uuid), ('f3737cac-2f66-4c08-b08a-cfa105840a5b'::uuid);
  if (select count(*) from lv_corr) <> 36 or (select sum(c.points) from lv_corr c) <> v_total
     or (select count(*) from lv_courts) <> 28 then
    raise exception 'Les listes du script ont été modifiées (36 corrections, % points, 28 modèles attendus) — rien n''est écrit', v_total;
  end if;

  create temp table lv_attendu on commit drop as
    select l.zone, l.libelle,
           sum(l.depart)::int as depart, sum(l.applique)::int as applique,
           sum(l.courts_depart)::int as courts_depart, sum(l.courts_applique)::int as courts_applique
    from (
      -- les anciens libellés : tous leurs points au départ, plus aucun ensuite
      select c.zone, c.ancien as libelle, c.points as depart, 0 as applique,
             case c.profil when 'court' then c.points when 'long' then 0 end as courts_depart,
             case when c.profil is not null then 0 end as courts_applique
      from lv_corr c
      union all
      -- les nouveaux libellés : aucun point au départ, tous ensuite
      select c.zone, c.nouveau, 0, c.points,
             case when c.profil is not null then 0 end,
             case c.profil when 'court' then c.points when 'long' then 0 end
      from lv_corr c
      union all
      -- « Emballage » : déjà porté par les 28 modèles du profil court, avant comme après
      select 'packaging', 'Emballage', 28, 28, 28, 28
    ) l
    group by l.zone, l.libelle;

  -- Toute la table telle qu'elle est avant d'écrire
  create temp table lv_avant on commit drop as
    select m.id, m.authentication_points::text as points_texte,
           (to_jsonb(m) - 'authentication_points')::text as autres_colonnes
    from public.models m;

  -- Les éléments de tous les tableaux, relevés deux fois : avant puis après l'écriture. Un
  -- authentication_points qui n'est pas un tableau n'en donne aucun ; zone et libelle restent nuls
  -- pour un élément mal formé (pas un objet, « zone » ou « label » absent ou pas un texte) : ignoré.
  create temp table lv_points (moment text, id uuid, rang bigint, point jsonb, court boolean,
                               zone text, libelle text) on commit drop;

  -- ── 1. L'état AVANT (au moindre écart : exception, rien n'est écrit) ─────
  -- Tous les éléments de tous les tableaux, tels qu'ils sont avant d'écrire
  insert into lv_points
  select 'avant', m.id, e.rang, e.point, m.id in (select k.id from lv_courts k),
         case when f.bien_forme then e.point ->> 'zone' end, case when f.bien_forme then e.point ->> 'label' end
  from public.models m
  cross join lateral jsonb_array_elements(case when jsonb_typeof(m.authentication_points) = 'array' then m.authentication_points else '[]'::jsonb end) with ordinality as e(point, rang)
  cross join lateral (select jsonb_typeof(e.point) = 'object' and jsonb_typeof(e.point -> 'zone') = 'string' and jsonb_typeof(e.point -> 'label') = 'string' as bien_forme) f;
  -- Pour chaque libellé suivi : points trouvés, comparés à l'état de départ et à l'état corrigé
  select string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.depart,
               case when j.courts_depart is null then ''
                    else format(' (dont profil court : %s trouvé(s), %s attendu(s))', j.trouves_courts, j.courts_depart) end), E'\n' order by j.zone, j.libelle)
           filter (where not j.ok_depart),
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.applique,
               case when j.courts_applique is null then ''
                    else format(' (dont profil court : %s trouvé(s), %s attendu(s))', j.trouves_courts, j.courts_applique) end), E'\n' order by j.zone, j.libelle)
           filter (where not j.ok_applique),
         count(*) filter (where not j.ok_depart), count(*) filter (where not j.ok_applique),
         coalesce(sum(j.trouves), 0), count(*)
    into v_ecarts_depart, v_ecarts_applique, v_nb_depart, v_nb_applique, v_trouves, v_suivis
  from (
    select s.*,
           s.trouves = s.depart and (s.courts_depart is null or s.trouves_courts = s.courts_depart) as ok_depart,
           s.trouves = s.applique and (s.courts_applique is null or s.trouves_courts = s.courts_applique) as ok_applique
    from (
      select a.zone, a.libelle, a.depart, a.applique, a.courts_depart, a.courts_applique,
             count(p.id)::int as trouves, (count(p.id) filter (where p.court))::int as trouves_courts
      from lv_attendu a left join lv_points p on p.moment = 'avant' and p.zone = a.zone and p.libelle = a.libelle
      group by a.zone, a.libelle, a.depart, a.applique, a.courts_depart, a.courts_applique
    ) s
  ) j;

  -- Aucun libellé suivi dans la base (table vide, mauvais projet) : le dire tel quel.
  if v_trouves = 0 then
    raise exception 'Aucun des % libellés du relevé (ni ancien ni nouveau) n''est dans cette base, dont public.models compte % modèle(s) : est-ce le bon projet ? — rien n''est écrit',
      v_suivis, (select count(*) from lv_avant);
  end if;
  if v_ecarts_depart is null then
    raise notice 'Déjà revenu : la base est dans l''état de départ, rien n''est écrit.';
    return;
  end if;
  if v_ecarts_applique is not null then
    raise exception 'La base n''est ni dans l''état de départ ni dans l''état corrigé — rien n''est écrit. %',
      case when v_nb_applique <= v_nb_depart then format('Écarts avec l''état corrigé (%s libellé(s) sur %s ; %s avec l''état de départ) :', v_nb_applique, v_suivis, v_nb_depart) || E'\n' || v_ecarts_applique
                else format('Écarts avec l''état de départ (%s libellé(s) sur %s ; %s avec l''état corrigé) :', v_nb_depart, v_suivis, v_nb_applique) || E'\n' || v_ecarts_depart end;
  end if;

  -- ── 2. La modification ──────────────────────────────────────────────────
  -- Les fusions se défont par le profil : une correction 'court' ne s'applique qu'aux 28 modèles,
  -- une correction 'long' qu'aux autres. « Emballage » n'a pas de correction 'court' : les 28 le gardent.
  create temp table lv_concernes on commit drop as
    select distinct p.id
    from lv_points p join lv_corr c on c.zone = p.zone and c.nouveau = p.libelle and (c.profil is null or (c.profil = 'court') = p.court)
    where p.moment = 'avant';

  -- Le tableau de chaque modèle concerné est reconstruit dans le même ordre ; un point n'est
  -- touché que si (zone, libellé) est dans la table, et seule sa clé « label » est remplacée.
  update public.models m
  set authentication_points = r.tableau
  from (
    select p.id,
           jsonb_agg(case when c.zone is null then p.point
                          else jsonb_set(p.point, '{label}', to_jsonb(c.ancien)) end
                     order by p.rang) as tableau
    from lv_points p
    left join lv_corr c on c.zone = p.zone and c.nouveau = p.libelle and (c.profil is null or (c.profil = 'court') = p.court)
    where p.moment = 'avant' and p.id in (select k.id from lv_concernes k)
    group by p.id
  ) r
  where m.id = r.id;
  get diagnostics v_modeles = row_count;

  -- ── 3. Les contrôles APRÈS (au moindre écart : exception, tout est annulé) ──
  -- Tous les éléments de tous les tableaux, relus après l'écriture (même instruction que plus haut)
  insert into lv_points
  select 'apres', m.id, e.rang, e.point, m.id in (select k.id from lv_courts k),
         case when f.bien_forme then e.point ->> 'zone' end, case when f.bien_forme then e.point ->> 'label' end
  from public.models m
  cross join lateral jsonb_array_elements(case when jsonb_typeof(m.authentication_points) = 'array' then m.authentication_points else '[]'::jsonb end) with ordinality as e(point, rang)
  cross join lateral (select jsonb_typeof(e.point) = 'object' and jsonb_typeof(e.point -> 'zone') = 'string' and jsonb_typeof(e.point -> 'label') = 'string' as bien_forme) f;
  -- La même mesure, sur l'état d'après
  select string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.depart,
               case when j.courts_depart is null then ''
                    else format(' (dont profil court : %s trouvé(s), %s attendu(s))', j.trouves_courts, j.courts_depart) end), E'\n' order by j.zone, j.libelle)
           filter (where not j.ok_depart),
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.applique,
               case when j.courts_applique is null then ''
                    else format(' (dont profil court : %s trouvé(s), %s attendu(s))', j.trouves_courts, j.courts_applique) end), E'\n' order by j.zone, j.libelle)
           filter (where not j.ok_applique),
         count(*) filter (where not j.ok_depart), count(*) filter (where not j.ok_applique),
         coalesce(sum(j.trouves), 0), count(*)
    into v_ecarts_depart, v_ecarts_applique, v_nb_depart, v_nb_applique, v_trouves, v_suivis
  from (
    select s.*,
           s.trouves = s.depart and (s.courts_depart is null or s.trouves_courts = s.courts_depart) as ok_depart,
           s.trouves = s.applique and (s.courts_applique is null or s.trouves_courts = s.courts_applique) as ok_applique
    from (
      select a.zone, a.libelle, a.depart, a.applique, a.courts_depart, a.courts_applique,
             count(p.id)::int as trouves, (count(p.id) filter (where p.court))::int as trouves_courts
      from lv_attendu a left join lv_points p on p.moment = 'apres' and p.zone = a.zone and p.libelle = a.libelle
      group by a.zone, a.libelle, a.depart, a.applique, a.courts_depart, a.courts_applique
    ) s
  ) j;

  -- a. plus aucun nouveau libellé hors des 28 « Emballage », et chaque ancien libellé a son total
  if v_ecarts_depart is not null then
    raise exception 'Après écriture, l''état attendu n''est pas atteint — tout est annulé :%', E'\n' || v_ecarts_depart;
  end if;

  -- b. autant de modèles écrits que de modèles concernés
  select count(*) into v_n from lv_concernes;
  if v_modeles <> v_n then
    raise exception '% modèles écrits pour % concernés — tout est annulé', v_modeles, v_n;
  end if;

  -- c. les mêmes lignes qu'avant, ni plus ni moins
  select count(*) into v_n
  from lv_avant a full join public.models m on m.id = a.id
  where a.id is null or m.id is null;
  if v_n <> 0 then raise exception '% modèles apparus ou disparus — tout est annulé', v_n; end if;

  -- d. aucune autre colonne ne change, sur aucun modèle
  select count(*) into v_n
  from lv_avant a join public.models m on m.id = a.id
  where a.autres_colonnes is distinct from (to_jsonb(m) - 'authentication_points')::text;
  if v_n <> 0 then raise exception '% modèles ont une autre colonne modifiée — tout est annulé', v_n; end if;

  -- e. les modèles non concernés sont identiques à l'octet près ; les modèles concernés ont tous changé
  select count(*) into v_n
  from lv_avant a join public.models m on m.id = a.id
  where (a.points_texte is distinct from m.authentication_points::text)
        is distinct from (a.id in (select k.id from lv_concernes k));
  if v_n <> 0 then raise exception '% modèles : tableau modifié à tort, ou laissé tel quel à tort — tout est annulé', v_n; end if;

  -- f. pour CHAQUE modèle : même nombre de points, même suite de (zone, weight)
  select count(*) into v_n
  from (
    select p.id
    from lv_points p
    group by p.id
    having (jsonb_agg(jsonb_build_array(p.point -> 'zone', p.point -> 'weight') order by p.rang) filter (where p.moment = 'avant'))::text
           is distinct from
           (jsonb_agg(jsonb_build_array(p.point -> 'zone', p.point -> 'weight') order by p.rang) filter (where p.moment = 'apres'))::text
  ) s;
  if v_n <> 0 then raise exception '% modèles : le nombre de points ou la suite des (zone, weight) a changé — tout est annulé', v_n; end if;

  -- g. point par point, au même rang : seul le libellé change, seulement d'après la table, 2585 fois
  select count(*) filter (where av.id is null or ap.id is null),
         count(*) filter (where av.libelle is distinct from ap.libelle),
         count(*) filter (where av.libelle is distinct from ap.libelle and c.zone is null),
         count(*) filter (where case when av.zone is not null and ap.zone is not null
                                     then (av.point - 'label')::text is distinct from (ap.point - 'label')::text
                                     else av.point::text is distinct from ap.point::text end)
    into v_orphelins, v_changes, v_hors_table, v_reste
  from (select * from lv_points where moment = 'avant') av
  full join (select * from lv_points where moment = 'apres') ap on ap.id = av.id and ap.rang = av.rang
  left join lv_corr c on c.zone = av.zone and c.nouveau = av.libelle and (c.profil is null or (c.profil = 'court') = av.court) and c.ancien = ap.libelle;
  if v_orphelins <> 0 then raise exception '% points apparus ou disparus — tout est annulé', v_orphelins; end if;
  if v_reste <> 0 then raise exception '% points modifiés ailleurs que dans leur libellé — tout est annulé', v_reste; end if;
  if v_hors_table <> 0 then raise exception '% libellés modifiés hors de la table des corrections — tout est annulé', v_hors_table; end if;
  if v_changes <> v_total then raise exception '% libellés modifiés au lieu de % — tout est annulé', v_changes, v_total; end if;

  raise notice 'Retour fait : % libellés remis dans % modèles.', v_changes, v_modeles;
end $$;
commit;


-- ═══ ÉTAPE 3 — APERÇU APRÈS LE RETOUR (lecture seule) ══════════════════════════
-- Colonnes des corrections : n°, zone, ancien libellé, nouveau libellé, points au relevé, profil.
-- profil ne sert qu'aux deux fusions : 'court' = points portés par les 28 modèles du profil court,
-- 'long' = points portés par les autres modèles ; nul = sans objet.
with corr (n, zone, ancien, nouveau, points, profil) as (values
  ( 1, 'box_label', 'Boite et emballage (etiquette, code-barres)', 'Boîte et emballage (étiquette, code-barres)', 84, null),
  ( 2, 'box_label', 'Étiquette boîte (code barre, SKU)', 'Étiquette boîte (code-barres, SKU)', 1, null),
  ( 3, 'eyelets', 'Oeillets et lacets', 'Œillets et lacets', 84, null),
  ( 4, 'hardware', 'Hardware/ferrures (gravure, poids, finition)', 'Pièces métalliques (gravure, poids, finition)', 175, null),
  ( 5, 'heart_on_back', 'Broderie coeur dos du sac', 'Broderie cœur dos du sac', 1, null),
  ( 6, 'heel_tab', 'Tab talon', 'Languette du talon', 1, null),
  ( 7, 'heel_tab', 'Tab talon (forme, coutures)', 'Languette du talon (forme, coutures)', 2, null),
  ( 8, 'heel_tab', 'Tab talon (forme, logo)', 'Languette du talon (forme, logo)', 1, null),
  ( 9, 'heel_tab', 'Tab talon (pull tab)', 'Languette du talon (pull tab)', 1, null),
  (10, 'heel_tab_stitching', 'Coutures du tab talon', 'Coutures de la languette du talon', 1, null),
  (11, 'hot_stamp', 'Stamp/marquage a chaud', 'Marquage à chaud', 175, null),
  (12, 'interior_label', 'Etiquette interieure (police, numero de serie)', 'Étiquette intérieure (police, numéro de série)', 175, null),
  (13, 'jumpman_logo', 'Logo Jumpman (langue)', 'Logo Jumpman (languette)', 1, null),
  (14, 'leather', 'Cuir/materiau (grain, odeur, souplesse)', 'Cuir et matières (grain, odeur, souplesse)', 175, null),
  (15, 'logo_monogram', 'Logo et monogramme (alignement, symetrie)', 'Logo et monogramme (alignement, symétrie)', 175, null),
  (16, 'logo_placement', 'Logo (placement, taille, symetrie)', 'Logo (placement, taille, symétrie)', 84, null),
  (17, 'logo_placement', 'Logo placement', 'Placement du logo', 31, null),
  (18, 'materials', 'Materiaux', 'Matériaux', 31, null),
  (19, 'materials', 'Materiaux (cuir, mesh, daim)', 'Matériaux (cuir, mesh, daim)', 84, null),
  (20, 'neck_label', 'Etiquette col', 'Étiquette de col', 28, null),
  (21, 'neck_label', 'Etiquette col (marque, taille, composition)', 'Étiquette de col (marque, taille, composition)', 98, null),
  (22, 'packaging', 'Emballage (dust bag, boite, certificat)', 'Emballage (dust bag, boîte, certificat)', 175, null),
  (23, 'packaging', 'Emballage et packaging', 'Emballage', 98, 'long'),
  (24, 'print_embroidery', 'Print/Broderie', 'Imprimé et broderie', 28, null),
  (25, 'print_embroidery', 'Print/Broderie (qualite, alignement)', 'Imprimé et broderie (qualité, alignement)', 98, null),
  (26, 'product_code', 'Code produit interieur', 'Code produit intérieur', 84, null),
  (27, 'stitching', 'Coutures (regularite, couleur du fil, tension)', 'Coutures (régularité, couleur du fil, tension)', 175, null),
  (28, 'tags', 'Tags', 'Étiquettes volantes', 28, 'court'),
  (29, 'tags', 'Tags et etiquettes volantes', 'Étiquettes volantes', 98, 'long'),
  (30, 'tongue_label', 'Etiquette de langue (taille, code produit, pays)', 'Étiquette de la languette (taille, code produit, pays)', 84, null),
  (31, 'tongue_label', 'Etiquette langue', 'Étiquette de la languette', 31, null),
  (32, 'tongue_tag', 'Étiquette de langue', 'Étiquette de la languette', 3, null),
  (33, 'tongue_tag', 'Étiquette de langue NB', 'Étiquette de la languette NB', 1, null),
  (34, 'tongue_tag', 'Étiquette de langue Nike Air', 'Étiquette de la languette Nike Air', 1, null),
  (35, 'wash_label', 'Etiquette de lavage', 'Étiquette d''entretien', 98, null),
  (36, 'zipper', 'Fermeture eclair (YKK/Lampo, fluidite)', 'Fermeture éclair (YKK/Lampo, fluidité)', 175, null)
),
courts (id) as (values                 -- les 28 modèles du profil « court » des vêtements
  ('0104836a-2e18-4ad8-b4cd-b6bf462bc2cd'::uuid), ('072ff902-9dd1-451e-96b7-ba5268d47f0d'::uuid),
  ('1a9c8307-b7f0-44d2-a3ba-3550e6d9b668'::uuid), ('2f829421-4576-4eee-ae8c-609b42950b46'::uuid),
  ('36bf299d-d39b-4d84-b01c-69c5efba84cd'::uuid), ('430a4e47-42a5-4143-b87c-d019e8dea7d5'::uuid),
  ('478af667-ce04-4774-aa6d-5a4427c28811'::uuid), ('55f36efc-f5e1-48fc-8b1b-5fa5c7c14a42'::uuid),
  ('5b556ebf-715c-45b2-9387-049d0a64a618'::uuid), ('670f31cc-b4dd-4a87-8973-0022094edd8f'::uuid),
  ('7377f678-acbc-4dc4-9be2-780ecebe0ec5'::uuid), ('79fb0a08-04c3-4c80-98a1-efd0e17896f4'::uuid),
  ('818055ed-3e6e-48a8-a45b-e29a3feb8229'::uuid), ('8278982c-3cbf-457b-b28f-2aef92c844d7'::uuid),
  ('8447cae2-3515-4fbb-b6f9-c3e40fc0c930'::uuid), ('8b1431f4-438b-4db3-94d9-6c7ab45cb536'::uuid),
  ('9d3be398-3245-4b5e-b40a-4b24bb3059c4'::uuid), ('a3920bbd-69a1-4b3e-9891-8bec17a4c3d5'::uuid),
  ('a68606c3-bfef-4c43-9489-8bacac036b79'::uuid), ('a81fa359-f733-4477-aba5-de1331f3f3d0'::uuid),
  ('b454c08b-daa9-4f60-a038-15afcf4bf166'::uuid), ('c5abacf0-fbe7-461c-b46b-5819e39a47df'::uuid),
  ('d31e42f6-70d4-4ce6-865e-ef203211c3a5'::uuid), ('d94c24d1-f757-47d3-8e3d-dfefb32b3a1a'::uuid),
  ('da03c1bd-9753-4286-8201-e36b2e2ecbf8'::uuid), ('dc05da45-d7af-4b93-8e91-899b37638e52'::uuid),
  ('e43ffcce-a1b2-4341-9ae5-5ca911bef059'::uuid), ('f3737cac-2f66-4c08-b08a-cfa105840a5b'::uuid)
),
pts as (                               -- tous les points bien formés de tous les modèles, actifs ou non
  select m.id, m.id in (select k.id from courts k) as court, e.point ->> 'zone' as zone, e.point ->> 'label' as libelle
  from public.models m
  cross join lateral jsonb_array_elements(case when jsonb_typeof(m.authentication_points) = 'array' then m.authentication_points else '[]'::jsonb end) as e(point)
  where jsonb_typeof(e.point) = 'object' and jsonb_typeof(e.point -> 'zone') = 'string' and jsonb_typeof(e.point -> 'label') = 'string'
),
attendu as (                           -- combien de points doit porter chaque libellé, au départ puis une fois corrigé
  select l.zone, l.libelle,
         sum(l.depart)::int as depart, sum(l.applique)::int as applique,
         sum(l.courts_depart)::int as courts_depart, sum(l.courts_applique)::int as courts_applique
  from (
    -- les anciens libellés : tous leurs points au départ, plus aucun ensuite
    select c.zone, c.ancien as libelle, c.points as depart, 0 as applique,
           case c.profil when 'court' then c.points when 'long' then 0 end as courts_depart,
           case when c.profil is not null then 0 end as courts_applique
    from corr c
    union all
    -- les nouveaux libellés : aucun point au départ, tous ensuite
    select c.zone, c.nouveau, 0, c.points,
           case when c.profil is not null then 0 end,
           case c.profil when 'court' then c.points when 'long' then 0 end
    from corr c
    union all
    -- « Emballage » : déjà porté par les 28 modèles du profil court, avant comme après
    select 'packaging', 'Emballage', 28, 28, 28, 28
  ) l
  group by l.zone, l.libelle
),
mesure as (                            -- points trouvés pour chaque libellé, comparés aux deux états
  select s.*,
         s.trouves = s.depart and (s.courts_depart is null or s.trouves_courts = s.courts_depart) as ok_depart,
         s.trouves = s.applique and (s.courts_applique is null or s.trouves_courts = s.courts_applique) as ok_applique
  from (
    select a.zone, a.libelle, a.depart, a.applique, a.courts_depart, a.courts_applique,
           count(p.id)::int as trouves, (count(p.id) filter (where p.court))::int as trouves_courts
    from attendu a left join pts p on p.zone = a.zone and p.libelle = a.libelle
    group by a.zone, a.libelle, a.depart, a.applique, a.courts_depart, a.courts_applique
  ) s
),
etat as (
  select coalesce(bool_and(j.ok_depart), false) as au_depart,
         coalesce(bool_and(j.ok_applique), false) as applique,
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.depart,
               case when j.courts_depart is null then ''
                    else format(' (dont profil court : %s trouvé(s), %s attendu(s))', j.trouves_courts, j.courts_depart) end), ' | ' order by j.zone, j.libelle)
           filter (where not j.ok_depart) as ecarts_depart,
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.applique,
               case when j.courts_applique is null then ''
                    else format(' (dont profil court : %s trouvé(s), %s attendu(s))', j.trouves_courts, j.courts_applique) end), ' | ' order by j.zone, j.libelle)
           filter (where not j.ok_applique) as ecarts_applique,
         count(*) filter (where not j.ok_depart) as nb_depart,
         count(*) filter (where not j.ok_applique) as nb_applique,
         coalesce(sum(j.trouves), 0)::int as trouves,   -- points portant un libellé suivi, ancien ou nouveau
         count(*)::int as suivis,                       -- libellés suivis (anciens et nouveaux)
         (select count(*) from public.models) as modeles,
         (select count(distinct p.id) from pts p join corr c on c.zone = p.zone and c.nouveau = p.libelle and (c.profil is null or (c.profil = 'court') = p.court)) as modeles_a_modifier
  from mesure j
),
t as (
  select (select sum(c.points)::int from corr c) as attendus,
         (select sum(j.trouves)::int from mesure j where exists (select 1 from corr c where c.zone = j.zone and c.ancien = j.libelle)) as trouves_anciens,
         (select count(*)::int from pts p join corr c on c.zone = p.zone and c.nouveau = p.libelle and (c.profil is null or (c.profil = 'court') = p.court)) as trouves_nouveaux,
         -- Empreintes de toute la table : celle des libellés change à l'aller et revient à l'identique
         -- après le retour ; celle des autres colonnes ne doit jamais changer.
         (select md5(string_agg(m.id::text || md5(m.authentication_points::text), ',' order by m.id)) from public.models m) as empreinte_libelles,
         (select md5(string_agg(m.id::text || md5((to_jsonb(m) - 'authentication_points')::text), ',' order by m.id)) from public.models m) as empreinte_autres_colonnes
)
select 0 as ligne,
       case when e.trouves = 0 then 'ÉCARTS — ' || format('aucun des %s libellés du relevé (ni ancien ni nouveau) n''est dans cette base, dont public.models compte %s modèle(s) : est-ce le bon projet ?', e.suivis, e.modeles)
              when e.au_depart then format('À L''ÉTAT DE DÉPART : les 36 anciens libellés sont en place (%s points), aucune des 36 corrections ne l''est.', t.attendus)
              when e.applique then 'PAS REVENU : les corrections sont toujours en place, l''étape 2 n''a rien écrit.'
              else 'ÉCARTS — ' || case when e.nb_depart <= e.nb_applique then format('par rapport à l''état de départ (%s libellé(s) en écart sur %s ; %s par rapport à l''état corrigé) : ', e.nb_depart, e.suivis, e.nb_applique) || e.ecarts_depart
                        else format('par rapport à l''état corrigé (%s libellé(s) en écart sur %s ; %s par rapport à l''état de départ) : ', e.nb_applique, e.suivis, e.nb_depart) || e.ecarts_applique end end as etat,
       '(total)' as zone, null::text as libelle_corrige, t.attendus as points_attendus, t.trouves_nouveaux as points_trouves,
       null::text as ancien_libelle, null::int as portent_l_ancien, null::text as modeles_vises,
       t.empreinte_libelles, t.empreinte_autres_colonnes
from etat e cross join t
union all
select c.n,
       case when ja.ok_applique and jn.ok_applique then 'à remettre'
              when ja.ok_depart and jn.ok_depart then 'ancien en place'
              else 'ÉCART' end,
       c.zone, c.nouveau, c.points,
       case c.profil when 'court' then jn.trouves_courts when 'long' then jn.trouves - jn.trouves_courts else jn.trouves end,
       c.ancien, ja.trouves,
       case c.profil when 'court' then 'les 28 du profil court' when 'long' then 'tous sauf les 28 du profil court' else 'tous' end,
       null, null
from corr c
join mesure ja on ja.zone = c.zone and ja.libelle = c.ancien
join mesure jn on jn.zone = c.zone and jn.libelle = c.nouveau
order by ligne;
