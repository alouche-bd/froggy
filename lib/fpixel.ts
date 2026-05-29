export const FB_PIXEL_ID = "1574700224247284";

declare global {
    interface Window {
        fbq?: (...args: unknown[]) => void;
    }
}

export function pageview() {
    window.fbq?.("track", "PageView");
}

export function track(event: string, params?: Record<string, unknown>) {
    window.fbq?.("track", event, params);
}
