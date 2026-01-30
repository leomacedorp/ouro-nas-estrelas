import { Resend } from 'resend';

export type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'Ouro nas Estrelas <contato@ouronasestrelas.com.br>';

  if (!apiKey) {
    // Email is optional in dev; skip silently.
    console.warn('[Email] RESEND_API_KEY not set; skipping email send.');
    return { skipped: true } as const;
  }

  const resend = new Resend(apiKey);

  const result = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  return result;
}
