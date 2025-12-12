"use client";

import { useState } from "react";
import type {
    AdminUserRow,
    AdminPatientRow,
    AdminOrderRow,
} from "@/lib/admin";

type Props = {
    users: AdminUserRow[];
    patients: AdminPatientRow[];
    orders: AdminOrderRow[];
};

type TabId = "users" | "patients" | "orders";

const tabs: { id: TabId; label: string }[] = [
    { id: "users", label: "Utilisateurs" },
    { id: "patients", label: "Patients" },
    { id: "orders", label: "Commandes" },
];

const formatDate = (value: string) => {
    const d = new Date(value);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

const splitName = (fullName: string) => {
    if (!fullName) return { lastName: "", firstName: "" };
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return { lastName: parts[0], firstName: "" };
    return {
        lastName: parts[parts.length - 1],
        firstName: parts.slice(0, -1).join(" "),
    };
};

export function AdminDashboard({ users, patients, orders }: Props) {
    const [activeTab, setActiveTab] = useState<TabId>("orders");

    return (
        <main className="bg-brand-gray-light text-gray-800">
            <div className="container mx-auto px-8 py-16">
                {/* Title */}
                <section className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-brand-green mb-2">
                        Tableau de bord administrateur
                    </h1>
                    <p className="text-gray-700 text-sm">
                        Gérez les utilisateurs, les patients et les commandes.
                    </p>
                </section>

                {/* Tabs */}
                <div className="mb-8 flex flex-wrap gap-3 justify-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`rounded-full cursor-pointer px-6 py-2 text-sm font-semibold border transition-colors
                ${
                                activeTab === tab.id
                                    ? "bg-brand-green text-white border-brand-green"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-brand-green hover:text-brand-green"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <section className="rounded-xl bg-white p-8 shadow-md">
                    {activeTab === "users" && (
                        <>
                            <h2 className="text-lg font-bold mb-2">Utilisateurs</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Liste des prescripteurs créés sur la plateforme.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                    <tr className="bg-brand-green text-white">
                                        <th className="p-4 font-semibold rounded-l-lg">Nom</th>
                                        <th className="p-4 font-semibold">Prénom</th>
                                        <th className="p-4 font-semibold">E-mail</th>
                                        <th className="p-4 font-semibold">Spécialité</th>
                                        <th className="p-4 font-semibold">Ville</th>
                                        <th className="p-4 font-semibold rounded-r-lg">
                                            Créé le
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.length === 0 ? (
                                        <tr className="border-b border-gray-200">
                                            <td
                                                colSpan={4}
                                                className="p-4 text-center text-xs text-gray-500"
                                            >
                                                Aucun utilisateur pour le moment.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((u) => (
                                            <tr key={u.id} className="border-b border-gray-200">
                                                <td className="p-4 capitalize">{u.lastName}</td>
                                                <td className="p-4 capitalize">{u.firstName}</td>
                                                <td className="p-4">{u.email}</td>
                                                <td className="p-4">{u.specialty}</td>
                                                <td className="p-4">{u.city}</td>
                                                <td className="p-4">{formatDate(u.createdAt)}</td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === "patients" && (
                        <>
                            <h2 className="text-lg font-bold mb-2">Patients</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Patients ayant passé une commande via la plateforme.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                    <tr className="bg-brand-green text-white">
                                        <th className="p-4 font-semibold rounded-l-lg">Nom</th>
                                        <th className="p-4 font-semibold">Prénom</th>
                                        <th className="p-4 font-semibold">E-mail</th>
                                        <th className="p-4 font-semibold">Téléphone</th>
                                        <th className="p-4 font-semibold rounded-r-lg">
                                            Ville
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {patients.length === 0 ? (
                                        <tr className="border-b border-gray-200">
                                            <td
                                                colSpan={4}
                                                className="p-4 text-center text-xs text-gray-500"
                                            >
                                                Aucun patient pour le moment.
                                            </td>
                                        </tr>
                                    ) : (
                                        patients.map((p) => {
                                            const { lastName, firstName } = splitName(p.name);
                                            return (
                                                <tr key={p.id} className="border-b border-gray-200">
                                                    <td className="p-4 capitalize">{lastName}</td>
                                                    <td className="p-4 capitalize">{firstName}</td>
                                                    <td className="p-4">{p.email}</td>
                                                    <td className="p-4">{p.phone || "—"}</td>
                                                    <td className="p-4">{p.city}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {activeTab === "orders" && (
                        <>
                            <h2 className="text-lg font-bold mb-2">Commandes</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Suivi global des commandes passées par les patients.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                    <tr className="bg-brand-green text-white">
                                        <th className="rounded-l-lg p-4 font-semibold">Nom</th>
                                        <th className="p-4 font-semibold">Prénom</th>
                                        <th className="p-4 font-semibold">Prescripteur</th>
                                        <th className="p-4 font-semibold">Date de commande</th>
                                        <th className="rounded-r-lg p-4 font-semibold">
                                            Taille choisie
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.length === 0 ? (
                                        <tr className="border-b border-gray-200">
                                            <td
                                                colSpan={4}
                                                className="p-4 text-center text-xs text-gray-500"
                                            >
                                                Aucune commande pour le moment.
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => {
                                            const { lastName, firstName } = splitName(
                                                order.patientName
                                            );
                                            return (
                                                <tr
                                                    key={order.id}
                                                    className="border-b border-gray-200"
                                                >
                                                    <td className="p-4 capitalize">{lastName}</td>
                                                    <td className="p-4 capitalize">{firstName}</td>
                                                    <td className="p-4 capitalize">{order.prescriber}</td>
                                                    <td className="p-4">
                                                        {formatDate(order.createdAt)}
                                                    </td>
                                                    <td className="p-4">{order.size}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}
