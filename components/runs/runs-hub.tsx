import Link from "next/link";

import type { UserRunRow } from "@/lib/data/list-user-runs";

function statusLabel(status: string) {
  if (status === "complete") return "Complete";
  if (status === "failed") return "Failed";
  if (status === "running") return "Running";
  return "Queued";
}

function statusClass(status: string) {
  if (status === "complete") return "text-[var(--green)]";
  if (status === "failed") return "text-[var(--red)]";
  if (status === "running") return "text-[var(--accent)]";
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
    <div className="page-wrap max-w-3xl">
      <p className="eyebrow">{title}</p>
      <h1 className="page-title">Your runs</h1>
      <p className="page-lead">{description}</p>

      {runs.length === 0 ? (
        <div className="card card-pad mt-10">
          <p className="text-sm text-[var(--text-2)]">
            No runs yet. Start an intake from the home page after signing in.
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
                className="card flex flex-col gap-1 px-5 py-4 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-[var(--border-2)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-[var(--text)]">
                    {run.company ?? "Untitled run"}
                  </span>
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${statusClass(run.status)}`}
                  >
                    {statusLabel(run.status)}
                  </span>
                </div>
                <span className="text-xs text-[var(--text-4)]">
                  {new Date(run.created_at).toLocaleString()}
                  {run.agent_status ? ` · ${run.agent_status}` : ""}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
