"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { InlineTranslation } from "@/components/ui/InlineTranslation";
import { track } from "@/lib/analytics";

const techStack = [
  "Salesforce CPQ",
  "Sales Cloud",
  "Service Cloud",
  "Power BI",
  "DAX",
  "PowerApps",
  "SharePoint Lists",
  "Power Automate",
  "Dataverse",
  "Fluxicon Disco",
  "Python",
];

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20 lg:pb-28 lg:pt-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[520px] grid-bg opacity-70" />
        <div className="absolute left-1/2 top-[-120px] h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent)/0.22),transparent_70%)]" />
      </div>

      <Container size="wide">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted shadow-soft">
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
            <InlineTranslation namespace="hero" tKey="badge" initialText={t("badge")} />
          </div>

          <h1 className="mt-6 text-display-xl font-semibold tracking-tight">
            <InlineTranslation namespace="hero" tKey="titleBefore" initialText={t("titleBefore")} />{" "}
            <span className="text-gradient">
              <InlineTranslation namespace="hero" tKey="titleAccent" initialText={t("titleAccent")} />
            </span>
            <br className="hidden sm:block" />{" "}
            <InlineTranslation namespace="hero" tKey="titleAfter" initialText={t("titleAfter")} />
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            <InlineTranslation namespace="hero" tKey="description" initialText={t("description")} />
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/projects"
              onClick={() => track("hero_cta_click", { label: "see_work" })}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[0.95rem] font-medium text-accent-fg shadow-[0_10px_30px_-10px_rgb(var(--accent)/0.7)] transition hover:brightness-110"
            >
              <InlineTranslation namespace="hero" tKey="ctaPrimary" initialText={t("ctaPrimary")} />
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/about"
              onClick={() => track("hero_cta_click", { label: "about" })}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-6 text-[0.95rem] font-medium transition hover:bg-surface-2"
            >
              <InlineTranslation namespace="hero" tKey="ctaSecondary" initialText={t("ctaSecondary")} />
            </Link>
          </div>
        </motion.div>

        <div className="mx-auto mt-16 max-w-4xl">
          <p className="text-center text-xs uppercase tracking-[0.18em] text-muted">
            <InlineTranslation namespace="hero" tKey="trust" initialText={t("trust")} />
          </p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted">
            {techStack.map((b) => (
              <li
                key={b}
                className="font-medium tracking-tight text-fg/70 transition hover:text-fg"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
