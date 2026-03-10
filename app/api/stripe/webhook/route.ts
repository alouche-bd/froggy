import {NextRequest, NextResponse} from "next/server";
import Stripe from "stripe";
import {stripe} from "@/lib/stripe";
import prisma from "@/lib/prisma";
import {sendGalaxyDeliveryAddress, sendGalaxyOrder} from "@/lib/galaxy";
import {logIntegration} from "@/lib/integration-log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text();

    if (!sig) return new NextResponse("Missing signature", {status: 400});

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        await logIntegration({
            provider: "STRIPE",
            action: "signature_error",
            status: "ERROR",
            error: err?.message ?? String(err),
        });
        return new NextResponse(`Webhook error: ${err?.message ?? "unknown"}`, {
            status: 400,
        });
    }

    try {
        await logIntegration({
            provider: "STRIPE",
            action: event.type,
            status: "SUCCESS",
            stripeEventId: event.id,
        });

        if (event.type !== "checkout.session.completed") {
            return NextResponse.json({received: true});
        }

        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId as string | undefined;

        if (!orderId) {
            await logIntegration({
                provider: "STRIPE",
                action: "missing_orderId_metadata",
                status: "ERROR",
                stripeEventId: event.id,
                error: `No orderId in metadata (session=${session.id})`,
            });
            return NextResponse.json({received: true});
        }

        const order = await prisma.order.findUnique({
            where: {id: orderId},
            include: {patient: true, user: true},
        });

        if (!order) {
            await logIntegration({
                provider: "STRIPE",
                action: "order_not_found",
                status: "ERROR",
                orderId,
                stripeEventId: event.id,
                error: "Order not found in database",
            });
            return NextResponse.json({received: true});
        }

        if (order.paymentStatus === "PAID") {
            await logIntegration({
                provider: "STRIPE",
                action: "already_paid_skip",
                status: "SKIPPED",
                orderId,
                stripeEventId: event.id,
            });
            return NextResponse.json({received: true});
        }

        await prisma.order.update({
            where: {id: orderId},
            data: {
                status: "PAID",
                paymentStatus: "PAID",
                stripePaymentId: session.payment_intent as string,
            },
        });

        const paidOrder = await prisma.order.findUnique({
            where: {id: orderId},
            include: {patient: true, user: true},
        });

        if (!paidOrder) {
            await logIntegration({
                provider: "STRIPE",
                action: "order_refetch_failed",
                status: "ERROR",
                orderId,
                stripeEventId: event.id,
                error: "Order not found after update",
            });
            return NextResponse.json({received: true});
        }

        try {
            await sendGalaxyDeliveryAddress({order: paidOrder});
            await sendGalaxyOrder({order: paidOrder});

            await logIntegration({
                provider: "GALAXY",
                action: "galaxy_flow_done",
                status: "SUCCESS",
                orderId,
                stripeEventId: event.id,
            });
        } catch (err: any) {
            await logIntegration({
                provider: "GALAXY",
                action: "galaxy_flow_failed",
                status: "ERROR",
                orderId,
                stripeEventId: event.id,
                error: err?.message ?? String(err),
            });
        }

        return NextResponse.json({received: true});
    } catch (err: any) {
        await logIntegration({
            provider: "STRIPE",
            action: "handler_error",
            status: "ERROR",
            error: err?.message ?? String(err),
        });

        return new NextResponse("Webhook handler error", {status: 200});
    }
}