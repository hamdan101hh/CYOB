import Link from "next/link";
import { notFound } from "next/navigation";

import { TierLock } from "@/components/run/tier-lock";
import { getRunBundle } from "@/lib/data/get-run";
import { parseRunDisplay } from "@/lib/data/parse-run-display";
import { RefreshTrendsButton } from "@/components/dashboard/refresh-trends-button";

export default async function PlanRunPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const bundle = await getRunBundle(runId);
  if (!bundle) notFound();

  const locked = bundle.tier === "free";
  const display = parseRunDisplay(bundle);
  const toc = [
    { label: "Executive memo", href: "#executive-memo" },
    { label: "Trends", href: "#trends" },
    { label: "Gaps", href: "#gaps" },
    { label: "Moves", href: "#moves" },
    { label: "Roadmap", href: "#roadmap" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--text-3)]">Strategic plan</p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight text-[var(--text)]">
            {bundle.intake.company}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <RefreshTrendsButton runId={runId} />
          <Link
            href={`/dashboard/${runId}`}
            className="text-sm text-[var(--gold)] underline-offset-4 hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="Plan table of contents" className="space-y-2 text-sm">
            {toc.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text-2)]"
                >
                  {item.label}
                </a>
              ))}
          </nav>
        </aside>
        <div className="space-y-8">
          <TierLock locked={locked}>
            <section
              id="executive-memo"
              className="scroll-mt-24 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)] p-6"
            >
              <h2 className="text-lg font-medium text-[var(--text)]">
                Executive memo
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-2)]">
                {display.memo ??
                  "Master synthesis will appear here once Agent 09 completes."}
              </p>
            </section>
          </TierLock>
          <TierLock locked={locked}>
            <section
              id="trends"
              className="scroll-mt-24 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)] p-6"
            >
              <h2 className="text-lg font-medium text-[var(--text)]">
                Evidence-backed trends
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-2)]">
                {display.trends.map((t) => (
                  <li key={t.name}>
                    {t.name} ({t.heat}) —{" "}
                    {t.evidence_url ? (
                      <a
                        href={t.evidence_url}
                        className="text-[var(--blue)] underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        evidence
                      </a>
                    ) : (
                      "demo link"
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </TierLock>
          <TierLock locked={locked}>
            <section
              id="gaps"
              className="scroll-mt-24 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)] p-6"
            >
              <h2 className="text-lg font-medium text-[var(--text)]">
                Gap analysis
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-2)]">
                {display.gaps.map((gap) => (
                  <li key={gap.name}>
                    <span className="text-[var(--text)]">{gap.name}</span>{" "}
                    <span className="text-[var(--red)]">({gap.severity})</span>
                  </li>
                ))}
              </ul>
            </section>
          </TierLock>
          <TierLock locked={locked}>
            <section
              id="moves"
              className="scroll-mt-24 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)] p-6"
            >
              <h2 className="text-lg font-medium text-[var(--text)]">
                Priority moves
              </h2>
              {display.northStar ? (
                <p className="mt-3 text-sm text-[var(--gold)]">
                  {display.northStar}
                </p>
              ) : null}
              <ul className="mt-3 space-y-2 text-sm text-[var(--text-2)]">
                {display.priorities.map((move) => (
                  <li key={move.title}>
                    <span className="text-[var(--text)]">{move.title}</span>
                    {move.horizon ? ` — ${move.horizon}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          </TierLock>
          <TierLock locked={locked}>
            <section
              id="roadmap"
              className="scroll-mt-24 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-2)] p-6"
            >
              <h2 className="text-lg font-medium text-[var(--text)]">
                Roadmap
              </h2>
              <div className="mt-3 grid gap-3 text-sm text-[var(--text-2)] sm:grid-cols-3">
                <p>0-30 days: validate message and proof points.</p>
                <p>31-90 days: launch content sprint and creator coalition.</p>
                <p>91-180 days: convert winning campaigns into operating system.</p>
              </div>
            </section>
          </TierLock>
        </div>
      </div>
    </div>
  );
}
