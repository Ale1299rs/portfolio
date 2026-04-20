import { getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="py-24 sm:py-32">
      <Container size="wide">
        <div className="mx-auto max-w-xl text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            {t("code")}
          </div>
          <h1 className="mt-4 text-display-lg font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {t("description")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-fg transition hover:brightness-110"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("home")}
            </Link>
            <Link
              href="/projects"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium transition hover:border-fg/20"
            >
              {t("projects")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
