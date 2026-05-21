import Link from "next/link";

type RunRow = {
  id: string;
  status: string;
  created_at: string;
  agent_status: string | null;
};

export function RunsHub({
  title,
  description,
  runs,
  linkPrefix,
}: {
  title: string;
  description: string;
  runs: RunRow[];
  linkPrefix: "dashboard" | "plan" | "library";
}) {
  const href = (id: string) => `/${linkPrefix}/${id}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      <p className="text-sm text-[var(--text-3)]">{title}</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-[var(--text)]">
        Your runs
      </h1>
      <p className="mt-3 text-[var(--text-2)]">{description}</p>

      {runs.length === 0 ? (
        <div className="mt-10 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-sm text-[var(--text-2)]">
            No runs yet. Start an intake from the home page after signing in.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex text-sm text-[var(--gold)] underline-offset-4 hover:underline"
          >
            Start intake
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-3">
          {runs.map((run) => (
            <li key={run.id}>
              <Link
                href={href(run.id)}
                className="flex flex-col gap-1 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-[var(--border-2)]"
              >
                <span className="text-sm font-medium text-[var(--text)]">
                  {run.status === "complete"
                    ? "Complete"
                    : run.status === "failed"
                      ? "Failed"
                      : run.status === "running"
                        ? "Running"
                        : "Queued"}
                </span>
                <span className="text-xs text-[var(--text-3)]">
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
