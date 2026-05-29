"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pageview } from "@/lib/fpixel";

export function FacebookPixelEvents() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialLoad = useRef(true);

    useEffect(() => {
        // The inline init script in the layout already fires the first PageView,
        // so skip the mount render and only track subsequent client navigations.
        if (initialLoad.current) {
            initialLoad.current = false;
            return;
        }
        pageview();
    }, [pathname, searchParams]);

    return null;
}
