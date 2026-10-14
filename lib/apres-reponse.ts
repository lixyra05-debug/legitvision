import { after } from "next/server";

/**
 * Remet `tache` à après l'envoi de la réponse : `after` de Next, que Vercel
 * garde en vie (waitUntil) jusqu'à la fin de la tâche, dans la limite de la
 * durée maximale de la fonction. Pour un travail qui ne doit ni retarder ni
 * empêcher la réponse au client, comme l'enregistrement d'une mesure.
 *
 * `tache` traite ses propres erreurs. apresReponse ne lève jamais : hors d'une
 * requête Next (tests, scripts), `after` lève, et la tâche part aussitôt,
 * sans être attendue.
 */
export function apresReponse(tache: () => Promise<void>): void {
  try {
    after(tache);
  } catch {
    console.warn("[apres-reponse] after indisponible : tâche lancée sans attente");
    Promise.resolve()
      .then(tache)
      .catch((erreur: unknown) => console.warn("[apres-reponse] tâche en échec", erreur));
  }
}
