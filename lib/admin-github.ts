// GitHub REST helpers for the /admin file editor. Server-only.

const DEFAULT_REPO = "Ale1299rs/portfolio";
const DEFAULT_BRANCH = "main";

function getRepo(): string {
  return process.env.GITHUB_REPO ?? DEFAULT_REPO;
}

function getBranch(): string {
  return process.env.GITHUB_BRANCH ?? DEFAULT_BRANCH;
}

function getToken(): string | null {
  return process.env.GITHUB_PAT ?? null;
}

function apiUrl(path: string): string {
  return `https://api.github.com/repos/${getRepo()}/contents/${path}?ref=${getBranch()}`;
}

type GitHubContent = {
  content: string;
  encoding: string;
  sha: string;
  path: string;
};

export async function loadFile(
  path: string,
): Promise<{ content: string; sha: string } | { error: string }> {
  const token = getToken();
  if (!token) return { error: "Missing GITHUB_PAT env var on the server." };

  const res = await fetch(apiUrl(path), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (res.status === 404) {
    return { error: `File not found in repo: ${path}` };
  }
  if (!res.ok) {
    return { error: `GitHub GET failed (${res.status})` };
  }
  const data = (await res.json()) as GitHubContent;
  if (data.encoding !== "base64") {
    return { error: `Unexpected encoding: ${data.encoding}` };
  }
  const content = atob(data.content.replace(/\n/g, ""));
  return { content, sha: data.sha };
}

export async function saveFile(
  path: string,
  content: string,
  sha: string,
  message: string,
): Promise<{ ok: true; sha: string } | { ok: false; error: string }> {
  const token = getToken();
  if (!token) return { ok: false, error: "Missing GITHUB_PAT env var." };

  const body = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    sha,
    branch: getBranch(),
  };

  const res = await fetch(
    `https://api.github.com/repos/${getRepo()}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      ok: false,
      error: `GitHub PUT failed (${res.status}): ${text.slice(0, 300)}`,
    };
  }
  const data = (await res.json()) as { content?: { sha?: string } };
  return { ok: true, sha: data.content?.sha ?? sha };
}

export const EDITABLE_FILES: { path: string; label: string; format: "json" }[] = [
  { path: "content/site.json", label: "Site settings", format: "json" },
  { path: "content/chatbot.json", label: "Chatbot persona", format: "json" },
  { path: "messages/en.json", label: "UI copy — English", format: "json" },
  { path: "messages/it.json", label: "UI copy — Italian", format: "json" },
  { path: "content/projects/salesforce-cpq-implementation.json", label: "Project · Salesforce CPQ", format: "json" },
  { path: "content/projects/salesforce-service-cloud-rollout.json", label: "Project · Service Cloud rollout", format: "json" },
  { path: "content/projects/salesforce-sales-cloud-pipeline.json", label: "Project · Sales Cloud pipeline", format: "json" },
  { path: "content/projects/powerbi-cockpit-over-salesforce.json", label: "Project · Power BI cockpit", format: "json" },
  { path: "content/projects/crm-data-quality-framework.json", label: "Project · CRM data quality", format: "json" },
  { path: "content/projects/salesforce-opportunity-process-mining.json", label: "Project · Opportunity process mining", format: "json" },
  { path: "content/projects/opportunity-lifecycle-automation.json", label: "Project · Opportunity automation", format: "json" },
  { path: "content/projects/staffing-portal-powerapps.json", label: "Project · PowerApps staffing portal", format: "json" },
];

export function isEditablePath(path: string): boolean {
  return EDITABLE_FILES.some((f) => f.path === path);
}
