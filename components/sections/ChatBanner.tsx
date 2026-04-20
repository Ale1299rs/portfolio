"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function ChatBanner() {
  const t = useTranslations("chatBanner");

  return (
    <section className="relative py-20 sm:py-28">
      <Container size="wide">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-surface p-10 shadow-soft sm:p-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent-2/25 blur-3xl" />
            <div className="absolute inset-0 grid-bg opacity-40" />
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-medium text-muted backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
              {t("eyebrow")}
            </div>

            <h2 className="mt-5 text-display-md font-semibold tracking-tight">
              {t("title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {t("description")}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  document
                    .querySelector<HTMLButtonElement>("[data-chat-trigger]")
                    ?.click();
                }}
                className="group relative inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[0.95rem] font-medium text-accent-fg shadow-[0_10px_30px_-10px_rgb(var(--accent)/0.7)] transition hover:brightness-110"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 animate-ping rounded-full bg-accent/40"
                />
                <MessageCircle className="h-4 w-4" />
                {t("cta")}
              </button>
              <p className="text-xs text-muted">{t("hint")}</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
