"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

type QrCodeCardProps = {
    intakeUrl: string;
};

export function QrCodeCard({ intakeUrl }: QrCodeCardProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "froggymouth-qr.png";
        link.click();
    };

    const handlePrint = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL("image/png");
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
    <html>
      <head>
        <title>Imprimer le QR Code</title>
      </head>
      <body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;">
        <img src="${dataUrl}" style="max-width:100%;max-height:100%;" />
      </body>
    </html>
  `);
        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };
    };


    return (
        <div
            id="qr-code-card"
            className="flex items-start space-x-6 rounded-xl bg-white p-8 shadow-md"
        >
            <div className="flex-grow">
                <h2 className="mb-3 text-lg font-bold">
                    QR code & lien unique pour vos patients
                </h2>
                <p className="mb-6 text-sm text-gray-600">
                    Ce QR code et ce lien permettent à vos patients d&apos;accéder
                    directement à leur formulaire de commande.
                </p>
                <div className="space-y-3 text-sm">
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="block font-medium text-brand-green underline transition-colors hover:text-green-700"
                    >
                        Imprimer le QR Code
                    </button>
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="block font-medium text-brand-green underline transition-colors hover:text-green-700"
                    >
                        Télécharger le QR Code
                    </button>
                    {/* Optionnel : afficher le lien brut */}
                    <a
                        href={intakeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-xs text-gray-500 break-all"
                    >
                        {intakeUrl}
                    </a>
                </div>
            </div>
            <div className="flex-shrink-0">
                <div className="flex h-32 w-32 items-center justify-center rounded-md bg-white">
                    <QRCodeCanvas
                        value={intakeUrl}
                        size={128}
                        includeMargin
                        ref={canvasRef}
                    />
                </div>
            </div>
        </div>
    );
}
