import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/layout/Reveal";
import { site } from "@/lib/site";
import { routing } from "@/i18n/routing";
import { InlineTranslation } from "@/components/ui/InlineTranslation";

type Principle = { title: string; body: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}/about`]),
  );
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `/${locale}/about`, languages },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");
  const tSite = await getTranslations("site");

  const principles = t.raw("principles") as Principle[];
  const now = t.raw("now") as string[];

  return (
    <>
      <section className="pb-12 pt-16 sm:pt-24">
        <Container size="wide">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <InlineTranslation namespace="aboutPage" tKey="eyebrow" initialText={t("eyebrow")} />
              </span>
              <h1 className="mt-5 text-display-lg font-semibold tracking-tight">
                <InlineTranslation namespace="aboutPage" tKey="titleBefore" initialText={t("titleBefore")} />{" "}
                <span className="text-gradient"><InlineTranslation namespace="aboutPage" tKey="titleAccent" initialText={t("titleAccent")} /></span>{" "}
                <InlineTranslation namespace="aboutPage" tKey="titleAfter" initialText={t("titleAfter")} />
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                <InlineTranslation namespace="aboutPage" tKey="intro" initialText={t("intro", { name: site.name, location: tSite("location") })} />
              </p>
            </div>
            <aside className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                <InlineTranslation namespace="aboutPage" tKey="glanceTitle" initialText={t("glanceTitle")} />
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">
                    {t("glance.years")}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold">5+</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">
                    {t("glance.engagements")}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold">8</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">
                    {t("glance.stack")}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">
                    Salesforce, Power BI, Automation
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">
                    {t("glance.based")}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{tSite("location")}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container size="wide">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="relative inline-flex h-2.5 w-2.5"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                <InlineTranslation namespace="aboutPage" tKey="nowTitle" initialText={t("nowTitle")} />
              </h2>
            </div>
            <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted">
              {now.map((line) => (
                <li key={line} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface/40 py-16 sm:py-20">
        <Container size="wide">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <InlineTranslation namespace="aboutPage" tKey="principlesTitle" initialText={t("principlesTitle")} />
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.04}>
                <article className="rounded-2xl border border-border bg-surface p-6">
                  <h3 className="text-lg font-semibold tracking-tight">
                    <InlineTranslation namespace="aboutPage" tKey={`principles.${i}.title`} initialText={p.title} />
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    <InlineTranslation namespace="aboutPage" tKey={`principles.${i}.body`} initialText={p.body} />
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
