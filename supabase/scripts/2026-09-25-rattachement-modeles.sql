-- ============================================================================
-- LegitVision — rattachement des modèles rangés dans la mauvaise catégorie
-- Préparé le 2026-09-25 d'après la base de production (lecture seule).
--
-- TROIS ÉTAPES, À LANCER UNE PAR UNE dans l'éditeur SQL de Supabase (il
-- n'affiche que le résultat de la dernière instruction exécutée) :
--   ÉTAPE 1 — aperçu AVANT (lecture seule)
--   ÉTAPE 2 — la modification : UN seul bloc atomique. Chaque sous-étape
--             vérifie le nombre exact de lignes touchées ; au moindre écart,
--             une exception annule TOUT et rien n'est écrit.
--   ÉTAPE 3 — aperçu APRÈS (lecture seule)
--
-- Ce que fait l'étape 2 (A, B et C, décision d'Hector du 2026-09-25) :
--   A0. 36 jumeaux sans point : slug suffixé « -sans-point ». Sans cela, le
--       rattachement violerait la contrainte UNIQUE (brand_id, slug) — 20 jumeaux
--       portent le même slug que le modèle qui arrive. Aucun code ne lit ces slugs.
--   A1. 35 de ces jumeaux désactivés (is_active = false ; rien n'est supprimé).
--       Exclu : le jumeau de « Dior B30 », référencé par une analyse existante —
--       /check/[id] et le tableau de bord joignent le modèle sous la RLS « actifs » :
--       le désactiver ferait disparaître ce rapport. Il reste actif, et invisible
--       dans la sélection (aucun point).
--   A2. 43 modèles rattachés à la ligne de leur vraie catégorie (même marque).
--   A3. 12 protocoles photo : ces lignes (créées le 2026-04-14) n'avaient AUCUNE
--       photo obligatoire, donc /check/new laissait lancer une analyse sans les
--       photos prévues. Deviennent obligatoires, comme sur les lignes de
--       référence : toutes sauf box_label (sneakers) et tags_packaging (vêtements).
--   B. Crée les lignes vêtements Nike, adidas et Prada (protocole photo des
--      vêtements, celui de Gucci corrigé en A3) et y rattache 9 modèles (4 Nike,
--      3 adidas, 2 Prada) : un vêtement analysé avec le protocole sneakers
--      donne une analyse faussée.
--   C. Désactive « Prada Re-Nylon Bag Pack » : un sac à dos porteur de points de
--      VÊTEMENT (col, étiquette de lavage). On ne propose pas un modèle dont les
--      points sont faux ; le déplacer ne le corrigerait pas.
-- ============================================================================


-- ═══ ÉTAPE 1 — APERÇU AVANT (lecture seule) ═════════════════════════════════
select b.name as marque, b.category as categorie,
       count(m.id) filter (where m.is_active and m.authentication_points <> '[]'::jsonb) as analysables,
       count(m.id) filter (where m.is_active and m.authentication_points = '[]'::jsonb) as actifs_sans_point,
       (select count(*) from jsonb_array_elements(b.photo_protocol) s where (s->>'required')::boolean) as photos_obligatoires,
       jsonb_array_length(b.photo_protocol) as photos_prevues
from public.brands b left join public.models m on m.brand_id = b.id
where b.is_active and b.name in ('Balenciaga', 'Bottega Veneta', 'Chanel', 'Dior', 'Gucci', 'Hermès', 'Louis Vuitton', 'Prada', 'Nike', 'adidas')
group by b.id, b.name, b.category, b.photo_protocol
order by b.name, b.category;


-- ═══ ÉTAPE 2 — MODIFICATION (un seul bloc atomique) ═════════════════════════
begin;
do $$
declare
  n int;
  nike uuid; adidas uuid; prada uuid; protocole jsonb;
begin
  -- A0. Libérer les slugs des jumeaux sans point
  update public.models m set slug = m.slug || '-sans-point'
  where m.id in (
    'b1065fae-a940-4362-867d-1e59852d5998', -- Balenciaga « Speed T-Shirt » (clothing)
    '4c18acf7-f854-4614-bbc9-225ba1f237ec', -- Balenciaga « Logo Hoodie » (clothing)
    '5f0595e2-433a-47cc-83b8-44e963122a63', -- Balenciaga « Track Jacket » (clothing)
    '36c160ca-1dca-417a-976e-638f1f1bd135', -- Balenciaga « WFP Jacket » (clothing)
    '284ecc7c-07ee-49a0-b3c7-bdb221c2b5b2', -- Balenciaga « Puffer Jacket » (clothing)
    'fa0992e7-7770-4b34-ad55-7a43e5ed8a0d', -- Louis Vuitton « Monogram T-Shirt » (clothing)
    '7d634cd9-dbec-424d-8dc1-8cbbeb82c846', -- Louis Vuitton « Hoodie » (clothing)
    'f4c4f836-152d-4e1c-bf68-684901f37455', -- Louis Vuitton « Jacket » (clothing)
    'c6bc4751-d95a-4b0e-8bc8-14b5b3c5f58c', -- Louis Vuitton « Track Pant » (clothing)
    'ffa17a90-1283-4a9c-9429-7d16faa1f15b', -- Gucci « Logo T-Shirt » (clothing)
    'eaf1a456-011a-4c05-8b9a-2a42a9feda2f', -- Gucci « Hoodie » (clothing)
    'e774eb72-0ca1-4077-b3fc-4700c466f416', -- Gucci « Jacket » (clothing)
    'de0f6417-8b7d-4e8f-9fee-f20041ca5833', -- Gucci « Track Pant » (clothing)
    'b7b4152e-f547-4cfa-ba68-1d202576a37b', -- Dior « Bee T-Shirt » (clothing)
    '5adfa1e8-bbf0-49c2-b14d-ab2f5a7744a6', -- Dior « Oblique Jacket » (clothing)
    'a625517f-e6f3-42a0-b8a9-e332161074b6', -- Dior « Saddle Hoodie » (clothing)
    '3272a52c-8566-4c5c-b1af-b8e348806664', -- Dior « Track Jacket » (clothing)
    '7a863a5f-c167-40bb-b883-19f8edb7a1d7', -- Hermès « Bouncing » (sneakers)
    'eabb316e-fb85-4db1-bf64-f82cd8f558b5', -- Hermès « Trail » (sneakers)
    'e7b84b2a-8cd6-463f-ba48-6509d6040e6e', -- Louis Vuitton « LV Trainer » (sneakers)
    'ae3f3776-829c-4e14-9915-c081f2af27c9', -- Louis Vuitton « LV Skate » (sneakers)
    'b6982a48-b005-43f5-81a8-76c223371365', -- Louis Vuitton « LV Archlight » (sneakers)
    '877df367-b632-4f2a-8bcd-760846223b15', -- Bottega Veneta « Orbit » (sneakers)
    '2d5a4a34-bcbb-42cf-a1f8-d0a4ce75e62c', -- Prada « Cloudbust » (sneakers)
    '5ec2622e-72cc-4ce2-8815-d7807109e1c7', -- Prada « America''s Cup » (sneakers)
    '7365360f-fab9-442f-bbc1-99114b2f5847', -- Prada « Downtown » (sneakers)
    '44327c16-82b7-4ae3-bdfc-c5f5826c9894', -- Gucci « Rhyton » (sneakers)
    '8d62ec5b-acf3-4435-914a-54b2c4532c85', -- Gucci « Ace » (sneakers)
    '94954ffa-7a73-45c6-900a-8d17cd7d582c', -- Gucci « Screener » (sneakers)
    '2a8dd767-ce64-4590-af0b-74b7933a09b4', -- Gucci « Run » (sneakers)
    'af6bb48f-d069-4ef4-be25-d42c15283d55', -- Chanel « Trainer » (sneakers)
    '98b139d7-31a2-4749-a989-fac69cdd10cb', -- Chanel « CC Low-Top » (sneakers)
    '04519f6a-6794-4072-a196-2d795de931ca', -- Dior « B22 » (sneakers)
    '08bde844-b829-4805-bce6-d6bab787b9b9', -- Dior « B23 » (sneakers)
    '8c1c625f-0e5a-44a7-9861-201293237418', -- Dior « B27 » (sneakers)
    '894b8a35-ce58-44ab-a422-32ae96724459'  -- Dior « B30 » (sneakers)
  )
  and m.authentication_points = '[]'::jsonb and m.slug not like '%-sans-point';
  get diagnostics n = row_count;
  if n <> 36 then raise exception 'A0 : % slugs renommés au lieu de 36 — rien n''est écrit', n; end if;

  -- A1. Désactiver les jumeaux jamais référencés par une analyse
  update public.models m set is_active = false
  where m.id in (
    'b1065fae-a940-4362-867d-1e59852d5998', -- Balenciaga « Speed T-Shirt »
    '4c18acf7-f854-4614-bbc9-225ba1f237ec', -- Balenciaga « Logo Hoodie »
    '5f0595e2-433a-47cc-83b8-44e963122a63', -- Balenciaga « Track Jacket »
    '36c160ca-1dca-417a-976e-638f1f1bd135', -- Balenciaga « WFP Jacket »
    '284ecc7c-07ee-49a0-b3c7-bdb221c2b5b2', -- Balenciaga « Puffer Jacket »
    'fa0992e7-7770-4b34-ad55-7a43e5ed8a0d', -- Louis Vuitton « Monogram T-Shirt »
    '7d634cd9-dbec-424d-8dc1-8cbbeb82c846', -- Louis Vuitton « Hoodie »
    'f4c4f836-152d-4e1c-bf68-684901f37455', -- Louis Vuitton « Jacket »
    'c6bc4751-d95a-4b0e-8bc8-14b5b3c5f58c', -- Louis Vuitton « Track Pant »
    'ffa17a90-1283-4a9c-9429-7d16faa1f15b', -- Gucci « Logo T-Shirt »
    'eaf1a456-011a-4c05-8b9a-2a42a9feda2f', -- Gucci « Hoodie »
    'e774eb72-0ca1-4077-b3fc-4700c466f416', -- Gucci « Jacket »
    'de0f6417-8b7d-4e8f-9fee-f20041ca5833', -- Gucci « Track Pant »
    'b7b4152e-f547-4cfa-ba68-1d202576a37b', -- Dior « Bee T-Shirt »
    '5adfa1e8-bbf0-49c2-b14d-ab2f5a7744a6', -- Dior « Oblique Jacket »
    'a625517f-e6f3-42a0-b8a9-e332161074b6', -- Dior « Saddle Hoodie »
    '3272a52c-8566-4c5c-b1af-b8e348806664', -- Dior « Track Jacket »
    '7a863a5f-c167-40bb-b883-19f8edb7a1d7', -- Hermès « Bouncing »
    'eabb316e-fb85-4db1-bf64-f82cd8f558b5', -- Hermès « Trail »
    'e7b84b2a-8cd6-463f-ba48-6509d6040e6e', -- Louis Vuitton « LV Trainer »
    'ae3f3776-829c-4e14-9915-c081f2af27c9', -- Louis Vuitton « LV Skate »
    'b6982a48-b005-43f5-81a8-76c223371365', -- Louis Vuitton « LV Archlight »
    '877df367-b632-4f2a-8bcd-760846223b15', -- Bottega Veneta « Orbit »
    '2d5a4a34-bcbb-42cf-a1f8-d0a4ce75e62c', -- Prada « Cloudbust »
    '5ec2622e-72cc-4ce2-8815-d7807109e1c7', -- Prada « America''s Cup »
    '7365360f-fab9-442f-bbc1-99114b2f5847', -- Prada « Downtown »
    '44327c16-82b7-4ae3-bdfc-c5f5826c9894', -- Gucci « Rhyton »
    '8d62ec5b-acf3-4435-914a-54b2c4532c85', -- Gucci « Ace »
    '94954ffa-7a73-45c6-900a-8d17cd7d582c', -- Gucci « Screener »
    '2a8dd767-ce64-4590-af0b-74b7933a09b4', -- Gucci « Run »
    'af6bb48f-d069-4ef4-be25-d42c15283d55', -- Chanel « Trainer »
    '98b139d7-31a2-4749-a989-fac69cdd10cb', -- Chanel « CC Low-Top »
    '04519f6a-6794-4072-a196-2d795de931ca', -- Dior « B22 »
    '08bde844-b829-4805-bce6-d6bab787b9b9', -- Dior « B23 »
    '8c1c625f-0e5a-44a7-9861-201293237418'  -- Dior « B27 »
  )
  and m.authentication_points = '[]'::jsonb and m.is_active
  and not exists (select 1 from public.analyses a where a.model_id = m.id);
  get diagnostics n = row_count;
  if n <> 35 then raise exception 'A1 : % jumeaux désactivés au lieu de 35 — rien n''est écrit', n; end if;

  -- A2. Rattacher (la ligne de départ est vérifiée)
  update public.models m set brand_id = v.vers
  from (values
    ('9cc49b07-b10d-44ba-b4b9-5f47dcc0029e'::uuid, 'ef71235c-0820-4d26-b6ab-cfdb7c44aac8'::uuid, '283d9f76-921f-44a1-8ef9-0fb90416e3dc'::uuid), -- Balenciaga « Balenciaga Speed T-Shirt » : bag → clothing
    ('c8cba0ad-fd39-48a7-896a-66ba43c6d9b0'::uuid, 'ef71235c-0820-4d26-b6ab-cfdb7c44aac8'::uuid, '283d9f76-921f-44a1-8ef9-0fb90416e3dc'::uuid), -- Balenciaga « Balenciaga Logo Hoodie » : bag → clothing
    ('dae99776-b642-4d6a-a968-547dcb1b62b9'::uuid, 'ef71235c-0820-4d26-b6ab-cfdb7c44aac8'::uuid, '283d9f76-921f-44a1-8ef9-0fb90416e3dc'::uuid), -- Balenciaga « Triple S T-Shirt » : bag → clothing
    ('928d1a25-2ebc-405f-a0bb-dbc5e40306e7'::uuid, 'ef71235c-0820-4d26-b6ab-cfdb7c44aac8'::uuid, '283d9f76-921f-44a1-8ef9-0fb90416e3dc'::uuid), -- Balenciaga « Balenciaga Track Jacket » : bag → clothing
    ('460b90bd-a107-4cdc-81dc-ff8b3fe40a9e'::uuid, 'ef71235c-0820-4d26-b6ab-cfdb7c44aac8'::uuid, '283d9f76-921f-44a1-8ef9-0fb90416e3dc'::uuid), -- Balenciaga « Tape Logo Tee » : bag → clothing
    ('bfccfd1e-d409-4385-89ac-39c63849ad09'::uuid, 'ef71235c-0820-4d26-b6ab-cfdb7c44aac8'::uuid, '283d9f76-921f-44a1-8ef9-0fb90416e3dc'::uuid), -- Balenciaga « WFP Jacket » : bag → clothing
    ('d8c1ae08-7aae-4e27-8323-131ac72a0f04'::uuid, 'ef71235c-0820-4d26-b6ab-cfdb7c44aac8'::uuid, '283d9f76-921f-44a1-8ef9-0fb90416e3dc'::uuid), -- Balenciaga « Balenciaga Puffer Jacket » : bag → clothing
    ('535f1dc7-2b67-4000-8ecd-8deae88f919b'::uuid, '49d63b2f-09f5-4e01-b2bc-18effc28ec2e'::uuid, '715b5b34-47b8-47f8-b444-2f6ae4c7598e'::uuid), -- Louis Vuitton « LV Monogram T-Shirt » : bag → clothing
    ('074648f7-e86a-47d1-ab29-cca83603b25d'::uuid, '49d63b2f-09f5-4e01-b2bc-18effc28ec2e'::uuid, '715b5b34-47b8-47f8-b444-2f6ae4c7598e'::uuid), -- Louis Vuitton « LV Hoodie » : bag → clothing
    ('f4e20539-e439-41f3-a735-465e082423d2'::uuid, '49d63b2f-09f5-4e01-b2bc-18effc28ec2e'::uuid, '715b5b34-47b8-47f8-b444-2f6ae4c7598e'::uuid), -- Louis Vuitton « LV Jacket » : bag → clothing
    ('ed33ab69-432a-455e-9318-ebf7fd0c6a62'::uuid, '49d63b2f-09f5-4e01-b2bc-18effc28ec2e'::uuid, '715b5b34-47b8-47f8-b444-2f6ae4c7598e'::uuid), -- Louis Vuitton « LV Track Pant » : bag → clothing
    ('59cda18d-fac6-451a-8ea8-211fd6ce9cfd'::uuid, '49d63b2f-09f5-4e01-b2bc-18effc28ec2e'::uuid, '715b5b34-47b8-47f8-b444-2f6ae4c7598e'::uuid), -- Louis Vuitton « Virgil Abloh FW21 » : bag → clothing
    ('631cce9d-4467-4824-9765-db5cc2d0ec58'::uuid, '6ce5bd7b-5fdc-4e85-a034-99e57885b4b8'::uuid, '6960eced-7a80-40e4-90e8-cc734bd1e005'::uuid), -- Gucci « Gucci Logo T-Shirt » : bag → clothing
    ('e9588b4e-1dda-42d8-893f-62bdb8d21c8a'::uuid, '6ce5bd7b-5fdc-4e85-a034-99e57885b4b8'::uuid, '6960eced-7a80-40e4-90e8-cc734bd1e005'::uuid), -- Gucci « Gucci Hoodie » : bag → clothing
    ('886ac775-d164-4244-b657-ba8e22683bdc'::uuid, '6ce5bd7b-5fdc-4e85-a034-99e57885b4b8'::uuid, '6960eced-7a80-40e4-90e8-cc734bd1e005'::uuid), -- Gucci « Gucci Jacket » : bag → clothing
    ('43e05553-80c9-4687-8ebd-6c87b592c2ee'::uuid, '6ce5bd7b-5fdc-4e85-a034-99e57885b4b8'::uuid, '6960eced-7a80-40e4-90e8-cc734bd1e005'::uuid), -- Gucci « Gucci Track Pant » : bag → clothing
    ('278dd6ab-098c-4f2c-857b-730fbd54a772'::uuid, '6ce5bd7b-5fdc-4e85-a034-99e57885b4b8'::uuid, '6960eced-7a80-40e4-90e8-cc734bd1e005'::uuid), -- Gucci « Gucci Jumper » : bag → clothing
    ('62f9fa16-399f-4d81-ba10-8fe61b6ca70c'::uuid, 'd8de27a2-1727-4697-a736-9755f319e054'::uuid, '19784378-7cea-4a4f-a95d-234c2a0c7488'::uuid), -- Dior « Dior Bee T-Shirt » : bag → clothing
    ('bbc87d42-b56f-4cbd-97f4-457689f4fd77'::uuid, 'd8de27a2-1727-4697-a736-9755f319e054'::uuid, '19784378-7cea-4a4f-a95d-234c2a0c7488'::uuid), -- Dior « Dior Oblique Jacket » : bag → clothing
    ('832ab0d4-a978-4c4d-bff4-e7568533a749'::uuid, 'd8de27a2-1727-4697-a736-9755f319e054'::uuid, '19784378-7cea-4a4f-a95d-234c2a0c7488'::uuid), -- Dior « Dior Saddle Hoodie » : bag → clothing
    ('7ef023c2-bbb7-44dd-aa99-279068827773'::uuid, 'd8de27a2-1727-4697-a736-9755f319e054'::uuid, '19784378-7cea-4a4f-a95d-234c2a0c7488'::uuid), -- Dior « Dior Track Jacket » : bag → clothing
    ('24d47539-9c7f-4b50-8325-ef2412b00492'::uuid, '033587de-d349-42b3-b1ab-07f604e28555'::uuid, 'd841a739-ef52-43a9-b43f-d2013dea958a'::uuid), -- Hermès « Bouncing » : bag → sneakers
    ('b9f248ce-68bf-4fde-9235-68dc8085ee40'::uuid, '033587de-d349-42b3-b1ab-07f604e28555'::uuid, 'd841a739-ef52-43a9-b43f-d2013dea958a'::uuid), -- Hermès « Trail » : bag → sneakers
    ('53b58d20-e5e8-4654-8a17-d1737a95452e'::uuid, '49d63b2f-09f5-4e01-b2bc-18effc28ec2e'::uuid, '6c4d6606-311f-4075-89f2-d745f2162aa3'::uuid), -- Louis Vuitton « LV Trainer » : bag → sneakers
    ('f15f8800-cf0c-43f1-a1e0-ccbea0c44c96'::uuid, '49d63b2f-09f5-4e01-b2bc-18effc28ec2e'::uuid, '6c4d6606-311f-4075-89f2-d745f2162aa3'::uuid), -- Louis Vuitton « LV Skate » : bag → sneakers
    ('1a68d4d4-76ec-4005-aaa0-b4cf8e3bcd68'::uuid, '49d63b2f-09f5-4e01-b2bc-18effc28ec2e'::uuid, '6c4d6606-311f-4075-89f2-d745f2162aa3'::uuid), -- Louis Vuitton « LV Archlight » : bag → sneakers
    ('d3beca06-9521-43d8-b9f0-aa8db0b7102a'::uuid, '9942bd66-dfad-44e4-b0c5-fd5ffd093ddc'::uuid, '54992e55-0494-407c-9043-5dc5a5a029b5'::uuid), -- Bottega Veneta « Orbit » : bag → sneakers
    ('c985fc71-3723-4f49-8834-2c83c8ad6aa9'::uuid, '9942bd66-dfad-44e4-b0c5-fd5ffd093ddc'::uuid, '54992e55-0494-407c-9043-5dc5a5a029b5'::uuid), -- Bottega Veneta « Puddle Boot » : bag → sneakers
    ('eff9dbc9-22a4-4519-aef8-d3d19c406923'::uuid, '523c8c01-e2be-4a05-bf41-eab08ee6b7f8'::uuid, 'cdd71719-d002-4f97-9023-6f325b8ecec3'::uuid), -- Prada « Cloudbust » : bag → sneakers
    ('317e26cb-206f-4743-b8cd-e919432a746d'::uuid, '523c8c01-e2be-4a05-bf41-eab08ee6b7f8'::uuid, 'cdd71719-d002-4f97-9023-6f325b8ecec3'::uuid), -- Prada « Americas Cup » : bag → sneakers
    ('1049c84a-e3a2-4cee-9ef6-a9ce5558c670'::uuid, '523c8c01-e2be-4a05-bf41-eab08ee6b7f8'::uuid, 'cdd71719-d002-4f97-9023-6f325b8ecec3'::uuid), -- Prada « Downtown » : bag → sneakers
    ('857b7ccc-3bd5-4f74-91b3-bd8574f08ad3'::uuid, '6ce5bd7b-5fdc-4e85-a034-99e57885b4b8'::uuid, '21219398-53ac-426f-bf62-c8aa89100232'::uuid), -- Gucci « Rhyton » : bag → sneakers
    ('2b1b9bf3-9c47-433d-b7a1-61c64378884a'::uuid, '6ce5bd7b-5fdc-4e85-a034-99e57885b4b8'::uuid, '21219398-53ac-426f-bf62-c8aa89100232'::uuid), -- Gucci « Ace » : bag → sneakers
    ('5af434f4-61e3-4e76-83b7-efa1b5a5363c'::uuid, '6ce5bd7b-5fdc-4e85-a034-99e57885b4b8'::uuid, '21219398-53ac-426f-bf62-c8aa89100232'::uuid), -- Gucci « Screener » : bag → sneakers
    ('66dc1adf-90b0-405a-9075-813e6e6a8990'::uuid, '6ce5bd7b-5fdc-4e85-a034-99e57885b4b8'::uuid, '21219398-53ac-426f-bf62-c8aa89100232'::uuid), -- Gucci « Run » : bag → sneakers
    ('d1e4eeca-b09b-4ae3-98df-bce774cfc5a9'::uuid, '2bd8387f-0933-4b62-b962-316384c4b184'::uuid, '6d654d6d-33be-4de6-8a23-6d85303e6599'::uuid), -- Chanel « Trainer » : bag → sneakers
    ('2225af91-5ffc-4bf9-928a-1df024fea8ba'::uuid, '2bd8387f-0933-4b62-b962-316384c4b184'::uuid, '6d654d6d-33be-4de6-8a23-6d85303e6599'::uuid), -- Chanel « CC Low-Top » : bag → sneakers
    ('e7e325e1-1e65-4604-9294-86be444fd4a3'::uuid, 'd8de27a2-1727-4697-a736-9755f319e054'::uuid, '5da68710-dcb7-487a-adf4-dc943a1199de'::uuid), -- Dior « B22 » : bag → sneakers
    ('84fe3606-7139-4d3c-9d9e-67550bee555a'::uuid, 'd8de27a2-1727-4697-a736-9755f319e054'::uuid, '5da68710-dcb7-487a-adf4-dc943a1199de'::uuid), -- Dior « B23 » : bag → sneakers
    ('e5651728-31ed-4db3-aede-c761825d3f25'::uuid, 'd8de27a2-1727-4697-a736-9755f319e054'::uuid, '5da68710-dcb7-487a-adf4-dc943a1199de'::uuid), -- Dior « B27 » : bag → sneakers
    ('f752d5f8-1f24-410d-a8a2-dcd48115a48d'::uuid, 'd8de27a2-1727-4697-a736-9755f319e054'::uuid, '5da68710-dcb7-487a-adf4-dc943a1199de'::uuid), -- Dior « B30 » : bag → sneakers
    ('55f36efc-f5e1-48fc-8b1b-5fa5c7c14a42'::uuid, 'd8de27a2-1727-4697-a736-9755f319e054'::uuid, '19784378-7cea-4a4f-a95d-234c2a0c7488'::uuid), -- Dior « Dior Oblique T-Shirt » : bag → clothing
    ('dc05da45-d7af-4b93-8e91-899b37638e52'::uuid, '6ce5bd7b-5fdc-4e85-a034-99e57885b4b8'::uuid, '6960eced-7a80-40e4-90e8-cc734bd1e005'::uuid)  -- Gucci « Gucci Logo Sweatshirt » : bag → clothing
  ) as v(id, de, vers)
  where m.id = v.id and m.brand_id = v.de and m.is_active;
  get diagnostics n = row_count;
  if n <> 43 then raise exception 'A2 : % modèles rattachés au lieu de 43 — rien n''est écrit', n; end if;

  -- A3. Photos obligatoires sur les 12 lignes du 2026-04-14
  update public.brands b set photo_protocol = (
    select jsonb_agg(s || jsonb_build_object('required', s->>'name' not in ('box_label', 'tags_packaging')) order by o)
    from jsonb_array_elements(b.photo_protocol) with ordinality as e(s, o)
  )
  where b.id in (
    '1d7b9f24-b556-442b-884b-d3008aea4105', -- Balenciaga / sneakers
    '6c4d6606-311f-4075-89f2-d745f2162aa3', -- Louis Vuitton / sneakers
    '5da68710-dcb7-487a-adf4-dc943a1199de', -- Dior / sneakers
    '21219398-53ac-426f-bf62-c8aa89100232', -- Gucci / sneakers
    'cdd71719-d002-4f97-9023-6f325b8ecec3', -- Prada / sneakers
    '6d654d6d-33be-4de6-8a23-6d85303e6599', -- Chanel / sneakers
    'd841a739-ef52-43a9-b43f-d2013dea958a', -- Hermès / sneakers
    '54992e55-0494-407c-9043-5dc5a5a029b5', -- Bottega Veneta / sneakers
    '283d9f76-921f-44a1-8ef9-0fb90416e3dc', -- Balenciaga / clothing
    '715b5b34-47b8-47f8-b444-2f6ae4c7598e', -- Louis Vuitton / clothing
    '19784378-7cea-4a4f-a95d-234c2a0c7488', -- Dior / clothing
    '6960eced-7a80-40e4-90e8-cc734bd1e005'  -- Gucci / clothing
  )
  and not exists (select 1 from jsonb_array_elements(b.photo_protocol) s where (s->>'required')::boolean);
  get diagnostics n = row_count;
  if n <> 12 then raise exception 'A3 : % protocoles corrigés au lieu de 12 — rien n''est écrit', n; end if;

  -- ── B : lignes vêtements Nike, adidas, Prada ────────────────────────────
  select photo_protocol into protocole from public.brands where id = '6960eced-7a80-40e4-90e8-cc734bd1e005'; -- Gucci / clothing, corrigé en A3
  insert into public.brands (name, slug, category, logo_url, photo_protocol, is_active)
    select name, 'nike-clothing', 'clothing', logo_url, protocole, true from public.brands where id = '29f9697b-58f3-4176-a9e5-0c25ef9967cc'
    returning id into nike;
  insert into public.brands (name, slug, category, logo_url, photo_protocol, is_active)
    select name, 'adidas-clothing', 'clothing', logo_url, protocole, true from public.brands where id = 'ce8fab65-7490-49e6-83b4-4bea42f42dbd'
    returning id into adidas;
  insert into public.brands (name, slug, category, logo_url, photo_protocol, is_active)
    select name, 'prada-clothing', 'clothing', logo_url, protocole, true from public.brands where id = '523c8c01-e2be-4a05-bf41-eab08ee6b7f8'
    returning id into prada;
  if nike is null or adidas is null or prada is null then
    raise exception 'B : ligne vêtements non créée — rien n''est écrit';
  end if;
  update public.models m set brand_id = v.vers
  from (values
    ('a81fa359-f733-4477-aba5-de1331f3f3d0'::uuid, '29f9697b-58f3-4176-a9e5-0c25ef9967cc'::uuid, nike), -- Nike « Tech Fleece Hoodie »
    ('36bf299d-d39b-4d84-b01c-69c5efba84cd'::uuid, '29f9697b-58f3-4176-a9e5-0c25ef9967cc'::uuid, nike), -- Nike « Tech Fleece Jogger »
    ('e43ffcce-a1b2-4341-9ae5-5ca911bef059'::uuid, '29f9697b-58f3-4176-a9e5-0c25ef9967cc'::uuid, nike), -- Nike « Windrunner Jacket »
    ('c5abacf0-fbe7-461c-b46b-5819e39a47df'::uuid, '29f9697b-58f3-4176-a9e5-0c25ef9967cc'::uuid, nike), -- Nike « NSW Club Fleece »
    ('1a9c8307-b7f0-44d2-a3ba-3550e6d9b668'::uuid, 'ce8fab65-7490-49e6-83b4-4bea42f42dbd'::uuid, adidas), -- adidas « Trefoil Track Jacket »
    ('7377f678-acbc-4dc4-9be2-780ecebe0ec5'::uuid, 'ce8fab65-7490-49e6-83b4-4bea42f42dbd'::uuid, adidas), -- adidas « Firebird Track Jacket »
    ('8447cae2-3515-4fbb-b6f9-c3e40fc0c930'::uuid, 'ce8fab65-7490-49e6-83b4-4bea42f42dbd'::uuid, adidas), -- adidas « Adicolor Crewneck »
    ('430a4e47-42a5-4143-b87c-d019e8dea7d5'::uuid, '523c8c01-e2be-4a05-bf41-eab08ee6b7f8'::uuid, prada), -- Prada « Prada Logo T-Shirt »
    ('670f31cc-b4dd-4a87-8973-0022094edd8f'::uuid, '523c8c01-e2be-4a05-bf41-eab08ee6b7f8'::uuid, prada)  -- Prada « Prada Nylon Jacket »
  ) as v(id, de, vers)
  where m.id = v.id and m.brand_id = v.de and m.is_active;
  get diagnostics n = row_count;
  if n <> 9 then raise exception 'B : % modèles rattachés au lieu de 9 — rien n''est écrit', n; end if;

  -- ── C : sac à dos porteur de points de vêtement ─────────────────────────
  update public.models m set is_active = false
  where m.id = 'a68606c3-bfef-4c43-9489-8bacac036b79' and m.is_active   -- Prada « Prada Re-Nylon Bag Pack » (bag)
    and not exists (select 1 from public.analyses a where a.model_id = m.id);
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'C : % modèle désactivé au lieu de 1 — rien n''est écrit', n; end if;
end $$;
commit;


-- ═══ ÉTAPE 3 — APERÇU APRÈS (lecture seule) ═════════════════════════════════
select b.name as marque, b.category as categorie,
       count(m.id) filter (where m.is_active and m.authentication_points <> '[]'::jsonb) as analysables,
       count(m.id) filter (where m.is_active and m.authentication_points = '[]'::jsonb) as actifs_sans_point,
       (select count(*) from jsonb_array_elements(b.photo_protocol) s where (s->>'required')::boolean) as photos_obligatoires,
       jsonb_array_length(b.photo_protocol) as photos_prevues
from public.brands b left join public.models m on m.brand_id = b.id
where b.is_active and b.name in ('Balenciaga', 'Bottega Veneta', 'Chanel', 'Dior', 'Gucci', 'Hermès', 'Louis Vuitton', 'Prada', 'Nike', 'adidas')
group by b.id, b.name, b.category, b.photo_protocol
order by b.name, b.category;
