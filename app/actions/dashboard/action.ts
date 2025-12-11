"use server";

import { requireUser } from "@/lib/auth";
import { sendPatientLinkEmail } from "@/lib/email";
import { z } from "zod";
import prisma from "@/lib/prisma";

const schema = z.object({
    patientEmail: z.string().email(),
});

export type SendLinkState = {
    error?: string;
    ok?: boolean;
};

export async function sendPatientLinkAction(
    _prev: SendLinkState,
    formData: FormData
): Promise<SendLinkState> {
    try {
        const user = await requireUser();
        const parsed = schema.parse({
            patientEmail: formData.get("patientEmail"),
        });

        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const intakeUrl = `${baseUrl}/p/${user.intakeToken}`;

        await sendPatientLinkEmail({
            to: parsed.patientEmail,
            link: intakeUrl,
        });

        await prisma.sentLink.create({
            data: {
                userId: user.id,
                patientEmail: parsed.patientEmail,
                token: user.intakeToken,
            },
        });

        return { ok: true };
    } catch (e: any) {
        return { error: e.message ?? "Erreur inconnue." };
    }
}
