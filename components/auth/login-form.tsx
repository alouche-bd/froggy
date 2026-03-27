"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
    loginAction,
    type AuthState,
} from "@/app/actions/auth/action";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-block cursor-pointer rounded-full bg-brand-green px-10 py-4 text-lg font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-opacity-90 disabled:opacity-60"
        >
            {pending ? "Connexion en cours..." : "Se connecter"}
        </button>
    );
}

export function LoginForm() {
    const [state, formAction] = useActionState<AuthState, FormData>(
        loginAction,
        {}
    );

    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <main className="container mx-auto px-6 py-16">
            <div className="mx-auto max-w-3xl">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-light text-brand-green">
                        Se connecter à votre espace prescripteur
                    </h1>
                    <p className="text-lg font-semibold text-brand-dark">
                        Accédez à votre tableau de bord Froggymouth
                    </p>
                    <p className="mt-1 text-gray-600">
                        Retrouvez vos prescriptions, vos patients et vos QR codes.
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                    <form action={formAction} className="space-y-8">
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-brand-dark">
                                Connexion
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="sr-only">
                                        Adresse e-mail
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Adresse e-mail"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="password" className="sr-only">
                                        Mot de passe
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            placeholder="Mot de passe"
                                            required
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setPasswordVisible((v) => !v)}
                                            className="absolute inset-y-0 right-3 flex cursor-pointer items-center text-gray-500 outline-0 hover:text-gray-700"
                                            aria-label={
                                                passwordVisible
                                                    ? "Masquer le mot de passe"
                                                    : "Afficher le mot de passe"
                                            }
                                        >
                                            {passwordVisible ? (
                                                <FiEyeOff size={18} />
                                            ) : (
                                                <FiEye size={18} />
                                            )}
                                        </button>
                                    </div>
                                    <div className="mt-1 text-right">
                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-xs text-brand-green underline hover:no-underline"
                                        >
                                            Mot de passe oublié ?
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {state.error && (
                            <p className="text-center text-xs text-red-500">
                                {state.error}
                            </p>
                        )}

                        <div className="pt-4 text-center">
                            <SubmitButton />
                        </div>

                        <div className="pt-4 text-center text-xs text-gray-500">
                            Vous n&apos;avez pas encore de compte ?{" "}
                            <Link
                                href="/auth/register"
                                className="text-brand-green underline hover:no-underline"
                            >
                                Devenir prescripteur
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
