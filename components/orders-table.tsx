type OrderRow = {
    id: string;
    patientName: string;
    createdAt: string;
    size: string;
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

export const formatDate = (value: string | Date) => {
    const d = new Date(value);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};


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
                                <td className="p-4 capitalize">{lastName}</td>
                                <td className="p-4 capitalize">{firstName}</td>
                                <td className="p-4">{formatDate(order.createdAt)}</td>
                                <td className="p-4">{order.size}</td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
}
