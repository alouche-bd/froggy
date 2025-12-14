import 'server-only';

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import prisma from "@/lib/prisma";
import {sendMailjetEmail} from "@/lib/mailjet";

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

async function sendPrescriberWelcomeEmail(user: {
    email: string;
    firstName: string;
    lastName: string;
    intakeToken: string;
}) {
    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const qrLink = `${baseUrl}/patient/${user.intakeToken}`;
    const fullName = `${user.firstName} ${user.lastName}`.trim();

    const subject =
        "Compte prescripteur créé avec succès + Votre QR code & prochaines formations Froggymouth";

    const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #111827; line-height: 1.6;">
      <p>Bonjour${fullName ? " " + fullName : ""},</p>

      <p><strong>Bonne nouvelle :</strong> votre compte prescripteur a bien été créé avec succès.</p>

      <h2 style="font-size:16px; margin-top:24px; margin-bottom:8px;">1) Retrouvez votre QR code à imprimer</h2>
      <p>
        Vous pouvez dès maintenant télécharger votre QR code, l’imprimer et l’afficher dans votre cabinet en cliquant ici :
        <a href="${qrLink}" style="color:#16a34a; text-decoration:underline;">accéder à mon QR code</a>
      </p>

      <h2 style="font-size:16px; margin-top:24px; margin-bottom:8px;">2) Approfondir l’utilisation de Froggymouth : nos sessions mensuelles (gratuites)</h2>
      <p>
        Pour celles et ceux qui souhaitent aller plus loin, nous organisons des sessions de formation en ligne sur Zoom, tous les mois, en soirée.
        Ces sessions durent environ 1 heure et sont animées par notre équipe clinique : indications, protocole d’utilisation, suivi des patients, questions/réponses.
      </p>
      <p>
        Inscrivez-vous à la prochaine session ici :
        <a href="https://www.froggymouth-formations.com" style="color:#16a34a; text-decoration:underline;">www.froggymouth-formations.com</a>
      </p>

      <p>
        Pour en savoir plus sur le traitement Froggymouth :
        <a href="https://froggymouth.com/pages/traitement" style="color:#16a34a; text-decoration:underline;">https://froggymouth.com/pages/traitement</a>
      </p>

      <p style="margin-top:24px;">
        Nous contacter : <a href="mailto:contact@froggymouth.com" style="color:#16a34a; text-decoration:underline;">contact@froggymouth.com</a><br/>
        <a href="https://www.froggymouth.com" style="color:#16a34a; text-decoration:underline;">www.froggymouth.com</a>
      </p>

      <p style="margin-top:24px;">L’équipe Froggymouth</p>
    </div>
  `;

    await sendMailjetEmail({
        toEmail: user.email,
        toName: fullName || undefined,
        subject,
        html,
    });
}

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

export async function registerUser(input: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    professionalAddress: string;
    postalCode: string;
    city: string;
    specialty: string;
    siret: string;
    usedFroggymouth: "yes" | "no";
    training: "done" | "commit";
    terms: string
}) {
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

    try {
        await sendPrescriberWelcomeEmail({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            intakeToken: user.intakeToken,
        });
    } catch (err) {
        console.error("Erreur lors de l'envoi de l'email de bienvenue:", err);
    }

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
