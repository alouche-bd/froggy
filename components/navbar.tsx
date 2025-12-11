import Link from "next/link";
import { getBrandConfig } from "@/lib/brand";
import {getCurrentUser} from "@/lib/auth";
import {FaRegUserCircle, FaUserCircle} from "react-icons/fa";
import Image from "next/image";
import {LogoutButton} from "@/components/logout-button";

export async function Navbar() {
    const brand = getBrandConfig();
    const user = await getCurrentUser();

    const accountHref = user ? "/dashboard" : "/auth/login";
    return (
        <header className="bg-white shadow-sm">
            <div className="flex container mx-auto px-8 items-center justify-between py-6">
                <Link href="/" className="flex items-center space-x-3">
                    <Image src={brand.logoUrl} alt={brand.name} width={229} height={69} />
                </Link>

                <nav className="flex items-center space-x-12 text-lg font-medium">
                    <Link
                        href="/"
                        className="text-gray-600 transition-colors hover:text-brand-green"
                    >
                        ACCUEIL
                    </Link>
                    <Link
                        href="/auth/register"
                        className="text-gray-600 transition-colors hover:text-brand-green"
                    >
                        INSCRIPTION
                    </Link>
                    <Link
                        href={accountHref}
                        className="text-gray-600 transition-colors hover:text-brand-green"
                    >
            <span className="bg-gray-700">
             <FaRegUserCircle  size={24} />
            </span>
                    </Link>
                    {user && <LogoutButton />}
                </nav>
            </div>
        </header>
    );
}
