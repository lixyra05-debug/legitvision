-- ============================================================
-- Contrôle de la migration 019, exécuté DANS sa transaction, avant le commit
-- ============================================================
-- 1. Structure : fonctions, droits, règles, droits par défaut, index,
--    registre des migrations, propriétaire des objets, bucket des photos.
-- 2. Accès réels : chaque essai s'exécute sous le rôle d'un visiteur, d'un
--    utilisateur réel ou du serveur, puis il est annulé. Aucune donnée ne
--    change. Un seul écart annule toute la migration, et le message le dit.
-- N'utilise que des objets temporaires (supprimés à la fin de la session).

drop table if exists pg_temp.controle_019;
create temp table controle_019 (
  ordre    int primary key,
  controle text not null,
  attendu  text not null,
  observe  text not null
);
alter table controle_019 enable row level security;  -- réservée à postgres, qui la lit

-- Motif d'un refus : la garde des analyses, une règle RLS, ou le message.
create or replace function pg_temp.motif(p_etat text, p_message text)
returns text
language sql
as $f$
  select 'refusé (' || p_etat
    || case
         when p_message like 'analyses : %' then ', garde'
         when p_message like 'new row violates row-level security policy%' then ', RLS'
         else ', ' || left(p_message, 60)
       end
    || ')'
$f$;

-- Étapes (rôle, utilisateur, requête) exécutées puis annulées.
-- « accepté », « sans effet » (une étape n'a touché aucune ligne) ou le motif.
create or replace function pg_temp.essai(p_ordre int, p_controle text, p_attendu text, p_etapes jsonb)
returns void
language plpgsql
as $f$
declare
  etape    jsonb;
  lignes   bigint;
  resultat text := 'accepté';
begin
  begin
    for etape in select value from jsonb_array_elements(p_etapes) loop
      perform set_config('request.jwt.claims',
        json_build_object('sub', etape->>'user', 'role', etape->>'role')::text, true);
      perform set_config('role', etape->>'role', true);
      execute etape->>'sql';
      get diagnostics lignes = row_count;
      if lignes = 0 then
        resultat := 'sans effet';
      end if;
    end loop;
    raise exception using errcode = 'LV001';  -- annule l'essai
  exception
    when sqlstate 'LV001' then null;
    when others then resultat := pg_temp.motif(sqlstate, sqlerrm);
  end;
  insert into controle_019 values (p_ordre, p_controle, p_attendu, resultat);
end;
$f$;

-- Nombre de lignes que p_sql renvoie sous ce rôle (« lignes : n ») ou le motif.
create or replace function pg_temp.compte(p_ordre int, p_controle text, p_attendu text, p_role text, p_user uuid, p_sql text)
returns void
language plpgsql
as $f$
declare
  n        bigint;
  resultat text;
begin
  begin
    perform set_config('request.jwt.claims', json_build_object('sub', p_user, 'role', p_role)::text, true);
    perform set_config('role', p_role, true);
    execute 'select count(*) from (' || p_sql || ') as s' into n;
    resultat := 'lignes : ' || n;
    raise exception using errcode = 'LV001';
  exception
    when sqlstate 'LV001' then null;
    when others then resultat := pg_temp.motif(sqlstate, sqlerrm);
  end;
  insert into controle_019 values (p_ordre, p_controle, p_attendu, resultat);
end;
$f$;

-- ── 1. Structure ────────────────────────────────────────────

insert into controle_019
select 1, 'Fonctions du schéma public',
       'decrement_credits_atomic, handle_new_user, is_own_photo_path, lock_analysis_results, lock_privileged_profile_cols',
       coalesce((select string_agg(p.proname, ', ' order by p.proname collate "C")
                   from pg_proc p
                  where p.pronamespace = 'public'::regnamespace
                    and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')), 'aucune')
union all
select 2, 'Fonctions du schéma private', 'current_user_role',
       coalesce((select string_agg(p.proname, ', ' order by p.proname collate "C")
                   from pg_proc p where p.pronamespace = 'private'::regnamespace), 'aucune')
union all
select 3, 'Fonctions exécutables par anon', 'aucune',
       coalesce((select string_agg(p.pronamespace::regnamespace::text || '.' || p.proname, ', ' order by p.pronamespace::regnamespace::text collate "C", p.proname collate "C")
                   from pg_proc p
                  where p.pronamespace in ('public'::regnamespace, 'private'::regnamespace)
                    and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
                    and has_function_privilege('anon', p.oid, 'EXECUTE')), 'aucune')
union all
select 4, 'Fonctions exécutables par authenticated', 'private.current_user_role, public.is_own_photo_path',
       coalesce((select string_agg(p.pronamespace::regnamespace::text || '.' || p.proname, ', ' order by p.pronamespace::regnamespace::text collate "C", p.proname collate "C")
                   from pg_proc p
                  where p.pronamespace in ('public'::regnamespace, 'private'::regnamespace)
                    and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
                    and has_function_privilege('authenticated', p.oid, 'EXECUTE')), 'aucune')
union all
select 5, 'Fonctions sans search_path fixé', 'aucune',
       coalesce((select string_agg(p.proname, ', ' order by p.proname collate "C")
                   from pg_proc p
                  where p.pronamespace in ('public'::regnamespace, 'private'::regnamespace)
                    and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
                    and not exists (select 1 from unnest(coalesce(p.proconfig, '{}')) c where c like 'search_path=%')), 'aucune')
union all
select 6, 'Déclencheurs actifs du schéma public',
       'analyses.guard_analyses, analyses.set_analyses_updated_at, profiles.guard_profiles, profiles.set_profiles_updated_at',
       coalesce((select string_agg(c.relname || '.' || t.tgname, ', ' order by c.relname collate "C", t.tgname collate "C")
                   from pg_trigger t join pg_class c on c.oid = t.tgrelid
                  where c.relnamespace = 'public'::regnamespace and not t.tgisinternal and t.tgenabled = 'O'), 'aucun')
union all
select 7, 'Règles RLS du schéma public',
       'analyses : analyses_delete, analyses_insert, analyses_select, analyses_update'
       || ' | analysis_photos : analysis_photos_delete, analysis_photos_insert, analysis_photos_select, analysis_photos_update'
       || ' | brands : brands_delete, brands_insert, brands_select, brands_select_anon, brands_update'
       || ' | credits_transactions : credits_transactions_select'
       || ' | models : models_delete, models_insert, models_select, models_select_anon, models_update'
       || ' | profiles : profiles_select',
       coalesce((select string_agg(t || ' : ' || r, ' | ' order by t collate "C")
                   from (select tablename t, string_agg(policyname, ', ' order by policyname collate "C") r
                           from pg_policies where schemaname = 'public' group by tablename) x), 'aucune')
union all
select 8, 'Droits de table de anon (effectifs, colonnes comprises)', 'brands : SELECT | models : SELECT',
       coalesce((select string_agg(t || ' : ' || p, ' | ' order by t collate "C")
                   from (select c.relname t, string_agg(x.priv, ', ' order by x.priv collate "C") p
                           from pg_class c
                          cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER']) as x(priv)
                          where c.relnamespace = 'public'::regnamespace
                            and c.relkind in ('r', 'p', 'v', 'm', 'f')
                            and (has_table_privilege('anon', c.oid, x.priv)
                                 or case when x.priv in ('SELECT', 'INSERT', 'UPDATE', 'REFERENCES')
                                         then has_any_column_privilege('anon', c.oid, x.priv) else false end)
                          group by c.relname) y), 'aucun')
union all
select 9, 'Droits de table de authenticated (effectifs, colonnes comprises)',
       'analyses : DELETE, INSERT, SELECT, UPDATE | analysis_photos : DELETE, INSERT, SELECT, UPDATE'
       || ' | brands : DELETE, INSERT, SELECT, UPDATE | credits_transactions : SELECT'
       || ' | models : DELETE, INSERT, SELECT, UPDATE | profiles : SELECT',
       coalesce((select string_agg(t || ' : ' || p, ' | ' order by t collate "C")
                   from (select c.relname t, string_agg(x.priv, ', ' order by x.priv collate "C") p
                           from pg_class c
                          cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER']) as x(priv)
                          where c.relnamespace = 'public'::regnamespace
                            and c.relkind in ('r', 'p', 'v', 'm', 'f')
                            and (has_table_privilege('authenticated', c.oid, x.priv)
                                 or case when x.priv in ('SELECT', 'INSERT', 'UPDATE', 'REFERENCES')
                                         then has_any_column_privilege('authenticated', c.oid, x.priv) else false end)
                          group by c.relname) y), 'aucun')
union all
select 10, 'Droits par défaut de postgres dans public ouverts à anon, authenticated ou public', 'aucun',
       coalesce((select string_agg(coalesce(nullif(a.defaclnamespace, 0)::regnamespace::text, 'global') || '/' || a.defaclobjtype::text || ' : ' || acl::text, ', ')
                   from pg_default_acl a, unnest(a.defaclacl) acl
                  where a.defaclrole = 'postgres'::regrole
                    and a.defaclnamespace = 'public'::regnamespace
                    and (acl::text like 'anon=%' or acl::text like 'authenticated=%' or acl::text like '=%')), 'aucun')
union all
select 11, 'Index des clés étrangères ajoutés', 'idx_analyses_expert_id, idx_analyses_model_id, idx_credits_tx_analysis_id',
       coalesce((select string_agg(indexname, ', ' order by indexname collate "C") from pg_indexes
                  where schemaname = 'public'
                    and indexname in ('idx_analyses_model_id', 'idx_analyses_expert_id', 'idx_credits_tx_analysis_id')), 'aucun')
union all
select 12, 'Droit par défaut global de postgres sur les fonctions', '{postgres=X/postgres}',
       coalesce((select a.defaclacl::text from pg_default_acl a
                  where a.defaclrole = 'postgres'::regrole and a.defaclnamespace = 0 and a.defaclobjtype = 'f'),
                'absent : public garde EXECUTE sur toute nouvelle fonction')
union all
select 13, 'Migrations enregistrées', '19, de 1 à 19',
       (select count(*) || ', de ' || coalesce(min(numero)::text, '?') || ' à ' || coalesce(max(numero)::text, '?')
          from private.migrations)
union all
select 14, 'Objets de public dont postgres n''est pas propriétaire', 'aucun',
       coalesce((select string_agg(o, ', ' order by o collate "C") from (
                   select c.relname || ' (' || pg_get_userbyid(c.relowner) || ')' o
                     from pg_class c
                    where c.relnamespace = 'public'::regnamespace and c.relowner <> 'postgres'::regrole
                      and not exists (select 1 from pg_depend d where d.classid = 'pg_class'::regclass and d.objid = c.oid and d.deptype = 'e')
                   union all
                   select p.proname || ' (' || pg_get_userbyid(p.proowner) || ')'
                     from pg_proc p
                    where p.pronamespace = 'public'::regnamespace and p.proowner <> 'postgres'::regrole
                      and not exists (select 1 from pg_depend d where d.classid = 'pg_proc'::regclass and d.objid = p.oid and d.deptype = 'e')
                 ) x), 'aucun')
union all
select 15, 'Bucket des photos', 'privé, 10485760 octets, image/jpeg,image/png,image/webp',
       coalesce((select case when b.public then 'public' else 'privé' end
                        || ', ' || coalesce(b.file_size_limit::text || ' octets', 'sans limite')
                        || ', ' || coalesce(array_to_string(b.allowed_mime_types, ','), 'tous types')
                   from storage.buckets b where b.id = 'analysis-photos'), 'absent');

-- ── 2. Accès réels ──────────────────────────────────────────

do $d$
declare
  u      uuid;   -- compte « user » d'une analyse terminée
  v      uuid;   -- autre compte « user » avec une analyse
  cu     uuid;   -- compte avec au moins un crédit
  fini   uuid;
  marque uuid;
  modele uuid;
  cat    text;
  n1 uuid := gen_random_uuid();
  n4 uuid := gen_random_uuid();
  n5 uuid := gen_random_uuid();
  n6 uuid := gen_random_uuid();
  creer text := 'insert into public.analyses (id, user_id, brand_id, model_id, category, status) values (%L, %L, %L, %L, %L, %L)';
  photo text := 'insert into public.analysis_photos (analysis_id, user_id, storage_path, photo_type, order_index) values (%L, %L, %L, %L, 0)';
begin
  select a.user_id, a.id, a.brand_id, a.model_id, a.category
    into u, fini, marque, modele, cat
    from public.analyses a
    join public.profiles p on p.id = a.user_id and p.role = 'user'
   where a.status in ('completed', 'expert_review')
   order by a.created_at
   limit 1;
  select a.user_id into v
    from public.analyses a
    join public.profiles p on p.id = a.user_id and p.role = 'user'
   where a.user_id <> u
   order by a.created_at
   limit 1;
  select p.id into cu from public.profiles p where p.credits_remaining >= 1 order by p.created_at limit 1;
  if fini is null or v is null or cu is null then
    raise exception 'Contrôle 019 impossible : il faut une analyse terminée d''un compte « user », un second compte « user » avec une analyse et un compte crédité. Rien n''est appliqué.';
  end if;

  perform pg_temp.compte(20, 'Visiteur : lit les marques actives',
    'lignes : ' || (select count(*) from public.brands where is_active), 'anon', null,
    'select id from public.brands');
  perform pg_temp.compte(21, 'Visiteur : lit les modèles actifs',
    'lignes : ' || (select count(*) from public.models where is_active), 'anon', null,
    'select id from public.models');
  perform pg_temp.compte(22, 'Visiteur : lire les analyses', 'refusé (42501, permission denied for table analyses)', 'anon', null,
    'select id from public.analyses');
  perform pg_temp.compte(23, 'Visiteur : lire les profils', 'refusé (42501, permission denied for table profiles)', 'anon', null,
    'select id from public.profiles');
  perform pg_temp.compte(24, 'Utilisateur : lit ses analyses',
    'lignes : ' || (select count(*) from public.analyses where user_id = u), 'authenticated', u,
    'select id from public.analyses');
  perform pg_temp.compte(25, 'Utilisateur : lire les analyses d''un autre compte', 'lignes : 0', 'authenticated', u,
    format('select id from public.analyses where user_id = %L', v));
  perform pg_temp.compte(26, 'Utilisateur : lit son journal de crédits',
    'lignes : ' || (select count(*) from public.credits_transactions where user_id = u), 'authenticated', u,
    'select id from public.credits_transactions');
  perform pg_temp.compte(27, 'Utilisateur : lit son profil et pas un autre', 'lignes : 1', 'authenticated', u,
    format('select id from public.profiles where id in (%L, %L)', u, v));
  perform pg_temp.compte(28, 'Utilisateur : lit les marques actives',
    'lignes : ' || (select count(*) from public.brands where is_active), 'authenticated', u,
    'select id from public.brands');

  perform pg_temp.essai(30, 'Utilisateur : écrire dans son journal de crédits',
    'refusé (42501, permission denied for table credits_transactions)', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql',
      format('insert into public.credits_transactions (user_id, type, amount, balance_after) values (%L, %L, 5, 5)', u, 'bonus'))));
  perform pg_temp.essai(31, 'Utilisateur : modifier son profil', 'refusé (42501, permission denied for table profiles)', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql',
      format('update public.profiles set full_name = %L where id = %L', 'essai', u))));
  perform pg_temp.essai(32, 'Utilisateur : parcours normal (créer, photo, lancer, échouer)', 'accepté', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format(creer, n1, u, marque, modele, cat, 'uploading')),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format(photo, n1, u, u || '/' || n1 || '/sole.jpg', 'sole')),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format('update public.analyses set status = %L where id = %L', 'pending', n1)),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format('update public.analyses set status = %L where id = %L', 'failed', n1))));
  perform pg_temp.essai(33, 'Utilisateur : falsifier un rapport terminé', 'refusé (42501, garde)', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql',
      format('update public.analyses set overall_score = case when overall_score is distinct from 99 then 99 else 98 end where id = %L', fini))));
  perform pg_temp.essai(34, 'Utilisateur : supprimer une de ses analyses (réservé à l''admin)', 'sans effet', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format('delete from public.analyses where id = %L', fini))));
  perform pg_temp.essai(35, 'Admin : voit les analyses d''un autre compte', 'accepté', jsonb_build_array(
    jsonb_build_object('role', 'service_role', 'sql', format('update public.profiles set role = %L where id = %L', 'admin', u)),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format('select id from public.analyses where user_id = %L', v))));
  perform pg_temp.essai(36, 'Serveur : débite un crédit', 'accepté', jsonb_build_array(
    jsonb_build_object('role', 'service_role', 'sql',
      format('select public.decrement_credits_atomic(%L, null, %L)', cu, 'contrôle 019'))));
  perform pg_temp.essai(37, 'Serveur : enregistre un rapport', 'accepté', jsonb_build_array(
    jsonb_build_object('role', 'service_role', 'sql', format(creer, n4, u, marque, modele, cat, 'pending')),
    jsonb_build_object('role', 'service_role', 'sql', format('update public.analyses set status = %L where id = %L', 'analyzing', n4)),
    jsonb_build_object('role', 'service_role', 'sql',
      format('update public.analyses set status = %L, overall_score = 88, verdict = %L, confidence = %L where id = %L',
             'completed', 'likely_authentic', 'high', n4))));

  perform pg_temp.essai(38, 'Utilisateur : créer une analyse au nom d''un autre compte', 'refusé (42501, RLS)', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format(creer, n5, v, marque, modele, cat, 'uploading'))));
  perform pg_temp.essai(39, 'Utilisateur : ajouter une photo à l''analyse d''un autre compte', 'refusé (42501, RLS)', jsonb_build_array(
    jsonb_build_object('role', 'service_role', 'sql', format(creer, n5, v, marque, modele, cat, 'uploading')),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format(photo, n5, u, u || '/' || n5 || '/sole.jpg', 'sole'))));
  perform pg_temp.essai(40, 'Utilisateur : lire les photos d''un autre compte', 'sans effet', jsonb_build_array(
    jsonb_build_object('role', 'service_role', 'sql', format(creer, n5, v, marque, modele, cat, 'uploading')),
    jsonb_build_object('role', 'service_role', 'sql', format(photo, n5, v, v || '/' || n5 || '/sole.jpg', 'sole')),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format('select id from public.analysis_photos where analysis_id = %L', n5))));
  perform pg_temp.essai(41, 'Utilisateur : modifier une marque', 'sans effet', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format('update public.brands set name = name where id = %L', marque))));
  perform pg_temp.essai(42, 'Utilisateur : ajouter un modèle', 'refusé (42501, RLS)', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql',
      format('insert into public.models (brand_id, name, slug) values (%L, %L, %L)', marque, 'contrôle 019', 'controle-019'))));
  perform pg_temp.essai(43, 'Visiteur : lire une marque désactivée', 'sans effet', jsonb_build_array(
    jsonb_build_object('role', 'service_role', 'sql', format('update public.brands set is_active = false where id = %L', marque)),
    jsonb_build_object('role', 'anon', 'sql', format('select id from public.brands where id = %L', marque))));
  perform pg_temp.essai(44, 'Garde des profils : crédits intouchables hors serveur', 'refusé (P0001, forbidden column update)', jsonb_build_array(
    jsonb_build_object('role', 'postgres', 'sql', format('update public.profiles set credits_remaining = credits_remaining + 1 where id = %L', u))));
  perform pg_temp.essai(45, 'Serveur : pas de débit sans crédit', 'refusé (P0001, INSUFFICIENT_CREDITS)', jsonb_build_array(
    jsonb_build_object('role', 'service_role', 'sql', format('update public.profiles set credits_remaining = 0 where id = %L', cu)),
    jsonb_build_object('role', 'service_role', 'sql', format('select public.decrement_credits_atomic(%L, null, %L)', cu, 'contrôle 019'))));
  perform pg_temp.essai(46, 'Inscription : le profil est créé', 'accepté', jsonb_build_array(
    jsonb_build_object('role', 'postgres', 'sql', format('insert into auth.users (id) values (%L)', n6)),
    jsonb_build_object('role', 'postgres', 'sql', format('select id from public.profiles where id = %L and credits_remaining = 0', n6))));
end;
$d$;

do $$
declare
  echecs text;
begin
  select string_agg(ordre || '. ' || controle || ' : attendu « ' || attendu || ' », observé « ' || observe || ' »',
                    ' | ' order by ordre)
    into echecs
    from controle_019
   where attendu <> observe;
  if echecs is not null then
    raise exception 'Contrôle 019 en échec, rien n''est appliqué : %', echecs;
  end if;
end;
$$;
