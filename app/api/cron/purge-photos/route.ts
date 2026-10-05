import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { escapeHtml } from "@/lib/emails/base-template";
import { sendTransactionalEmail } from "@/lib/emails/send";
import { purgeExpiredPhotos, type PurgeReport } from "@/lib/purge-photos";
import { PHOTO_RETENTION_DAYS } from "@/lib/site-facts";

/**
 * Purge des photos d'analyse (lib/purge-photos.ts), appelée toutes les 6 heures
 * par Vercel Cron (vercel.json) avec « Authorization: Bearer $CRON_SECRET ».
 * Sans CRON_SECRET configuré, la route refuse tout appel et le journalise.
 * `?dry=1` compte ce qui serait supprimé, sans rien supprimer ni rien signaler.
 *
 * Un passage manqué ne se voit pas de lui-même : Vercel ne relance pas un
 * passage en échec, et un déclenchement perdu ne laisse aucun journal. D'où
 * deux signaux :
 * - alerte par e-mail (PURGE_ALERT_EMAIL, sinon l'adresse de contact du site)
 *   quand un passage échoue, ou quand il trouve une photo déjà plus vieille
 *   que PHOTO_RETENTION_DAYS (overdueObjects) : la durée promise est dépassée ;
 * - battement après chaque passage réussi, envoyé à PURGE_HEARTBEAT_URL :
 *   l'adresse d'une sonde externe réglée sur 6 h avec 1 h de grâce, qui
 *   prévient si aucun battement n'arrive en 7 h. C'est le seul signal d'un
 *   passage qui n'a pas eu lieu (déploiement coupé, cron désactivé,
 *   déclenchement perdu, CRON_SECRET absent). Sans cette variable, aucun
 *   battement n'est envoyé.
 */

/** PURGE_RUN_MAX_SECONDS (lib/purge-photos.ts) : la marge de la purge en dépend. */
export const maxDuration = 300;

/** Destinataire des alertes sans PURGE_ALERT_EMAIL : l'adresse de contact du site. */
const ALERT_EMAIL_DEFAULT = "legitvision.contact@gmail.com";

/** Le battement ne doit pas retenir le passage. */
const HEARTBEAT_TIMEOUT_MS = 10_000;

const LOGS = "journaux Vercel, requestPath:/api/cron/purge-photos";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[purge-photos] CRON_SECRET absent : appel refusé, aucune photo n'est purgée");
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  if (!isAuthorized(request.headers.get("authorization"), secret)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get("dry") === "1";
  const startedAt = new Date();
  let report: PurgeReport;
  try {
    report = await purgeExpiredPhotos(createAdminClient(), { dryRun, now: startedAt });
  } catch (error) {
    console.error("[purge-photos] passage interrompu :", error);
    if (!dryRun) {
      await sendAlert("passage interrompu", [
        `Le passage de la purge des photos lancé le ${startedAt.toISOString()} a échoué. Vercel ne le relance pas : le prochain passage est celui du programme.`,
        `Un second échec consécutif dépasserait la marge : une photo pourrait être gardée plus de ${PHOTO_RETENTION_DAYS} jours.`,
        `Détail : ${LOGS}.`,
      ]);
    }
    return NextResponse.json({ error: "Purge interrompue" }, { status: 500 });
  }

  console.info("[purge-photos]", JSON.stringify(report));
  if (!dryRun) {
    if (report.overdueObjects > 0) {
      console.error(
        `[purge-photos] ${report.overdueObjects} photo(s) avaient plus de ${PHOTO_RETENTION_DAYS} jours au début du passage`,
      );
      await sendAlert(`photos gardées plus de ${PHOTO_RETENTION_DAYS} jours`, [
        `Au début du passage lancé le ${startedAt.toISOString()}, ${report.overdueObjects} photo(s) avaient plus de ${PHOTO_RETENTION_DAYS} jours : la durée promise par la politique de confidentialité (rubrique 4) est dépassée pour elles. Ce passage les a supprimées.`,
        `Cause probable : des passages manqués. À vérifier : la liste des crons du projet et les ${LOGS}.`,
      ]);
    }
    await sendHeartbeat();
  }
  return NextResponse.json(report);
}

function isAuthorized(header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(header);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

/** Alerte par e-mail ; sendTransactionalEmail ne lève jamais d'erreur. */
async function sendAlert(subject: string, paragraphs: string[]): Promise<void> {
  const result = await sendTransactionalEmail({
    to: process.env.PURGE_ALERT_EMAIL || ALERT_EMAIL_DEFAULT,
    subject: `[LegitVision] Purge des photos : ${subject}`,
    html: paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n"),
  });
  if (!result.ok) console.error("[purge-photos] alerte non envoyée :", result.error);
}

/** Battement d'un passage réussi. Son adresse peut porter un jeton : elle n'est jamais journalisée. */
async function sendHeartbeat(): Promise<void> {
  const url = process.env.PURGE_HEARTBEAT_URL;
  if (!url) return;
  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(HEARTBEAT_TIMEOUT_MS) });
    if (!response.ok) console.error("[purge-photos] battement refusé par la sonde :", response.status);
  } catch (error) {
    console.error("[purge-photos] battement non envoyé :", error instanceof Error ? error.name : typeof error);
  }
}
