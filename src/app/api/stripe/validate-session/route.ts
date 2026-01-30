import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ valid: false, error: 'missing_session_id' }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer_details'],
    });

    const paid = session.payment_status === 'paid';

    return NextResponse.json({
      valid: paid,
      payment_status: session.payment_status,
      mode: session.mode,
      customer_email: session.customer_details?.email || session.customer_email || null,
      amount_total: session.amount_total ?? null,
      currency: session.currency ?? null,
    });
  } catch (err: any) {
    console.error('[Stripe validate-session] Error', err);
    return NextResponse.json({ valid: false, error: 'server_error' }, { status: 500 });
  }
}
