"use client";

import { useLocale } from "next-intl";
import { useAdminMode } from "./AdminModeProvider";
import { EditableText } from "./EditableText";
import { useRouter } from "next/navigation";

interface InlineTranslationProps {
  namespace: string;
  tKey: string;
  initialText: string;
  className?: string;
  inputClassName?: string;
}

function showToast(message: string, type: "success" | "error") {
  const existing = document.getElementById("admin-toast");
  if (existing) existing.remove();

  const el = document.createElement("div");
  el.id = "admin-toast";
  el.textContent = message;
  el.style.cssText = `
    position: fixed; bottom: 64px; right: 16px; z-index: 99999;
    padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;
    background: ${type === "success" ? "rgb(16 185 129)" : "rgb(239 68 68)"};
    color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

export function InlineTranslation({ 
  namespace, 
  tKey, 
  initialText,
  className,
  inputClassName
}: InlineTranslationProps) {
  
  const { isAdminMode } = useAdminMode();
  const locale = useLocale();
  const router = useRouter();

  const handleSave = async (newText: string) => {
    try {
      const res = await fetch("/api/translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, namespace, keyPath: tKey, value: newText })
      });
      
      if (res.ok) {
        showToast("✓ Salvato", "success");
        router.refresh();
      } else {
        const data = await res.json();
        showToast(`Errore: ${data.error}`, "error");
        console.error("Failed to save translation:", data.error);
      }
    } catch (e) {
      showToast("Errore di rete", "error");
      console.error(e);
    }
  };

  if (!isAdminMode) {
    return <>{initialText}</>;
  }

  return (
    <EditableText
      initialText={initialText}
      onSave={handleSave}
      className={className}
      inputClassName={inputClassName}
    />
  );
}
