import Stripe from "stripe";
import {IntakeFormData} from "@/app/actions/patient/[token]/action";
import prisma from "@/lib/prisma";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function createIntakeOrderAndCheckout(data: IntakeFormData) {
    // trouver le praticien par token
    const user = await prisma.user.findUnique({
        where: { intakeToken: data.token },
    });
    if (!user) throw new Error("Lien praticien invalide ou expiré.");

    // 2. Upsert-like logic manually (no need for email @unique)
    const existingPatient = await prisma.patient.findFirst({
        where: { email: data.email },
    });

    const patientData = {
        // adjust to your actual Patient model fields:
        name: `${data.lastName.toUpperCase()} ${data.firstName}`,
        // if you have these columns in Patient:
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        addressName: data.addressName,
        street: data.street,
        zip: data.zip,
        city: data.city,
        country: data.country,
    };

    let patient;

    if (existingPatient) {
        patient = await prisma.patient.update({
            where: { id: existingPatient.id },
            data: patientData,
        });
    } else {
        patient = await prisma.patient.create({
            data: {
                email: data.email,
                ...patientData,
            },
        });
    }


    const amountCents = 5600;

    const order = await prisma.order.create({
        data: {
            patientId: patient.id,
            userId: user.id,
            amountCents,
            size:
                data.size === "small"
                    ? "SMALL"
                    : data.size === "large"
                        ? "LARGE"
                        : "MEDIUM",
            deliveryMode:
                data.delivery === "address" ? "ADDRESS" : "PRACTITIONER",
        },
    });

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/patient/${data.token}?canceled=1`,
        line_items: [
            {
                price: process.env.STRIPE_DEVICE_PRICE_ID!,
                quantity: 1,
            },
            {
                price: process.env.STRIPE_SHIPPING_PRICE_ID!,
                quantity: 1,
            },
        ],
        metadata: {
            orderId: order.id,
            patientEmail: data.email,
            size: data.size,
            delivery: data.delivery,
        },
    });

    await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: session.id },
    });

    return session.url!;
}

export async function getOrdersForUser(
    userId: string,
    page = 1,
    pageSize = 20,
) {
    const skip = (page - 1) * pageSize;

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where: { userId },
            include: { patient: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize,
        }),
        prisma.order.count({ where: { userId } }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
        orders: orders.map((o) => ({
            id: o.id,
            patientName: o.patient.name,
            patientEmail: o.patient.email,
            status: o.status,
            paymentStatus: o.paymentStatus,
            createdAt: o.createdAt.toISOString().slice(0, 10),
        })),
        totalPages,
    };
}