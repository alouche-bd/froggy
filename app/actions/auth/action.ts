'use server';

import { loginUser, registerUser, type LoginInput, type RegisterInput } from '@/lib/auth';
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import prisma from "@/lib/prisma";
import toast from "react-hot-toast";

export type AuthState = { ok?: boolean; error?: string };

const SESSION_COOKIE_NAME = "session_token";

export async function registerAction(
    _prev: AuthState,
    formData: FormData,
): Promise<AuthState> {
    try {
        const input: RegisterInput = {
            email: String(formData.get('email') ?? ''),
            password: String(formData.get('password') ?? ''),
            confirmPassword: String(formData.get('confirmPassword') ?? ''),
            firstName: String(formData.get('firstName') ?? ''),
            lastName: String(formData.get('lastName') ?? ''),
        };
        await registerUser(input);
    } catch (e: any) {
        return { error: e.message ?? 'Erreur inconnue.' };
    }

    toast.success("Votre compte a été créé. Vous pouvez vous connecter avec vos identifiants.")

    redirect("/auth/login");
}

export async function loginAction(
    _prev: AuthState,
    formData: FormData,
): Promise<AuthState> {
    try {
        const input: LoginInput = {
            email: String(formData.get('email') ?? ''),
            password: String(formData.get('password') ?? ''),
        };
        await loginUser(input);
    } catch (e: any) {
        console.error(e);
        return { error: e.message ?? 'Identifiants invalides.' };
    }

    redirect("/dashboard");
}

export async function logoutAction() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionId) {
        // On supprime la session en base si elle existe
        try {
            await prisma.session.delete({
                where: { id: sessionId },
            });
        } catch {
            // ignorer si déjà supprimée
        }
    }

    // On supprime le cookie
    cookieStore.delete(SESSION_COOKIE_NAME);

    // Redirige vers la home
    redirect("/");
}
