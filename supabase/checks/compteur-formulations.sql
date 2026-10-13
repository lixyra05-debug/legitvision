-- ============================================================================
-- LegitVision — compteur hebdomadaire des formulations interdites (LECTURE SEULE)
--
-- Décision d'Hector du 2026-10-13 : « Chaque semaine, sur les vrais rapports
-- générés : compte les formulations interdites […]. Sépare les cas où elles
-- apparaissent dans un texte entre « » (exception photos). Liste ces cas à
-- part pour que je les relise. Ne modifie rien en base. »
--
-- EN BREF
--   Ce fichier ne contient qu'UNE requête, qui ne fait que lire. Elle compte,
--   dans les rapports terminés des 7 derniers jours, les textes écrits par
--   l'IA (résumé, observations, recommandations, éléments manquants) qui
--   portent une formulation que la consigne interdit :
--   probabilité, certification ou garantie, « frauduleux », « arnaque », score
--   cité dans un texte. Elle range à part ce qui est écrit entre guillemets
--   (un texte recopié d'une photo, que la consigne permet), et liste à part,
--   pour lecture, les textes qui parlent d'achat ou de paiement.
--   Pour tout l'historique : remplacer « 7 days » par « 100 years » à la
--   ligne « periode ».
--
-- LIRE LE RÉSULTAT
--   Ligne « BILAN » : les totaux de la période.
--   Lignes « FAMILLE » : pour chaque famille, les textes hors guillemets et
--   les textes entre guillemets.
--   Lignes « CAS » : chaque texte fautif, avec le numéro du rapport, le champ
--   et la famille.
--   Lignes « ENTRE GUILLEMETS, À RELIRE » : les cas de l'exception. À relire :
--   un vrai texte d'étiquette est permis, un mot de l'IA mis entre guillemets
--   ne l'est pas.
--   Lignes « ACHAT OU PAIEMENT, À LIRE » : la requête ratisse large (tout
--   texte qui parle d'acheter ou de payer, hors « preuve d'achat », « date
--   d'achat », « reçu de paiement »). C'est la lecture qui dit s'il y a un
--   conseil d'achat ; lib/purchase-advice.ts fait ce tri pour l'affichage.
--
-- D'OÙ VIENNENT LES MOTIFS
--   Ils reprennent ceux de lib/forbidden-wording.ts, que le site utilise.
--   tests/unit/compteur-formulations.test.ts vérifie, sur une base d'essai,
--   que cette requête range chaque phrase comme ce fichier.
--   Les majuscules accentuées sont ramenées en minuscules avant de comparer :
--   le résultat ne dépend pas du réglage de langue de la base.
-- ============================================================================

with
periode as (
  select now() - interval '7 days' as depuis
),
rapports as (
  select a.id, a.created_at, a.findings, a.ai_raw_response
  from public.analyses a
  cross join periode p
  where a.status in ('completed', 'expert_review')
    and a.created_at >= p.depuis
),
bruts as (
  select r.id, r.created_at, 1 as ordre, 1::bigint as position, 'résumé' as champ, r.ai_raw_response->>'analyst_summary' as texte
  from rapports r
  where jsonb_typeof(r.ai_raw_response->'analyst_summary') = 'string'
  union all
  select r.id, r.created_at, 2, f.position, 'observation', f.e->>'observation'
  from rapports r
  cross join lateral jsonb_array_elements(case when jsonb_typeof(r.findings) = 'array' then r.findings else '[]'::jsonb end) with ordinality as f(e, position)
  where jsonb_typeof(f.e) = 'object' and jsonb_typeof(f.e->'observation') = 'string'
  union all
  select r.id, r.created_at, 3, x.position, 'recommandation', x.e #>> '{}'
  from rapports r
  cross join lateral jsonb_array_elements(case when jsonb_typeof(r.ai_raw_response->'recommendations') = 'array' then r.ai_raw_response->'recommendations' else '[]'::jsonb end) with ordinality as x(e, position)
  where jsonb_typeof(x.e) = 'string'
  union all
  select r.id, r.created_at, 4, x.position, 'élément manquant', x.e #>> '{}'
  from rapports r
  cross join lateral jsonb_array_elements(case when jsonb_typeof(r.ai_raw_response->'missing_evidence') = 'array' then r.ai_raw_response->'missing_evidence' else '[]'::jsonb end) with ordinality as x(e, position)
  where jsonb_typeof(x.e) = 'string'
),
textes as (
  select b.id, b.created_at, b.ordre, b.position, b.champ, b.texte,
         translate(b.texte, 'ÀÂÄÇÉÈÊËÎÏÔÖÙÛÜ', 'àâäçéèêëîïôöùûü') as bas
  from bruts b
  where btrim(b.texte) <> ''
),
decoupes as (
  -- « propos » : le texte sans ce qu'il recopie entre guillemets ; « cite » : ce qui est entre guillemets.
  select t.*,
         regexp_replace(t.bas, $re$«[^«»]{0,120}»|“[^“”]{0,120}”|"[^"]{0,120}"$re$, ' ', 'g') as propos,
         coalesce((select string_agg(m[1], ' ') from regexp_matches(t.bas, $re$(«[^«»]{0,120}»|“[^“”]{0,120}”|"[^"]{0,120}")$re$, 'g') as m), '') as cite
  from textes t
),
familles(rang, nom, motif) as (
  values
    -- « probabilité », « chances », et un pourcentage dans une phrase qui parle d'authenticité, de score, de confiance ou de risque.
    (1, 'probabilité',
     $re$probabilit|\ychances\y|\ychance\s+(que\y|qu['’]|sur\s+\d|d['’]\s*[êe]tre)|\d{1,3}([.,]\d+)?\s*(%|pour\s*cent)([^.!?…;]|[.!?…;](?!\s))*(authenti|contref|confiance|certitude|fiab|probab|\yrisque|\ychances?\y|\yscore|\ysûre?s?(?![a-zà-öø-ÿ])|\yverdict)|(authenti|contref|confiance|certitude|fiab|probab|\yrisque|\ychances?\y|\yscore|\ysûre?s?(?![a-zà-öø-ÿ])|\yverdict)([^.!?…;]|[.!?…;](?!\s))*\d{1,3}([.,]\d+)?\s*(%|pour\s*cent)$re$),
    -- « certification », « certifié », « certifier », « garanti », « garantie ». Pas « certificat », le document.
    (2, 'certification ou garantie', $re$certifi(?!cats?([^a-zà-öø-ÿ]|$))|garanti$re$),
    (3, 'frauduleux', $re$fraud$re$),
    (4, 'arnaque', $re$arnaqu|escro(c|qu)$re$),
    -- « 85/100 » (pas une date), « 40 sur 100 », « score de 78 ».
    (5, 'score cité',
     $re$(?<![/\d])\d{1,3}\s*/\s*100\y|\y\d{1,3}\s+sur\s+(100|10|20)\y|\yscores?\y(\s+[^\s.!?;:=]+){0,4}?(\s+(de|à|est\s+de|atteint|vaut)\s+|\s*[:=]\s*)\d{1,3}(?!\d)$re$)
),
cas as (
  select d.id, d.created_at, d.ordre, d.position, d.champ, d.texte, f.rang, f.nom as famille,
         d.propos ~* f.motif as hors_guillemets,
         d.cite ~* f.motif as entre_guillemets
  from decoupes d
  cross join familles f
  where d.propos ~* f.motif or d.cite ~* f.motif
),
achat as (
  -- Tout texte qui parle d'acheter ou de payer, une fois retirés les documents qu'on demande au vendeur.
  select d.id, d.created_at, d.ordre, d.position, d.champ, d.texte
  from decoupes d
  where regexp_replace(
          d.bas,
          $re$\y(preuves?|factures?|dates?|lieux?|tickets?|justificatifs?|bons?|confirmations?|re[çc]us?|historiques?)\s+(d['’]\s*achat|de\s+l['’]\s*achat|de\s+paiement|de\s+caisse)$re$,
          ' ', 'gi')
        ~* $re$\yachats?\y|\yach[eè]t|\yacqu[ée]r|\yacquisition|\ypay(er|ez|ons|ant)\y|\ypayé|\ypaiement|\yacompte|\yarrhes|\yvirement|\ytransaction|\yrembours|passez\s+votre\s+chemin|\yfuyez\y|à\s+fuir|\yfoncez\y|(bonne|excellente|belle)\s+affaire|s['’]abstenir|\yabst\w+(-vous)?\s+d|\yne\s+(r[ée]glez|versez)\y|(envoy|vers|donn)\w*[^.!?]{0,30}\y(argent|acompte|arrhes)\y$re$
),
bilan as (
  select
    (select to_char(p.depuis at time zone 'UTC', 'YYYY-MM-DD') from periode p) as depuis,
    (select count(*) from rapports) as rapports,
    (select count(*) from textes) as textes,
    (select count(*) from (select distinct c.id, c.ordre, c.position from cas c where c.hors_guillemets) x) as fautifs,
    (select count(*) from (select distinct c.id from cas c where c.hors_guillemets) x) as rapports_fautifs,
    (select count(*) from (select distinct c.id, c.ordre, c.position from cas c where c.hors_guillemets and c.ordre in (1, 2)) x) as fautifs_resume_observation,
    (select count(*) from (select distinct c.id, c.ordre, c.position from cas c where c.entre_guillemets) x) as entre_guillemets,
    (select count(*) from achat) as achat
)
select 0 as n, 'BILAN' as rubrique, null::text as rapport, null::text as jour, null::text as champ, null::text as famille,
       'Depuis le ' || b.depuis || ' : ' || b.rapports || ' rapport(s) terminé(s), ' || b.textes || ' texte(s) lus. '
         || 'Formulations interdites hors guillemets : ' || b.fautifs || ' texte(s) dans ' || b.rapports_fautifs || ' rapport(s), dont '
         || b.fautifs_resume_observation || ' résumé(s) ou observation(s). '
         || 'Entre guillemets, à relire : ' || b.entre_guillemets || ' texte(s). '
         || 'Achat ou paiement, à lire : ' || b.achat || ' texte(s).' as texte
from bilan b
union all
select f.rang, 'FAMILLE', null, null, null, f.nom,
       'hors guillemets : ' || (select count(*) from cas c where c.rang = f.rang and c.hors_guillemets) || ' texte(s), entre guillemets : '
         || (select count(*) from cas c where c.rang = f.rang and c.entre_guillemets) || ' texte(s)'
from familles f
union all
select 10, 'CAS', left(c.id::text, 8), to_char(c.created_at at time zone 'UTC', 'YYYY-MM-DD'), c.champ, c.famille, c.texte
from cas c
where c.hors_guillemets
union all
select 20, 'ENTRE GUILLEMETS, À RELIRE', left(c.id::text, 8), to_char(c.created_at at time zone 'UTC', 'YYYY-MM-DD'), c.champ, c.famille, c.texte
from cas c
where c.entre_guillemets
union all
select 30, 'ACHAT OU PAIEMENT, À LIRE', left(a.id::text, 8), to_char(a.created_at at time zone 'UTC', 'YYYY-MM-DD'), a.champ, null, a.texte
from achat a
order by n, jour, rapport, champ, famille, texte;
-- FIN — compteur hebdomadaire des formulations interdites (lecture seule)
