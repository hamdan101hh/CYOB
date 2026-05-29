import Link from "next/link";

import { LiveBadge } from "@/components/ui/live-badge";
import type { UserRunRow } from "@/lib/data/list-user-runs";

function statusLabel(status: string) {
  if (status === "complete") return "Complete";
  if (status === "failed") return "Failed";
  if (status === "running") return "Running";
  return "Queued";
}

function statusClass(status: string) {
  if (status === "complete") return "text-[var(--live)]";
  if (status === "failed") return "text-[var(--red)]";
  if (status === "running") return "text-[var(--accent-bright)]";
  return "text-[var(--text-3)]";
}

export function RunsHub({
  title,
  description,
  runs,
  linkPrefix,
}: {
  title: string;
  description: string;
  runs: UserRunRow[];
  linkPrefix: "dashboard" | "plan" | "library";
}) {
  const href = (id: string) => `/${linkPrefix}/${id}`;

  return (
    <div className="page-wrap max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">{title}</p>
          <h1 className="page-title mt-1">Your war rooms</h1>
        </div>
        <LiveBadge state="synced" />
      </div>
      <p className="mt-3 max-w-lg text-sm text-[var(--text-3)]">{description}</p>

      {runs.length === 0 ? (
        <div className="stealth-card mt-12 p-8">
          <p className="text-sm text-[var(--text-2)]">
            No runs yet. Start an intake from the home page.
          </p>
          <Link href="/" className="link-accent mt-4 inline-flex text-sm">
            Start intake
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-3">
          {runs.map((run) => (
            <li key={run.id}>
              <Link
                href={href(run.id)}
                className="stealth-card group flex items-center justify-between gap-4 px-5 py-4 transition-transform duration-300 hover:-translate-y-0.5 hover:border-[var(--border-2)]"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--text)]">
                    {run.company ?? "Untitled run"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-4)]">
                    {new Date(run.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-medium uppercase tracking-wide ${statusClass(run.status)}`}
                >
                  {statusLabel(run.status)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
