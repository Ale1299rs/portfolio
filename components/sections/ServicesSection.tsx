"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Database,
  LineChart,
  Sparkles,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InlineTranslation } from "@/components/ui/InlineTranslation";

const icons = [Database, LineChart, ShieldCheck, Sparkles, Workflow];

type Item = { title: string; body: string; outputs: string[] };

export function ServicesSection() {
  const t = useTranslations("services");
  const items = t.raw("items") as Item[];

  return (
    <section id="services" className="py-20 sm:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow={<InlineTranslation namespace="services" tKey="eyebrow" initialText={t("eyebrow")} />}
          title={<InlineTranslation namespace="services" tKey="title" initialText={t("title")} />}
          description={<InlineTranslation namespace="services" tKey="description" initialText={t("description")} />}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((s, i) => {
            const Icon = icons[i] ?? Database;
            return (
              <motion.article
                key={s.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 transition hover:-translate-y-0.5 hover:border-fg/20 hover:shadow-soft"
              >
                <div
                  aria-hidden
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/5 blur-2xl transition group-hover:bg-accent/15"
                />
                <div className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface-2 text-accent">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  <InlineTranslation namespace="services" tKey={`items.${i}.title`} initialText={s.title} />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  <InlineTranslation namespace="services" tKey={`items.${i}.body`} initialText={s.body} />
                </p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {s.outputs.map((o, oi) => (
                    <li
                      key={o}
                      className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted"
                    >
                      <InlineTranslation namespace="services" tKey={`items.${i}.outputs.${oi}`} initialText={o} />
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

