"use server";


import { redirect } from "next/navigation";
import { z } from "zod";
import {createIntakeOrderAndCheckout} from "@/lib/order";

export type PatientFormState = { error?: string };

const schema = z.object({
    token: z.string().min(1),
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
});

export async function submitPatientForm(
    _prev: PatientFormState,
    formData: FormData
): Promise<PatientFormState> {
    try {
        const data = schema.parse({
            token: formData.get("token"),
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            phone: formData.get("phone") || undefined,
        });

        const checkoutUrl = await createIntakeOrderAndCheckout(data);
        redirect(checkoutUrl);
    } catch (e: any) {
        return { error: e.message ?? "Erreur inconnue." };
    }
}
