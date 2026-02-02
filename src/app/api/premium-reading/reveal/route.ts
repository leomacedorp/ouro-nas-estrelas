import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { generatePremiumHoroscope } from '@/lib/localPremiumTemplate';
import { sendEmail } from '@/lib/email/resend';

export const runtime = 'nodejs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL;

export async function POST(req: Request) {
  try {
    const { sessionId, signSlug, name, birthDate, mode } = await req.json();
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'missing_session_id' }, { status: 400 });
    }
    if (!signSlug || typeof signSlug !== 'string') {
      return NextResponse.json({ error: 'missing_sign' }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer_details'],
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'not_paid' }, { status: 403 });
    }

    const dateKey = new Date().toISOString().split('T')[0];
    const supabase = createAdminClient();

    // If already generated for this session/sign/date, return it.
    const { data: existing } = await supabase
      .from('premium_readings')
      .select('*')
      .eq('session_id', sessionId)
      .eq('sign_slug', signSlug)
      .eq('date_key', dateKey)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ readingId: existing.id, accessToken: existing.access_token, content: existing.content });
    }

    // --- Engine Simbólica (preferida) ---
    // Se o cliente informar nome + data de nascimento, tentamos gerar uma leitura premium personalizada.
    // Caso falhe, caímos no template local (nunca fica sem entrega).

    const accessToken = crypto.randomUUID();
    const customerEmail = session.customer_details?.email || session.customer_email || null;

    let result: any = null;

    const hasUserData = typeof name === 'string' && name.trim().length > 1 && typeof birthDate === 'string' && birthDate.trim().length >= 8;

    if (hasUserData) {
      try {
        const base = (SITE_URL || req.headers.get('origin') || '').replace(/\/$/, '');
        if (base) {
          const engineRes = await fetch(`${base}/api/premium-engine`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              birthDate,
              sign: signSlug,
              mode: mode === 'full' ? 'full' : 'short'
            })
          });

          const engineData = await engineRes.json();
          if (engineRes.ok && engineData?.success && (engineData?.leitura || engineData?.titulo)) {
            result = {
              titulo: engineData.titulo || 'Sua Leitura Premium',
              leitura: engineData.leitura || '',
              provider: engineData.provider || 'premium-engine'
            };
          }
        }
      } catch (e) {
        console.warn('[premium-reading/reveal] premium-engine failed, falling back to local template');
      }
    }

    // Fallback local (compatibilidade com UI antiga)
    if (!result) {
      result = generatePremiumHoroscope(signSlug, dateKey);
    }

    const { data: inserted, error } = await supabase
      .from('premium_readings')
      .insert({
        session_id: sessionId,
        sign_slug: signSlug,
        date_key: dateKey,
        content: result,
        access_token: accessToken,
        customer_email: customerEmail,
      })
      .select('*')
      .single();

    if (error) throw error;

    // Email delivery (optional): link with access token
    if (customerEmail && SITE_URL) {
      const url = `${SITE_URL.replace(/\/$/, '')}/minha-leitura/${inserted.id}?t=${accessToken}`;
      await sendEmail({
        to: customerEmail,
        subject: 'Sua Leitura Premium está pronta ✨',
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.5">
            <h2>Sua Leitura Premium está pronta</h2>
            <p>Você pode acessar sua leitura aqui:</p>
            <p><a href="${url}">${url}</a></p>
            <p>Se precisar de ajuda, responda este email.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ readingId: inserted.id, accessToken, content: inserted.content });
  } catch (err: any) {
    console.error('[premium-reading/reveal] Error', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
