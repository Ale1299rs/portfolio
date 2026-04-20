import type { Locale } from "@/i18n/routing";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readingTime: string;
  tags: string[];
  url: string;
};

type RawPost = Omit<Post, "title" | "excerpt" | "readingTime"> & {
  en: Pick<Post, "title" | "excerpt" | "readingTime">;
  it: Pick<Post, "title" | "excerpt" | "readingTime">;
};

const rawPosts: RawPost[] = [
  {
    slug: "forecast-accuracy-is-a-data-contract-problem",
    date: "2026-02-18",
    tags: ["Salesforce", "RevOps", "Forecasting"],
    url: "https://medium.com/@ale.espos90/salesforce-forecast-accuracy-is-a-data-contract-problem-8abd772ddd10",
    en: {
      title: "Forecast Accuracy Is a Data-Contract Problem",
      excerpt:
        "Before you touch a forecasting model, agree on what each Salesforce stage actually means. Most of the accuracy gain lives there.",
      readingTime: "7 min",
    },
    it: {
      title: "L’accuratezza del forecast è un problema di data contract",
      excerpt:
        "Prima di toccare un modello di forecast, concorda cosa significa davvero ogni stage di Salesforce. È lì che vive la maggior parte del guadagno di accuratezza.",
      readingTime: "7 min",
    },
  },
];

export function getPosts(locale: Locale): Post[] {
  return rawPosts.map((p) => ({
    slug: p.slug,
    date: p.date,
    tags: p.tags,
    url: p.url,
    ...p[locale],
  }));
}
