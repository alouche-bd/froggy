"use server";

import { requireUser } from "@/lib/auth";
import { z } from "zod";
import prisma from "@/lib/prisma";
import {sendMailjetEmail} from "@/lib/mailjet";

const schema = z.object({
    patientEmail: z.string().email(),
});

export type SendLinkState = {
    error?: string;
    ok?: boolean;
};

export async function sendPatientInvitationEmail(opts: {
    toEmail: string;
    secureLink: string;
}) {
    const subject =
        "Votre praticien vous recommande Froggymouth – Accédez à votre espace sécurisé";

    const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #111827; line-height: 1.6;">
      <p>Bonjour,</p>

      <p>Votre praticien vous recommande Froggymouth. Cliquez sur le lien ci-dessous pour accéder à votre espace sécurisé et commander l’appareil :</p>

      <p>
        <a href="${opts.secureLink}" style="display:inline-block;padding:10px 18px;border-radius:9999px;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:500;">
          Accéder à votre espace sécurisé
        </a>
      </p>

      <p>Ou copiez/collez ce lien dans votre navigateur :</p>
      <p style="word-break:break-all;">${opts.secureLink}</p>

      <h2 style="font-size:16px; margin-top:24px; margin-bottom:8px;">Comment ça se passe ?</h2>
      <ol style="padding-left: 20px; margin-top: 0;">
        <li>Cliquez sur le lien ci-dessus</li>
        <li>Renseignez vos informations</li>
        <li>Validez votre commande</li>
      </ol>

      <p style="margin-top:24px;">
        Si vous avez la moindre question, nous restons à votre disposition par email :
        <a href="mailto:contact@froggymouth.com" style="color:#16a34a;text-decoration:underline;">contact@froggymouth.com</a>
        ou par téléphone : 04 13 22 82 40
      </p>

      <p style="margin-top:24px;">L’équipe Froggymouth</p>
    </div>
  `;

    await sendMailjetEmail({
        toEmail: opts.toEmail,
        subject,
        html,
    });
}

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
        const intakeUrl = `${baseUrl}/patient/${user.intakeToken}`;

        await sendPatientInvitationEmail({
            toEmail: parsed.patientEmail,
            secureLink: intakeUrl,
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
