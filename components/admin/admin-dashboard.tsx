"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Loader2,
  LogOut,
  RefreshCw,
  X,
} from "lucide-react";

type Provider = {
  id: string;
  name: string;
  role: string;
  envKeys: string[];
  topUpUrl: string;
  configured: boolean;
  step: number;
};

type DashData = {
  providers: Provider[];
  coreConnected: number;
  coreTotal: number;
  stack: { llmPrimary: string };
  budget: {
    weeklyLimitAed: number;
    weeklySpentAed: number;
    weeklyRemainingAed: number;
  };
  envTemplate: string;
  deployUrl: string;
};

const ICONS: Record<string, string> = {
  anthropic: "Claude",
  gemini: "Gemini",
  serper: "Search",
  fal: "Images",
  resend: "Email",
  openai: "GPT",
  seedance: "Video",
  tavily: "Tavily",
  apify: "Scrape",
};

export function AdminDashboard({
  cap,
}: {
  cap: { spent_cents: number; cap_cents: number } | null;
}) {
  const router = useRouter();
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);
  const [testMsg, setTestMsg] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/integrations", { cache: "no-store" });
      if (res.ok) setData((await res.json()) as DashData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const logout = async () => {
    await fetch("/api/admin/gate", { method: "DELETE" });
    router.refresh();
  };

  const test = async (id: string) => {
    setTesting(id);
    const res = await fetch("/api/admin/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ping", providerId: id }),
    });
    const j = (await res.json()) as { ok?: boolean; message?: string };
    setTestMsg((m) => ({
      ...m,
      [id]: j.ok ? `✓ ${j.message}` : `✗ ${j.message}`,
    }));
    setTesting(null);
  };

  const core = data?.providers.filter((p) => p.step <= 5) ?? [];
  const pct = data
    ? Math.round((data.coreConnected / data.coreTotal) * 100)
    : 0;

  return (
    <div className="mx-auto min-h-dvh max-w-4xl px-5 py-8 md:px-8 md:py-12">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/cyob-logo.png"
            alt=""
            width={120}
            height={96}
            className="h-9 w-auto brightness-0 invert"
          />
          <div>
            <h1 className="text-lg font-semibold text-[var(--text)]">Admin</h1>
            <p className="text-xs text-[var(--text-4)]">cyob control</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--surface)]"
            aria-label="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--surface)]"
            aria-label="Lock"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <section className="mt-8 rounded-[var(--radius-xl)] border border-[var(--border)] bg-gradient-to-br from-[var(--bg-2)] to-[var(--bg-3)] p-6">
        <p className="text-xs uppercase tracking-wider text-[var(--text-4)]">
          Status
        </p>
        <p className="mt-2 text-3xl font-semibold tabular-nums text-[var(--text)]">
          {data ? `${data.coreConnected} of ${data.coreTotal}` : "—"}
          <span className="ml-2 text-lg font-normal text-[var(--text-3)]">
            APIs ready
          </span>
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        {data ? (
          <p className="mt-3 text-sm text-[var(--text-3)]">
            AI: <span className="text-[var(--text)]">{data.stack.llmPrimary}</span>
            {" · "}
            Budget: {data.budget.weeklySpentAed.toFixed(0)} /{" "}
            {data.budget.weeklyLimitAed.toFixed(0)} AED this week
          </p>
        ) : null}
      </section>

      <h2 className="mt-10 text-sm font-medium text-[var(--text-2)]">
        Connect these 5
      </h2>
      <ul className="mt-4 space-y-3">
        {loading && !data ? (
          <li className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--text-4)]" />
          </li>
        ) : (
          core.map((p) => (
            <li
              key={p.id}
              className={`flex flex-col gap-3 rounded-[var(--radius-lg)] border p-4 sm:flex-row sm:items-center sm:justify-between ${
                p.configured
                  ? "border-[color-mix(in_oklab,var(--green)_40%,transparent)] bg-[color-mix(in_oklab,var(--green)_6%,transparent)]"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-xs font-bold uppercase ${
                    p.configured
                      ? "bg-[color-mix(in_oklab,var(--green)_20%,transparent)] text-[var(--green)]"
                      : "bg-[var(--bg-3)] text-[var(--text-4)]"
                  }`}
                >
                  {ICONS[p.id] ?? p.id.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-[var(--text)]">{p.name}</p>
                    {p.configured ? (
                      <Check className="h-4 w-4 text-[var(--green)]" />
                    ) : (
                      <X className="h-4 w-4 text-[var(--text-4)]" />
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-3)]">{p.role}</p>
                  <p className="mt-1 font-mono text-[10px] text-[var(--text-4)]">
                    {p.envKeys[0]}
                  </p>
                  {testMsg[p.id] ? (
                    <p className="mt-1 text-[11px] text-[var(--text-3)]">
                      {testMsg[p.id]}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex gap-2 sm:flex-col sm:items-stretch">
                <a
                  href={p.topUpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex h-10 flex-1 items-center justify-center gap-1 px-4 text-sm sm:flex-none"
                >
                  Add credit
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  disabled={!p.configured || testing === p.id}
                  onClick={() => void test(p.id)}
                  className="btn btn-secondary inline-flex h-10 flex-1 items-center justify-center px-4 text-sm sm:flex-none disabled:opacity-40"
                >
                  {testing === p.id ? "…" : "Test"}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <section className="mt-10 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={async () => {
            if (data?.envTemplate) {
              await navigator.clipboard.writeText(data.envTemplate);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          }}
          className="flex items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] py-4 text-sm font-medium text-[var(--text)] hover:bg-[var(--bg-2)]"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Copied keys list" : "Copy env names"}
        </button>
        <a
          href={data?.deployUrl ?? "https://vercel.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] py-4 text-sm font-medium text-[var(--text)] hover:bg-[var(--bg-2)]"
        >
          Paste in Vercel
          <ExternalLink className="h-4 w-4" />
        </a>
      </section>

      {data && data.providers.filter((p) => p.step > 5).length > 0 ? (
        <>
          <h2 className="mt-10 text-sm font-medium text-[var(--text-2)]">
            Premium add-ons
          </h2>
          <ul className="mt-4 space-y-3">
            {data.providers
              .filter((p) => p.step > 5)
              .map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">
                      {p.name}
                    </p>
                    <p className="text-xs text-[var(--text-4)]">{p.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.configured ? (
                      <Check className="h-4 w-4 text-[var(--green)]" />
                    ) : (
                      <X className="h-4 w-4 text-[var(--text-4)]" />
                    )}
                    <button
                      type="button"
                      disabled={!p.configured || testing === p.id}
                      onClick={() => void test(p.id)}
                      className="text-xs text-[var(--accent)] disabled:opacity-40"
                    >
                      Test
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </>
      ) : null}

      {cap ? (
        <p className="mt-8 text-center text-xs text-[var(--text-4)]">
          Month spend ${(cap.spent_cents / 100).toFixed(2)} / $
          {(cap.cap_cents / 100).toFixed(0)}
        </p>
      ) : null}

      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-[var(--text-4)] hover:text-[var(--accent)]">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
