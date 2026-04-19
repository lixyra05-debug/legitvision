import { renderEmailShell, EMAIL_TOKENS, escapeHtml } from "./base-template";

type PaymentConfirmationArgs = {
  name: string;
  planLabel: string;
  amountLabel: string;
  creditsAfter: number | null;
  dashboardUrl: string;
  purchaseDate?: Date;
};

export function renderPaymentConfirmationEmail({
  name,
  planLabel,
  amountLabel,
  creditsAfter,
  dashboardUrl,
  purchaseDate = new Date(),
}: PaymentConfirmationArgs): string {
  const { TEXT, MUTED, ACCENT, BORDER } = EMAIL_TOKENS;
  const safeName = escapeHtml(name || "à toi");
  const safePlan = escapeHtml(planLabel);
  const safeAmount = escapeHtml(amountLabel);
  const safeDashboard = escapeHtml(dashboardUrl);
  const dateLabel = purchaseDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const creditsLine =
    creditsAfter !== null
      ? `<tr><td style="padding:10px 0;border-top:1px solid ${BORDER};color:${MUTED};font-size:14px;">Crédits disponibles</td><td align="right" style="padding:10px 0;border-top:1px solid ${BORDER};color:${TEXT};font-size:14px;font-weight:600;">${creditsAfter}</td></tr>`
      : "";

  const body = `
<h1 style="margin:0 0 16px 0;color:${TEXT};font-size:28px;line-height:1.25;font-weight:700;letter-spacing:-0.02em;">
  Merci pour votre achat, ${safeName} !
</h1>
<p style="margin:0 0 24px 0;color:${MUTED};font-size:15px;line-height:1.7;">
  Votre paiement a bien été enregistré. Voici le récapitulatif :
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0;">
  <tr>
    <td style="padding:10px 0;color:${MUTED};font-size:14px;">Plan</td>
    <td align="right" style="padding:10px 0;color:${TEXT};font-size:14px;font-weight:600;">${safePlan}</td>
  </tr>
  <tr>
    <td style="padding:10px 0;border-top:1px solid ${BORDER};color:${MUTED};font-size:14px;">Montant</td>
    <td align="right" style="padding:10px 0;border-top:1px solid ${BORDER};color:${TEXT};font-size:14px;font-weight:600;">${safeAmount}</td>
  </tr>
  <tr>
    <td style="padding:10px 0;border-top:1px solid ${BORDER};color:${MUTED};font-size:14px;">Date</td>
    <td align="right" style="padding:10px 0;border-top:1px solid ${BORDER};color:${TEXT};font-size:14px;font-weight:600;">${dateLabel}</td>
  </tr>
  ${creditsLine}
</table>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0;">
  <tr>
    <td style="background:${ACCENT};border-radius:10px;">
      <a href="${safeDashboard}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;">
        Lancer une analyse
      </a>
    </td>
  </tr>
</table>
<p style="margin:0;color:${MUTED};font-size:13px;line-height:1.7;">
  Une facture détaillée vous est envoyée séparément par Stripe.
</p>`;

  return renderEmailShell({
    title: "Confirmation de paiement — LegitVision",
    preheader: `Votre paiement de ${amountLabel} pour ${planLabel} est confirmé.`,
    bodyHtml: body,
  });
}
