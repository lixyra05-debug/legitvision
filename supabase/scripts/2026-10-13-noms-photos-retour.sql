-- ============================================================================
-- LegitVision — noms des photos à l'envoi : LE RETOUR ARRIÈRE (écriture)
-- Préparé d'après le relevé de production du 2026-10-13 (lecture seule).
-- Fichier généré : ne pas le retoucher (outils/2026-10-13-noms-photos/generer.mjs).
--
-- EN BREF
--   À ne lancer que pour défaire l'aller (2026-10-13-noms-photos-aller.sql).
--   Ce fichier ne contient qu'UNE instruction : le bloc « do … ». Le coller
--   seul, en entier, dans l'éditeur SQL de Supabase (projet de production) et
--   cliquer « Run ».
--   AVANT : lancer la requête d'état (2026-10-13-noms-photos-etat.sql). Sa
--   première ligne doit commencer par « APPLIQUÉ ». Sinon, ne pas lancer ce
--   bloc.
--   CE BLOC n'affiche aucune ligne (« Success. No rows returned »).
--   APRÈS : relancer la requête d'état. Sa première ligne doit de nouveau
--   commencer par « PRÊT : 284 noms de photos à corriger dans 71 lignes de
--   marque », et son empreinte des noms doit être celle d'avant l'aller :
--   5dd4011eb6d10aafc4dc4f645d2df213.
--   JAMAIS pendant la mesure des 60 paires : ces noms partent dans la
--   consigne envoyée à l'IA.
--
-- CE QUE FAIT CE BLOC
--   Il remet, emplacement par emplacement, les 284 anciens noms relevés le
--   2026-10-13 dans les 71 lignes de marque que l'aller a corrigées
--   (plusieurs anciens noms ont reçu le même nouveau : la liste dit lequel
--   revient où). Seule la clé « label » change.
--
-- TOUT OU RIEN
--   Le bloc vérifie d'abord que la table est exactement dans l'état laissé
--   par l'aller (empreinte a7935327f8a1c045d2ef70267e238aca). Il écrit, puis
--   vérifie que le résultat est exactement l'état du relevé (empreinte
--   5dd4011eb6d10aafc4dc4f645d2df213), que 71 lignes ont été écrites et que
--   les autres colonnes n'ont pas bougé. Au moindre écart, une erreur annule
--   TOUT : rien n'est écrit. Relancé sur une table déjà revenue, il n'écrit
--   rien.
--   Si la table a changé depuis l'aller (une marque ajoutée, un protocole
--   retouché), le bloc refuse : un retour adapté se prépare alors comme un
--   script neuf.
--
-- SI ÇA NE SE PASSE PAS COMME PRÉVU
--   - Erreur « syntax error » ou « unterminated dollar-quoted string » : le
--     bloc a été collé incomplet. Rien n'a été lancé ; le recoller en entier.
--   - Erreur « canceling statement due to lock timeout » : la table était
--     occupée. Rien n'est écrit ; relancer le bloc.
--   - Erreur qui commence par « NOMS DES PHOTOS » : rien n'est écrit ; ne
--     pas relancer, transmettre le message.
--   - Une fenêtre de confirmation de Supabase (« Potential issue
--     detected ») : annuler, vider l'éditeur, recoller le bloc seul.
-- ============================================================================

do $bloc$
declare
  v_avant constant text := '5dd4011eb6d10aafc4dc4f645d2df213';
  v_apres constant text := 'a7935327f8a1c045d2ef70267e238aca';
  -- Un élément par emplacement corrigé : la ligne de marque, la position de la photo, son identifiant, l'ancien nom à remettre, le nouveau qu'il porte.
  v_retours constant jsonb := $retours$[
  {"id":"033587de-d349-42b3-b1ab-07f604e28555","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"08b9f922-f8b4-4ddc-84f5-cd68f31514cc","pos":1,"nom":"front_full","ancien":"Vue de face complete","nouveau":"Vue de face complète"},
  {"id":"08b9f922-f8b4-4ddc-84f5-cd68f31514cc","pos":2,"nom":"back_full","ancien":"Vue arriere complete","nouveau":"Vue arrière complète"},
  {"id":"08b9f922-f8b4-4ddc-84f5-cd68f31514cc","pos":3,"nom":"label_neck","ancien":"Etiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"08b9f922-f8b4-4ddc-84f5-cd68f31514cc","pos":4,"nom":"label_wash","ancien":"Etiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"08b9f922-f8b4-4ddc-84f5-cd68f31514cc","pos":6,"nom":"material_closeup","ancien":"Texture matiere (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"0d08d656-116f-4731-bdad-72e9be0d4ff2","pos":1,"nom":"front_full","ancien":"Vue de face complete","nouveau":"Vue de face complète"},
  {"id":"0d08d656-116f-4731-bdad-72e9be0d4ff2","pos":2,"nom":"back_full","ancien":"Vue arriere complete","nouveau":"Vue arrière complète"},
  {"id":"0d08d656-116f-4731-bdad-72e9be0d4ff2","pos":3,"nom":"label_neck","ancien":"Etiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"0d08d656-116f-4731-bdad-72e9be0d4ff2","pos":4,"nom":"label_wash","ancien":"Etiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"0d08d656-116f-4731-bdad-72e9be0d4ff2","pos":6,"nom":"material_closeup","ancien":"Texture matiere (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"0e2dd8b6-73df-426c-8824-1d4e41d924b4","pos":1,"nom":"front_full","ancien":"Vue de face complete","nouveau":"Vue de face complète"},
  {"id":"0e2dd8b6-73df-426c-8824-1d4e41d924b4","pos":2,"nom":"back_full","ancien":"Vue arriere complete","nouveau":"Vue arrière complète"},
  {"id":"0e2dd8b6-73df-426c-8824-1d4e41d924b4","pos":3,"nom":"label_neck","ancien":"Etiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"0e2dd8b6-73df-426c-8824-1d4e41d924b4","pos":4,"nom":"label_wash","ancien":"Etiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"0e2dd8b6-73df-426c-8824-1d4e41d924b4","pos":6,"nom":"material_closeup","ancien":"Texture matiere (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"19784378-7cea-4a4f-a95d-234c2a0c7488","pos":3,"nom":"neck_label","ancien":"Étiquette col","nouveau":"Étiquette de col"},
  {"id":"19784378-7cea-4a4f-a95d-234c2a0c7488","pos":4,"nom":"wash_label","ancien":"Étiquette de lavage","nouveau":"Étiquette d'entretien"},
  {"id":"19784378-7cea-4a4f-a95d-234c2a0c7488","pos":5,"nom":"print_detail","ancien":"Détail print/broderie","nouveau":"Imprimé et broderie (gros plan)"},
  {"id":"19784378-7cea-4a4f-a95d-234c2a0c7488","pos":6,"nom":"tags_packaging","ancien":"Tags et emballage","nouveau":"Étiquettes volantes et emballage"},
  {"id":"1d7b9f24-b556-442b-884b-d3008aea4105","pos":3,"nom":"sole_bottom","ancien":"Semelle dessous","nouveau":"Semelle extérieure (dessous)"},
  {"id":"1d7b9f24-b556-442b-884b-d3008aea4105","pos":4,"nom":"tongue_label","ancien":"Étiquette de langue","nouveau":"Étiquette de languette"},
  {"id":"1d7b9f24-b556-442b-884b-d3008aea4105","pos":6,"nom":"logo_closeup","ancien":"Logo gros plan","nouveau":"Logo (gros plan)"},
  {"id":"1d7b9f24-b556-442b-884b-d3008aea4105","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"1d7b9f24-b556-442b-884b-d3008aea4105","pos":8,"nom":"stitching_detail","ancien":"Détail coutures","nouveau":"Coutures (gros plan)"},
  {"id":"1db22b77-d75e-4f05-a6e8-8b0919227b59","pos":3,"nom":"label_neck","ancien":"Étiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"1db22b77-d75e-4f05-a6e8-8b0919227b59","pos":4,"nom":"label_wash","ancien":"Étiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"1db22b77-d75e-4f05-a6e8-8b0919227b59","pos":6,"nom":"zipper_detail","ancien":"Fermeture zip (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"1db22b77-d75e-4f05-a6e8-8b0919227b59","pos":7,"nom":"material_closeup","ancien":"Texture matière (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"21219398-53ac-426f-bf62-c8aa89100232","pos":3,"nom":"sole_bottom","ancien":"Semelle dessous","nouveau":"Semelle extérieure (dessous)"},
  {"id":"21219398-53ac-426f-bf62-c8aa89100232","pos":4,"nom":"tongue_label","ancien":"Étiquette de langue","nouveau":"Étiquette de languette"},
  {"id":"21219398-53ac-426f-bf62-c8aa89100232","pos":6,"nom":"logo_closeup","ancien":"Logo gros plan","nouveau":"Logo (gros plan)"},
  {"id":"21219398-53ac-426f-bf62-c8aa89100232","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"21219398-53ac-426f-bf62-c8aa89100232","pos":8,"nom":"stitching_detail","ancien":"Détail coutures","nouveau":"Coutures (gros plan)"},
  {"id":"2189b72b-51c8-4c01-978b-d691e96f2b8d","pos":1,"nom":"front_full","ancien":"Vue de face complete","nouveau":"Vue de face complète"},
  {"id":"2189b72b-51c8-4c01-978b-d691e96f2b8d","pos":2,"nom":"back_full","ancien":"Vue arriere complete","nouveau":"Vue arrière complète"},
  {"id":"2189b72b-51c8-4c01-978b-d691e96f2b8d","pos":3,"nom":"label_neck","ancien":"Etiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"2189b72b-51c8-4c01-978b-d691e96f2b8d","pos":4,"nom":"label_wash","ancien":"Etiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"2189b72b-51c8-4c01-978b-d691e96f2b8d","pos":6,"nom":"material_closeup","ancien":"Texture matiere (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"22cc1d74-fac6-4272-89c9-00007c395ddd","pos":3,"nom":"label_neck","ancien":"Étiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"22cc1d74-fac6-4272-89c9-00007c395ddd","pos":4,"nom":"label_wash","ancien":"Étiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"22cc1d74-fac6-4272-89c9-00007c395ddd","pos":6,"nom":"zipper_detail","ancien":"Fermeture zip (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"22cc1d74-fac6-4272-89c9-00007c395ddd","pos":7,"nom":"material_closeup","ancien":"Texture matière (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"283d9f76-921f-44a1-8ef9-0fb90416e3dc","pos":3,"nom":"neck_label","ancien":"Étiquette col","nouveau":"Étiquette de col"},
  {"id":"283d9f76-921f-44a1-8ef9-0fb90416e3dc","pos":4,"nom":"wash_label","ancien":"Étiquette de lavage","nouveau":"Étiquette d'entretien"},
  {"id":"283d9f76-921f-44a1-8ef9-0fb90416e3dc","pos":5,"nom":"print_detail","ancien":"Détail print/broderie","nouveau":"Imprimé et broderie (gros plan)"},
  {"id":"283d9f76-921f-44a1-8ef9-0fb90416e3dc","pos":6,"nom":"tags_packaging","ancien":"Tags et emballage","nouveau":"Étiquettes volantes et emballage"},
  {"id":"29f9697b-58f3-4176-a9e5-0c25ef9967cc","pos":3,"nom":"sole_bottom","ancien":"Semelle (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"29f9697b-58f3-4176-a9e5-0c25ef9967cc","pos":6,"nom":"tag_size","ancien":"Étiquette taille","nouveau":"Étiquette de taille"},
  {"id":"29f9697b-58f3-4176-a9e5-0c25ef9967cc","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"2bd8387f-0933-4b62-b962-316384c4b184","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"2dec5f1e-8c4d-4729-a173-dbcb20a0eadc","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"2dec5f1e-8c4d-4729-a173-dbcb20a0eadc","pos":3,"nom":"overall_side_lateral","ancien":"Vue laterale","nouveau":"Vue latérale"},
  {"id":"2dec5f1e-8c4d-4729-a173-dbcb20a0eadc","pos":4,"nom":"outsole","ancien":"Semelle exterieure (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"2dec5f1e-8c4d-4729-a173-dbcb20a0eadc","pos":6,"nom":"tongue_label","ancien":"Etiquette de languette","nouveau":"Étiquette de languette"},
  {"id":"2dec5f1e-8c4d-4729-a173-dbcb20a0eadc","pos":7,"nom":"size_tag","ancien":"Etiquette de taille","nouveau":"Étiquette de taille"},
  {"id":"2dec5f1e-8c4d-4729-a173-dbcb20a0eadc","pos":8,"nom":"insole","ancien":"Semelle interieure","nouveau":"Semelle intérieure"},
  {"id":"2dec5f1e-8c4d-4729-a173-dbcb20a0eadc","pos":9,"nom":"box_label","ancien":"Etiquette de la boite","nouveau":"Étiquette de la boîte"},
  {"id":"31a7c3b5-344a-45d9-9db6-2653e6102c40","pos":3,"nom":"sole_bottom","ancien":"Semelle (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"31a7c3b5-344a-45d9-9db6-2653e6102c40","pos":6,"nom":"tag_size","ancien":"Étiquette taille","nouveau":"Étiquette de taille"},
  {"id":"31a7c3b5-344a-45d9-9db6-2653e6102c40","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"327a486c-2598-4886-a7f5-84efccb90144","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"327a486c-2598-4886-a7f5-84efccb90144","pos":3,"nom":"overall_side_lateral","ancien":"Vue laterale","nouveau":"Vue latérale"},
  {"id":"327a486c-2598-4886-a7f5-84efccb90144","pos":4,"nom":"outsole","ancien":"Semelle exterieure (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"327a486c-2598-4886-a7f5-84efccb90144","pos":6,"nom":"tongue_label","ancien":"Etiquette de languette","nouveau":"Étiquette de languette"},
  {"id":"327a486c-2598-4886-a7f5-84efccb90144","pos":7,"nom":"size_tag","ancien":"Etiquette de taille","nouveau":"Étiquette de taille"},
  {"id":"327a486c-2598-4886-a7f5-84efccb90144","pos":8,"nom":"insole","ancien":"Semelle interieure","nouveau":"Semelle intérieure"},
  {"id":"327a486c-2598-4886-a7f5-84efccb90144","pos":9,"nom":"box_label","ancien":"Etiquette de la boite","nouveau":"Étiquette de la boîte"},
  {"id":"333c9cf8-8d60-4011-9c12-6671158bff3e","pos":1,"nom":"front_full","ancien":"Vue de face complete","nouveau":"Vue de face complète"},
  {"id":"333c9cf8-8d60-4011-9c12-6671158bff3e","pos":2,"nom":"back_full","ancien":"Vue arriere complete","nouveau":"Vue arrière complète"},
  {"id":"333c9cf8-8d60-4011-9c12-6671158bff3e","pos":3,"nom":"label_neck","ancien":"Etiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"333c9cf8-8d60-4011-9c12-6671158bff3e","pos":4,"nom":"label_wash","ancien":"Etiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"333c9cf8-8d60-4011-9c12-6671158bff3e","pos":6,"nom":"material_closeup","ancien":"Texture matiere (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"379f68ff-27a4-4abd-9c21-d4ae4559ac86","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"379f68ff-27a4-4abd-9c21-d4ae4559ac86","pos":3,"nom":"overall_side_lateral","ancien":"Vue laterale","nouveau":"Vue latérale"},
  {"id":"379f68ff-27a4-4abd-9c21-d4ae4559ac86","pos":4,"nom":"outsole","ancien":"Semelle exterieure (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"379f68ff-27a4-4abd-9c21-d4ae4559ac86","pos":6,"nom":"tongue_label","ancien":"Etiquette de languette","nouveau":"Étiquette de languette"},
  {"id":"379f68ff-27a4-4abd-9c21-d4ae4559ac86","pos":7,"nom":"size_tag","ancien":"Etiquette de taille","nouveau":"Étiquette de taille"},
  {"id":"379f68ff-27a4-4abd-9c21-d4ae4559ac86","pos":8,"nom":"insole","ancien":"Semelle interieure","nouveau":"Semelle intérieure"},
  {"id":"39847481-085f-453c-8d70-54f5ef230430","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"39847481-085f-453c-8d70-54f5ef230430","pos":3,"nom":"overall_side_lateral","ancien":"Vue laterale","nouveau":"Vue latérale"},
  {"id":"39847481-085f-453c-8d70-54f5ef230430","pos":4,"nom":"outsole","ancien":"Semelle exterieure (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"39847481-085f-453c-8d70-54f5ef230430","pos":6,"nom":"tongue_label","ancien":"Etiquette de languette","nouveau":"Étiquette de languette"},
  {"id":"39847481-085f-453c-8d70-54f5ef230430","pos":7,"nom":"size_tag","ancien":"Etiquette de taille","nouveau":"Étiquette de taille"},
  {"id":"39847481-085f-453c-8d70-54f5ef230430","pos":8,"nom":"insole","ancien":"Semelle interieure","nouveau":"Semelle intérieure"},
  {"id":"39847481-085f-453c-8d70-54f5ef230430","pos":9,"nom":"box_label","ancien":"Etiquette de la boite","nouveau":"Étiquette de la boîte"},
  {"id":"3bac468d-8a07-4d56-b5fa-bd11a7a75c12","pos":3,"nom":"label_neck","ancien":"Étiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"3bac468d-8a07-4d56-b5fa-bd11a7a75c12","pos":4,"nom":"label_wash","ancien":"Étiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"3bac468d-8a07-4d56-b5fa-bd11a7a75c12","pos":6,"nom":"zipper_detail","ancien":"Fermeture zip (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"3bac468d-8a07-4d56-b5fa-bd11a7a75c12","pos":7,"nom":"material_closeup","ancien":"Texture matière (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"3e768b10-b4fe-4961-a67b-7daf9dfc177d","pos":7,"nom":"hardware","ancien":"Quincaillerie / fermetures","nouveau":"Pièces métalliques et fermetures"},
  {"id":"3f3a6fc8-f1b6-489d-ab38-8ab41ad1b220","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"40220b79-20e9-45eb-b03a-3e5c23ac3274","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"40aee135-f1ad-4dbf-87d3-4ee176fbcdd7","pos":7,"nom":"hardware","ancien":"Quincaillerie / fermetures","nouveau":"Pièces métalliques et fermetures"},
  {"id":"41aca792-5422-4d56-ac02-9a0f093ed0dc","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"41aca792-5422-4d56-ac02-9a0f093ed0dc","pos":3,"nom":"overall_side","ancien":"Vue de cote","nouveau":"Vue de côté"},
  {"id":"41aca792-5422-4d56-ac02-9a0f093ed0dc","pos":4,"nom":"interior","ancien":"Interieur du sac","nouveau":"Intérieur du sac"},
  {"id":"41aca792-5422-4d56-ac02-9a0f093ed0dc","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"41aca792-5422-4d56-ac02-9a0f093ed0dc","pos":7,"nom":"serial_tag","ancien":"Numero de serie / code date","nouveau":"Numéro de série / code date"},
  {"id":"41aca792-5422-4d56-ac02-9a0f093ed0dc","pos":10,"nom":"zipper_closeup","ancien":"Fermeture eclair (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"46f6739d-54f2-4738-bd1f-20c70b763144","pos":3,"nom":"label_neck","ancien":"Étiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"46f6739d-54f2-4738-bd1f-20c70b763144","pos":4,"nom":"label_wash","ancien":"Étiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"46f6739d-54f2-4738-bd1f-20c70b763144","pos":6,"nom":"zipper_detail","ancien":"Fermeture zip (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"46f6739d-54f2-4738-bd1f-20c70b763144","pos":7,"nom":"material_closeup","ancien":"Texture matière (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"49b0cde1-b824-4b54-b427-ca3c28547918","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"49b0cde1-b824-4b54-b427-ca3c28547918","pos":3,"nom":"overall_side_lateral","ancien":"Vue laterale","nouveau":"Vue latérale"},
  {"id":"49b0cde1-b824-4b54-b427-ca3c28547918","pos":4,"nom":"outsole","ancien":"Semelle exterieure (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"49b0cde1-b824-4b54-b427-ca3c28547918","pos":6,"nom":"tongue_label","ancien":"Etiquette de languette","nouveau":"Étiquette de languette"},
  {"id":"49b0cde1-b824-4b54-b427-ca3c28547918","pos":7,"nom":"size_tag","ancien":"Etiquette de taille","nouveau":"Étiquette de taille"},
  {"id":"49b0cde1-b824-4b54-b427-ca3c28547918","pos":8,"nom":"insole","ancien":"Semelle interieure","nouveau":"Semelle intérieure"},
  {"id":"49b0cde1-b824-4b54-b427-ca3c28547918","pos":9,"nom":"box_label","ancien":"Etiquette de la boite","nouveau":"Étiquette de la boîte"},
  {"id":"49d63b2f-09f5-4e01-b2bc-18effc28ec2e","pos":7,"nom":"hardware","ancien":"Quincaillerie / fermetures","nouveau":"Pièces métalliques et fermetures"},
  {"id":"4ac0957b-0a68-4623-8e67-fda8062478f8","pos":3,"nom":"sole_bottom","ancien":"Semelle (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"4ac0957b-0a68-4623-8e67-fda8062478f8","pos":6,"nom":"tag_size","ancien":"Étiquette taille","nouveau":"Étiquette de taille"},
  {"id":"4ac0957b-0a68-4623-8e67-fda8062478f8","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"4b1abf0a-f0d2-484a-b022-dd6bc38336a0","pos":3,"nom":"sole_bottom","ancien":"Semelle (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"4b1abf0a-f0d2-484a-b022-dd6bc38336a0","pos":5,"nom":"tag_size","ancien":"Étiquette taille","nouveau":"Étiquette de taille"},
  {"id":"4d69ee4a-5049-475f-9f24-a834df85f06d","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"4d69ee4a-5049-475f-9f24-a834df85f06d","pos":3,"nom":"overall_side_lateral","ancien":"Vue laterale","nouveau":"Vue latérale"},
  {"id":"4d69ee4a-5049-475f-9f24-a834df85f06d","pos":4,"nom":"outsole","ancien":"Semelle exterieure (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"4d69ee4a-5049-475f-9f24-a834df85f06d","pos":6,"nom":"tongue_label","ancien":"Etiquette de languette","nouveau":"Étiquette de languette"},
  {"id":"4d69ee4a-5049-475f-9f24-a834df85f06d","pos":7,"nom":"size_tag","ancien":"Etiquette de taille","nouveau":"Étiquette de taille"},
  {"id":"4d69ee4a-5049-475f-9f24-a834df85f06d","pos":8,"nom":"insole","ancien":"Semelle interieure","nouveau":"Semelle intérieure"},
  {"id":"4d69ee4a-5049-475f-9f24-a834df85f06d","pos":9,"nom":"box_label","ancien":"Etiquette de la boite","nouveau":"Étiquette de la boîte"},
  {"id":"523c8c01-e2be-4a05-bf41-eab08ee6b7f8","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"54992e55-0494-407c-9043-5dc5a5a029b5","pos":3,"nom":"sole_bottom","ancien":"Semelle dessous","nouveau":"Semelle extérieure (dessous)"},
  {"id":"54992e55-0494-407c-9043-5dc5a5a029b5","pos":4,"nom":"tongue_label","ancien":"Étiquette de langue","nouveau":"Étiquette de languette"},
  {"id":"54992e55-0494-407c-9043-5dc5a5a029b5","pos":6,"nom":"logo_closeup","ancien":"Logo gros plan","nouveau":"Logo (gros plan)"},
  {"id":"54992e55-0494-407c-9043-5dc5a5a029b5","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"54992e55-0494-407c-9043-5dc5a5a029b5","pos":8,"nom":"stitching_detail","ancien":"Détail coutures","nouveau":"Coutures (gros plan)"},
  {"id":"55b70852-f10b-46fb-851c-b5b505e2a367","pos":3,"nom":"label_neck","ancien":"Étiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"55b70852-f10b-46fb-851c-b5b505e2a367","pos":4,"nom":"label_wash","ancien":"Étiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"55b70852-f10b-46fb-851c-b5b505e2a367","pos":6,"nom":"zipper_detail","ancien":"Fermeture zip (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"55b70852-f10b-46fb-851c-b5b505e2a367","pos":7,"nom":"material_closeup","ancien":"Texture matière (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"59f3a036-11cd-483e-b479-1a005fb76260","pos":1,"nom":"front_full","ancien":"Vue de face complete","nouveau":"Vue de face complète"},
  {"id":"59f3a036-11cd-483e-b479-1a005fb76260","pos":2,"nom":"back_full","ancien":"Vue arriere complete","nouveau":"Vue arrière complète"},
  {"id":"59f3a036-11cd-483e-b479-1a005fb76260","pos":3,"nom":"label_neck","ancien":"Etiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"59f3a036-11cd-483e-b479-1a005fb76260","pos":4,"nom":"label_wash","ancien":"Etiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"59f3a036-11cd-483e-b479-1a005fb76260","pos":6,"nom":"material_closeup","ancien":"Texture matiere (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"5d1596ec-34b4-4f35-952f-f8ff47e58213","pos":3,"nom":"label_neck","ancien":"Étiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"5d1596ec-34b4-4f35-952f-f8ff47e58213","pos":4,"nom":"label_wash","ancien":"Étiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"5d1596ec-34b4-4f35-952f-f8ff47e58213","pos":6,"nom":"zipper_detail","ancien":"Fermeture zip (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"5d1596ec-34b4-4f35-952f-f8ff47e58213","pos":7,"nom":"material_closeup","ancien":"Texture matière (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"5da68710-dcb7-487a-adf4-dc943a1199de","pos":3,"nom":"sole_bottom","ancien":"Semelle dessous","nouveau":"Semelle extérieure (dessous)"},
  {"id":"5da68710-dcb7-487a-adf4-dc943a1199de","pos":4,"nom":"tongue_label","ancien":"Étiquette de langue","nouveau":"Étiquette de languette"},
  {"id":"5da68710-dcb7-487a-adf4-dc943a1199de","pos":6,"nom":"logo_closeup","ancien":"Logo gros plan","nouveau":"Logo (gros plan)"},
  {"id":"5da68710-dcb7-487a-adf4-dc943a1199de","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"5da68710-dcb7-487a-adf4-dc943a1199de","pos":8,"nom":"stitching_detail","ancien":"Détail coutures","nouveau":"Coutures (gros plan)"},
  {"id":"5e822d60-c34f-4a18-a708-b9a3e634ddc5","pos":3,"nom":"label_neck","ancien":"Étiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"5e822d60-c34f-4a18-a708-b9a3e634ddc5","pos":4,"nom":"label_wash","ancien":"Étiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"5e822d60-c34f-4a18-a708-b9a3e634ddc5","pos":6,"nom":"zipper_detail","ancien":"Fermeture zip (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"5e822d60-c34f-4a18-a708-b9a3e634ddc5","pos":7,"nom":"material_closeup","ancien":"Texture matière (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"67fd00fb-b201-4fb3-b1a4-ddfa140daa87","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"67fd00fb-b201-4fb3-b1a4-ddfa140daa87","pos":3,"nom":"overall_side_lateral","ancien":"Vue laterale","nouveau":"Vue latérale"},
  {"id":"67fd00fb-b201-4fb3-b1a4-ddfa140daa87","pos":4,"nom":"outsole","ancien":"Semelle exterieure (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"67fd00fb-b201-4fb3-b1a4-ddfa140daa87","pos":6,"nom":"tongue_label","ancien":"Etiquette de languette","nouveau":"Étiquette de languette"},
  {"id":"67fd00fb-b201-4fb3-b1a4-ddfa140daa87","pos":7,"nom":"size_tag","ancien":"Etiquette de taille","nouveau":"Étiquette de taille"},
  {"id":"67fd00fb-b201-4fb3-b1a4-ddfa140daa87","pos":8,"nom":"insole","ancien":"Semelle interieure","nouveau":"Semelle intérieure"},
  {"id":"67fd00fb-b201-4fb3-b1a4-ddfa140daa87","pos":9,"nom":"box_label","ancien":"Etiquette de la boite","nouveau":"Étiquette de la boîte"},
  {"id":"6960eced-7a80-40e4-90e8-cc734bd1e005","pos":3,"nom":"neck_label","ancien":"Étiquette col","nouveau":"Étiquette de col"},
  {"id":"6960eced-7a80-40e4-90e8-cc734bd1e005","pos":4,"nom":"wash_label","ancien":"Étiquette de lavage","nouveau":"Étiquette d'entretien"},
  {"id":"6960eced-7a80-40e4-90e8-cc734bd1e005","pos":5,"nom":"print_detail","ancien":"Détail print/broderie","nouveau":"Imprimé et broderie (gros plan)"},
  {"id":"6960eced-7a80-40e4-90e8-cc734bd1e005","pos":6,"nom":"tags_packaging","ancien":"Tags et emballage","nouveau":"Étiquettes volantes et emballage"},
  {"id":"6c4d6606-311f-4075-89f2-d745f2162aa3","pos":3,"nom":"sole_bottom","ancien":"Semelle dessous","nouveau":"Semelle extérieure (dessous)"},
  {"id":"6c4d6606-311f-4075-89f2-d745f2162aa3","pos":4,"nom":"tongue_label","ancien":"Étiquette de langue","nouveau":"Étiquette de languette"},
  {"id":"6c4d6606-311f-4075-89f2-d745f2162aa3","pos":6,"nom":"logo_closeup","ancien":"Logo gros plan","nouveau":"Logo (gros plan)"},
  {"id":"6c4d6606-311f-4075-89f2-d745f2162aa3","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"6c4d6606-311f-4075-89f2-d745f2162aa3","pos":8,"nom":"stitching_detail","ancien":"Détail coutures","nouveau":"Coutures (gros plan)"},
  {"id":"6ce5bd7b-5fdc-4e85-a034-99e57885b4b8","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"6d1e1047-27df-40a7-97ee-9b374e7db0b4","pos":3,"nom":"label_neck","ancien":"Étiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"6d1e1047-27df-40a7-97ee-9b374e7db0b4","pos":4,"nom":"label_wash","ancien":"Étiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"6d1e1047-27df-40a7-97ee-9b374e7db0b4","pos":6,"nom":"zipper_detail","ancien":"Fermeture zip (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"6d1e1047-27df-40a7-97ee-9b374e7db0b4","pos":7,"nom":"material_closeup","ancien":"Texture matière (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"6d654d6d-33be-4de6-8a23-6d85303e6599","pos":3,"nom":"sole_bottom","ancien":"Semelle dessous","nouveau":"Semelle extérieure (dessous)"},
  {"id":"6d654d6d-33be-4de6-8a23-6d85303e6599","pos":4,"nom":"tongue_label","ancien":"Étiquette de langue","nouveau":"Étiquette de languette"},
  {"id":"6d654d6d-33be-4de6-8a23-6d85303e6599","pos":6,"nom":"logo_closeup","ancien":"Logo gros plan","nouveau":"Logo (gros plan)"},
  {"id":"6d654d6d-33be-4de6-8a23-6d85303e6599","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"6d654d6d-33be-4de6-8a23-6d85303e6599","pos":8,"nom":"stitching_detail","ancien":"Détail coutures","nouveau":"Coutures (gros plan)"},
  {"id":"715b5b34-47b8-47f8-b444-2f6ae4c7598e","pos":3,"nom":"neck_label","ancien":"Étiquette col","nouveau":"Étiquette de col"},
  {"id":"715b5b34-47b8-47f8-b444-2f6ae4c7598e","pos":4,"nom":"wash_label","ancien":"Étiquette de lavage","nouveau":"Étiquette d'entretien"},
  {"id":"715b5b34-47b8-47f8-b444-2f6ae4c7598e","pos":5,"nom":"print_detail","ancien":"Détail print/broderie","nouveau":"Imprimé et broderie (gros plan)"},
  {"id":"715b5b34-47b8-47f8-b444-2f6ae4c7598e","pos":6,"nom":"tags_packaging","ancien":"Tags et emballage","nouveau":"Étiquettes volantes et emballage"},
  {"id":"7801b45b-a000-441d-8e4a-2edaa0e554aa","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"7801b45b-a000-441d-8e4a-2edaa0e554aa","pos":3,"nom":"overall_side","ancien":"Vue de cote","nouveau":"Vue de côté"},
  {"id":"7801b45b-a000-441d-8e4a-2edaa0e554aa","pos":4,"nom":"interior","ancien":"Interieur du sac","nouveau":"Intérieur du sac"},
  {"id":"7801b45b-a000-441d-8e4a-2edaa0e554aa","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"7801b45b-a000-441d-8e4a-2edaa0e554aa","pos":7,"nom":"serial_tag","ancien":"Numero de serie / code date","nouveau":"Numéro de série / code date"},
  {"id":"7801b45b-a000-441d-8e4a-2edaa0e554aa","pos":10,"nom":"zipper_closeup","ancien":"Fermeture eclair (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"780b58ce-b586-43b2-a6a5-48395af62792","pos":3,"nom":"neck_label","ancien":"Étiquette col","nouveau":"Étiquette de col"},
  {"id":"780b58ce-b586-43b2-a6a5-48395af62792","pos":4,"nom":"wash_label","ancien":"Étiquette de lavage","nouveau":"Étiquette d'entretien"},
  {"id":"780b58ce-b586-43b2-a6a5-48395af62792","pos":5,"nom":"print_detail","ancien":"Détail print/broderie","nouveau":"Imprimé et broderie (gros plan)"},
  {"id":"780b58ce-b586-43b2-a6a5-48395af62792","pos":6,"nom":"tags_packaging","ancien":"Tags et emballage","nouveau":"Étiquettes volantes et emballage"},
  {"id":"7b29ee97-ee98-4a31-8231-5e86c8a2bf9d","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"7b29ee97-ee98-4a31-8231-5e86c8a2bf9d","pos":3,"nom":"overall_side_lateral","ancien":"Vue laterale","nouveau":"Vue latérale"},
  {"id":"7b29ee97-ee98-4a31-8231-5e86c8a2bf9d","pos":4,"nom":"outsole","ancien":"Semelle exterieure (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"7b29ee97-ee98-4a31-8231-5e86c8a2bf9d","pos":6,"nom":"tongue_label","ancien":"Etiquette de languette","nouveau":"Étiquette de languette"},
  {"id":"7b29ee97-ee98-4a31-8231-5e86c8a2bf9d","pos":7,"nom":"size_tag","ancien":"Etiquette de taille","nouveau":"Étiquette de taille"},
  {"id":"7b29ee97-ee98-4a31-8231-5e86c8a2bf9d","pos":8,"nom":"insole","ancien":"Semelle interieure","nouveau":"Semelle intérieure"},
  {"id":"928760a4-d45e-4d91-9c6e-b4faecac1718","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"928760a4-d45e-4d91-9c6e-b4faecac1718","pos":3,"nom":"overall_side_lateral","ancien":"Vue laterale","nouveau":"Vue latérale"},
  {"id":"928760a4-d45e-4d91-9c6e-b4faecac1718","pos":4,"nom":"outsole","ancien":"Semelle exterieure (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"928760a4-d45e-4d91-9c6e-b4faecac1718","pos":6,"nom":"tongue_label","ancien":"Etiquette de languette","nouveau":"Étiquette de languette"},
  {"id":"928760a4-d45e-4d91-9c6e-b4faecac1718","pos":7,"nom":"size_tag","ancien":"Etiquette de taille","nouveau":"Étiquette de taille"},
  {"id":"928760a4-d45e-4d91-9c6e-b4faecac1718","pos":8,"nom":"insole","ancien":"Semelle interieure","nouveau":"Semelle intérieure"},
  {"id":"928760a4-d45e-4d91-9c6e-b4faecac1718","pos":9,"nom":"box_label","ancien":"Etiquette de la boite","nouveau":"Étiquette de la boîte"},
  {"id":"9942bd66-dfad-44e4-b0c5-fd5ffd093ddc","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"a01c470b-39f5-4f64-94b6-7db74d848699","pos":1,"nom":"front_full","ancien":"Vue de face complete","nouveau":"Vue de face complète"},
  {"id":"a01c470b-39f5-4f64-94b6-7db74d848699","pos":2,"nom":"back_full","ancien":"Vue arriere complete","nouveau":"Vue arrière complète"},
  {"id":"a01c470b-39f5-4f64-94b6-7db74d848699","pos":3,"nom":"label_neck","ancien":"Etiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"a01c470b-39f5-4f64-94b6-7db74d848699","pos":4,"nom":"label_wash","ancien":"Etiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"a01c470b-39f5-4f64-94b6-7db74d848699","pos":6,"nom":"material_closeup","ancien":"Texture matiere (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"a0bc918b-8ce5-4c39-b50f-6529a7619e49","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"a17a67f8-f27e-4e9d-b0de-16dd7b9987e0","pos":7,"nom":"hardware","ancien":"Quincaillerie / fermetures","nouveau":"Pièces métalliques et fermetures"},
  {"id":"a2698cbd-f7f6-40c8-ba9c-18572e061d7a","pos":3,"nom":"neck_label","ancien":"Étiquette col","nouveau":"Étiquette de col"},
  {"id":"a2698cbd-f7f6-40c8-ba9c-18572e061d7a","pos":4,"nom":"wash_label","ancien":"Étiquette de lavage","nouveau":"Étiquette d'entretien"},
  {"id":"a2698cbd-f7f6-40c8-ba9c-18572e061d7a","pos":5,"nom":"print_detail","ancien":"Détail print/broderie","nouveau":"Imprimé et broderie (gros plan)"},
  {"id":"a2698cbd-f7f6-40c8-ba9c-18572e061d7a","pos":6,"nom":"tags_packaging","ancien":"Tags et emballage","nouveau":"Étiquettes volantes et emballage"},
  {"id":"a7d5c315-c5ad-40db-a864-ffee7c2988a4","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"a7d5c315-c5ad-40db-a864-ffee7c2988a4","pos":3,"nom":"overall_side","ancien":"Vue de cote","nouveau":"Vue de côté"},
  {"id":"a7d5c315-c5ad-40db-a864-ffee7c2988a4","pos":4,"nom":"interior","ancien":"Interieur du sac","nouveau":"Intérieur du sac"},
  {"id":"a7d5c315-c5ad-40db-a864-ffee7c2988a4","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"a7d5c315-c5ad-40db-a864-ffee7c2988a4","pos":7,"nom":"serial_tag","ancien":"Numero de serie / code date","nouveau":"Numéro de série / code date"},
  {"id":"a7d5c315-c5ad-40db-a864-ffee7c2988a4","pos":10,"nom":"zipper_closeup","ancien":"Fermeture eclair (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"aa8c7753-8686-436b-8afd-259bd98e1fbc","pos":3,"nom":"sole_bottom","ancien":"Semelle (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"aa8c7753-8686-436b-8afd-259bd98e1fbc","pos":6,"nom":"tag_size","ancien":"Étiquette taille","nouveau":"Étiquette de taille"},
  {"id":"aa8c7753-8686-436b-8afd-259bd98e1fbc","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"aab97e00-a33c-451b-b99b-48c5d4de7b1c","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"aab97e00-a33c-451b-b99b-48c5d4de7b1c","pos":3,"nom":"overall_side_lateral","ancien":"Vue laterale","nouveau":"Vue latérale"},
  {"id":"aab97e00-a33c-451b-b99b-48c5d4de7b1c","pos":4,"nom":"outsole","ancien":"Semelle exterieure (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"aab97e00-a33c-451b-b99b-48c5d4de7b1c","pos":6,"nom":"tongue_label","ancien":"Etiquette de languette","nouveau":"Étiquette de languette"},
  {"id":"aab97e00-a33c-451b-b99b-48c5d4de7b1c","pos":7,"nom":"size_tag","ancien":"Etiquette de taille","nouveau":"Étiquette de taille"},
  {"id":"aab97e00-a33c-451b-b99b-48c5d4de7b1c","pos":8,"nom":"insole","ancien":"Semelle interieure","nouveau":"Semelle intérieure"},
  {"id":"cb478f5e-4c07-48ee-9224-d9e4d758a4da","pos":1,"nom":"front_full","ancien":"Vue de face complete","nouveau":"Vue de face complète"},
  {"id":"cb478f5e-4c07-48ee-9224-d9e4d758a4da","pos":2,"nom":"back_full","ancien":"Vue arriere complete","nouveau":"Vue arrière complète"},
  {"id":"cb478f5e-4c07-48ee-9224-d9e4d758a4da","pos":3,"nom":"label_neck","ancien":"Etiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"cb478f5e-4c07-48ee-9224-d9e4d758a4da","pos":4,"nom":"label_wash","ancien":"Etiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"cb478f5e-4c07-48ee-9224-d9e4d758a4da","pos":6,"nom":"material_closeup","ancien":"Texture matiere (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"cd911b4c-80ed-4fc7-8e2c-aff7a1cc077e","pos":3,"nom":"label_neck","ancien":"Étiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"cd911b4c-80ed-4fc7-8e2c-aff7a1cc077e","pos":4,"nom":"label_wash","ancien":"Étiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"cd911b4c-80ed-4fc7-8e2c-aff7a1cc077e","pos":6,"nom":"zipper_detail","ancien":"Fermeture zip (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"cd911b4c-80ed-4fc7-8e2c-aff7a1cc077e","pos":7,"nom":"material_closeup","ancien":"Texture matière (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"cdd71719-d002-4f97-9023-6f325b8ecec3","pos":3,"nom":"sole_bottom","ancien":"Semelle dessous","nouveau":"Semelle extérieure (dessous)"},
  {"id":"cdd71719-d002-4f97-9023-6f325b8ecec3","pos":4,"nom":"tongue_label","ancien":"Étiquette de langue","nouveau":"Étiquette de languette"},
  {"id":"cdd71719-d002-4f97-9023-6f325b8ecec3","pos":6,"nom":"logo_closeup","ancien":"Logo gros plan","nouveau":"Logo (gros plan)"},
  {"id":"cdd71719-d002-4f97-9023-6f325b8ecec3","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"cdd71719-d002-4f97-9023-6f325b8ecec3","pos":8,"nom":"stitching_detail","ancien":"Détail coutures","nouveau":"Coutures (gros plan)"},
  {"id":"ce8fab65-7490-49e6-83b4-4bea42f42dbd","pos":3,"nom":"sole_bottom","ancien":"Semelle (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"ce8fab65-7490-49e6-83b4-4bea42f42dbd","pos":6,"nom":"tag_size","ancien":"Étiquette taille / QR code","nouveau":"Étiquette de taille / QR code"},
  {"id":"ce8fab65-7490-49e6-83b4-4bea42f42dbd","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"cfb32ed8-2258-416d-99fe-3b2af8721d68","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"cfb32ed8-2258-416d-99fe-3b2af8721d68","pos":3,"nom":"overall_side","ancien":"Vue de cote","nouveau":"Vue de côté"},
  {"id":"cfb32ed8-2258-416d-99fe-3b2af8721d68","pos":4,"nom":"interior","ancien":"Interieur du sac","nouveau":"Intérieur du sac"},
  {"id":"cfb32ed8-2258-416d-99fe-3b2af8721d68","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"cfb32ed8-2258-416d-99fe-3b2af8721d68","pos":7,"nom":"serial_tag","ancien":"Numero de serie / code date","nouveau":"Numéro de série / code date"},
  {"id":"cfb32ed8-2258-416d-99fe-3b2af8721d68","pos":10,"nom":"zipper_closeup","ancien":"Fermeture eclair (gros plan)","nouveau":"Fermeture éclair (gros plan)"},
  {"id":"d4b86261-009b-4c42-bc3b-30a72753cad7","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"d5be56eb-b741-4815-867d-f4f4d06afd08","pos":1,"nom":"front_full","ancien":"Vue de face complete","nouveau":"Vue de face complète"},
  {"id":"d5be56eb-b741-4815-867d-f4f4d06afd08","pos":2,"nom":"back_full","ancien":"Vue arriere complete","nouveau":"Vue arrière complète"},
  {"id":"d5be56eb-b741-4815-867d-f4f4d06afd08","pos":3,"nom":"label_neck","ancien":"Etiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"d5be56eb-b741-4815-867d-f4f4d06afd08","pos":4,"nom":"label_wash","ancien":"Etiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"d5be56eb-b741-4815-867d-f4f4d06afd08","pos":6,"nom":"material_closeup","ancien":"Texture matiere (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"d841a739-ef52-43a9-b43f-d2013dea958a","pos":3,"nom":"sole_bottom","ancien":"Semelle dessous","nouveau":"Semelle extérieure (dessous)"},
  {"id":"d841a739-ef52-43a9-b43f-d2013dea958a","pos":4,"nom":"tongue_label","ancien":"Étiquette de langue","nouveau":"Étiquette de languette"},
  {"id":"d841a739-ef52-43a9-b43f-d2013dea958a","pos":6,"nom":"logo_closeup","ancien":"Logo gros plan","nouveau":"Logo (gros plan)"},
  {"id":"d841a739-ef52-43a9-b43f-d2013dea958a","pos":7,"nom":"box_label","ancien":"Étiquette boîte","nouveau":"Étiquette de la boîte"},
  {"id":"d841a739-ef52-43a9-b43f-d2013dea958a","pos":8,"nom":"stitching_detail","ancien":"Détail coutures","nouveau":"Coutures (gros plan)"},
  {"id":"d8de27a2-1727-4697-a736-9755f319e054","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"e555932f-1cdc-4e5d-8115-2d3c47ae59fd","pos":3,"nom":"neck_label","ancien":"Étiquette col","nouveau":"Étiquette de col"},
  {"id":"e555932f-1cdc-4e5d-8115-2d3c47ae59fd","pos":4,"nom":"wash_label","ancien":"Étiquette de lavage","nouveau":"Étiquette d'entretien"},
  {"id":"e555932f-1cdc-4e5d-8115-2d3c47ae59fd","pos":5,"nom":"print_detail","ancien":"Détail print/broderie","nouveau":"Imprimé et broderie (gros plan)"},
  {"id":"e555932f-1cdc-4e5d-8115-2d3c47ae59fd","pos":6,"nom":"tags_packaging","ancien":"Tags et emballage","nouveau":"Étiquettes volantes et emballage"},
  {"id":"ec2b4391-1185-4c45-afad-c65fc93e550c","pos":7,"nom":"hardware","ancien":"Quincaillerie / fermetures","nouveau":"Pièces métalliques et fermetures"},
  {"id":"ece4abbb-73ba-45ad-9f3f-e6ace9886703","pos":1,"nom":"front_full","ancien":"Vue de face complete","nouveau":"Vue de face complète"},
  {"id":"ece4abbb-73ba-45ad-9f3f-e6ace9886703","pos":2,"nom":"back_full","ancien":"Vue arriere complete","nouveau":"Vue arrière complète"},
  {"id":"ece4abbb-73ba-45ad-9f3f-e6ace9886703","pos":3,"nom":"label_neck","ancien":"Etiquette col / encolure","nouveau":"Étiquette de col"},
  {"id":"ece4abbb-73ba-45ad-9f3f-e6ace9886703","pos":4,"nom":"label_wash","ancien":"Etiquette entretien lavage","nouveau":"Étiquette d'entretien"},
  {"id":"ece4abbb-73ba-45ad-9f3f-e6ace9886703","pos":6,"nom":"material_closeup","ancien":"Texture matiere (gros plan)","nouveau":"Texture de la matière (gros plan)"},
  {"id":"ef71235c-0820-4d26-b6ab-cfdb7c44aac8","pos":5,"nom":"hardware_closeup","ancien":"Quincaillerie (gros plan)","nouveau":"Pièces métalliques (gros plan)"},
  {"id":"f0c3b0af-e23e-493f-acd6-254699900a84","pos":2,"nom":"overall_back","ancien":"Vue arriere","nouveau":"Vue arrière"},
  {"id":"f0c3b0af-e23e-493f-acd6-254699900a84","pos":3,"nom":"overall_side_lateral","ancien":"Vue laterale","nouveau":"Vue latérale"},
  {"id":"f0c3b0af-e23e-493f-acd6-254699900a84","pos":4,"nom":"outsole","ancien":"Semelle exterieure (dessous)","nouveau":"Semelle extérieure (dessous)"},
  {"id":"f0c3b0af-e23e-493f-acd6-254699900a84","pos":6,"nom":"tongue_label","ancien":"Etiquette de languette","nouveau":"Étiquette de languette"},
  {"id":"f0c3b0af-e23e-493f-acd6-254699900a84","pos":7,"nom":"size_tag","ancien":"Etiquette de taille","nouveau":"Étiquette de taille"},
  {"id":"f0c3b0af-e23e-493f-acd6-254699900a84","pos":8,"nom":"insole","ancien":"Semelle interieure","nouveau":"Semelle intérieure"}
]$retours$::jsonb;
  v_actuelle text;
  v_autres_avant text;
  v_autres_apres text;
  v_lignes integer;
begin
  set local lock_timeout = '5s';
  -- Personne d'autre n'écrit dans la table entre le contrôle et l'écriture ; les lectures du site continuent.
  lock table public.brands in share row exclusive mode;

  select md5(coalesce(string_agg(b.id::text || '=' || b.photo_protocol::text, E'\n' order by b.id), '')) into v_actuelle from public.brands b;
  if v_actuelle = v_avant then
    raise notice 'NOMS DES PHOTOS : déjà revenu à l''état du relevé, rien n''est écrit.';
    return;
  end if;
  if v_actuelle is distinct from v_apres then
    raise exception 'NOMS DES PHOTOS : la table public.brands n''est pas dans l''état laissé par l''aller (empreinte %, attendue %). Rien n''est écrit. Ne pas relancer : transmettre ce message.', v_actuelle, v_apres;
  end if;
  select md5(coalesce(string_agg(((to_jsonb(b) - 'photo_protocol' - 'created_at') || jsonb_build_object('created_at', to_char(b.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US')))::text, E'\n' order by b.id), '')) into v_autres_avant from public.brands b;

  with retours as (
    select r.id, r.pos, r.nom, r.ancien, r.nouveau
    from jsonb_to_recordset(v_retours) as r(id uuid, pos integer, nom text, ancien text, nouveau text)
  ),
  retablis as (
    select b.id,
           jsonb_agg(case when r.ancien is null then t.e else jsonb_set(t.e, '{label}', to_jsonb(r.ancien)) end order by t.ord) as protocole
    from public.brands b
    cross join lateral jsonb_array_elements(b.photo_protocol) with ordinality as t(e, ord)
    left join retours r on r.id = b.id and r.pos = t.ord and r.nom = t.e->>'name' and r.nouveau = t.e->>'label'
    group by b.id
    having count(r.ancien) > 0
  )
  update public.brands b
     set photo_protocol = k.protocole
    from retablis k
   where b.id = k.id;
  get diagnostics v_lignes = row_count;

  if v_lignes <> 71 then
    raise exception 'NOMS DES PHOTOS : % lignes écrites, 71 attendues. Tout est annulé, rien n''est écrit. Transmettre ce message.', v_lignes;
  end if;
  select md5(coalesce(string_agg(b.id::text || '=' || b.photo_protocol::text, E'\n' order by b.id), '')) into v_actuelle from public.brands b;
  if v_actuelle is distinct from v_avant then
    raise exception 'NOMS DES PHOTOS : le résultat n''est pas l''état du relevé (empreinte %, attendue %). Tout est annulé, rien n''est écrit. Transmettre ce message.', v_actuelle, v_avant;
  end if;
  select md5(coalesce(string_agg(((to_jsonb(b) - 'photo_protocol' - 'created_at') || jsonb_build_object('created_at', to_char(b.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US')))::text, E'\n' order by b.id), '')) into v_autres_apres from public.brands b;
  if v_autres_apres is distinct from v_autres_avant then
    raise exception 'NOMS DES PHOTOS : une autre colonne de public.brands a changé pendant l''écriture (empreinte %, attendue %). Tout est annulé, rien n''est écrit. Transmettre ce message.', v_autres_apres, v_autres_avant;
  end if;
  raise notice 'NOMS DES PHOTOS : 284 anciens noms remis dans 71 lignes de marque.';
end
$bloc$;
