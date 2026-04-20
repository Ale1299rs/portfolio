"use client";

import { useEffect, useState } from "react";

type FileMeta = { path: string; label: string };
type LoadedFile = { path: string; content: string; sha: string };

export function AdminApp({
  authed,
  files,
}: {
  authed: boolean;
  files: FileMeta[];
}) {
  const [loggedIn, setLoggedIn] = useState(authed);

  if (!loggedIn) {
    return <LoginScreen onSuccess={() => setLoggedIn(true)} />;
  }
  return <Editor files={files} />;
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg text-fg">
      <div className="mx-auto flex min-h-screen max-w-sm items-center px-4">
        <form
          onSubmit={submit}
          className="w-full rounded-2xl border border-border bg-surface p-6 shadow-soft"
        >
          <h1 className="text-lg font-semibold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-muted">
            Inserisci la password per modificare il sito.
          </p>
          <label className="mt-5 block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Password
            </span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </label>
          {error && (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || !password}
            className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl bg-accent text-sm font-medium text-accent-fg transition hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? "…" : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Editor({ files }: { files: FileMeta[] }) {
  const [activePath, setActivePath] = useState<string>(files[0].path);
  const [loaded, setLoaded] = useState<LoadedFile | null>(null);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      setStatus(null);
      try {
        const res = await fetch(
          `/api/admin/file?path=${encodeURIComponent(activePath)}`,
          { cache: "no-store" },
        );
        const data = (await res.json()) as {
          content?: string;
          sha?: string;
          error?: string;
        };
        if (!res.ok || !data.content || !data.sha) {
          throw new Error(data.error ?? `HTTP ${res.status}`);
        }
        if (cancelled) return;
        setLoaded({ path: activePath, content: data.content, sha: data.sha });
        setDraft(data.content);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activePath]);

  async function save() {
    if (!loaded) return;
    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      if (activePath.endsWith(".json")) {
        try {
          JSON.parse(draft);
        } catch (e) {
          throw new Error(`JSON non valido: ${(e as Error).message}`);
        }
      }
      const res = await fetch("/api/admin/file", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: activePath,
          content: draft,
          sha: loaded.sha,
        }),
      });
      const data = (await res.json()) as { sha?: string; error?: string };
      if (!res.ok || !data.sha) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      setLoaded({ path: activePath, content: draft, sha: data.sha });
      setStatus("Salvato. Vercel ridesploya tra 1-2 min.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const dirty = loaded !== null && draft !== loaded.content;

  return (
    <main className="min-h-screen bg-bg text-fg">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[280px_1fr]">
        <aside className="border-b border-border bg-surface p-4 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-semibold tracking-tight">Admin</h1>
            <button
              type="button"
              onClick={logout}
              className="text-[11px] text-muted hover:text-fg"
            >
              Logout
            </button>
          </div>
          <ul className="mt-4 space-y-1">
            {files.map((f) => (
              <li key={f.path}>
                <button
                  type="button"
                  onClick={() => setActivePath(f.path)}
                  className={`w-full rounded-lg px-2.5 py-1.5 text-left text-[13px] transition ${
                    f.path === activePath
                      ? "bg-accent/15 text-fg"
                      : "text-muted hover:bg-surface-2 hover:text-fg"
                  }`}
                >
                  {f.label}
                  <span className="mt-0.5 block text-[10px] text-muted/70">
                    {f.path}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-border bg-surface-2/50 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-xs text-muted">{activePath}</p>
              {dirty && (
                <span className="mt-0.5 inline-block rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-500">
                  Modifiche non salvate
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || saving || loading}
              className="inline-flex h-9 items-center rounded-xl bg-accent px-4 text-sm font-medium text-accent-fg transition hover:brightness-110 disabled:opacity-50"
            >
              {saving ? "Salvo…" : "Salva"}
            </button>
          </header>

          {(status || error) && (
            <div
              className={`border-b px-4 py-2 text-xs ${
                error
                  ? "border-red-500/30 bg-red-500/10 text-red-500"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
              }`}
            >
              {error ?? status}
            </div>
          )}

          <div className="flex-1 p-4">
            {loading ? (
              <div className="text-sm text-muted">Carico…</div>
            ) : (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                spellCheck={false}
                className="h-[calc(100vh-140px)] w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 font-mono text-[12.5px] leading-relaxed text-fg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
