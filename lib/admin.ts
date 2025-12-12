import prisma from "@/lib/prisma";

export type AdminUserRow = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    city: string;
    specialty: string;
};

export type AdminPatientRow = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    createdAt: string;
    city: string;
};

export type AdminOrderRow = {
    id: string;
    patientName: string;
    createdAt: string;
    size: string;
    prescriber: string;
};

export async function getAdminDashboardData() {
    const [users, patients, orders] = await Promise.all([
        prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            where:{
                role: "USER"
            }
        }),
        prisma.patient.findMany({
            orderBy: { createdAt: "desc" },
        }),
        prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            include: { patient: true, user: true },
        }),
    ]);

    const userRows: AdminUserRow[] = users.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        specialty: u.specialty,
        city: u.city,
        lastName: u.lastName,
        email: u.email,
        createdAt: u.createdAt.toISOString(),
    }));

    const patientRows: AdminPatientRow[] = patients.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone ?? null,
        createdAt: p.createdAt.toISOString(),
        city: p.city
    }));

    const orderRows: AdminOrderRow[] = orders.map((o) => ({
        id: o.id,
        patientName: o.patient.name,
        prescriber: o.user.lastName + " " + o.user.firstName,
        createdAt: o.createdAt.toISOString(),
        size: (o as any).size ?? "—",
    }));

    return { users: userRows, patients: patientRows, orders: orderRows };
}
