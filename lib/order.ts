import Stripe from "stripe";
import {IntakeFormData} from "@/app/actions/patient/[token]/action";
import prisma from "@/lib/prisma";
import {sendMailjetEmail} from "@/lib/mailjet";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function sendPrescriberOrderNotificationEmail(opts: {
    prescriberEmail: string;
    prescriberName: string;
    patientName: string;
    size: string;
    deliveryMode: "address" | "practitioner";
    patientAddress: string;      // Adresse du patient (pour mode ADDRESS)
    practitionerAddress: string; // Adresse du cabinet (pour mode PRACTITIONER)
}) {
    const safePrescriberName = opts.prescriberName || "Docteur";

    const subject =
        opts.deliveryMode === "address"
            ? `Votre patient ${opts.patientName} a commandé un Froggymouth`
            : `Commande Froggymouth de votre patient ${opts.patientName} – Livraison à votre cabinet`;

    const addressLine =
        opts.deliveryMode === "address"
            ? opts.patientAddress
            : opts.practitionerAddress;

    const extraFooter =
        opts.deliveryMode === "practitioner"
            ? `
        <p style="margin: 16px 0 0 0;">
          En cas de besoin ou pour toute question, n’hésitez pas à nous contacter au
          <strong>04 13 22 82 40</strong> ou par e-mail à
          <a href="mailto:contact@froggymouth.com" style="color:#16a34a;text-decoration:underline;">
            contact@froggymouth.com
          </a>.
        </p>
      `
            : "";

    const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #111827; line-height: 1.6;">
      <p>Cher(e) ${safePrescriberName},</p>

      <p>
        Nous vous informons que votre patient, <strong>${opts.patientName}</strong>, a récemment commandé
        un appareil Froggymouth via notre boutique en ligne${
        opts.deliveryMode === "practitioner"
            ? ", avec une livraison prévue à votre cabinet"
            : ""
    }.
      </p>

      <p><strong>Détails de la commande :</strong></p>
      <ul style="list-style: disc; padding-left: 20px; margin-top: 0;">
        <li><strong>Nom du patient :</strong> ${opts.patientName}</li>
        <li><strong>Taille de l’appareil :</strong> ${opts.size}</li>
        <li><strong>Adresse de livraison :</strong> ${addressLine.replace(/\n/g, "<br/>")}</li>
      </ul>

      <p>
        Une brochure explicative destinée au patient est incluse dans le colis pour faciliter
        l’utilisation de l’appareil.
      </p>

      <p>
        Nous vous remercions pour votre confiance et restons à votre disposition pour toute question
        ou assistance supplémentaire.
      </p>

      ${extraFooter}

      <p style="margin-top: 24px;">Cordialement,<br/>L’équipe Froggymouth</p>
    </div>
  `;

    await sendMailjetEmail({
        toEmail: opts.prescriberEmail,
        toName: safePrescriberName,
        subject,
        html,
    });
}

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

    const prescriberName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "votre praticien";

    const patientAddress = [
        data.addressName,
        data.street,
        `${data.zip} ${data.city}`,
        data.country,
    ]
        .filter(Boolean)
        .join("\n");

    const practitionerAddress = [
        user.professionalAddress,
        `${user.postalCode} ${user.city}`,
    ]
        .filter(Boolean)
        .join("\n");

    try {
        await sendPrescriberOrderNotificationEmail({
            prescriberEmail: user.email,
            prescriberName,
            patientName: patient.name || "Votre patient",
            size: data.size,
            deliveryMode: data.delivery === "practitioner" ? "practitioner" : "address",
            patientAddress,
            practitionerAddress,
        });
    } catch (e) {
        console.error("Erreur envoi mail prescripteur", e);
    }


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
            size: o.size,
            paymentStatus: o.paymentStatus,
            createdAt: o.createdAt.toISOString().slice(0, 10),
        })),
        totalPages,
    };
}