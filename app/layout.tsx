import type { ReactNode } from "react";
import "./globals.css";

// This root layout is required by Next.js.
// The real <html> / <body> with locale and theme live in app/[locale]/layout.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
