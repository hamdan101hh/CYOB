import Link from "next/link";
import { notFound } from "next/navigation";

import { RefreshTrendsButton } from "@/components/dashboard/refresh-trends-button";
import { TierLock } from "@/components/run/tier-lock";
import { getRunBundle } from "@/lib/data/get-run";
import { parseRunDisplay } from "@/lib/data/parse-run-display";
import { listAgentTiles } from "@/lib/orchestrator/agent-metadata";

export default async function DashboardRunPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const bundle = await getRunBundle(runId);
  if (!bundle) notFound();

  const tiles = listAgentTiles(bundle.current_agent, bundle.status);
  const locked = bundle.tier === "free";
  const display = parseRunDisplay(bundle);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-14 md:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-[var(--text-3)]">Dashboard</p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight text-[var(--text)] md:text-4xl">
            {bundle.intake.company}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-2)]">
            {bundle.intake.industry} · {bundle.intake.geography}
            {bundle.intake.city ? ` · ${bundle.intake.city}` : ""} ·{" "}
            <span className="text-[var(--text-3)]">{bundle.intake.vibe}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RefreshTrendsButton runId={runId} />
          <Link
            href={`/plan/${runId}`}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] hover:border-[var(--border-2)]"
          >
            Open plan
          </Link>
          <Link
            href={`/library/${runId}`}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] hover:border-[var(--border-2)]"
          >
            Open library
          </Link>
          {locked ? (
            <span className="rounded-[var(--radius-md)] border border-[var(--gold)]/40 bg-[color-mix(in_oklab,var(--gold)_12%,transparent)] px-4 py-2 text-sm text-[var(--gold)]">
              Upgrade
            </span>
          ) : null}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--text-4)]">
          Agent pipeline
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {tiles.map((t) => (
            <div
              key={t.number}
              className={`rounded-[var(--radius-md)] border px-3 py-3 text-xs ${
                t.state === "done"
                  ? "border-[var(--green)]/30 bg-[color-mix(in_oklab,var(--green)_10%,transparent)] text-[var(--text)]"
                  : t.state === "active"
                    ? "border-[var(--gold)]/40 bg-[color-mix(in_oklab,var(--gold)_12%,transparent)] text-[var(--text)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-3)]"
              }`}
            >
              <p className="text-[var(--text-4)]">#{String(t.number).padStart(2, "0")}</p>
              <p className="mt-1 text-sm font-medium text-[var(--text)]">{t.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <TierLock locked={locked}>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
              Trend radar
            </p>
            <ul className="mt-3 space-y-2">
              {display.trends.map((t) => (
                <li key={t.name} className="text-sm text-[var(--text-2)]">
                  <span className="text-[var(--text)]">{t.name}</span>
                  <span className="ml-2 text-[var(--amber)]">{t.heat}</span>
                </li>
              ))}
            </ul>
          </div>
        </TierLock>
        <TierLock locked={locked}>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
              Gap board
            </p>
            <ul className="mt-3 space-y-2">
              {display.gaps.map((g) => (
                <li key={g.name} className="text-sm text-[var(--text-2)]">
                  {g.name}{" "}
                  <span className="text-[var(--red)]">({g.severity})</span>
                </li>
              ))}
            </ul>
          </div>
        </TierLock>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
            Competitors
          </p>
          <ul className="mt-3 space-y-2">
            {display.competitors.map((c) => (
              <li key={c.name} className="text-sm text-[var(--text-2)]">
                {c.name} — {c.threat}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--text-4)]">
          Latest agent memos
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((n) => {
            const out = bundle.outputs[n];
            return (
              <TierLock key={n} locked={locked && n > 1}>
                <article className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)] p-5">
                  <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
                    Agent {String(n).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-2)]">
                    {out?.output_text ??
                      "Waiting for orchestrator output for this agent."}
                  </p>
                </article>
              </TierLock>
            );
          })}
        </div>
      </section>
    </div>
  );
}
