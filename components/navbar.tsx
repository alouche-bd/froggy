import Image from "next/image";
import { getBrandConfig } from "@/lib/brand";
import { getCurrentUser } from "@/lib/auth";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
    const brand = getBrandConfig();
    const user = await getCurrentUser();

    const accountHref = user ? "/dashboard" : "/auth/login";

    return (
        <NavbarClient
            brandName={brand.name}
            logoUrl={brand.logoUrl}
            accountHref={accountHref}
            isLoggedIn={!!user}
        />
    );
}
