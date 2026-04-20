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
    </AdminModeContext.Provider>
  );
}
