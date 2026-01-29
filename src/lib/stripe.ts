import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
    ? new Stripe(stripeSecretKey)
    : null;

export function getStripe(): Stripe {
    if (!stripe) {
        throw new Error('Stripe not configured. Missing STRIPE_SECRET_KEY.');
    }
    return stripe;
}
