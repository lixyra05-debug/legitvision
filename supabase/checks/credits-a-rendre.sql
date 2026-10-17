-- ============================================================================
-- LegitVision — crédits à rendre : lancements dont le crédit n'est ni
-- consommé par un rapport ni rendu (LECTURE SEULE)
--
-- Décision d'Hector du 2026-10-17 : « ajoute à la vérification du mardi une
-- requête qui liste les cas « issue inconnue » et ceux où le remboursement a
-- échoué. Elle doit être strictement en lecture seule (aucun UPDATE, INSERT
-- ni DELETE). » Hector la lance lui-même dans l'éditeur SQL de Supabase.
--
-- EN BREF
--   Ce fichier ne contient qu'UNE requête, qui ne fait que lire.
--   Depuis le 27/09, la route d'analyse réserve un crédit à chaque lancement :
--   une ligne « usage » « Analyse <id> (lancement <uuid>) ». Crédit consommé :
--   elle y ajoute « rapport enregistré ». Crédit rendu : une ligne « refund »
--   cite le lancement. Sinon, elle y ajoute une mention : « issue inconnue »,
--   « crédit à rendre » (remboursement échoué), « remboursement incertain »,
--   « réservation incertaine ». Une ligne restée sans mention plus de
--   15 minutes vient d'une fonction coupée net, ou d'un remboursement passé
--   sans trace.
--   La requête liste ces lancements non réglés, avec l'état de l'analyse et le
--   solde du compte, et dit pour chacun ce qu'il faut faire.
--
-- LIRE LE RÉSULTAT
--   Ligne « BILAN » : lancements contrôlés, puis combien sont à rendre, à
--   vérifier, pour information. Le bilan seul : rien à faire.
--   « À RENDRE » : aucun rapport décompté, et le solde n'a pas bougé sans
--     trace depuis (écart 0) : un crédit est dû au client.
--   « À VÉRIFIER » : un cas que la requête ne sait pas trancher seule.
--   « POUR INFORMATION » (8 derniers jours seulement) : rien à rendre, soit
--     que le rapport ait été livré et décompté, soit que le crédit soit déjà
--     revenu sans trace dans le journal (écart 1).
--
-- QUE FAIRE
--   « À RENDRE » : m'envoyer la ligne. Je prépare le remboursement (une étape
--   par requête) ; il écrit aussi la ligne « refund » qui cite le lancement,
--   et le lancement sort de la liste. Ne jamais changer un solde à la main
--   sans cette ligne : la requête compterait encore le crédit comme dû.
--   « À VÉRIFIER » : on regarde ensemble avant de rendre quoi que ce soit.
--
-- COMMENT C'EST CALCULÉ
--   Rapport décompté : analyse « completed » ou « expert_review », sauf
--   analyse sans résultat (confidence_level « insufficient ») et couverture
--   sous le seuil non décomptée (marqueur server_coverage, charged = false).
--   Écart = solde actuel − (solde juste après la réservation + somme des
--   lignes du journal écrites depuis). Chaque mouvement de crédit est
--   journalisé (débit −1, remboursement +1, achats, bonus ±1) : un écart de 1
--   est un crédit revenu sans ligne « refund ».
--   Les mentions sont celles de app/api/analyze/route.ts (markReservation) ;
--   tests/unit/credits-a-rendre.test.ts vérifie qu'elles sont toutes connues
--   ici et, sur une base d'essai (LV_PGLITE), le classement de chaque cas.
-- ============================================================================
with
-- Lignes « usage » de la réservation, hors lancements en cours (15 minutes).
lancements as (
  select
    u.user_id,
    u.analysis_id,
    u.created_at,
    u.balance_after,
    substring(u.description from '\(lancement ([0-9a-f-]{36})\)') as lancement,
    substring(u.description from '\(lancement [0-9a-f-]{36}\) — (.+)$') as mention
  from public.credits_transactions u
  where u.type = 'usage'
    and u.description ~ '^Analyse [0-9a-f-]{36} \(lancement [0-9a-f-]{36}\)'
    and u.created_at < now() - interval '15 minutes'
),
-- Non réglés : ni « rapport enregistré », ni ligne « refund » qui cite le lancement.
ouverts as (
  select l.*
  from lancements l
  where l.mention is distinct from 'rapport enregistré'
    and not exists (
      select 1
      from public.credits_transactions r
      where r.type = 'refund'
        and r.user_id = l.user_id
        and strpos(r.description, '(lancement ' || l.lancement || ')') > 0
    )
),
detail as (
  select
    o.*,
    case
      when o.mention is null then 'sans mention'
      when o.mention = 'issue inconnue : vérifier le rapport et le solde' then 'issue inconnue'
      when o.mention = 'crédit à rendre' then 'remboursement échoué'
      when o.mention = 'remboursement incertain : vérifier le solde' then 'remboursement incertain'
      when o.mention = 'réservation incertaine : vérifier le solde' then 'réservation incertaine'
      else 'mention inconnue : ' || o.mention
    end as cas,
    case
      when a.id is null then 'analyse introuvable'
      when a.status not in ('completed', 'expert_review') then 'aucun rapport (statut ' || a.status || ')'
      when a.ai_raw_response ->> 'confidence_level' = 'insufficient' then 'rapport non décompté (analyse sans résultat)'
      when a.ai_raw_response -> 'server_coverage' ->> 'charged' = 'false' then 'rapport non décompté (trop peu de zones notées)'
      else 'rapport décompté'
    end as rapport,
    p.credits_remaining as solde_actuel,
    o.balance_after + coalesce((
      select sum(t.amount)
      from public.credits_transactions t
      where t.user_id = o.user_id
        and t.created_at > o.created_at
    ), 0) as solde_journal
  from ouverts o
  left join public.analyses a on a.id = o.analysis_id
  left join public.profiles p on p.id = o.user_id
),
classes as (
  select
    d.*,
    d.solde_actuel - d.solde_journal as ecart,
    case
      when d.cas like 'mention inconnue%' or d.rapport = 'analyse introuvable' or d.solde_actuel is null
        then 'À VÉRIFIER'
      when d.rapport = 'rapport décompté'
        then case when d.cas in ('issue inconnue', 'sans mention') then 'POUR INFORMATION' else 'À VÉRIFIER' end
      when d.solde_actuel - d.solde_journal = 0
        then 'À RENDRE'
      when d.solde_actuel - d.solde_journal = 1 and d.cas in ('remboursement incertain', 'sans mention')
        then 'POUR INFORMATION'
      else 'À VÉRIFIER'
    end as ligne
  from detail d
),
-- Les lignes « pour information » ne restent que 8 jours : une semaine et un jour de marge.
affiches as (
  select *
  from classes
  where ligne <> 'POUR INFORMATION' or created_at >= now() - interval '8 days'
)
select "ligne", "à faire", "cas", "lancé le", "analyse", "rapport", "compte", "solde actuel", "solde selon le journal", "écart"
from (
  select
    0 as tri,
    null::timestamptz as quand,
    'BILAN' as "ligne",
    format('%s lancement(s) contrôlé(s) depuis le 27/09 : %s à rendre, %s à vérifier, %s pour information',
           (select count(*) from lancements),
           (select count(*) from affiches where ligne = 'À RENDRE'),
           (select count(*) from affiches where ligne = 'À VÉRIFIER'),
           (select count(*) from affiches where ligne = 'POUR INFORMATION')) as "à faire",
    null::text as "cas",
    null::text as "lancé le",
    null::text as "analyse",
    null::text as "rapport",
    null::text as "compte",
    null::bigint as "solde actuel",
    null::bigint as "solde selon le journal",
    null::bigint as "écart"
  union all
  select
    case f.ligne when 'À RENDRE' then 1 when 'À VÉRIFIER' then 2 else 3 end,
    f.created_at,
    f.ligne,
    case
      when f.ligne = 'À RENDRE' then 'Rendre 1 crédit : m''envoyer cette ligne'
      when f.ligne = 'À VÉRIFIER' then 'À regarder ensemble avant de rendre quoi que ce soit'
      when f.rapport = 'rapport décompté' then 'Rien à rendre : rapport livré et décompté'
      else 'Rien à rendre : crédit déjà revenu, sans trace dans le journal'
    end,
    f.cas,
    to_char(f.created_at at time zone 'Europe/Paris', 'DD/MM/YYYY HH24:MI'),
    f.analysis_id::text,
    f.rapport,
    f.user_id::text,
    f.solde_actuel,
    f.solde_journal,
    f.ecart
  from affiches f
) x
order by tri, quand;
-- FIN — crédits à rendre (lecture seule)
