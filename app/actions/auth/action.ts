'use server';

import { loginUser, registerUser, type LoginInput, type RegisterInput } from '@/lib/auth';
import {redirect} from "next/navigation";
import {cookies} from "next/headers";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {requestPasswordReset, resetPassword} from "@/lib/password-reset";

export type AuthState = { ok?: boolean; error?: string };

const SESSION_COOKIE_NAME = "session_token";

export async function registerAction(
    _prev: AuthState,
    formData: FormData,
): Promise<AuthState> {
    try {
        const input: RegisterInput = {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
            confirmPassword: String(formData.get("confirmPassword") ?? ""),
            firstName: String(formData.get("firstName") ?? ""),
            lastName: String(formData.get("lastName") ?? ""),

            professionalAddress: String(
                formData.get("professional-address") ?? ""
            ),
            postalCode: String(formData.get("postalCode") ?? ""),
            city: String(formData.get("city") ?? ""),
            specialty: String(formData.get("specialty") ?? ""),
            siret: String(formData.get("siret") ?? ""),
            usedFroggymouth: String(formData.get("used-froggymouth") ?? "") as
                | "yes"
                | "no",
            training: String(formData.get("training") ?? "") as "done" | "commit",
            terms: formData.get("terms") ? "on" : "",
        };

        await registerUser(input);
    } catch (e: any) {
        return { error: e.message ?? "Erreur inconnue." };
    }

    redirect("/dashboard");
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
        return { error: e.message ?? 'Identifiants invalides.' };
    }

    redirect("/dashboard");
}

export async function logoutAction() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionId) {
        try {
            await prisma.session.delete({
                where: { id: sessionId },
            });
        } catch {
            //
        }
    }

    cookieStore.delete(SESSION_COOKIE_NAME);

    redirect("/");
}

export async function resetPasswordAction(
    _prev: AuthState,
    formData: FormData,
): Promise<AuthState> {
    const token = String(formData.get("token") ?? "");
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!token) {
        return { error: "Lien de réinitialisation invalide." };
    }

    if (!password || password.length < 8) {
        return {
            error: "Le mot de passe doit contenir au moins 8 caractères.",
        };
    }

    if (password !== confirmPassword) {
        return { error: "Les mots de passe ne correspondent pas." };
    }

    try {
        const hash = await bcrypt.hash(password, 12);
        await resetPassword(token, hash);
    } catch (e: any) {
        return {
            error: e.message ?? "Impossible de réinitialiser le mot de passe.",
        };
    }

    redirect("/auth/login");
}

export async function forgotPasswordAction(
    _prev: AuthState,
    formData: FormData
): Promise<AuthState> {
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
        return { error: "Veuillez renseigner votre adresse e-mail." };
    }

    try {
        await requestPasswordReset(email);
    } catch {
        //
    }

    return {};
}