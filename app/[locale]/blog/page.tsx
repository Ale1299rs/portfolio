import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/layout/Reveal";
import { getPosts } from "@/lib/blog";
import { routing, type Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogPage" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}/blog`]),
  );
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/blog`, languages },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blogPage");
  const posts = getPosts(locale as Locale);

  const [featured, ...rest] = posts;
  const dateFormatter = new Intl.DateTimeFormat(
    locale === "it" ? "it-IT" : "en-GB",
    { year: "numeric", month: "short", day: "numeric" },
  );

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
              {t("titleBefore")}{" "}
              <span className="text-gradient">{t("titleAccent")}</span>
              {t("titleAfter")}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {t("description")}
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-10">
        <Container size="wide">
          <Reveal>
            <a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-6 overflow-hidden rounded-2xl border border-border bg-surface p-6 transition hover:-translate-y-0.5 hover:border-fg/20 hover:shadow-soft md:grid-cols-[1fr_1.5fr] md:p-8"
            >
              <div className="flex flex-col justify-between gap-6">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-accent">
                    {t("featured")}
                  </span>
                  <div className="mt-4 text-xs uppercase tracking-wider text-muted">
                    {dateFormatter.format(new Date(featured.date))} ·{" "}
                    {featured.readingTime}
                  </div>
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {featured.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {featured.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  {t("readOnMedium")}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>
          </Reveal>
        </Container>
      </section>

      <section className="pb-24">
        <Container size="wide">
          <ul className="grid gap-4 md:grid-cols-2">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.04}>
                <li>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition hover:-translate-y-0.5 hover:border-fg/20 hover:shadow-soft"
                  >
                    <div className="text-xs uppercase tracking-wider text-muted">
                      {dateFormatter.format(new Date(post.date))} ·{" "}
                      {post.readingTime}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto pt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      {t("read")}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </a>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
