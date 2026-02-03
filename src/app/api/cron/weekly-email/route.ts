import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';
import { getAstronomicalContext, getAstronomyDescription } from '@/lib/astronomy';
import { getUniversalDayMessage } from '@/lib/numerology';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || 'https://www.ouronasestrelas.com.br';

// Gera conteúdo da semana usando dados astronômicos REAIS
function getWeeklyTransitContent() {
    const today = new Date();

    // Dados astronômicos reais
    const astroContext = getAstronomicalContext(today);
    const astroDescription = getAstronomyDescription(astroContext);
    const dayNumber = getUniversalDayMessage(today);

    // Gerar título baseado no contexto real
    let title = `${astroContext.moonPhase.name} em ${astroContext.moonSign.signName}`;

    // Adicionar alerta de retrógrado se houver
    const mercuryRetro = astroContext.retrogrades.find(r => r.planet === 'Mercúrio');
    if (mercuryRetro) {
        title += ' — Mercúrio Retrógrado';
    }

    // Montar highlights
    const highlights: string[] = [
        `${astroContext.moonPhase.emoji} ${astroContext.moonPhase.name}: ${astroContext.moonPhase.advice}`,
        `🌙 Lua em ${astroContext.moonSign.signName}: ${astroContext.moonSign.emotionalEnergy}`,
    ];

    if (astroContext.retrogrades.length > 0) {
        const retroNames = astroContext.retrogrades.map(r => `${r.symbol} ${r.planet}`).join(', ');
        highlights.push(`🔄 Planetas em revisão: ${retroNames}`);
    }

    highlights.push(`🔢 Número do dia: ${dayNumber.number} — ${dayNumber.theme}`);

    return {
        title,
        description: astroDescription,
        highlights,
        moonPhase: astroContext.moonPhase,
        moonSign: astroContext.moonSign,
        retrogrades: astroContext.retrogrades,
        dayNumber
    };
}

// Template do email com dados astronômicos reais
function generateEmailHTML(transit: ReturnType<typeof getWeeklyTransitContent>, email: string): string {
    const unsubscribeUrl = `${SITE_URL}/api/newsletter?action=unsubscribe&email=${encodeURIComponent(email)}`;

    const highlightHTML = transit.highlights
        .map(h => `<li style="margin-bottom: 10px; color: #cbd5e1;">${h}</li>`)
        .join('');

    const retroHTML = transit.retrogrades.length > 0
        ? `
            <div style="background: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; padding: 15px 20px; border-radius: 0 8px 8px 0; margin-top: 20px;">
                <p style="color: #fca5a5; font-size: 14px; margin: 0 0 8px 0; font-weight: bold;">
                    ⚠️ Planetas Retrógrados Ativos
                </p>
                <p style="color: #cbd5e1; font-size: 13px; margin: 0;">
                    ${transit.retrogrades.map(r => `${r.symbol} ${r.planet}: ${r.advice}`).join('<br>')}
                </p>
            </div>
        `
        : '';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0f0a1f; font-family: Georgia, serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4af37; font-size: 28px; margin: 0;">✨ Ouro Nas Estrelas</h1>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Boletim Astral Semanal</p>
        </div>
        
        <!-- Moon Phase Visual -->
        <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 48px;">${transit.moonPhase.emoji}</span>
        </div>
        
        <!-- Main Content -->
        <div style="background: linear-gradient(135deg, #1e1b4b 0%, #0f0a1f 100%); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 16px; padding: 30px;">
            <h2 style="color: #e2e8f0; font-size: 22px; margin: 0 0 20px 0; text-align: center;">
                ${transit.title}
            </h2>
            
            <p style="color: #cbd5e1; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
                ${transit.description}
            </p>
            
            <!-- Highlights -->
            <div style="background: rgba(212, 175, 55, 0.1); border-radius: 8px; padding: 20px; margin-top: 20px;">
                <p style="color: #d4af37; font-size: 14px; margin: 0 0 15px 0; font-weight: bold;">
                    📍 Destaques da Semana
                </p>
                <ul style="margin: 0; padding-left: 20px; list-style-type: none;">
                    ${highlightHTML}
                </ul>
            </div>
            
            ${retroHTML}
        </div>
        
        <!-- CTA -->
        <div style="text-align: center; margin-top: 30px;">
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 15px;">
                Quer uma análise personalizada para você?
            </p>
            <a href="${SITE_URL}/leitura-premium" 
               style="display: inline-block; background: linear-gradient(135deg, #d4af37, #b8860b); color: #0f0a1f; font-weight: bold; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px;">
                Ver Minha Leitura Premium
            </a>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
                Você recebeu este email porque se inscreveu no Boletim Astral.
            </p>
            <p style="color: #64748b; font-size: 12px; margin: 8px 0 0 0;">
                <a href="${unsubscribeUrl}" style="color: #64748b;">Descadastrar</a>
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

export async function GET(req: Request) {
    // Verificar autorização via header OU query parameter
    const authHeader = req.headers.get('authorization');
    const url = new URL(req.url);
    const querySecret = url.searchParams.get('secret');
    const cronSecret = process.env.CRON_SECRET;

    // Aceita: Bearer token no header OU ?secret= na URL OU sem CRON_SECRET definido
    const isAuthorized =
        !cronSecret ||
        cronSecret.length === 0 ||
        authHeader === `Bearer ${cronSecret}` ||
        querySecret === cronSecret;

    if (!isAuthorized) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const supabase = createAdminClient();

        // Buscar assinantes ativos
        const { data: subscribers, error } = await supabase
            .from('newsletter_subscribers')
            .select('id, email')
            .eq('is_active', true);

        if (error) {
            console.error('[Weekly Email] Supabase error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        if (!subscribers || subscribers.length === 0) {
            return NextResponse.json({ message: 'No active subscribers', sent: 0 });
        }

        // Gerar conteúdo com dados astronômicos REAIS
        const transit = getWeeklyTransitContent();

        console.log(`[Weekly Email] Sending: ${transit.title}`);
        console.log(`[Weekly Email] Subscribers: ${subscribers.length}`);

        // Enviar emails
        let sentCount = 0;
        let errorCount = 0;

        for (const subscriber of subscribers) {
            try {
                const html = generateEmailHTML(transit, subscriber.email);

                await sendEmail({
                    to: subscriber.email,
                    subject: `✨ ${transit.title} — Boletim Astral`,
                    html
                });

                await supabase
                    .from('newsletter_subscribers')
                    .update({ last_email_sent_at: new Date().toISOString() })
                    .eq('id', subscriber.id);

                sentCount++;

                // Rate limit protection
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (emailError) {
                console.error(`[Weekly Email] Failed: ${subscriber.email}`, emailError);
                errorCount++;
            }
        }

        console.log(`[Weekly Email] Done. Sent: ${sentCount}, Errors: ${errorCount}`);

        return NextResponse.json({
            success: true,
            transit: transit.title,
            moonPhase: transit.moonPhase.name,
            moonSign: transit.moonSign.signName,
            retrogrades: transit.retrogrades.map(r => r.planet),
            sent: sentCount,
            errors: errorCount,
            total: subscribers.length
        });

    } catch (error) {
        console.error('[Weekly Email] Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
