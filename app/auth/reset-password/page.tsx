import { ResetPasswordForm } from "@/components/auth/reset-password-form";

type PageProps = {
    searchParams: Promise<{ token?: string | string[] }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
    const params = await searchParams;

    let token = "";
    const raw = params.token;

    if (typeof raw === "string") {
        token = raw;
    }

    return <ResetPasswordForm token={token} />;
}
