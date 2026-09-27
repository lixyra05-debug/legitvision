// releaseReservedCredit : rend le crédit réservé par un lancement, sans jamais
// écraser un débit ou un achat concurrent (mise à jour conditionnelle), et sans
// jamais rejouer une écriture dont l'issue est inconnue.
import { test } from "node:test";
import assert from "node:assert/strict";
import { adjustCreditsAtomically, releaseReservedCredit } from "@/lib/credit-release";

type Ligne = Record<string, unknown>;
type Etat = {
  solde: number;
  journal: Ligne[];
  avantMaj?: () => void;
  erreursLectureProfil?: number;
  erreurEcriture?: boolean;
  annule?: boolean;
  majs?: number;
};

/**
 * Faux client Supabase, limité aux appels de lib/credit-release.ts.
 * `avantMaj` simule une écriture concurrente juste avant chaque mise à jour ;
 * `erreursLectureProfil` fait échouer autant de lectures du solde ;
 * `erreurEcriture` : la mise à jour s'applique mais sa réponse se perd ;
 * `annule` : un déclencheur remet l'ancien solde sans erreur.
 */
function fauxClient(etat: Etat) {
  return {
    from(table: string) {
      void table;
      const filtres: Record<string, unknown> = {};
      const requete = {
        select() { return requete; },
        eq(col: string, val: unknown) { filtres[col] = val; return requete; },
        single() {
          if (etat.erreursLectureProfil) {
            etat.erreursLectureProfil--;
            return Promise.resolve({ data: null, error: { message: "lecture" } });
          }
          return Promise.resolve({ data: { credits_remaining: etat.solde }, error: null });
        },
        update(valeurs: { credits_remaining: number }) {
          return {
            eq(col: string, val: unknown) { filtres[col] = val; return this; },
            select() {
              etat.majs = (etat.majs ?? 0) + 1;
              etat.avantMaj?.();
              if (filtres.credits_remaining !== etat.solde) return Promise.resolve({ data: [], error: null });
              if (!etat.annule) etat.solde = valeurs.credits_remaining;
              if (etat.erreurEcriture) return Promise.resolve({ data: null, error: { message: "fetch failed" } });
              return Promise.resolve({ data: [{ id: "u", credits_remaining: etat.solde }], error: null });
            },
          };
        },
        insert(ligne: Ligne) { etat.journal.push(ligne); return Promise.resolve({ error: null }); },
      };
      return requete;
    },
  } as never;
}

const lancement = { userId: "u", analysisId: "a1", reservation: "Analyse a1 (lancement L1)" };
const sansPause = { pauseMs: 0 };
const silence = async <T>(fn: () => Promise<T>) => {
  const e = console.error;
  console.error = () => {};
  try { return await fn(); } finally { console.error = e; }
};

test("rend le crédit et le journalise, en citant la réservation", async () => {
  const etat: Etat = { solde: 0, journal: [] };
  assert.equal(await releaseReservedCredit(fauxClient(etat), lancement, "photos insuffisantes", sansPause), "released");
  assert.equal(etat.solde, 1);
  assert.equal(etat.journal.length, 1);
  assert.deepEqual(
    { type: etat.journal[0].type, amount: etat.journal[0].amount, balance_after: etat.journal[0].balance_after, analysis_id: etat.journal[0].analysis_id },
    { type: "refund", amount: 1, balance_after: 1, analysis_id: "a1" }
  );
  assert.equal(etat.journal[0].description, "Crédit rendu — photos insuffisantes — Analyse a1 (lancement L1)");
});

test("deux lancements de la même analyse : chacun son remboursement", async () => {
  const etat: Etat = { solde: 0, journal: [] };
  await releaseReservedCredit(fauxClient(etat), lancement, "photos insuffisantes", sansPause);
  const second = { ...lancement, reservation: "Analyse a1 (lancement L2)" };
  assert.equal(await releaseReservedCredit(fauxClient(etat), second, "échec de l'analyse", sansPause), "released");
  assert.equal(etat.solde, 2);
});

test("débit concurrent : relit et ne l'écrase pas", async () => {
  let premier = true;
  const etat: Etat = {
    solde: 2,
    journal: [],
    avantMaj() { if (premier) { premier = false; etat.solde -= 1; } }, // une autre analyse débite pendant ce temps
  };
  assert.equal(await releaseReservedCredit(fauxClient(etat), lancement, "échec", sansPause), "released");
  assert.equal(etat.solde, 2, "2 − 1 (débit concurrent) + 1 (crédit rendu)");
});

test("solde modifié à chaque essai : rien d'écrit, non rendu", async () => {
  const etat: Etat = { solde: 5, journal: [], avantMaj() { etat.solde += 1; } };
  assert.equal(await silence(() => releaseReservedCredit(fauxClient(etat), lancement, "échec", sansPause)), "not_released");
  assert.equal(etat.journal.length, 0);
});

test("solde illisible un moment : nouvelle tentative, crédit rendu", async () => {
  const etat: Etat = { solde: 0, journal: [], erreursLectureProfil: 2 };
  assert.equal(await releaseReservedCredit(fauxClient(etat), lancement, "échec", sansPause), "released");
  assert.equal(etat.solde, 1);
});

test("solde illisible à chaque tentative : non rendu", async () => {
  const etat: Etat = { solde: 0, journal: [], erreursLectureProfil: 99 };
  assert.equal(await silence(() => releaseReservedCredit(fauxClient(etat), lancement, "échec", sansPause)), "not_released");
  assert.equal(etat.solde, 0);
});

test("échéance atteinte : aucune nouvelle tentative", async () => {
  const etat: Etat = { solde: 0, journal: [], erreursLectureProfil: 1 };
  const issue = await silence(() =>
    releaseReservedCredit(fauxClient(etat), lancement, "échec", { pauseMs: 1000, deadline: Date.now() + 500 })
  );
  assert.equal(issue, "not_released");
  assert.equal(etat.solde, 0);
});

test("écriture appliquée mais réponse perdue : jamais rejouée, issue incertaine", async () => {
  const etat: Etat = { solde: 0, journal: [], erreurEcriture: true };
  assert.equal(await silence(() => releaseReservedCredit(fauxClient(etat), lancement, "échec", sansPause)), "uncertain");
  assert.equal(etat.solde, 1, "rendu une fois, pas deux");
  assert.equal(etat.majs, 1);
});

test("solde remis en arrière sans erreur : non rendu, rien de journalisé", async () => {
  const etat: Etat = { solde: 0, journal: [], annule: true };
  assert.equal(await silence(() => releaseReservedCredit(fauxClient(etat), lancement, "échec", sansPause)), "not_released");
  assert.equal(etat.solde, 0);
  assert.equal(etat.journal.length, 0);
});

test("adjustCreditsAtomically : ce qui peut être relancé, et ce qui ne doit pas l'être", async () => {
  assert.deepEqual(await adjustCreditsAtomically(fauxClient({ solde: 3, journal: [] }), "u", 10), { balance: 13 });
  assert.deepEqual(await adjustCreditsAtomically(fauxClient({ solde: 3, journal: [], erreursLectureProfil: 1 }), "u", 1), { failure: "not_written" });
  assert.deepEqual(await adjustCreditsAtomically(fauxClient({ solde: 3, journal: [], annule: true }), "u", 1), { failure: "not_written" });
  assert.deepEqual(await adjustCreditsAtomically(fauxClient({ solde: 3, journal: [], erreurEcriture: true }), "u", 1), { failure: "unknown" });
});
