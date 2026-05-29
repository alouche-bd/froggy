import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Poppins } from "next/font/google";
import {Footer} from "@/components/footer";
import Script from "next/script";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const FB_PIXEL_ID = "1574700224247284";

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
        <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');`}
        </Script>
        <noscript>
            <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
            />
        </noscript>
        <Navbar />
        {children}
        <Footer />
        </body>
        </html>
    );
}
