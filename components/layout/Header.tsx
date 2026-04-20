"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const t = useTranslations("nav");

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        elevated
          ? "border-b border-border/80 bg-bg/75 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container size="wide" className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
          aria-label={t("brandAriaLabel", { name: site.name })}
        >
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-fg text-bg shadow-soft transition-transform group-hover:rotate-[4deg]"
          >
            <span className="text-[13px] font-bold">AE</span>
          </span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <nav aria-label={t("primary")} className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  active ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 rounded-full bg-surface-2"
                  />
                )}
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={t("mobileMenu")}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/80 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-border bg-bg md:hidden">
          <Container size="wide" className="flex flex-col py-3">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm text-fg hover:bg-surface-2"
              >
                {t(item.key)}
              </Link>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
