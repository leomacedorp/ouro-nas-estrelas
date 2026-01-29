import Stripe from 'stripe';

function getRawKey() {
    return process.env.STRIPE_SECRET_KEY ?? '';
}

function normalizeKey(k: string) {
    // Remove espaços e quebras de linha nas pontas
    const key = k.trim();

    // Se colaram com aspas, remove
    const unquoted = key.replace(/^["']|["']$/g, '');

    return unquoted;
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
