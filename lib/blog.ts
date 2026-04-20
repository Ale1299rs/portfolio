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
    url: "https://medium.com/",
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
  {
    slug: "the-dashboard-that-replaced-a-meeting",
    date: "2026-01-09",
    tags: ["Power BI", "Leadership", "BI"],
    url: "https://medium.com/",
    en: {
      title: "The Dashboard That Replaced a Meeting",
      excerpt:
        "A Power BI cockpit is not a chart gallery. Design it around the decisions on the agenda, not the data you happen to have.",
      readingTime: "6 min",
    },
    it: {
      title: "La dashboard che ha sostituito una riunione",
      excerpt:
        "Un cockpit Power BI non è una galleria di grafici. Progettalo attorno alle decisioni in agenda, non ai dati che ti capita di avere.",
      readingTime: "6 min",
    },
  },
  {
    slug: "stop-measuring-data-quality-in-vibes",
    date: "2025-11-22",
    tags: ["Data Quality", "CRM", "Ops"],
    url: "https://medium.com/",
    en: {
      title: "Stop Measuring Data Quality in Vibes",
      excerpt:
        "A weighted Data Quality Index gives you a scoreboard leadership can defend. Here is a minimal version you can ship in a week.",
      readingTime: "8 min",
    },
    it: {
      title: "Smetti di misurare la data quality a sensazione",
      excerpt:
        "Un Data Quality Index ponderato ti dà una scoreboard che la leadership può difendere. Ecco una versione minima che puoi consegnare in una settimana.",
      readingTime: "8 min",
    },
  },
  {
    slug: "why-rule-based-beats-ml-for-customer-health",
    date: "2025-09-30",
    tags: ["Customer Success", "Analytics"],
    url: "https://medium.com/",
    en: {
      title: "Why Rule-Based Beats ML for Customer Health (At First)",
      excerpt:
        "An explainable score CSMs trust beats a black box they override. Earn the right to add ML later — start with rules your team can debate.",
      readingTime: "5 min",
    },
    it: {
      title: "Perché il rule-based batte l’ML per il Customer Health (all’inizio)",
      excerpt:
        "Uno score spiegabile di cui i CSM si fidano batte una black box che scavalcano. Guadagnati il diritto di aggiungere ML dopo — parti da regole che il tuo team può discutere.",
      readingTime: "5 min",
    },
  },
  {
    slug: "attribution-is-a-negotiation",
    date: "2025-07-14",
    tags: ["Marketing", "Attribution", "BI"],
    url: "https://medium.com/",
    en: {
      title: "Attribution Is a Negotiation",
      excerpt:
        "Show three honest models side by side. You will earn more credibility than any single ‘correct’ number ever could.",
      readingTime: "6 min",
    },
    it: {
      title: "L’attribuzione è una negoziazione",
      excerpt:
        "Mostra tre modelli onesti fianco a fianco. Guadagnerai più credibilità di quanto potrà mai darti un singolo numero ‘giusto’.",
      readingTime: "6 min",
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
