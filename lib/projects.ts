import type { Locale } from "@/i18n/routing";
import p01 from "@/content/projects/salesforce-cpq-implementation.json";
import p02 from "@/content/projects/salesforce-service-cloud-rollout.json";
import p03 from "@/content/projects/salesforce-sales-cloud-pipeline.json";
import p04 from "@/content/projects/powerbi-cockpit-over-salesforce.json";
import p05 from "@/content/projects/crm-data-quality-framework.json";
import p06 from "@/content/projects/salesforce-opportunity-process-mining.json";
import p07 from "@/content/projects/opportunity-lifecycle-automation.json";
import p08 from "@/content/projects/staffing-portal-powerapps.json";

export type Metric = {
  label: string;
  value: string;
  detail?: string;
};

type LocalizedProject = {
  title: string;
  tagline: string;
  industry: string;
  duration: string;
  problem: string;
  data: string[];
  solution: string[];
  impact: Metric[];
  takeaway: string;
};

export type RawProject = {
  slug: string;
  order: number;
  category:
    | "Salesforce"
    | "Power BI"
    | "CRM Optimization"
    | "Data Quality"
    | "Automation"
    | "Process Mining"
    | "PowerApps";
  year: string;
  stack: string[];
  hero: { accent: string };
  featured?: boolean;
  en: LocalizedProject;
  it: LocalizedProject;
};

export type Project = Omit<RawProject, "en" | "it" | "order"> & LocalizedProject;

export const rawProjects: RawProject[] = [p01, p02, p03, p04, p05, p06, p07, p08]
  .map((p) => p as RawProject)
  .sort((a, b) => a.order - b.order);

export function getProjects(locale: Locale): Project[] {
  return rawProjects.map((p) => {
    const loc = p[locale];
    return {
      slug: p.slug,
      category: p.category,
      year: p.year,
      stack: p.stack,
      hero: p.hero,
      featured: p.featured,
      ...loc,
    };
  });
}

export function getProject(locale: Locale, slug: string) {
  return getProjects(locale).find((p) => p.slug === slug);
}

export function getFeaturedProjects(locale: Locale) {
  return getProjects(locale).filter((p) => p.featured);
}

export const allSlugs = rawProjects.map((p) => p.slug);
