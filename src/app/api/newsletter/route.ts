import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
    try {
        const { email, name, source = 'footer' } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Upsert: se email já existe, atualiza is_active para true
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .upsert(
                {
                    email: email.toLowerCase().trim(),
                    name: name || null,
                    source,
                    is_active: true,
                    unsubscribed_at: null, // Reativa se já tinha descadastrado
                },
                {
                    onConflict: 'email',
                    ignoreDuplicates: false
                }
            )
            .select()
            .single();

        if (error) {
            console.error('[Newsletter] Supabase error:', error);
            // Não bloqueia UX - retorna sucesso mesmo se falhar
            return NextResponse.json({
                success: true,
                persisted: false,
                message: 'Inscrito com sucesso'
            });
        }

        console.log(`[Newsletter] Novo assinante: ${email}`);

        return NextResponse.json({
            success: true,
            persisted: true,
            message: 'Inscrito com sucesso'
        });

    } catch (error) {
        console.error('[Newsletter] Error:', error);
        // Sempre retorna sucesso para não quebrar UX
        return NextResponse.json({ success: true, persisted: false });
    }
}

// GET: Descadastrar (unsubscribe via link no email)
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const action = searchParams.get('action');

        if (action === 'unsubscribe' && email) {
            const supabase = createAdminClient();

            await supabase
                .from('newsletter_subscribers')
                .update({
                    is_active: false,
                    unsubscribed_at: new Date().toISOString()
                })
                .eq('email', email.toLowerCase().trim());

            return new Response(
                `<!DOCTYPE html>
                <html>
                <head><title>Descadastrado</title></head>
                <body style="font-family: system-ui; padding: 40px; text-align: center;">
                    <h1>✓ Descadastro confirmado</h1>
                    <p>Você não receberá mais emails do Boletim Astral.</p>
                    <p><a href="/">Voltar ao site</a></p>
                </body>
                </html>`,
                { headers: { 'Content-Type': 'text/html' } }
            );
        }

        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

    } catch (error) {
        console.error('[Newsletter] Unsubscribe error:', error);
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
    }
}
