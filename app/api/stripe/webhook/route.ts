import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import {sendGalaxyDeliveryAddress, sendGalaxyOrder} from "@/lib/galaxy";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text();

    if (!sig) {
        return new NextResponse("Missing signature", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("Stripe webhook signature error:", err?.message || err);
        return new NextResponse(
            `Webhook error: ${err?.message ?? "unknown"}`,
            { status: 400 }
        );
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderId = session.metadata?.orderId as string | undefined;

            if (!orderId) {
                console.warn(
                    "checkout.session.completed without orderId in metadata",
                    session.id
                );
            } else {
                const order = await prisma.order.findUnique({
                    where: { id: orderId },
                    include: {
                        patient: true,
                        user: true,
                    },
                });

                await prisma.order.update({
                    where: { id: orderId },
                    data: {
                        status: "PAID",
                        paymentStatus: "PAID",
                        stripePaymentId: session.payment_intent as string,
                    },
                });
                try {
                    if(order) {
                        await sendGalaxyDeliveryAddress({order});
                        await sendGalaxyOrder({order});
                    }
                } catch (err) {
                    console.error(
                        "Error sending to Galaxy for order",
                        orderId,
                        err
                    );
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (err: any) {
        console.error("Stripe webhook handler error:", err?.message || err);

        return new NextResponse("Webhook handler error", { status: 200 });
    }
}
