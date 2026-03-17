import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const { amount, name, email } = await request.json();

    if (!amount || amount < 5) {
      return NextResponse.json({ error: 'Minimum donation is €5' }, { status: 400 });
    }

    const origin = request.headers.get('origin');

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Donation to OmniTool Support',
              description: 'Thank you for supporting our free tools and needy people.',
              images: [`${origin}/logo.png`], // Use your actual logo URL if available
            },
            unit_amount: Math.round(amount * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/donate?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate?canceled=true`,
      customer_email: email,
      metadata: {
        donor_name: name,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Session Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
