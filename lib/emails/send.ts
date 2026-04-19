type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

type SendResult = { ok: boolean; id?: string; error?: string };

/**
 * Envoi d'email transactionnel. STUB actuel : log console + return ok.
 *
 * Pour brancher Resend : importer @resend/node, lire process.env.RESEND_API_KEY,
 * remplacer le stub par resend.emails.send({ from, to, subject, html }).
 * Le reste de l'app ne doit jamais importer directement un provider ;
 * toute modif du provider passe par ce fichier.
 */
export async function sendTransactionalEmail(
  args: SendArgs,
): Promise<SendResult> {
  if (!process.env.EMAIL_PROVIDER) {
    console.info("[emails] stub send", {
      to: args.to,
      subject: args.subject,
      htmlBytes: args.html.length,
    });
    return { ok: true };
  }

  // TODO: brancher Resend/Brevo quand EMAIL_PROVIDER est défini.
  return { ok: false, error: "Provider email non implémenté" };
}
