"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/fpixel";

export function RegistrationComplete() {
    const searchParams = useSearchParams();
    const fired = useRef(false);

    useEffect(() => {
        if (fired.current) return;
        if (searchParams.get("welcome") !== "1") return;
        fired.current = true;
        track("CompleteRegistration");
        // Strip the flag from the URL without a navigation (avoids an extra PageView).
        window.history.replaceState(null, "", "/dashboard");
    }, [searchParams]);

    return null;
}
