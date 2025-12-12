// app/patient/[token]/patient-form.tsx (or wherever it lives)
"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import {PatientFormState, submitPatientForm} from "@/app/actions/patient/[token]/action";


type Props = {
    token: string;
};

const initialState: PatientFormState = {};

export function PatientForm({ token }: Props) {
    const [state, formAction] = useActionState<PatientFormState, FormData>(
        submitPatientForm,
        initialState
    );

    return (
        <form
            id="registration-form"
            className="mt-8 space-y-6 rounded-lg bg-white p-8 shadow-sm sm:p-10"
            method="post"
            action={formAction}
        >
            <input type="hidden" name="token" value={token} />

            <p
                id="form-subtitle"
                className="text-md text-center font-medium text-brand-text"
            >
                Complétez les informations ci-dessous pour recevoir votre dispositif.
            </p>

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

            <div id="options-section" className="space-y-6 pt-4">
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

            <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                Vous allez être facturé d&apos;un montant de <strong>49,50€</strong> pour le
                dispositif et de <strong>6,50€</strong> pour les frais de port. Soit un
                montant total de <strong>56€</strong>.
            </div>

            <div className="mt-4 flex items-start space-x-2">
                <input
                    type="checkbox"
                    id="acceptCgv"
                    name="acceptCgv"
                    className="mt-1 h-4 w-4"
                    required
                />
                <label
                    htmlFor="acceptCgv"
                    className="text-sm text-gray-700"
                >
                    J&apos;accepte les{" "}
                    <a
                        href={process.env.NEXT_PUBLIC_CDN_URL + 'cgv.pdf'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-green underline hover:no-underline"
                    >
                        conditions générales de vente
                    </a>{" "}
                    <span className="text-red-500">*</span>
                </label>
            </div>

            {state.error && (
                <p className="text-center text-xs text-red-500">{state.error}</p>
            )}

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
