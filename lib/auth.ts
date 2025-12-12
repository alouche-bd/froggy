import 'server-only';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import prisma from "@/lib/prisma";

const SESSION_COOKIE_NAME = 'session_token';

const registerSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        professionalAddress: z.string().min(1),
        postalCode: z.string().min(1),
        city: z.string().min(1),
        specialty: z.enum([
            "orthophoniste",
            "kinesitherapeute",
            "osteopathe",
            "autre",
        ]),
        siret: z.string().min(1),
        usedFroggymouth: z.enum(["yes", "no"]),
        training: z.enum(["done", "commit"]),
        terms: z.literal("on"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas.",
        path: ["confirmPassword"],
    });

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

async function createSession(userId: string) {
    const token = crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30);

    await prisma.session.create({ data: { token, userId, expiresAt } });

    (await cookies()).set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        path: '/',
    });
}

export async function registerUser(input: RegisterInput) {
    const data = registerSchema.parse(input);

    const existing = await prisma.user.findUnique({
        where: { email: data.email },
    });
    if (existing) throw new Error("Un compte existe déjà avec cet e-mail.");

    const passwordHash = await bcrypt.hash(data.password, 12);
    const intakeToken = crypto.randomUUID();

    const user = await prisma.user.create({
        data: {
            email: data.email,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            professionalAddress: data.professionalAddress,
            postalCode: data.postalCode,
            city: data.city,
            specialty: data.specialty,
            siret: data.siret,
            usedFroggymouth: data.usedFroggymouth === "yes",
            training: data.training,
            intakeToken,
        },
    });

    await createSession(user.id);
    return user;
}


export async function loginUser(input: LoginInput) {
    const data = loginSchema.parse(input);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('Identifiants invalides');

    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) throw new Error('Identifiants invalides');

    await createSession(user.id);
    return user;
}

export async function getCurrentUser() {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
    });
    if (!session) return null;

    if (session.expiresAt < new Date()) {
        await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
        (await cookies()).delete(SESSION_COOKIE_NAME);
        return null;
    }

    return session.user;
}

export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) redirect('/auth');
    return user;
}

export async function logout() {
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (token) {
        await prisma.session.deleteMany({ where: { token } });
    }
    (await cookies()).delete(SESSION_COOKIE_NAME);
    redirect('/');
}
