"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createIntakeOrderAndCheckout } from "@/lib/order";

export type PatientFormState = { error?: string };

const schema = z.object({
    token: z.string().min(1),

    lastName: z.string().min(1),
    firstName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),

    size: z.enum(["small", "medium", "large"]),
    delivery: z.enum(["practitioner", "address"]),

    addressName: z.string().min(1),
    street: z.string().min(1),
    zip: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),

    acceptCgv: z.preprocess(
        (v) => (v === null ? undefined : v),
        z
            .string()
            .optional()
            .refine((val) => val === "on", {
                message: "Vous devez accepter les conditions générales de vente.",
            })
    ),
});

export type IntakeFormData = z.infer<typeof schema>;


export async function submitPatientForm(
    _prev: PatientFormState,
    formData: FormData
): Promise<PatientFormState> {
    let checkoutUrl = "";
    try {
        const data = schema.parse({
            token: formData.get("token"),
            lastName: formData.get("lastName"),
            firstName: formData.get("firstName"),
            email: formData.get("email"),
            phone: formData.get("phone"),

            size: formData.get("size"),
            delivery: formData.get("delivery"),

            addressName: formData.get("addressName"),
            street: formData.get("street"),
            zip: formData.get("zip"),
            city: formData.get("city"),
            country: formData.get("country"),

            acceptCgv: formData.get("acceptCgv"),
        });

        checkoutUrl = await createIntakeOrderAndCheckout(data);
    } catch (e: any) {
        return { error: e.message ?? "Erreur inconnue." };
    }

    redirect(checkoutUrl);
}
