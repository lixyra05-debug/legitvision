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
 * Aucun débit n'est possible ici ni après : ce chemin n'écrit que le statut ;
 * le débit (decrement_credits_atomic) n'est appelé que par /api/analyze, et
 * seulement après avoir enregistré le rapport sur une analyse encore
 * « analyzing » (mise à jour conditionnelle, voir la route). Une analyse passée
 * ici à « failed » ne peut donc plus être enregistrée ni débitée.
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
    console.warn(
      `[analysis-stale] ${expired.size} analyse(s) abandonnée(s) passée(s) à « failed », sans débit.`,
    );
  }
  return expired;
}
