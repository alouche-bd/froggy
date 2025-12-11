import 'server-only';
import Stripe from 'stripe';
import prisma from "@/lib/prisma";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
});

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!;
const APP_URL =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.FRONTEND_URL ||
    'http://localhost:3000';

export async function createCheckoutSessionForOrder(opts: {
    orderId: string;
    token: string;
}) {
    const successUrl = `${APP_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${APP_URL}/p/${opts.token}?canceled=1`;

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
            {
                price: STRIPE_PRICE_ID,
                quantity: 1,
            },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { orderId: opts.orderId },
    });

    await prisma.order.update({
        where: { id: opts.orderId },
        data: { stripeSessionId: session.id },
    });

    return session;
}
