"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, TrendingUp, AlertTriangle, Target, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InlineTranslation } from "@/components/ui/InlineTranslation";
import { cn } from "@/lib/utils";

type Region = "All" | "EMEA" | "AMER" | "APAC";

type MonthPoint = { month: string; pipeline: number; closedWon: number };

const SERIES: Record<Region, MonthPoint[]> = {
  All: [
    { month: "Oct", pipeline: 4.2, closedWon: 1.1 },
    { month: "Nov", pipeline: 4.8, closedWon: 1.3 },
    { month: "Dec", pipeline: 5.1, closedWon: 1.6 },
    { month: "Jan", pipeline: 5.9, closedWon: 1.4 },
    { month: "Feb", pipeline: 6.4, closedWon: 1.8 },
    { month: "Mar", pipeline: 7.2, closedWon: 2.1 },
    { month: "Apr", pipeline: 8.1, closedWon: 2.4 },
  ],
  EMEA: [
    { month: "Oct", pipeline: 1.8, closedWon: 0.5 },
    { month: "Nov", pipeline: 2.0, closedWon: 0.55 },
    { month: "Dec", pipeline: 2.2, closedWon: 0.7 },
    { month: "Jan", pipeline: 2.5, closedWon: 0.65 },
    { month: "Feb", pipeline: 2.7, closedWon: 0.8 },
    { month: "Mar", pipeline: 3.0, closedWon: 0.95 },
    { month: "Apr", pipeline: 3.4, closedWon: 1.1 },
  ],
  AMER: [
    { month: "Oct", pipeline: 1.6, closedWon: 0.4 },
    { month: "Nov", pipeline: 1.9, closedWon: 0.5 },
    { month: "Dec", pipeline: 2.1, closedWon: 0.6 },
    { month: "Jan", pipeline: 2.4, closedWon: 0.55 },
    { month: "Feb", pipeline: 2.6, closedWon: 0.7 },
    { month: "Mar", pipeline: 3.0, closedWon: 0.85 },
    { month: "Apr", pipeline: 3.3, closedWon: 0.95 },
  ],
  APAC: [
    { month: "Oct", pipeline: 0.8, closedWon: 0.2 },
    { month: "Nov", pipeline: 0.9, closedWon: 0.25 },
    { month: "Dec", pipeline: 0.8, closedWon: 0.3 },
    { month: "Jan", pipeline: 1.0, closedWon: 0.2 },
    { month: "Feb", pipeline: 1.1, closedWon: 0.3 },
    { month: "Mar", pipeline: 1.2, closedWon: 0.3 },
    { month: "Apr", pipeline: 1.4, closedWon: 0.35 },
  ],
};

const REGIONS: Region[] = ["All", "EMEA", "AMER", "APAC"];

function Sparkline({ data }: { data: number[] }) {
  const width = 220;
  const height = 60;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pad = 4;
  const pts = data.map((d, i) => {
    const x = pad + (i * (width - pad * 2)) / (data.length - 1);
    const y =
      pad +
      (height - pad * 2) -
      ((d - min) / (max - min || 1)) * (height - pad * 2);
    return [x, y] as const;
  });

  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${path} L${pts[pts.length - 1][0]},${height - pad} L${pts[0][0]},${height - pad} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-16 w-full text-accent"
      aria-hidden
    >
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#spark-grad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </svg>
  );
}

function BarChart({ data }: { data: MonthPoint[] }) {
  const max = Math.max(...data.map((d) => d.pipeline));
  return (
    <div className="flex h-56 items-end gap-3">
      {data.map((d, i) => {
        const h = (d.pipeline / max) * 100;
        const won = (d.closedWon / max) * 100;
        return (
          <div key={d.month} className="flex h-full flex-1 flex-col items-center gap-2">
            <div className="relative w-full flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: "easeOut" }}
                className="absolute bottom-0 w-full rounded-t-md bg-accent/20"
                aria-hidden
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${won}%` }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.04, ease: "easeOut" }}
                className="absolute bottom-0 w-full rounded-t-md bg-accent"
                aria-hidden
              />
            </div>
            <span className="text-[11px] font-medium text-muted">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

export function DashboardDemo() {
  const [region, setRegion] = useState<Region>("All");
  const data = SERIES[region];
  const t = useTranslations("demo");

  const kpis = useMemo(() => {
    const lastPipeline = data[data.length - 1].pipeline;
    const prevPipeline = data[data.length - 2].pipeline;
    const wonTotal = data.reduce((a, b) => a + b.closedWon, 0);
    const winRate =
      region === "APAC" ? 22 : region === "EMEA" ? 31 : 28;
    const stalled =
      region === "APAC" ? 0.9 : region === "AMER" ? 1.6 : region === "EMEA" ? 1.3 : 3.8;
    const pipelineDelta = ((lastPipeline - prevPipeline) / prevPipeline) * 100;

    return [
      {
        label: t("kpis.openPipeline"),
        value: `€${lastPipeline.toFixed(1)}M`,
        delta: `${pipelineDelta >= 0 ? "+" : ""}${pipelineDelta.toFixed(1)}%`,
        trend: (pipelineDelta >= 0 ? "up" : "down") as "up" | "down",
        icon: TrendingUp,
        hint: t("hints.vsPrev"),
      },
      {
        label: t("kpis.closedWon"),
        value: `€${wonTotal.toFixed(1)}M`,
        delta: "+18.4%",
        trend: "up" as const,
        icon: Target,
        hint: t("hints.vsPlan"),
      },
      {
        label: t("kpis.winRate"),
        value: `${winRate}%`,
        delta: winRate >= 28 ? "+2.1pp" : "-1.4pp",
        trend: (winRate >= 28 ? "up" : "down") as "up" | "down",
        icon: Sparkles,
        hint: t("hints.trailing"),
      },
      {
        label: t("kpis.stalled"),
        value: `€${stalled.toFixed(1)}M`,
        delta: "flagged",
        trend: "down" as const,
        icon: AlertTriangle,
        hint: t("hints.noActivity"),
      },
    ];
  }, [data, region, t]);

  const insightKey =
    region === "APAC" ? "apac" : region === "EMEA" ? "emea" : region === "AMER" ? "amer" : "all";

  return (
    <section id="demo" className="relative py-20 sm:py-28">
      <Container size="wide">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <div className="relative mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 -z-10 rounded-[28px] bg-gradient-to-br from-accent/20 via-transparent to-accent-2/10 blur-2xl"
          />

          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
            <div className="flex flex-col gap-3 border-b border-border bg-surface-2/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-center gap-3">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </span>
                <span className="text-xs font-medium text-muted">
                  revenue-cockpit · v2.4
                </span>
              </div>
              <div
                role="tablist"
                aria-label={t("regionLabel")}
                className="inline-flex rounded-full border border-border bg-surface p-1 text-xs"
              >
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    role="tab"
                    aria-selected={region === r}
                    onClick={() => setRegion(r)}
                    className={cn(
                      "relative rounded-full px-3 py-1 font-medium transition-colors",
                      region === r ? "text-accent-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {region === r && (
                      <motion.span
                        layoutId="region-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-accent"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {kpis.map((k) => {
                  const Icon = k.icon;
                  return (
                    <motion.div
                      key={`${region}-${k.label}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-surface px-5 py-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted">
                          {k.label}
                        </span>
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            k.trend === "up" ? "text-emerald-500" : "text-amber-500",
                          )}
                          aria-hidden
                        />
                      </div>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-semibold tracking-tight">
                          {k.value}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            k.trend === "up" ? "text-emerald-500" : "text-amber-500",
                          )}
                        >
                          {k.delta}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted">{k.hint}</p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="grid gap-px bg-border lg:grid-cols-[1.4fr_1fr]">
              <div className="bg-surface p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">
                      <InlineTranslation namespace="demo" tKey="chartPipeline.title" initialText={t("chartPipeline.title")} />
                    </h3>
                    <p className="text-xs text-muted">
                      <InlineTranslation namespace="demo" tKey="chartPipeline.subtitle" initialText={t("chartPipeline.subtitle")} />
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-accent/25" />{" "}
                      <InlineTranslation namespace="demo" tKey="chartPipeline.legendPipeline" initialText={t("chartPipeline.legendPipeline")} />
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-accent" />{" "}
                      <InlineTranslation namespace="demo" tKey="chartPipeline.legendWon" initialText={t("chartPipeline.legendWon")} />
                    </span>
                  </div>
                </div>
                <BarChart data={data} />
              </div>

              <div className="bg-surface p-5 sm:p-6">
                <h3 className="text-sm font-semibold">
                  <InlineTranslation namespace="demo" tKey="chartMomentum.title" initialText={t("chartMomentum.title")} />
                </h3>
                <p className="text-xs text-muted">
                  <InlineTranslation namespace="demo" tKey="chartMomentum.subtitle" initialText={t("chartMomentum.subtitle")} />
                </p>
                <div className="mt-4">
                  <Sparkline data={data.map((d) => d.pipeline)} />
                </div>
                <div className="mt-6 rounded-xl border border-border bg-surface-2 p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                      <Sparkles className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        <InlineTranslation namespace="demo" tKey="insight.label" initialText={t("insight.label")} />
                      </p>
                      <div className="mt-1 text-xs leading-relaxed text-muted">
                        <InlineTranslation namespace="demo" tKey={`insight.${insightKey}`} initialText={t(`insight.${insightKey}`)} />
                      </div>
                      <Link
                        href="/projects"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                      >
                        <InlineTranslation namespace="demo" tKey="insight.cta" initialText={t("insight.cta")} />
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-muted">
            <InlineTranslation namespace="demo" tKey="disclaimer" initialText={t("disclaimer")} />
          </div>
        </div>
      </Container>
    </section>
  );
}
