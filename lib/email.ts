import 'server-only';
import { Resend } from 'resend';
import { getBrandConfig } from './brand';
import {sendMailjetEmail} from "@/lib/mailjet";

const resend = new Resend(process.env.RESEND_API_KEY!);
const from = process.env.EMAIL_FROM || 'noreply@example.com';

export async function sendPasswordResetEmail(opts: { to: string; link: string }) {
    const brand = getBrandConfig();

    const html = `
   <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #111827; line-height: 1.6;">
      <h1 style="font-size:20px;margin:0 0 12px 0;color:#111827;">Réinitialisation de votre mot de passe</h1>
      <p style="margin:0 0 8px 0;color:#111827;">Bonjour,</p>
      <p style="margin:0 0 12px 0;color:#374151;">
        Vous avez demandé la réinitialisation de votre mot de passe pour votre espace prescripteur ${brand.name}.
      </p>
      <p style="margin:0 0 16px 0;">
        <a href="${opts.link}"
           style="display:inline-block;padding:12px 20px;border-radius:9999px;
                  background-color:#10b981;color:#ffffff;text-decoration:none;font-weight:600;">
          Réinitialiser mon mot de passe
        </a>
      </p>
      <p style="margin:0 0 4px 0;color:#6b7280;">
        Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.
      </p>
      <p style="margin:8px 0 4px 0;color:#6b7280;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
      <p style="margin:0;color:#2563eb;word-break:break-all;">${opts.link}</p>
    </div>
  `;

    await sendMailjetEmail({
        toEmail: opts.to,
        subject: `${brand.name} – Réinitialisation de votre mot de passe`,
        html,
    });
}