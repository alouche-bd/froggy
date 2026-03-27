"use client";

import { useState, useMemo } from "react";
import { FaSort, FaSortUp, FaSortDown, FaFilter } from "react-icons/fa";
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

type SortConfig<T> = {
    key: keyof T | "lastName" | "firstName"; // For patients and orders we use derived fields
    direction: "asc" | "desc" | null;
};

export function AdminDashboard({ users, patients, orders }: Props) {
    const [activeTab, setActiveTab] = useState<TabId>("orders");
    const [sortConfig, setSortConfig] = useState<Record<TabId, SortConfig<any>>>({
        users: { key: "createdAt", direction: "desc" },
        patients: { key: "createdAt", direction: "desc" },
        orders: { key: "createdAt", direction: "desc" },
    });

    // Filtering states
    const [showFilters, setShowFilters] = useState(false);
    const [orderFilters, setOrderFilters] = useState({
        paymentStatus: "",
        size: "",
    });

    const requestSort = (tab: TabId, key: string) => {
        let direction: "asc" | "desc" | null = "asc";
        if (sortConfig[tab].key === key && sortConfig[tab].direction === "asc") {
            direction = "desc";
        } else if (sortConfig[tab].key === key && sortConfig[tab].direction === "desc") {
            direction = null;
        }
        setSortConfig((prev) => ({ ...prev, [tab]: { key, direction } }));
    };

    const sortedUsers = useMemo(() => {
        const { key, direction } = sortConfig.users;
        if (!direction) return users;

        return [...users].sort((a, b) => {
            const valA = a[key as keyof AdminUserRow] ?? "";
            const valB = b[key as keyof AdminUserRow] ?? "";

            if (typeof valA === "string" && typeof valB === "string") {
                return direction === "asc"
                    ? valA.localeCompare(valB, "fr", { sensitivity: "accent" })
                    : valB.localeCompare(valA, "fr", { sensitivity: "accent" });
            }

            if (valA < valB) return direction === "asc" ? -1 : 1;
            if (valA > valB) return direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [users, sortConfig.users]);

    const sortedPatients = useMemo(() => {
        const { key, direction } = sortConfig.patients;
        if (!direction) return patients;

        return [...patients].sort((a, b) => {
            let valA: any;
            let valB: any;

            if (key === "lastName") {
                valA = splitName(a.name).lastName;
                valB = splitName(b.name).lastName;
            } else if (key === "firstName") {
                valA = splitName(a.name).firstName;
                valB = splitName(b.name).firstName;
            } else {
                valA = a[key as keyof AdminPatientRow] ?? "";
                valB = b[key as keyof AdminPatientRow] ?? "";
            }

            if (typeof valA === "string" && typeof valB === "string") {
                return direction === "asc"
                    ? valA.localeCompare(valB, "fr", { sensitivity: "accent" })
                    : valB.localeCompare(valA, "fr", { sensitivity: "accent" });
            }

            if (valA < valB) return direction === "asc" ? -1 : 1;
            if (valA > valB) return direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [patients, sortConfig.patients]);

    const sortedOrders = useMemo(() => {
        let filtered = [...orders];

        if (orderFilters.paymentStatus) {
            filtered = filtered.filter((o) => o.paymentStatus === orderFilters.paymentStatus);
        }
        if (orderFilters.size) {
            filtered = filtered.filter((o) => o.size === orderFilters.size);
        }

        const { key, direction } = sortConfig.orders;
        if (!direction) return filtered;

        return filtered.sort((a, b) => {
            let valA: any;
            let valB: any;

            if (key === "lastName") {
                valA = splitName(a.patientName).lastName;
                valB = splitName(b.patientName).lastName;
            } else if (key === "firstName") {
                valA = splitName(a.patientName).firstName;
                valB = splitName(b.patientName).firstName;
            } else {
                valA = a[key as keyof AdminOrderRow] ?? "";
                valB = b[key as keyof AdminOrderRow] ?? "";
            }

            if (typeof valA === "string" && typeof valB === "string") {
                return direction === "asc"
                    ? valA.localeCompare(valB, "fr", { sensitivity: "accent" })
                    : valB.localeCompare(valA, "fr", { sensitivity: "accent" });
            }

            if (valA < valB) return direction === "asc" ? -1 : 1;
            if (valA > valB) return direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [orders, sortConfig.orders, orderFilters]);

    const getSortIcon = (tab: TabId, key: string) => {
        if (sortConfig[tab].key !== key || !sortConfig[tab].direction) {
            return <FaSort className="ml-1 inline h-3 w-3 opacity-30 group-hover:opacity-100" />;
        }
        return sortConfig[tab].direction === "asc" ? (
            <FaSortUp className="ml-1 inline h-3 w-3" />
        ) : (
            <FaSortDown className="ml-1 inline h-3 w-3" />
        );
    };

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
                sortedOrders,
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
                    {
                        key: "paymentStatus",
                        header: "Paiement",
                        format: (v) => {
                            if (v === "PAID") return "Payée";
                            if (v === "PENDING") return "En attente";
                            if (v === "FAILED") return "Échoué";
                            return "Non payée";
                        },
                    },
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

                        <div className="flex gap-2">
                            {activeTab === "orders" && (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow-sm transition-colors ${
                                            showFilters || orderFilters.paymentStatus || orderFilters.size
                                                ? "bg-brand-green text-white border-brand-green"
                                                : "bg-white text-gray-700 border-gray-200 hover:border-brand-green hover:text-brand-green"
                                        }`}
                                    >
                                        <FaFilter /> Filtrer
                                    </button>

                                    {showFilters && (
                                        <div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-xl">
                                            <div className="mb-4">
                                                <label className="mb-1 block text-xs font-bold text-gray-700">
                                                    Statut de paiement
                                                </label>
                                                <select
                                                    className="w-full rounded border border-gray-300 p-2 text-xs"
                                                    value={orderFilters.paymentStatus}
                                                    onChange={(e) =>
                                                        setOrderFilters((prev) => ({
                                                            ...prev,
                                                            paymentStatus: e.target.value,
                                                        }))
                                                    }
                                                >
                                                    <option value="">Tous</option>
                                                    <option value="PAID">Payée</option>
                                                    <option value="PENDING">En attente</option>
                                                    <option value="FAILED">Échoué</option>
                                                </select>
                                            </div>

                                            <div className="mb-4">
                                                <label className="mb-1 block text-xs font-bold text-gray-700">
                                                    Taille
                                                </label>
                                                <select
                                                    className="w-full rounded border border-gray-300 p-2 text-xs"
                                                    value={orderFilters.size}
                                                    onChange={(e) =>
                                                        setOrderFilters((prev) => ({
                                                            ...prev,
                                                            size: e.target.value,
                                                        }))
                                                    }
                                                >
                                                    <option value="">Toutes</option>
                                                    <option value="SMALL">SMALL</option>
                                                    <option value="MEDIUM">MEDIUM</option>
                                                    <option value="LARGE">LARGE</option>
                                                </select>
                                            </div>

                                            <div className="flex justify-between">
                                                <button
                                                    type="button"
                                                    className="text-xs text-red-600 hover:underline"
                                                    onClick={() =>
                                                        setOrderFilters({ paymentStatus: "", size: "" })
                                                    }
                                                >
                                                    Réinitialiser
                                                </button>
                                                <button
                                                    type="button"
                                                    className="text-xs font-bold text-brand-green hover:underline"
                                                    onClick={() => setShowFilters(false)}
                                                >
                                                    Fermer
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => handleDownload(activeTab)}
                                className="rounded-full bg-brand-green px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-opacity-90"
                            >
                                Télécharger (Excel)
                            </button>
                        </div>
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
                                        <th
                                            className="group cursor-pointer rounded-l-lg p-4 font-semibold"
                                            onClick={() => requestSort("users", "lastName")}
                                        >
                                            Nom {getSortIcon("users", "lastName")}
                                        </th>
                                        <th
                                            className="group cursor-pointer p-4 font-semibold"
                                            onClick={() => requestSort("users", "firstName")}
                                        >
                                            Prénom {getSortIcon("users", "firstName")}
                                        </th>
                                        <th
                                            className="group cursor-pointer p-4 font-semibold"
                                            onClick={() => requestSort("users", "email")}
                                        >
                                            E-mail {getSortIcon("users", "email")}
                                        </th>
                                        <th
                                            className="group cursor-pointer p-4 font-semibold"
                                            onClick={() => requestSort("users", "specialty")}
                                        >
                                            Spécialité {getSortIcon("users", "specialty")}
                                        </th>
                                        <th
                                            className="group cursor-pointer p-4 font-semibold"
                                            onClick={() => requestSort("users", "city")}
                                        >
                                            Ville {getSortIcon("users", "city")}
                                        </th>
                                        <th
                                            className="group cursor-pointer rounded-r-lg p-4 font-semibold"
                                            onClick={() => requestSort("users", "createdAt")}
                                        >
                                            Créé le {getSortIcon("users", "createdAt")}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sortedUsers.length === 0 ? (
                                        <tr className="border-b border-gray-200">
                                            <td
                                                colSpan={6}
                                                className="p-4 text-center text-xs text-gray-500"
                                            >
                                                Aucun utilisateur pour le moment.
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedUsers.map((u) => (
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
                                        <th
                                            className="group cursor-pointer rounded-l-lg p-4 font-semibold"
                                            onClick={() => requestSort("patients", "lastName")}
                                        >
                                            Nom {getSortIcon("patients", "lastName")}
                                        </th>
                                        <th
                                            className="group cursor-pointer p-4 font-semibold"
                                            onClick={() => requestSort("patients", "firstName")}
                                        >
                                            Prénom {getSortIcon("patients", "firstName")}
                                        </th>
                                        <th
                                            className="group cursor-pointer p-4 font-semibold"
                                            onClick={() => requestSort("patients", "email")}
                                        >
                                            E-mail {getSortIcon("patients", "email")}
                                        </th>
                                        <th
                                            className="group cursor-pointer p-4 font-semibold"
                                            onClick={() => requestSort("patients", "phone")}
                                        >
                                            Téléphone {getSortIcon("patients", "phone")}
                                        </th>
                                        <th
                                            className="group cursor-pointer rounded-r-lg p-4 font-semibold"
                                            onClick={() => requestSort("patients", "city")}
                                        >
                                            Ville {getSortIcon("patients", "city")}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sortedPatients.length === 0 ? (
                                        <tr className="border-b border-gray-200">
                                            <td
                                                colSpan={5}
                                                className="p-4 text-center text-xs text-gray-500"
                                            >
                                                Aucun patient pour le moment.
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedPatients.map((p) => {
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
                                        <th
                                            className="group cursor-pointer rounded-l-lg p-4 font-semibold"
                                            onClick={() => requestSort("orders", "lastName")}
                                        >
                                            Nom {getSortIcon("orders", "lastName")}
                                        </th>
                                        <th
                                            className="group cursor-pointer p-4 font-semibold"
                                            onClick={() => requestSort("orders", "firstName")}
                                        >
                                            Prénom {getSortIcon("orders", "firstName")}
                                        </th>
                                        <th
                                            className="group cursor-pointer p-4 font-semibold"
                                            onClick={() => requestSort("orders", "prescriber")}
                                        >
                                            Prescripteur {getSortIcon("orders", "prescriber")}
                                        </th>
                                        <th
                                            className="group cursor-pointer p-4 font-semibold"
                                            onClick={() => requestSort("orders", "createdAt")}
                                        >
                                            Date de commande {getSortIcon("orders", "createdAt")}
                                        </th>
                                        <th
                                            className="group cursor-pointer p-4 font-semibold"
                                            onClick={() => requestSort("orders", "size")}
                                        >
                                            Taille choisie {getSortIcon("orders", "size")}
                                        </th>
                                        <th
                                            className="group cursor-pointer rounded-r-lg p-4 font-semibold"
                                            onClick={() => requestSort("orders", "paymentStatus")}
                                        >
                                            Paiement {getSortIcon("orders", "paymentStatus")}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sortedOrders.length === 0 ? (
                                        <tr className="border-b border-gray-200">
                                            <td
                                                colSpan={6}
                                                className="p-4 text-center text-xs text-gray-500"
                                            >
                                                Aucune commande pour le moment.
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedOrders.map((order) => {
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
                                                    <td
                                                        className={`p-4 font-semibold ${
                                                            order.paymentStatus === "PAID"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }`}
                                                    >
                                                        {(() => {
                                                            if (order.paymentStatus === "PAID") return "Payée";
                                                            if (order.paymentStatus === "PENDING") return "En attente";
                                                            if (order.paymentStatus === "FAILED") return "Échoué";
                                                            return "Non payée";
                                                        })()}
                                                    </td>
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
