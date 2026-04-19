import { renderEmailShell, EMAIL_TOKENS, escapeHtml } from "./base-template";

type WelcomeArgs = {
  name: string;
  confirmationUrl: string;
  unsubscribeUrl?: string;
};

export function renderWelcomeEmail({
  name,
  confirmationUrl,
  unsubscribeUrl,
}: WelcomeArgs): string {
  const { TEXT, MUTED, ACCENT } = EMAIL_TOKENS;
  const safeName = escapeHtml(name || "à toi");
  const safeUrl = escapeHtml(confirmationUrl);
  const safeUnsub = escapeHtml(unsubscribeUrl ?? "{{unsubscribe_url}}");

  const body = `
<h1 style="margin:0 0 16px 0;color:${TEXT};font-size:28px;line-height:1.25;font-weight:700;letter-spacing:-0.02em;">
  Bienvenue sur LegitVision, ${safeName} !
</h1>
<p style="margin:0 0 16px 0;color:${MUTED};font-size:15px;line-height:1.7;">
  Merci d'avoir rejoint LegitVision. Notre IA analyse vos articles de luxe
  (sneakers, sacs, vêtements) en moins de 30 secondes pour vous aider à
  éviter les contrefaçons avant d'acheter.
</p>
<p style="margin:0 0 32px 0;color:${MUTED};font-size:15px;line-height:1.7;">
  Confirmez votre email pour activer votre compte :
</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px 0;">
  <tr>
    <td style="background:${ACCENT};border-radius:10px;">
      <a href="${safeUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;">
        Confirmer mon email
      </a>
    </td>
  </tr>
</table>
<p style="margin:0;color:${MUTED};font-size:13px;line-height:1.7;">
  Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br/>
  <a href="${safeUrl}" style="color:${ACCENT};text-decoration:none;word-break:break-all;">${safeUrl}</a>
</p>`;

  const footer = `
<p style="margin:0 0 8px 0;color:${MUTED};font-size:12px;line-height:1.6;">
  Vous recevez cet email car vous avez créé un compte sur LegitVision.
</p>
<p style="margin:0;color:${MUTED};font-size:12px;line-height:1.6;">
  <a href="${safeUnsub}" style="color:${MUTED};text-decoration:underline;">Se désinscrire</a>
  &nbsp;•&nbsp;
  <a href="mailto:contact@legitvision.com" style="color:${ACCENT};text-decoration:none;">contact@legitvision.com</a>
</p>`;

  return renderEmailShell({
    title: "Bienvenue sur LegitVision",
    preheader: "Confirmez votre email pour activer votre compte LegitVision.",
    bodyHtml: body,
    footerHtml: footer,
  });
}
