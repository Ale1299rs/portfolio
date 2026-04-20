"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("themeToggle");

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? t("toLight") : t("toDark")}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/80 text-fg transition hover:bg-surface-2 hover:shadow-soft"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mounted ? (isDark ? "moon" : "sun") : "placeholder"}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex"
        >
          {!mounted ? (
            <Sun className="h-4 w-4 opacity-60" aria-hidden />
          ) : isDark ? (
            <Moon className="h-4 w-4" aria-hidden />
          ) : (
            <Sun className="h-4 w-4" aria-hidden />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
