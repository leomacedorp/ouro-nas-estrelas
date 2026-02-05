import { NextResponse, NextRequest } from 'next/server';
import { sendEmail } from '@/lib/email/resend';
import { renderPremiumReadingEmailHtml, type PremiumReadingEmailData } from '@/lib/email/templates/premiumReadingEmail';

export const runtime = 'nodejs';

function isAuthorized(req: NextRequest) {
  const provided = req.nextUrl.searchParams.get('secret') || '';
  const expected = process.env.CRON_SECRET || process.env.ADMIN_SECRET || '';
  return Boolean(expected) && provided === expected;
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as { to?: string; subject?: string; data?: PremiumReadingEmailData };
    const to = body.to;
    const subject = body.subject || 'Sua Leitura Premium ✨';

    if (!to || typeof to !== 'string') {
      return NextResponse.json({ ok: false, error: 'missing_to' }, { status: 400 });
    }
    if (!body.data) {
      return NextResponse.json({ ok: false, error: 'missing_data' }, { status: 400 });
    }

    const html = renderPremiumReadingEmailHtml(body.data);

    const result = await sendEmail({
      to,
      subject,
      html,
    });

    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error('[admin/send-reading-email] Error', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
