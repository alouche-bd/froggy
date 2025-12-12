import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {PatientForm} from "@/components/patient/patient-form";


type Props = {
    params: { token?: string };
};

export default async function PatientIntakePage({
                                                    params,
                                                }: {
    params: Promise<{ token: string }>
}) {
    const { token } = await params

    if (!token) {
        notFound();
    }

    const user = await prisma.user.findUnique({
        where: { intakeToken: token },
    });

    if (!user) {
        notFound();
    }

    function capitalizeFirst(value?: string | null): string {
        if (!value) return "";
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    const doctorName =
        user.lastName || user.firstName
            ? `${(capitalizeFirst(user.firstName) ?? "").trim()} ${(capitalizeFirst(user.lastName) ?? "").trim()}`.trim()
            : "";

    return (
        <main className="bg-brand-gray text-brand-text">
            <div className="flex min-h-[900px] w-full flex-col items-center">
                <section
                    id="main-content"
                    className="flex w-full flex-grow items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
                >
                    <div
                        id="form-container"
                        className="w-full max-w-2xl space-y-8"
                    >
                        <div className="text-center">
                            <h1
                                id="main-title"
                                className="text-4xl font-medium text-brand-green"
                            >
                                Votre dispositif Froggymouth a été prescrit par{" "}
                                {doctorName}
                            </h1>
                        </div>

                        <PatientForm token={token} />
                    </div>
                </section>
            </div>
        </main>
    );
}
