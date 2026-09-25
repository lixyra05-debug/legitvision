import type { SupabaseClient } from "@supabase/supabase-js";
import { PHOTO_RETENTION_DAYS } from "@/lib/site-facts";

/**
 * Purge des photos d'analyse : aucune photo n'est gardée plus de
 * PHOTO_RETENTION_DAYS jours après son envoi, que l'analyse ait abouti ou non
 * (politique de confidentialité, rubrique 4). Le rapport n'affiche aucune
 * photo : il reste intact.
 *
 * Lancée une fois par jour par Vercel Cron (vercel.json). Sur l'offre Hobby,
 * l'heure n'est tenue qu'à 59 minutes près : deux passages peuvent être
 * espacés de 25 heures. Chaque passage supprime donc tout ce qui dépasserait
 * la durée avant le suivant, soit ce qui a plus de PHOTO_RETENTION_DAYS jours
 * moins 25 heures.
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

/** Écart maximal entre deux passages quotidiens : 24 h + 59 min, arrondi. */
const MAX_HOURS_BETWEEN_RUNS = 25;

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

export function purgeCutoff(now: Date = new Date()): Date {
  const hours = PHOTO_RETENTION_DAYS * 24 - MAX_HOURS_BETWEEN_RUNS;
  return new Date(now.getTime() - hours * 3_600_000);
}

export async function purgeExpiredPhotos(
  admin: SupabaseClient,
  { dryRun, now = new Date() }: { dryRun: boolean; now?: Date }
): Promise<PurgeReport> {
  const cutoff = purgeCutoff(now);
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
