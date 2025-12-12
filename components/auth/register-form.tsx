"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { registerAction, type AuthState } from "../../app/actions/auth/action";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-block cursor-pointer rounded-full bg-brand-green px-10 py-4 text-lg font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-opacity-90 disabled:opacity-60"
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

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setClientError(null);

        const form = event.currentTarget;
        const formData = new FormData(form);

        const password = String(formData.get("password") ?? "");
        const confirmPassword = String(formData.get("confirmPassword") ?? "");

        if (password.length < 8) {
            // ❌ front error → block submission (no pending)
            event.preventDefault();
            setClientError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if (password !== confirmPassword) {
            // ❌ front error → block submission (no pending)
            event.preventDefault();
            setClientError("Les mots de passe ne correspondent pas.");
            return;
        }

        // ✅ no preventDefault => React will run `formAction` via the `action` prop
        // and manage pending correctly. We don't call formAction() manually.
    };

    return (
        <main id="main-content" className="container mx-auto px-6 py-16">
            <div id="registration-form-container" className="mx-auto max-w-3xl">
                {/* Header */}
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
                    action={formAction}        // ✅ React/Next will call the server action
                    onSubmit={handleSubmit}   // ✅ we only preventDefault on front errors
                    className="space-y-10"
                >
                    {/* 1. Compte pro */}
                    <section id="step-1-account" className="space-y-4">
                        <h2 className="text-xl font-semibold text-brand-dark">
                            1. Créer votre compte professionnel
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="email-account"
                                    className="mb-1 block text-sm font-medium text-brand-dark"
                                >
                                    Adresse e-mail <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email-account"
                                    name="email"
                                    placeholder="Adresse e-mail"
                                    required
                                />
                            </div>

                            {/* Mot de passe avec eye icon */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1 block text-sm font-medium text-brand-dark"
                                >
                                    Mot de passe <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        placeholder="Mot de passe"
                                        minLength={8}
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible((v) => !v)}
                                        className="absolute cursor-pointer outline-0 inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                        aria-label={
                                            passwordVisible
                                                ? "Masquer le mot de passe"
                                                : "Afficher le mot de passe"
                                        }
                                    >
                                        {passwordVisible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Le mot de passe doit contenir au moins 8 caractères.
                                </p>
                            </div>

                            {/* Confirmation mot de passe avec eye icon */}
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="mb-1 block text-sm font-medium text-brand-dark"
                                >
                                    Confirmer le mot de passe{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={confirmVisible ? "text" : "password"}
                                        id="confirm-password"
                                        name="confirmPassword"
                                        placeholder="Confirmer le mot de passe"
                                        minLength={8}
                                        required
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setConfirmVisible((v) => !v)}
                                        className="absolute cursor-pointer outline-0 inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                        aria-label={
                                            confirmVisible
                                                ? "Masquer la confirmation"
                                                : "Afficher la confirmation"
                                        }
                                    >
                                        {confirmVisible ? (
                                            <FiEyeOff size={18} />
                                        ) : (
                                            <FiEye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Infos pro */}
                    <section id="step-2-professional-info" className="space-y-4">
                        <h2 className="text-xl font-semibold text-brand-dark">
                            2. Renseignez vos informations professionnelles
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="last-name"
                                        className="mb-1 block text-sm font-medium text-brand-dark"
                                    >
                                        Nom <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="last-name"
                                        name="lastName"
                                        placeholder="Nom"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="first-name"
                                        className="mb-1 block text-sm font-medium text-brand-dark"
                                    >
                                        Prénom <span className="text-red-500">*</span>
                                    </label>
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
                                    className="mb-1 block text-sm font-medium text-brand-dark"
                                >
                                    Adresse professionnelle <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="professional-address"
                                    name="professional-address"
                                    placeholder="Adresse professionnelle"
                                    required
                                />
                            </div>

                            {/* Code postal + Ville */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="postal-code"
                                        className="mb-1 block text-sm font-medium text-brand-dark"
                                    >
                                        Code postal <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="postal-code"
                                        name="postalCode"
                                        placeholder="Code postal"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="city"
                                        className="mb-1 block text-sm font-medium text-brand-dark"
                                    >
                                        Ville <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        placeholder="Ville"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Spécialité as select */}
                            <div>
                                <label
                                    htmlFor="specialty"
                                    className="mb-1 block text-sm font-medium text-brand-dark"
                                >
                                    Spécialité <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="specialty"
                                    name="specialty"
                                    required
                                    className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/30"
                                >
                                    <option value="">Sélectionnez une spécialité</option>
                                    <option value="orthophoniste">Orthophoniste</option>
                                    <option value="kinesitherapeute">Kinésithérapeute</option>
                                    <option value="osteopathe">Ostéopathe</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>

                            {/* ADELI / SIRET */}
                            <div>
                                <label
                                    htmlFor="siret"
                                    className="mb-1 block text-sm font-medium text-brand-dark"
                                >
                                    Numéro ADELI ou SIRET{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="siret"
                                    name="siret"
                                    placeholder="Numéro ADELI ou SIRET"
                                    required
                                />
                            </div>

                            {/* Froggymouth déjà utilisé ? */}
                            <div className="flex flex-col space-y-2 pt-2 md:flex-row md:items-center md:space-y-0 md:space-x-6">
                                <p className="text-sm text-gray-700">
                                    Avez-vous déjà utilisé le Froggymouth ?{" "}
                                    <span className="text-red-500">*</span>
                                </p>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            id="used-yes"
                                            name="used-froggymouth"
                                            value="yes"
                                            className="form-radio h-4 w-4"
                                            required
                                        />
                                        <label htmlFor="used-yes" className="text-gray-700 text-sm">
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
                                        <label htmlFor="used-no" className="text-gray-700 text-sm">
                                            Non
                                        </label>
                                    </div>
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
                                required
                            />
                            <label htmlFor="terms" className="text-gray-700 text-sm">
                                J&apos;accepte les conditions générales d&apos;utilisation{" "}
                                <span className="text-red-500">*</span>
                            </label>
                        </div>
                    </section>

                    {/* 4. Formation */}
                    <section id="step-4-training" className="space-y-4">
                        <h2 className="text-xl font-semibold text-brand-dark">
                            4. Formation prescripteur <span className="text-red-500">*</span>
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <input
                                    type="radio"
                                    id="training-done"
                                    name="training"
                                    value="done"
                                    className="form-radio mt-1 h-5 w-5"
                                    required
                                />
                                <label htmlFor="training-done" className="text-gray-700 text-sm">
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
                                    className="text-gray-700 text-sm"
                                >
                                    Je m&apos;engage à suivre la formation prescripteur en ligne
                                    dans les 3 mois <br />
                                    <span className="text-sm text-gray-500">
                    (Vous recevrez toutes les informations par e-mail après
                    validation de votre inscription)
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
                            <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700 text-sm">
                                <li>Un lien personnalisé</li>
                                <li>Un QR code</li>
                            </ul>
                        </div>
                    </section>

                    {/* Errors: client OR API */}
                    {(clientError || state.error) && (
                        <p className="text-center text-xs text-red-500">
                            {clientError ?? state.error}
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
