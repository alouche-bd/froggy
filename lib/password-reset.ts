import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";
import prisma from "@/lib/prisma";

const RESET_TOKEN_EXPIRY_HOURS = 1;

export async function requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return;

    const token = crypto.randomUUID();
    const expiresAt = new Date(
        Date.now() + RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
    );

    await prisma.passwordResetToken.create({
        data: {
            token,
            userId: user.id,
            expiresAt,
        },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const link = `${baseUrl}/auth/reset-password?token=${encodeURIComponent(
        token
    )}`;

    await sendPasswordResetEmail({ to: user.email, link });
}

export async function resetPassword(token: string, newPasswordHash: string) {
    const record = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
    });

    const now = new Date();

    if (!record || record.used || record.expiresAt < now) {
        throw new Error("Lien de réinitialisation invalide ou expiré.");
    }

    await prisma.$transaction([
        prisma.user.update({
            where: { id: record.userId },
            data: {
                passwordHash: newPasswordHash,
            },
        }),
        prisma.passwordResetToken.update({
            where: { id: record.id },
            data: { used: true },
        }),
    ]);
}
