import type { SupabaseClient } from "@supabase/supabase-js";
import { staleCutoffs, staleKind } from "@/lib/analysis-limits";

/**
 * Reprise des analyses abandonnées, à la lecture (rapport, tableau de bord).
 *
 * - Restée « analyzing » au-delà de ANALYSIS_STALE_AFTER_SECONDS : la fonction
 *   a été coupée avant d'écrire l'échec.
 * - Restée « uploading » au-delà de UPLOAD_STALE_AFTER_SECONDS : le client est
 *   parti pendant l'envoi des photos, l'analyse n'a jamais été lancée.
 * - Restée « pending » au-delà de LAUNCH_STALE_AFTER_SECONDS : photos envoyées,
 *   mais la demande de lancement n'est jamais arrivée à la route.
 *
 * Toutes passent à « failed » par une mise à jour CONDITIONNELLE (même
 * propriétaire, même statut, updated_at toujours ancien) : si la route a
 * réservé l'analyse ou enregistré le rapport entre-temps, le statut a changé
 * et rien n'est écrit. Inversement, la route ne réserve qu'une analyse encore
 * « uploading » ou « pending » : une analyse passée ici à « failed » n'est
 * plus lancée.
 *
 * Ce chemin n'écrit que le statut : il ne débite ni ne rembourse. Depuis le
 * 27/09, /api/analyze réserve le crédit AVANT l'appel au modèle et le rend
 * elle-même en cas d'échec ; une analyse passée ici à « failed » pendant que
 * la route tourne encore n'est plus enregistrée (mise à jour conditionnelle),
 * et la route rend alors le crédit. Seul cas non couvert : une fonction coupée
 * net après la réservation. Sa ligne « usage » ne porte ni remboursement (ligne
 * « refund » qui la cite) ni mention ajoutée par la route (« rapport
 * enregistré », « crédit à rendre »…) : crédit à rendre à la main, jusqu'à la
 * migration qui confiera réservation et remboursement à la base. Jamais de
 * remboursement sur la foi du statut : l'utilisateur peut le modifier.
 *
 * Renvoie les identifiants effectivement passés à « failed ».
 */
export async function expireStaleAnalyses(
  admin: SupabaseClient,
  userId: string,
  rows: ReadonlyArray<{ id: string; status: string; updated_at: string }>,
  now: number = Date.now(),
): Promise<Set<string>> {
  const cutoffs = staleCutoffs(now);
  // Une mise à jour par statut, chacune avec son propre seuil.
  const byStatus: Record<"analyzing" | "uploading" | "pending", { before: string; ids: string[] }> = {
    analyzing: { before: cutoffs.analyzingBefore, ids: [] },
    uploading: { before: cutoffs.uploadingBefore, ids: [] },
    pending: { before: cutoffs.pendingBefore, ids: [] },
  };
  for (const row of rows) {
    if (staleKind(row.status, row.updated_at, now) === null) continue;
    if (row.status === "analyzing" || row.status === "uploading" || row.status === "pending") {
      byStatus[row.status].ids.push(row.id);
    }
  }

  const expired = new Set<string>();
  const updates = Object.entries(byStatus)
    .filter(([, { ids }]) => ids.length > 0)
    .map(([status, { before, ids }]) =>
      admin
        .from("analyses")
        .update({ status: "failed" })
        .eq("user_id", userId)
        .in("id", ids)
        .eq("status", status)
        .lt("updated_at", before)
        .select("id"),
    );
  if (updates.length === 0) return expired;

  for (const { data, error } of await Promise.all(updates)) {
    if (error) {
      console.error("[analysis-stale] reprise impossible :", error.message);
      continue;
    }
    for (const row of (data ?? []) as Array<{ id: string }>) expired.add(row.id);
  }
  if (expired.size > 0) {
    // « analyzing » : la fonction a été coupée, peut-être après la réservation
    // du crédit. Identifiants journalisés pour le rapprochement.
    const coupees = byStatus.analyzing.ids.filter((id) => expired.has(id));
    console.warn(
      `[analysis-stale] ${expired.size} analyse(s) abandonnée(s) passée(s) à « failed ».`,
      coupees.length > 0 ? { reservationAVerifier: coupees } : "",
    );
  }
  return expired;
}
