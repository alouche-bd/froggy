import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Poppins } from "next/font/google";
import {Footer} from "@/components/footer";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Inscription | Froggymouth",
};

export default async function RootLayout({
                                             children,
                                         }: {
    children: ReactNode;
}) {
    return (
        <html lang="fr">
        <body className={`${poppins.className} text-brand-dark bg-gray-50`}>
        <Navbar />
        {children}
        <Footer />
        </body>
        </html>
    );
}
