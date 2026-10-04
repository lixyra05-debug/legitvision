-- ============================================================
-- Contrôle de la migration 020, APRÈS son exécution, en lecture seule
-- ============================================================
-- Marche à suivre après l'exécution de la 020 par Hector (éditeur SQL) :
--   1. La migration affiche le tableau de son propre contrôle, fait dans sa
--      transaction (structure, droits, essais réels annulés) : chaque ligne
--      dit « ok ». Une erreur « Contrôle 020 en échec » signifie que rien n'a
--      été appliqué : ne rien corriger à la main, rapporter le message.
--   2. Exécuter CE fichier en lecture seule (MCP supabase-lecture, ou
--      éditeur) : chaque ligne dit « ok » (« info » : compte, sans attendu).
--   3. Exécuter supabase/checks/etat_base.sql en lecture seule et comparer sa
--      sortie à supabase/checks/etat_base.attendu.tsv : les 196 lignes de
--      l'attendu restent identiques, et s'y ajoutent 59 lignes (255 en tout),
--      toutes sur les objets de la 020 : 3 fonctions (credit_single_purchase,
--      grant_first_purchase_offer, withdraw_first_purchase_offer), 2 tables
--      (analysis_costs, first_purchase_offers), leurs 29 colonnes et 16
--      contraintes, et 9 index, dont credits_transactions_purchase_payment_key.
--      Si la sortie est exactement l'attendu plus ces 59 lignes, la relever en
--      entier et la committer comme nouvel attendu (CLAUDE.md, règle 16).
--      Toute autre différence est un objet créé ou modifié hors du dépôt : ne
--      rien committer, s'arrêter et la rapporter.
--   4. Seulement ensuite : déployer feat/cout-ia (octobre), puis, le jour J,
--      le webhook qui appelle credit_single_purchase.
-- Une seule requête, sans aucune écriture : elle passe dans une transaction
-- en lecture seule. Les empreintes des corps de fonction (md5) sont celles du
-- fichier supabase/migrations/020_offre_premier_achat_et_cout_ia.sql relu :
-- une autre valeur signifie une fonction modifiée depuis.

set search_path = pg_catalog;

with controles (ordre, controle, attendu, observe) as (
  select 1, 'Migration 020 inscrite au registre', '020_offre_premier_achat_et_cout_ia',
         coalesce((select m.nom from private.migrations m where m.numero = 20), 'absente')
  union all
  select 2, 'Tables nouvelles : RLS', 'analysis_costs : activée | first_purchase_offers : activée',
         coalesce((select string_agg(c.relname || ' : ' || case when c.relrowsecurity then 'activée' else 'désactivée' end
                                     || case when c.relforcerowsecurity then ', forcée' else '' end,
                                     ' | ' order by c.relname collate "C")
                     from pg_class c
                    where c.oid in (to_regclass('public.analysis_costs'), to_regclass('public.first_purchase_offers'))), 'absentes')
  union all
  select 3, 'Tables nouvelles : règles RLS', 'aucune',
         coalesce((select string_agg(p.tablename || '.' || p.policyname, ', ' order by p.policyname collate "C")
                     from pg_policies p
                    where p.schemaname = 'public' and p.tablename in ('analysis_costs', 'first_purchase_offers')), 'aucune')
  union all
  select 3 + r.n, 'Tables nouvelles : droits de ' || r.nom || ' (effectifs, colonnes comprises)', r.attendu,
         coalesce((select string_agg(y.t || ' : ' || y.p, ' | ' order by y.t collate "C")
                     from (select c.relname t, string_agg(x.priv, ', ' order by x.priv collate "C") p
                             from pg_class c
                            cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER', 'MAINTAIN']) as x(priv)
                            where c.oid in (to_regclass('public.analysis_costs'), to_regclass('public.first_purchase_offers'))
                              and (has_table_privilege(r.nom, c.oid, x.priv)
                                   or case when x.priv in ('SELECT', 'INSERT', 'UPDATE', 'REFERENCES')
                                           then has_any_column_privilege(r.nom, c.oid, x.priv) else false end)
                            group by c.relname) y), 'aucun')
    from (values (1, 'public', 'aucun'),
                 (2, 'anon', 'aucun'),
                 (3, 'authenticated', 'aucun'),
                 (4, 'service_role', 'analysis_costs : INSERT, SELECT | first_purchase_offers : INSERT, SELECT, UPDATE'))
         as r(n, nom, attendu)
  union all
  select 8, 'Fonctions nouvelles : qui les exécute (public, anon, authenticated, service_role)',
         'credit_single_purchase : service_role | grant_first_purchase_offer : service_role'
         || ' | withdraw_first_purchase_offer : service_role',
         coalesce((select string_agg(y.f || ' : ' || coalesce(y.qui, 'personne'), ' | ' order by y.f collate "C")
                     from (select p.proname f,
                                  (select string_agg(x.r, ', ' order by x.r collate "C")
                                     from unnest(array['public', 'anon', 'authenticated', 'service_role']) as x(r)
                                    where has_function_privilege(x.r, p.oid, 'EXECUTE')) qui
                             from pg_proc p
                            where p.pronamespace = 'public'::regnamespace
                              and p.proname in ('credit_single_purchase', 'grant_first_purchase_offer', 'withdraw_first_purchase_offer')) y), 'absentes')
  union all
  select 9, 'Fonctions nouvelles : droits de l''appelant, search_path fixé, propriétaire',
         'credit_single_purchase : invoker, search_path="", postgres | grant_first_purchase_offer : invoker, search_path="", postgres'
         || ' | withdraw_first_purchase_offer : invoker, search_path="", postgres',
         coalesce((select string_agg(p.proname || ' : ' || case when p.prosecdef then 'definer' else 'invoker' end
                                     || ', ' || coalesce(array_to_string(p.proconfig, ','), 'sans search_path')
                                     || ', ' || pg_get_userbyid(p.proowner),
                                     ' | ' order by p.proname collate "C")
                     from pg_proc p
                    where p.pronamespace = 'public'::regnamespace
                      and p.proname in ('credit_single_purchase', 'grant_first_purchase_offer', 'withdraw_first_purchase_offer')), 'absentes')
  union all
  select 10, 'Signature de credit_single_purchase',
         'p_user_id uuid, p_payment_intent text, p_livemode boolean, p_offer_allowed boolean, p_card_fingerprint text,'
         || ' p_wallet_type text, p_card_brand text, p_card_last4 text, p_card_country text,'
         || ' p_purchase_description text, p_offer_description text'
         || ' → TABLE(outcome text, credits_added integer, balance integer, offer_granted boolean, offer_refusal text, probable_card_match boolean)',
         coalesce((select string_agg(pg_get_function_arguments(p.oid) || ' → ' || pg_get_function_result(p.oid), ' | ')
                     from pg_proc p
                    where p.pronamespace = 'public'::regnamespace and p.proname = 'credit_single_purchase'), 'absente')
  union all
  select 11, 'Signature de grant_first_purchase_offer',
         'p_payment_intent text, p_livemode boolean, p_card_fingerprint text DEFAULT NULL::text,'
         || ' p_wallet_type text DEFAULT NULL::text, p_card_brand text DEFAULT NULL::text, p_card_last4 text DEFAULT NULL::text,'
         || ' p_card_country text DEFAULT NULL::text,'
         || ' p_description text DEFAULT ''Analyse offerte au premier achat, accordée à la main''::text'
         || ' → TABLE(outcome text, balance integer, offer_refusal text, probable_card_match boolean)',
         coalesce((select string_agg(pg_get_function_arguments(p.oid) || ' → ' || pg_get_function_result(p.oid), ' | ')
                     from pg_proc p
                    where p.pronamespace = 'public'::regnamespace and p.proname = 'grant_first_purchase_offer'), 'absente')
  union all
  select 12, 'Signature de withdraw_first_purchase_offer',
         'p_payment_intent text, p_description text DEFAULT ''Analyse offerte retirée : premier achat remboursé''::text'
         || ' → TABLE(outcome text, balance integer)',
         coalesce((select string_agg(pg_get_function_arguments(p.oid) || ' → ' || pg_get_function_result(p.oid), ' | ')
                     from pg_proc p
                    where p.pronamespace = 'public'::regnamespace and p.proname = 'withdraw_first_purchase_offer'), 'absente')
  union all
  select 13, 'Corps des fonctions : ceux de la migration relue (md5)',
         'credit_single_purchase : 83652ffe4e4f7095a411808c373525df | grant_first_purchase_offer : f3545ad98d97f2eb928949cb50fb4373'
         || ' | withdraw_first_purchase_offer : c5cb319455c1b8bf1974ecc9e29d5f05',
         coalesce((select string_agg(p.proname || ' : ' || md5(p.prosrc), ' | ' order by p.proname collate "C")
                     from pg_proc p
                    where p.pronamespace = 'public'::regnamespace
                      and p.proname in ('credit_single_purchase', 'grant_first_purchase_offer', 'withdraw_first_purchase_offer')), 'absentes')
  union all
  select 14, 'Index des paiements crédités', 'unique, valide, stripe_payment_id, achats payés seulement',
         coalesce((select concat_ws(', ',
                            case when i.indisunique then 'unique' end,
                            case when i.indisvalid then 'valide' end,
                            (select string_agg(a.attname, ', ') from pg_attribute a
                              where a.attrelid = i.indrelid and a.attnum = any (i.indkey)),
                            case when pg_get_expr(i.indpred, i.indrelid) like '%type = ''purchase''%'
                                  and pg_get_expr(i.indpred, i.indrelid) like '%stripe_payment_id IS NOT NULL%'
                                 then 'achats payés seulement' end)
                     from pg_index i
                    where i.indexrelid = to_regclass('public.credits_transactions_purchase_payment_key')), 'absent')
  union all
  select 15, 'Tables nouvelles : index',
         'analysis_costs_pkey (id), first_purchase_offers_livemode_card_fingerprint_key (livemode, card_fingerprint),'
         || ' first_purchase_offers_payment_intent_key (payment_intent), first_purchase_offers_pkey (id),'
         || ' first_purchase_offers_user_id_key (user_id), idx_analysis_costs_analysis_id (analysis_id),'
         || ' idx_analysis_costs_created_at (created_at),'
         || ' idx_first_purchase_offers_probable_card (livemode, card_brand, card_last4, card_country)',
         coalesce((select string_agg(x.indexname || ' (' || x.cols || ')', ', ' order by x.indexname collate "C")
                     from (select ix.relname indexname,
                                  (select string_agg(a.attname, ', ' order by array_position(i.indkey::int2[], a.attnum))
                                     from pg_attribute a
                                    where a.attrelid = i.indrelid and a.attnum = any (i.indkey)) cols
                             from pg_index i
                             join pg_class ix on ix.oid = i.indexrelid
                            where i.indrelid in (to_regclass('public.analysis_costs'), to_regclass('public.first_purchase_offers'))) x), 'aucun')
  union all
  select 15 + t.n, 'Colonnes de ' || t.nom, t.attendu,
         coalesce((select string_agg(a.attname || ' ' || format_type(a.atttypid, a.atttypmod)
                                     || case when a.attnotnull then ' non-nul' else '' end
                                     || coalesce(' défaut ' || pg_get_expr(d.adbin, d.adrelid), ''),
                                     ', ' order by a.attnum)
                     from pg_attribute a
                     left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
                    where a.attrelid = to_regclass('public.' || t.nom) and a.attnum > 0 and not a.attisdropped), 'absente')
    from (values (1, 'analysis_costs',
                  'id uuid non-nul défaut extensions.uuid_generate_v4(), analysis_id uuid, model text non-nul, request_id text,'
                  || ' measured boolean non-nul, input_tokens integer, output_tokens integer, thinking_tokens integer,'
                  || ' cache_write_5m_tokens integer, cache_write_1h_tokens integer, cache_read_tokens integer,'
                  || ' inference_geo text, cost_usd numeric(12,6), price_list_date date, stop_reason text,'
                  || ' outcome text non-nul, failure_code text, created_at timestamp with time zone non-nul défaut now()'),
                 (2, 'first_purchase_offers',
                  'id uuid non-nul défaut extensions.uuid_generate_v4(), user_id uuid, payment_intent text non-nul,'
                  || ' livemode boolean non-nul, card_fingerprint text, wallet_type text, card_brand text,'
                  || ' card_last4 text, card_country text,'
                  || ' granted_at timestamp with time zone non-nul défaut now(), withdrawn_at timestamp with time zone'))
         as t(n, nom, attendu)
  union all
  select 17 + t.n, 'Contraintes de ' || t.nom, t.attendu,
         coalesce((select string_agg(k.conname || ' ' || pg_get_constraintdef(k.oid), ' | ' order by k.conname collate "C")
                     from pg_constraint k
                    where k.conrelid = to_regclass('public.' || t.nom) and k.contype <> 'n'), 'aucune')
    from (values (1, 'analysis_costs',
                  'analysis_costs_analysis_id_fkey FOREIGN KEY (analysis_id) REFERENCES public.analyses(id) ON DELETE SET NULL'
                  || ' | analysis_costs_cache_read_tokens_check CHECK ((cache_read_tokens >= 0))'
                  || ' | analysis_costs_cache_write_1h_tokens_check CHECK ((cache_write_1h_tokens >= 0))'
                  || ' | analysis_costs_cache_write_5m_tokens_check CHECK ((cache_write_5m_tokens >= 0))'
                  || ' | analysis_costs_cost_usd_check CHECK ((cost_usd >= (0)::numeric))'
                  || ' | analysis_costs_input_tokens_check CHECK ((input_tokens >= 0))'
                  || ' | analysis_costs_outcome_check CHECK ((outcome = ANY (ARRAY[''report''::text, ''insufficient''::text, ''failed''::text])))'
                  || ' | analysis_costs_output_tokens_check CHECK ((output_tokens >= 0))'
                  || ' | analysis_costs_pkey PRIMARY KEY (id)'
                  || ' | analysis_costs_thinking_tokens_check CHECK ((thinking_tokens >= 0))'),
                 (2, 'first_purchase_offers',
                  'first_purchase_offers_card_last4_check CHECK ((card_last4 ~ ''^[0-9]{4}$''::text))'
                  || ' | first_purchase_offers_livemode_card_fingerprint_key UNIQUE (livemode, card_fingerprint)'
                  || ' | first_purchase_offers_payment_intent_key UNIQUE (payment_intent)'
                  || ' | first_purchase_offers_pkey PRIMARY KEY (id)'
                  || ' | first_purchase_offers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL'
                  || ' | first_purchase_offers_user_id_key UNIQUE (user_id)'))
         as t(n, nom, attendu)
  union all
  select 20, 'Garde des profils (019)', 'active, hors service_role',
         coalesce((select case t.tgenabled when 'O' then 'active' else 'inactive' end
                          || case when pg_get_triggerdef(t.oid) like '%current_setting(''role''::text, true) IS DISTINCT FROM ''service_role''::text%'
                                  then ', hors service_role' else ', condition modifiée' end
                     from pg_trigger t
                    where t.tgrelid = 'public.profiles'::regclass and t.tgname = 'guard_profiles'), 'absente')
  union all
  select 21, 'Fonctions exécutables par anon (public, private)', 'aucune',
         coalesce((select string_agg(p.pronamespace::regnamespace::text || '.' || p.proname, ', '
                                     order by p.pronamespace::regnamespace::text collate "C", p.proname collate "C")
                     from pg_proc p
                    where p.pronamespace in ('public'::regnamespace, 'private'::regnamespace)
                      and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
                      and has_function_privilege('anon', p.oid, 'EXECUTE')), 'aucune')
  union all
  select 22, 'Fonctions exécutables par authenticated (public, private)', 'private.current_user_role, public.is_own_photo_path',
         coalesce((select string_agg(p.pronamespace::regnamespace::text || '.' || p.proname, ', '
                                     order by p.pronamespace::regnamespace::text collate "C", p.proname collate "C")
                     from pg_proc p
                    where p.pronamespace in ('public'::regnamespace, 'private'::regnamespace)
                      and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
                      and has_function_privilege('authenticated', p.oid, 'EXECUTE')), 'aucune')
  union all
  select 23, 'Offres sans la ligne d''achat de leur paiement', '0',
         (select count(*)::text from public.first_purchase_offers o
           where o.user_id is not null
             and not exists (select 1 from public.credits_transactions t
                              where t.type = 'purchase' and t.stripe_payment_id = o.payment_intent and t.user_id = o.user_id))
  union all
  select 24, 'Offres sans la ligne « bonus » +1 de leur paiement', '0',
         (select count(*)::text from public.first_purchase_offers o
           where o.user_id is not null
             and not exists (select 1 from public.credits_transactions t
                              where t.type = 'bonus' and t.amount = 1 and t.stripe_payment_id = o.payment_intent and t.user_id = o.user_id))
  union all
  select 25, 'Offres retirées sans la ligne « bonus » −1 de leur paiement', '0',
         (select count(*)::text from public.first_purchase_offers o
           where o.user_id is not null and o.withdrawn_at is not null
             and not exists (select 1 from public.credits_transactions t
                              where t.type = 'bonus' and t.amount = -1 and t.stripe_payment_id = o.payment_intent and t.user_id = o.user_id))
  union all
  select 26, 'Lignes « bonus » d''un paiement absent du registre des offres', '0',
         (select count(*)::text from public.credits_transactions t
           where t.type = 'bonus' and t.stripe_payment_id is not null
             and not exists (select 1 from public.first_purchase_offers o where o.payment_intent = t.stripe_payment_id))
  union all
  select 27, 'Paiements crédités plusieurs fois', '0',
         (select count(*)::text from (select t.stripe_payment_id from public.credits_transactions t
                                       where t.type = 'purchase' and t.stripe_payment_id is not null
                                       group by t.stripe_payment_id having count(*) > 1) d)
  union all
  select 28, 'Registre des offres', '—',
         (select format('%s accordée(s), dont %s retirée(s), %s d''un compte supprimé et %s sans empreinte (accordées à la main)',
                        count(*), count(*) filter (where o.withdrawn_at is not null), count(*) filter (where o.user_id is null),
                        count(*) filter (where o.card_fingerprint is null))
            from public.first_purchase_offers o)
  union all
  select 29, 'Coûts IA enregistrés', '—',
         (select format('%s ligne(s), dont %s non mesurée(s)', count(*), count(*) filter (where not c.measured))
            from public.analysis_costs c)
)
select ordre, controle, attendu, observe,
       case when attendu = '—' then 'info' when attendu = observe then 'ok' else 'ÉCART' end as resultat
  from controles
 order by ordre;
