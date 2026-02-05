import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const { priceId, mode, focus, acceptedSymbolicTerms } = await req.json();

        // Se o client não mandar mode, inferimos a partir do Price no Stripe.
        // - price recorrente => subscription
        // - price avulso => payment
        let inferredMode: 'payment' | 'subscription' | undefined = mode;
        if (!inferredMode) {
            const stripe = getStripe();
            const price = await stripe.prices.retrieve(priceId);
            inferredMode = price.type === 'recurring' ? 'subscription' : 'payment';
        }

        // URL base do site (localhost em dev, vercel em prod)
        // O Next.js geralmente expõe VERCEL_URL em prod
        const origin = req.headers.get('origin') || 'http://localhost:3000';

        // Log temporário de diagnóstico (REMOVER DEPOIS)
        console.log('[Stripe Key Check]', {
            startsWith: (process.env.STRIPE_SECRET_KEY ?? '').trim().slice(0, 7),
            length: (process.env.STRIPE_SECRET_KEY ?? '').trim().length
        });

        const stripe = getStripe();
        const nowIso = new Date().toISOString();

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId, // ID do preço criado no painel do Stripe
                    quantity: 1,
                },
            ],
            mode: inferredMode, // 'payment' (venda única) ou 'subscription' (assinatura)
            success_url: `${origin}/leitura-premium/sucesso?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/leitura-premium`,
            metadata: {
                focus: typeof focus === 'string' ? focus : null,
                accepted_symbolic_terms: acceptedSymbolicTerms ? 'true' : 'false',
                accepted_symbolic_terms_at: acceptedSymbolicTerms ? nowIso : null,
                accepted_symbolic_terms_version: 'v1',
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
