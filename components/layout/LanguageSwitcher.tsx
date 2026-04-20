"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(nextLocale: string) {
    if (nextLocale === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, {
        locale: nextLocale as (typeof routing.locales)[number],
      });
    });
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex rounded-full border border-border bg-surface/80 p-0.5 text-xs font-medium",
        isPending && "opacity-70",
      )}
    >
      {routing.locales.map((loc) => {
        const active = loc === currentLocale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            aria-pressed={active}
            className={cn(
              "inline-flex h-8 items-center justify-center rounded-full px-2.5 uppercase tracking-wider transition",
              active
                ? "bg-fg text-bg"
                : "text-muted hover:text-fg",
            )}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
