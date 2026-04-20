import siteData from "@/content/site.json";

export const site = {
  ...siteData,
  nav: [
    { href: "/", key: "home" },
    { href: "/projects", key: "work" },
    { href: "/about", key: "about" },
    { href: "/blog", key: "writing" },
  ] as const,
};

export type SiteConfig = typeof site;
