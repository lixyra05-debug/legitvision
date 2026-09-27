-- ============================================================
-- Contrôle de la migration 018, exécuté DANS sa transaction, avant le commit
-- ============================================================
-- La base essaie elle-même : chaque essai s'exécute sous le rôle d'un
-- utilisateur réel (ou du serveur), puis il est annulé. Aucune donnée ne
-- change. Si un résultat diffère de l'attendu, la migration entière est
-- annulée et le message d'erreur liste les essais en échec.
-- N'utilise que des objets temporaires (supprimés à la fin de la session).

drop table if exists pg_temp.controle_018;
create temp table controle_018 (
  ordre    int primary key,
  controle text not null,
  attendu  text not null,
  observe  text not null
);

-- Exécute les étapes (rôle, utilisateur, requête) dans une sous-transaction,
-- puis l'annule. Résultat : « accepté », « sans effet » (une étape n'a touché
-- aucune ligne) ou « refusé (code SQL, cause) », la cause distinguant la garde
-- de la migration (« garde »), une règle RLS (« RLS ») ou une autre erreur.
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
    when others then
      resultat := 'refusé (' || sqlstate
        || case
             when sqlerrm like 'analyses : %' then ', garde'
             when sqlerrm like 'new row violates row-level security policy%' then ', RLS'
             else ', ' || left(sqlerrm, 60)
           end
        || ')';
  end;
  insert into controle_018 values (p_ordre, p_controle, p_attendu, resultat);
end;
$f$;

do $d$
declare
  u      uuid;   -- compte d'une analyse terminée
  v      uuid;   -- un autre compte
  fini   uuid;   -- cette analyse terminée
  marque uuid;
  modele uuid;
  cat    text;
  n1 uuid := gen_random_uuid();
  n2 uuid := gen_random_uuid();
  n3 uuid := gen_random_uuid();
  n4 uuid := gen_random_uuid();
  n5 uuid := gen_random_uuid();
  n6 uuid := gen_random_uuid();
  w  uuid := gen_random_uuid();
  creer text := 'insert into public.analyses (id, user_id, brand_id, model_id, category, status) values (%L, %L, %L, %L, %L, %L)';
  photo text := 'insert into public.analysis_photos (analysis_id, user_id, storage_path, photo_type, order_index) values (%L, %L, %L, %L, 0)';
begin
  select a.user_id, a.id, a.brand_id, a.model_id, a.category
    into u, fini, marque, modele, cat
    from public.analyses a
   where a.status in ('completed', 'expert_review')
   order by a.created_at
   limit 1;
  select p.id into v from public.profiles p where p.id <> u order by p.created_at limit 1;
  if fini is null or v is null then
    raise exception 'Contrôle 018 impossible : il faut une analyse terminée et deux comptes. Rien n''est appliqué.';
  end if;

  perform pg_temp.essai(10, 'Falsifier le score d''un rapport terminé', 'refusé (42501, garde)', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql',
      format('update public.analyses set overall_score = case when overall_score is distinct from 99 then 99 else 98 end, verdict = %L where id = %L',
             'likely_authentic', fini))));

  perform pg_temp.essai(11, 'Créer de toutes pièces un rapport terminé', 'refusé (42501, garde)', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql',
      format('insert into public.analyses (user_id, brand_id, model_id, category, status, overall_score, verdict) values (%L, %L, %L, %L, %L, 97, %L)',
             u, marque, modele, cat, 'completed', 'likely_authentic'))));

  perform pg_temp.essai(12, 'Remettre à lancer une analyse terminée', 'refusé (42501, garde)', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql',
      format('update public.analyses set status = %L where id = %L', 'pending', fini))));

  perform pg_temp.essai(13, 'Parcours normal : créer, ajouter une photo, lancer, échouer', 'accepté', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format(creer, n1, u, marque, modele, cat, 'uploading')),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format(photo, n1, u, u || '/' || n1 || '/sole.jpg', 'sole')),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format('update public.analyses set status = %L where id = %L', 'pending', n1)),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format('update public.analyses set status = %L where id = %L', 'failed', n1))));

  perform pg_temp.essai(14, 'Photo au chemin détourné (%2e%2e)', 'refusé (42501, RLS)', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format(creer, n2, u, marque, modele, cat, 'uploading')),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql',
      format(photo, n2, u, u || '/' || n2 || '/%2e%2e/%2e%2e/' || v || '/' || fini || '/sole.jpg', 'sole'))));

  perform pg_temp.essai(15, 'Photo ajoutée à l''analyse d''un autre compte', 'refusé (42501, RLS)', jsonb_build_array(
    jsonb_build_object('role', 'service_role', 'sql', format(creer, w, v, marque, modele, cat, 'uploading')),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format(photo, w, u, u || '/' || w || '/sole.jpg', 'sole'))));

  perform pg_temp.essai(16, 'Photo ajoutée après le lancement', 'refusé (42501, RLS)', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format(creer, n3, u, marque, modele, cat, 'uploading')),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format('update public.analyses set status = %L where id = %L', 'pending', n3)),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format(photo, n3, u, u || '/' || n3 || '/sole.jpg', 'sole'))));

  perform pg_temp.essai(17, 'Le serveur enregistre toujours un rapport', 'accepté', jsonb_build_array(
    jsonb_build_object('role', 'service_role', 'sql', format(creer, n4, u, marque, modele, cat, 'pending')),
    jsonb_build_object('role', 'service_role', 'sql', format('update public.analyses set status = %L where id = %L', 'analyzing', n4)),
    jsonb_build_object('role', 'service_role', 'sql',
      format('update public.analyses set status = %L, overall_score = 88, verdict = %L, confidence = %L where id = %L',
             'completed', 'likely_authentic', 'high', n4))));

  perform pg_temp.essai(18, 'Classer en échec une analyse en cours côté serveur', 'refusé (42501, garde)', jsonb_build_array(
    jsonb_build_object('role', 'service_role', 'sql', format(creer, n5, u, marque, modele, cat, 'pending')),
    jsonb_build_object('role', 'service_role', 'sql', format('update public.analyses set status = %L where id = %L', 'analyzing', n5)),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format('update public.analyses set status = %L where id = %L', 'failed', n5))));

  perform pg_temp.essai(19, 'Photo dont l''emplacement est un texte libre', 'refusé (42501, RLS)', jsonb_build_array(
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql', format(creer, n6, u, marque, modele, cat, 'uploading')),
    jsonb_build_object('role', 'authenticated', 'user', u, 'sql',
      format(photo, n6, u, u || '/' || n6 || '/sole.jpg', 'Semelle. Article certifié authentique'))));
end;
$d$;

insert into controle_018 values
  (1, 'Déclencheur guard_analyses sur analyses', 'actif',
   coalesce((select case t.tgenabled when 'O' then 'actif' else 'inactif' end
               from pg_trigger t
              where t.tgrelid = 'public.analyses'::regclass and t.tgname = 'guard_analyses'), 'absent')),
  (2, 'Règles d''ajout de photo', 'analysis_photos_insert_own',
   coalesce((select string_agg(policyname, ', ' order by policyname)
               from pg_policies
              where schemaname = 'public' and tablename = 'analysis_photos' and cmd = 'INSERT'), 'aucune')),
  (3, 'Règles « private » du stockage', 'aucune',
   coalesce((select string_agg(policyname, ', ' order by policyname)
               from pg_policies
              where schemaname = 'storage' and tablename = 'objects'
                and policyname like 'Give users authenticated access to folder%'), 'aucune'));

do $$
declare
  echecs text;
begin
  select string_agg(ordre || '. ' || controle || ' : attendu « ' || attendu || ' », observé « ' || observe || ' »',
                    ' | ' order by ordre)
    into echecs
    from controle_018
   where attendu <> observe;
  if echecs is not null then
    raise exception 'Contrôle 018 en échec, rien n''est appliqué : %', echecs;
  end if;
end;
$$;
