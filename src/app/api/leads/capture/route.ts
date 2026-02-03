import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/resend';
import { z } from 'zod';

// Schema de validação
const leadSchema = z.object({
    name: z.string().min(2, 'Nome muito curto'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
    message: z.string().optional(),
    type: z.enum(['contato', 'clube', 'consulta', 'membros', 'newsletter'])
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || 'https://www.ouronasestrelas.com.br';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = leadSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Dados inválidos', details: validation.error.format() }, { status: 400 });
        }

        const { name, email, phone, message, type } = validation.data;
        const supabase = createAdminClient();

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
            subject: `🔔 Novo Lead: ${type.toUpperCase()} - ${name}`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #d4af37;">Novo Lead Capturado</h2>
          <p><strong>Tipo:</strong> ${type}</p>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${phone}</p>
          ${message ? `<p><strong>Mensagem:</strong><br>${message}</p>` : ''}
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
          <h2 style="color: #d4af37;">Olá, ${name.split(' ')[0]}! ✨</h2>
          <p>${userMessage}</p>
          <p>Enquanto isso, continue acompanhando nossos conteúdos no site.</p>
          <br>
          <a href="${SITE_URL}" style="color: #d4af37; text-decoration: none;">www.ouronasestrelas.com.br</a>
        </div>
      `
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[Lead Capture] Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
