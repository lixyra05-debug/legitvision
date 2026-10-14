// Tient lieu des actions serveur du tableau de bord dans le navigateur des
// tests (« use server » n'existe que dans Next) : rien n'est supprimé.
export async function deleteAnalysis(analysisId: string): Promise<void> {
  void analysisId;
}
