-- ============================================================================
-- LegitVision — migration 020 : requête d'état (LECTURE SEULE)
--
-- EN BREF
--   Dans l'éditeur SQL de Supabase : une nouvelle requête VIDE, coller ce
--   fichier en entier, cliquer « Run ». Rien à sélectionner : avec une
--   sélection, le bouton devient « Run selected » et ne lance que le morceau
--   sélectionné. Cette requête n'écrit rien.
--   Lire la PREMIÈRE ligne du résultat (colonne « resultat ») :
--     « PRÊT : … »      la base est dans l'état relevé le 2026-10-14 avant la
--                       020 : on peut lancer la migration ;
--     « APPLIQUÉE : … » la 020 est en place, à l'identique de l'essai ;
--     « ÉCARTS : … »    ni l'un ni l'autre : ne rien lancer, me transmettre
--                       la ligne.
--   La même requête sert avant la migration, après, et après un retour
--   arrière (elle répond de nouveau « PRÊT »).
--
-- CE QU'ELLE REGARDE
--   1. le registre des migrations (019 en place, 020 absente ou présente,
--      aucune plus récente) ;
--   2. les six objets de la 020 (deux tables, un index, trois fonctions), et
--      le texte des trois fonctions, comparé à celui du fichier de la 020 ;
--   3. les paiements crédités deux fois (la 020 refuse de s'appliquer s'il y
--      en a) ;
--   4. la garde des profils de la 019 ;
--   5. l'empreinte de ce qui protège les données dans les schémas public et
--      private (fonctions et texte de leur corps, déclencheurs, règles RLS,
--      droits, structure des tables), calculée comme
--      supabase/checks/etat_base.sql. Pour ne pas dépendre du réglage de
--      l'éditeur, les noms de schéma public et extensions en sont retirés :
--      « public.f », « extensions.f » et « f » y comptent pour un même nom.
--      Les tables de stockage de Supabase, les fonctions du schéma extensions
--      et les droits par défaut n'en font pas partie : supabase/checks/
--      etat_base.sql, relu après l'exécution, les couvre ;
--   6. le repère de la production : l'heure exacte, à la microseconde, à
--      laquelle la 019 y a été appliquée. Une copie de la base, ou un autre
--      projet, répond « ÉCARTS ».
--   Quand le verdict est « ÉCARTS », la cellule empreinte_base commence par
--   « ÉCARTS » : la feuille d'exécution la refuse.
--   Les valeurs attendues (empreintes avant et après, texte des fonctions)
--   viennent du banc d'essai (supabase/scripts/outils/020/banc.mjs), qui
--   rejoue les migrations 001 à 020 sur une base locale identique à la
--   production pour tout ce que l'empreinte couvre ; banc.mjs vérifie que ce
--   fichier les porte.
-- ============================================================================

with
fonctions as (
  select 'fonction' as type_,
         n.nspname || '.' || p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' as objet,
         concat_ws(' ',
           'proprietaire:' || pg_get_userbyid(p.proowner),
           case when p.prosecdef then 'definer' else 'invoker' end,
           coalesce(array_to_string(p.proconfig, ','), 'sans-config'),
           coalesce(p.proacl::text, 'acl-par-defaut'),
           'retour:' || pg_get_function_result(p.oid),
           'corps:' || md5(p.prosrc)) as empreinte
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
   where n.nspname in ('public', 'private')
     and not exists (select 1 from pg_depend d
                      where d.classid = 'pg_proc'::regclass and d.objid = p.oid and d.deptype = 'e')
     -- La seule fonction du banc d'essai qui remplace une extension (moddatetime), reconnue au texte exact de son corps.
     and not (n.nspname = 'public' and p.proname = 'moddatetime' and md5(p.prosrc) = '106c2b31fe27306af6e9ce4cd01af272')
),
declencheurs as (
  select 'declencheur', n.nspname || '.' || c.relname || '.' || t.tgname,
         t.tgenabled::text || ' ' || md5(regexp_replace(pg_get_triggerdef(t.oid), '(^|[^a-z0-9_."])(public|extensions)\.', '\1', 'g'))
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
   where not t.tgisinternal
     and n.nspname in ('public', 'private')
),
regles as (
  select 'regle', schemaname || '.' || tablename || '.' || policyname,
         concat_ws(' ', permissive, cmd, roles::text,
                   md5(regexp_replace(coalesce(qual, ''), '(^|[^a-z0-9_."])(public|extensions)\.', '\1', 'g') || '|' || regexp_replace(coalesce(with_check, ''), '(^|[^a-z0-9_."])(public|extensions)\.', '\1', 'g')))
    from pg_policies
   where schemaname in ('public', 'private')
),
tables as (
  select 'table', n.nspname || '.' || c.relname,
         concat_ws(' ',
           'type:' || c.relkind::text,
           'proprietaire:' || pg_get_userbyid(c.relowner),
           coalesce(c.relacl::text, 'acl-par-defaut'),
           'rls:' || c.relrowsecurity::text,
           'forcee:' || c.relforcerowsecurity::text)
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
   where n.nspname in ('public', 'private') and c.relkind in ('r', 'p', 'v', 'm', 'f', 'S')
),
colonnes as (
  select 'droit-colonne', n.nspname || '.' || c.relname || '.' || a.attname, a.attacl::text
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
   where a.attacl is not null and a.attnum > 0 and not a.attisdropped
     and n.nspname in ('public', 'private')
),
structure as (
  select 'colonne', n.nspname || '.' || c.relname || '.' || a.attname,
         concat_ws(' ',
           format_type(a.atttypid, a.atttypmod),
           case when a.attnotnull then 'non-nul' else 'nul' end,
           'defaut:' || coalesce(pg_get_expr(d.adbin, d.adrelid), 'aucun'),
           case when a.attidentity <> '' then 'identite:' || a.attidentity::text end,
           case when a.attgenerated <> '' then 'generee:' || a.attgenerated::text end)
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
    left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
   where n.nspname in ('public', 'private') and c.relkind in ('r', 'p')
     and a.attnum > 0 and not a.attisdropped
),
contraintes as (
  select 'contrainte', n.nspname || '.' || c.relname || '.' || k.conname, pg_get_constraintdef(k.oid)
    from pg_constraint k
    join pg_class c on c.oid = k.conrelid
    join pg_namespace n on n.oid = c.relnamespace
   where n.nspname in ('public', 'private')
),
index_ as (
  select 'index', n.nspname || '.' || i.relname, pg_get_indexdef(i.oid)
    from pg_index x
    join pg_class i on i.oid = x.indexrelid
    join pg_namespace n on n.oid = i.relnamespace
   where n.nspname in ('public', 'private')
),
base as (
  -- Les noms de schéma public et extensions s'affichent ou non selon le réglage de l'éditeur : ils sont retirés partout,
  -- ici et, avant leur empreinte, dans les déclencheurs et les règles RLS.
  select md5(string_agg(
           regexp_replace(t.type_ || E'\t' || t.objet || E'\t' || t.empreinte, '(^|[^a-z0-9_."])(public|extensions)\.', '\1', 'g'),
           E'\n' order by t.type_ collate "C", t.objet collate "C")) as empreinte
    from (select * from fonctions
          union all select * from declencheurs
          union all select * from regles
          union all select * from tables
          union all select * from colonnes
          union all select * from structure
          union all select * from contraintes
          union all select * from index_) as t
),
attendu as (
  select '996d63cf501e1c39bc0d8ea0cbd8d4a9'::text as avant,
         '180a07c7d29172014a6d8a866ba927bd'::text as apres,
         jsonb_build_object(
           'credit_single_purchase', '83652ffe4e4f7095a411808c373525df',
           'grant_first_purchase_offer', 'f3545ad98d97f2eb928949cb50fb4373',
           'withdraw_first_purchase_offer', 'c5cb319455c1b8bf1974ecc9e29d5f05') as corps
),
etat as (
  select
    (select count(*) from private.migrations) as migrations,
    (select coalesce(max(numero), 0) from private.migrations) as derniere,
    (select count(*) from private.migrations where numero = 19) = 1 as a_019,
    -- Repère de la production : l'heure exacte à laquelle Hector y a exécuté la 019 (relevée le 2026-10-14).
    coalesce((select to_char(m.appliquee_le at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US')
                from private.migrations m where m.numero = 19), 'absente') as heure_019,
    (select count(*) from private.migrations where numero = 20) = 1 as a_020,
    (select count(*) from pg_class c
      where c.relnamespace = 'public'::regnamespace
        and c.relname in ('analysis_costs', 'first_purchase_offers', 'credits_transactions_purchase_payment_key'))
    + (select count(*) from pg_proc p
        where p.pronamespace = 'public'::regnamespace
          and p.proname in ('credit_single_purchase', 'grant_first_purchase_offer', 'withdraw_first_purchase_offer')) as objets,
    (select count(*) from pg_proc p cross join attendu a
      where p.pronamespace = 'public'::regnamespace
        and a.corps ->> p.proname = md5(p.prosrc)) as fonctions_conformes,
    (select count(*) from (select t.stripe_payment_id from public.credits_transactions t
                            where t.type = 'purchase' and t.stripe_payment_id is not null
                            group by t.stripe_payment_id having count(*) > 1) d) as doublons,
    coalesce((select case t.tgenabled when 'O' then 'active' else 'inactive' end
                     || case when pg_get_triggerdef(t.oid) like '%current_setting(''role''::text, true) IS DISTINCT FROM ''service_role''::text%'
                             then ', hors service_role' else ', condition modifiée' end
                from pg_trigger t
               where t.tgrelid = 'public.profiles'::regclass and t.tgname = 'guard_profiles'), 'absente') as garde,
    (select b.empreinte from base b) as empreinte
),
verdict as (
  select e.*, a.avant, a.apres, e.heure_019 = '2026-09-27T14:52:30.546896' as production,
         case
           when e.heure_019 = '2026-09-27T14:52:30.546896' and e.a_019 and not e.a_020 and e.derniere = 19 and e.objets = 0 and e.doublons = 0
                and e.garde = 'active, hors service_role' and e.empreinte = a.avant
             then 'PRÊT : la base est dans l''état relevé le 2026-10-14 avant la 020 (019 en place, aucun objet de la 020, aucun paiement crédité deux fois). On peut lancer la migration.'
           when e.heure_019 = '2026-09-27T14:52:30.546896' and e.a_019 and e.a_020 and e.derniere = 20 and e.objets = 6 and e.fonctions_conformes = 3
                and e.garde = 'active, hors service_role' and e.empreinte = a.apres
             then 'APPLIQUÉE : la 020 est en place, à l''identique de l''essai (6 objets, 3 fonctions conformes au fichier).'
           else 'ÉCARTS : la base n''est ni dans l''état d''avant la 020 ni dans celui d''après (détail dans les lignes suivantes). Ne rien lancer : me transmettre ce résultat.'
         end as resultat
    from etat e cross join attendu a
)
select 0 as n, v.resultat,
       case when v.resultat like 'ÉCARTS%' then 'ÉCARTS ' || v.empreinte else v.empreinte end as empreinte_base
  from verdict v
union all
select 1, 'Migrations enregistrées : ' || v.migrations || ', la dernière est la ' || v.derniere || ' (avant la 020 : 19, après : 20). 019 appliquée le ' || v.heure_019
          || case when v.production then ' UTC : la base de production.' else ' : ce n''est pas la base de production (019 appliquée le 2026-09-27T14:52:30.546896 UTC).' end, null from verdict v
union all
select 2, 'Objets de la 020 présents : ' || v.objets || ' sur 6 (avant : 0, après : 6).', null from verdict v
union all
select 3, 'Fonctions de la 020 conformes au fichier : ' || v.fonctions_conformes || ' sur 3 (avant : 0, après : 3).', null from verdict v
union all
select 4, 'Paiements crédités deux fois : ' || v.doublons || ' (attendu : 0).', null from verdict v
union all
select 5, 'Garde des profils (019) : ' || v.garde || ' (attendu : active, hors service_role).', null from verdict v
union all
select 6, 'Empreinte de la base : ' || case when v.empreinte = v.avant then 'celle d''avant la 020' when v.empreinte = v.apres then 'celle d''après la 020' else 'ni celle d''avant, ni celle d''après' end
          || ' (avant : ' || v.avant || ', après : ' || v.apres || ').', null from verdict v
order by n;
-- FIN — migration 020 : requête d'état (lecture seule)
