"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/** Statuts d'analyses qu'on autorise à supprimer (bloquées/échouées) */
const DELETABLE_STATUSES = ["failed", "uploading", "pending"] as const;

export async function deleteAnalysis(analysisId: string) {
  // 1. Vérifier auth
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const admin = createAdminClient();

  // 2. Récupérer l'analyse (ownership check)
  const { data: analysis } = await admin
    .from("analyses")
    .select("id, user_id, status")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();

  if (!analysis) return; // Introuvable ou pas propriétaire

  // 3. Vérifier que le statut est supprimable
  if (!DELETABLE_STATUSES.includes(analysis.status as (typeof DELETABLE_STATUSES)[number])) {
    return; // Refuser silencieusement les statuts non autorisés
  }

  // 4. Récupérer les chemins des photos pour nettoyage Storage
  const { data: photos } = await admin
    .from("analysis_photos")
    .select("storage_path")
    .eq("analysis_id", analysisId);

  // 5. Supprimer les fichiers du Storage (best effort)
  if (photos && photos.length > 0) {
    const paths = photos.map((p: { storage_path: string }) => p.storage_path);
    await admin.storage.from("analysis-photos").remove(paths);
  }

  // 6. Supprimer l'analyse (CASCADE supprime analysis_photos)
  await admin
    .from("analyses")
    .delete()
    .eq("id", analysisId)
    .eq("user_id", user.id);

  // 7. Invalider le cache du dashboard
  revalidatePath("/dashboard");
}
