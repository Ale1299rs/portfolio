import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/layout/Reveal";
import { getProjects } from "@/lib/projects";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projectsPage" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}/projects`]),
  );
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/projects`, languages },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projectsPage");
  const tPreview = await getTranslations("projectsPreview");
  const projects = getProjects(locale as Locale);

  return (
    <>
      <section className="pb-10 pt-16 sm:pt-24">
        <Container size="wide">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t("eyebrow")}
            </span>
            <h1 className="mt-5 text-display-lg font-semibold tracking-tight">
              {t("titleBefore")} <span className="text-gradient">{t("titleAccent")}</span>
              {t("titleAfter")}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {t("description")}
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container size="wide">
          <ul className="grid gap-5 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.04}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:border-fg/20 hover:shadow-soft">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="flex h-full flex-col"
                  >
                    <div
                      className={`relative h-36 overflow-hidden bg-gradient-to-br ${p.hero.accent}`}
                      aria-hidden
                    >
                      <div className="absolute inset-0 grid-bg opacity-40" />
                      <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-2.5 py-1 text-[11px] font-medium text-muted backdrop-blur">
                        {p.category}
                      </span>
                      <span className="absolute right-5 top-5 text-[11px] font-medium text-muted">
                        {p.year} · {p.duration}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-lg font-semibold leading-snug tracking-tight">
                        {p.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {p.tagline}
                      </p>
                      <div className="mt-5 grid grid-cols-3 gap-2">
                        {p.impact.slice(0, 3).map((m) => (
                          <div
                            key={m.label}
                            className="rounded-lg border border-border bg-surface-2 p-2.5"
                          >
                            <div className="text-[10px] uppercase tracking-wider text-muted">
                              {m.label}
                            </div>
                            <div className="text-sm font-semibold">{m.value}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto pt-5">
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                          {tPreview("read")}
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
