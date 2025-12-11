import {RegisterForm} from "@/components/auth/register-form";
import {getCurrentUser} from "@/lib/auth";
import {redirect} from "next/navigation";

export default async function AuthPage() {
    const user = await getCurrentUser();
    if (user) {
        redirect("/dashboard");
    }

    return (
        <main className="bg-gray-50">
            <RegisterForm/>
        </main>
    );
}
