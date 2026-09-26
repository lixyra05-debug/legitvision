/**
 * Durées de l'analyse : SOURCE UNIQUE côté code.
 *
 * La route /api/analyze est synchrone (décision d'Hector, 2026-09-26 : la
 * version asynchrone viendra avec la refonte du rapport). Ces valeurs bornent
 * chaque étape : l'appel au modèle, la fonction Vercel, l'attente du client,
 * la reprise des analyses bloquées. Le client, le rapport et le tableau de
 * bord les lisent ici ; aucune n'est réécrite ailleurs.
 *
 * Seule exception, imposée par Next et Vercel : `maxDuration` doit être une
 * valeur littérale dans app/api/analyze/route.ts et dans vercel.json. Le test
 * tests/unit/analysis-limits.test.ts échoue si l'une d'elles diverge de
 * ANALYSIS_MAX_SECONDS.
 *
 * Aucune de ces valeurs n'est une mesure : ce sont des limites choisies. La
 * durée MÉDIANE affichée, elle, est mesurée et vit dans lib/site-facts.ts.
 */

/**
 * Durée maximale de la fonction /api/analyze. Offre Vercel Hobby avec Fluid
 * Compute (relevé du 2026-09-26) : 300 s au plus (vercel.com/docs/functions/
 * limitations#max-duration). Au-delà, Vercel coupe la fonction et renvoie 504.
 */
export const ANALYSIS_MAX_SECONDS = 300;

/**
 * Marge de fin. L'appel au modèle est interrompu à ANALYSIS_MAX_SECONDS moins
 * cette marge après le début de la requête, pour laisser le temps, avant la
 * coupure de la plateforme :
 * - au démarrage à froid de la fonction, compté par Vercel mais pas par
 *   l'horloge de la route (quelques secondes) ;
 * - à l'enregistrement du rapport, au débit et à la réponse, ou à
 *   l'enregistrement de l'échec (fonctions à iad1, base à eu-west-1 : chaque
 *   écriture traverse l'Atlantique).
 * 30 s couvrent largement ces étapes, qui prennent environ une seconde
 * (mesure du 2026-09-24 : 0,4 s entre l'enregistrement et le débit).
 */
export const ANALYSIS_END_MARGIN_SECONDS = 30;

/**
 * Marge avant de déclarer bloquée une analyse restée « analyzing ». La route
 * passe l'analyse à « analyzing » après son propre démarrage : ANALYSIS_MAX_SECONDS
 * après ce passage, Vercel l'a forcément arrêtée. La marge ne couvre donc que
 * l'écart d'horloge entre la base (updated_at) et le serveur qui lit, de
 * l'ordre de la seconde (horloges synchronisées par NTP) : 30 s le couvrent
 * largement. Une marge trop courte ne coûterait rien au client : la route
 * n'enregistre ni ne débite une analyse qui n'est plus « analyzing ».
 */
export const ANALYSIS_STALE_MARGIN_SECONDS = 30;

/** Analyse « analyzing » sans mise à jour depuis ce délai : bloquée, traitée en échec. */
export const ANALYSIS_STALE_AFTER_SECONDS =
  ANALYSIS_MAX_SECONDS + ANALYSIS_STALE_MARGIN_SECONDS;

/**
 * Analyse restée « uploading » : le client crée l'analyse, envoie les photos
 * une par une, la passe à « pending », puis lance la route. S'il part pendant
 * l'envoi, l'analyse n'est jamais lancée. Le seuil doit laisser finir un envoi
 * lent mais légitime : 11 photos au plus (protocole le plus long) de 10 Mo au
 * plus (PhotoUploader), soit 110 Mo, prennent environ 29 min à 0,5 Mbit/s.
 * D'où 30 min depuis la création de l'analyse.
 */
export const UPLOAD_STALE_AFTER_SECONDS = 30 * 60;

/**
 * Analyse restée « pending » : toutes les photos sont envoyées et le client a
 * demandé le lancement (check/new passe l'analyse à « pending » juste avant
 * d'appeler la route). La route la réserve (« analyzing ») en quelques
 * secondes : démarrage à froid, limitation de débit bornée à 500 ms
 * (lib/rate-limit.ts), puis six lectures en base. Restée « pending » 2 min
 * plus tard, la demande n'est jamais arrivée (connexion coupée au moment du
 * lancement) : l'analyse ne démarrera pas. Si la demande arrivait malgré tout
 * après ce seuil : une fois l'analyse classée « failed » par sa page, la route
 * refuse de la réserver (409) et rien n'est débité ; avant, elle se déroule
 * normalement.
 */
export const LAUNCH_STALE_AFTER_SECONDS = 2 * 60;

/**
 * Délai côté client pour la requête d'analyse : un peu au-delà du maximum de
 * la fonction, pour que la réponse de la route (ou le 504 de Vercel) arrive
 * toujours avant l'abandon du client.
 */
export const ANALYSIS_CLIENT_TIMEOUT_SECONDS = ANALYSIS_MAX_SECONDS + 30;

/** Rafraîchissement du rapport tant que l'analyse n'est pas terminée. */
export const REPORT_REFRESH_SECONDS = 5;

/**
 * Borne ANNONCÉE au client, en minutes entières : le rapport, ou l'échec sans
 * débit, s'affiche sur la page de l'analyse au plus tard ce délai après la fin
 * de l'envoi des photos (la réservation par la route suit cet envoi). Pire cas : la fonction est coupée sans écrire l'échec (l'échéance
 * interne ne borne que l'appel au modèle) ; l'analyse est alors reprise
 * au-delà de ANALYSIS_STALE_AFTER_SECONDS, au rafraîchissement suivant de sa
 * page. Un lancement perdu (LAUNCH_STALE_AFTER_SECONDS) s'affiche plus tôt.
 * Arrondi à la minute supérieure : 330 s + 5 s donnent 6 minutes, soit 25 s
 * de marge pour le trajet de la demande et les lectures avant la réservation.
 * Ce n'est pas une mesure : c'est la conséquence des limites ci-dessus.
 */
export const ANALYSIS_OUTCOME_MAX_MINUTES = Math.ceil(
  (Math.max(ANALYSIS_STALE_AFTER_SECONDS, LAUNCH_STALE_AFTER_SECONDS) +
    REPORT_REFRESH_SECONDS) /
    60,
);

/**
 * Échéance de l'appel au modèle, en millisecondes depuis l'époque, pour une
 * requête commencée à `requestStartedAt` (Date.now() au début de la route).
 */
export function analysisModelDeadline(requestStartedAt: number): number {
  return (
    requestStartedAt +
    (ANALYSIS_MAX_SECONDS - ANALYSIS_END_MARGIN_SECONDS) * 1000
  );
}

/**
 * Pourquoi une analyse non terminée est considérée comme abandonnée :
 * - "timed_out" : restée « analyzing » au-delà de ANALYSIS_STALE_AFTER_SECONDS
 *   (fonction coupée avant d'avoir écrit l'échec) ;
 * - "not_started" : restée « uploading » au-delà de UPLOAD_STALE_AFTER_SECONDS
 *   (client parti pendant l'envoi des photos), ou « pending » au-delà de
 *   LAUNCH_STALE_AFTER_SECONDS (demande de lancement jamais arrivée).
 * Dans tous les cas, rien n'a été débité : le débit suit l'enregistrement du
 * rapport, qui n'a pas eu lieu.
 */
export type StaleKind = "timed_out" | "not_started";

/** Statuts d'une analyse pas encore lancée par la route. */
export const NOT_STARTED_STATUSES = ["uploading", "pending"] as const;

/** Seuil de reprise propre à chaque statut non terminé, en secondes. */
function staleAfterSeconds(status: string): number | null {
  switch (status) {
    case "analyzing":
      return ANALYSIS_STALE_AFTER_SECONDS;
    case "uploading":
      return UPLOAD_STALE_AFTER_SECONDS;
    case "pending":
      return LAUNCH_STALE_AFTER_SECONDS;
    default:
      return null;
  }
}

/** Limites de fraîcheur, en ISO 8601, à comparer à `analyses.updated_at`. */
export function staleCutoffs(now: number): {
  analyzingBefore: string;
  uploadingBefore: string;
  pendingBefore: string;
} {
  const before = (seconds: number) => new Date(now - seconds * 1000).toISOString();
  return {
    analyzingBefore: before(ANALYSIS_STALE_AFTER_SECONDS),
    uploadingBefore: before(UPLOAD_STALE_AFTER_SECONDS),
    pendingBefore: before(LAUNCH_STALE_AFTER_SECONDS),
  };
}

/**
 * Classe une analyse d'après son statut et sa dernière mise à jour. Renvoie
 * null si elle est terminée, ou encore dans les temps.
 */
export function staleKind(
  status: string,
  updatedAt: string,
  now: number,
): StaleKind | null {
  const updated = Date.parse(updatedAt);
  const threshold = staleAfterSeconds(status);
  if (Number.isNaN(updated) || threshold === null) return null;
  if (now - updated <= threshold * 1000) return null;
  return status === "analyzing" ? "timed_out" : "not_started";
}
