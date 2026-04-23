-- Migration 013: Table stripe_events pour idempotence webhook
-- Empêche le double-traitement d'événements Stripe lors de retries
-- (Stripe peut retransmettre un webhook jusqu'à 3 fois sur 72h).
--
-- Pattern : insertion atomique dans l'API route ; une violation PRIMARY KEY
-- (Postgres code 23505) signale que l'event.id a déjà été traité.

CREATE TABLE IF NOT EXISTS stripe_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS activé : seul le service_role (webhook côté serveur) peut écrire.
-- Aucune policy = aucun accès pour les clients anon/authenticated.
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE stripe_events IS
  'Table d''idempotence : un event.id = une insertion. Violations PK = duplicates à ignorer.';
COMMENT ON COLUMN stripe_events.id IS
  'Stripe event.id, ex: evt_1abc... — PRIMARY KEY enforce l''unicité.';
