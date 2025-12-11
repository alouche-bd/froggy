import 'server-only';
import { Resend } from 'resend';
import { getBrandConfig } from './brand';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendPatientLinkEmail(opts: { to: string; link: string }) {
    const brand = getBrandConfig();
    const from = process.env.EMAIL_FROM || 'noreply@example.com';

    const html = `
    <div style="font-family:system-ui,-apple-system,sans-serif;padding:24px;">
      <img src="${brand.logoUrl}" alt="${brand.name}" style="height:40px;margin-bottom:16px;" />
      <h1 style="font-size:20px;">${brand.name}</h1>
      <p>Bonjour,</p>
      <p>Votre praticien vous invite à remplir un court formulaire et à régler votre dispositif.</p>
      <p>
        <a href="${opts.link}" style="display:inline-block;padding:12px 20px;background:white;color:white;border-radius:9999px;text-decoration:none;">
          Remplir le formulaire &amp; payer
        </a>
      </p>
      <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
      <p>${opts.link}</p>
    </div>
  `;

    await resend.emails.send({
        from,
        to: opts.to,
        subject: `${brand.name} – Formulaire patient`,
        html,
    });
}
