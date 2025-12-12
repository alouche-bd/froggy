export type CsvColumn<T> = {
    key: keyof T;
    header: string;
    format?: (value: any, row: T) => string;
};

export function downloadCsv<T extends Record<string, any>>(
    rows: T[],
    columns: CsvColumn<T>[],
    filename: string
) {
    if (!rows || rows.length === 0) {
        alert("Aucune donnée à exporter.");
        return;
    }

    const escape = (value: string) =>
        `"${value.replace(/"/g, '""')}"`;

    const headerLine = columns
        .map((col) => escape(col.header))
        .join(";");

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
