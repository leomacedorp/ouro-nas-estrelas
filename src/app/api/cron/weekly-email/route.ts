import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';
import { getAstronomicalContext, getAstronomyDescription } from '@/lib/astronomy';
import { getUniversalDayMessage } from '@/lib/numerology';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || 'https://www.ouronasestrelas.com.br';

// Mensagens poéticas por fase lunar
const MOON_PHASE_MESSAGES: Record<string, { opening: string; guidance: string }> = {
    'Lua Nova': {
        opening: 'O céu se recolhe hoje em silêncio. A Lua Nova convida para dentro — é tempo de plantar sementes invisíveis, aquelas que só você sabe que existem.',
        guidance: 'Permita-se começar algo novo, mesmo que pequeno. O universo acolhe intenções sinceras.'
    },
    'Lua Crescente': {
        opening: 'A luz começa a retornar ao céu. O que foi plantado na escuridão agora pede movimento, ação consciente, passos firmes.',
        guidance: 'É hora de nutrir seus projetos e sonhos. Cada pequeno gesto importa.'
    },
    'Quarto Crescente': {
        opening: 'A Lua atinge seu primeiro desafio. Surgem obstáculos, decisões, momentos que pedem clareza e coragem.',
        guidance: 'Não recue diante das dificuldades. Elas são parte do caminho, não desvios.'
    },
    'Lua Cheia': {
        opening: 'A Lua brilha em sua plenitude, iluminando o que estava oculto. Emoções vêm à tona, verdades se revelam, ciclos se completam.',
        guidance: 'Observe o que se manifesta. Celebre conquistas, libere o que precisa partir.'
    },
    'Lua Disseminadora': {
        opening: 'Após o ápice, começa a partilha. O que foi aprendido pede para ser compartilhado, integrado, ensinado.',
        guidance: 'Generosidade é a palavra-chave. Doe conhecimento, tempo, presença.'
    },
    'Quarto Minguante': {
        opening: 'O céu pede desaceleração. É tempo de revisar, ajustar, soltar o que não serve mais.',
        guidance: 'Perdoe. Deixe ir. Faça espaço para o novo que virá.'
    },
    'Lua Minguante': {
        opening: 'A luz se recolhe gradualmente. O silêncio interior cresce, convidando para reflexão profunda.',
        guidance: 'Descanse. Sonhe. Prepare-se internamente para o próximo ciclo.'
    },
    'Lua Balsâmica': {
        opening: 'O ciclo chega ao fim. Há sabedoria em aceitar o que foi, agradecer as lições, e confiar no recomeço.',
        guidance: 'Entregue-se ao fluxo. A Lua Nova está próxima.'
    }
};

// Mensagens por signo lunar
const MOON_SIGN_MESSAGES: Record<string, string> = {
    'Áries': 'A energia emocional pulsa com força e urgência. Há coragem disponível para quem ousa agir.',
    'Touro': 'O coração busca segurança e prazer nos sentidos. Valorize o que é simples e verdadeiro.',
    'Gêmeos': 'A mente está ágil, curiosa, buscando conexões. As palavras fluem — escolha-as com cuidado.',
    'Câncer': 'As emoções correm profundas como marés. Acolha sua sensibilidade, ela é sua maior força.',
    'Leão': 'O coração pede expressão, reconhecimento, brilho. Permita-se ser visto.',
    'Virgem': 'Há um chamado para ordem, cuidado, serviço. Pequenos gestos constroem grandes transformações.',
    'Libra': 'A busca por harmonia guia as emoções. Relacionamentos pedem atenção e equilíbrio.',
    'Escorpião': 'Intensidade marca o clima emocional. Mergulhe fundo — a verdade está esperando.',
    'Sagitário': 'O espírito quer expansão, aventura, significado. Olhe além do horizonte conhecido.',
    'Capricórnio': 'Disciplina e responsabilidade são os temas. Construa com paciência, colherá com abundância.',
    'Aquário': 'Originalidade e desapego marcam o clima. Ouse ser diferente, o mundo precisa da sua visão.',
    'Peixes': 'A intuição está potente, os sonhos mais vívidos. Confie no que não pode ser explicado.'
};

// Gera conteúdo da semana com linguagem premium
function getWeeklyTransitContent() {
    const today = new Date();
    const astroContext = getAstronomicalContext(today);
    const dayNumber = getUniversalDayMessage(today);

    const moonPhaseName = astroContext.moonPhase.name;
    const moonSignName = astroContext.moonSign.signName;

    // Título poético
    let title = `${moonPhaseName} em ${moonSignName}`;
    const mercuryRetro = astroContext.retrogrades.find(r => r.planet === 'Mercúrio');
    if (mercuryRetro) {
        title += ' — Mercúrio Retrógrado';
    }

    // Descrição premium
    const phaseMessage = MOON_PHASE_MESSAGES[moonPhaseName] || MOON_PHASE_MESSAGES['Lua Nova'];
    const signMessage = MOON_SIGN_MESSAGES[moonSignName] || '';

    const description = `${phaseMessage.opening}\n\nCom a Lua transitando por ${moonSignName}, ${signMessage.toLowerCase()}\n\n${phaseMessage.guidance}`;

    // Mensagem sobre retrógrados
    let retroMessage = '';
    if (astroContext.retrogrades.length > 0) {
        const planets = astroContext.retrogrades.map(r => r.planet).join(' e ');
        retroMessage = `${planets} em movimento retrógrado convidam para revisão — não resistência. O que precisa ser reconsiderado na sua vida?`;
    }

    return {
        title,
        description,
        retroMessage,
        moonPhase: astroContext.moonPhase,
        moonSign: astroContext.moonSign,
        retrogrades: astroContext.retrogrades,
        dayNumber,
        guidance: phaseMessage.guidance
    };
}

// Template do email com linguagem premium
function generateEmailHTML(transit: ReturnType<typeof getWeeklyTransitContent>, email: string): string {
    const unsubscribeUrl = `${SITE_URL}/api/newsletter?action=unsubscribe&email=${encodeURIComponent(email)}`;

    // Formatar descrição com quebras de linha para HTML
    const descriptionHTML = transit.description.replace(/\n\n/g, '</p><p style="color: #cbd5e1; font-size: 16px; line-height: 1.9; margin: 0 0 16px 0;">');

    const retroHTML = transit.retroMessage
        ? `
            <div style="background: rgba(212, 175, 55, 0.08); border-left: 3px solid #d4af37; padding: 20px; margin-top: 25px; border-radius: 0 12px 12px 0;">
                <p style="color: #d4af37; font-size: 15px; margin: 0 0 10px 0; font-weight: 600;">
                    🔄 Momento de Revisão
                </p>
                <p style="color: #cbd5e1; font-size: 14px; line-height: 1.7; margin: 0; font-style: italic;">
                    ${transit.retroMessage}
                </p>
            </div>
        `
        : '';

    const guidanceHTML = transit.guidance
        ? `
            <div style="text-align: center; margin-top: 30px; padding-top: 25px; border-top: 1px solid rgba(212, 175, 55, 0.2);">
                <p style="color: #d4af37; font-size: 15px; margin: 0; font-style: italic;">
                    ✨ ${transit.guidance}
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
<body style="margin: 0; padding: 0; background-color: #0f0a1f; font-family: Georgia, 'Times New Roman', serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 35px;">
            <h1 style="color: #d4af37; font-size: 26px; margin: 0; font-weight: normal; letter-spacing: 1px;">✨ Ouro Nas Estrelas</h1>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 10px; letter-spacing: 2px; text-transform: uppercase;">Boletim Astral Semanal</p>
        </div>
        
        <!-- Moon Phase Visual -->
        <div style="text-align: center; margin-bottom: 25px;">
            <span style="font-size: 56px;">${transit.moonPhase.emoji}</span>
        </div>
        
        <!-- Main Content -->
        <div style="background: linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 10, 31, 0.9) 100%); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 20px; padding: 35px;">
            <h2 style="color: #e2e8f0; font-size: 24px; margin: 0 0 25px 0; text-align: center; font-weight: normal;">
                ${transit.title}
            </h2>
            
            <p style="color: #cbd5e1; font-size: 16px; line-height: 1.9; margin: 0 0 16px 0;">
                ${descriptionHTML}
            </p>
            
            ${retroHTML}
            ${guidanceHTML}
        </div>
        
        <!-- CTA -->
        <div style="text-align: center; margin-top: 35px;">
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 18px;">
                Quer uma leitura completa, feita especialmente para você?
            </p>
            <a href="${SITE_URL}/leitura-premium" 
               style="display: inline-block; background: linear-gradient(135deg, #d4af37, #b8860b); color: #0f0a1f; font-weight: 600; padding: 16px 36px; border-radius: 10px; text-decoration: none; font-size: 15px; letter-spacing: 0.5px;">
                Descobrir Minha Leitura Premium
            </a>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 45px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.08);">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
                Você recebeu este email porque se inscreveu no Boletim Astral.
            </p>
            <p style="color: #64748b; font-size: 12px; margin: 10px 0 0 0;">
                <a href="${unsubscribeUrl}" style="color: #64748b; text-decoration: underline;">Descadastrar</a>
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

        console.log(`[Weekly Email]Sending: ${transit.title} `);
        console.log(`[Weekly Email]Subscribers: ${subscribers.length} `);

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
                console.error(`[Weekly Email]Failed: ${subscriber.email} `, emailError);
                errorCount++;
            }
        }

        console.log(`[Weekly Email]Done.Sent: ${sentCount}, Errors: ${errorCount} `);

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
