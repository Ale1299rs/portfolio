"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AdminModeContextType {
  isAdminMode: boolean;
}

const AdminModeContext = createContext<AdminModeContextType>({ isAdminMode: false });

export function useAdminMode() {
  return useContext(AdminModeContext);
}

export function AdminModeProvider({ children }: { children: ReactNode }) {
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // Carica la preferenza dal session storage se esiste per mantenerla durante i refresh
    const stored = sessionStorage.getItem("admin-mode");
    if (stored === "true") setIsAdminMode(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Scorciatoia: Ctrl/Cmd + E per attivare/disattivare
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setIsAdminMode((prev) => {
          const next = !prev;
          sessionStorage.setItem("admin-mode", String(next));
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AdminModeContext.Provider value={{ isAdminMode }}>
      {children}
      {isAdminMode && (
        <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-2 rounded-full border border-accent/40 bg-surface/90 px-3 py-2 text-xs font-medium shadow-lg backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          <span className="text-accent">Editing ON</span>
          <span className="text-muted">· CMD+E per uscire</span>
          <button
            onClick={() => {
              sessionStorage.setItem("admin-mode", "false");
              setIsAdminMode(false);
            }}
            className="ml-1 text-muted hover:text-fg"
            aria-label="Disattiva modalità editing"
          >
            ✕
          </button>
        </div>
      )}
    </AdminModeContext.Provider>
  );
}

