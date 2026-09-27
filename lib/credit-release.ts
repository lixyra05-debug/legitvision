import type { createAdminClient } from "@/lib/supabase/admin";

type AdminClient = Pick<ReturnType<typeof createAdminClient>, "from">;

/** Nombre d'essais de la mise à jour conditionnelle avant d'abandonner (et de journaliser). */
const MAX_ESSAIS = 5;

/** Tentatives de remboursement, espacées de PAUSE_MS : une panne brève de la base ne coûte pas un crédit au client. */
const TENTATIVES_REMBOURSEMENT = 3;
const PAUSE_MS = 1000;

/**
 * Issue d'un ajustement du solde :
 * - `solde` : écrit, voici le nouveau solde ;
 * - « lecture » ou « conflit » : RIEN n'a été écrit, on peut réessayer ;
 * - « ecriture » : la mise à jour a renvoyé une erreur, elle a pu être
 *   appliquée quand même (réponse perdue) : ne JAMAIS la rejouer ;
 * - « annulee » : la base a répondu sans appliquer la valeur demandée (un
 *   déclencheur l'a remise) : la rejouer donnerait le même résultat.
 */
type Ajustement = { solde: number } | { echec: "lecture" | "conflit" | "ecriture" | "annulee" };

async function ajusterSolde(admin: AdminClient, userId: string, delta: number): Promise<Ajustement> {
  for (let essai = 0; essai < MAX_ESSAIS; essai++) {
    const { data: profil, error: profilError } = await admin
      .from("profiles")
      .select("credits_remaining")
      .eq("id", userId)
      .single();
    if (profilError || !profil) return { echec: "lecture" };

    const solde = (profil as { credits_remaining: number }).credits_remaining;
    const { data: maj, error: majError } = await admin
      .from("profiles")
      .update({ credits_remaining: solde + delta })
      .eq("id", userId)
      .eq("credits_remaining", solde)
      .select("id, credits_remaining");
    if (majError) return { echec: "ecriture" };
    if (maj && maj.length > 0) {
      const ecrit = (maj[0] as { credits_remaining: number }).credits_remaining;
      return ecrit === solde + delta ? { solde: ecrit } : { echec: "annulee" };
    }
  }
  return { echec: "conflit" };
}

/**
 * Issue d'un ajout de crédits, vue de l'appelant :
 * - `balance` : ajouté, voici le nouveau solde ;
 * - "not_written" : rien n'a été ajouté, l'opération peut être relancée ;
 * - "unknown" : l'écriture a pu passer malgré l'erreur reçue : la relancer
 *   risquerait d'ajouter deux fois. À vérifier à la main.
 */
export type CreditAdjustment = { balance: number } | { failure: "not_written" | "unknown" };

/**
 * Ajoute `delta` crédits au solde par mise à jour conditionnelle (compare-and-set
 * sur la valeur lue) : un débit ou un achat concurrent n'est jamais écrasé ; en
 * cas de conflit, on relit et on recommence. La valeur relue après écriture doit
 * être celle demandée.
 */
export async function adjustCreditsAtomically(
  admin: AdminClient,
  userId: string,
  delta: number
): Promise<CreditAdjustment> {
  const issue = await ajusterSolde(admin, userId, delta);
  if ("solde" in issue) return { balance: issue.solde };
  return { failure: issue.echec === "ecriture" ? "unknown" : "not_written" };
}

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Issue d'un remboursement :
 * - "released" : le crédit est rendu ;
 * - "not_released" : rien n'a été rendu (base injoignable, solde remis en
 *   arrière par la base, ou délai écoulé) : crédit à rendre à la main ;
 * - "uncertain" : l'écriture a pu passer malgré l'erreur reçue : vérifier le
 *   solde avant de rendre quoi que ce soit.
 */
export type ReleaseOutcome = "released" | "not_released" | "uncertain";

/**
 * Rend le crédit réservé par UN lancement d'analyse qui n'est pas décompté :
 * photos jugées insuffisantes par l'IA, ou échec de l'analyse (erreur, délai
 * dépassé, rapport non enregistré). Depuis le 27/09, la route réserve le
 * crédit AVANT l'appel au modèle (course au débit) ; ce remboursement rétablit
 * la règle des CGU.
 *
 * Sans fonction SQL dédiée (à venir avec une migration) :
 * - la mise à jour du solde est conditionnelle (compare-and-set sur la valeur
 *   lue) : un débit ou un achat concurrent ne peut pas être écrasé ;
 * - jusqu'à TENTATIVES_REMBOURSEMENT tentatives, seulement tant que rien n'a pu
 *   être écrit, et jamais au-delà de `deadline` : une écriture dont la réponse
 *   s'est perdue n'est jamais rejouée (elle rendrait le crédit deux fois) ;
 * - la ligne « refund » cite la réservation (`reservation`, la description de
 *   la ligne « usage » de ce lancement) : le rapprochement se fait lancement
 *   par lancement.
 *
 * Appelée UNIQUEMENT par la requête qui a elle-même réservé le crédit, une
 * fois au plus : jamais sur la foi d'un statut d'analyse, qu'un utilisateur
 * peut modifier.
 */
export async function releaseReservedCredit(
  admin: AdminClient,
  launch: { userId: string; analysisId: string; reservation: string },
  motif: string,
  options: { pauseMs?: number; deadline?: number } = {}
): Promise<ReleaseOutcome> {
  const pauseMs = options.pauseMs ?? PAUSE_MS;
  const { userId, analysisId, reservation } = launch;

  for (let tentative = 1; tentative <= TENTATIVES_REMBOURSEMENT; tentative++) {
    if (tentative > 1) {
      if (options.deadline !== undefined && Date.now() + pauseMs >= options.deadline) break;
      await pause(pauseMs);
    }

    const issue = await ajusterSolde(admin, userId, 1);
    if ("echec" in issue) {
      if (issue.echec === "lecture" || issue.echec === "conflit") continue;
      console.error("[credits] remboursement non abouti", { analysisId, echec: issue.echec });
      return issue.echec === "ecriture" ? "uncertain" : "not_released";
    }

    const { error: journalError } = await admin.from("credits_transactions").insert({
      user_id: userId,
      type: "refund",
      amount: 1,
      balance_after: issue.solde,
      description: `Crédit rendu — ${motif} — ${reservation}`,
      analysis_id: analysisId,
    });
    if (journalError) {
      // Le crédit est rendu ; seule la trace manque. À rapprocher à la main.
      console.error("[credits] crédit rendu mais non journalisé", { analysisId });
    }
    return "released";
  }

  console.error("[credits] remboursement impossible (base injoignable ou délai écoulé)", { analysisId });
  return "not_released";
}
