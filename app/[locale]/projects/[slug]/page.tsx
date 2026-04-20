import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Script from "next/script";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/layout/Reveal";
import { getProject, getProjects, allSlugs } from "@/lib/projects";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    allSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(locale as Locale, slug);
  if (!project) return { title: "Not found" };

  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}/projects/${slug}`]),
  );

  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/${locale}/projects/${slug}`, languages },
    openGraph: {
      title: project.title,
      description: project.tagline,
      url: `/${locale}/projects/${slug}`,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(locale as Locale, slug);
  if (!project) notFound();

  const t = await getTranslations("projectPage");
  const list = getProjects(locale as Locale);
  const index = list.findIndex((p) => p.slug === project.slug);
  const prev = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];

  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.tagline,
    about: project.category,
    creator: { "@type": "Person", name: site.name },
    dateCreated: project.year,
    inLanguage: locale,
    url: `${site.url}/${locale}/projects/${project.slug}`,
  };

  return (
    <article>
      <section
        className={`relative overflow-hidden border-b border-border bg-gradient-to-br ${project.hero.accent}`}
      >
        <div aria-hidden className="absolute inset-0 grid-bg opacity-40" />
        <Container size="wide" className="relative py-16 sm:py-24">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-fg"
          >
            <ArrowLeft className="h-4 w-4" /> {t("backAll")}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="rounded-full border border-border bg-surface/80 px-2.5 py-1 font-medium backdrop-blur">
              {project.category}
            </span>
            <span>· {project.industry}</span>
            <span>· {project.year}</span>
            <span>· {project.duration}</span>
          </div>
          <h1 className="mt-4 max-w-4xl text-display-lg font-semibold tracking-tight">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
            {project.tagline}
          </p>

          <ul className="mt-6 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <li
                key={s}
                className="rounded-full border border-border bg-surface/80 px-2.5 py-1 text-[11px] font-medium backdrop-blur"
              >
                {s}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-border bg-surface/40">
        <Container size="wide" className="py-8">
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
            {project.impact.map((m) => (
              <li key={m.label} className="bg-surface p-5">
                <div className="text-xs uppercase tracking-wider text-muted">
                  {m.label}
                </div>
                <div className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {m.value}
                </div>
                {m.detail && (
                  <div className="mt-1 text-xs text-muted">{m.detail}</div>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <nav className="flex flex-col gap-1 text-sm">
                {(["problem", "data", "solution", "impact", "takeaway"] as const).map(
                  (id) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      className="rounded-lg px-3 py-2 text-muted transition hover:bg-surface-2 hover:text-fg"
                    >
                      {t(`sections.${id}`)}
                    </a>
                  ),
                )}
              </nav>
            </aside>

            <div className="space-y-14">
              <Reveal id="problem">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("sections.problem")}
                </h2>
                <p className="mt-3 text-xl leading-relaxed text-fg">
                  {project.problem}
                </p>
              </Reveal>

              <Reveal id="data">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("sections.data")}
                </h2>
                <ul className="mt-3 space-y-2 text-base leading-relaxed text-muted">
                  {project.data.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal id="solution">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("sections.solution")}
                </h2>
                <ol className="mt-4 space-y-3">
                  {project.solution.map((s, i) => (
                    <li
                      key={s}
                      className="flex gap-4 rounded-xl border border-border bg-surface p-4"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface-2 text-xs font-semibold text-accent">
                        {i + 1}
                      </span>
                      <span className="text-[15px] leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>

              <Reveal id="impact">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("sections.impact")}
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.impact.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-border bg-surface p-5"
                    >
                      <div className="text-xs uppercase tracking-wider text-muted">
                        {m.label}
                      </div>
                      <div className="mt-2 text-3xl font-semibold tracking-tight">
                        {m.value}
                      </div>
                      {m.detail && (
                        <div className="mt-1 text-sm text-muted">{m.detail}</div>
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal id="takeaway">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  {t("sections.takeaway")}
                </h2>
                <blockquote className="mt-3 rounded-xl border-l-2 border-accent bg-surface p-5 text-lg italic leading-relaxed">
                  {project.takeaway}
                </blockquote>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface/40 py-14">
        <Container size="wide">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href={`/projects/${prev.slug}`}
              className="group flex flex-col gap-2 rounded-2xl border border-border bg-surface p-5 transition hover:border-fg/30 sm:p-6"
            >
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted">
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("prevLabel")}
              </div>
              <div className="text-lg font-semibold tracking-tight group-hover:text-accent sm:text-xl">
                {prev.title}
              </div>
            </Link>
            <Link
              href={`/projects/${next.slug}`}
              className="group flex flex-col items-end gap-2 rounded-2xl border border-border bg-surface p-5 text-right transition hover:border-fg/30 sm:p-6"
            >
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted">
                {t("nextLabel")}
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
              <div className="text-lg font-semibold tracking-tight group-hover:text-accent sm:text-xl">
                {next.title}
              </div>
            </Link>
          </div>
        </Container>
      </section>

      <Script
        id={`ld-${project.slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </article>
  );
}
