-- ============================================================
-- État de la base : empreinte de tout ce qui protège les données
-- ============================================================
-- Une ligne par objet, avec une empreinte de sa définition. À exécuter en
-- lecture seule (MCP supabase-lecture ou éditeur) et à comparer à
-- supabase/checks/etat_base.attendu.tsv : toute différence est un objet créé
-- ou modifié hors du dépôt (CLAUDE.md, règle 16). Après chaque migration
-- exécutée en production, capturer la sortie et la committer comme attendu.
--
-- Périmètre :
--   schémas public et private : fonctions (propriétaire, droits, corps),
--     déclencheurs, règles RLS, tables (propriétaire, droits, RLS forcée ou
--     non), droits de colonne ;
--   auth.users : tous ses déclencheurs ;
--   storage : règles et droits de objects et buckets, réglages des buckets ;
--   droits par défaut de postgres et supabase_admin (global, public,
--     private, storage) ; droits des schémas ; schéma de chaque extension.
-- Fonctionne avant la 019 (schéma private absent) comme après.

set search_path = pg_catalog;

with fonctions as (
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
),
declencheurs as (
  select 'declencheur', n.nspname || '.' || c.relname || '.' || t.tgname,
         t.tgenabled::text || ' ' || md5(pg_get_triggerdef(t.oid))
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
   where not t.tgisinternal
     and (n.nspname in ('public', 'private') or (n.nspname = 'auth' and c.relname = 'users'))
),
regles as (
  select 'regle', schemaname || '.' || tablename || '.' || policyname,
         concat_ws(' ', permissive, cmd, roles::text, md5(coalesce(qual, '') || '|' || coalesce(with_check, '')))
    from pg_policies
   where schemaname in ('public', 'private')
      or (schemaname = 'storage' and tablename in ('objects', 'buckets'))
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
   where (n.nspname in ('public', 'private') and c.relkind in ('r', 'p', 'v', 'm', 'f', 'S'))
      or (n.nspname = 'storage' and c.relname in ('objects', 'buckets'))
),
colonnes as (
  select 'droit-colonne', n.nspname || '.' || c.relname || '.' || a.attname, a.attacl::text
    from pg_attribute a
    join pg_class c on c.oid = a.attrelid
    join pg_namespace n on n.oid = c.relnamespace
   where a.attacl is not null and a.attnum > 0 and not a.attisdropped
     and (n.nspname in ('public', 'private') or (n.nspname = 'storage' and c.relname in ('objects', 'buckets')))
),
droits_defaut as (
  select 'droit-defaut',
         pg_get_userbyid(a.defaclrole) || '.' || coalesce(n.nspname, 'global') || '.' || a.defaclobjtype::text,
         a.defaclacl::text
    from pg_default_acl a
    left join pg_namespace n on n.oid = a.defaclnamespace
   where pg_get_userbyid(a.defaclrole) in ('postgres', 'supabase_admin')
     and (a.defaclnamespace = 0 or n.nspname in ('public', 'private', 'storage'))
),
schemas as (
  select 'schema', n.nspname,
         concat_ws(' ', 'proprietaire:' || pg_get_userbyid(n.nspowner), coalesce(n.nspacl::text, 'acl-par-defaut'))
    from pg_namespace n
   where n.nspname in ('public', 'private', 'storage')
),
extensions as (
  select 'extension', e.extname, n.nspname
    from pg_extension e
    join pg_namespace n on n.oid = e.extnamespace
),
buckets as (
  select 'bucket', b.id,
         concat_ws(' ',
           'public:' || b.public::text,
           'taille-max:' || coalesce(b.file_size_limit::text, 'aucune'),
           'types:' || coalesce(array_to_string(b.allowed_mime_types, ','), 'tous'))
    from storage.buckets b
)
select type_, objet, empreinte
  from (select * from fonctions
        union all select * from declencheurs
        union all select * from regles
        union all select * from tables
        union all select * from colonnes
        union all select * from droits_defaut
        union all select * from schemas
        union all select * from extensions
        union all select * from buckets) as tout
 order by type_ collate "C", objet collate "C";
