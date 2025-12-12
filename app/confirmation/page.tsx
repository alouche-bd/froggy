import { stripe } from "@/lib/stripe";
import { getBrandConfig } from "@/lib/brand";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export default async function ConfirmationPage({
                                                   searchParams,
                                               }: {
    searchParams: Promise<{ session_id?: string }>;
}) {
    const brand = getBrandConfig();
    const {session_id} = await searchParams;

    let patientName = "";
    let orderId = "";
    let createdAt = "";

    if (session_id) {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const orderIdMeta = session.metadata?.orderId as string | undefined;

        if (orderIdMeta) {
            const order = await prisma.order.findUnique({
                where: { id: orderIdMeta },
                include: { patient: true },
            });

            if (order) {
                orderId = order.id;
                createdAt = order.createdAt.toISOString().slice(0, 10);
                patientName = order.patient.name;

                if (
                    session.payment_status === "paid" &&
                    order.paymentStatus !== "PAID"
                ) {
                    await prisma.order.update({
                        where: { id: order.id },
                        data: { status: "PAID", paymentStatus: "PAID" },
                    });
                }
            }
        }
    }

    const displayName = patientName || "XXXXX";

    return (
        <main className="bg-gray-50">
            <div className="mx-auto max-w-5xl px-4 py-10">
                <div className="rounded-3xl bg-white p-10 shadow-sm border border-gray-100 text-center space-y-6">
                    <h1 className="text-4xl font-medium text-brand-green">
                        Merci pour votre commande, {displayName} !
                    </h1>
                    <p className="text-sm text-gray-600">
                        Votre commande a été enregistrée avec succès.
                    </p>

                    <div className="mx-auto max-w-xl text-left text-xs space-y-4">
                        <div>
                            <h2 className="mb-2 font-semibold">
                                Récapitulatif de la commande
                            </h2>
                            <ul className="space-y-1 text-gray-700">
                                <li>
                  <span className="font-semibold">
                    Numéro de commande :
                  </span>{" "}
                                    {orderId || "FM-NuméroUnique"}
                                </li>
                                <li>
                  <span className="font-semibold">
                    Date de la commande :
                  </span>{" "}
                                    {createdAt || "XX.XX.XXXX"}
                                </li>
                                <li>
                  <span className="font-semibold">
                    Dispositif Froggymouth :
                  </span>{" "}
                                    Taille (Small/Medium/Large)
                                </li>
                                <li>
                  <span className="font-semibold">
                    Mode de livraison :
                  </span>{" "}
                                    Chez le praticien / À l’adresse indiquée
                                </li>
                                <li>
                  <span className="font-semibold">
                    Adresse de livraison :
                  </span>{" "}
                                    Adresse complète
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="mb-2 font-semibold">
                                Informations complémentaires
                            </h2>
                            <ul className="space-y-1 text-gray-700">
                                <li>
                                    <span className="font-semibold">Suivi de commande :</span>{" "}
                                    vous pouvez suivre l’état de votre commande en vous
                                    connectant à votre espace client.
                                </li>
                                <li>
                  <span className="font-semibold">
                    Délai de livraison estimé :
                  </span>{" "}
                                    X jours ouvrés
                                </li>
                                <li>
                                    <span className="font-semibold">Contact :</span> pour toute
                                    question, contactez notre service client à{" "}
                                    <a
                                        href="mailto:contact@froggymouth.com"
                                        className="text-brand underline"
                                    >
                                        contact@froggymouth.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <a
                        href="/"
                        className="inline-flex rounded-full bg-brand px-8 py-2 text-sm font-semibold text-white hover:opacity-90"
                    >
                        Retour à l’accueil
                    </a>
                </div>
            </div>
        </main>
    );
}
