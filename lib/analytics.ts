// Thin tracking shim. Replace with Plausible / Vercel Analytics / PostHog.
// Designed so components call `track("event", props)` without caring about the vendor.

type EventProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: EventProps }) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, props?: EventProps) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
    window.dataLayer?.push({ event, ...props });
  } catch {
    /* no-op — analytics must never break UX */
  }
}
