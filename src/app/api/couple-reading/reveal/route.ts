import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL;

export async function POST(req: Request) {
  try {
    const { sessionId, a, b, focus } = await req.json();

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'missing_session_id' }, { status: 400 });
    }

    if (!a?.name || !a?.birthDate || !a?.sign || !b?.name || !b?.birthDate || !b?.sign) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'not_paid' }, { status: 403 });
    }

    const base = (SITE_URL || req.headers.get('origin') || '').replace(/\/$/, '');
    if (!base) {
      return NextResponse.json({ error: 'missing_site_url' }, { status: 500 });
    }

    // Chama engine (sem salvar em banco por enquanto)
    const engineRes = await fetch(`${base}/api/couple-engine`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a, b, focus }),
    });

    const engineData = await engineRes.json();
    if (!engineRes.ok || !engineData?.success) {
      return NextResponse.json({ error: 'engine_failed' }, { status: 500 });
    }

    return NextResponse.json({
      content: {
        titulo: engineData.titulo,
        leitura: engineData.leitura,
        provider: engineData.provider,
      },
    });
  } catch (e) {
    console.error('[couple-reading/reveal] Error', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
