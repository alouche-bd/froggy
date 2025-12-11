"use client";

import {useActionState, useState} from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
    loginAction,
    registerAction,
    type AuthState,
} from "@/app/actions/auth/action"; // adjust path if needed

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex w-full justify-center rounded-full bg-brand-green px-6 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
        >
            {pending ? "Veuillez patienter..." : label}
        </button>
    );
}

export function AuthForms() {
    const [mode, setMode] = useState<"register" | "login">("register");
    const [regState, regAction] = useActionState<AuthState, FormData>(
        registerAction,
        {}
    );
    const [loginState, loginFormAction] = useActionState<AuthState, FormData>(
        loginAction,
        {}
    );

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            {/* Header text */}
            <div className="mb-8 text-center space-y-1">
                <h1 className="text-2xl font-semibold text-brand-green">
                    Devenir prescripteur Froggymouth
                </h1>
                <p className="text-sm text-brand-dark">
                    Vous souhaitez utiliser Froggymouth avec vos patients ?
                </p>
                <p className="text-xs text-gray-500">
                    Voici les étapes pour devenir prescripteur agréé :
                </p>
            </div>

            {/* Mode switch */}
            <div className="mb-4 flex justify-center gap-4 text-xs font-medium">
                <button
                    type="button"
                    onClick={() => setMode("register")}
                    className={`rounded-full px-4 py-1 ${
                        mode === "register"
                            ? "bg-brand-green text-white"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    Inscription
                </button>
                <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={`rounded-full px-4 py-1 ${
                        mode === "login"
                            ? "bg-brand-green text-white"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    Connexion
                </button>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                {mode === "register" ? (
                    <form action={regAction} className="space-y-6">
                        {/* 1. Compte pro */}
                        <section className="space-y-3">
                            <h2 className="text-sm font-semibold text-brand-dark">
                                1. Créer votre compte professionnel
                            </h2>
                            <div className="space-y-3">
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    required
                                    className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-green"
                                />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Mot de passe"
                                    required
                                    className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-green"
                                />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirmer le mot de passe"
                                    required
                                    className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-green"
                                />
                            </div>
                        </section>

                        {/* 2. Infos pro (only first/last used in backend) */}
                        <section className="space-y-3">
                            <h2 className="text-sm font-semibold text-brand-dark">
                                2. Renseignez vos informations professionnelles
                            </h2>
                            <div className="grid gap-3 md:grid-cols-2">
                                <input
                                    name="lastName"
                                    placeholder="Nom"
                                    required
                                    className="rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-green"
                                />
                                <input
                                    name="firstName"
                                    placeholder="Prénom"
                                    required
                                    className="rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-green"
                                />
                            </div>
                            <input
                                placeholder="Adresse professionnelle"
                                className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-green"
                            />
                            <input
                                placeholder="Spécialité"
                                className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-green"
                            />
                        </section>

                        {/* 3–5 simplified to text */}
                        <section className="space-y-3 text-xs text-gray-600">
                            <p>
                                En validant, vous acceptez les conditions générales
                                d&apos;utilisation et vous recevrez par e-mail les
                                informations nécessaires à la formation prescripteur et à
                                l&apos;accès à votre page personnalisée.
                            </p>
                        </section>

                        {regState.error && (
                            <p className="text-xs text-red-500">{regState.error}</p>
                        )}

                        <div className="pt-2">
                            <SubmitButton label="Valider l’inscription" />
                        </div>
                    </form>
                ) : (
                    <form action={loginFormAction} className="space-y-5">
                        <h2 className="text-sm font-semibold text-brand-dark">
                            Se connecter à votre espace prescripteur
                        </h2>
                        <div className="space-y-3">
                            <input
                                name="email"
                                type="email"
                                placeholder="Adresse e-mail"
                                required
                                className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-green"
                            />
                            <input
                                name="password"
                                type="password"
                                placeholder="Mot de passe"
                                required
                                className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-brand-green"
                            />
                        </div>
                        {loginState.error && (
                            <p className="text-xs text-red-500">{loginState.error}</p>
                        )}
                        <SubmitButton label="Se connecter" />
                    </form>
                )}
            </div>
        </div>
    );
}
