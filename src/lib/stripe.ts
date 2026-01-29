import Stripe from 'stripe';

function getRawKey() {
    return process.env.STRIPE_SECRET_KEY ?? '';
}

function normalizeKey(k: string) {
    // Remove TODOS os caracteres inválidos de qualquer lugar:
    // - Quebras de linha (\n, \r)
    // - Espaços e tabs
    // - Aspas
    // - Caracteres de controle
    const clean = k.replace(/[\s"'\r\n\t\u0000-\u001f\u007f-\u009f]/g, '');

    // Debug temporário
    console.log('[Stripe Sanitize]', {
        original: k.length,
        clean: clean.length,
        starts: clean.slice(0, 7),
        diff: k.length - clean.length
    });

    return clean;
}

const stripeSecretKey = normalizeKey(getRawKey());

export const stripe = stripeSecretKey
    ? new Stripe(stripeSecretKey)
    : null;

export function getStripe(): Stripe {
    if (!stripe) {
        throw new Error('Stripe not configured. Missing STRIPE_SECRET_KEY.');
    }
    return stripe;
}
