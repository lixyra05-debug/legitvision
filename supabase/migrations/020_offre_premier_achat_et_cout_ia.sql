-- ============================================================
-- 020 — Offre de premier achat et coût IA : registres fermés, fonctions atomiques
-- ============================================================
-- Décisions d'Hector du 30/09, pour la bascule du 1er novembre vers le compte
-- Stripe LegitVision. Exécutée par Hector vers le 15/10, AVANT la bascule. La
-- migration des abonnements, appelée « la 020 » jusqu'au 30/09, devient la 021.
--
--   0. Registre et garde : la 020 suppose la 019 et ne se rejoue pas après une
--      migration plus récente.
--   1. public.analysis_costs : le coût de chaque appel au modèle (jetons, tarif
--      catalogue, issue). Ni dans ai_raw_response ni dans une colonne
--      d'analyses : l'auteur d'une analyse lit ces colonnes par l'API.
--   2. public.first_purchase_offers : registre des analyses offertes au premier
--      achat, automatiques ou accordées à la main, une par compte ET une par
--      carte (empreinte Stripe ; nulle pour une offre accordée à la main sans
--      empreinte connue). Une ligne reste après le remboursement du premier
--      achat (compte et carte restent « consommés ») et après la suppression
--      du compte (user_id passe à null : la carte reste consommée).
--   3. Un paiement ne se crédite qu'une fois : index unique sur les lignes
--      « purchase » de credits_transactions, par stripe_payment_id.
--   4. credit_single_purchase : crédite un achat à l'unité et décide l'analyse
--      offerte, en une transaction (serveur seul, appelée par le webhook).
--   5. grant_first_purchase_offer : accorde à la main l'analyse offerte d'un
--      premier achat que le paiement n'a pas pu décider (serveur seul ; Hector
--      l'appelle sous service_role), aux mêmes règles, jamais par des
--      écritures directes.
--   6. withdraw_first_purchase_offer : retire l'analyse offerte non utilisée
--      d'un premier achat remboursé (serveur seul ; Hector l'appelle sous
--      service_role, à la main jusqu'à la 021).
--   7. Enregistrement dans private.migrations.
--   8. Contrôle dans la transaction : structure, droits, puis essais réels,
--      chacun annulé. Un seul écart annule toute la migration.
--
-- Aucune des trois fonctions ne contourne guard_profiles (019) : elles
-- s'exécutent avec les droits de l'appelant, et le déclencheur refuse toute
-- écriture des crédits hors du rôle service_role.
-- Rejouable tant qu'aucune migration plus récente n'est enregistrée : chaque
-- objet est créé s'il manque ou remplacé à l'identique ; aucune donnée n'est
-- écrite hors du registre. Retour arrière : supabase/scripts/020_retour.sql.
-- Contrôle après exécution, en lecture seule : supabase/checks/020_controle.sql.

begin;
set local lock_timeout = '5s';

-- ── 0. Registre et garde ────────────────────────────────────

do $$
begin
  if to_regclass('private.migrations') is null then
    raise exception 'La 020 suppose la 019 (registre private.migrations absent) : rien n''est appliqué.';
  end if;
end;
$$;

do $$
begin
  if not exists (select 1 from private.migrations where numero = 19) then
    raise exception 'La 020 suppose la 019, absente du registre : rien n''est appliqué.';
  end if;
  if exists (select 1 from private.migrations where numero > 20) then
    raise exception 'La 020 ne se rejoue pas après une migration plus récente (dernière : %).',
      (select max(numero) from private.migrations);
  end if;
end;
$$;

-- ── 1. Coût IA de chaque analyse ────────────────────────────
-- Une ligne par appel au modèle, écrite par /api/analyze (clé service_role).
-- measured = false : appel parti sans réponse lisible (échéance, connexion
-- perdue, corps coupé), consommation inconnue (jetons et coût à null).
-- cost_usd : tarif catalogue hors taxes, relevé le
-- price_list_date ; null si le modèle n'a pas de tarif relevé ou si l'appel
-- n'est pas mesuré. Aucune règle RLS, aucun droit pour anon ni authenticated ;
-- le serveur lit et ajoute, il ne modifie ni n'efface.

create table if not exists public.analysis_costs (
  id                     uuid primary key default extensions.uuid_generate_v4(),
  analysis_id            uuid references public.analyses(id) on delete set null,
  model                  text not null,
  request_id             text,
  measured               boolean not null,
  input_tokens           integer check (input_tokens >= 0),
  output_tokens          integer check (output_tokens >= 0),
  thinking_tokens        integer check (thinking_tokens >= 0),
  cache_write_5m_tokens  integer check (cache_write_5m_tokens >= 0),
  cache_write_1h_tokens  integer check (cache_write_1h_tokens >= 0),
  cache_read_tokens      integer check (cache_read_tokens >= 0),
  inference_geo          text,
  cost_usd               numeric(12, 6) check (cost_usd >= 0),
  price_list_date        date,
  stop_reason            text,
  outcome                text not null check (outcome in ('report', 'insufficient', 'failed')),
  failure_code           text,
  created_at             timestamptz not null default now()
);

create index if not exists idx_analysis_costs_created_at on public.analysis_costs (created_at);
create index if not exists idx_analysis_costs_analysis_id on public.analysis_costs (analysis_id);

alter table public.analysis_costs enable row level security;  -- aucune règle
revoke all on public.analysis_costs from public, anon, authenticated, service_role;
grant select, insert on public.analysis_costs to service_role;

comment on table public.analysis_costs is
  'Coût de chaque appel au modèle (migration 020). Fermée aux utilisateurs ; le serveur lit et ajoute.';
comment on column public.analysis_costs.measured is
  'false : appel parti sans réponse lisible (échéance, connexion perdue, corps coupé), consommation inconnue (jetons et coût à null).';
comment on column public.analysis_costs.cost_usd is
  'Tarif catalogue hors taxes, relevé le price_list_date ; null si modèle sans tarif relevé ou appel non mesuré.';

-- ── 2. Registre des offres de premier achat ─────────────────
-- Une ligne par offre ACCORDÉE, écrite dans la transaction qui la crédite :
-- par credit_single_purchase (offre automatique, au paiement) ou par
-- grant_first_purchase_offer (offre accordée à la main). Une par compte
-- (user_id), une par carte et par mode (livemode, card_fingerprint), une par
-- paiement. Empreinte nulle : offre accordée à la main sans empreinte connue ;
-- elle ne consomme aucune carte (les nuls ne se gênent pas dans l'unicité).
-- L'empreinte d'Apple Pay ou de Google Pay est celle du numéro de l'appareil :
-- la même carte peut revenir sous une autre empreinte. L'index « carte
-- probable » (marque, 4 derniers chiffres, pays) sert à le signaler, jamais à
-- refuser. Aucune règle RLS, aucun droit pour anon ni authenticated ; le
-- serveur lit, ajoute et marque un retrait, il n'efface rien.

create table if not exists public.first_purchase_offers (
  id                uuid primary key default extensions.uuid_generate_v4(),
  user_id           uuid unique references auth.users(id) on delete set null,
  payment_intent    text not null unique,
  livemode          boolean not null,
  card_fingerprint  text,
  wallet_type       text,
  card_brand        text,
  card_last4        text check (card_last4 ~ '^[0-9]{4}$'),
  card_country      text,
  granted_at        timestamptz not null default now(),
  withdrawn_at      timestamptz,
  unique (livemode, card_fingerprint)
);

create index if not exists idx_first_purchase_offers_probable_card
  on public.first_purchase_offers (livemode, card_brand, card_last4, card_country);

alter table public.first_purchase_offers enable row level security;  -- aucune règle
revoke all on public.first_purchase_offers from public, anon, authenticated, service_role;
grant select, insert, update on public.first_purchase_offers to service_role;

comment on table public.first_purchase_offers is
  'Offres de premier achat accordées (migration 020) : une par compte, une par carte. Fermée aux utilisateurs.';
comment on column public.first_purchase_offers.card_fingerprint is
  'Empreinte Stripe de la carte (Apple Pay, Google Pay : celle du numéro de l''appareil) ; nulle : offre accordée à la main sans empreinte connue.';
comment on column public.first_purchase_offers.withdrawn_at is
  'Offre retirée après remboursement du premier achat ; la ligne reste : compte et carte consommés.';

-- ── 3. Un paiement ne se crédite qu'une fois ────────────────
-- Les deux lignes « purchase » de la production portent chacune un pi_
-- distinct (relevé du 30/09). Un doublon arrête la migration avant l'index.

do $$
declare
  doublons text;
begin
  select string_agg(left(d.stripe_payment_id, 12) || '… (' || d.n || ' lignes)', ', ')
    into doublons
    from (select t.stripe_payment_id, count(*) as n
            from public.credits_transactions t
           where t.type = 'purchase' and t.stripe_payment_id is not null
           group by t.stripe_payment_id
          having count(*) > 1) as d;
  if doublons is not null then
    raise exception 'La 020 trouve des paiements crédités plusieurs fois, à rapprocher d''abord : %. Rien n''est appliqué.', doublons;
  end if;
end;
$$;

create unique index if not exists credits_transactions_purchase_payment_key
  on public.credits_transactions (stripe_payment_id)
  where type = 'purchase' and stripe_payment_id is not null;

-- ── 4. Achat à l'unité et analyse offerte ───────────────────
-- Appelée par le webhook (clé service_role) pour un achat à l'unité payé,
-- après lecture de la carte chez Stripe. p_offer_allowed : le webhook l'a
-- vérifié (session marquée pour l'offre, compte Stripe actuel, paiement
-- réussi). Une transaction :
--   1. paiement déjà crédité : already_credited, rien d'écrit ;
--   2. profil verrouillé (absent : profile_missing, rien d'écrit) ;
--   3. offre, dans cet ordre : a. déjà un achat sur ce compte, ancien compte
--      Stripe compris (prior_purchase) ; b. session sans offre ou empreinte
--      absente, décision à la main, par grant_first_purchase_offer
--      (not_allowed) ; c. carte probable, offre accordée à la main sans
--      empreinte comprise (alerte seulement ; deux achats simultanés de la
--      même carte probable passent l'un après l'autre, pour que le second voie
--      le premier), puis
--      inscription au registre : refusée si le compte (account_already) ou la
--      carte (card_already) a déjà servi ;
--   4. +1 pour l'achat, +1 si l'offre est accordée ; une ligne de journal
--      chacun, avec le même paiement ;
--   5. même paiement crédité entre-temps par une autre transaction : toutes
--      les écritures de l'appel sont annulées (already_credited). Aucune autre
--      erreur n'est rattrapée : le webhook répond 500 et Stripe renvoie.

create or replace function public.credit_single_purchase(
  p_user_id               uuid,
  p_payment_intent        text,
  p_livemode              boolean,
  p_offer_allowed         boolean,
  p_card_fingerprint      text,
  p_wallet_type           text,
  p_card_brand            text,
  p_card_last4            text,
  p_card_country          text,
  p_purchase_description  text,
  p_offer_description     text
)
returns table (
  outcome              text,
  credits_added        integer,
  balance              integer,
  offer_granted        boolean,
  offer_refusal        text,
  probable_card_match  boolean
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_issue      text    := 'already_credited';
  v_ajout      integer := 0;
  v_solde      integer;           -- solde avant l'achat, lu sous verrou
  v_final      integer;
  v_accordee   boolean := false;
  v_refus      text;
  v_alerte     boolean := false;
  v_offre      uuid;
  v_contrainte text;
begin
  if p_user_id is null or coalesce(p_payment_intent, '') = '' or p_livemode is null then
    raise exception 'credit_single_purchase : p_user_id, p_payment_intent et p_livemode sont obligatoires'
      using errcode = '22004';
  end if;

  -- 1. Paiement déjà crédité (renvoi de Stripe, autre événement du même paiement).
  if exists (select 1 from public.credits_transactions t
              where t.type = 'purchase' and t.stripe_payment_id = p_payment_intent) then
    select p.credits_remaining into v_final from public.profiles p where p.id = p_user_id;
    return query select v_issue, v_ajout, v_final, v_accordee, v_refus, v_alerte;
    return;
  end if;

  <<ecritures>>
  begin
    -- 2. Verrou du profil : deux paiements du même compte passent l'un après
    --    l'autre, et le second voit l'achat du premier.
    select p.credits_remaining into v_solde
      from public.profiles p
     where p.id = p_user_id
       for update;
    if not found then
      v_issue := 'profile_missing';
      exit ecritures;
    end if;
    -- Même paiement crédité pendant l'attente du verrou : rien d'écrit.
    if exists (select 1 from public.credits_transactions t
                where t.type = 'purchase' and t.stripe_payment_id = p_payment_intent) then
      v_final := v_solde;
      exit ecritures;
    end if;

    -- 3. L'offre.
    if exists (select 1 from public.credits_transactions t
                where t.user_id = p_user_id and t.type = 'purchase') then
      v_refus := 'prior_purchase';
    elsif p_offer_allowed is not true or coalesce(p_card_fingerprint, '') = '' then
      v_refus := 'not_allowed';
    else
      -- Les achats d'une même carte probable (mode, marque, 4 derniers
      -- chiffres, pays) passent l'un après l'autre : verrou consultatif, levé
      -- à la fin de la transaction. Sans lui, deux achats simultanés de la
      -- même carte par deux portefeuilles (deux empreintes, deux comptes) ne
      -- se verraient pas dans le registre, et l'alerte se perdrait.
      perform pg_advisory_xact_lock(
        hashtextextended(concat_ws('|', p_livemode, p_card_brand, p_card_last4, p_card_country), 0));
      v_alerte := exists (
        select 1
          from public.first_purchase_offers o
         where o.livemode = p_livemode
           and o.card_brand is not distinct from p_card_brand
           and o.card_last4 is not distinct from p_card_last4
           and o.card_country is not distinct from p_card_country
           and o.card_fingerprint is distinct from p_card_fingerprint);
      insert into public.first_purchase_offers
        (user_id, payment_intent, livemode, card_fingerprint, wallet_type,
         card_brand, card_last4, card_country)
      values
        (p_user_id, p_payment_intent, p_livemode, p_card_fingerprint, p_wallet_type,
         p_card_brand, p_card_last4, p_card_country)
      on conflict do nothing
      returning id into v_offre;
      if v_offre is not null then
        v_accordee := true;
      elsif exists (select 1 from public.first_purchase_offers o where o.user_id = p_user_id) then
        v_refus := 'account_already';
      else
        v_refus := 'card_already';
      end if;
    end if;

    -- 4. Crédits et journal.
    v_ajout := case when v_accordee then 2 else 1 end;
    update public.profiles p
       set credits_remaining = p.credits_remaining + v_ajout
     where p.id = p_user_id
    returning p.credits_remaining into v_final;
    insert into public.credits_transactions (user_id, type, amount, balance_after, description, stripe_payment_id)
    values (p_user_id, 'purchase', 1, v_solde + 1, p_purchase_description, p_payment_intent);
    if v_accordee then
      insert into public.credits_transactions (user_id, type, amount, balance_after, description, stripe_payment_id)
      values (p_user_id, 'bonus', 1, v_final, p_offer_description, p_payment_intent);
    end if;
    v_issue := 'credited';
  exception
    when unique_violation then
      -- 5. Seul l'index des paiements crédités est attendu ici.
      get stacked diagnostics v_contrainte = constraint_name;
      if v_contrainte is distinct from 'credits_transactions_purchase_payment_key' then
        raise;
      end if;
      v_issue := 'already_credited';
      v_ajout := 0;
      v_accordee := false;
      v_refus := null;
      v_alerte := false;
      select p.credits_remaining into v_final from public.profiles p where p.id = p_user_id;
  end;

  return query select v_issue, v_ajout, v_final, v_accordee, v_refus, v_alerte;
end;
$$;

revoke all on function public.credit_single_purchase(uuid, text, boolean, boolean, text, text, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.credit_single_purchase(uuid, text, boolean, boolean, text, text, text, text, text, text, text)
  to service_role;

comment on function public.credit_single_purchase(uuid, text, boolean, boolean, text, text, text, text, text, text, text) is
  'Crédite un achat à l''unité (+1) et, au premier achat du compte et de la carte, l''analyse offerte (+1), en une transaction, une seule fois par paiement (migration 020). Serveur seul.';

-- ── 5. Analyse offerte accordée à la main ───────────────────
-- Quand le paiement n'a pas pu décider l'offre (not_allowed : empreinte
-- absente ou session sans offre ; premier achat crédité par l'ancien code
-- après un retour arrière), Hector décide au cas par cas et l'accorde par
-- cette fonction, jamais par des écritures directes. Mêmes règles que l'offre
-- automatique : premier achat du compte, une offre par compte, une par carte
-- quand l'empreinte est connue. Une transaction :
--   1. la ligne « purchase » de ce paiement donne le compte ; absente :
--      purchase_missing (créditer l'achat d'abord), rien d'écrit ;
--   2. profil verrouillé, dans le même ordre que les deux autres fonctions
--      (absent : profile_missing) ;
--   3. paiement déjà au registre, offre automatique ou à la main :
--      already_granted, rien d'écrit (rejouable) ;
--   4. refus (refused), rien d'écrit : prior_purchase (autre achat du compte
--      au plus tard à l'heure de celui-ci, ancien compte Stripe compris),
--      account_already, card_already ;
--   5. carte probable, avec le verrou de credit_single_purchase : alerte
--      seulement, quand les 4 derniers chiffres sont donnés (empreintes
--      différentes, ou l'une des deux inconnue) ;
--   6. inscription au registre (empreinte nulle si Hector ne l'a pas), +1 et
--      une ligne « bonus » +1 portant le pi_ : granted.
-- Claude prépare l'appel avec le pi_ ; il ne recopie jamais une empreinte :
-- Hector la colle lui-même s'il l'a, sinon elle reste nulle. Appel à la main :
--   begin; set local role service_role;
--   select * from public.grant_first_purchase_offer(p_payment_intent => 'pi_…', p_livemode => true);
--   commit;

create or replace function public.grant_first_purchase_offer(
  p_payment_intent    text,
  p_livemode          boolean,
  p_card_fingerprint  text default null,
  p_wallet_type       text default null,
  p_card_brand        text default null,
  p_card_last4        text default null,
  p_card_country      text default null,
  p_description       text default 'Analyse offerte au premier achat, accordée à la main'
)
returns table (
  outcome              text,
  balance              integer,
  offer_refusal        text,
  probable_card_match  boolean
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_compte     uuid;
  v_achat_le   timestamptz;
  v_solde      integer;
  v_empreinte  text := nullif(p_card_fingerprint, '');
  v_wallet     text := nullif(p_wallet_type, '');
  v_marque     text := nullif(p_card_brand, '');
  v_last4      text := nullif(p_card_last4, '');
  v_pays       text := nullif(p_card_country, '');
  v_alerte     boolean := false;
  v_offre      uuid;
begin
  if coalesce(p_payment_intent, '') = '' or p_livemode is null then
    raise exception 'grant_first_purchase_offer : p_payment_intent et p_livemode sont obligatoires'
      using errcode = '22004';
  end if;

  -- 1. L'achat, crédité d'abord : il donne le compte.
  select t.user_id, t.created_at into v_compte, v_achat_le
    from public.credits_transactions t
   where t.type = 'purchase' and t.stripe_payment_id = p_payment_intent;
  if not found then
    return query select 'purchase_missing'::text, null::integer, null::text, false;
    return;
  end if;

  -- 2. Verrou du profil : un achat ou un retrait du même compte attend.
  select p.credits_remaining into v_solde
    from public.profiles p
   where p.id = v_compte
     for update;
  if not found then
    return query select 'profile_missing'::text, null::integer, null::text, false;
    return;
  end if;

  -- 3. Déjà accordée pour ce paiement.
  if exists (select 1 from public.first_purchase_offers o where o.payment_intent = p_payment_intent) then
    return query select 'already_granted'::text, v_solde, null::text, false;
    return;
  end if;

  -- 4. Premier achat du compte seulement.
  if exists (select 1 from public.credits_transactions t
              where t.user_id = v_compte and t.type = 'purchase'
                and t.stripe_payment_id is distinct from p_payment_intent
                and t.created_at <= v_achat_le) then
    return query select 'refused'::text, v_solde, 'prior_purchase'::text, false;
    return;
  end if;

  -- 5. Carte probable : même verrou consultatif que credit_single_purchase ;
  --    alerte si les empreintes diffèrent ou si l'une des deux est inconnue
  --    (deux offres à la main sans empreinte peuvent être la même carte).
  if v_last4 is not null then
    perform pg_advisory_xact_lock(
      hashtextextended(concat_ws('|', p_livemode, v_marque, v_last4, v_pays), 0));
    v_alerte := exists (
      select 1
        from public.first_purchase_offers o
       where o.livemode = p_livemode
         and o.card_brand is not distinct from v_marque
         and o.card_last4 = v_last4
         and o.card_country is not distinct from v_pays
         and not coalesce(o.card_fingerprint = v_empreinte, false));
  end if;

  -- 6. Registre, puis +1 et la ligne « bonus » du paiement.
  insert into public.first_purchase_offers
    (user_id, payment_intent, livemode, card_fingerprint, wallet_type,
     card_brand, card_last4, card_country)
  values
    (v_compte, p_payment_intent, p_livemode, v_empreinte, v_wallet,
     v_marque, v_last4, v_pays)
  on conflict do nothing
  returning id into v_offre;
  if v_offre is null then
    if exists (select 1 from public.first_purchase_offers o where o.payment_intent = p_payment_intent) then
      return query select 'already_granted'::text, v_solde, null::text, false;
    elsif exists (select 1 from public.first_purchase_offers o where o.user_id = v_compte) then
      return query select 'refused'::text, v_solde, 'account_already'::text, v_alerte;
    else
      return query select 'refused'::text, v_solde, 'card_already'::text, v_alerte;
    end if;
    return;
  end if;

  update public.profiles p
     set credits_remaining = p.credits_remaining + 1
   where p.id = v_compte
  returning p.credits_remaining into v_solde;
  insert into public.credits_transactions (user_id, type, amount, balance_after, description, stripe_payment_id)
  values (v_compte, 'bonus', 1, v_solde,
          coalesce(p_description, 'Analyse offerte au premier achat, accordée à la main'), p_payment_intent);
  return query select 'granted'::text, v_solde, null::text, v_alerte;
end;
$$;

revoke all on function public.grant_first_purchase_offer(text, boolean, text, text, text, text, text, text)
  from public, anon, authenticated;
grant execute on function public.grant_first_purchase_offer(text, boolean, text, text, text, text, text, text)
  to service_role;

comment on function public.grant_first_purchase_offer(text, boolean, text, text, text, text, text, text) is
  'Accorde à la main l''analyse offerte d''un premier achat déjà crédité, aux règles de l''offre automatique (un compte, une carte si l''empreinte est connue) ; inscrite au registre (migration 020). Serveur seul ; à la main : set local role service_role.';

-- ── 6. Retrait de l'analyse offerte ─────────────────────────
-- Premier achat remboursé : l'analyse offerte, automatique ou accordée à la
-- main, est retirée si elle n'a pas été utilisée. Convention : le crédit payé
-- est consommé le premier ; l'offerte est utilisée dès que le compte a
-- consommé 2 analyses depuis l'achat (lignes « usage » postérieures à la ligne
-- « purchase » de ce paiement, moins les crédits rendus postérieurs). Limite
-- connue : un achat payé arrivé entre le premier achat et son remboursement
-- n'est pas décompté ; la règle ne se trompe alors qu'en faveur du client,
-- qui garde au pire l'analyse offerte. Le compte et la carte restent
-- consommés : la ligne du registre est marquée, jamais effacée.
-- Issues : no_offer, already_withdrawn, profile_missing (compte supprimé),
-- used, balance_zero (solde < 1 : rien n'est retiré), withdrawn. Rejouable.
-- Appel à la main :
--   begin; set local role service_role;
--   select * from public.withdraw_first_purchase_offer('pi_…'); commit;

create or replace function public.withdraw_first_purchase_offer(
  p_payment_intent  text,
  p_description     text default 'Analyse offerte retirée : premier achat remboursé'
)
returns table (
  outcome  text,
  balance  integer
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_offre       uuid;
  v_compte      uuid;
  v_accordee_le timestamptz;
  v_retiree_le  timestamptz;
  v_achat_le    timestamptz;
  v_solde       integer;
  v_consommees  bigint;
begin
  select o.id, o.user_id, o.granted_at, o.withdrawn_at
    into v_offre, v_compte, v_accordee_le, v_retiree_le
    from public.first_purchase_offers o
   where o.payment_intent = p_payment_intent;
  if not found then
    return query select 'no_offer'::text, null::integer;
    return;
  end if;
  if v_retiree_le is not null then
    return query select 'already_withdrawn'::text,
                        (select p.credits_remaining from public.profiles p where p.id = v_compte);
    return;
  end if;

  -- Verrou du profil, puis de l'offre : même ordre que credit_single_purchase.
  select p.credits_remaining into v_solde
    from public.profiles p
   where p.id = v_compte
     for update;
  if not found then
    return query select 'profile_missing'::text, null::integer;
    return;
  end if;
  select o.withdrawn_at into v_retiree_le
    from public.first_purchase_offers o
   where o.id = v_offre
     for update;
  if v_retiree_le is not null then
    return query select 'already_withdrawn'::text, v_solde;
    return;
  end if;

  select min(t.created_at) into v_achat_le
    from public.credits_transactions t
   where t.user_id = v_compte and t.type = 'purchase' and t.stripe_payment_id = p_payment_intent;
  select count(*) filter (where t.type = 'usage')
       - count(*) filter (where t.type = 'refund' and t.amount > 0)
    into v_consommees
    from public.credits_transactions t
   where t.user_id = v_compte
     and t.created_at > coalesce(v_achat_le, v_accordee_le);
  if v_consommees >= 2 then
    return query select 'used'::text, v_solde;
    return;
  end if;
  if v_solde < 1 then
    return query select 'balance_zero'::text, v_solde;
    return;
  end if;

  update public.first_purchase_offers o set withdrawn_at = now() where o.id = v_offre;
  update public.profiles p
     set credits_remaining = p.credits_remaining - 1
   where p.id = v_compte
  returning p.credits_remaining into v_solde;
  insert into public.credits_transactions (user_id, type, amount, balance_after, description, stripe_payment_id)
  values (v_compte, 'bonus', -1, v_solde,
          coalesce(p_description, 'Analyse offerte retirée : premier achat remboursé'), p_payment_intent);
  return query select 'withdrawn'::text, v_solde;
end;
$$;

revoke all on function public.withdraw_first_purchase_offer(text, text) from public, anon, authenticated;
grant execute on function public.withdraw_first_purchase_offer(text, text) to service_role;

comment on function public.withdraw_first_purchase_offer(text, text) is
  'Retire l''analyse offerte non utilisée d''un premier achat remboursé ; le compte et la carte restent consommés (migration 020). Serveur seul ; à la main : set local role service_role.';

-- ── 7. Enregistrement ───────────────────────────────────────

insert into private.migrations (numero, nom) values (20, '020_offre_premier_achat_et_cout_ia')
on conflict (numero) do update set nom = excluded.nom, appliquee_le = now();

-- ── 8. Contrôle, dans la transaction ────────────────────────
-- Même méthode que la 019 : la structure, puis des essais réels sous le rôle
-- d'un visiteur (anon), d'un utilisateur (authenticated), du serveur
-- (service_role) ou de l'éditeur SQL (postgres). Chaque essai est annulé
-- aussitôt, avec le compte d'essai qu'il a créé : aucune donnée ne change.
-- Les essais d'achat sont en mode test (livemode faux), sous une marque de
-- carte fictive : ils ne rencontrent aucune offre réelle. Un seul écart annule
-- toute la migration, et le message le dit. Objets temporaires seulement.

drop table if exists pg_temp.controle_020;
create temp table controle_020 (
  ordre    int primary key,
  controle text not null,
  attendu  text not null,
  observe  text not null
);
alter table controle_020 enable row level security;  -- réservée à postgres, qui la lit

-- Motif d'un refus : la contrainte en cause, une règle RLS, ou le message.
create or replace function pg_temp.motif(p_etat text, p_message text, p_contrainte text)
returns text
language sql
as $f$
  select 'refusé (' || p_etat
    || case
         when p_message like 'new row violates row-level security policy%' then ', RLS'
         when coalesce(p_contrainte, '') <> '' then ', ' || p_contrainte
         else ', ' || left(p_message, 70)
       end
    || ')'
$f$;

-- Une étape d'essai : rôle, requête ; « lire » : la requête renvoie un texte.
create or replace function pg_temp.etape(p_role text, p_sql text, p_lire boolean default false)
returns jsonb
language sql
as $f$
  select jsonb_build_object('role', p_role, 'sql', p_sql, 'lire', p_lire,
                            'user', '00000000-0000-4000-8000-000000000020')
$f$;

-- Étapes exécutées puis annulées. Observé : les textes des étapes « lire »
-- (joints par « | »), sinon « accepté », « sans effet » (une étape n'a touché
-- aucune ligne) ou le motif du refus.
create or replace function pg_temp.essai(p_ordre int, p_controle text, p_attendu text, p_etapes jsonb)
returns void
language plpgsql
as $f$
declare
  etape      jsonb;
  lignes     bigint;
  lu         text;
  lectures   text[] := '{}';
  resultat   text := 'accepté';
  contrainte text;
begin
  begin
    for etape in select value from jsonb_array_elements(p_etapes) loop
      perform set_config('request.jwt.claims',
        json_build_object('sub', etape->>'user', 'role', etape->>'role')::text, true);
      perform set_config('role', etape->>'role', true);
      if (etape->>'lire')::boolean then
        execute etape->>'sql' into lu;
        lectures := lectures || coalesce(lu, 'rien');
      else
        execute etape->>'sql';
        get diagnostics lignes = row_count;
        if lignes = 0 then
          resultat := 'sans effet';
        end if;
      end if;
    end loop;
    if cardinality(lectures) > 0 then
      resultat := array_to_string(lectures, ' | ');
    end if;
    raise exception using errcode = 'LV001';  -- annule l'essai
  exception
    when sqlstate 'LV001' then null;
    when others then
      get stacked diagnostics contrainte = constraint_name;
      resultat := pg_temp.motif(sqlstate, sqlerrm, contrainte);
  end;
  insert into controle_020 values (p_ordre, p_controle, p_attendu, resultat);
end;
$f$;

-- Requêtes des essais : un achat (issue, crédits ajoutés, solde, offre ou
-- refus, alerte), un retrait, le journal et le registre d'un paiement.
create or replace function pg_temp.achat(p_user uuid, p_pi text, p_offre boolean, p_empreinte text)
returns text
language sql
as $f$
  select format(
    'select concat_ws(%L, r.outcome, %L || r.credits_added, %L || coalesce(r.balance::text, %L),'
    || ' case when r.offer_granted then %L else coalesce(r.offer_refusal, %L) end,'
    || ' case when r.probable_card_match then %L end)'
    || ' from public.credit_single_purchase(%L, %L, false, %L, %L, null, %L, %L, %L, %L, %L) as r',
    ' ', '+', 'solde ', '-', 'offerte', '-', 'alerte',
    p_user, p_pi, p_offre, p_empreinte, 'controle_020', '0000', 'FR',
    'Contrôle 020 : achat', 'Contrôle 020 : analyse offerte')
$f$;

-- Octroi à la main (mode test) ; p_carte : marque, 4 chiffres et pays des
-- cartes d'essai, sinon aucune donnée de carte.
create or replace function pg_temp.octroi(p_pi text, p_empreinte text, p_carte boolean default false)
returns text
language sql
as $f$
  select format(
    'select concat_ws(%L, r.outcome, %L || coalesce(r.balance::text, %L), coalesce(r.offer_refusal, %L),'
    || ' case when r.probable_card_match then %L end)'
    || ' from public.grant_first_purchase_offer(p_payment_intent => %L, p_livemode => false,'
    || ' p_card_fingerprint => %L, p_card_brand => %L, p_card_last4 => %L, p_card_country => %L) as r',
    ' ', 'solde ', '-', '-', 'alerte',
    p_pi, p_empreinte,
    case when p_carte then 'controle_020' end, case when p_carte then '0000' end, case when p_carte then 'FR' end)
$f$;

create or replace function pg_temp.retrait(p_pi text)
returns text
language sql
as $f$
  select format('select concat_ws(%L, r.outcome, %L || coalesce(r.balance::text, %L))'
                || ' from public.withdraw_first_purchase_offer(%L) as r',
                ' ', 'solde ', '-', p_pi)
$f$;

create or replace function pg_temp.journal(p_pi text)
returns text
language sql
as $f$
  select format('select coalesce(string_agg(t.type || %L || t.amount || %L || t.balance_after, %L'
                || ' order by t.type = %L, t.amount desc), %L)'
                || ' from public.credits_transactions t where t.stripe_payment_id = %L',
                ' ', ' → ', ', ', 'bonus', 'aucune ligne', p_pi)
$f$;

create or replace function pg_temp.registre(p_pi text)
returns text
language sql
as $f$
  select format('select coalesce(string_agg(case when o.withdrawn_at is null then %L else %L end, %L), %L)'
                || ' from public.first_purchase_offers o where o.payment_intent = %L',
                'accordée', 'retirée', ', ', 'aucune', p_pi)
$f$;

-- Données réelles, avant et après les essais.
create or replace function pg_temp.donnees()
returns text
language sql
as $f$
  select format('comptes %s, soldes %s, journal %s lignes (somme %s), offres %s, coûts %s',
                (select count(*) from auth.users),
                (select coalesce(sum(p.credits_remaining), 0) from public.profiles p),
                (select count(*) from public.credits_transactions),
                (select coalesce(sum(t.amount), 0) from public.credits_transactions t),
                (select count(*) from public.first_purchase_offers),
                (select count(*) from public.analysis_costs))
$f$;

-- 8.1 Structure

insert into controle_020
select 1, 'Migrations enregistrées', '20, de 1 à 20',
       (select count(*) || ', de ' || coalesce(min(numero)::text, '?') || ' à ' || coalesce(max(numero)::text, '?')
          from private.migrations)
union all
select 2, 'Tables nouvelles : RLS', 'analysis_costs : activée | first_purchase_offers : activée',
       coalesce((select string_agg(c.relname || ' : ' || case when c.relrowsecurity then 'activée' else 'désactivée' end,
                                   ' | ' order by c.relname collate "C")
                   from pg_class c
                  where c.oid in ('public.analysis_costs'::regclass, 'public.first_purchase_offers'::regclass)), 'absentes')
union all
select 3, 'Tables nouvelles : règles RLS', 'aucune',
       coalesce((select string_agg(tablename || '.' || policyname, ', ' order by policyname collate "C")
                   from pg_policies
                  where schemaname = 'public' and tablename in ('analysis_costs', 'first_purchase_offers')), 'aucune')
union all
select 3 + r.n, 'Tables nouvelles : droits de ' || r.nom || ' (effectifs, colonnes comprises)', r.attendu,
       coalesce((select string_agg(t || ' : ' || p, ' | ' order by t collate "C")
                   from (select c.relname t, string_agg(x.priv, ', ' order by x.priv collate "C") p
                           from pg_class c
                          cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER', 'MAINTAIN']) as x(priv)
                          where c.oid in ('public.analysis_costs'::regclass, 'public.first_purchase_offers'::regclass)
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
       'credit_single_purchase : service_role | grant_first_purchase_offer : service_role | withdraw_first_purchase_offer : service_role',
       coalesce((select string_agg(f || ' : ' || coalesce(qui, 'personne'), ' | ' order by f collate "C")
                   from (select p.proname f,
                                (select string_agg(x.r, ', ' order by x.r collate "C")
                                   from unnest(array['public', 'anon', 'authenticated', 'service_role']) as x(r)
                                  where has_function_privilege(x.r, p.oid, 'EXECUTE')) qui
                           from pg_proc p
                          where p.pronamespace = 'public'::regnamespace
                            and p.proname in ('credit_single_purchase', 'grant_first_purchase_offer', 'withdraw_first_purchase_offer')) y), 'absentes')
union all
select 9, 'Fonctions nouvelles : droits de l''appelant, search_path fixé',
       'credit_single_purchase : invoker, search_path="" | grant_first_purchase_offer : invoker, search_path=""'
       || ' | withdraw_first_purchase_offer : invoker, search_path=""',
       coalesce((select string_agg(p.proname || ' : ' || case when p.prosecdef then 'definer' else 'invoker' end
                                   || ', ' || coalesce(array_to_string(p.proconfig, ','), 'sans search_path'),
                                   ' | ' order by p.proname collate "C")
                   from pg_proc p
                  where p.pronamespace = 'public'::regnamespace
                    and p.proname in ('credit_single_purchase', 'grant_first_purchase_offer', 'withdraw_first_purchase_offer')), 'absentes')
union all
select 10, 'Index des paiements crédités', 'unique, valide, stripe_payment_id, achats payés seulement',
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
select 11, 'Registre des offres : unicités', 'livemode, card_fingerprint | payment_intent | user_id',
       coalesce((select string_agg(cols, ' | ' order by cols collate "C")
                   from (select (select string_agg(a.attname, ', ' order by array_position(k.conkey, a.attnum))
                                   from pg_attribute a
                                  where a.attrelid = k.conrelid and a.attnum = any (k.conkey)) cols
                           from pg_constraint k
                          where k.conrelid = 'public.first_purchase_offers'::regclass and k.contype = 'u') z), 'aucune')
union all
select 12, 'Tables nouvelles : index', 'idx_analysis_costs_analysis_id, idx_analysis_costs_created_at, idx_first_purchase_offers_probable_card',
       coalesce((select string_agg(indexname, ', ' order by indexname collate "C")
                   from pg_indexes
                  where schemaname = 'public' and tablename in ('analysis_costs', 'first_purchase_offers')
                    and indexname like 'idx\_%'), 'aucun')
union all
select 13, 'Fonctions exécutables par anon', 'aucune',
       coalesce((select string_agg(p.pronamespace::regnamespace::text || '.' || p.proname, ', '
                                   order by p.pronamespace::regnamespace::text collate "C", p.proname collate "C")
                   from pg_proc p
                  where p.pronamespace in ('public'::regnamespace, 'private'::regnamespace)
                    and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
                    and has_function_privilege('anon', p.oid, 'EXECUTE')), 'aucune')
union all
select 14, 'Fonctions exécutables par authenticated', 'private.current_user_role, public.is_own_photo_path',
       coalesce((select string_agg(p.pronamespace::regnamespace::text || '.' || p.proname, ', '
                                   order by p.pronamespace::regnamespace::text collate "C", p.proname collate "C")
                   from pg_proc p
                  where p.pronamespace in ('public'::regnamespace, 'private'::regnamespace)
                    and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
                    and has_function_privilege('authenticated', p.oid, 'EXECUTE')), 'aucune')
union all
select 15, 'Fonctions sans search_path fixé', 'aucune',
       coalesce((select string_agg(p.proname, ', ' order by p.proname collate "C")
                   from pg_proc p
                  where p.pronamespace in ('public'::regnamespace, 'private'::regnamespace)
                    and not exists (select 1 from pg_depend d where d.objid = p.oid and d.deptype = 'e')
                    and not exists (select 1 from unnest(coalesce(p.proconfig, '{}')) c where c like 'search_path=%')), 'aucune')
union all
select 16, 'Objets nouveaux dont postgres n''est pas propriétaire', 'aucun',
       coalesce((select string_agg(o, ', ' order by o collate "C") from (
                   select c.relname || ' (' || pg_get_userbyid(c.relowner) || ')' o
                     from pg_class c
                    where c.oid in ('public.analysis_costs'::regclass, 'public.first_purchase_offers'::regclass)
                      and c.relowner <> 'postgres'::regrole
                   union all
                   select p.proname || ' (' || pg_get_userbyid(p.proowner) || ')'
                     from pg_proc p
                    where p.pronamespace = 'public'::regnamespace
                      and p.proname in ('credit_single_purchase', 'grant_first_purchase_offer', 'withdraw_first_purchase_offer')
                      and p.proowner <> 'postgres'::regrole
                 ) x), 'aucun')
union all
select 17, 'Garde des profils (019)', 'active, hors service_role',
       coalesce((select case t.tgenabled when 'O' then 'active' else 'inactive' end
                        || case when pg_get_triggerdef(t.oid) like '%current_setting(''role''::text, true) IS DISTINCT FROM ''service_role''::text%'
                                then ', hors service_role' else ', condition modifiée' end
                   from pg_trigger t
                  where t.tgrelid = 'public.profiles'::regclass and t.tgname = 'guard_profiles'), 'absente');

-- 8.2 Essais réels

do $d$
declare
  u1   uuid := gen_random_uuid();   -- compte d'essai, créé puis effacé avec l'essai
  u2   uuid := gen_random_uuid();   -- second compte d'essai
  x    text := replace(gen_random_uuid()::text, '-', '');
  pi_1 text := 'pi_controle_020_a_' || x;
  pi_2 text := 'pi_controle_020_b_' || x;
  pi_0 text := 'pi_controle_020_ancien_' || x;
  fp_1 text := 'fp_controle_020_a_' || x;
  fp_2 text := 'fp_controle_020_b_' || x;
  c1   jsonb;
  c2   jsonb;
  -- Tout l'essai tient dans une transaction, où l'heure ne bouge pas : cette
  -- étape antidate d'une minute l'achat pi_1, pour que ce qui suit lui soit
  -- postérieur (analyses, autre achat).
  antidate jsonb;
  cout text := 'insert into public.analysis_costs (model, measured, outcome, input_tokens, output_tokens, cost_usd, price_list_date)'
               || ' values (''controle_020'', true, ''report'', %s, 500, 0.0175, date ''2026-09-30'')';
  avant text;
begin
  c1 := pg_temp.etape('postgres', format('insert into auth.users (id) values (%L)', u1));
  c2 := pg_temp.etape('postgres', format('insert into auth.users (id) values (%L)', u2));
  antidate := pg_temp.etape('postgres', format('update public.credits_transactions set created_at = created_at - interval ''1 minute'''
                                               || ' where stripe_payment_id = %L', pi_1));
  avant := pg_temp.donnees();

  -- Portes fermées aux visiteurs et aux utilisateurs.
  perform pg_temp.essai(20, 'Visiteur : lire les coûts IA', 'refusé (42501, permission denied for table analysis_costs)',
    jsonb_build_array(pg_temp.etape('anon', 'select count(*)::text from public.analysis_costs', true)));
  perform pg_temp.essai(21, 'Utilisateur : lire les coûts IA', 'refusé (42501, permission denied for table analysis_costs)',
    jsonb_build_array(pg_temp.etape('authenticated', 'select count(*)::text from public.analysis_costs', true)));
  perform pg_temp.essai(22, 'Utilisateur : écrire un coût IA', 'refusé (42501, permission denied for table analysis_costs)',
    jsonb_build_array(pg_temp.etape('authenticated', format(cout, 1000))));
  perform pg_temp.essai(23, 'Visiteur : lire le registre des offres', 'refusé (42501, permission denied for table first_purchase_offers)',
    jsonb_build_array(pg_temp.etape('anon', 'select count(*)::text from public.first_purchase_offers', true)));
  perform pg_temp.essai(24, 'Utilisateur : lire le registre des offres', 'refusé (42501, permission denied for table first_purchase_offers)',
    jsonb_build_array(pg_temp.etape('authenticated', 'select count(*)::text from public.first_purchase_offers', true)));
  perform pg_temp.essai(25, 'Utilisateur : s''inscrire au registre des offres', 'refusé (42501, permission denied for table first_purchase_offers)',
    jsonb_build_array(pg_temp.etape('authenticated',
      format('insert into public.first_purchase_offers (payment_intent, livemode, card_fingerprint) values (%L, false, %L)', pi_1, fp_1))));
  perform pg_temp.essai(26, 'Visiteur : créditer un achat', 'refusé (42501, permission denied for function credit_single_purchase)',
    jsonb_build_array(pg_temp.etape('anon', pg_temp.achat(u1, pi_1, true, fp_1), true)));
  perform pg_temp.essai(27, 'Utilisateur : créditer un achat', 'refusé (42501, permission denied for function credit_single_purchase)',
    jsonb_build_array(pg_temp.etape('authenticated', pg_temp.achat(u1, pi_1, true, fp_1), true)));
  perform pg_temp.essai(28, 'Visiteur : accorder une analyse offerte à la main', 'refusé (42501, permission denied for function grant_first_purchase_offer)',
    jsonb_build_array(pg_temp.etape('anon', pg_temp.octroi(pi_1, fp_1), true)));
  perform pg_temp.essai(29, 'Utilisateur : accorder une analyse offerte à la main', 'refusé (42501, permission denied for function grant_first_purchase_offer)',
    jsonb_build_array(pg_temp.etape('authenticated', pg_temp.octroi(pi_1, fp_1), true)));
  perform pg_temp.essai(30, 'Visiteur : retirer une analyse offerte', 'refusé (42501, permission denied for function withdraw_first_purchase_offer)',
    jsonb_build_array(pg_temp.etape('anon', pg_temp.retrait(pi_1), true)));
  perform pg_temp.essai(31, 'Utilisateur : retirer une analyse offerte', 'refusé (42501, permission denied for function withdraw_first_purchase_offer)',
    jsonb_build_array(pg_temp.etape('authenticated', pg_temp.retrait(pi_1), true)));

  -- Coûts IA : le serveur ajoute, ne modifie pas.
  perform pg_temp.essai(32, 'Serveur : enregistre le coût d''une analyse', 'accepté',
    jsonb_build_array(pg_temp.etape('service_role', format(cout, 1000))));
  perform pg_temp.essai(33, 'Serveur : modifier un coût enregistré', 'refusé (42501, permission denied for table analysis_costs)',
    jsonb_build_array(pg_temp.etape('service_role', format(cout, 1000)),
                      pg_temp.etape('service_role', 'update public.analysis_costs set cost_usd = 0 where model = ''controle_020''')));
  perform pg_temp.essai(34, 'Serveur : coût à jetons négatifs', 'refusé (23514, analysis_costs_input_tokens_check)',
    jsonb_build_array(pg_temp.etape('service_role', format(cout, -1))));

  -- Achats à l'unité.
  perform pg_temp.essai(35, 'Serveur : premier achat, carte jamais servie',
    'credited +2 solde 2 offerte | purchase 1 → 1, bonus 1 → 2 | accordée',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1), true),
      pg_temp.etape('postgres', pg_temp.journal(pi_1), true),
      pg_temp.etape('postgres', pg_temp.registre(pi_1), true)));
  perform pg_temp.essai(36, 'Serveur : même paiement reçu deux fois',
    'already_credited +0 solde 2 - | purchase 1 → 1, bonus 1 → 2',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1)),
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1), true),
      pg_temp.etape('postgres', pg_temp.journal(pi_1), true)));
  perform pg_temp.essai(37, 'Serveur : second achat du même compte', 'credited +1 solde 3 prior_purchase',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1)),
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_2, true, fp_2), true)));
  perform pg_temp.essai(38, 'Serveur : compte ayant déjà payé sur l''ancien compte Stripe', 'credited +1 solde 1 prior_purchase',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', format('insert into public.credits_transactions (user_id, type, amount, balance_after, description, stripe_payment_id)'
                                           || ' values (%L, %L, 1, 1, %L, %L)', u1, 'purchase', 'Achat utilisation unique — 1 crédit', pi_0)),
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1), true)));
  perform pg_temp.essai(39, 'Serveur : même carte, autre compte jamais servi', 'credited +1 solde 1 card_already',
    jsonb_build_array(c1, c2,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1)),
      pg_temp.etape('service_role', pg_temp.achat(u2, pi_2, true, fp_1), true)));
  perform pg_temp.essai(40, 'Serveur : même marque, 4 chiffres et pays, autre empreinte (portefeuille)', 'credited +2 solde 2 offerte alerte',
    jsonb_build_array(c1, c2,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1)),
      pg_temp.etape('service_role', pg_temp.achat(u2, pi_2, true, fp_2), true)));
  perform pg_temp.essai(41, 'Serveur : session sans offre', 'credited +1 solde 1 not_allowed',
    jsonb_build_array(c1, pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, false, fp_1), true)));
  perform pg_temp.essai(42, 'Serveur : empreinte absente', 'credited +1 solde 1 not_allowed',
    jsonb_build_array(c1, pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, null), true)));
  perform pg_temp.essai(43, 'Serveur : compte inconnu', 'profile_missing +0 solde - -',
    jsonb_build_array(pg_temp.etape('service_role', pg_temp.achat(gen_random_uuid(), pi_1, true, fp_1), true)));
  perform pg_temp.essai(44, 'Éditeur SQL sans service_role : créditer un achat', 'refusé (P0001, forbidden column update)',
    jsonb_build_array(c1, pg_temp.etape('postgres', pg_temp.achat(u1, pi_1, true, fp_1), true)));

  -- Analyse offerte accordée à la main (le paiement n'a pas pu la décider).
  perform pg_temp.essai(45, 'Serveur : octroi à la main après un achat sans empreinte',
    'granted solde 2 - | purchase 1 → 1, bonus 1 → 2 | accordée',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, null)),
      pg_temp.etape('service_role', pg_temp.octroi(pi_1, null), true),
      pg_temp.etape('postgres', pg_temp.journal(pi_1), true),
      pg_temp.etape('postgres', pg_temp.registre(pi_1), true)));
  perform pg_temp.essai(46, 'Serveur : octroi à la main répété', 'already_granted solde 2 -',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, null)),
      pg_temp.etape('service_role', pg_temp.octroi(pi_1, null)),
      pg_temp.etape('service_role', pg_temp.octroi(pi_1, null), true)));
  perform pg_temp.essai(47, 'Serveur : octroi à la main d''un paiement non crédité', 'purchase_missing solde - -',
    jsonb_build_array(pg_temp.etape('service_role', pg_temp.octroi(pi_1, null), true)));
  perform pg_temp.essai(48, 'Serveur : octroi à la main du premier achat, un autre achat étant venu après', 'granted solde 3 -',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, null)),
      antidate,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_2, true, fp_2)),
      pg_temp.etape('service_role', pg_temp.octroi(pi_1, null), true)));
  perform pg_temp.essai(49, 'Serveur : octroi à la main d''un achat qui n''est pas le premier du compte', 'refused solde 2 prior_purchase',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, null)),
      antidate,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_2, true, fp_2)),
      pg_temp.etape('service_role', pg_temp.octroi(pi_2, null), true)));
  perform pg_temp.essai(50, 'Serveur : octroi à la main, empreinte déjà servie par un autre compte', 'refused solde 1 card_already',
    jsonb_build_array(c1, c2,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1)),
      pg_temp.etape('service_role', pg_temp.achat(u2, pi_2, true, null)),
      pg_temp.etape('service_role', pg_temp.octroi(pi_2, fp_1), true)));
  perform pg_temp.essai(51, 'Serveur : octroi à la main sans empreinte, même marque, 4 chiffres et pays qu''une offre', 'granted solde 2 - alerte',
    jsonb_build_array(c1, c2,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1)),
      pg_temp.etape('service_role', pg_temp.achat(u2, pi_2, true, null)),
      pg_temp.etape('service_role', pg_temp.octroi(pi_2, null, true), true)));
  perform pg_temp.essai(52, 'Serveur : achat, même marque, 4 chiffres et pays qu''une offre accordée à la main sans empreinte',
    'credited +2 solde 2 offerte alerte',
    jsonb_build_array(c1, c2,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, null)),
      pg_temp.etape('service_role', pg_temp.octroi(pi_1, null, true)),
      pg_temp.etape('service_role', pg_temp.achat(u2, pi_2, true, fp_2), true)));
  perform pg_temp.essai(53, 'Éditeur SQL sans service_role : accorder à la main', 'refusé (P0001, forbidden column update)',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, null)),
      pg_temp.etape('postgres', pg_temp.octroi(pi_1, null), true)));

  -- Retraits après remboursement.
  perform pg_temp.essai(54, 'Serveur : retrait après remboursement',
    'withdrawn solde 1 | purchase 1 → 1, bonus 1 → 2, bonus -1 → 1 | retirée',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1)),
      pg_temp.etape('service_role', pg_temp.retrait(pi_1), true),
      pg_temp.etape('postgres', pg_temp.journal(pi_1), true),
      pg_temp.etape('postgres', pg_temp.registre(pi_1), true)));
  perform pg_temp.essai(55, 'Serveur : second retrait du même paiement', 'already_withdrawn solde 1',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1)),
      pg_temp.etape('service_role', pg_temp.retrait(pi_1)),
      pg_temp.etape('service_role', pg_temp.retrait(pi_1), true)));
  perform pg_temp.essai(56, 'Serveur : retrait d''une analyse offerte déjà utilisée', 'used solde 0',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1)),
      antidate,
      pg_temp.etape('service_role', format('select public.decrement_credits_atomic(%L, null, %L)', u1, 'Contrôle 020 : analyse')),
      pg_temp.etape('service_role', format('select public.decrement_credits_atomic(%L, null, %L)', u1, 'Contrôle 020 : analyse')),
      pg_temp.etape('service_role', pg_temp.retrait(pi_1), true)));
  perform pg_temp.essai(57, 'Serveur : retrait sur un solde nul', 'balance_zero solde 0',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1)),
      pg_temp.etape('service_role', format('update public.profiles set credits_remaining = 0 where id = %L', u1)),
      pg_temp.etape('service_role', pg_temp.retrait(pi_1), true)));
  perform pg_temp.essai(58, 'Serveur : retrait d''un achat sans analyse offerte', 'no_offer solde -',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, false, fp_1)),
      pg_temp.etape('service_role', pg_temp.retrait(pi_1), true)));
  perform pg_temp.essai(59, 'Serveur : retrait d''une analyse offerte accordée à la main',
    'withdrawn solde 1 | purchase 1 → 1, bonus 1 → 2, bonus -1 → 1 | retirée',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, null)),
      pg_temp.etape('service_role', pg_temp.octroi(pi_1, null)),
      pg_temp.etape('service_role', pg_temp.retrait(pi_1), true),
      pg_temp.etape('postgres', pg_temp.journal(pi_1), true),
      pg_temp.etape('postgres', pg_temp.registre(pi_1), true)));
  perform pg_temp.essai(60, 'Serveur : effacer une offre du registre', 'refusé (42501, permission denied for table first_purchase_offers)',
    jsonb_build_array(c1,
      pg_temp.etape('service_role', pg_temp.achat(u1, pi_1, true, fp_1)),
      pg_temp.etape('service_role', format('delete from public.first_purchase_offers where payment_intent = %L', pi_1))));
  perform pg_temp.essai(61, 'Garde des profils : crédits intouchables hors serveur', 'refusé (P0001, forbidden column update)',
    jsonb_build_array(c1,
      pg_temp.etape('postgres', format('update public.profiles set credits_remaining = credits_remaining + 1 where id = %L', u1))));

  insert into controle_020 values (62, 'Données réelles intactes après les essais', avant, pg_temp.donnees());
end;
$d$;

do $$
declare
  echecs text;
begin
  select string_agg(ordre || '. ' || controle || ' : attendu « ' || attendu || ' », observé « ' || observe || ' »',
                    ' | ' order by ordre)
    into echecs
    from controle_020
   where attendu <> observe;
  if echecs is not null then
    raise exception 'Contrôle 020 en échec, rien n''est appliqué : %', echecs;
  end if;
end;
$$;

commit;

-- Résultat du contrôle : cette table ne s'affiche que si la migration est appliquée.
select ordre, controle, attendu, observe,
       case when attendu = observe then 'ok' else 'ÉCART' end as resultat
  from controle_020
 order by ordre;
