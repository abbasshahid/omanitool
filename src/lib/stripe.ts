import Stripe from 'stripe';

/**
 * Stripe is constructed on first use, not at import time.
 *
 * Throwing during module evaluation broke `next build` on any machine without
 * STRIPE_SECRET_KEY set — including a fresh Vercel deployment, where the whole
 * site would fail to build because donations were not configured yet. Donations
 * are optional; the other 55 tools must not depend on them.
 */
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Donations are not configured on this deployment.');
  }

  client = new Stripe(secretKey, { typescript: true });
  return client;
}

/** Lets the donation UI hide itself rather than offer a button that fails. */
export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);
