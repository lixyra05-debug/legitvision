/**
 * Coût IA de chaque appel au modèle de l'analyse : sa mesure, et la ligne
 * enregistrée dans public.analysis_costs (migration 020), table fermée aux
 * utilisateurs. Jamais affiché, jamais renvoyé au navigateur.
 *
 * - mesurerCoutIa : lit `usage` sur la réponse du modèle et calcule le coût au
 *   tarif de lib/ai/tarifs.ts. Ne lève jamais : une analyse ne doit pas
 *   échouer à cause de son compteur.
 * - coutIaNonMesure : requête partie puis perdue sans réponse lisible
 *   (échéance, connexion perdue). Elle a pu être facturée ; sa consommation
 *   est inconnue.
 * - rattacherCoutIa / coutIaDe : une erreur levée après la réponse du modèle
 *   emporte le coût de l'appel, sans changer de classe, de code ni de message.
 * - ligneCoutIa : la ligne à insérer, avec l'issue de l'analyse.
 *
 * Fonctions pures, sans réseau. /api/analyze insère la ligne après la réponse
 * au client.
 */
import { TARIFS } from "./tarifs";

/** Issue de l'analyse (colonne outcome) : rapport enregistré, photos insuffisantes, échec. */
export type IssueCoutIa = "report" | "insufficient" | "failed";

/**
 * Coût d'un appel au modèle : les colonnes de public.analysis_costs connues
 * dès sa réponse, ou dès sa coupure. Jetons : entiers positifs ou nuls.
 */
export type CoutIa = {
  /** Modèle qui a répondu (response.model) ; le modèle demandé si l'appel a été coupé. */
  model: string;
  /** Identifiant de la requête chez Anthropic (en-tête request-id). */
  request_id: string | null;
  /**
   * false : consommation inconnue, jetons et coût nuls. Requête partie sans
   * réponse lisible (échéance, connexion perdue), ou `usage` illisible
   * (jamais observé).
   */
  measured: boolean;
  /** Entrée hors cache : texte, photos, invite système ajoutée par la réflexion. */
  input_tokens: number | null;
  /** Sortie facturée, réflexion comprise. */
  output_tokens: number | null;
  /** Part de la réflexion, DÉJÀ comptée dans output_tokens (jamais ajoutée) ; nulle si non fournie. */
  thinking_tokens: number | null;
  cache_write_5m_tokens: number | null;
  cache_write_1h_tokens: number | null;
  cache_read_tokens: number | null;
  /** Région de l'inférence (usage.inference_geo), nulle si absente ou illisible : « us » coûte 1,1 fois plus. */
  inference_geo: string | null;
  /**
   * Tarif catalogue, hors taxes, arrondi au millionième de dollar. Nul si la
   * consommation est inconnue, ou si le modèle ou la région (illisible
   * comprise) n'a pas de tarif relevé dans lib/ai/tarifs.ts.
   */
  cost_usd: number | null;
  /** Date du relevé des tarifs appliqués (TARIFS.releve_le) ; nulle sans coût. */
  price_list_date: string | null;
  stop_reason: string | null;
};

/** Ligne insérée dans public.analysis_costs (id et created_at : valeurs par défaut de la table). */
export type LigneCoutIa = CoutIa & {
  analysis_id: string;
  outcome: IssueCoutIa;
  /** Code de l'échec (AnalysisError.code, ou « UNKNOWN ») ; nul si l'issue n'est pas « failed ». */
  failure_code: string | null;
};

/** Modèle d'une réponse qui ne le nomme pas (jamais observé) : aucun tarif ne s'y applique. */
export const MODELE_INCONNU = "inconnu";

/** Plafond d'une colonne integer : au-delà, l'insertion serait refusée. */
const ENTIER_MAX = 2_147_483_647;

/** Consommation inconnue : aucun jeton, aucun coût. */
const CONSOMMATION_INCONNUE = {
  measured: false,
  input_tokens: null,
  output_tokens: null,
  thinking_tokens: null,
  cache_write_5m_tokens: null,
  cache_write_1h_tokens: null,
  cache_read_tokens: null,
  cost_usd: null,
  price_list_date: null,
} as const;

function objet(valeur: unknown): Record<string, unknown> | null {
  return typeof valeur === "object" && valeur !== null && !Array.isArray(valeur)
    ? (valeur as Record<string, unknown>)
    : null;
}

function texte(valeur: unknown): string | null {
  return typeof valeur === "string" && valeur !== "" ? valeur : null;
}

/** Nombre de jetons valide : entier, positif ou nul, qui tient dans une colonne integer. */
function jetons(valeur: unknown): number | null {
  return typeof valeur === "number" && Number.isInteger(valeur) && valeur >= 0 && valeur <= ENTIER_MAX
    ? valeur
    : null;
}

/** Champ facultatif de `usage` : absent ou nul, 0 ; présent mais invalide, null (jamais compté à 0). */
function jetonsFacultatifs(valeur: unknown): number | null {
  return valeur === undefined || valeur === null ? 0 : jetons(valeur);
}

/**
 * Multiplicateur de la région d'inférence (usage.inference_geo, tel que reçu) :
 * « us » ×1,1 ; « global », ou champ absent ou nul, ×1. Toute autre valeur,
 * autre région ou valeur illisible (nombre, chaîne vide…), n'a pas de tarif
 * relevé : nul, jamais ×1 supposé.
 */
function multiplicateurGeo(geo: unknown): number | null {
  if (geo === undefined || geo === null || geo === "global") return 1;
  if (geo === "us") return TARIFS.multiplicateur_geo_us;
  return null;
}

/**
 * Écritures en cache [5 min, 1 h], ou null si elles sont illisibles.
 * `cache_creation` détaille `cache_creation_input_tokens` par durée. Sans ce
 * détail (absent ou nul), toute l'écriture est comptée au tarif 5 min. Avec
 * lui, ses deux champs doivent être valides et faire le total (absent ou nul :
 * 0) : sinon la consommation est inconnue, jamais une répartition supposée.
 */
function ecrituresEnCache(usage: Record<string, unknown> | null): [number, number] | null {
  const total = jetonsFacultatifs(usage?.cache_creation_input_tokens);
  if (total === null) return null;
  const brut = usage?.cache_creation;
  if (brut === undefined || brut === null) return [total, 0];
  const detail = objet(brut);
  const cinqMin = jetons(detail?.ephemeral_5m_input_tokens);
  const uneHeure = jetons(detail?.ephemeral_1h_input_tokens);
  return cinqMin !== null && uneHeure !== null && cinqMin + uneHeure === total ? [cinqMin, uneHeure] : null;
}

function mesurer(reponse: unknown): CoutIa {
  const r = objet(reponse);
  const usage = objet(r?.usage);
  const appel = {
    model: texte(r?.model) ?? MODELE_INCONNU,
    request_id: texte(r?._request_id),
    inference_geo: texte(usage?.inference_geo),
    stop_reason: texte(r?.stop_reason),
  };

  const entree = jetons(usage?.input_tokens);
  const sortie = jetons(usage?.output_tokens);
  // La requête de l'analyse ne pose aucun cache aujourd'hui : ces champs
  // valent 0, le calcul les prend quand même.
  const ecritures = ecrituresEnCache(usage);
  const cacheLecture = jetonsFacultatifs(usage?.cache_read_input_tokens);
  if (entree === null || sortie === null || ecritures === null || cacheLecture === null) {
    return { ...appel, ...CONSOMMATION_INCONNUE };
  }
  const [cache5Min, cache1H] = ecritures;
  // Non typé par le SDK 0.79 : lu avec des gardes. Déjà dans output_tokens.
  const reflexion = jetons(objet(usage?.output_tokens_details)?.thinking_tokens);

  const m = appel.model === TARIFS.modele ? multiplicateurGeo(usage?.inference_geo) : null;
  // USD par million de jetons × jetons = micro-dollars.
  const microUsd =
    entree * TARIFS.entree +
    sortie * TARIFS.sortie +
    cache5Min * TARIFS.cache_ecriture_5_min +
    cache1H * TARIFS.cache_ecriture_1_h +
    cacheLecture * TARIFS.cache_lecture;
  const coutUsd = m === null ? null : Math.round(m * microUsd) / 1_000_000;

  return {
    ...appel,
    measured: true,
    input_tokens: entree,
    output_tokens: sortie,
    thinking_tokens: reflexion,
    cache_write_5m_tokens: cache5Min,
    cache_write_1h_tokens: cache1H,
    cache_read_tokens: cacheLecture,
    cost_usd: coutUsd,
    price_list_date: coutUsd === null ? null : TARIFS.releve_le,
  };
}

/**
 * Coût de l'appel d'après la réponse du modèle (`model`, `usage`,
 * `stop_reason`, `_request_id`). Tout est vérifié, rien n'est supposé : un
 * `usage` absent ou malformé donne une consommation inconnue. Ne lève jamais.
 */
export function mesurerCoutIa(reponse: unknown): CoutIa {
  try {
    return mesurer(reponse);
  } catch {
    return { model: MODELE_INCONNU, request_id: null, inference_geo: null, stop_reason: null, ...CONSOMMATION_INCONNUE };
  }
}

/**
 * Requête partie, puis perdue sans réponse lisible (coupée à l'échéance,
 * connexion perdue après l'envoi, corps de la réponse coupé) : pas d'usage.
 * Elle a pu être facturée ; elle est enregistrée comme non mesurée.
 */
export function coutIaNonMesure(model: string): CoutIa {
  return { model, request_id: null, inference_geo: null, stop_reason: null, ...CONSOMMATION_INCONNUE };
}

const coutsRattaches = new WeakMap<object, CoutIa>();

function cle(erreur: unknown): object | null {
  return (typeof erreur === "object" && erreur !== null) || typeof erreur === "function" ? erreur : null;
}

/**
 * Rattache à une erreur le coût de l'appel qui l'a précédée. L'erreur garde sa
 * classe, son code et son message (handleAnalysisError et les messages au
 * client ne changent pas) ; la route retrouve le coût par coutIaDe. Sans effet
 * sur une valeur levée qui n'est pas un objet.
 */
export function rattacherCoutIa(erreur: unknown, cout: CoutIa): void {
  const k = cle(erreur);
  if (k !== null) coutsRattaches.set(k, cout);
}

/**
 * Coût rattaché à cette erreur ; null si aucune requête n'est partie avant
 * elle, ou si chaque tentative a reçu une erreur HTTP du service (non facturée).
 */
export function coutIaDe(erreur: unknown): CoutIa | null {
  const k = cle(erreur);
  return k === null ? null : (coutsRattaches.get(k) ?? null);
}

/**
 * Ligne de public.analysis_costs pour cet appel : exactement les colonnes de
 * la table, rien de plus. Le code d'échec n'est gardé que pour l'issue « failed ».
 */
export function ligneCoutIa(
  cout: CoutIa,
  analysisId: string,
  outcome: IssueCoutIa,
  codeEchec: string | null = null,
): LigneCoutIa {
  return {
    analysis_id: analysisId,
    model: cout.model,
    request_id: cout.request_id,
    measured: cout.measured,
    input_tokens: cout.input_tokens,
    output_tokens: cout.output_tokens,
    thinking_tokens: cout.thinking_tokens,
    cache_write_5m_tokens: cout.cache_write_5m_tokens,
    cache_write_1h_tokens: cout.cache_write_1h_tokens,
    cache_read_tokens: cout.cache_read_tokens,
    inference_geo: cout.inference_geo,
    cost_usd: cout.cost_usd,
    price_list_date: cout.price_list_date,
    stop_reason: cout.stop_reason,
    outcome,
    failure_code: outcome === "failed" ? codeEchec : null,
  };
}
