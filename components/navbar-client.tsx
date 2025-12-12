"use client";

import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {
    FaRegUserCircle,
    FaBars,
    FaTimes,
    FaHome,
    FaUserPlus,
    FaSignOutAlt,
} from "react-icons/fa";
import {LogoutButton} from "@/components/logout-button";
import {logoutAction} from "@/app/actions/auth/action";

type Props = {
    brandName: string;
    logoUrl: string;
    accountHref: string;
    isLoggedIn: boolean;
};

export function NavbarClient({
                                 brandName,
                                 logoUrl,
                                 accountHref,
                                 isLoggedIn,
                             }: Props) {
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen((prev) => !prev);
    const close = () => setOpen(false);

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="flex items-center space-x-3"
                    onClick={close}
                >
                    <Image
                        src={logoUrl}
                        alt={brandName}
                        width={229}
                        height={69}
                        priority
                    />
                </Link>

                <nav className="hidden items-center space-x-12 text-base font-medium md:flex">
                    <Link
                        href="/"
                        className="text-gray-600 transition-colors hover:text-brand-green"
                    >
                        ACCUEIL
                    </Link>
                    {!isLoggedIn &&
                        <Link
                            href="/auth/register"
                            className="text-gray-600 transition-colors hover:text-brand-green"
                        >
                            INSCRIPTION
                        </Link>
                    }

                    <div className="flex items-center space-x-4">
                        <Link
                            href={accountHref}
                            className="text-gray-600 transition-colors hover:text-brand-green"
                        >
              <span className="flex items-center justify-center">
                <FaRegUserCircle size={24}/>
              </span>
                        </Link>
                        {isLoggedIn && <LogoutButton/>}
                    </div>
                </nav>

                <div className="flex items-center md:hidden">
                    <button
                        type="button"
                        onClick={toggle}
                        className="text-gray-700 cursor-pointer hover:text-brand-green focus:outline-none"
                        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                    >
                        {open ? <FaTimes size={22}/> : <FaBars size={22}/>}
                    </button>
                </div>
            </div>

            {open && (
                <div className="border-t border-gray-200 bg-white md:hidden">
                    <div className="container mx-auto flex flex-col space-y-3 px-4 py-4 text-base font-medium">
                        <Link
                            href="/"
                            onClick={close}
                            className="flex items-center space-x-3 rounded-lg px-2 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand-green"
                        >
                            <FaHome size={18}/>
                            <span>ACCUEIL</span>
                        </Link>

                        <Link
                            href="/auth/register"
                            onClick={close}
                            className="flex items-center space-x-3 rounded-lg px-2 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand-green"
                        >
                            <FaUserPlus size={18}/>
                            <span>INSCRIPTION</span>
                        </Link>

                        <Link
                            href={accountHref}
                            onClick={close}
                            className="flex items-center space-x-3 rounded-lg px-2 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand-green"
                        >
                            <FaRegUserCircle size={18}/>
                            <span>{isLoggedIn ? "Mon espace" : "Se connecter"}</span>
                        </Link>

                        {isLoggedIn && (
                            <form
                                action={logoutAction}
                                className="flex items-center rounded-lg px-2 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-brand-green"
                            >
                                <button
                                    type="submit"
                                    className="flex w-full items-center space-x-3 text-left"
                                >
                                    <FaSignOutAlt size={18}/>
                                    <span>Se déconnecter</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}