"use client";

import { useFormStatus } from "react-dom";
import { logoutAction } from "@/app/actions/auth/action";
import { FaSignOutAlt } from "react-icons/fa";
import {RiLogoutCircleRLine} from "react-icons/ri";

function LogoutSubmit() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            title="Se déconnecter"
            className="text-gray-600 cursor-pointer hover:text-brand-green transition-colors flex items-center justify-center"
        >
            <RiLogoutCircleRLine  size={24} />
        </button>
    );
}

export function LogoutButton() {
    return (
        <form action={logoutAction}>
            <LogoutSubmit />
        </form>
    );
}
