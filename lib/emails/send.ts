import { Resend } from "resend";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

type SendResult = { ok: boolean; id?: string; error?: string };

// Domaine vérifié chez Resend (SPF + DKIM sur legitvision.app), donc envoi vers
// n'importe quel destinataire — et non plus vers la seule adresse du compte Resend
// comme le permettait le domaine de test onboarding@resend.dev.
const FROM = "LegitVision <contact@legitvision.app>";

/**
 * Envoi d'un email transactionnel via Resend.
 *
 * Contrat critique — un email ne doit JAMAIS bloquer un paiement / une analyse :
 *  - Ne throw JAMAIS : toute erreur (réseau, API, clé absente) est attrapée,
 *    loggée, et renvoyée sous forme { ok: false }. L'appelant continue normalement.
 *  - Si RESEND_API_KEY est absent (dev local sans clé) : warning + skip propre,
 *    aucun crash.
 *  - Le client Resend est instancié À L'EXÉCUTION (après le check de la clé),
 *    jamais au build / à l'import du module.
 *
 * Le reste de l'app ne doit jamais importer directement un provider ;
 * toute modif du provider passe par ce fichier.
 */
export async function sendTransactionalEmail(
  args: SendArgs,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[emails] RESEND_API_KEY absent — envoi ignoré", {
      to: args.to,
      subject: args.subject,
    });
    return { ok: false, error: "RESEND_API_KEY manquant" };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: args.to,
      subject: args.subject,
      html: args.html,
      replyTo: args.replyTo,
    });

    if (error) {
      console.error("[emails] Resend a renvoyé une erreur:", error);
      return { ok: false, error: error.message };
    }

    return { ok: true, id: data?.id };
  } catch (err) {
    // Filet de sécurité : exception inattendue (réseau, SDK). Jamais de throw qui remonte.
    console.error("[emails] Échec d'envoi (exception):", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erreur inconnue",
    };
  }
}
