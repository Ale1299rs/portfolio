import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/layout/Reveal";
import { getFeaturedProjects } from "@/lib/projects";
import type { Locale } from "@/i18n/routing";

export async function ProjectsPreview() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("projectsPreview");
  const featured = getFeaturedProjects(locale);

  return (
    <section id="work" className="py-20 sm:py-28">
      <Container size="wide">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            description={t("description")}
            className="items-start text-left"
          />
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-fg/80 hover:text-fg"
          >
            {t("allWork")} <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:border-fg/20 hover:shadow-soft">
                <Link
                  href={`/projects/${p.slug}`}
                  className="flex h-full flex-col"
                >
                  <div
                    className={`relative h-44 overflow-hidden bg-gradient-to-br ${p.hero.accent}`}
                    aria-hidden
                  >
                    <div className="absolute inset-0 grid-bg opacity-40" />
                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-2.5 py-1 text-[11px] font-medium text-muted backdrop-blur">
                      {p.category}
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 grid grid-cols-2 gap-2">
                      {p.impact.slice(0, 2).map((m) => (
                        <div
                          key={m.label}
                          className="rounded-lg border border-border bg-surface/85 p-2 backdrop-blur"
                        >
                          <div className="text-[10px] uppercase tracking-wider text-muted">
                            {m.label}
                          </div>
                          <div className="text-base font-semibold">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold leading-snug tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {p.tagline}
                    </p>
                    <div className="mt-auto pt-5">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                        {t("read")}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
