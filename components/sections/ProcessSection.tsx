"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Step = { week: string; title: string; body: string };

export function ProcessSection() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as Step[];

  return (
    <section id="process" className="py-20 sm:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {s.week}
                </span>
                <span className="text-xs text-muted">0{i + 1}</span>
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
