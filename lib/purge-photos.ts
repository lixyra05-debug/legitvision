import type { SupabaseClient } from "@supabase/supabase-js";
import { PHOTO_RETENTION_DAYS } from "@/lib/site-facts";

/**
 * Purge des photos d'analyse : aucune photo n'est gardée plus de
 * PHOTO_RETENTION_DAYS jours après son envoi, que l'analyse ait abouti ou non
 * (politique de confidentialité, rubrique 4). Le rapport n'affiche aucune
 * photo : il reste intact.
 *
 * Lancée toutes les 6 heures par Vercel Cron (vercel.json, PURGE_SCHEDULE :
 * 0 h, 6 h, 12 h et 18 h UTC). Chaque passage supprime ce qui a plus de
 * PHOTO_RETENTION_DAYS jours moins PURGE_MARGIN_HOURS. La marge couvre le pire
 * délai entre deux passages réussis quand UN passage échoue entre les deux
 * (celui du 2026-10-03 a échoué : base injoignable) : aucune photo ne dépasse
 * alors la durée. Calcul, d'après la documentation de Vercel relue le
 * 2026-10-05 :
 * - offre Pro : un cron part « within the minute specified » ; « 5 8 * * * »
 *   part entre 08:05:00 et 08:05:59, soit moins de 60 s après l'heure prévue
 *   (vercel.com/docs/cron-jobs/manage-cron-jobs, « Cron jobs accuracy ») ;
 * - un passage en échec n'est pas relancé (« Vercel will not retry an
 *   invocation if a cron job fails »), et un déclenchement peut se perdre
 *   sans laisser de journal (« Cron job delivery is best effort ») ;
 * - un passage dure au plus 300 s : maxDuration de la route (300 s, la valeur
 *   par défaut avec Fluid compute, vercel.com/docs/functions/limitations).
 * Si un passage échoue, le suivant part moins de 2 × 6 h + 60 s après le
 * dernier passage réussi, et finit au plus 300 s plus tard : 12 h 6 min.
 * Arrondi à l'heure supérieure : 13 h. Chaque passage supprime donc ce qui a
 * plus de 29 jours et 11 heures ; au pire, une photo est supprimée à
 * 29 jours, 23 heures et 6 minutes. La marge tiendrait jusqu'à 3 540 s de
 * passage : même à 1 800 s (maximum étendu de l'offre Pro, en bêta, au-delà
 * des 800 s du maximum ordinaire).
 *
 * Deux échecs consécutifs ou plus, ou un cron qui ne part plus (déploiement
 * coupé, cron désactivé, CRON_SECRET absent), dépassent la marge : la route
 * (app/api/cron/purge-photos/route.ts) le rend visible. Elle envoie une alerte
 * par e-mail quand un passage lève une erreur ou trouve une photo déjà plus
 * vieille que PHOTO_RETENTION_DAYS (overdueObjects), et signale chaque passage
 * réussi à une sonde externe (PURGE_HEARTBEAT_URL), qui prévient si les
 * signaux s'arrêtent. Un passage coupé à PURGE_RUN_MAX_SECONDS n'envoie ni
 * l'un ni l'autre : rien ici ne borne la durée des appels à Supabase, et seul
 * l'arrêt des battements le signale.
 *
 * Sur l'offre Hobby, ce programme fait échouer le déploiement : elle n'admet
 * qu'un passage par jour, à 59 minutes près.
 *
 * Deux sources, parce qu'une photo peut exister dans l'une sans l'autre :
 * - le bucket, parcouru en entier : un fichier sans ligne en base (compte
 *   supprimé, envoi interrompu) serait sinon gardé indéfiniment ;
 * - la table analysis_photos : une ligne dont le fichier est supprimé n'a plus
 *   d'objet, et /api/analyze refuse proprement une analyse sans photo.
 *
 * Fichiers d'abord, lignes ensuite ; une erreur arrête le passage, le suivant
 * reprend là où il s'est arrêté.
 */

const BUCKET = "analysis-photos";

/**
 * Programme du cron. Vercel le lit dans vercel.json, où il doit figurer en
 * clair : tests/unit/purge-photos.test.ts échoue si les deux divergent.
 */
export const PURGE_SCHEDULE = "0 */6 * * *";

/** Heures entre deux passages prévus. */
export const PURGE_INTERVAL_HOURS = 6;

/** Passages consécutifs qui peuvent échouer sans qu'une photo dépasse la durée. */
export const PURGE_TOLERATED_FAILED_RUNS = 1;

/**
 * Retard d'un déclenchement sur l'offre Pro, en borne : il part dans la minute
 * prévue, donc moins de 60 s après l'heure.
 */
export const PURGE_TRIGGER_DELAY_SECONDS = 60;

/**
 * Durée maximale d'un passage : le maxDuration de la route, qui doit valoir
 * autant (tests/unit/purge-photos.test.ts le vérifie).
 */
export const PURGE_RUN_MAX_SECONDS = 300;

/**
 * Marge, en heures entières : délai maximal entre le dernier passage réussi
 * et la fin du suivant, quand PURGE_TOLERATED_FAILED_RUNS passages échouent
 * entre les deux. 2 × 6 h + 60 s + 300 s, arrondi à l'heure supérieure : 13 h.
 */
export const PURGE_MARGIN_HOURS = Math.ceil(
  ((PURGE_TOLERATED_FAILED_RUNS + 1) * PURGE_INTERVAL_HOURS * 3600 +
    PURGE_TRIGGER_DELAY_SECONDS +
    PURGE_RUN_MAX_SECONDS) /
    3600,
);

/** Taille des pages de listage et des lots de suppression. */
const BATCH_SIZE = 100;

/** Dossiers listés en parallèle. */
const LIST_CONCURRENCY = 8;

type StoredPhoto = { path: string; writtenAt: number; size: number };
type PhotoRow = { id: string; analysis_id: string; storage_path: string; created_at: string };

/** Comptes seulement : aucun chemin ni identifiant, le rapport part dans les logs. */
export type PurgeReport = {
  dryRun: boolean;
  /** Tout fichier écrit avant cet instant est supprimé. */
  cutoff: string;
  bucketObjects: number;
  /**
   * Fichiers déjà plus vieux que PHOTO_RETENTION_DAYS au début du passage :
   * la durée promise est dépassée pour eux (passages manqués). Le passage les
   * supprime, et la route envoie une alerte s'il y en a.
   */
  overdueObjects: number;
  expiredObjects: number;
  expiredBytes: number;
  /** Jours (UTC) du plus ancien et du plus récent fichier expiré. */
  oldestExpired: string | null;
  newestExpired: string | null;
  /** Fichiers expirés qu'aucune ligne analysis_photos ne référence. */
  orphanObjects: number;
  rows: number;
  /** Lignes dont le fichier est expiré ou déjà absent du bucket. */
  expiredRows: number;
  rowsWithoutObject: number;
  analysesConcerned: number;
  deletedObjects: number;
  deletedRows: number;
};

/** Tout fichier écrit avant cet instant est supprimé : 30 jours moins la marge. */
export function purgeCutoff(now: Date = new Date()): Date {
  const hours = PHOTO_RETENTION_DAYS * 24 - PURGE_MARGIN_HOURS;
  return new Date(now.getTime() - hours * 3_600_000);
}

export async function purgeExpiredPhotos(
  admin: SupabaseClient,
  { dryRun, now = new Date() }: { dryRun: boolean; now?: Date }
): Promise<PurgeReport> {
  const cutoff = purgeCutoff(now);
  const promised = now.getTime() - PHOTO_RETENTION_DAYS * 24 * 3_600_000;
  const [objects, rows] = await Promise.all([listBucket(admin), listPhotoRows(admin)]);

  const expired = objects.filter((o) => o.writtenAt < cutoff.getTime());
  const freshPaths = new Set(objects.filter((o) => o.writtenAt >= cutoff.getTime()).map((o) => o.path));
  const allPaths = new Set(objects.map((o) => o.path));
  const rowPaths = new Set(rows.map((r) => r.storage_path));

  // Une ligne suit son fichier : elle part s'il est expiré ou déjà absent.
  // Le délai compte depuis l'envoi du fichier ; la date de la ligne sert de
  // garde-fou si un envoi est encore en cours au moment du passage.
  const expiredRows = rows.filter(
    (r) => !freshPaths.has(r.storage_path) && Date.parse(r.created_at) < cutoff.getTime()
  );
  const days = expired.map((o) => new Date(o.writtenAt).toISOString().slice(0, 10)).sort();

  const report: PurgeReport = {
    dryRun,
    cutoff: cutoff.toISOString(),
    bucketObjects: objects.length,
    overdueObjects: objects.filter((o) => o.writtenAt < promised).length,
    expiredObjects: expired.length,
    expiredBytes: expired.reduce((sum, o) => sum + o.size, 0),
    oldestExpired: days[0] ?? null,
    newestExpired: days[days.length - 1] ?? null,
    orphanObjects: expired.filter((o) => !rowPaths.has(o.path)).length,
    rows: rows.length,
    expiredRows: expiredRows.length,
    rowsWithoutObject: expiredRows.filter((r) => !allPaths.has(r.storage_path)).length,
    analysesConcerned: new Set(expiredRows.map((r) => r.analysis_id)).size,
    deletedObjects: 0,
    deletedRows: 0,
  };
  if (dryRun) return report;

  for (const paths of chunk(expired.map((o) => o.path), BATCH_SIZE)) {
    const { data, error } = await admin.storage.from(BUCKET).remove(paths);
    if (error) throw new Error(`Suppression dans le stockage interrompue : ${error.message}`);
    report.deletedObjects += data.length;
  }
  for (const ids of chunk(expiredRows.map((r) => r.id), BATCH_SIZE)) {
    const { error, count } = await admin.from("analysis_photos").delete({ count: "exact" }).in("id", ids);
    if (error) throw new Error(`Suppression des lignes interrompue : ${error.message}`);
    report.deletedRows += count ?? 0;
  }
  return report;
}

/** Tous les fichiers du bucket, dossier par dossier ({user_id}/{analysis_id}/…). */
async function listBucket(admin: SupabaseClient): Promise<StoredPhoto[]> {
  const files: StoredPhoto[] = [];
  const pending = [""];
  while (pending.length > 0) {
    const folders = pending.splice(0, LIST_CONCURRENCY);
    for (const listed of await Promise.all(folders.map((f) => listFolder(admin, f)))) {
      files.push(...listed.files);
      pending.push(...listed.folders);
    }
  }
  return files;
}

async function listFolder(
  admin: SupabaseClient,
  folder: string
): Promise<{ files: StoredPhoto[]; folders: string[] }> {
  const files: StoredPhoto[] = [];
  const folders: string[] = [];
  for (let offset = 0; ; offset += BATCH_SIZE) {
    const { data, error } = await admin.storage
      .from(BUCKET)
      .list(folder, { limit: BATCH_SIZE, offset, sortBy: { column: "name", order: "asc" } });
    if (error) throw new Error(`Listage du stockage impossible : ${error.message}`);
    for (const item of data) {
      const path = folder ? `${folder}/${item.name}` : item.name;
      if (item.id === null) {
        folders.push(path);
      } else {
        // Un fichier remplacé compte depuis son dernier envoi.
        const stamps = [item.created_at, item.updated_at]
          .map((d) => Date.parse(d ?? ""))
          .filter((t) => !Number.isNaN(t));
        if (stamps.length === 0) throw new Error("Date d'envoi illisible dans le stockage");
        files.push({ path, writtenAt: Math.max(...stamps), size: Number(item.metadata?.size ?? 0) });
      }
    }
    if (data.length < BATCH_SIZE) return { files, folders };
  }
}

async function listPhotoRows(admin: SupabaseClient): Promise<PhotoRow[]> {
  const rows: PhotoRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await admin
      .from("analysis_photos")
      .select("id, analysis_id, storage_path, created_at")
      .order("id")
      .range(from, from + 999);
    if (error) throw new Error(`Lecture de analysis_photos impossible : ${error.message}`);
    rows.push(...(data as PhotoRow[]));
    if (data.length < 1000) return rows;
  }
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
