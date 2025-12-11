import 'server-only';

import prisma from "@/lib/prisma";
import { createCheckoutSessionForOrder } from './stripe';

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

export async function createIntakeOrderAndCheckout(opts: {
    token: string;
    fullName: string;
    email: string;
    phone?: string;
}) {
    const user = await prisma.user.findUnique({
        where: { intakeToken: opts.token },
    });
    if (!user) throw new Error('Lien non valide');

    let patient = await prisma.patient.findFirst({
        where: { email: opts.email },
    });

    if (!patient) {
        patient = await prisma.patient.create({
            data: {
                name: opts.fullName,
                email: opts.email,
                phone: opts.phone,
            },
        });
    }

    const amountCents = 9900;

    const order = await prisma.order.create({
        data: {
            patientId: patient.id,
            userId: user.id,
            amountCents,
        },
    });

    const session = await createCheckoutSessionForOrder({
        orderId: order.id,
        token: opts.token,
    });

    return session.url!;
}
