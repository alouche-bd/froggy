"use client";

import { useFormState, useFormStatus } from "react-dom";
import { registerAction, type AuthState } from "../../app/actions/auth/action";
import {useActionState} from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-block cursor-pointer rounded-full bg-brand-green px-10 py-4 text-lg font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-opacity-90"
        >
            {pending ? "Veuillez patienter..." : "Valider l'inscription"}
        </button>
    );
}

export function RegisterForm() {
    const [state, formAction] = useActionState<AuthState, FormData>(
        registerAction,
        {}
    );

    return (
        <main id="main-content" className="container mx-auto px-6 py-16">
            <div
                id="registration-form-container"
                className="mx-auto max-w-3xl"
            >
                {/* Header identical to your HTML */}
                <div id="form-header" className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-light text-brand-green">
                        Devenir prescripteur Froggymouth
                    </h1>
                    <p className="text-lg font-semibold text-brand-dark">
                        Vous souhaitez utiliser Froggymouth avec vos patients ?
                    </p>
                    <p className="mt-1 text-gray-600">
                        Voici les étapes pour devenir prescripteur agréé :
                    </p>
                </div>

                {/* FORM */}
                <form
                    id="registration-form"
                    action={formAction}
                    className="space-y-10"
                >
                    {/* 1. Compte pro */}
                    <section id="step-1-account" className="space-y-4">
                        <h2 className="text-xl font-semibold text-brand-dark">
                            1. Créer votre compte professionnel
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email-account" className="sr-only">
                                    Adresse e-mail
                                </label>
                                {/* backend expects name="email" */}
                                <input
                                    type="email"
                                    id="email-account"
                                    name="email"
                                    placeholder="Adresse e-mail"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Mot de passe"
                                    required
                                />
                            </div>
                            {/* NEW: confirm password, same style */}
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="sr-only"
                                >
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    name="confirmPassword"
                                    placeholder="Confirmer le mot de passe"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* 2. Infos pro */}
                    <section
                        id="step-2-professional-info"
                        className="space-y-4"
                    >
                        <h2 className="text-xl font-semibold text-brand-dark">
                            2. Renseignez vos informations professionnelles
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label htmlFor="last-name" className="sr-only">
                                        Nom
                                    </label>
                                    {/* backend expects name="lastName" */}
                                    <input
                                        type="text"
                                        id="last-name"
                                        name="lastName"
                                        placeholder="Nom"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="first-name" className="sr-only">
                                        Prénom
                                    </label>
                                    {/* backend expects name="firstName" */}
                                    <input
                                        type="text"
                                        id="first-name"
                                        name="firstName"
                                        placeholder="Prénom"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="professional-address"
                                    className="sr-only"
                                >
                                    Adresse professionnelle
                                </label>
                                <input
                                    type="text"
                                    id="professional-address"
                                    name="professional-address"
                                    placeholder="Adresse professionnelle"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email-pro" className="sr-only">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    id="email-pro"
                                    name="email-pro"
                                    placeholder="E-mail"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="specialty" className="sr-only">
                                    Spécialité
                                </label>
                                <input
                                    type="text"
                                    id="specialty"
                                    name="specialty"
                                    placeholder="Spécialité"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="siret" className="sr-only">
                                    Numéro ADELI ou SIRET
                                </label>
                                <input
                                    type="text"
                                    id="siret"
                                    name="siret"
                                    placeholder="Numéro ADELI ou SIRET"
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-6 pt-2">
                                <p className="text-gray-700">
                                    Avez-vous déjà utilisé le Froggymouth ?
                                </p>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="used-yes"
                                        name="used-froggymouth"
                                        value="yes"
                                        className="form-radio h-4 w-4"
                                    />
                                    <label
                                        htmlFor="used-yes"
                                        className="text-gray-700"
                                    >
                                        Oui
                                    </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="used-no"
                                        name="used-froggymouth"
                                        value="no"
                                        className="form-radio h-4 w-4"
                                    />
                                    <label
                                        htmlFor="used-no"
                                        className="text-gray-700"
                                    >
                                        Non
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. Conditions */}
                    <section id="step-3-conditions" className="space-y-4">
                        <h2 className="text-xl font-semibold text-brand-dark">
                            3. Acceptez les conditions générales
                        </h2>
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                className="form-checkbox h-5 w-5 rounded"
                            />
                            <label
                                htmlFor="terms"
                                className="text-gray-700"
                            >
                                J&apos;accepte les conditions générales
                                d&apos;utilisation
                            </label>
                        </div>
                    </section>

                    {/* 4. Formation */}
                    <section id="step-4-training" className="space-y-4">
                        <h2 className="text-xl font-semibold text-brand-dark">
                            4. Formation prescripteur
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="radio"
                                    id="training-done"
                                    name="training"
                                    value="done"
                                    className="form-radio mt-1 h-5 w-5"
                                />
                                <label
                                    htmlFor="training-done"
                                    className="text-gray-700"
                                >
                                    J&apos;ai déjà suivi la formation Froggymouth
                                </label>
                            </div>
                            <div className="flex items-start space-x-3">
                                <input
                                    type="radio"
                                    id="training-commit"
                                    name="training"
                                    value="commit"
                                    className="form-radio mt-1 h-5 w-5"
                                />
                                <label
                                    htmlFor="training-commit"
                                    className="text-gray-700"
                                >
                                    Je m&apos;engage à suivre la formation
                                    prescripteur en ligne dans les 3 mois <br />
                                    <span className="text-sm text-gray-500">
                    (Vous recevrez toutes les informations par
                    e-mail après validation de votre inscription)
                  </span>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* 5. Accès */}
                    <section id="step-5-access" className="space-y-3">
                        <h2 className="text-xl font-semibold text-brand-dark">
                            5. Accédez à votre page personnalisée
                        </h2>
                        <div>
                            <p className="text-gray-700">
                                Après validation, vous aurez accès à :
                            </p>
                            <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                                <li>Un lien personnalisé</li>
                                <li>Un QR code</li>
                            </ul>
                        </div>
                    </section>

                    {/* Error from backend (including "Les mots de passe ne correspondent pas") */}
                    {state.error && (
                        <p className="text-center text-xs text-red-500">
                            {state.error}
                        </p>
                    )}

                    {/* Submit */}
                    <div id="form-submit" className="pt-6 text-center">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </main>
    );
}
