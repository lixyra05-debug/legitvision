with corr (n, zone, ancien, nouveau, points, liste) as (values
  ( 1, 'box_label', 'Boite et emballage (etiquette, code-barres)', 'Étiquette de la boîte (boîte et emballage : étiquette, code-barres)', 84, false),
  ( 2, 'box_label', 'Étiquette boîte', 'Étiquette de la boîte', 1, true),
  ( 3, 'box_label', 'Étiquette boîte (code barre, SKU)', 'Étiquette de la boîte (code-barres, SKU)', 1, true),
  ( 4, 'eyelets', 'Oeillets et lacets', 'Œillets et lacets', 84, false),
  ( 5, 'hardware', 'Hardware/ferrures (gravure, poids, finition)', 'Pièces métalliques (gravure, poids, finition)', 175, false),
  ( 6, 'heart_on_back', 'Broderie coeur dos du sac', 'Broderie cœur dos du sac', 1, false),
  ( 7, 'heel_tab', 'Tab talon', 'Languette du talon', 1, false),
  ( 8, 'heel_tab', 'Tab talon (forme, coutures)', 'Languette du talon (forme, coutures)', 2, false),
  ( 9, 'heel_tab', 'Tab talon (forme, logo)', 'Languette du talon (forme, logo)', 1, false),
  (10, 'heel_tab', 'Tab talon (pull tab)', 'Languette du talon (pull tab)', 1, false),
  (11, 'heel_tab_stitching', 'Coutures du tab talon', 'Coutures de la languette du talon', 1, false),
  (12, 'hot_stamp', 'Stamp/marquage a chaud', 'Marquage à chaud', 175, false),
  (13, 'interior_label', 'Etiquette interieure (police, numero de serie)', 'Étiquette intérieure (police, numéro de série)', 175, false),
  (14, 'jumpman_logo', 'Logo Jumpman (langue)', 'Logo Jumpman (languette)', 1, false),
  (15, 'leather', 'Cuir/materiau (grain, odeur, souplesse)', 'Cuir et matières (grain, odeur, souplesse)', 175, false),
  (16, 'logo_monogram', 'Logo et monogramme (alignement, symetrie)', 'Logo et monogramme (alignement, symétrie)', 175, false),
  (17, 'logo_placement', 'Logo (placement, taille, symetrie)', 'Logo (placement, taille, symétrie)', 84, false),
  (18, 'logo_placement', 'Logo placement', 'Placement du logo', 31, false),
  (19, 'materials', 'Materiaux', 'Matériaux', 31, false),
  (20, 'materials', 'Materiaux (cuir, mesh, daim)', 'Matériaux (cuir, mesh, daim)', 84, false),
  (21, 'neck_label', 'Etiquette col', 'Étiquette de col', 28, false),
  (22, 'neck_label', 'Etiquette col (marque, taille, composition)', 'Étiquette de col (marque, taille, composition)', 98, false),
  (23, 'packaging', 'Emballage (dust bag, boite, certificat)', 'Emballage (dust bag, boîte, certificat)', 175, false),
  (24, 'packaging', 'Emballage et packaging', 'Emballage', 98, false),
  (25, 'print_embroidery', 'Print/Broderie', 'Imprimé et broderie', 28, false),
  (26, 'print_embroidery', 'Print/Broderie (qualite, alignement)', 'Imprimé et broderie (qualité, alignement)', 98, false),
  (27, 'product_code', 'Code produit interieur', 'Code produit intérieur', 84, false),
  (28, 'sole_pattern', 'Motif de la semelle', 'Semelle extérieure (motif)', 1, true),
  (29, 'sole_pattern', 'Motif semelle extérieure', 'Semelle extérieure (motif)', 1, true),
  (30, 'sole_pattern', 'Semelle', 'Semelle extérieure', 31, false),
  (31, 'sole_pattern', 'Semelle (motif, texture, logo)', 'Semelle extérieure (motif, texture, logo)', 84, false),
  (32, 'stitching', 'Coutures (regularite, couleur du fil, tension)', 'Coutures (régularité, couleur du fil, tension)', 175, false),
  (33, 'tags', 'Tags', 'Étiquettes volantes', 28, true),
  (34, 'tags', 'Tags et etiquettes volantes', 'Étiquettes volantes', 98, false),
  (35, 'tongue_label', 'Etiquette de langue (taille, code produit, pays)', 'Étiquette de taille (languette : taille, code produit, pays)', 84, false),
  (36, 'tongue_label', 'Etiquette langue', 'Étiquette de taille (languette)', 31, false),
  (37, 'tongue_label', 'Patch Nike + étiquette taille avec SKU cohérent (HJ8463-001)', 'Étiquette de taille et patch Nike (SKU cohérent : HJ8463-001)', 1, true),
  (38, 'tongue_label', 'Étiquette de languette', 'Étiquette de taille (languette)', 4, true),
  (39, 'tongue_tag', 'Étiquette Nike Air de la languette', 'Badge de languette (Nike Air)', 1, true),
  (40, 'tongue_tag', 'Étiquette de langue', 'Badge de languette', 3, true),
  (41, 'tongue_tag', 'Étiquette de langue NB', 'Badge de languette (NB)', 1, true),
  (42, 'tongue_tag', 'Étiquette de langue Nike Air', 'Badge de languette (Nike Air)', 1, true),
  (43, 'tongue_tag', 'Étiquette de languette', 'Badge de languette', 3, true),
  (44, 'tongue_tag', 'Étiquette de languette (paragraphe net, centré, sans faute)', 'Badge de languette (paragraphe net, centré, sans faute)', 1, true),
  (45, 'wash_label', 'Etiquette de lavage', 'Étiquette d''entretien', 98, false),
  (46, 'zipper', 'Fermeture eclair (YKK/Lampo, fluidite)', 'Fermeture éclair (YKK/Lampo, fluidité)', 175, false)
),
listes (n, id) as (values
  ( 2, 'e889525e-f5f2-41d2-8ef1-8abbf5db36a4'::uuid), ( 3, '7c83ee59-3f09-481d-b10d-b7df61f3226b'::uuid),
  (28, '2493896c-fd12-4a4b-840e-33ad4279ef52'::uuid), (29, 'b772eebb-fb12-4591-b40e-ef75c1a28719'::uuid),
  (33, '0104836a-2e18-4ad8-b4cd-b6bf462bc2cd'::uuid), (33, '072ff902-9dd1-451e-96b7-ba5268d47f0d'::uuid),
  (33, '1a9c8307-b7f0-44d2-a3ba-3550e6d9b668'::uuid), (33, '2f829421-4576-4eee-ae8c-609b42950b46'::uuid),
  (33, '36bf299d-d39b-4d84-b01c-69c5efba84cd'::uuid), (33, '430a4e47-42a5-4143-b87c-d019e8dea7d5'::uuid),
  (33, '478af667-ce04-4774-aa6d-5a4427c28811'::uuid), (33, '55f36efc-f5e1-48fc-8b1b-5fa5c7c14a42'::uuid),
  (33, '5b556ebf-715c-45b2-9387-049d0a64a618'::uuid), (33, '670f31cc-b4dd-4a87-8973-0022094edd8f'::uuid),
  (33, '7377f678-acbc-4dc4-9be2-780ecebe0ec5'::uuid), (33, '79fb0a08-04c3-4c80-98a1-efd0e17896f4'::uuid),
  (33, '818055ed-3e6e-48a8-a45b-e29a3feb8229'::uuid), (33, '8278982c-3cbf-457b-b28f-2aef92c844d7'::uuid),
  (33, '8447cae2-3515-4fbb-b6f9-c3e40fc0c930'::uuid), (33, '8b1431f4-438b-4db3-94d9-6c7ab45cb536'::uuid),
  (33, '9d3be398-3245-4b5e-b40a-4b24bb3059c4'::uuid), (33, 'a3920bbd-69a1-4b3e-9891-8bec17a4c3d5'::uuid),
  (33, 'a68606c3-bfef-4c43-9489-8bacac036b79'::uuid), (33, 'a81fa359-f733-4477-aba5-de1331f3f3d0'::uuid),
  (33, 'b454c08b-daa9-4f60-a038-15afcf4bf166'::uuid), (33, 'c5abacf0-fbe7-461c-b46b-5819e39a47df'::uuid),
  (33, 'd31e42f6-70d4-4ce6-865e-ef203211c3a5'::uuid), (33, 'd94c24d1-f757-47d3-8e3d-dfefb32b3a1a'::uuid),
  (33, 'da03c1bd-9753-4286-8201-e36b2e2ecbf8'::uuid), (33, 'dc05da45-d7af-4b93-8e91-899b37638e52'::uuid),
  (33, 'e43ffcce-a1b2-4341-9ae5-5ca911bef059'::uuid), (33, 'f3737cac-2f66-4c08-b08a-cfa105840a5b'::uuid),
  (37, '1409f652-e22d-4b2f-b8de-6082d92988b1'::uuid), (38, '2cb54ed1-3481-4005-bacc-15835932f0be'::uuid),
  (38, '3acb9017-3827-44a9-a9ef-0816a931e217'::uuid), (38, '4f054073-97ea-4f19-afbb-19abbee48b61'::uuid),
  (38, 'ec9160c1-8c5f-4de4-ac0d-9f6e2ac34bc8'::uuid), (39, 'f39bcc6e-e20f-445d-8aa4-5ec240204edf'::uuid),
  (40, '2493896c-fd12-4a4b-840e-33ad4279ef52'::uuid), (40, 'acd520c0-aee1-49fd-b481-77dbf222c99d'::uuid),
  (40, 'db223881-394d-4f79-9d6e-bb7dbf35c113'::uuid), (41, 'b772eebb-fb12-4591-b40e-ef75c1a28719'::uuid),
  (42, 'de0eff69-8d02-49cc-a486-80ec8d2f0587'::uuid), (43, '733ca653-636c-41db-992f-21795b50b4ba'::uuid),
  (43, 'ce12af11-4765-47d3-99f8-8d4a53c8d97f'::uuid), (43, 'd7e3e987-0922-48ca-8d74-7aad32f0e439'::uuid),
  (44, '302aeaa6-ac01-465b-8a99-355f1b809396'::uuid)
),
deja (zone, libelle, id) as (values
  ('packaging', 'Emballage', '0104836a-2e18-4ad8-b4cd-b6bf462bc2cd'::uuid), ('packaging', 'Emballage', '072ff902-9dd1-451e-96b7-ba5268d47f0d'::uuid),
  ('packaging', 'Emballage', '1a9c8307-b7f0-44d2-a3ba-3550e6d9b668'::uuid), ('packaging', 'Emballage', '2f829421-4576-4eee-ae8c-609b42950b46'::uuid),
  ('packaging', 'Emballage', '36bf299d-d39b-4d84-b01c-69c5efba84cd'::uuid), ('packaging', 'Emballage', '430a4e47-42a5-4143-b87c-d019e8dea7d5'::uuid),
  ('packaging', 'Emballage', '478af667-ce04-4774-aa6d-5a4427c28811'::uuid), ('packaging', 'Emballage', '55f36efc-f5e1-48fc-8b1b-5fa5c7c14a42'::uuid),
  ('packaging', 'Emballage', '5b556ebf-715c-45b2-9387-049d0a64a618'::uuid), ('packaging', 'Emballage', '670f31cc-b4dd-4a87-8973-0022094edd8f'::uuid),
  ('packaging', 'Emballage', '7377f678-acbc-4dc4-9be2-780ecebe0ec5'::uuid), ('packaging', 'Emballage', '79fb0a08-04c3-4c80-98a1-efd0e17896f4'::uuid),
  ('packaging', 'Emballage', '818055ed-3e6e-48a8-a45b-e29a3feb8229'::uuid), ('packaging', 'Emballage', '8278982c-3cbf-457b-b28f-2aef92c844d7'::uuid),
  ('packaging', 'Emballage', '8447cae2-3515-4fbb-b6f9-c3e40fc0c930'::uuid), ('packaging', 'Emballage', '8b1431f4-438b-4db3-94d9-6c7ab45cb536'::uuid),
  ('packaging', 'Emballage', '9d3be398-3245-4b5e-b40a-4b24bb3059c4'::uuid), ('packaging', 'Emballage', 'a3920bbd-69a1-4b3e-9891-8bec17a4c3d5'::uuid),
  ('packaging', 'Emballage', 'a68606c3-bfef-4c43-9489-8bacac036b79'::uuid), ('packaging', 'Emballage', 'a81fa359-f733-4477-aba5-de1331f3f3d0'::uuid),
  ('packaging', 'Emballage', 'b454c08b-daa9-4f60-a038-15afcf4bf166'::uuid), ('packaging', 'Emballage', 'c5abacf0-fbe7-461c-b46b-5819e39a47df'::uuid),
  ('packaging', 'Emballage', 'd31e42f6-70d4-4ce6-865e-ef203211c3a5'::uuid), ('packaging', 'Emballage', 'd94c24d1-f757-47d3-8e3d-dfefb32b3a1a'::uuid),
  ('packaging', 'Emballage', 'da03c1bd-9753-4286-8201-e36b2e2ecbf8'::uuid), ('packaging', 'Emballage', 'dc05da45-d7af-4b93-8e91-899b37638e52'::uuid),
  ('packaging', 'Emballage', 'e43ffcce-a1b2-4341-9ae5-5ca911bef059'::uuid), ('packaging', 'Emballage', 'f3737cac-2f66-4c08-b08a-cfa105840a5b'::uuid)
),
places as (
  select c.zone, c.nouveau as libelle, l.id, c.n from corr c join listes l on l.n = c.n
  union all
  select d.zone, d.libelle, d.id, 0 from deja d
),
el as (
  select m.id, e.rang, e.point,
         case when f.bien_forme then e.point ->> 'zone' end as zone, case when f.bien_forme then e.point ->> 'label' end as libelle
  from public.models m
  cross join lateral jsonb_array_elements(case when jsonb_typeof(m.authentication_points) = 'array' then m.authentication_points else '[]'::jsonb end) with ordinality as e(point, rang)
  cross join lateral (select jsonb_typeof(e.point) = 'object' and jsonb_typeof(e.point -> 'zone') = 'string' and jsonb_typeof(e.point -> 'label') = 'string' as bien_forme) f
),
pts as (
  select e.id, e.zone, e.libelle, (select pl.n from places pl where pl.zone = e.zone and pl.libelle = e.libelle and pl.id = e.id) as inscrit
  from el e where e.zone is not null
),
attendu as (
  select l.zone, l.libelle, sum(l.depart)::int as depart, sum(l.applique)::int as applique
  from (
    select c.zone, c.ancien as libelle, c.points as depart, 0 as applique from corr c
    union all
    select c.zone, c.nouveau, 0, c.points from corr c
    union all
    select d.zone, d.libelle, 1, 1 from deja d
  ) l
  group by l.zone, l.libelle
),
positions as (
  select 'depart' as etat, c.zone, c.ancien as libelle, l.id, 1 as attendu from corr c join listes l on l.n = c.n
  union all
  select 'depart', d.zone, d.libelle, d.id, 1 from deja d
  union all
  select 'depart', c.zone, c.ancien, pl.id, 0 from corr c join places pl on pl.zone = c.zone and pl.libelle = c.nouveau where not c.liste
  union all
  select 'applique', pl.zone, pl.libelle, pl.id, 1 from places pl
),
mesure as (
  select a.zone, a.libelle, a.depart, a.applique, coalesce(t.n, 0) as trouves,
         coalesce(e.mal_depart, 0) as mal_depart, e.ex_depart, coalesce(e.mal_applique, 0) as mal_applique, e.ex_applique,
         coalesce(t.n, 0) = a.depart and coalesce(e.mal_depart, 0) = 0 as ok_depart,
         coalesce(t.n, 0) = a.applique and coalesce(e.mal_applique, 0) = 0 as ok_applique
  from attendu a
  left join (select p.zone, p.libelle, count(*)::int as n from pts p group by p.zone, p.libelle) t
         on t.zone = a.zone and t.libelle = a.libelle
  left join (
    select o.zone, o.libelle,
           (count(*) filter (where o.etat = 'depart'))::int as mal_depart,
           (count(*) filter (where o.etat = 'applique'))::int as mal_applique,
           array_to_string((array_agg(o.exemple order by o.id) filter (where o.etat = 'depart'))[1:3], ', ') as ex_depart,
           array_to_string((array_agg(o.exemple order by o.id) filter (where o.etat = 'applique'))[1:3], ', ') as ex_applique
    from (
      select o.etat, o.zone, o.libelle, o.id, format('%s : %s point(s) au lieu de %s', o.id, coalesce(k.n, 0), o.attendu) as exemple
      from positions o
      left join (select p.zone, p.libelle, p.id, count(*)::int as n from pts p group by p.zone, p.libelle, p.id) k
             on k.zone = o.zone and k.libelle = o.libelle and k.id = o.id
      where coalesce(k.n, 0) <> o.attendu
    ) o
    group by o.zone, o.libelle
  ) e on e.zone = a.zone and e.libelle = a.libelle
),
etat as (
  select coalesce(bool_and(j.ok_depart), false) as au_depart, coalesce(bool_and(j.ok_applique), false) as applique,
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.depart,
               case when j.mal_depart = 0 then ''
                    else format(' ; %s modèle(s) listé(s) en écart (%s%s)', j.mal_depart, j.ex_depart, case when j.mal_depart > 3 then ', …' else '' end) end), ' | ' order by j.zone, j.libelle)
           filter (where not j.ok_depart) as ecarts_depart,
         count(*) filter (where not j.ok_depart) as nb_depart, count(*)::int as suivis
  from mesure j
),
comptes as (
  select c.n, c.points,
         (select count(*) from pts p where p.zone = c.zone and p.libelle = c.ancien) as trouves,
         case when c.liste
              then (select coalesce(array_agg(p.id order by p.id), '{}'::uuid[]) from pts p where p.zone = c.zone and p.libelle = c.ancien)
                   = (select coalesce(array_agg(l.id order by l.id), '{}'::uuid[]) from listes l where l.n = c.n)
              else true end as liste_exacte
  from corr c
),
deja_listes as (
  select g.zone, g.libelle,
         g.ids = (select coalesce(array_agg(p.id order by p.id), '{}'::uuid[]) from pts p where p.zone = g.zone and p.libelle = g.libelle) as liste_exacte
  from (select d.zone, d.libelle, array_agg(d.id order by d.id) as ids from deja d group by d.zone, d.libelle) g
),
aller as (
  select e.id, e.rang, e.zone, coalesce(c.nouveau, e.libelle) as libelle, c.n is not null as change,
         case when c.n is null then e.point else jsonb_set(e.point, '{label}', to_jsonb(c.nouveau)) end as point
  from el e left join corr c on c.zone = e.zone and c.ancien = e.libelle
),
retour as (
  select p.id, p.rang, p.change as change_aller, p.point as point_aller, c.n is not null as change_retour,
         case when c.n is null then p.point else jsonb_set(p.point, '{label}', to_jsonb(c.ancien)) end as point_retour
  from (select a.*, (select pl.n from places pl where pl.zone = a.zone and pl.libelle = a.libelle and pl.id = a.id) as inscrit from aller a) p
  left join corr c on c.zone = p.zone and c.nouveau = p.libelle and case when p.inscrit is null then not c.liste else c.n = p.inscrit end
),
simule as (
  select m.id, m.authentication_points as origine,
         case when x.change_aller then x.tableau_aller else m.authentication_points end as apres_aller,
         case when x.change_retour then x.tableau_retour when x.change_aller then x.tableau_aller else m.authentication_points end as apres_retour
  from public.models m
  left join (
    select r.id, bool_or(r.change_aller) as change_aller, bool_or(r.change_retour) as change_retour,
           jsonb_agg(r.point_aller order by r.rang) as tableau_aller, jsonb_agg(r.point_retour order by r.rang) as tableau_retour
    from retour r group by r.id
  ) x on x.id = m.id
),
decompte as (
  select m.id, case when not m.is_active then 'desactive'
                     when b.category = 'watch' then 'montre'
                     when not (jsonb_typeof(m.authentication_points) = 'array' and jsonb_array_length(m.authentication_points) > 0) then 'sans_point'
                     when b.is_active then 'analysable'
                     else 'hors_decompte' end as groupe,
         exists (select 1 from pts p join corr c on c.zone = p.zone and c.ancien = p.libelle where p.id = m.id) as a_modifier
  from public.models m left join public.brands b on b.id = m.brand_id
)
select (select count(*) from corr) as corrections,
       (select sum(c.points) from corr c) as points_au_releve,
       (select coalesce(sum(k.trouves), 0) from comptes k) as a_corriger,
       (select count(*) from decompte d where d.a_modifier) as modeles_a_modifier,
       (select count(*) from decompte d where d.a_modifier and d.groupe = 'analysable') as modeles_a_modifier_analysables,
       (select count(*) from decompte d where d.a_modifier and d.groupe = 'desactive') as modeles_a_modifier_desactives,
       (select count(*) from public.models) as lignes_de_la_table,
       (select count(*) from decompte d where d.groupe = 'analysable') as modeles_analysables,
       (select count(*) from decompte d where d.groupe = 'desactive') as modeles_desactives,
       (select count(*) from decompte d where d.groupe = 'montre') as montres,
       (select count(*) from decompte d where d.groupe = 'sans_point') as modeles_actifs_sans_point,
       (select count(*) from decompte d where d.groupe = 'hors_decompte') as modeles_hors_decompte,
       (select count(*) from comptes k where k.trouves <> k.points) as corrections_au_mauvais_compte,
       (select count(*) from comptes k where not k.liste_exacte) + (select count(*) from deja_listes g where not g.liste_exacte) as listes_fausses,
       (select count(*) from pts p join corr c on c.zone = p.zone and c.ancien = p.libelle and not c.liste
          join places pl on pl.zone = c.zone and pl.libelle = c.nouveau and pl.id = p.id) as points_sans_liste_sur_modele_liste,
       (select count(*) from pts p where exists (select 1 from corr c where c.zone = p.zone and c.nouveau = p.libelle)
          and not exists (select 1 from deja d where d.zone = p.zone and d.libelle = p.libelle and d.id = p.id)) as nouveaux_deja_portes_hors_deja_la,
       (select count(*) from simule s where s.apres_retour::text is distinct from s.origine::text) as aller_retour_modeles_differents,
       (select count(*) from simule s where s.apres_aller::text is distinct from s.origine::text) as aller_modeles_modifies,
       (select count(distinct d.id) from (select e.id from el e where e.libelle is not null group by e.id, e.libelle having count(*) > 1) d) as modeles_libelle_en_double_avant,
       (select count(distinct d.id) from (select a.id from aller a where a.libelle is not null group by a.id, a.libelle having count(*) > 1) d) as modeles_libelle_en_double_apres_aller,
       (select count(*) from (select p.id from pts p group by p.id, p.zone having count(*) > 1) d) as modeles_zone_en_double,
       (select count(*) from pts p where p.zone in ('tongue_label', 'tongue_tag', 'box_label', 'sole_pattern')
          and not exists (select 1 from corr c where c.zone = p.zone and p.libelle in (c.ancien, c.nouveau))) as points_des_4_zones_hors_table,
       (select count(*) from pts p join corr c on c.zone = p.zone and c.ancien = p.libelle
          join public.models m on m.id = p.id where not m.is_active) as points_corriges_sur_modeles_inactifs,
       (select count(*) from el e where jsonb_typeof(e.point) = 'object' and jsonb_typeof(e.point -> 'label') = 'string' and exists (select 1 from corr c where c.ancien = e.point ->> 'label') and not exists (select 1 from corr c where jsonb_typeof(e.point -> 'zone') = 'string' and c.zone = e.point ->> 'zone' and c.ancien = e.point ->> 'label')) as anciens_libelles_hors_table,
       (select count(*) from el e where e.zone is null) as elements_mal_formes,
       (select count(*) from public.models m where jsonb_typeof(m.authentication_points) is distinct from 'array') as tableaux_mal_formes,
       (select case when e.au_depart then 'PRÊT' when e.applique then 'DÉJÀ APPLIQUÉ'
                    else format('ÉCARTS avec l''état de départ (%s libellé(s) sur %s) : %s', e.nb_depart, e.suivis, e.ecarts_depart) end from etat e) as verdict_etape_1,
       (select md5(string_agg(m.id::text || md5(m.authentication_points::text), ',' order by m.id)) from public.models m) as empreinte_libelles,
       (select md5(string_agg(m.id::text || md5(case when set_config('TimeZone', 'UTC', true) is not null then (to_jsonb(m) - 'authentication_points')::text end), ',' order by m.id)) from public.models m) as empreinte_autres_colonnes,
       (select md5(coalesce(string_agg(format('%s|%s|%s', p.id, p.zone, p.libelle), E'\n' order by p.id, p.zone collate "C", p.libelle collate "C"), '')) from pts p where exists (select 1 from attendu a where a.zone = p.zone and a.libelle = p.libelle)) as empreinte_points_suivis,
       (select md5(string_agg(s.id::text || md5(s.apres_aller::text), ',' order by s.id)) from simule s) as empreinte_libelles_prevue_apres_aller,
       (select md5(coalesce(string_agg(format('%s|%s|%s', p.id, p.zone, p.libelle), E'\n' order by p.id, p.zone collate "C", p.libelle collate "C"), '')) from (select a.id, a.zone, a.libelle from aller a where a.zone is not null) p where exists (select 1 from attendu a where a.zone = p.zone and a.libelle = p.libelle)) as empreinte_points_suivis_prevue_apres_aller;
