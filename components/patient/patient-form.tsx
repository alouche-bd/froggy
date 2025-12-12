"use client";

import { useEffect, useState } from "react";

type Props = {
    token: string;
};

export function PatientForm({ token }: Props) {
    const [showApplePay, setShowApplePay] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const ua = window.navigator.userAgent || "";
        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

        setShowApplePay(isMobile);
    }, []);

    return (
        <form
            id="registration-form"
            className="mt-8 space-y-6 rounded-lg bg-white p-8 shadow-sm sm:p-10"
            method="post"
        >
            <p
                id="form-subtitle"
                className="text-md text-center font-medium text-brand-text"
            >
                Complétez les informations ci-dessous pour recevoir votre dispositif.
            </p>

            {/* Infos perso */}
            <div id="personal-info" className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Nom"
                        required
                        className="w-full rounded-md border border-brand-border px-4 py-3 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/50"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Prénom"
                        required
                        className="w-full rounded-md border border-brand-border px-4 py-3 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/50"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Adresse e-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Adresse e-mail"
                        required
                        className="w-full rounded-md border border-brand-border px-4 py-3 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/50"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="Téléphone"
                        required
                        className="w-full rounded-md border border-brand-border px-4 py-3 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/50"
                    />
                </div>
            </div>

            {/* Options taille / livraison */}
            <div id="options-section" className="space-y-6 pt-4">
                {/* Taille */}
                <div id="size-choice">
                    <label className="text-sm font-medium text-gray-700">
                        Choix de la taille <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 flex items-center space-x-6">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="size"
                                value="small"
                                className="h-4 w-4 text-brand-green focus:ring-brand-green/50"
                                required
                            />
                            <span className="ml-2 text-sm text-gray-600">Small</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="size"
                                value="medium"
                                className="h-4 w-4 text-brand-green focus:ring-brand-green/50"
                            />
                            <span className="ml-2 text-sm text-gray-600">Medium</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="size"
                                value="large"
                                className="h-4 w-4 text-brand-green focus:ring-brand-green/50"
                            />
                            <span className="ml-2 text-sm text-gray-600">Large</span>
                        </label>
                    </div>
                </div>

                {/* Livraison */}
                <div id="delivery-choice">
                    <label className="text-sm font-medium text-gray-700">
                        Choisissez le mode de livraison{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2 flex flex-col space-y-2">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="delivery"
                                value="practitioner"
                                className="h-4 w-4 text-brand-green focus:ring-brand-green/50"
                                required
                            />
                            <span className="ml-2 text-sm text-gray-600">
                Livraison au cabinet du thérapeute
              </span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="delivery"
                                value="address"
                                className="h-4 w-4 text-brand-green focus:ring-brand-green/50"
                            />
                            <span className="ml-2 text-sm text-gray-600">
                Livraison à l&apos;adresse indiquée
              </span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Adresse postale */}
            <div id="address-section" className="space-y-4 pt-4">
                <label className="text-sm font-medium text-gray-700">
                    Adresse postale
                </label>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="addressName"
                        placeholder="Nom"
                        required
                        className="w-full rounded-md border border-brand-border px-4 py-3 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/50"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Rue et numéro <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="street"
                        placeholder="Rue et numéro"
                        required
                        className="w-full rounded-md border border-brand-border px-4 py-3 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/50"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Code postal <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="zip"
                        placeholder="Code postal"
                        required
                        className="w-full rounded-md border border-brand-border px-4 py-3 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/50"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Ville <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="city"
                        placeholder="Ville"
                        required
                        className="w-full rounded-md border border-brand-border px-4 py-3 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/50"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Pays <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="country"
                        placeholder="Pays"
                        required
                        className="w-full rounded-md border border-brand-border px-4 py-3 outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/50"
                    />
                </div>
            </div>

            <div className="text-right text-xs italic text-gray-500">
                *Mentions obligatoires
            </div>

            {/* Paiement (pas de champ de formulaire réel ici, donc pas d’asterisque) */}
            <div id="payment-section" className="space-y-4 pt-4">
                <label className="text-sm font-medium text-gray-700">
                    Module sécurisé intégré
                </label>
                <div className="flex items-center space-x-4">
                    {showApplePay && (
                        <button
                            type="button"
                            className="flex items-center justify-center rounded-md border border-gray-300 bg-black px-6 py-2 text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            <span className="text-sm font-semibold">Apple Pay</span>
                        </button>
                    )}
                    <button
                        type="button"
                        className="flex w-16 items-center justify-center rounded-md border border-gray-300 bg-white py-2 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    >
                        <span className="text-xs font-semibold text-gray-600">CB</span>
                    </button>
                </div>
            </div>

            {/* Submit */}
            <div id="submit-section" className="pt-6 mx-auto flex justify-center">
                <button
                    type="submit"
                    className="inline-block cursor-pointer rounded-full bg-brand-green px-10 py-4 text-lg font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-opacity-90"
                >
                    Confirmer et payer
                </button>
            </div>
        </form>
    );
}
