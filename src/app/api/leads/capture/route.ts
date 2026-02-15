import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';
import { z } from 'zod';

// Schema de validação
const leadSchema = z.object({
    name: z.string().min(2, 'Nome muito curto').max(120, 'Nome muito longo'),
    email: z.string().email('Email inválido').max(254, 'Email muito longo'),
    phone: z.string().min(10, 'Telefone inválido').max(40, 'Telefone inválido'),
    message: z.string().max(2000, 'Mensagem muito longa').optional(),
    type: z.enum(['contato', 'clube', 'consulta', 'membros', 'newsletter']),
    // Honeypot anti-bot: campo deve ficar vazio (não expor no UI)
    website: z.string().max(0).optional(),
});

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || 'https://ouronasestrelas.com.br').replace(/\/$/, '');

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 min
const MAX_REQUESTS_PER_IP = 20; // limita spam
const ipRequests = new Map<string, { count: number; expires: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = ipRequests.get(ip);

    if (!record || now > record.expires) {
        ipRequests.set(ip, { count: 1, expires: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (record.count >= MAX_REQUESTS_PER_IP) return false;

    record.count++;
    return true;
}

function escapeHtml(input: string): string {
    return (input || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = leadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Dados inválidos', details: validation.error.format() }, { status: 400 });
        }

        const xff = req.headers.get('x-forwarded-for') || '';
        const ip = (xff.split(',')[0] || '').trim() || 'unknown';

        if (!checkRateLimit(ip)) {
            return NextResponse.json({ error: 'Muitas requisições. Tente novamente mais tarde.' }, { status: 429 });
        }

        const { name, email, phone, message, type } = validation.data;
        const supabase = createAdminClient();

        // Sanitiza para evitar injeção em email/HTML
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safePhone = escapeHtml(phone);
        const safeType = escapeHtml(type);
        const safeMsg = message ? escapeHtml(message).replace(/\n/g, '<br/>') : '';

        // 1. Salvar no Supabase
        const { error: dbError } = await supabase
            .from('leads')
            .insert({
                name,
                email,
                phone,
                message,
                type,
                created_at: new Date().toISOString()
            });

        if (dbError) {
            console.error('[Lead Capture] DB Error:', dbError);
            return NextResponse.json({ error: 'Erro ao salvar lead' }, { status: 500 });
        }

        // 2. Notificar Admin (Você)
        await sendEmail({
            to: 'leomacedorp@gmail.com', // Seu email
            subject: `🔔 Novo Lead: ${type.toUpperCase()} - ${name.split(' ')[0]}`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #d4af37;">Novo Lead Capturado</h2>
          <p><strong>Tipo:</strong> ${safeType}</p>
          <p><strong>Nome:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>WhatsApp:</strong> ${safePhone}</p>
          ${safeMsg ? `<p><strong>Mensagem:</strong><br>${safeMsg}</p>` : ''}
          <p><strong>IP:</strong> ${escapeHtml(ip)}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">Capturado via Ouro Nas Estrelas</p>
        </div>
      `
        });

        // 3. Email de Confirmação para o Usuário
        let userSubject = 'Recebemos seu contato - Ouro Nas Estrelas';
        let userMessage = 'Obrigado pelo contato! Em breve retornaremos.';

        if (type === 'clube') {
            userSubject = 'Você está na lista VIP do Clube! ✨';
            userMessage = 'Você entrou para a lista de espera do Clube das Estrelas. Avisaremos assim que abrirmos novas vagas!';
        } else if (type === 'consulta') {
            userSubject = 'Interesse Confirmado: Consulta Simbólica 🌟';
            userMessage = 'Recebemos seu interesse na Consulta Simbólica. Estamos organizando a agenda e entraremos em contato em breve.';
        }

        await sendEmail({
            to: email,
            subject: userSubject,
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4af37;">Olá, ${safeName.split(' ')[0]}! ✨</h2>
          <p>${userMessage}</p>
          <p>Enquanto isso, continue acompanhando nossos conteúdos no site.</p>
          <br>
          <a href="${SITE_URL}" style="color: #d4af37; text-decoration: none;">${escapeHtml(SITE_URL.replace(/^https?:\/\//,'').replace(/\/$/,''))}</a>
        </div>
      `
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[Lead Capture] Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
