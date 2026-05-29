"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Circle,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
  Zap,
} from "lucide-react";

type ProviderRow = {
  id: string;
  name: string;
  role: string;
  tier: string;
  envKeys: string[];
  setupHint: string;
  topUpUrl: string;
  docsUrl: string;
  pricingNote: string;
  usedFor: string[];
  step: number;
  configured: boolean;
};

type StatusPayload = {
  providers: ProviderRow[];
  coreConnected: number;
  coreTotal: number;
  stack: {
    layers: Array<{
      capability: string;
      provider: string;
      detail: string;
      quality: string;
    }>;
    llmPrimary: string;
    readyScore: number;
    readyTotal: number;
  };
  budget: {
    weeklyLimitAed: number;
    weeklySpentAed: number;
    weeklyRemainingAed: number;
  };
  envTemplate: string;
  deployUrl: string;
};

type PingState = {
  ok: boolean;
  latencyMs: number;
  message: string;
} | null;

export function IntegrationsHub() {
  const [data, setData] = useState<StatusPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinging, setPinging] = useState<string | null>(null);
  const [pings, setPings] = useState<Record<string, PingState>>({});
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/integrations", { cache: "no-store" });
      if (!res.ok) {
        setErr("Could not load integrations status.");
        return;
      }
      setData((await res.json()) as StatusPayload);
    } catch {
      setErr("Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const testProvider = async (id: string, full?: boolean) => {
    setPinging(id);
    try {
      const res = await fetch("/api/admin/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ping", providerId: id, full }),
      });
      const result = (await res.json()) as PingState;
      setPings((prev) => ({ ...prev, [id]: result }));
    } finally {
      setPinging(null);
    }
  };

  const copyEnv = async () => {
    if (!data?.envTemplate) return;
    await navigator.clipboard.writeText(data.envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--text-3)]">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading integrations…
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-sm text-[var(--red)]" role="alert">
        {err ?? "No data"}
      </p>
    );
  }

  const corePct = Math.round((data.coreConnected / data.coreTotal) * 100);
  const budgetPct =
    data.budget.weeklyLimitAed > 0
      ? Math.min(
          100,
          Math.round(
            (data.budget.weeklySpentAed / data.budget.weeklyLimitAed) * 100,
          ),
        )
      : 0;

  const steps = data.providers
    .filter((p) => p.step <= 5)
    .sort((a, b) => a.step - b.step);

  return (
    <div className="space-y-8">
      <section className="rounded-[var(--radius-lg)] border border-[color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--accent)]">
              Setup progress
            </p>
            <h2 className="mt-1 text-2xl font-medium text-[var(--text)]">
              {data.coreConnected} / {data.coreTotal} core APIs connected
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--text-2)]">
              Keys live in{" "}
              <strong className="text-[var(--text)]">Vercel env</strong> (production)
              and <strong className="text-[var(--text)]">.env.local</strong> (dev).
              This dashboard never stores secrets — only tests them.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            className="btn btn-secondary inline-flex h-10 items-center gap-2 px-4"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg-3)]">
          <div
            className="h-full bg-[var(--accent)] transition-all"
            style={{ width: `${corePct}%` }}
          />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
            Live stack (what cyob uses now)
          </p>
          <ul className="mt-4 space-y-3">
            {data.stack.layers.map((layer) => (
              <li
                key={layer.capability}
                className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">
                    {layer.capability}
                  </p>
                  <p className="text-xs text-[var(--text-3)]">{layer.detail}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[var(--text)]">
                    {layer.provider}
                  </p>
                  <span
                    className={`text-[10px] uppercase ${
                      layer.quality === "live"
                        ? "text-[var(--green)]"
                        : layer.quality === "fallback"
                          ? "text-[var(--amber)]"
                          : "text-[var(--text-4)]"
                    }`}
                  >
                    {layer.quality}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
            Weekly spend guard
          </p>
          <p className="mt-3 text-2xl font-medium tabular-nums text-[var(--text)]">
            {data.budget.weeklySpentAed.toFixed(1)} /{" "}
            {data.budget.weeklyLimitAed.toFixed(0)} AED
          </p>
          <p className="mt-1 text-xs text-[var(--text-3)]">
            ~{data.budget.weeklyRemainingAed.toFixed(0)} AED left · set{" "}
            <code className="text-[var(--accent)]">WEEKLY_BUDGET_AED</code> on Vercel
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg-3)]">
            <div
              className={`h-full ${budgetPct > 85 ? "bg-[var(--red)]" : "bg-[var(--amber)]"}`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <p className="mt-4 text-xs text-[var(--text-4)]">
            Best value: Claude Sonnet + Serper + FAL schnell · skip Apify until
            needed.
          </p>
        </section>
      </div>

      <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)] p-5">
        <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
          Step-by-step (do in order)
        </p>
        <ol className="mt-4 space-y-4">
          {steps.map((p) => (
            <li
              key={p.id}
              className="grid gap-4 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 lg:grid-cols-[auto_1fr_auto]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-3)] text-sm font-medium tabular-nums text-[var(--text)]">
                {p.configured ? (
                  <Check className="h-5 w-5 text-[var(--green)]" />
                ) : (
                  p.step
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-medium text-[var(--text)]">
                    {p.name}
                  </h3>
                  <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase text-[var(--text-4)]">
                    {p.tier}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--text-3)]">{p.role}</p>
                <p className="mt-2 font-mono text-[11px] text-[var(--accent)]">
                  {p.envKeys.join(", ")}
                </p>
                <p className="mt-2 text-xs text-[var(--text-4)]">{p.setupHint}</p>
                <p className="mt-1 text-[11px] text-[var(--text-4)]">
                  {p.pricingNote}
                </p>
                {pings[p.id] ? (
                  <p
                    className={`mt-2 text-xs ${pings[p.id]!.ok ? "text-[var(--green)]" : "text-[var(--red)]"}`}
                  >
                    {pings[p.id]!.message}
                    {pings[p.id]!.latencyMs
                      ? ` · ${pings[p.id]!.latencyMs}ms`
                      : ""}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                <a
                  href={p.topUpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex h-9 items-center justify-center gap-1 px-3 text-xs"
                >
                  Top up / billing
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  type="button"
                  disabled={!p.configured || pinging === p.id}
                  onClick={() => void testProvider(p.id, p.id === "fal")}
                  className="btn btn-secondary inline-flex h-9 items-center justify-center gap-1 px-3 text-xs disabled:opacity-40"
                >
                  {pinging === p.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Zap className="h-3 w-3" />
                  )}
                  Test{p.id === "fal" ? " (light)" : ""}
                </button>
                <a
                  href={p.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-[11px] text-[var(--text-4)] hover:text-[var(--accent)]"
                >
                  Pricing docs →
                </a>
              </div>
            </li>
          ))}
          <li className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] p-4">
            <p className="text-sm font-medium text-[var(--text)]">
              Step 6 — Deploy keys
            </p>
            <p className="mt-1 text-xs text-[var(--text-3)]">
              Paste env vars into Vercel → cyob → Settings → Environment Variables
              → Production → Redeploy.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copyEnv()}
                className="btn btn-secondary inline-flex h-9 items-center gap-2 px-3 text-xs"
              >
                <Copy className="h-3 w-3" />
                {copied ? "Copied" : "Copy .env template"}
              </button>
              <a
                href={data.deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary inline-flex h-9 items-center gap-1 px-3 text-xs"
              >
                Open Vercel
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
          Optional upgrades
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.providers
            .filter((p) => p.step > 5)
            .map((p) => (
              <div
                key={p.id}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--text)]">
                    {p.name}
                  </p>
                  {p.configured ? (
                    <Check className="h-4 w-4 text-[var(--green)]" />
                  ) : (
                    <Circle className="h-4 w-4 text-[var(--text-4)]" />
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--text-3)]">{p.role}</p>
                <button
                  type="button"
                  disabled={!p.configured || pinging === p.id}
                  onClick={() => void testProvider(p.id)}
                  className="mt-3 text-xs text-[var(--accent)] hover:underline disabled:opacity-40"
                >
                  Test connection
                </button>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
