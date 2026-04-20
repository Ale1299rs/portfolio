"use client";

import { useAutoTheme } from "./useAutoTheme";

/**
 * Mounts inside ThemeProvider and auto-switches dark/light based on sunset.
 * Renders nothing — only a side effect.
 */
export function AutoTheme() {
  useAutoTheme();
  return null;
}
