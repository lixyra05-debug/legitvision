// Reprise des analyses abandonnées (lib/analysis-stale.ts), sans réseau : un
// faux client admin applique les filtres de la mise à jour à une petite table
// en mémoire. On vérifie que chaque statut a son propre seuil et que la mise à
// jour reste conditionnelle (statut et ancienneté relus au moment d'écrire).
import { test } from "node:test";
import assert from "node:assert/strict";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ANALYSIS_STALE_AFTER_SECONDS,
  LAUNCH_STALE_AFTER_SECONDS,
  UPLOAD_STALE_AFTER_SECONDS,
} from "@/lib/analysis-limits";
import { expireStaleAnalyses } from "@/lib/analysis-stale";

interface Ligne {
  id: string;
  user_id: string;
  status: string;
  updated_at: string;
}

type Filtre = (ligne: Ligne) => boolean;

/** Faux client : seule la chaîne update().eq().in().eq().lt().select() est servie. */
function fauxAdmin(table: Ligne[]): { admin: SupabaseClient; ecritures: number } {
  const etat = { ecritures: 0 };
  const admin = {
    from(nom: string) {
      assert.equal(nom, "analyses");
      return {
        update(valeurs: { status: string }) {
          const filtres: Filtre[] = [];
          const constructeur = {
            eq(colonne: keyof Ligne, valeur: string) {
              filtres.push((l) => l[colonne] === valeur);
              return constructeur;
            },
            in(colonne: keyof Ligne, valeurs: string[]) {
              filtres.push((l) => valeurs.includes(l[colonne]));
              return constructeur;
            },
            lt(colonne: keyof Ligne, valeur: string) {
              filtres.push((l) => Date.parse(l[colonne]) < Date.parse(valeur));
              return constructeur;
            },
            async select(colonnes: string) {
              assert.equal(colonnes, "id");
              etat.ecritures += 1;
              const touchees = table.filter((l) => filtres.every((f) => f(l)));
              for (const l of touchees) l.status = valeurs.status;
              return { data: touchees.map((l) => ({ id: l.id })), error: null };
            },
          };
          return constructeur;
        },
      };
    },
  };
  return {
    admin: admin as unknown as SupabaseClient,
    get ecritures() {
      return etat.ecritures;
    },
  };
}

const MAINTENANT = Date.parse("2026-09-26T12:00:00Z");
const il = (s: number) => new Date(MAINTENANT - s * 1000).toISOString();

test("chaque statut non terminé a son propre seuil ; rien d'autre n'est touché", async () => {
  const table: Ligne[] = [
    { id: "a-vieille", user_id: "u1", status: "analyzing", updated_at: il(ANALYSIS_STALE_AFTER_SECONDS + 5) },
    { id: "a-recente", user_id: "u1", status: "analyzing", updated_at: il(ANALYSIS_STALE_AFTER_SECONDS - 5) },
    { id: "p-perdue", user_id: "u1", status: "pending", updated_at: il(LAUNCH_STALE_AFTER_SECONDS + 5) },
    { id: "p-recente", user_id: "u1", status: "pending", updated_at: il(LAUNCH_STALE_AFTER_SECONDS - 5) },
    // Envoi en cours depuis plus longtemps qu'un lancement perdu : pas repris.
    { id: "u-en-cours", user_id: "u1", status: "uploading", updated_at: il(LAUNCH_STALE_AFTER_SECONDS + 5) },
    { id: "u-abandon", user_id: "u1", status: "uploading", updated_at: il(UPLOAD_STALE_AFTER_SECONDS + 5) },
    { id: "terminee", user_id: "u1", status: "completed", updated_at: il(86_400) },
  ];
  const faux = fauxAdmin(table);
  const expirees = await expireStaleAnalyses(faux.admin, "u1", table.map((l) => ({ ...l })), MAINTENANT);

  assert.deepEqual([...expirees].sort(), ["a-vieille", "p-perdue", "u-abandon"]);
  assert.equal(faux.ecritures, 3, "une mise à jour par statut concerné");
  const statut = Object.fromEntries(table.map((l) => [l.id, l.status]));
  assert.equal(statut["a-recente"], "analyzing");
  assert.equal(statut["p-recente"], "pending");
  assert.equal(statut["u-en-cours"], "uploading");
  assert.equal(statut["terminee"], "completed");
});

test("mise à jour conditionnelle : une analyse réservée ou enregistrée entre-temps n'est pas écrasée", async () => {
  // Lue « pending » depuis longtemps, mais la route l'a réservée entre la
  // lecture et l'écriture : la ligne est désormais « analyzing », toute fraîche.
  const table: Ligne[] = [
    { id: "x", user_id: "u1", status: "analyzing", updated_at: il(1) },
    { id: "y", user_id: "u1", status: "completed", updated_at: il(2) },
  ];
  const lu = [
    { id: "x", status: "pending", updated_at: il(LAUNCH_STALE_AFTER_SECONDS + 60) },
    { id: "y", status: "analyzing", updated_at: il(ANALYSIS_STALE_AFTER_SECONDS + 60) },
  ];
  const faux = fauxAdmin(table);
  const expirees = await expireStaleAnalyses(faux.admin, "u1", lu, MAINTENANT);
  assert.equal(expirees.size, 0);
  assert.equal(table[0].status, "analyzing");
  assert.equal(table[1].status, "completed");
});

test("jamais l'analyse d'un autre utilisateur", async () => {
  const table: Ligne[] = [
    { id: "z", user_id: "u2", status: "pending", updated_at: il(LAUNCH_STALE_AFTER_SECONDS + 60) },
  ];
  const faux = fauxAdmin(table);
  const expirees = await expireStaleAnalyses(
    faux.admin,
    "u1",
    [{ id: "z", status: "pending", updated_at: table[0].updated_at }],
    MAINTENANT,
  );
  assert.equal(expirees.size, 0);
  assert.equal(table[0].status, "pending");
});

test("aucune analyse en retard : aucune écriture", async () => {
  const faux = fauxAdmin([]);
  const expirees = await expireStaleAnalyses(
    faux.admin,
    "u1",
    [{ id: "r", status: "pending", updated_at: il(10) }],
    MAINTENANT,
  );
  assert.equal(expirees.size, 0);
  assert.equal(faux.ecritures, 0);
});
