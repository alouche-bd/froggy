import {ResetPasswordForm} from "@/components/auth/reset-password-form";

type Props = {
    searchParams: { token?: string };
};

export default function ResetPasswordPage({ searchParams }: Props) {
    const token = searchParams.token ?? "";
    return <ResetPasswordForm token={token} />;
}
