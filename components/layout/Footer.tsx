import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export async function Footer() {
  const tNav = await getTranslations("nav");
  const tSite = await getTranslations("site");
  const tFooter = await getTranslations("footer");
  const services = tFooter.raw("serviceItems") as string[];
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-bg">
      <Container size="wide" className="py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-fg text-bg">
                <span className="text-[13px] font-bold">AE</span>
              </span>
              {site.name}
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {tSite("description")}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              {tFooter("navigate")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-fg/80 transition hover:text-fg"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              {tFooter("services")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-fg/80">
              {services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              {tFooter("elsewhere")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={site.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg/80 transition hover:text-fg"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={site.socials.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg/80 transition hover:text-fg"
                >
                  Medium
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. {tFooter("rights")}
          </p>
          <p>{tFooter("builtWith")}</p>
        </div>
      </Container>
    </footer>
  );
}
