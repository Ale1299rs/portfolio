"use client";

import { useLocale, useTranslations } from "next-intl";
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
        body: JSON.stringify({
          locale,
          namespace,
          keyPath: tKey,
          value: newText
        })
      });
      
      if (res.ok) {
        // Forza un refresh dei dati se necessario o affida ad un reload leggero per renderizzare il cambio nei translation contest.
        router.refresh();
      } else {
        const data = await res.json();
        console.error("Failed to save translation:", data.error);
        alert(`Impossibile salvare: ${data.error}`);
      }
    } catch (e) {
      console.error(e);
      alert("Errore di rete durante il salvataggio.");
    }
  };

  // Se l'Admin Mode non è attivo, restituiamo solo la stringa nuda e cruda
  // in modo da non sporcare il DOM o i ref di Framer Motion inutilmente.
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
