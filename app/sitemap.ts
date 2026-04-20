import type { MetadataRoute } from "next";
import { allSlugs } from "@/lib/projects";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/projects", "/about", "/blog"];
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((p) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${site.url}/${l}${p}`]),
        ),
      },
    })),
  );

  const projectEntries: MetadataRoute.Sitemap = allSlugs.flatMap((slug) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${site.url}/${l}/projects/${slug}`]),
        ),
      },
    })),
  );

  return [...staticEntries, ...projectEntries];
}
