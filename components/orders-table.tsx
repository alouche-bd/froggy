type OrderRow = {
    id: string;
    patientName: string;
    createdAt: string;
};

function splitName(fullName: string): { lastName: string; firstName: string } {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return { lastName: "", firstName: "" };
    if (parts.length === 1) return { lastName: parts[0], firstName: "" };
    return {
        lastName: parts[parts.length - 1],
        firstName: parts.slice(0, -1).join(" "),
    };
}

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                <tr className="bg-brand-green text-white">
                    <th className="rounded-l-lg p-4 font-semibold">Nom</th>
                    <th className="p-4 font-semibold">Prénom</th>
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
                                <td className="p-4">{lastName}</td>
                                <td className="p-4">{firstName}</td>
                                <td className="p-4">{order.createdAt}</td>
                                {/* TODO: Remplacez “—” par la vraie taille (Small/Medium/Large) quand le champ existera */}
                                <td className="p-4">—</td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
}
