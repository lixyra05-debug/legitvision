-- ============================================================
-- 019 — État de la base : tout ce qui protège les données vit ici
-- ============================================================
-- Après cette migration, chaque fonction, déclencheur, règle RLS et droit du
-- schéma public est décrit par le dépôt (CLAUDE.md, règle 16). Relevé de la
-- production le 27/09, en lecture seule, avant d'écrire ce fichier.
--
--   0. Registre des migrations (private.migrations) : la base sait lesquelles
--      ont tourné ; une migration ne se rejoue pas après une plus récente.
--   1. Fonctions orphelines supprimées : add_credits_from_purchase,
--      allocate_monthly_credits, handle_stripe_subscription_updated. Créées à
--      la main ; appelées seulement par 5 + 5 sondes de vérification sans
--      effet le 26/09 (historique complet des requêtes depuis le 18/03, aucun
--      appel du serveur) ; citées par aucun objet ni aucune branche du code.
--   2. Fonctions conservées : droits stricts (un rôle n'exécute que ce dont il
--      a besoin) ; corps versionné ici pour celles qui ne l'étaient pas.
--   3. current_user_role() quitte le schéma exposé par l'API (public) pour
--      private : les règles l'utilisent, personne ne l'appelle.
--   4. Règles RLS réécrites, une par table et par action, réservées au rôle
--      qui en a besoin (anon ou authenticated), avec (select auth.uid()) :
--      mêmes accès qu'avant, sans doublon.
--   5. Droits de table au plus juste : anon ne lit que les marques et modèles
--      actifs ; authenticated n'a que les droits que ses règles utilisent ;
--      personne d'autre que le serveur n'a TRUNCATE.
--   6. Droits par défaut : une table ou une fonction que postgres crée plus
--      tard n'est ouverte qu'au serveur tant qu'une migration ne décide pas
--      autre chose. Hors de portée de postgres : ce que supabase_admin crée
--      dans public (une extension activée depuis le tableau de bord) garde les
--      droits par défaut de Supabase ; activer les extensions dans le schéma
--      extensions.
--   7. Index des trois clés étrangères qui n'en avaient pas.
--   8. Bucket des photos : JPEG, PNG ou WebP de 10 Mo au plus, les limites que
--      l'application applique déjà (PhotoUploader, lib/ai/analyze.ts). Avant,
--      le bucket acceptait tout fichier, de toute taille.
--
-- Écart assumé : l'extension moddatetime reste dans public (elle appartient à
-- supabase_admin ; sa seule fonction est un déclencheur, sans effet par RPC).
-- Rejouable tant qu'aucune migration plus récente n'est enregistrée.

begin;
set local lock_timeout = '5s';

-- ── 0. Registre des migrations ──────────────────────────────
-- Schéma private : non exposé par l'API (seuls public et graphql_public le sont).

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

create table if not exists private.migrations (
  numero       integer primary key,
  nom          text not null,
  appliquee_le timestamptz not null default now(),
  note         text
);
revoke all on private.migrations from public, anon, authenticated;
alter table private.migrations enable row level security;  -- aucune règle : serveur et postgres seulement

do $$
begin
  if exists (select 1 from private.migrations where numero > 19) then
    raise exception 'La 019 ne se rejoue pas après une migration plus récente (dernière : %).',
      (select max(numero) from private.migrations);
  end if;
end;
$$;

insert into private.migrations (numero, nom, note)
select n, lpad(n::text, 3, '0'), 'appliquée avant le 27/09/2026, constatée par la 019'
  from generate_series(1, 18) as n
on conflict (numero) do nothing;

-- ── 1. Fonctions orphelines ─────────────────────────────────

drop function if exists public.add_credits_from_purchase(uuid, integer, text, text);
drop function if exists public.allocate_monthly_credits(uuid, text);
drop function if exists public.handle_stripe_subscription_updated(uuid, text, text);

-- ── 2. Fonctions conservées ─────────────────────────────────

-- Débit d'un crédit, appelé par /api/analyze avec la clé serveur. Corps
-- versionné par la 017 (identique en production) : seuls ses droits sont posés
-- ici, pour qu'aucun rejeu ne remette un ancien corps.
revoke all on function public.decrement_credits_atomic(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.decrement_credits_atomic(uuid, uuid, text) to service_role;

-- Profil créé à l'inscription (déclencheur on_auth_user_created, 001 et 016).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  -- credits_remaining prend sa valeur par défaut (0).
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

-- Garde des colonnes privilégiées des profils (créée à la main le 21/06,
-- versionnée ici) : hors service_role, ni rôle, ni crédits, ni formule, ni
-- identifiants Stripe ne changent. Correction à la main :
--   begin; set local role service_role; update public.profiles …; commit;
create or replace function public.lock_privileged_profile_cols()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     or new.credits_remaining is distinct from old.credits_remaining
     or new.subscription_plan is distinct from old.subscription_plan
     or new.stripe_customer_id is distinct from old.stripe_customer_id
     or new.stripe_subscription_id is distinct from old.stripe_subscription_id
  then
    raise exception 'forbidden column update';
  end if;
  return new;
end;
$$;
revoke all on function public.lock_privileged_profile_cols() from public, anon, authenticated;

drop trigger if exists guard_profiles on public.profiles;
create trigger guard_profiles
  before update on public.profiles
  for each row
  when (current_setting('role', true) is distinct from 'service_role')
  execute function public.lock_privileged_profile_cols();

-- ── 3. Rôle de l'utilisateur, hors du schéma exposé ─────────

create or replace function private.current_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles p where p.id = (select auth.uid())
$$;
revoke all on function private.current_user_role() from public, anon;
grant execute on function private.current_user_role() to authenticated, service_role;

-- ── 4. Règles RLS ───────────────────────────────────────────
-- Toutes les règles de ces tables sont remplacées. Mêmes accès qu'avant :
-- chacun ses données ; l'admin (profiles.role = 'admin', protégé par
-- guard_profiles) voit et gère tout ; l'expert voit les analyses en revue.
-- L'écriture des résultats reste bornée par guard_analyses (018).

do $$
declare
  r record;
begin
  for r in
    select tablename, policyname from pg_policies
     where schemaname = 'public'
       and tablename in ('analyses', 'analysis_photos', 'brands', 'models', 'credits_transactions', 'profiles', 'stripe_events')
  loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end;
$$;

drop function if exists public.current_user_role();

-- analyses
create policy analyses_select on public.analyses
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select private.current_user_role()) = 'admin'
    or ((select private.current_user_role()) = 'expert' and status = 'expert_review')
  );
create policy analyses_insert on public.analyses
  for insert to authenticated
  with check (user_id = (select auth.uid()) or (select private.current_user_role()) = 'admin');
create policy analyses_update on public.analyses
  for update to authenticated
  using (
    user_id = (select auth.uid())
    or (select private.current_user_role()) = 'admin'
    or ((select private.current_user_role()) = 'expert' and status = 'expert_review')
  )
  with check (
    user_id = (select auth.uid())
    or (select private.current_user_role()) = 'admin'
    or ((select private.current_user_role()) = 'expert' and status = 'expert_review')
  );
create policy analyses_delete on public.analyses
  for delete to authenticated
  using ((select private.current_user_role()) = 'admin');

-- analysis_photos (règle d'ajout de 018, plus l'admin)
create policy analysis_photos_select on public.analysis_photos
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select private.current_user_role()) = 'admin'
    or (
      (select private.current_user_role()) = 'expert'
      and analysis_id in (select a.id from public.analyses a where a.status = 'expert_review')
    )
  );
create policy analysis_photos_insert on public.analysis_photos
  for insert to authenticated
  with check (
    (
      user_id = (select auth.uid())
      and public.is_own_photo_path(storage_path, (select auth.uid()), analysis_id)
      and length(storage_path) <= 255
      and photo_type ~ '^[a-z0-9_]{1,64}$'
      and exists (
        select 1
          from public.analyses a
         where a.id = analysis_photos.analysis_id
           and a.user_id = (select auth.uid())
           and a.status = 'uploading'
      )
    )
    or (select private.current_user_role()) = 'admin'
  );
create policy analysis_photos_update on public.analysis_photos
  for update to authenticated
  using ((select private.current_user_role()) = 'admin')
  with check ((select private.current_user_role()) = 'admin');
create policy analysis_photos_delete on public.analysis_photos
  for delete to authenticated
  using ((select private.current_user_role()) = 'admin');

-- brands et models : catalogue public, géré par l'admin
create policy brands_select_anon on public.brands
  for select to anon
  using (is_active = true);
create policy brands_select on public.brands
  for select to authenticated
  using (is_active = true or (select private.current_user_role()) = 'admin');
create policy brands_insert on public.brands
  for insert to authenticated
  with check ((select private.current_user_role()) = 'admin');
create policy brands_update on public.brands
  for update to authenticated
  using ((select private.current_user_role()) = 'admin')
  with check ((select private.current_user_role()) = 'admin');
create policy brands_delete on public.brands
  for delete to authenticated
  using ((select private.current_user_role()) = 'admin');

create policy models_select_anon on public.models
  for select to anon
  using (is_active = true);
create policy models_select on public.models
  for select to authenticated
  using (is_active = true or (select private.current_user_role()) = 'admin');
create policy models_insert on public.models
  for insert to authenticated
  with check ((select private.current_user_role()) = 'admin');
create policy models_update on public.models
  for update to authenticated
  using ((select private.current_user_role()) = 'admin')
  with check ((select private.current_user_role()) = 'admin');
create policy models_delete on public.models
  for delete to authenticated
  using ((select private.current_user_role()) = 'admin');

-- credits_transactions : écrit par le serveur seul
create policy credits_transactions_select on public.credits_transactions
  for select to authenticated
  using (user_id = (select auth.uid()) or (select private.current_user_role()) = 'admin');

-- profiles : lu par son propriétaire ; écrit par le serveur seul (aucun
-- écran ne modifie un profil avec la clé de l'utilisateur)
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select private.current_user_role()) = 'admin');

-- stripe_events : aucune règle, le serveur seul y accède (service_role).

-- ── 5. Droits de table ──────────────────────────────────────

revoke all on public.analyses, public.analysis_photos, public.brands, public.models,
              public.credits_transactions, public.profiles, public.stripe_events
  from anon, authenticated;
grant select on public.brands, public.models to anon;
grant select, insert, update, delete on public.analyses, public.analysis_photos,
                                         public.brands, public.models to authenticated;
grant select on public.credits_transactions, public.profiles to authenticated;
grant all on public.analyses, public.analysis_photos, public.brands, public.models,
             public.credits_transactions, public.profiles, public.stripe_events to service_role;

-- ── 6. Droits par défaut ────────────────────────────────────
-- Ce que postgres crée ensuite dans public n'est ouvert qu'au serveur ; une
-- migration accorde explicitement le reste. (Les objets créés par
-- supabase_admin gardent les droits par défaut de Supabase : voir l'en-tête.)

alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on functions from anon, authenticated;
alter default privileges for role postgres revoke execute on functions from public;

-- ── 7. Index ────────────────────────────────────────────────

create index if not exists idx_analyses_model_id on public.analyses(model_id);
create index if not exists idx_analyses_expert_id on public.analyses(expert_id);
create index if not exists idx_credits_tx_analysis_id on public.credits_transactions(analysis_id);

-- ── 8. Bucket des photos ────────────────────────────────────
-- Le HEIC est converti en JPEG avant l'envoi : aucun envoi légitime n'est refusé.

update storage.buckets
   set file_size_limit = 10485760,
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
 where id = 'analysis-photos';

-- ── 9. Enregistrement ───────────────────────────────────────

insert into private.migrations (numero, nom) values (19, '019_etat_de_la_base')
on conflict (numero) do update set nom = excluded.nom, appliquee_le = now();

commit;
