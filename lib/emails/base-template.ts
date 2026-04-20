type ShellOptions = {
  title: string;
  preheader: string;
  bodyHtml: string;
  footerHtml?: string;
};

const BRAND_BG = "#0A0A0B";
const CARD_BG = "#141416";
const TEXT = "#FAFAFA";
const MUTED = "#A1A1AA";
const ACCENT = "#10B981";
const BORDER = "rgba(255,255,255,0.06)";
const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif";

const DEFAULT_FOOTER = `
<p style="margin:0 0 8px 0;color:${MUTED};font-size:12px;line-height:1.6;">
  LegitVision — Authentification d'articles de luxe par IA.
</p>
<p style="margin:0;color:${MUTED};font-size:12px;line-height:1.6;">
  Contact : <a href="mailto:legitvision.contact@gmail.com" style="color:${ACCENT};text-decoration:none;">legitvision.contact@gmail.com</a>
</p>
`;

export function renderEmailShell({
  title,
  preheader,
  bodyHtml,
  footerHtml,
}: ShellOptions): string {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    @media (max-width: 620px) {
      .container { width: 100% !important; padding: 0 16px !important; }
      .card { padding: 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${BRAND_BG};color:${TEXT};font-family:${FONT_STACK};">
  <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND_BG};padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;">
          <tr>
            <td style="padding:0 0 24px 0;" align="left">
              <img src="https://legitvision.vercel.app/images/legitvision-logo.svg" alt="LegitVision" height="48" style="height:48px;width:auto;display:block;border:0;outline:none;text-decoration:none;" />
            </td>
          </tr>
          <tr>
            <td class="card" style="background:${CARD_BG};border:1px solid ${BORDER};border-radius:16px;padding:40px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 8px 0 8px;">
              ${footerHtml ?? DEFAULT_FOOTER}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const EMAIL_TOKENS = {
  BRAND_BG,
  CARD_BG,
  TEXT,
  MUTED,
  ACCENT,
  BORDER,
  FONT_STACK,
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export { escapeHtml };
