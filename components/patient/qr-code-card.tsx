"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

type QrCodeCardProps = {
    intakeUrl: string;
};

const QR_PIXEL_SIZE = 1024; // high-res canvas for print/download
const QR_DISPLAY_SIZE = 128; // visual size in the dashboard

export function QrCodeCard({ intakeUrl }: QrCodeCardProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // High-res PNG thanks to QR_PIXEL_SIZE
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
          <style>
            @page {
              margin: 10mm;
            }
            html, body {
              margin: 0;
              padding: 0;
              height: 100%;
            }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
            }
            /* Size the QR code to fit nicely on a single page */
            img {
              width: 60mm;
              height: 60mm;
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" />
        </body>
      </html>
    `);

        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            // optional: auto-close after print
            printWindow.onafterprint = () => {
                printWindow.close();
            };
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
                        className="block cursor-pointer font-medium text-brand-green underline transition-colors hover:text-green-700"
                    >
                        Imprimer le QR Code
                    </button>
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="block cursor-pointer font-medium text-brand-green underline transition-colors hover:text-green-700"
                    >
                        Télécharger le QR Code
                    </button>
                    <a
                        href={intakeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block break-all text-xs text-gray-500"
                    >
                        {intakeUrl}
                    </a>
                </div>
            </div>

            <div className="flex-shrink-0">
                <div className="flex h-32 w-32 items-center justify-center rounded-md bg-white">
                    <QRCodeCanvas
                        value={intakeUrl}
                        size={QR_PIXEL_SIZE} // high-res backing canvas
                        includeMargin
                        ref={canvasRef}
                        // visually scaled down to match the design
                        style={{
                            width: `${QR_DISPLAY_SIZE}px`,
                            height: `${QR_DISPLAY_SIZE}px`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
