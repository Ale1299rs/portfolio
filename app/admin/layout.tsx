import type { ReactNode } from "react";
import "../globals.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className="bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
