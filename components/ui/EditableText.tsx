"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  initialText: string;
  onSave?: (newText: string) => void;
  className?: string;
  inputClassName?: string;
}

export function EditableText({
  initialText,
  onSave,
  className,
  inputClassName,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (text !== initialText) {
      onSave?.(text);
    }
  };

  const handleCancel = () => {
    setText(initialText);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div className={cn("group relative inline-flex items-center gap-2", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {isEditing ? (
          <motion.div
            key="input-mode"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex items-center gap-1"
          >
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className={cn(
                "rounded-md border border-accent bg-surface-2 px-2 py-1 text-sm outline-none ring-2 ring-accent/20 transition-all focus:border-accent focus:bg-surface",
                inputClassName
              )}
            />
            {/* onMouseDown preventDefault prevents onBlur from firing before the click is registered */}
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="grid h-7 w-7 place-items-center rounded-md text-emerald-500 transition-colors hover:bg-emerald-500/10"
              aria-label="Save"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                handleCancel();
              }}
              className="grid h-7 w-7 place-items-center rounded-md text-red-500 transition-colors hover:bg-red-500/10"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="text-mode"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <span className="text-sm font-medium">{text}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="grid h-6 w-6 place-items-center rounded-md text-muted opacity-0 outline-none ring-accent/50 transition-all hover:bg-surface-2 hover:text-accent focus:opacity-100 group-hover:opacity-100"
              aria-label="Edit text"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
