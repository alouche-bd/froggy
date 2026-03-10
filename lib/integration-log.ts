import prisma from "@/lib/prisma";

type LogInput = {
    provider: "STRIPE" | "GALAXY";
    action: string;
    status: "SUCCESS" | "ERROR" | "SKIPPED";
    orderId?: string;
    stripeEventId?: string;
    attempt?: number;
    request?: any;
    response?: any;
    error?: string;
};

function safeJson(value: any) {
    try {
        return value ?? undefined;
    } catch {
        return undefined;
    }
}

export async function logIntegration(input: LogInput) {
    try {
        await prisma.integrationLog.create({
            data: {
                provider: input.provider,
                action: input.action,
                status: input.status,
                orderId: input.orderId,
                stripeEventId: input.stripeEventId,
                attempt: input.attempt ?? 1,
                request: safeJson(input.request),
                response: safeJson(input.response),
                error: input.error,
            },
        });
    } catch (e) {
        console.error("Failed to write IntegrationLog:", e);
    }
}