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

// ---------- CSV helper (local) ----------

type CsvColumn<T> = {
    key: keyof T;
    header: string;
    format?: (value: any, row: T) => string;
};

function downloadCsv<T extends Record<string, any>>(
    rows: T[],
    columns: CsvColumn<T>[],
    filename: string
) {
    if (!rows || rows.length === 0) {
        alert("Aucune donnée à exporter.");
        return;
    }

    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;

    const headerLine = columns
        .map((col) => escape(col.header))
        .join(";"); // ; works better for FR Excel

    const bodyLines = rows.map((row) =>
        columns
            .map((col) => {
                const raw = col.format
                    ? col.format(row[col.key], row)
                    : row[col.key];
                const str = raw == null ? "" : String(raw);
                return escape(str);
            })
            .join(";")
    );

    const csvContent = [headerLine, ...bodyLines].join("\r\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}

// ---------- utils ----------

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

    const handleDownload = (tab: TabId) => {
        if (tab === "users") {
            downloadCsv(
                users,
                [
                    { key: "lastName", header: "Nom" },
                    { key: "firstName", header: "Prénom" },
                    { key: "email", header: "E-mail" },
                    { key: "specialty", header: "Spécialité" },
                    { key: "city", header: "Ville" },
                    {
                        key: "createdAt",
                        header: "Créé le",
                        format: (v) => formatDate(v),
                    },
                ],
                "utilisateurs.csv"
            );
        }

        if (tab === "patients") {
            downloadCsv(
                patients,
                [
                    {
                        key: "name",
                        header: "Nom",
                        format: (_v, row) => splitName(row.name).lastName,
                    },
                    {
                        key: "name",
                        header: "Prénom",
                        format: (_v, row) => splitName(row.name).firstName,
                    },
                    { key: "email", header: "E-mail" },
                    {
                        key: "phone",
                        header: "Téléphone",
                    },
                    { key: "city", header: "Ville" },
                ],
                "patients.csv"
            );
        }

        if (tab === "orders") {
            downloadCsv(
                orders,
                [
                    {
                        key: "patientName",
                        header: "Nom",
                        format: (_v, row) => splitName(row.patientName).lastName,
                    },
                    {
                        key: "patientName",
                        header: "Prénom",
                        format: (_v, row) => splitName(row.patientName).firstName,
                    },
                    { key: "prescriber", header: "Prescripteur" },
                    {
                        key: "createdAt",
                        header: "Date de commande",
                        format: (v) => formatDate(v),
                    },
                    { key: "size", header: "Taille choisie" },
                ],
                "commandes.csv"
            );
        }
    };

    return (
        <main className="bg-brand-gray-light text-gray-800">
            <div className="container mx-auto px-8 py-16">
                {/* Title */}
                <section className="mb-8 text-center">
                    <h1 className="mb-2 text-4xl font-bold text-brand-green">
                        Tableau de bord administrateur
                    </h1>
                    <p className="text-sm text-gray-700">
                        Gérez les utilisateurs, les patients et les commandes.
                    </p>
                </section>

                {/* Tabs */}
                <div className="mb-8 flex flex-wrap justify-center gap-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`cursor-pointer rounded-full border px-6 py-2 text-sm font-semibold transition-colors
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
                    {/* Top line: title + export button */}
                    <div className="mb-4 flex items-center justify-between">
                        {activeTab === "users" && (
                            <h2 className="text-lg font-bold">Utilisateurs</h2>
                        )}
                        {activeTab === "patients" && (
                            <h2 className="text-lg font-bold">Patients</h2>
                        )}
                        {activeTab === "orders" && (
                            <h2 className="text-lg font-bold">Commandes</h2>
                        )}

                        <button
                            type="button"
                            onClick={() => handleDownload(activeTab)}
                            className="rounded-full bg-brand-green px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-opacity-90"
                        >
                            Télécharger (Excel)
                        </button>
                    </div>

                    {activeTab === "users" && (
                        <>
                            <p className="mb-6 text-sm text-gray-600">
                                Liste des prescripteurs créés sur la plateforme.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                    <tr className="bg-brand-green text-white">
                                        <th className="rounded-l-lg p-4 font-semibold">Nom</th>
                                        <th className="p-4 font-semibold">Prénom</th>
                                        <th className="p-4 font-semibold">E-mail</th>
                                        <th className="p-4 font-semibold">Spécialité</th>
                                        <th className="p-4 font-semibold">Ville</th>
                                        <th className="rounded-r-lg p-4 font-semibold">
                                            Créé le
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.length === 0 ? (
                                        <tr className="border-b border-gray-200">
                                            <td
                                                colSpan={6}
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
                            <p className="mb-6 text-sm text-gray-600">
                                Patients ayant passé une commande via la plateforme.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                    <tr className="bg-brand-green text-white">
                                        <th className="rounded-l-lg p-4 font-semibold">Nom</th>
                                        <th className="p-4 font-semibold">Prénom</th>
                                        <th className="p-4 font-semibold">E-mail</th>
                                        <th className="p-4 font-semibold">Téléphone</th>
                                        <th className="rounded-r-lg p-4 font-semibold">
                                            Ville
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {patients.length === 0 ? (
                                        <tr className="border-b border-gray-200">
                                            <td
                                                colSpan={5}
                                                className="p-4 text-center text-xs text-gray-500"
                                            >
                                                Aucun patient pour le moment.
                                            </td>
                                        </tr>
                                    ) : (
                                        patients.map((p) => {
                                            const { lastName, firstName } = splitName(p.name);
                                            return (
                                                <tr
                                                    key={p.id}
                                                    className="border-b border-gray-200"
                                                >
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
                            <p className="mb-6 text-sm text-gray-600">
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
                                                colSpan={5}
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
                                                    <td className="p-4 capitalize">
                                                        {order.prescriber}
                                                    </td>
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
