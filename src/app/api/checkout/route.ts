import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { siteConfig } from '@/lib/siteConfig';

export async function POST(req: Request) {
    try {
        const { priceId, mode = 'payment' } = await req.json();

        // URL base do site (localhost em dev, vercel em prod)
        // O Next.js geralmente expõe VERCEL_URL em prod
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId, // ID do preço criado no painel do Stripe
                    quantity: 1,
                },
            ],
            mode: mode, // 'payment' (venda única) ou 'subscription' (assinatura)
            success_url: `${origin}/leitura-premium/sucesso?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/leitura-premium`,
            metadata: {
                // Aqui podemos guardar dados extras, como o signo do usuário se já soubermos
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Checkout Error:', err);
        return NextResponse.json(
            { error: 'Erro ao iniciar pagamento' },
            { status: 500 }
        );
    }
}
