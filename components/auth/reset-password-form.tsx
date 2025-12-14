"use client";

import { useFormStatus } from "react-dom";
import {useState, useEffect, useActionState, FormEvent} from "react";
import { resetPasswordAction, type AuthState } from "@/app/actions/auth/action";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-block cursor-pointer rounded-full bg-brand-green px-10 py-3 text-base font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-opacity-90 disabled:opacity-60"
        >
            {pending ? "Mise à jour..." : "Réinitialiser le mot de passe"}
        </button>
    );
}

type Props = {
    token: string;
};

export function ResetPasswordForm({ token }: Props) {
    const [state, formAction] = useActionState<AuthState, FormData>(
        resetPasswordAction,
        {}
    );
    const [clientError, setClientError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setClientError("Lien de réinitialisation invalide.");
        }else{
            setClientError(null);
        }
    }, [token]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        setClientError(null);
        const formData = new FormData(event.currentTarget);
        const password = String(formData.get("password") ?? "");
        const confirm = String(formData.get("confirmPassword") ?? "");

        if (password.length < 8) {
            event.preventDefault();
            setClientError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if (password !== confirm) {
            event.preventDefault();
            setClientError("Les mots de passe ne correspondent pas.");
            return;
        }
    };

    return (
        <main className="container mx-auto px-6 py-16">
            <div className="mx-auto max-w-lg">
                <div className="mb-8 text-center">
                    <h1 className="mb-3 text-3xl font-light text-brand-green">
                        Réinitialiser votre mot de passe
                    </h1>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                    <form
                        action={formAction}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <input type="hidden" name="token" value={token} />

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm font-medium text-brand-dark"
                            >
                                Nouveau mot de passe <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Nouveau mot de passe"
                                required
                                minLength={8}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-1 block text-sm font-medium text-brand-dark"
                            >
                                Confirmer le mot de passe{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirmer le mot de passe"
                                required
                                minLength={8}
                            />
                        </div>

                        {(clientError || state.error) && (
                            <p className="text-xs text-red-500 text-center">
                                {clientError ?? state.error}
                            </p>
                        )}

                        <div className="pt-4 text-center">
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
