import { requireUser } from "@/lib/auth";
import { getBrandConfig } from "@/lib/brand";

import {OrdersTable} from "@/components/orders-table";
import {getOrdersForUser} from "@/lib/order";
import {SendLinkForm} from "@/components/send-link-form";
import {QrCodeCard} from "@/components/patient/qr-code-card";


export default async function DashboardPage() {
    const user = await requireUser();
    const brand = getBrandConfig();

    const { orders } = await getOrdersForUser(user.id, 1, 50);

    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const intakeUrl = `${baseUrl}/patient/${user.intakeToken}`;

    const doctorName =
        user.lastName || user.firstName
            ? `${user.lastName ?? ""}`.trim()
            : "Martin";

    return (
        <main className="bg-brand-gray-light text-gray-800">
            <div className="container mx-auto px-8 py-16">
                {/* Welcome section */}
                <section
                    id="welcome-section"
                    className="mb-12 text-center"
                >
                    <h1 className="mb-3 text-4xl capitalize font-medium text-brand-green">
                        Bienvenue Dr. {doctorName} !
                    </h1>
                    <p className="text-gray-700 font-medium">
                        Voici les outils à votre disposition pour prescrire{" "}
                        {brand.name} à vos patients.
                    </p>
                </section>

                {/* Tools: QR + email */}
                <section
                    id="tools-section"
                    className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2"
                >
                    {/* QR code card */}
                    <QrCodeCard intakeUrl={intakeUrl} />


                    {/* Email link card */}
                    <div
                        id="email-link-card"
                        className="rounded-xl bg-white p-8 shadow-md"
                    >
                        <h2 className="mb-3 text-lg font-bold">
                            Envoi d&apos;un lien par e-mail au patient
                        </h2>
                        <p className="mb-4 text-sm text-gray-600">
                            Entrez l&apos;adresse e-mail du patient ci-dessous. Il
                            recevra automatiquement un message contenant :
                        </p>
                        <ul className="mb-6 list-inside list-disc space-y-1 text-sm text-gray-600">
                            <li>Le lien vers le formulaire</li>
                            <li>Une explication claire du processus</li>
                        </ul>
                        <SendLinkForm />
                    </div>
                </section>

                {/* Patients dashboard */}
                <section
                    id="patients-dashboard"
                    className="rounded-xl bg-white p-8 shadow-md"
                >
                    <h2 className="mb-2 text-lg font-bold">
                        Votre tableau de bord patients
                    </h2>
                    <p className="mb-8 text-sm text-gray-600">
                        Suivez en temps réel les commandes passées par vos
                        patients.
                    </p>
                    <OrdersTable orders={orders} />
                </section>

            </div>
        </main>
    );
}
