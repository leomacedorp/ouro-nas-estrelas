import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';

export const runtime = 'nodejs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL;

export async function POST(req: Request) {
  const stripe = getStripe();

  const sig = (await headers()).get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'missing_signature_or_secret' }, { status: 400 });
  }

  const body = await req.text();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('[Stripe webhook] Invalid signature', err?.message);
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;

      const supabase = createAdminClient();
      const sessionId = session.id as string;
      const customerEmail = session.customer_details?.email || session.customer_email || null;

      // Idempotent upsert by session_id
      await supabase
        .from('stripe_purchases')
        .upsert(
          {
            session_id: sessionId,
            customer_email: customerEmail,
            payment_status: session.payment_status,
            amount_total: session.amount_total ?? null,
            currency: session.currency ?? null,
            raw: session,
          },
          { onConflict: 'session_id' }
        );

      // Optional email: payment confirmed, instruct to open success page (sign selection)
      if (customerEmail && SITE_URL) {
        const url = `${SITE_URL.replace(/\/$/, '')}/leitura-premium/sucesso?session_id=${sessionId}`;
        await sendEmail({
          to: customerEmail,
          subject: 'Pagamento confirmado — escolha seu signo ✨',
          html: `
            <div style="font-family:Arial,sans-serif;line-height:1.5">
              <h2>Pagamento confirmado</h2>
              <p>Para revelar sua Leitura Premium, acesse:</p>
              <p><a href="${url}">${url}</a></p>
            </div>
          `,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[Stripe webhook] Handler error', err);
    return NextResponse.json({ error: 'handler_error' }, { status: 500 });
  }
}
