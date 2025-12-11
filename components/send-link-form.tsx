"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
    sendPatientLinkAction,
    type SendLinkState,
} from "@/app/actions/dashboard/action";
import {FaArrowRight} from "react-icons/fa";
import {useActionState} from "react";

function ArrowButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gray-700 text-white transition-colors hover:bg-gray-900 disabled:opacity-60"
        >
            {pending ? (
                <span className="text-xs">…</span>
            ) : (
                <FaArrowRight />
            )}
        </button>
    );
}

export function SendLinkForm() {
    const [state, formAction] = useActionState<SendLinkState, FormData>(
        sendPatientLinkAction,
        {}
    );

    return (
        <form action={formAction} className="space-y-3">
            <div className="relative">
                <input
                    type="email"
                    name="patientEmail"
                    placeholder="Adresse e-mail"
                    required
                    className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-12 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-brand-green"
                />
                <ArrowButton />
            </div>
            {state.error && (
                <p className="text-xs text-red-500">{state.error}</p>
            )}
            {state.ok && (
                <p className="text-xs text-green-600">
                    Lien envoyé au patient.
                </p>
            )}
        </form>
    );
}
