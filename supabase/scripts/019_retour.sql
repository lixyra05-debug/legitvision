-- ============================================================
-- Retour arrière de la migration 019 — à n'exécuter QUE si un parcours de
-- l'application est cassé après la 019.
-- ============================================================
-- Remet les règles RLS, les droits de table et les droits par défaut tels
-- qu'ils étaient en production le 27/09 après la 018 (relevé en lecture
-- seule). Garde ce qui ne peut rien casser : fonctions orphelines supprimées,
-- search_path de lock_privileged_profile_cols, droits des fonctions de crédit,
-- index, registre des migrations (la 019 en est retirée). Le bucket des photos
-- retrouve ses réglages d'avant (ni taille maximale, ni type imposé). Refuse de s'exécuter
-- après une migration plus récente. Un seul tableau de résultat à la fin.

begin;
set local lock_timeout = '5s';

do $$
begin
  if exists (select 1 from private.migrations where numero > 19) then
    raise exception 'Retour de la 019 impossible après une migration plus récente (dernière : %).',
      (select max(numero) from private.migrations);
  end if;
end;
$$;

-- current_user_role() revient dans public (les anciennes règles l'utilisent).
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid();
$$;
grant execute on function public.current_user_role() to public, anon, authenticated, service_role;

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

drop function if exists private.current_user_role();

create policy "Admins can do anything on analyses" on public.analyses for all using (public.current_user_role() = 'admin');
create policy "Experts can update analyses in expert_review" on public.analyses for update
  using (public.current_user_role() = 'expert' and status = 'expert_review');
create policy "Experts can view analyses in expert_review" on public.analyses for select
  using (public.current_user_role() = 'expert' and status = 'expert_review');
create policy "Users can view their own analyses" on public.analyses for select using (auth.uid() = user_id);
create policy analyses_update_own on public.analyses for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy authenticated_insert_analyses on public.analyses for insert with check (auth.uid() = user_id);
create policy authenticated_select_analyses on public.analyses for select using (auth.uid() = user_id);

create policy "Admins can do anything on photos" on public.analysis_photos for all using (public.current_user_role() = 'admin');
create policy "Experts can view photos of analyses in expert_review" on public.analysis_photos for select
  using (public.current_user_role() = 'expert'
         and analysis_id in (select analyses.id from public.analyses where analyses.status = 'expert_review'));
create policy "Users can view their own photos" on public.analysis_photos for select using (auth.uid() = user_id);
create policy authenticated_select_photos on public.analysis_photos for select using (auth.uid() = user_id);
create policy analysis_photos_insert_own on public.analysis_photos
  for insert
  to authenticated
  with check (
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
  );

create policy "Admins can manage brands" on public.brands for all using (public.current_user_role() = 'admin');
create policy "Anyone can view active brands" on public.brands for select using (is_active = true);
create policy "Admins can manage models" on public.models for all using (public.current_user_role() = 'admin');
create policy "Anyone can view active models" on public.models for select using (is_active = true);

create policy "Admins can view all transactions" on public.credits_transactions for select
  using (public.current_user_role() = 'admin');
create policy "Users can view their own transactions" on public.credits_transactions for select using (auth.uid() = user_id);
create policy authenticated_select_credits on public.credits_transactions for select using (auth.uid() = user_id);

create policy "Admins can view all profiles" on public.profiles for select using (public.current_user_role() = 'admin');
create policy "Users can update their own profile" on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);

grant all on public.analyses, public.analysis_photos, public.brands, public.models,
             public.credits_transactions, public.profiles, public.stripe_events
  to anon, authenticated, service_role;

alter default privileges for role postgres in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges for role postgres in schema public grant execute on functions to anon, authenticated, service_role;
alter default privileges for role postgres grant execute on functions to public;

update storage.buckets set file_size_limit = null, allowed_mime_types = null where id = 'analysis-photos';

delete from private.migrations where numero = 19;

commit;

select 'règles du schéma public' as controle, count(*)::text as observe, '22' as attendu
  from pg_policies where schemaname = 'public'
union all
select 'current_user_role dans public',
       (select count(*)::text from pg_proc where proname = 'current_user_role' and pronamespace = 'public'::regnamespace), '1'
union all
select 'anon lit les analyses (droit de table)',
       has_table_privilege('anon', 'public.analyses', 'SELECT')::text, 'true'
union all
select 'migration 019 enregistrée',
       exists (select 1 from private.migrations where numero = 19)::text, 'false';
