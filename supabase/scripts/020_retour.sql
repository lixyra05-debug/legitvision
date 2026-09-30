-- ============================================================
-- Retour arrière de la migration 020 — à n'exécuter QUE si un parcours de
-- l'application est cassé après la 020, avant que le code qui s'en sert
-- (coût IA, offre de premier achat) ne soit déployé.
-- ============================================================
-- Retire tout ce que la 020 a créé : les fonctions credit_single_purchase,
-- grant_first_purchase_offer et withdraw_first_purchase_offer, l'index unique
-- des paiements crédités, les tables first_purchase_offers et analysis_costs,
-- et la 020 du registre. Ne touche à aucune ligne des tables existantes
-- (credits_transactions, profiles) : un achat crédité par la 020 reste crédité.
-- Refuse de s'exécuter après une migration plus récente, ou si l'une des deux
-- tables contient une ligne : le registre des offres garde les comptes et les
-- cartes déjà servis, analysis_costs les dépenses relevées. Dans ce cas,
-- décider avec Hector, lignes exportées d'abord. Les deux tables sont
-- verrouillées avant d'être comptées : une ligne en cours d'écriture est
-- attendue puis comptée, jamais supprimée avec sa table. Rejouable. Un seul
-- tableau de résultat à la fin.

begin;
set local lock_timeout = '5s';

do $$
declare
  lignes bigint;
begin
  if exists (select 1 from private.migrations where numero > 20) then
    raise exception 'Retour de la 020 impossible après une migration plus récente (dernière : %).',
      (select max(numero) from private.migrations);
  end if;
  -- Chaque table est verrouillée avant d'être comptée, jusqu'au commit : une
  -- écriture en cours est attendue (5 s au plus) puis comptée, et aucune ligne
  -- ne peut plus s'ajouter entre le comptage et la suppression de la table.
  if to_regclass('public.first_purchase_offers') is not null then
    execute 'lock table public.first_purchase_offers in access exclusive mode';
    execute 'select count(*) from public.first_purchase_offers' into lignes;
    if lignes > 0 then
      raise exception 'Retour de la 020 refusé : le registre des offres contient % ligne(s), comptes et cartes déjà servis. Rien n''est retiré.', lignes;
    end if;
  end if;
  if to_regclass('public.analysis_costs') is not null then
    execute 'lock table public.analysis_costs in access exclusive mode';
    execute 'select count(*) from public.analysis_costs' into lignes;
    if lignes > 0 then
      raise exception 'Retour de la 020 refusé : analysis_costs contient % ligne(s), coûts IA relevés. Rien n''est retiré.', lignes;
    end if;
  end if;
end;
$$;

drop function if exists public.withdraw_first_purchase_offer(text, text);
drop function if exists public.grant_first_purchase_offer(text, boolean, text, text, text, text, text, text, text);
drop function if exists public.credit_single_purchase(uuid, text, boolean, boolean, text, text, text, text, text, text, text, text);
drop index if exists public.credits_transactions_purchase_payment_key;
drop table if exists public.first_purchase_offers;
drop table if exists public.analysis_costs;

delete from private.migrations where numero = 20;

commit;

select 'tables et index de la 020' as controle,
       coalesce((select string_agg(c.relname, ', ' order by c.relname collate "C")
                   from pg_class c
                  where c.relnamespace = 'public'::regnamespace
                    and c.relname in ('analysis_costs', 'first_purchase_offers', 'credits_transactions_purchase_payment_key')),
                'aucun') as observe,
       'aucun' as attendu
union all
select 'fonctions de la 020',
       coalesce((select string_agg(p.proname, ', ' order by p.proname collate "C")
                   from pg_proc p
                  where p.pronamespace = 'public'::regnamespace
                    and p.proname in ('credit_single_purchase', 'grant_first_purchase_offer', 'withdraw_first_purchase_offer')),
                'aucune'),
       'aucune'
union all
select 'dernière migration enregistrée', (select max(numero)::text from private.migrations), '19';
