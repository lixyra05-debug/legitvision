-- ============================================================
-- 018 — Rapports et photos : le navigateur n'écrit que ce qu'il doit
-- ============================================================
-- Un rapport (score, verdict, observations, réponse du modèle) n'est écrit que
-- par le serveur, avec la clé service_role (route /api/analyze). Les règles
-- « analyses_update_own » et « authenticated_insert_analyses » laissaient un
-- utilisateur écrire n'importe quelle colonne de ses propres analyses, donc
-- fabriquer un rapport et le montrer à un acheteur. La règle d'ajout de photo
-- ne vérifiait que user_id : ni l'analyse, ni le chemin de stockage.
--
-- Désormais, pour tout rôle autre que service_role :
--   - création d'une analyse : vide, statut « uploading » ou « pending » ;
--   - modification : le statut seul, avant le lancement
--     (uploading → pending, uploading → failed, pending → failed) ;
--   - ajout d'une photo : pour une de ses analyses encore « uploading », dans
--     son propre dossier ({user_id}/{analysis_id}/{nom}, même règle que
--     lib/photo-path.ts), avec un emplacement au format des protocoles.
-- Même règle d'appelant que guard_profiles : elle vaut aussi pour postgres
-- dans l'éditeur SQL. Pour corriger une analyse à la main :
--   begin; set local role service_role; update public.analyses …; commit;
--
-- Rejouable : chaque objet est remplacé.

begin;
set local lock_timeout = '5s';

-- ── 1. Rapports ─────────────────────────────────────────────

create or replace function public.lock_analysis_results()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  -- Seules colonnes que le navigateur renseigne à la création. Toute autre
  -- colonne (résultat, revue, variante…) reste vide jusqu'à ce que le serveur
  -- l'écrive. Une colonne ajoutée plus tard et écrite par le navigateur, ou
  -- dotée d'une valeur par défaut non nulle, doit être déclarée ici : sinon
  -- toute création par le navigateur est refusée.
  colonnes_du_navigateur constant text[] := array[
    'id', 'user_id', 'brand_id', 'model_id', 'category', 'status', 'created_at', 'updated_at'
  ];
  interdites text;
begin
  if tg_op = 'INSERT' then
    if new.status not in ('uploading', 'pending') then
      raise exception 'analyses : statut initial réservé au serveur (%)', new.status
        using errcode = '42501';
    end if;
    select string_agg(key, ', ' order by key) into interdites
      from jsonb_each(to_jsonb(new))
     where value <> 'null'::jsonb
       and key <> all (colonnes_du_navigateur);
    if interdites is not null then
      raise exception 'analyses : colonnes réservées au serveur (%)', interdites
        using errcode = '42501';
    end if;
    new.created_at := now();
    new.updated_at := now();
    return new;
  end if;

  -- Comparaison sur le texte : « 85 » et « 85.000 » y diffèrent.
  if (to_jsonb(new) - 'status' - 'updated_at')::text is distinct from (to_jsonb(old) - 'status' - 'updated_at')::text then
    raise exception 'analyses : seul le statut peut être modifié' using errcode = '42501';
  end if;
  -- Chaque écriture doit faire avancer le statut : même réécrit à l'identique,
  -- un statut rafraîchirait updated_at, dont dépend la reprise des analyses
  -- bloquées (lib/analysis-stale.ts).
  if not (
       (old.status = 'uploading' and new.status in ('pending', 'failed'))
    or (old.status = 'pending' and new.status = 'failed')
  ) then
    raise exception 'analyses : passage de « % » à « % » réservé au serveur', old.status, new.status
      using errcode = '42501';
  end if;
  return new;
end;
$$;

revoke all on function public.lock_analysis_results() from public, anon, authenticated;

drop trigger if exists guard_analyses on public.analyses;
create trigger guard_analyses
  before insert or update on public.analyses
  for each row
  when (current_setting('role', true) is distinct from 'service_role')
  execute function public.lock_analysis_results();

-- ── 2. Photos ───────────────────────────────────────────────

-- Même règle que lib/photo-path.ts (isOwnPhotoPath) : un seul segment de nom,
-- sans séparateur, « % » (%2e%2e vaut « .. »), « ? », « # » ni caractère de
-- contrôle, et ni « . » ni « .. ».
create or replace function public.is_own_photo_path(p_path text, p_user_id uuid, p_analysis_id uuid)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(
           starts_with(p_path, p_user_id::text || '/' || p_analysis_id::text || '/')
           and nom <> ''
           and nom not in ('.', '..')
           and nom !~ '[/\\%?#[:cntrl:]]',
           false)
    from (select substr(p_path, length(p_user_id::text || '/' || p_analysis_id::text || '/') + 1) as nom) as s
$$;

revoke all on function public.is_own_photo_path(text, uuid, uuid) from public, anon;
grant execute on function public.is_own_photo_path(text, uuid, uuid) to authenticated, service_role;

drop policy if exists authenticated_insert_photos on public.analysis_photos;
drop policy if exists "Users can insert their own photos" on public.analysis_photos;  -- nom de la 001
drop policy if exists analysis_photos_insert_own on public.analysis_photos;
create policy analysis_photos_insert_own on public.analysis_photos
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and public.is_own_photo_path(storage_path, (select auth.uid()), analysis_id)
    and length(storage_path) <= 255
    -- Emplacement du protocole de la ligne de marque (« sole », « tag_inside »…) :
    -- son libellé part dans le prompt. Les 57 emplacements de la base ont ce
    -- format (relevé du 27/09) ; la route vérifie en plus qu'il est au protocole.
    and photo_type ~ '^[a-z0-9_]{1,64}$'
    and exists (
      select 1
        from public.analyses a
       where a.id = analysis_photos.analysis_id
         and a.user_id = (select auth.uid())
         and a.status = 'uploading'
    )
  );

-- Règles créées depuis le tableau de bord : tout utilisateur connecté pouvait
-- lire et déposer des fichiers sous analysis-photos/private/ (dossier vide le
-- 27/09). La migration 017 visait « qvgqdu_0 » et « qvgqdu_1 », noms incomplets.
drop policy if exists "Give users authenticated access to folder qvgqdu_0" on storage.objects;
drop policy if exists "Give users authenticated access to folder qvgqdu_1" on storage.objects;

commit;
