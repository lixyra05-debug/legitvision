-- ============================================================
-- LegitVision — Migration 005 : Fix photo_protocol key "type" → "name"
--
-- Problème : Les 5 marques seedées en migration 001 (Nike, Jordan,
-- adidas, New Balance, Louis Vuitton) utilisaient "type" comme clé
-- dans le JSONB photo_protocol au lieu de "name".
--
-- Le composant PhotoUploader lit slot.name → undefined pour ces
-- marques → tous les slots partagent la clé undefined → une photo
-- uploadée dans un slot apparaît dans TOUS les autres slots.
--
-- Ce fix renomme "type" → "name" dans tous les slots concernés.
-- Sûr à rejouer : ne touche que les lignes avec "type" sans "name".
-- ============================================================

UPDATE public.brands
SET photo_protocol = (
  SELECT jsonb_agg(
    CASE
      WHEN (slot ? 'name') THEN slot
      ELSE (slot - 'type') || jsonb_build_object('name', slot->>'type')
    END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(photo_protocol) WITH ORDINALITY AS t(slot, ordinality)
)
WHERE EXISTS (
  SELECT 1
  FROM jsonb_array_elements(photo_protocol) AS slot
  WHERE (slot ? 'type') AND NOT (slot ? 'name')
);
