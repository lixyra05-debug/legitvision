-- ============================================================================
-- LegitVision — RETOUR ARRIÈRE des libellés des points d'authentification
-- Défait exactement 2026-10-06-libelles-catalogue.sql. Préparé d'après le
-- relevé de production du 2026-10-06 (lecture seule).
-- Version 2 : 46 corrections, 2713 points. Elle ne défait que l'aller de la
-- même version ; l'aller du commit 5bed02b ne se défait que par le retour du
-- même commit.
--
-- EN BREF
--   À ne lancer que pour défaire 2026-10-06-libelles-catalogue.sql.
--   Sur le projet de production, dans l'éditeur SQL de Supabase. Lancer une
--   étape « seule » : sélectionner ses lignes, de son bandeau « ═══ ÉTAPE n »
--   jusqu'au bandeau suivant (ou la fin du fichier) ; le bouton « Run »
--   devient « Run selected ». Sans sélection, « Run » lance tout le fichier,
--   écriture comprise.
--   1. Lancer l'ÉTAPE 1 seule. Sa première ligne doit commencer par « PRÊT
--      POUR LE RETOUR : 2713 points à remettre ». Son empreinte des points
--      suivis (la dernière colonne) doit être celle notée à l'étape 3 de
--      l'aller : sinon, ne pas lancer l'étape 2.
--   2. Lancer l'ÉTAPE 2 seule (le bloc « do $$ … end $$; »). Elle n'affiche
--      aucune ligne (« Success. No rows returned ») : la preuve, c'est
--      l'étape 3.
--   3. Lancer l'ÉTAPE 3 seule. Sa première ligne doit commencer par « À
--      L'ÉTAT DE DÉPART : les anciens libellés des 46 corrections ». Son
--      empreinte des points suivis doit être celle notée à l'étape 1 de
--      l'aller.
--   4. Relancer ensuite « pnpm fiabilite verifier », avant la campagne de
--      mesure.
--   Si une première ligne ne commence pas comme indiqué ici : ne pas lancer
--   l'étape 2 et transmettre cette ligne (cas particuliers : voir « SI ÇA NE
--   SE PASSE PAS COMME PRÉVU »).
--   Jamais pendant la mesure des 60 paires.
--   D'après le relevé de production du 2026-10-06 (lecture seule) : 2713
--   points à remettre dans 437 modèles sur les 530 lignes de la table (436
--   des 474 modèles analysables qu'annonce le site, et 1 modèle désactivé).
--   Les 530 lignes de public.models, ce sont ces 474 modèles analysables
--   (modèle actif, marque active hors montres, au moins un point), 36 modèles
--   désactivés, 10 montres et 10 modèles actifs sans point : 474 + 36 + 10 +
--   10 = 530.
--
-- SI ÇA NE SE PASSE PAS COMME PRÉVU
--   Rien n'est abîmé : les étapes 1 et 3 ne font que lire, l'étape 2 écrit
--   tout ou rien. Si une première ligne commence autrement, ou si un message
--   d'erreur apparaît : ne pas lancer l'étape 2 (ni la relancer), et
--   transmettre le texte de cette première ligne ou le message d'erreur.
--   - « PAS REVENU » à l'étape 3 : rien n'a été écrit ; la ligne dit quoi
--     faire.
--   - Erreur « syntax error » ou « unterminated dollar-quoted string » : la
--     sélection était incomplète, rien n'a été lancé ; refaire la sélection
--     en entier.
--   - Erreur « canceling statement due to lock timeout » à l'étape 2 : la
--     table était occupée, rien n'est écrit ; relancer l'étape 2.
--   - Erreur « relation "public.models" does not exist » (ou « column
--     m.authentication_points does not exist ») : le projet ouvert n'a pas le
--     catalogue de LegitVision, ce n'est pas le bon projet. Rien n'y est
--     écrit ; ouvrir le bon projet et reprendre à l'étape 1.
--
-- CE QUE FAIT CE SCRIPT
--   Il défait les 46 corrections : il remet les anciens libellés de
--   public.models.authentication_points, fautes comprises : 2713 points, dans
--   437 modèles sur les 530 lignes de la table (436 des 474 modèles
--   analysables qu'annonce le site, et 1 modèle désactivé). Le script compte
--   les lignes de la table ; le nombre de modèles analysables vient du
--   relevé, il ne le recalcule pas (il ne lit pas public.brands). Après
--   « aller puis retour », si rien d'autre n'a changé entre les deux, chaque
--   ligne de public.models est identique à l'état de départ, à l'octet près.
--   Seule la clé « label » des points concernés change ; rien d'autre n'est
--   écrit, aucun objet permanent n'est créé.
--
-- POURQUOI
--   À n'utiliser que si les nouveaux libellés posent un problème. Le libellé
--   part dans la consigne envoyée à l'IA (lib/ai/authentication-prompts.ts).
--
-- ATTENTION — JAMAIS PENDANT LA CAMPAGNE DE MESURE
--   Revenir aux anciens libellés change la consigne de l'IA, comme l'aller.
--   L'outil de mesure (scripts/fiabilite, branche refonte/site) travaille sur
--   la copie du catalogue figée par « pnpm fiabilite verifier ». Un retour
--   lancé après ce « verifier » ne change donc pas la mesure, qui continue
--   avec les nouveaux libellés : c'est la production qui s'en écarte. La
--   mesure ne décrit alors plus ce que la production envoie à l'IA, et rien
--   ne le signale. Après un retour : relancer « verifier » avant tout
--   « lancer », et contrôler que l'heure « Catalogue figé le … » (UTC),
--   affichée par « verifier » et par « estimer », est postérieure à l'étape 3
--   de ce script.
--
-- QUAND CE RETOUR N'EST PLUS POSSIBLE
--   Il ne remet les anciens libellés que si les comptes sont ceux que l'aller
--   a laissés : chaque libellé des 46 corrections (ancien ou nouveau, dans sa
--   zone) a son nombre de points, et chaque modèle listé porte encore le
--   sien. Un seul point de plus ou de moins suffit à le bloquer : un modèle
--   créé avec un de ces libellés (le premier modèle créé avec les nouveaux
--   libellés, par exemple), un modèle concerné supprimé, un de ces libellés
--   retouché à la main. Ensuite l'étape 1 affiche « ÉCARTS » et l'étape 2
--   s'arrête sans rien écrire. Ne rien corriger à la main (l'étape 2 refuse
--   une liste modifiée) : transmettre la première ligne de l'étape 1. Ce
--   fichier ne sert alors plus tel quel : un retour adapté à l'état réel de
--   la base se prépare à part, comme un script neuf (nouveau relevé en
--   lecture seule, essais, relecture), à partir du générateur de ces deux
--   fichiers et de sa table, conservés dans
--   supabase/scripts/outils/2026-10-06-libelles/ (voir son LISEZ-MOI).
--   Le reste du catalogue peut bouger : un modèle créé sans aucun de ces
--   libellés, un modèle désactivé ou renommé, un autre libellé retouché ne
--   gênent pas le retour.
--   Limite : ce contrôle compte des points. Deux changements qui se
--   compensent (un point retiré d'un modèle non listé, le même ajouté à un
--   autre) ne se voient pas dans les comptes. L'empreinte des points suivis
--   les voit : à l'étape 1, elle doit être celle notée à l'étape 3 de
--   l'aller ; sinon, ne pas lancer l'étape 2, un point suivi a changé de
--   modèle ou de libellé depuis l'aller. Les deux autres empreintes ne le
--   disent pas : celle des libellés change aussi pour un modèle créé ou un
--   autre libellé retouché, qui ne gênent pas le retour. Si l'empreinte de
--   l'étape 3 de l'aller n'a pas été notée, le retour reste possible, mais
--   sans cette assurance : le signaler avant de lancer l'étape 2.
--   Autre blocage, que l'étape 1 ne voit pas : un déclencheur ou une colonne
--   calculée ajoutés à public.models après l'aller, s'ils changent une autre
--   colonne à chaque modification — une date de mise à jour, comme sur
--   analyses et profiles (au relevé du 2026-10-06, public.models n'a aucun
--   déclencheur). L'étape 1 affiche « PRÊT POUR LE RETOUR », puis l'étape 2
--   s'arrête sur « … modèles ont une autre colonne modifiée — tout est
--   annulé », en nommant la colonne et les déclencheurs actifs : rien n'est
--   écrit, l'étape 3 affiche « PAS REVENU ». Un déclencheur qui refuse
--   l'écriture (un garde, comme sur analyses et profiles) arrête l'étape 2 de
--   la même façon, avec son propre message. Ne pas relancer : faire adapter
--   le script.
--
-- COMMENT LE LANCER
--   TROIS ÉTAPES, À LANCER UNE PAR UNE dans l'éditeur SQL de Supabase. Il
--   affiche au plus un tableau par lancement : celui de la dernière
--   instruction qui a rendu des lignes, même si d'autres ont été exécutées
--   après elle. Une sélection trop longue, qui prend l'étape 1 ET l'étape 2,
--   exécute donc les deux et affiche quand même « PRÊT POUR LE RETOUR » : le
--   retour est pourtant fait. Avant chaque lancement, vérifier que la
--   sélection s'arrête avant le bandeau de l'étape suivante. Dans le doute,
--   relancer l'étape 1 seule : si elle dit « DÉJÀ REVENU », l'étape 2 est
--   passée.
--   ÉTAPE 1 — aperçu AVANT le retour (lecture seule). La ligne 0 donne le
--             verdict : « PRÊT POUR LE RETOUR » (lancer l'étape 2 si
--             l'empreinte des points suivis est celle notée à l'étape 3 de
--             l'aller), « DÉJÀ REVENU » (ne rien lancer) ou « ÉCARTS » suivi
--             de leur liste (ne pas lancer l'étape 2 ; si aucun libellé du
--             relevé n'est dans la base, le verdict le dit : vérifier le
--             projet ouvert). « PRÊT POUR LE RETOUR » compte les modèles à
--             remettre et toutes les lignes de la table, modèles désactivés
--             compris (voir EN BREF). Les lignes 1 à 46 : une par correction.
--             « points_au_releve » : ses points au relevé ; « a_remettre » :
--             ceux que le retour remettrait (autant avant l'étape 2, 0
--             après) ; « portent_l_ancien » : ceux qui portent l'ancien
--             libellé ; « modeles_vises » : où va la correction, d'après les
--             listes. Noter le verdict et les trois empreintes de la ligne 0.
--   ÉTAPE 2 — le retour : UNE seule instruction, atomique (le bloc
--             « do $$ … end $$; »). Une sélection qui en perd le début ou la
--             fin n'est qu'une erreur de syntaxe : rien n'est lancé. Au
--             moindre écart, avant ou après l'écriture, une exception annule
--             TOUT. Un succès sans message veut dire « remis » ou « déjà
--             revenu, rien écrit » : l'étape 3 ne les distingue pas (elle lit
--             l'état de la base, le même dans les deux cas). Ce qui les
--             distingue : le verdict de l'étape 1 lancée juste avant (« PRÊT
--             POUR LE RETOUR » : l'étape 2 a écrit ; « DÉJÀ REVENU » : elle
--             n'avait rien à écrire), et l'empreinte des libellés, qui ne
--             change entre l'étape 1 et l'étape 3 que s'il y a eu écriture
--             (elle porte sur toute la table : un modèle créé ou supprimé, ou
--             un authentication_points modifié par ailleurs entre-temps, la
--             change aussi). Si la sélection ne prenait que des lignes de
--             commentaire, rien n'a été lancé et l'éditeur n'affiche rien non
--             plus : c'est l'étape 3 qui dit l'état de la base. Pendant le
--             bloc, public.models est fermée à l'écriture et reste ouverte à
--             la lecture ; si la table est occupée, une erreur arrive au bout
--             de 5 s, rien n'est écrit, relancer.
--   ÉTAPE 3 — aperçu APRÈS le retour (lecture seule) : la preuve que la base
--             est dans l'état de départ. Verdict attendu : « À L'ÉTAT DE
--             DÉPART », 46 lignes « ancien en place » (« a_remettre » à 0,
--             « portent_l_ancien » égal à « points_au_releve »), et
--             l'empreinte des points suivis égale à celle notée à l'étape 1
--             de l'aller : chaque point suivi a retrouvé son libellé, sur son
--             modèle. Si rien d'autre n'a changé dans public.models depuis
--             l'étape 1 de l'aller, les deux autres empreintes sont elles
--             aussi égales à celles notées alors : c'est la preuve du retour
--             à l'octet près. Si le catalogue a bougé entre-temps, même sans
--             gêner le retour, elles ne le sont plus : un modèle créé change
--             les deux ; un modèle désactivé ou renommé, celle des autres
--             colonnes ; un autre libellé retouché, celle des libellés. Une
--             de ces deux empreintes différente ne dit donc pas que le retour
--             est inexact ; si rien de tel n'a été fait entre-temps, faire
--             vérifier le catalogue. L'étape 3 décrit l'état de la base, pas
--             ce que l'étape 2 vient de faire : sur une base jamais corrigée,
--             elle affiche la même chose. « PAS REVENU » : rien n'a été
--             écrit, et la ligne dit quoi faire.
--   (Lancer le fichier entier d'un coup n'affiche que l'étape 3 : on perd le
--   moyen de savoir si l'étape 2 a écrit ou si la base était déjà revenue.)
--   Ces étapes sont écrites pour l'éditeur SQL de Supabase, qui enregistre
--   chaque lancement réussi. Dans un outil réglé pour ne valider qu'à la
--   demande (il ouvre lui-même une transaction), l'étape 2 n'est enregistrée
--   qu'à cette validation ; après une erreur, il faut y lancer « rollback; »
--   avant de reprendre à l'étape 1.
--
-- COMMENT LES FUSIONS SE DÉFONT
--   Six nouveaux libellés viennent de plusieurs anciens, ou étaient déjà
--   portés au départ. Pour rendre à chaque point son ancien libellé, le
--   script porte des listes de modèles (identifiants relevés le 2026-10-06).
--   Pour un point qui porte un de ces nouveaux libellés, la règle est :
--     - son modèle est dans la liste d'un ancien libellé de cette fusion : il
--       reprend celui-là ;
--     - son modèle portait déjà le nouveau libellé au départ : il le garde ;
--     - son modèle n'est dans aucune de ces listes : il reprend l'ancien
--       libellé sans liste.
--   packaging : « Emballage »
--       reste « Emballage » sur 28 modèles listés, qui le portaient déjà (les
--         mêmes que pour « Tags »)
--       redevient « Emballage et packaging » sur tous les autres modèles (98
--         points)
--   sole_pattern : « Semelle extérieure (motif) »
--       redevient « Motif de la semelle » sur 1 modèle listé
--       redevient « Motif semelle extérieure » sur 1 modèle listé
--   tags : « Étiquettes volantes »
--       redevient « Tags » sur 28 modèles listés
--       redevient « Tags et etiquettes volantes » sur tous les autres modèles
--         (98 points)
--   tongue_label : « Étiquette de taille (languette) »
--       redevient « Étiquette de languette » sur 4 modèles listés
--       redevient « Etiquette langue » sur tous les autres modèles (31
--         points)
--   tongue_tag : « Badge de languette (Nike Air) »
--       redevient « Étiquette Nike Air de la languette » sur 1 modèle listé
--       redevient « Étiquette de langue Nike Air » sur 1 modèle listé
--   tongue_tag : « Badge de languette »
--       redevient « Étiquette de langue » sur 3 modèles listés
--       redevient « Étiquette de languette » sur 3 modèles listés
--
-- CE QUE L'ÉTAPE 2 VÉRIFIE
--   Ses propres listes d'abord : 46 corrections, 2713 points, 47 identifiants
--   dans ses listes de modèles, 28 modèles qui portent déjà « Emballage », et
--   l'empreinte de ces listes, calculée quand le script a été généré. Un
--   libellé, un compte ou un identifiant modifié, même d'un caractère :
--   exception, rien n'est écrit.
--   Avant d'écrire : les comptes sont ceux que l'aller a laissés. Chaque
--   nouveau libellé a son total, chaque modèle listé le porte une fois, il
--   n'y a plus aucun ancien libellé. Sinon elle s'arrête, rien n'est écrit
--   (voir « QUAND CE RETOUR N'EST PLUS POSSIBLE »). Base déjà revenue : un
--   avis, aucune écriture.
--   Après avoir écrit, les mêmes contrôles que l'aller : chaque ancien
--   libellé a retrouvé son nombre de points, sur les modèles de sa liste s'il
--   en a une ; exactement 2713 libellés modifiés, tous d'après la table ;
--   pour chaque modèle, même nombre de points et même suite de (zone,
--   weight) ; rien d'autre que le libellé ne change dans un point ; les
--   modèles non concernés sont identiques à l'octet près ; aucune autre
--   colonne ne change ; aucun modèle n'apparaît ni ne disparaît.
-- ============================================================================


-- ═══ ÉTAPE 1 — APERÇU AVANT LE RETOUR (lecture seule) ══════════════════════════
-- Colonnes des corrections : n°, zone, ancien libellé, nouveau libellé, points au relevé, liste.
-- liste = true : les modèles qui portent ce point sont connus un par un, leurs identifiants sont
-- dans « listes » (n° de la correction, modèle) ; false : ils ne sont pas listés. « deja » : les
-- modèles qui portent déjà un nouveau libellé au départ. Ces listes servent à contrôler où sont
-- les points, et à défaire les fusions.
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
listes (n, id) as (values              -- n° de la correction, modèle qui porte son point : un point par modèle
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
deja (zone, libelle, id) as (values    -- nouveau libellé déjà porté au départ par ces modèles, qui le gardent
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
places as (                            -- une fois corrigé, chaque modèle listé porte ce libellé une fois ; n : la correction qui le liste (0 : il le portait déjà)
  select c.zone, c.nouveau as libelle, l.id, c.n from corr c join listes l on l.n = c.n
  union all
  select d.zone, d.libelle, d.id, 0 from deja d
),
pts as (                               -- tous les points bien formés de tous les modèles, actifs ou non
  select m.id, e.point ->> 'zone' as zone, e.point ->> 'label' as libelle,
         -- inscrit : n° de la correction qui liste ce modèle pour ce libellé (0 : il le portait déjà ; nul : modèle non listé)
         (select pl.n from places pl where pl.zone = e.point ->> 'zone' and pl.libelle = e.point ->> 'label' and pl.id = m.id) as inscrit
  from public.models m
  cross join lateral jsonb_array_elements(case when jsonb_typeof(m.authentication_points) = 'array' then m.authentication_points else '[]'::jsonb end) as e(point)
  where jsonb_typeof(e.point) = 'object' and jsonb_typeof(e.point -> 'zone') = 'string' and jsonb_typeof(e.point -> 'label') = 'string'
),
attendu as (                           -- combien de points doit porter chaque libellé suivi, au départ puis une fois corrigé
  select l.zone, l.libelle, sum(l.depart)::int as depart, sum(l.applique)::int as applique
  from (
    -- les anciens libellés : tous leurs points au départ, plus aucun ensuite
    select c.zone, c.ancien as libelle, c.points as depart, 0 as applique from corr c
    union all
    -- les nouveaux libellés : aucun point au départ, tous ensuite
    select c.zone, c.nouveau, 0, c.points from corr c
    union all
    -- les « déjà là » : un point par modèle listé, avant comme après
    select d.zone, d.libelle, 1, 1 from deja d
  ) l
  group by l.zone, l.libelle
),
positions as (                         -- modèle par modèle : ce qu'un modèle listé doit porter (1) ou ne pas porter (0), dans quel état
  -- au départ, l'ancien libellé d'une correction à liste est sur chaque modèle de sa liste, une fois
  select 'depart' as etat, c.zone, c.ancien as libelle, l.id, 1 as attendu from corr c join listes l on l.n = c.n
  union all
  -- au départ, un libellé « déjà là » est sur chacun de ses modèles, une fois
  select 'depart', d.zone, d.libelle, d.id, 1 from deja d
  union all
  -- au départ, l'ancien libellé d'une correction SANS liste n'est sur aucun modèle listé de sa fusion
  select 'depart', c.zone, c.ancien, pl.id, 0 from corr c join places pl on pl.zone = c.zone and pl.libelle = c.nouveau where not c.liste
  union all
  -- une fois corrigé, le nouveau libellé est sur chaque modèle listé, une fois
  select 'applique', pl.zone, pl.libelle, pl.id, 1 from places pl
),
mesure as (                            -- pour chaque libellé suivi : points trouvés, modèles listés en écart, comparés aux deux états
  select a.zone, a.libelle, a.depart, a.applique, coalesce(t.n, 0) as trouves,
         coalesce(e.mal_depart, 0) as mal_depart, e.ex_depart, coalesce(e.mal_applique, 0) as mal_applique, e.ex_applique,
         coalesce(t.n, 0) = a.depart and coalesce(e.mal_depart, 0) = 0 as ok_depart,
         coalesce(t.n, 0) = a.applique and coalesce(e.mal_applique, 0) = 0 as ok_applique
  from attendu a
  left join (select p.zone, p.libelle, count(*)::int as n from pts p group by p.zone, p.libelle) t
         on t.zone = a.zone and t.libelle = a.libelle
  left join (
    -- les modèles listés qui ne portent pas le nombre de points attendu, et les trois premiers pour exemple
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
  select coalesce(bool_and(j.ok_depart), false) as au_depart,
         coalesce(bool_and(j.ok_applique), false) as applique,
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.depart,
               case when j.mal_depart = 0 then ''
                    else format(' ; %s modèle(s) listé(s) en écart (%s%s)', j.mal_depart, j.ex_depart, case when j.mal_depart > 3 then ', …' else '' end) end), ' | ' order by j.zone, j.libelle)
           filter (where not j.ok_depart) as ecarts_depart,
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.applique,
               case when j.mal_applique = 0 then ''
                    else format(' ; %s modèle(s) listé(s) en écart (%s%s)', j.mal_applique, j.ex_applique, case when j.mal_applique > 3 then ', …' else '' end) end), ' | ' order by j.zone, j.libelle)
           filter (where not j.ok_applique) as ecarts_applique,
         count(*) filter (where not j.ok_depart) as nb_depart,
         count(*) filter (where not j.ok_applique) as nb_applique,
         coalesce(sum(j.trouves), 0)::int as trouves,   -- points portant un libellé suivi, ancien ou nouveau
         count(*)::int as suivis,                       -- libellés suivis (anciens et nouveaux, chacun dans sa zone)
         (select count(*) from public.models) as modeles,   -- toutes les lignes de la table, modèles désactivés compris
         (select count(distinct p.id) from pts p join corr c on c.zone = p.zone and c.nouveau = p.libelle and case when p.inscrit is null then not c.liste else c.n = p.inscrit end) as modeles_a_modifier
  from mesure j
),
t as (
  select (select sum(c.points)::int from corr c) as attendus,
         (select sum(j.trouves)::int from mesure j where exists (select 1 from corr c where c.zone = j.zone and c.ancien = j.libelle)) as trouves_anciens,
         (select count(*)::int from pts p join corr c on c.zone = p.zone and c.nouveau = p.libelle and case when p.inscrit is null then not c.liste else c.n = p.inscrit end) as trouves_nouveaux,
         -- Trois empreintes. Celle des libellés (tous les points de tous les modèles) change à l'aller
         -- et revient à l'identique après le retour si rien d'autre n'a touché la table entre-temps.
         -- Celle des autres colonnes ne change que si une autre colonne de public.models change ; elle
         -- est calculée en UTC, pour ne pas dépendre du fuseau horaire de la session (to_jsonb écrit
         -- created_at avec son décalage ; set_config ne pose le fuseau que pour cette transaction).
         -- Celle des points suivis ne porte que sur les points qui ont un des 87 libellés de la
         -- table (modèle, zone, libellé) : elle ne bouge pas quand le reste du catalogue bouge.
         (select md5(string_agg(m.id::text || md5(m.authentication_points::text), ',' order by m.id)) from public.models m) as empreinte_libelles,
         (select md5(string_agg(m.id::text || md5(case when set_config('TimeZone', 'UTC', true) is not null then (to_jsonb(m) - 'authentication_points')::text end), ',' order by m.id)) from public.models m) as empreinte_autres_colonnes,
         (select md5(coalesce(string_agg(format('%s|%s|%s', p.id, p.zone, p.libelle), E'\n' order by p.id, p.zone collate "C", p.libelle collate "C"), ''))
          from pts p where exists (select 1 from attendu a where a.zone = p.zone and a.libelle = p.libelle)) as empreinte_points_suivis
)
select 0 as ligne,
       case when e.trouves = 0 then 'ÉCARTS, NE PAS LANCER L''ÉTAPE 2 — ' || format('aucun des %s libellés du relevé (ni ancien ni nouveau) n''est dans cette base, dont public.models compte %s modèle(s) : est-ce le bon projet ?', e.suivis, e.modeles)
              when e.applique then format('PRÊT POUR LE RETOUR : %s points à remettre dans %s modèles (la table en compte %s, actifs ou non). Lancer l''étape 2 si l''empreinte des points suivis (dernière colonne) est celle notée à l''étape 3 de l''aller.', t.attendus, e.modeles_a_modifier, e.modeles)
              when e.au_depart then 'DÉJÀ REVENU : la base est dans l''état de départ (anciens libellés). Ne rien lancer.'
              else 'ÉCARTS, NE PAS LANCER L''ÉTAPE 2 — ' || case when e.nb_applique <= e.nb_depart then format('par rapport à l''état corrigé (%s libellé(s) en écart sur %s ; %s par rapport à l''état de départ) : ', e.nb_applique, e.suivis, e.nb_depart) || e.ecarts_applique
                        else format('par rapport à l''état de départ (%s libellé(s) en écart sur %s ; %s par rapport à l''état corrigé) : ', e.nb_depart, e.suivis, e.nb_applique) || e.ecarts_depart end end as etat,
       '(total)' as zone, null::text as libelle_corrige, t.attendus as points_au_releve, t.trouves_nouveaux as a_remettre,
       null::text as ancien_libelle, null::int as portent_l_ancien, null::text as modeles_vises,
       t.empreinte_libelles, t.empreinte_autres_colonnes, t.empreinte_points_suivis
from etat e cross join t
union all
select c.n,
       case when ja.ok_applique and jn.ok_applique then 'à remettre'
              when ja.ok_depart and jn.ok_depart then 'ancien en place'
              else 'ÉCART' end,
       c.zone, c.nouveau, c.points,
       (select count(*)::int from pts p where c.zone = p.zone and c.nouveau = p.libelle and case when p.inscrit is null then not c.liste else c.n = p.inscrit end),
       c.ancien, ja.trouves,
       case when c.liste then format('%s modèle(s) listé(s)', c.points)
            when g.listes > 0 then format('tous sauf %s modèle(s) listé(s)', g.listes)
            else 'tous' end,
       null, null, null
from corr c
join mesure ja on ja.zone = c.zone and ja.libelle = c.ancien
join mesure jn on jn.zone = c.zone and jn.libelle = c.nouveau
cross join lateral (select count(*)::int as listes from places pl where pl.zone = c.zone and pl.libelle = c.nouveau) g
order by ligne;


-- ═══ ÉTAPE 2 — RETOUR (un seul bloc atomique) ══════════════════════════════════
do $$
declare
  v_total constant int := 2713;   -- points à modifier, tous modèles confondus
  -- empreinte des trois listes ci-dessous, calculée quand le script a été généré
  v_empreinte constant text := 'cdfdc071d7cc1499400cefde8374ed85';
  v_lue text;                       -- la même empreinte, recalculée sur les listes telles qu'elles sont lancées
  v_ecarts_depart text;             -- écarts avec l'état de départ (nul : aucun)
  v_ecarts_applique text;           -- écarts avec l'état corrigé (nul : aucun)
  v_nb_depart int; v_nb_applique int;
  v_trouves int;                    -- points portant un libellé suivi, ancien ou nouveau
  v_suivis int;                     -- libellés suivis (87 : les anciens et les nouveaux, chacun dans sa zone)
  v_modeles int;                    -- modèles à modifier
  v_n int;
  v_orphelins int; v_changes int; v_hors_table int; v_reste int;
begin
  -- Si la table est occupée : une erreur au bout de 5 s, rien n'est écrit, relancer. Ce délai est
  -- posé ici, dans le bloc : il vaut dès que le bloc tourne, et retombe avec lui.
  set local lock_timeout = '5s';
  -- Personne d'autre n'écrit dans public.models pendant le bloc ; la lecture (le site) reste ouverte.
  -- Le verrou tombe tout seul à la fin du bloc.
  lock table public.models in share row exclusive mode;

  -- Tables de travail, temporaires : elles disparaissent à la fin du bloc, écrit ou annulé.
  -- Colonnes des corrections : n°, zone, ancien libellé, nouveau libellé, points au relevé, liste.
  -- liste = true : les modèles qui portent ce point sont connus un par un, leurs identifiants sont
  -- dans « listes » (n° de la correction, modèle) ; false : ils ne sont pas listés. « deja » : les
  -- modèles qui portent déjà un nouveau libellé au départ. Ces listes servent à contrôler où sont
  -- les points, et à défaire les fusions.
  create temp table lv_corr (n int primary key, zone text not null, ancien text not null, nouveau text not null,
                             points int not null, liste boolean not null, unique (zone, ancien)) on commit drop;
  insert into lv_corr (n, zone, ancien, nouveau, points, liste) values
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
    (46, 'zipper', 'Fermeture eclair (YKK/Lampo, fluidite)', 'Fermeture éclair (YKK/Lampo, fluidité)', 175, false);
  create temp table lv_listes (n int, id uuid, primary key (n, id)) on commit drop;   -- n° de la correction, modèle qui porte son point
  insert into lv_listes (n, id) values
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
    (44, '302aeaa6-ac01-465b-8a99-355f1b809396'::uuid);
  create temp table lv_deja (zone text, libelle text, id uuid, primary key (zone, libelle, id)) on commit drop;   -- nouveau libellé déjà porté au départ
  insert into lv_deja (zone, libelle, id) values
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
    ('packaging', 'Emballage', 'e43ffcce-a1b2-4341-9ae5-5ca911bef059'::uuid), ('packaging', 'Emballage', 'f3737cac-2f66-4c08-b08a-cfa105840a5b'::uuid);

  -- Garde-fou : les listes lancées sont celles du script généré, au caractère près.
  v_lue := md5(coalesce((select string_agg(format('%s|%s|%s|%s|%s|%s', c.n, c.zone, c.ancien, c.nouveau, c.points, case when c.liste then 'oui' else 'non' end), E'\n' order by c.n) from lv_corr c), '')
               || E'\n=\n' || coalesce((select string_agg(format('%s|%s', l.n, l.id), E'\n' order by l.n, l.id) from lv_listes l), '')
               || E'\n=\n' || coalesce((select string_agg(format('%s|%s|%s', d.zone, d.libelle, d.id), E'\n' order by d.zone collate "C", d.libelle collate "C", d.id) from lv_deja d), ''));
  if (select count(*) from lv_corr) <> 46 or (select coalesce(sum(c.points), 0) from lv_corr c) <> v_total
     or (select count(*) from lv_listes) <> 47 or (select count(*) from lv_deja) <> 28 or v_lue is distinct from v_empreinte then
    raise exception 'Les listes du script ont été modifiées (attendu : 46 corrections, % points, 47 identifiants listés, 28 « déjà là » ; trouvé : %, %, %, % ; empreinte des listes %) — rien n''est écrit. Recoller le fichier d''origine, sans le modifier, puis reprendre à l''étape 1.',
      v_total, (select count(*) from lv_corr), (select coalesce(sum(c.points), 0) from lv_corr c), (select count(*) from lv_listes), (select count(*) from lv_deja),
      case when v_lue is distinct from v_empreinte then 'différente' else 'identique' end;
  end if;

  -- Une fois corrigé, chaque modèle listé porte le nouveau libellé une fois ; n : la correction qui
  -- le liste (0 : il le portait déjà). Un modèle n'est listé qu'une fois pour un même libellé.
  create temp table lv_places (zone text, libelle text, id uuid, n int, primary key (zone, libelle, id)) on commit drop;
  insert into lv_places (zone, libelle, id, n)
    select c.zone, c.nouveau as libelle, l.id, c.n from lv_corr c join lv_listes l on l.n = c.n
    union all
    select d.zone, d.libelle, d.id, 0 from lv_deja d;

  -- Combien de points doit porter chaque libellé suivi, au départ puis une fois corrigé
  create temp table lv_attendu on commit drop as
    select l.zone, l.libelle, sum(l.depart)::int as depart, sum(l.applique)::int as applique
    from (
      -- les anciens libellés : tous leurs points au départ, plus aucun ensuite
      select c.zone, c.ancien as libelle, c.points as depart, 0 as applique from lv_corr c
      union all
      -- les nouveaux libellés : aucun point au départ, tous ensuite
      select c.zone, c.nouveau, 0, c.points from lv_corr c
      union all
      -- les « déjà là » : un point par modèle listé, avant comme après
      select d.zone, d.libelle, 1, 1 from lv_deja d
    ) l
    group by l.zone, l.libelle;

  -- Modèle par modèle : ce qu'un modèle listé doit porter (1) ou ne pas porter (0), dans quel état
  create temp table lv_positions on commit drop as
    -- au départ, l'ancien libellé d'une correction à liste est sur chaque modèle de sa liste, une fois
    select 'depart' as etat, c.zone, c.ancien as libelle, l.id, 1 as attendu from lv_corr c join lv_listes l on l.n = c.n
    union all
    -- au départ, un libellé « déjà là » est sur chacun de ses modèles, une fois
    select 'depart', d.zone, d.libelle, d.id, 1 from lv_deja d
    union all
    -- au départ, l'ancien libellé d'une correction SANS liste n'est sur aucun modèle listé de sa fusion
    select 'depart', c.zone, c.ancien, pl.id, 0 from lv_corr c join lv_places pl on pl.zone = c.zone and pl.libelle = c.nouveau where not c.liste
    union all
    -- une fois corrigé, le nouveau libellé est sur chaque modèle listé, une fois
    select 'applique', pl.zone, pl.libelle, pl.id, 1 from lv_places pl;

  -- Toute la table telle qu'elle est avant d'écrire
  create temp table lv_avant on commit drop as
    select m.id, m.authentication_points::text as points_texte,
           (to_jsonb(m) - 'authentication_points')::text as autres_colonnes
    from public.models m;

  -- Les éléments de tous les tableaux, relevés deux fois : avant puis après l'écriture. Un
  -- authentication_points qui n'est pas un tableau n'en donne aucun ; zone et libelle restent nuls
  -- pour un élément mal formé (pas un objet, « zone » ou « label » absent ou pas un texte) : ignoré.
  -- inscrit : n° de la correction qui liste ce modèle pour ce libellé (0 : il le portait déjà ;
  -- nul : modèle non listé).
  create temp table lv_points (moment text, id uuid, rang bigint, point jsonb,
                               zone text, libelle text, inscrit int) on commit drop;

  -- ── 1. L'état AVANT (au moindre écart : exception, rien n'est écrit) ─────
  -- Tous les éléments de tous les tableaux, tels qu'ils sont avant d'écrire
  insert into lv_points
  select 'avant', m.id, e.rang, e.point,
         case when f.bien_forme then e.point ->> 'zone' end, case when f.bien_forme then e.point ->> 'label' end,
         case when f.bien_forme then (select pl.n from lv_places pl where pl.zone = e.point ->> 'zone' and pl.libelle = e.point ->> 'label' and pl.id = m.id) end
  from public.models m
  cross join lateral jsonb_array_elements(case when jsonb_typeof(m.authentication_points) = 'array' then m.authentication_points else '[]'::jsonb end) with ordinality as e(point, rang)
  cross join lateral (select jsonb_typeof(e.point) = 'object' and jsonb_typeof(e.point -> 'zone') = 'string' and jsonb_typeof(e.point -> 'label') = 'string' as bien_forme) f;
  -- Pour chaque libellé suivi : points trouvés et modèles listés en écart, comparés à l'état de départ et à l'état corrigé
  select string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.depart,
               case when j.mal_depart = 0 then ''
                    else format(' ; %s modèle(s) listé(s) en écart (%s%s)', j.mal_depart, j.ex_depart, case when j.mal_depart > 3 then ', …' else '' end) end), E'\n' order by j.zone, j.libelle)
           filter (where not j.ok_depart),
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.applique,
               case when j.mal_applique = 0 then ''
                    else format(' ; %s modèle(s) listé(s) en écart (%s%s)', j.mal_applique, j.ex_applique, case when j.mal_applique > 3 then ', …' else '' end) end), E'\n' order by j.zone, j.libelle)
           filter (where not j.ok_applique),
         count(*) filter (where not j.ok_depart), count(*) filter (where not j.ok_applique),
         coalesce(sum(j.trouves), 0), count(*)
    into v_ecarts_depart, v_ecarts_applique, v_nb_depart, v_nb_applique, v_trouves, v_suivis
  from (
    select a.zone, a.libelle, a.depart, a.applique, coalesce(t.n, 0) as trouves,
           coalesce(e.mal_depart, 0) as mal_depart, e.ex_depart, coalesce(e.mal_applique, 0) as mal_applique, e.ex_applique,
           coalesce(t.n, 0) = a.depart and coalesce(e.mal_depart, 0) = 0 as ok_depart,
           coalesce(t.n, 0) = a.applique and coalesce(e.mal_applique, 0) = 0 as ok_applique
    from lv_attendu a
    left join (select p.zone, p.libelle, count(*)::int as n from lv_points p where p.moment = 'avant' group by p.zone, p.libelle) t
           on t.zone = a.zone and t.libelle = a.libelle
    left join (
      -- les modèles listés qui ne portent pas le nombre de points attendu, et les trois premiers pour exemple
      select o.zone, o.libelle,
             (count(*) filter (where o.etat = 'depart'))::int as mal_depart,
             (count(*) filter (where o.etat = 'applique'))::int as mal_applique,
             array_to_string((array_agg(o.exemple order by o.id) filter (where o.etat = 'depart'))[1:3], ', ') as ex_depart,
             array_to_string((array_agg(o.exemple order by o.id) filter (where o.etat = 'applique'))[1:3], ', ') as ex_applique
      from (
        select o.etat, o.zone, o.libelle, o.id, format('%s : %s point(s) au lieu de %s', o.id, coalesce(k.n, 0), o.attendu) as exemple
        from lv_positions o
        left join (select p.zone, p.libelle, p.id, count(*)::int as n from lv_points p where p.moment = 'avant' group by p.zone, p.libelle, p.id) k
               on k.zone = o.zone and k.libelle = o.libelle and k.id = o.id
        where coalesce(k.n, 0) <> o.attendu
      ) o
      group by o.zone, o.libelle
    ) e on e.zone = a.zone and e.libelle = a.libelle
  ) j;

  -- Aucun libellé suivi dans la base (table vide, mauvais projet) : le dire tel quel.
  if v_trouves = 0 then
    raise exception 'Aucun des % libellés du relevé (ni ancien ni nouveau) n''est dans cette base, dont public.models compte % modèle(s) : est-ce le bon projet ? — rien n''est écrit. Vérifier le projet ouvert, puis reprendre à l''étape 1.',
      v_suivis, (select count(*) from lv_avant);
  end if;
  if v_ecarts_depart is null then
    raise notice 'Déjà revenu : la base est dans l''état de départ, rien n''est écrit.';
    return;
  end if;
  if v_ecarts_applique is not null then
    raise exception 'La base n''est ni dans l''état de départ ni dans l''état corrigé — rien n''est écrit. Ne pas relancer : transmettre ce message pour faire adapter le script. %',
      case when v_nb_applique <= v_nb_depart then format('Écarts avec l''état corrigé (%s libellé(s) sur %s ; %s avec l''état de départ) :', v_nb_applique, v_suivis, v_nb_depart) || E'\n' || v_ecarts_applique
                else format('Écarts avec l''état de départ (%s libellé(s) sur %s ; %s avec l''état corrigé) :', v_nb_depart, v_suivis, v_nb_applique) || E'\n' || v_ecarts_depart end;
  end if;

  -- ── 2. La modification ──────────────────────────────────────────────────
  -- Les fusions se défont par les listes : un point qui porte un nouveau libellé reprend l'ancien
  -- libellé de la correction qui liste son modèle ; s'il le portait déjà au départ, il le garde ;
  -- si son modèle n'est pas listé, il reprend l'ancien libellé de la correction sans liste.
  create temp table lv_concernes on commit drop as
    select distinct p.id
    from lv_points p join lv_corr c on c.zone = p.zone and c.nouveau = p.libelle and case when p.inscrit is null then not c.liste else c.n = p.inscrit end
    where p.moment = 'avant';

  -- Le tableau de chaque modèle concerné est reconstruit dans le même ordre ; un point n'est
  -- touché que si la table le désigne, et seule sa clé « label » est remplacée.
  update public.models m
  set authentication_points = r.tableau
  from (
    select p.id,
           jsonb_agg(case when c.zone is null then p.point
                          else jsonb_set(p.point, '{label}', to_jsonb(c.ancien)) end
                     order by p.rang) as tableau
    from lv_points p
    left join lv_corr c on c.zone = p.zone and c.nouveau = p.libelle and case when p.inscrit is null then not c.liste else c.n = p.inscrit end
    where p.moment = 'avant' and p.id in (select k.id from lv_concernes k)
    group by p.id
  ) r
  where m.id = r.id;
  get diagnostics v_modeles = row_count;

  -- ── 3. Les contrôles APRÈS (au moindre écart : exception, tout est annulé) ──
  -- Tous les éléments de tous les tableaux, relus après l'écriture (même instruction que plus haut)
  insert into lv_points
  select 'apres', m.id, e.rang, e.point,
         case when f.bien_forme then e.point ->> 'zone' end, case when f.bien_forme then e.point ->> 'label' end,
         case when f.bien_forme then (select pl.n from lv_places pl where pl.zone = e.point ->> 'zone' and pl.libelle = e.point ->> 'label' and pl.id = m.id) end
  from public.models m
  cross join lateral jsonb_array_elements(case when jsonb_typeof(m.authentication_points) = 'array' then m.authentication_points else '[]'::jsonb end) with ordinality as e(point, rang)
  cross join lateral (select jsonb_typeof(e.point) = 'object' and jsonb_typeof(e.point -> 'zone') = 'string' and jsonb_typeof(e.point -> 'label') = 'string' as bien_forme) f;
  -- La même mesure, sur l'état d'après
  select string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.depart,
               case when j.mal_depart = 0 then ''
                    else format(' ; %s modèle(s) listé(s) en écart (%s%s)', j.mal_depart, j.ex_depart, case when j.mal_depart > 3 then ', …' else '' end) end), E'\n' order by j.zone, j.libelle)
           filter (where not j.ok_depart),
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.applique,
               case when j.mal_applique = 0 then ''
                    else format(' ; %s modèle(s) listé(s) en écart (%s%s)', j.mal_applique, j.ex_applique, case when j.mal_applique > 3 then ', …' else '' end) end), E'\n' order by j.zone, j.libelle)
           filter (where not j.ok_applique),
         count(*) filter (where not j.ok_depart), count(*) filter (where not j.ok_applique),
         coalesce(sum(j.trouves), 0), count(*)
    into v_ecarts_depart, v_ecarts_applique, v_nb_depart, v_nb_applique, v_trouves, v_suivis
  from (
    select a.zone, a.libelle, a.depart, a.applique, coalesce(t.n, 0) as trouves,
           coalesce(e.mal_depart, 0) as mal_depart, e.ex_depart, coalesce(e.mal_applique, 0) as mal_applique, e.ex_applique,
           coalesce(t.n, 0) = a.depart and coalesce(e.mal_depart, 0) = 0 as ok_depart,
           coalesce(t.n, 0) = a.applique and coalesce(e.mal_applique, 0) = 0 as ok_applique
    from lv_attendu a
    left join (select p.zone, p.libelle, count(*)::int as n from lv_points p where p.moment = 'apres' group by p.zone, p.libelle) t
           on t.zone = a.zone and t.libelle = a.libelle
    left join (
      -- les modèles listés qui ne portent pas le nombre de points attendu, et les trois premiers pour exemple
      select o.zone, o.libelle,
             (count(*) filter (where o.etat = 'depart'))::int as mal_depart,
             (count(*) filter (where o.etat = 'applique'))::int as mal_applique,
             array_to_string((array_agg(o.exemple order by o.id) filter (where o.etat = 'depart'))[1:3], ', ') as ex_depart,
             array_to_string((array_agg(o.exemple order by o.id) filter (where o.etat = 'applique'))[1:3], ', ') as ex_applique
      from (
        select o.etat, o.zone, o.libelle, o.id, format('%s : %s point(s) au lieu de %s', o.id, coalesce(k.n, 0), o.attendu) as exemple
        from lv_positions o
        left join (select p.zone, p.libelle, p.id, count(*)::int as n from lv_points p where p.moment = 'apres' group by p.zone, p.libelle, p.id) k
               on k.zone = o.zone and k.libelle = o.libelle and k.id = o.id
        where coalesce(k.n, 0) <> o.attendu
      ) o
      group by o.zone, o.libelle
    ) e on e.zone = a.zone and e.libelle = a.libelle
  ) j;

  -- a. plus aucun nouveau libellé hors des « déjà là » ; chaque ancien libellé a son total, sur les modèles de sa liste s'il en a une
  if v_ecarts_depart is not null then
    raise exception 'Après écriture, l''état attendu n''est pas atteint — tout est annulé. Ne pas relancer : transmettre ce message.%', E'\n' || v_ecarts_depart;
  end if;

  -- b. autant de modèles écrits que de modèles concernés
  v_n := (select count(*) from lv_concernes);
  if v_modeles <> v_n then
    raise exception '% modèles écrits pour % concernés — tout est annulé. Ne pas relancer : transmettre ce message.', v_modeles, v_n;
  end if;

  -- c. les mêmes lignes qu'avant, ni plus ni moins
  v_n := (select count(*)
          from lv_avant a full join public.models m on m.id = a.id
          where a.id is null or m.id is null);
  if v_n <> 0 then raise exception '% modèles apparus ou disparus — tout est annulé. Ne pas relancer : transmettre ce message.', v_n; end if;

  -- d. aucune autre colonne ne change, sur aucun modèle. Ce bloc n'écrit que authentication_points :
  --    si une autre colonne a bougé, c'est qu'un déclencheur ou une colonne calculée de la table
  --    l'a changée en passant (une date de mise à jour, par exemple). Le message nomme la colonne et
  --    les déclencheurs actifs.
  v_n := (select count(*)
          from lv_avant a join public.models m on m.id = a.id
          where a.autres_colonnes is distinct from (to_jsonb(m) - 'authentication_points')::text);
  if v_n <> 0 then
    raise exception '% modèles ont une autre colonne modifiée (%) — tout est annulé. Ce bloc n''écrit que authentication_points : la cause est ailleurs, le plus souvent un déclencheur ou une colonne calculée de public.models (déclencheurs actifs trouvés : %). Ne pas relancer : faire adapter le script.',
      v_n,
      (select string_agg(distinct k.cle, ', ' order by k.cle)
       from lv_avant a join public.models m on m.id = a.id
       cross join lateral jsonb_each(to_jsonb(m) - 'authentication_points') as k(cle, valeur)
       where (a.autres_colonnes::jsonb -> k.cle)::text is distinct from k.valeur::text),
      coalesce((select string_agg(g.tgname::text, ', ' order by g.tgname)
                from pg_trigger g
                where g.tgrelid = 'public.models'::regclass and not g.tgisinternal and g.tgenabled <> 'D'), 'aucun');
  end if;

  -- e. les modèles non concernés sont identiques à l'octet près ; les modèles concernés ont tous changé
  v_n := (select count(*)
          from lv_avant a join public.models m on m.id = a.id
          where (a.points_texte is distinct from m.authentication_points::text)
                is distinct from (a.id in (select k.id from lv_concernes k)));
  if v_n <> 0 then raise exception '% modèles : tableau modifié à tort, ou laissé tel quel à tort — tout est annulé. Ne pas relancer : transmettre ce message.', v_n; end if;

  -- f. pour CHAQUE modèle : même nombre de points, même suite de (zone, weight)
  v_n := (select count(*)
          from (
            select p.id
            from lv_points p
            group by p.id
            having (jsonb_agg(jsonb_build_array(p.point -> 'zone', p.point -> 'weight') order by p.rang) filter (where p.moment = 'avant'))::text
                   is distinct from
                   (jsonb_agg(jsonb_build_array(p.point -> 'zone', p.point -> 'weight') order by p.rang) filter (where p.moment = 'apres'))::text
          ) s);
  if v_n <> 0 then raise exception '% modèles : le nombre de points ou la suite des (zone, weight) a changé — tout est annulé. Ne pas relancer : transmettre ce message.', v_n; end if;

  -- g. point par point, au même rang : seul le libellé change, seulement d'après la table, 2713 fois
  --    (le premier et le dernier des quatre tests ci-dessous sont des filets en double : f arrête avant
  --    eux tout point apparu ou disparu ; a, f et les deux tests du milieu, tout autre compte que 2713)
  select count(*) filter (where av.id is null or ap.id is null),
         count(*) filter (where av.libelle is distinct from ap.libelle),
         count(*) filter (where av.libelle is distinct from ap.libelle and c.zone is null),
         count(*) filter (where case when av.zone is not null and ap.zone is not null
                                     then (av.point - 'label')::text is distinct from (ap.point - 'label')::text
                                     else av.point::text is distinct from ap.point::text end)
    into v_orphelins, v_changes, v_hors_table, v_reste
  from (select * from lv_points where moment = 'avant') av
  full join (select * from lv_points where moment = 'apres') ap on ap.id = av.id and ap.rang = av.rang
  left join lv_corr c on c.zone = av.zone and c.nouveau = av.libelle and case when av.inscrit is null then not c.liste else c.n = av.inscrit end and c.ancien = ap.libelle;
  if v_orphelins <> 0 then raise exception '% points apparus ou disparus — tout est annulé. Ne pas relancer : transmettre ce message.', v_orphelins; end if;
  if v_reste <> 0 then raise exception '% points modifiés ailleurs que dans leur libellé — tout est annulé. Ne pas relancer : transmettre ce message.', v_reste; end if;
  if v_hors_table <> 0 then raise exception '% libellés modifiés hors de la table des corrections — tout est annulé. Ne pas relancer : transmettre ce message.', v_hors_table; end if;
  if v_changes <> v_total then raise exception '% libellés modifiés au lieu de % — tout est annulé. Ne pas relancer : transmettre ce message.', v_changes, v_total; end if;

  raise notice 'Retour fait : % libellés remis dans % modèles.', v_changes, v_modeles;
end $$;


-- ═══ ÉTAPE 3 — APERÇU APRÈS LE RETOUR (lecture seule) ══════════════════════════
-- Colonnes des corrections : n°, zone, ancien libellé, nouveau libellé, points au relevé, liste.
-- liste = true : les modèles qui portent ce point sont connus un par un, leurs identifiants sont
-- dans « listes » (n° de la correction, modèle) ; false : ils ne sont pas listés. « deja » : les
-- modèles qui portent déjà un nouveau libellé au départ. Ces listes servent à contrôler où sont
-- les points, et à défaire les fusions.
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
listes (n, id) as (values              -- n° de la correction, modèle qui porte son point : un point par modèle
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
deja (zone, libelle, id) as (values    -- nouveau libellé déjà porté au départ par ces modèles, qui le gardent
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
places as (                            -- une fois corrigé, chaque modèle listé porte ce libellé une fois ; n : la correction qui le liste (0 : il le portait déjà)
  select c.zone, c.nouveau as libelle, l.id, c.n from corr c join listes l on l.n = c.n
  union all
  select d.zone, d.libelle, d.id, 0 from deja d
),
pts as (                               -- tous les points bien formés de tous les modèles, actifs ou non
  select m.id, e.point ->> 'zone' as zone, e.point ->> 'label' as libelle,
         -- inscrit : n° de la correction qui liste ce modèle pour ce libellé (0 : il le portait déjà ; nul : modèle non listé)
         (select pl.n from places pl where pl.zone = e.point ->> 'zone' and pl.libelle = e.point ->> 'label' and pl.id = m.id) as inscrit
  from public.models m
  cross join lateral jsonb_array_elements(case when jsonb_typeof(m.authentication_points) = 'array' then m.authentication_points else '[]'::jsonb end) as e(point)
  where jsonb_typeof(e.point) = 'object' and jsonb_typeof(e.point -> 'zone') = 'string' and jsonb_typeof(e.point -> 'label') = 'string'
),
attendu as (                           -- combien de points doit porter chaque libellé suivi, au départ puis une fois corrigé
  select l.zone, l.libelle, sum(l.depart)::int as depart, sum(l.applique)::int as applique
  from (
    -- les anciens libellés : tous leurs points au départ, plus aucun ensuite
    select c.zone, c.ancien as libelle, c.points as depart, 0 as applique from corr c
    union all
    -- les nouveaux libellés : aucun point au départ, tous ensuite
    select c.zone, c.nouveau, 0, c.points from corr c
    union all
    -- les « déjà là » : un point par modèle listé, avant comme après
    select d.zone, d.libelle, 1, 1 from deja d
  ) l
  group by l.zone, l.libelle
),
positions as (                         -- modèle par modèle : ce qu'un modèle listé doit porter (1) ou ne pas porter (0), dans quel état
  -- au départ, l'ancien libellé d'une correction à liste est sur chaque modèle de sa liste, une fois
  select 'depart' as etat, c.zone, c.ancien as libelle, l.id, 1 as attendu from corr c join listes l on l.n = c.n
  union all
  -- au départ, un libellé « déjà là » est sur chacun de ses modèles, une fois
  select 'depart', d.zone, d.libelle, d.id, 1 from deja d
  union all
  -- au départ, l'ancien libellé d'une correction SANS liste n'est sur aucun modèle listé de sa fusion
  select 'depart', c.zone, c.ancien, pl.id, 0 from corr c join places pl on pl.zone = c.zone and pl.libelle = c.nouveau where not c.liste
  union all
  -- une fois corrigé, le nouveau libellé est sur chaque modèle listé, une fois
  select 'applique', pl.zone, pl.libelle, pl.id, 1 from places pl
),
mesure as (                            -- pour chaque libellé suivi : points trouvés, modèles listés en écart, comparés aux deux états
  select a.zone, a.libelle, a.depart, a.applique, coalesce(t.n, 0) as trouves,
         coalesce(e.mal_depart, 0) as mal_depart, e.ex_depart, coalesce(e.mal_applique, 0) as mal_applique, e.ex_applique,
         coalesce(t.n, 0) = a.depart and coalesce(e.mal_depart, 0) = 0 as ok_depart,
         coalesce(t.n, 0) = a.applique and coalesce(e.mal_applique, 0) = 0 as ok_applique
  from attendu a
  left join (select p.zone, p.libelle, count(*)::int as n from pts p group by p.zone, p.libelle) t
         on t.zone = a.zone and t.libelle = a.libelle
  left join (
    -- les modèles listés qui ne portent pas le nombre de points attendu, et les trois premiers pour exemple
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
  select coalesce(bool_and(j.ok_depart), false) as au_depart,
         coalesce(bool_and(j.ok_applique), false) as applique,
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.depart,
               case when j.mal_depart = 0 then ''
                    else format(' ; %s modèle(s) listé(s) en écart (%s%s)', j.mal_depart, j.ex_depart, case when j.mal_depart > 3 then ', …' else '' end) end), ' | ' order by j.zone, j.libelle)
           filter (where not j.ok_depart) as ecarts_depart,
         string_agg(format('%s « %s » : %s point(s) trouvé(s), %s attendu(s)%s', j.zone, j.libelle, j.trouves, j.applique,
               case when j.mal_applique = 0 then ''
                    else format(' ; %s modèle(s) listé(s) en écart (%s%s)', j.mal_applique, j.ex_applique, case when j.mal_applique > 3 then ', …' else '' end) end), ' | ' order by j.zone, j.libelle)
           filter (where not j.ok_applique) as ecarts_applique,
         count(*) filter (where not j.ok_depart) as nb_depart,
         count(*) filter (where not j.ok_applique) as nb_applique,
         coalesce(sum(j.trouves), 0)::int as trouves,   -- points portant un libellé suivi, ancien ou nouveau
         count(*)::int as suivis,                       -- libellés suivis (anciens et nouveaux, chacun dans sa zone)
         (select count(*) from public.models) as modeles,   -- toutes les lignes de la table, modèles désactivés compris
         (select count(distinct p.id) from pts p join corr c on c.zone = p.zone and c.nouveau = p.libelle and case when p.inscrit is null then not c.liste else c.n = p.inscrit end) as modeles_a_modifier
  from mesure j
),
t as (
  select (select sum(c.points)::int from corr c) as attendus,
         (select sum(j.trouves)::int from mesure j where exists (select 1 from corr c where c.zone = j.zone and c.ancien = j.libelle)) as trouves_anciens,
         (select count(*)::int from pts p join corr c on c.zone = p.zone and c.nouveau = p.libelle and case when p.inscrit is null then not c.liste else c.n = p.inscrit end) as trouves_nouveaux,
         -- Trois empreintes. Celle des libellés (tous les points de tous les modèles) change à l'aller
         -- et revient à l'identique après le retour si rien d'autre n'a touché la table entre-temps.
         -- Celle des autres colonnes ne change que si une autre colonne de public.models change ; elle
         -- est calculée en UTC, pour ne pas dépendre du fuseau horaire de la session (to_jsonb écrit
         -- created_at avec son décalage ; set_config ne pose le fuseau que pour cette transaction).
         -- Celle des points suivis ne porte que sur les points qui ont un des 87 libellés de la
         -- table (modèle, zone, libellé) : elle ne bouge pas quand le reste du catalogue bouge.
         (select md5(string_agg(m.id::text || md5(m.authentication_points::text), ',' order by m.id)) from public.models m) as empreinte_libelles,
         (select md5(string_agg(m.id::text || md5(case when set_config('TimeZone', 'UTC', true) is not null then (to_jsonb(m) - 'authentication_points')::text end), ',' order by m.id)) from public.models m) as empreinte_autres_colonnes,
         (select md5(coalesce(string_agg(format('%s|%s|%s', p.id, p.zone, p.libelle), E'\n' order by p.id, p.zone collate "C", p.libelle collate "C"), ''))
          from pts p where exists (select 1 from attendu a where a.zone = p.zone and a.libelle = p.libelle)) as empreinte_points_suivis
)
select 0 as ligne,
       case when e.trouves = 0 then 'ÉCARTS — ' || format('aucun des %s libellés du relevé (ni ancien ni nouveau) n''est dans cette base, dont public.models compte %s modèle(s) : est-ce le bon projet ?', e.suivis, e.modeles)
              when e.au_depart then format('À L''ÉTAT DE DÉPART : les anciens libellés des 46 corrections sont en place (%s points), aucune correction ne l''est.', t.attendus)
              when e.applique then 'PAS REVENU : les corrections sont toujours en place, rien n''a été écrit. Si l''étape 2 a affiché une erreur, la transmettre. Sinon elle n''a pas été lancée : reprendre à l''étape 1, puis sélectionner l''étape 2 en entier, de son bandeau au bandeau de l''étape 3.'
              else 'ÉCARTS — ' || case when e.nb_depart <= e.nb_applique then format('par rapport à l''état de départ (%s libellé(s) en écart sur %s ; %s par rapport à l''état corrigé) : ', e.nb_depart, e.suivis, e.nb_applique) || e.ecarts_depart
                        else format('par rapport à l''état corrigé (%s libellé(s) en écart sur %s ; %s par rapport à l''état de départ) : ', e.nb_applique, e.suivis, e.nb_depart) || e.ecarts_applique end end as etat,
       '(total)' as zone, null::text as libelle_corrige, t.attendus as points_au_releve, t.trouves_nouveaux as a_remettre,
       null::text as ancien_libelle, null::int as portent_l_ancien, null::text as modeles_vises,
       t.empreinte_libelles, t.empreinte_autres_colonnes, t.empreinte_points_suivis
from etat e cross join t
union all
select c.n,
       case when ja.ok_applique and jn.ok_applique then 'à remettre'
              when ja.ok_depart and jn.ok_depart then 'ancien en place'
              else 'ÉCART' end,
       c.zone, c.nouveau, c.points,
       (select count(*)::int from pts p where c.zone = p.zone and c.nouveau = p.libelle and case when p.inscrit is null then not c.liste else c.n = p.inscrit end),
       c.ancien, ja.trouves,
       case when c.liste then format('%s modèle(s) listé(s)', c.points)
            when g.listes > 0 then format('tous sauf %s modèle(s) listé(s)', g.listes)
            else 'tous' end,
       null, null, null
from corr c
join mesure ja on ja.zone = c.zone and ja.libelle = c.ancien
join mesure jn on jn.zone = c.zone and jn.libelle = c.nouveau
cross join lateral (select count(*)::int as listes from places pl where pl.zone = c.zone and pl.libelle = c.nouveau) g
order by ligne;
