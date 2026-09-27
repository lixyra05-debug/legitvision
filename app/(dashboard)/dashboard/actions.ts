"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isOwnPhotoPath } from "@/lib/photo-path";

/** Statuts d'analyses qu'on autorise à supprimer (bloquées/échouées) */
const DELETABLE_STATUSES = ["failed", "uploading", "pending"] as const;

export async function deleteAnalysis(analysisId: string) {
  // 1. Vérifier auth
  const supabase = await createClient();
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
    .eq("analysis_id", analysisId)
    .eq("user_id", user.id);

  // 5. Supprimer les fichiers du Storage (best effort). Le chemin est écrit par
  //    le navigateur et la suppression passe par la clé serveur : seuls les
  //    fichiers du dossier de CETTE analyse sont supprimés (lib/photo-path.ts),
  //    jamais la photo d'un autre utilisateur.
  const paths = (photos ?? [])
    .map((p: { storage_path: unknown }) => p.storage_path)
    .filter((path): path is string => isOwnPhotoPath(path, user.id, analysisId));
  if (paths.length > 0) {
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
