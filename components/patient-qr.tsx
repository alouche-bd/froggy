"use client";

import { QRCodeCanvas } from "qrcode.react";

export function PatientQr({ value }: { value: string }) {
    return (
        <div className="flex h-32 w-32 items-center justify-center rounded-md bg-white">
            <QRCodeCanvas value={value} size={120} includeMargin />
        </div>
    );
}
