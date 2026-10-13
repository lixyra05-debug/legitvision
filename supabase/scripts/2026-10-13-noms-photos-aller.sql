-- ============================================================================
-- LegitVision — noms des photos à l'envoi : LA CORRECTION, ou « aller » (écriture)
-- Préparé d'après le relevé de production du 2026-10-13 (lecture seule).
-- Fichier généré : ne pas le retoucher (outils/2026-10-13-noms-photos/generer.mjs).
--
-- EN BREF
--   Ce fichier ne contient qu'UNE instruction : le bloc « do … ». Le coller
--   seul, en entier, dans l'éditeur SQL de Supabase (projet de production) et
--   cliquer « Run ».
--   AVANT : lancer la requête d'état (2026-10-13-noms-photos-etat.sql). Sa
--   première ligne doit commencer par « PRÊT : 284 noms de photos à corriger
--   dans 71 lignes de marque ». Sinon, ne pas lancer ce bloc.
--   Ne rien sélectionner dans l'éditeur : avec une sélection, « Run selected »
--   ne lance que le morceau sélectionné.
--   CE BLOC n'affiche aucune ligne (« Success. No rows returned »).
--   APRÈS : relancer la requête d'état. Sa première ligne doit commencer par
--   « APPLIQUÉ : les 34 corrections sont en place ». C'est elle, la preuve.
--   Ces noms s'affichent à l'étape d'envoi des photos et partent dans la
--   consigne envoyée à l'IA.
--
-- CE QUE FAIT CE BLOC
--   Il applique 34 corrections aux noms des photos demandées à l'envoi
--   (public.brands.photo_protocol, clé « label ») : 284 noms dans 71 des
--   80 lignes de marque. Surtout des accents manquants (« Vue arriere »),
--   du franglais (« Tags », « print », « zip »), un mot faux (« langue » pour
--   « languette »), et trois choix validés par Hector le 2026-10-13 :
--   « Étiquette de languette », « Pièces métalliques », « (gros plan) »
--   partout. Seule la clé « label » des emplacements concernés change : leur
--   ordre, leur identifiant (« name »), « required », « min_resolution », les
--   autres colonnes de public.brands et le reste de la base ne changent pas.
--   Aucun objet n'est créé.
--
-- TOUT OU RIEN
--   Le bloc vérifie d'abord que les photos demandées de toutes les lignes de
--   marque sont exactement celles du relevé (empreinte des noms
--   5dd4011eb6d10aafc4dc4f645d2df213). Il écrit, puis vérifie que le résultat
--   est exactement l'état prévu (empreinte a7935327f8a1c045d2ef70267e238aca),
--   que 71 lignes ont été écrites et que les autres colonnes n'ont pas
--   bougé pendant son écriture. Au moindre écart, avant ou après l'écriture,
--   une erreur annule TOUT : rien n'est écrit. Relancé sur une table déjà
--   corrigée, il n'écrit rien. Une autre colonne changée depuis le relevé (une
--   marque désactivée, un logo ajouté) ne l'arrête pas : seuls les noms et
--   les protocoles comptent.
--
-- SI ÇA NE SE PASSE PAS COMME PRÉVU
--   - Erreur « syntax error » ou « unterminated dollar-quoted string » : le
--     bloc a été collé incomplet. Rien n'a été lancé ; le recoller en entier.
--   - Erreur « canceling statement due to lock timeout » : la table était
--     occupée. Rien n'est écrit ; relancer le bloc.
--   - Erreur qui contient « NOMS DES PHOTOS » : le bloc a refusé, rien n'est
--     écrit ; ne pas relancer, transmettre le message.
--   - Un tableau au lieu de « Success » : la requête contenait autre chose
--     que ce bloc (la requête d'état, par exemple). Le bloc est peut-être
--     parti quand même, après le calcul du tableau. Ne rien relancer : la
--     requête d'état, lancée seule, dit ce qui est en place.
--   - Une fenêtre de confirmation de Supabase (« Potential issue
--     detected ») : annuler, vider l'éditeur, recoller le bloc seul.
--   - Toute autre erreur (« permission denied », « read-only transaction »,
--     délai dépassé) : un bloc qui échoue n'écrit rien. Ne pas relancer :
--     lancer la requête d'état, puis transmettre le message et sa première
--     ligne.
--   Retour arrière : 2026-10-13-noms-photos-retour.sql.
-- ============================================================================

do $bloc$
declare
  v_avant constant text := '5dd4011eb6d10aafc4dc4f645d2df213';
  v_apres constant text := 'a7935327f8a1c045d2ef70267e238aca';
  v_corrections constant jsonb := $corrections$[
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
]$corrections$::jsonb;
  v_actuelle text;
  v_autres_avant text;
  v_autres_apres text;
  v_lignes integer;
begin
  set local lock_timeout = '5s';
  -- Personne d'autre n'écrit dans la table entre le contrôle et l'écriture ; les lectures du site continuent.
  lock table public.brands in share row exclusive mode;

  v_actuelle := (select md5(coalesce(string_agg(b.id::text || '=' || b.photo_protocol::text, E'\n' order by b.id), '')) from public.brands b);
  if v_actuelle = v_apres then
    raise notice 'NOMS DES PHOTOS : déjà appliqué, rien n''est écrit.';
    return;
  end if;
  if v_actuelle is distinct from v_avant then
    raise exception 'NOMS DES PHOTOS : les photos demandées de public.brands ne sont plus celles du relevé du 2026-10-13 (empreinte %, attendue %). Rien n''est écrit. Ne pas relancer : transmettre ce message.', v_actuelle, v_avant;
  end if;
  v_autres_avant := (select md5(coalesce(string_agg(((to_jsonb(b) - 'photo_protocol' - 'created_at') || jsonb_build_object('created_at', to_char(b.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US')))::text, E'\n' order by b.id), '')) from public.brands b);

  with corrections as (
    select c.nom, c.ancien, c.nouveau
    from jsonb_to_recordset(v_corrections) as c(nom text, ancien text, nouveau text)
  ),
  corriges as (
    select b.id,
           jsonb_agg(case when c.nouveau is null then t.e else jsonb_set(t.e, '{label}', to_jsonb(c.nouveau)) end order by t.ord) as protocole
    from public.brands b
    cross join lateral jsonb_array_elements(b.photo_protocol) with ordinality as t(e, ord)
    left join corrections c on c.nom = t.e->>'name' and c.ancien = t.e->>'label'
    group by b.id
    having count(c.nouveau) > 0
  )
  update public.brands b
     set photo_protocol = k.protocole
    from corriges k
   where b.id = k.id;
  get diagnostics v_lignes = row_count;

  if v_lignes <> 71 then
    raise exception 'NOMS DES PHOTOS : % lignes écrites, 71 attendues. Tout est annulé, rien n''est écrit. Transmettre ce message.', v_lignes;
  end if;
  v_actuelle := (select md5(coalesce(string_agg(b.id::text || '=' || b.photo_protocol::text, E'\n' order by b.id), '')) from public.brands b);
  if v_actuelle is distinct from v_apres then
    raise exception 'NOMS DES PHOTOS : le résultat n''est pas l''état prévu (empreinte %, attendue %). Tout est annulé, rien n''est écrit. Transmettre ce message.', v_actuelle, v_apres;
  end if;
  v_autres_apres := (select md5(coalesce(string_agg(((to_jsonb(b) - 'photo_protocol' - 'created_at') || jsonb_build_object('created_at', to_char(b.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US')))::text, E'\n' order by b.id), '')) from public.brands b);
  if v_autres_apres is distinct from v_autres_avant then
    raise exception 'NOMS DES PHOTOS : une autre colonne de public.brands a changé pendant l''écriture (empreinte %, attendue %). Tout est annulé, rien n''est écrit. Transmettre ce message.', v_autres_apres, v_autres_avant;
  end if;
  raise notice 'NOMS DES PHOTOS : 284 noms corrigés dans 71 lignes de marque.';
end
$bloc$;
-- FIN — noms des photos : la correction (écriture)
