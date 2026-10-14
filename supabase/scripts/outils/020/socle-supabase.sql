-- Socle d'essai : ce que Supabase fournit avant la première migration, pour
-- rejouer supabase/migrations/001 à 020 sur une base locale (PGlite) dans
-- banc.mjs. JAMAIS en production.
--
-- Rôles de l'API (service_role passe outre la RLS, comme chez Supabase),
-- schémas auth, storage et extensions, auth.users et ses fonctions,
-- storage.buckets et storage.objects, droits par défaut de postgres dans
-- public tels que Supabase les pose (la 019 les referme). L'extension
-- moddatetime n'existe pas dans PGlite : une fonction de même nom et de même
-- effet la remplace ; banc.mjs l'écarte des comparaisons.

create role anon nologin noinherit;
create role authenticated nologin noinherit;
create role service_role nologin noinherit bypassrls;
create role supabase_admin nologin;
create role supabase_storage_admin nologin;
grant anon, authenticated, service_role to postgres;

create schema extensions;
-- Comme chez Supabase : les fonctions des extensions se trouvent sans préfixe.
alter role postgres set search_path = "$user", public, extensions;
set search_path = "$user", public, extensions;
create extension "uuid-ossp" schema extensions;
create extension pgcrypto schema extensions;
grant usage on schema extensions to anon, authenticated, service_role;

grant usage on schema public to anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on sequences to postgres, anon, authenticated, service_role;

-- moddatetime : met la colonne nommée à now() avant chaque mise à jour.
-- search_path fixé : en production, la vraie est une fonction d'extension, que les contrôles des migrations écartent.
create function public.moddatetime() returns trigger language plpgsql set search_path = '' as $f$
begin
  new := jsonb_populate_record(new, jsonb_build_object(tg_argv[0], now()));
  return new;
end;
$f$;

-- Fermée à tous : les contrôles des migrations écartent l'extension en production, pas cette fonction.
revoke all on function public.moddatetime() from public, anon, authenticated, service_role;

create schema auth;
grant usage on schema auth to anon, authenticated, service_role;
create table auth.users (
  id                  uuid primary key,
  email               text,
  raw_user_meta_data  jsonb default '{}'::jsonb,
  raw_app_meta_data   jsonb default '{}'::jsonb,
  created_at          timestamptz default now(),
  last_sign_in_at     timestamptz
);
create function auth.uid() returns uuid language sql stable as $f$
  select nullif(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub', '')::uuid
$f$;
create function auth.role() returns text language sql stable as $f$
  select nullif(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', '')
$f$;
create function auth.jwt() returns jsonb language sql stable as $f$
  select coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
$f$;
grant execute on all functions in schema auth to anon, authenticated, service_role;

create schema storage;
grant usage on schema storage to anon, authenticated, service_role;
create table storage.buckets (
  id                  text primary key,
  name                text not null,
  owner               uuid,
  public              boolean default false,
  file_size_limit     bigint,
  allowed_mime_types  text[],
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
create table storage.objects (
  id          uuid primary key default extensions.uuid_generate_v4(),
  bucket_id   text references storage.buckets(id),
  name        text,
  owner       uuid,
  metadata    jsonb,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table storage.objects enable row level security;
alter table storage.buckets enable row level security;
grant all on storage.objects, storage.buckets to anon, authenticated, service_role;
create function storage.foldername(name text) returns text[] language sql immutable as $f$
  select (string_to_array(name, '/'))[1:greatest(array_length(string_to_array(name, '/'), 1) - 1, 0)]
$f$;
grant execute on all functions in schema storage to anon, authenticated, service_role;
insert into storage.buckets (id, name, public) values ('analysis-photos', 'analysis-photos', false);
