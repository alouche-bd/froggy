import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text();

    if (!sig) {
        return new NextResponse("Missing signature", { status: 400 });
    }

    try {
        const event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId as string | undefined;

            if (orderId) {
                await prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: "PAID",
                        paymentStatus: "PAID",
                        stripePaymentId: session.payment_intent as string,
                    },
                });
            }
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error("Stripe webhook error", err?.message || err);
        return new NextResponse(
            `Webhook error: ${err?.message ?? "unknown"}`,
            { status: 400 }
        );
    }
}
