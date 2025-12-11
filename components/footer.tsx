import Image from "next/image";
import Link from "next/link";
import { getBrandConfig } from "@/lib/brand";

export async function Footer() {
    const brand = getBrandConfig();

    const year = new Date().getFullYear();

    const logoSrc =
        brand.logoUrl ||
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/baa29bba3f-ba3eaa2e4883b51b523c.png";

    const brandName = brand.name || "Froggymouth";

    return (
        <footer id="footer" className="bg-brand-dark text-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top row: logo + links */}
                <div className="flex flex-col items-start justify-between space-y-8 lg:flex-row lg:items-center lg:space-y-0">
                    <div id="footer-logo" className="flex items-center space-x-3">
                        <div className="relative h-12">
                            <Image
                                src={process.env.NEXT_PUBLIC_CDN_URL + '/logo_w.svg'}
                                alt={brandName}
                                width={300}
                                height={58}
                            />
                        </div>
                    </div>

                    <div
                        id="footer-links"
                        className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8"
                    >
                        <Link
                            href="#"
                            className="text-sm text-gray-300 transition-colors duration-300 hover:text-brand-green"
                        >
                            Conditions Générales de Vente
                        </Link>
                        <Link
                            href="#"
                            className="text-sm text-gray-300 transition-colors duration-300 hover:text-brand-green"
                        >
                            Mentions Légales
                        </Link>
                        <Link
                            href="#"
                            className="text-sm text-gray-300 transition-colors duration-300 hover:text-brand-green"
                        >
                            Politique de Confidentialité
                        </Link>
                    </div>
                </div>

                {/* Divider + bottom row */}
                <div
                    id="footer-divider"
                    className="mt-12 border-t border-gray-700 pt-8"
                >
                    <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                        <p className="text-sm text-gray-400">
                            © {year} {brandName}. Tous droits réservés.
                        </p>

                        <div id="footer-social" className="flex space-x-4">
                            {/* Replace href="#" with real links when you have them */}
                            <Link
                                href="#"
                                className="text-gray-400 transition-colors duration-300 hover:text-brand-green"
                                aria-label="LinkedIn"
                            >
                                {/* Simple inline icon placeholder */}
                                <span className="text-xl">in</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 transition-colors duration-300 hover:text-brand-green"
                                aria-label="X / Twitter"
                            >
                                <span className="text-xl">𝕏</span>
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 transition-colors duration-300 hover:text-brand-green"
                                aria-label="Instagram"
                            >
                                <span className="text-xl">◎</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
