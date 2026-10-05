// Purge des photos (lib/purge-photos.ts) : un passage toutes les 6 heures,
// décidé le 04/10 après l'échec de la passe du 03/10 (base injoignable) ; la
// production garde un passage par jour jusqu'au déploiement de ce programme.
// Aucune photo ne doit dépasser PHOTO_RETENTION_DAYS, même si UNE passe
// échoue. Ces tests lient le programme de vercel.json et la durée maximale de
// la route à la marge du code, puis simulent le pire cas.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  PURGE_INTERVAL_HOURS,
  PURGE_MARGIN_HOURS,
  PURGE_RUN_MAX_SECONDS,
  PURGE_SCHEDULE,
  PURGE_TOLERATED_FAILED_RUNS,
  PURGE_TRIGGER_DELAY_SECONDS,
  purgeCutoff,
  purgeExpiredPhotos,
} from "@/lib/purge-photos";
import { PHOTO_RETENTION_DAYS } from "@/lib/site-facts";
import { fauxAdmin, type Ligne, type Objet } from "./support/faux-stockage-photos";

const RACINE = new URL("../../", import.meta.url);
const ROUTE = "/api/cron/purge-photos";
const HEURE = 3_600_000;
const DUREE_MAX = PHOTO_RETENTION_DAYS * 24 * HEURE;

test("vercel.json lance la purge selon PURGE_SCHEDULE, toutes les 6 heures", () => {
  const config = JSON.parse(readFileSync(new URL("vercel.json", RACINE), "utf8")) as {
    crons?: { path: string; schedule: string }[];
  };
  const crons = (config.crons ?? []).filter((c) => c.path === ROUTE);
  assert.equal(crons.length, 1, "un seul cron de purge attendu");
  assert.equal(crons[0].schedule, PURGE_SCHEDULE);
  assert.ok(existsSync(new URL(`app${ROUTE}/route.ts`, RACINE)), "la route du cron existe");

  // Minute 0, une heure sur PURGE_INTERVAL_HOURS, tous les jours : des passages
  // régulièrement espacés, y compris de 18 h à 0 h.
  const [minute, heure, ...reste] = PURGE_SCHEDULE.split(" ");
  assert.equal(minute, "0");
  assert.equal(heure, `*/${PURGE_INTERVAL_HOURS}`);
  assert.deepEqual(reste, ["*", "*", "*"]);
  assert.equal(24 % PURGE_INTERVAL_HOURS, 0);
  assert.equal(PURGE_INTERVAL_HOURS, 6);
});

test("marge : deux intervalles, plus le retard et la durée d'un passage, à l'heure supérieure", () => {
  assert.equal(PURGE_TOLERATED_FAILED_RUNS, 1);
  const pire =
    (PURGE_TOLERATED_FAILED_RUNS + 1) * PURGE_INTERVAL_HOURS * 3600 +
    PURGE_TRIGGER_DELAY_SECONDS +
    PURGE_RUN_MAX_SECONDS;
  assert.ok(PURGE_MARGIN_HOURS * 3600 >= pire);
  assert.ok((PURGE_MARGIN_HOURS - 1) * 3600 < pire, "arrondie à l'heure supérieure, pas au-delà");
  assert.equal(PURGE_MARGIN_HOURS, 13);
});

test("la route fixe sa durée maximale à PURGE_RUN_MAX_SECONDS, dont dépend la marge", () => {
  // maxDuration doit être un littéral (Next le lit à la compilation) : on lit la source.
  const source = readFileSync(new URL(`app${ROUTE}/route.ts`, RACINE), "utf8");
  const valeur = source.match(/^export const maxDuration = (\d+);$/m);
  assert.ok(valeur, "export const maxDuration absent de la route");
  assert.equal(Number(valeur[1]), PURGE_RUN_MAX_SECONDS);
});

test("retard du déclenchement : 60 s, borne de « dans la minute prévue » (offre Pro)", () => {
  assert.equal(PURGE_TRIGGER_DELAY_SECONDS, 60);
});

test("purgeCutoff : 30 jours moins 13 heures avant le passage", () => {
  const maintenant = new Date("2026-10-04T12:00:00Z");
  assert.equal(purgeCutoff(maintenant).toISOString(), "2026-09-05T01:00:00.000Z");
});

test("une passe manquée : aucune photo ne dépasse PHOTO_RETENTION_DAYS", () => {
  const debut = Date.parse("2026-10-01T00:00:00Z"); // 0 h UTC : un passage prévu
  const prevu = (k: number) => debut + k * PURGE_INTERVAL_HOURS * HEURE;
  const supprime = (envoi: number, depart: number) => envoi < purgeCutoff(new Date(depart)).getTime();

  let pire = 0;
  // Une photo envoyée toutes les 61 s pendant un jour.
  for (let envoi = debut; envoi < debut + 24 * HEURE; envoi += 61_000) {
    // Premier passage qui la supprimerait, même parti à l'heure exacte. Les
    // précédents ne la suppriment pas s'ils partent à l'heure exacte.
    let k = 0;
    while (!supprime(envoi, prevu(k))) k++;
    // Celui-là échoue ; le suivant part avec le retard maximal.
    const depart = prevu(k + PURGE_TOLERATED_FAILED_RUNS) + PURGE_TRIGGER_DELAY_SECONDS * 1000;
    assert.ok(supprime(envoi, depart));
    const fin = depart + PURGE_RUN_MAX_SECONDS * 1000;
    assert.ok(fin - envoi <= DUREE_MAX, `photo du ${new Date(envoi).toISOString()} gardée trop longtemps`);
    pire = Math.max(pire, fin - envoi);
  }
  // La simulation atteint bien le cas critique : à moins d'une heure de la limite.
  assert.ok(DUREE_MAX - pire < HEURE, `pire cas simulé : ${(pire / HEURE).toFixed(2)} h`);
});

// ── purgeExpiredPhotos sur un faux client (support/faux-stockage-photos.ts) ───

test("purgeExpiredPhotos : supprime au-delà de 29 j 11 h, garde en deçà", async () => {
  const maintenant = new Date("2026-10-04T12:00:00Z");
  const il = (heures: number, minutes: number) =>
    new Date(maintenant.getTime() - heures * HEURE - minutes * 60_000).toISOString();
  const age = PHOTO_RETENTION_DAYS * 24 - PURGE_MARGIN_HOURS; // 707 h
  const objets: Objet[] = [
    { path: "u1/a1/sole.jpg", writtenAt: il(age, -1), size: 10 }, // 1 min de moins : gardée
    { path: "u1/a1/box.jpg", writtenAt: il(age, 1), size: 20 }, // 1 min de plus : supprimée
    { path: "u2/a2/label.jpg", writtenAt: il(31 * 24, 0), size: 30 }, // sans ligne : supprimée
  ];
  const lignes: Ligne[] = [
    { id: "p1", analysis_id: "a1", storage_path: "u1/a1/sole.jpg", created_at: il(age, -1) },
    { id: "p2", analysis_id: "a1", storage_path: "u1/a1/box.jpg", created_at: il(age, 1) },
  ];

  const essai = fauxAdmin(objets, lignes);
  const compte = await purgeExpiredPhotos(essai.admin, { dryRun: true, now: maintenant });
  assert.equal(compte.cutoff, purgeCutoff(maintenant).toISOString());
  assert.equal(compte.bucketObjects, 3);
  assert.equal(compte.expiredObjects, 2);
  assert.equal(compte.expiredBytes, 50);
  assert.equal(compte.orphanObjects, 1);
  assert.equal(compte.expiredRows, 1);
  assert.equal(essai.etat.objets.length, 3, "le passage à blanc ne supprime rien");

  const reel = fauxAdmin(objets, lignes);
  const rapport = await purgeExpiredPhotos(reel.admin, { dryRun: false, now: maintenant });
  assert.equal(rapport.deletedObjects, 2);
  assert.equal(rapport.deletedRows, 1);
  assert.deepEqual(reel.etat.objets.map((o) => o.path), ["u1/a1/sole.jpg"]);
  assert.deepEqual(reel.etat.lignes.map((l) => l.id), ["p1"]);
});

test("overdueObjects : les fichiers déjà plus vieux que PHOTO_RETENTION_DAYS au début du passage", async () => {
  const maintenant = new Date("2026-10-04T12:00:00Z");
  const il = (heures: number, minutes: number) =>
    new Date(maintenant.getTime() - heures * HEURE - minutes * 60_000).toISOString();
  const trenteJours = PHOTO_RETENTION_DAYS * 24;
  const objets: Objet[] = [
    { path: "u1/a1/sole.jpg", writtenAt: il(trenteJours - 1, 0), size: 10 }, // expirée, pas en retard
    { path: "u1/a1/box.jpg", writtenAt: il(trenteJours, 1), size: 20 }, // 30 j et 1 min : en retard
    { path: "u2/a2/label.jpg", writtenAt: il(trenteJours + 30, 0), size: 30 }, // en retard
    { path: "u3/a3/tag.jpg", writtenAt: il(24, 0), size: 40 }, // récente
  ];
  const essai = fauxAdmin(objets, []);
  const compte = await purgeExpiredPhotos(essai.admin, { dryRun: true, now: maintenant });
  assert.equal(compte.overdueObjects, 2);
  assert.equal(compte.expiredObjects, 3);

  const reel = fauxAdmin(objets, []);
  const rapport = await purgeExpiredPhotos(reel.admin, { dryRun: false, now: maintenant });
  assert.equal(rapport.overdueObjects, 2, "compté au début du passage, avant les suppressions");
  assert.deepEqual(reel.etat.objets.map((o) => o.path), ["u3/a3/tag.jpg"]);
});
