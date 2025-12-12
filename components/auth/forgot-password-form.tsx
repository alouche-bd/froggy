"use client";

import {useFormStatus} from "react-dom";
import Link from "next/link";
import {
    type AuthState, forgotPasswordAction,
} from "@/app/actions/auth/action";
import {useActionState} from "react";

function SubmitButton() {
    const {pending} = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-block cursor-pointer rounded-full bg-brand-green px-10 py-4 text-lg font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-opacity-90 disabled:opacity-60"
        >
            {pending ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
        </button>
    );
}

export function ForgotPasswordForm() {
    const [state, formAction] = useActionState<AuthState, FormData>(
        forgotPasswordAction,
        {}
    );

    const showSuccess = !state.error;

    return (
        <main className="container mx-auto px-6 py-16">
            <div className="mx-auto max-w-3xl">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-light text-brand-green">
                        Mot de passe oublié
                    </h1>
                    <p className="text-lg font-semibold text-brand-dark">
                        Réinitialisez votre accès à l&apos;espace prescripteur
                    </p>
                    <p className="mt-1 text-gray-600 text-sm">
                        Indiquez votre adresse e-mail. Si un compte existe, vous recevrez un
                        lien de réinitialisation.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                    <form action={formAction} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-medium text-brand-dark"
                            >
                                Adresse e-mail <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Adresse e-mail"
                                required
                            />
                        </div>

                        {state.error && (
                            <p className="text-xs text-red-500 text-center">
                                {state.error}
                            </p>
                        )}

                        {!state.error && showSuccess && (
                            <p className="text-xs text-green-600 text-center">
                                Si un compte existe avec cette adresse, un e-mail de
                                réinitialisation vient de vous être envoyé.
                            </p>
                        )}

                        <div className="pt-4 flex flex-col items-center space-y-3">
                            <SubmitButton/>
                            <Link
                                href="/auth/login"
                                className="text-xs text-gray-500 underline hover:no-underline"
                            >
                                Retour à la connexion
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}