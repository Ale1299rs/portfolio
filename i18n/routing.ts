import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "it"] as const,
  defaultLocale: "en",
  localePrefix: "always", // URLs are always /en/... or /it/...
  localeDetection: true,  // detect browser language, redirect non-IT users to /en
});

export type Locale = (typeof routing.locales)[number];
