"use client";

import { useState } from "react";

export function AdminApp({
  authed,
  files: _files,
}: {
  authed: boolean;
  files: { path: string; label: string }[];
}) {
  const [loggedIn, setLoggedIn] = useState(authed);

  if (loggedIn) {
    // Already authenticated — activate admin mode and redirect
    if (typeof window !== "undefined") {
      sessionStorage.setItem("admin-mode", "true");
      window.location.replace("/it");
    }
    return (
      <main className="min-h-screen bg-bg text-fg flex items-center justify-center">
        <p className="text-sm text-muted">Reindirizzamento al sito...</p>
      </main>
    );
  }

  return <LoginScreen onSuccess={() => setLoggedIn(true)} />;
}

function LoginScreen({ onSuccess: _onSuccess }: { onSuccess: () => void }) {
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
      // Set admin mode and redirect directly to the live site
      sessionStorage.setItem("admin-mode", "true");
      window.location.replace("/it");
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
          className="w-full rounded-2xl border border-border bg-surface p-8 shadow-soft"
        >
          <div className="mb-6 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            <h1 className="text-lg font-semibold tracking-tight">Admin</h1>
          </div>
          <p className="text-sm text-muted mb-5">
            Inserisci la password per attivare la modalità di editing inline sul sito.
          </p>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              Password
            </span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
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
            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-medium text-accent-fg transition hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? "Accesso..." : "Accedi e attiva editing ✏️"}
          </button>
        </form>
      </div>
    </main>
  );
}
