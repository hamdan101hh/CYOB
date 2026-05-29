type LiveState = "synced" | "updating" | "detected" | "changed" | "added";

const LABELS: Record<LiveState, string> = {
  synced: "Synced now",
  updating: "Updating",
  detected: "Trend detected",
  changed: "Signal changed",
  added: "New visual added",
};

export function LiveBadge({
  state = "synced",
  className = "",
}: {
  state?: LiveState;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-3)] ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          state === "updating" || state === "detected"
            ? "cyob-pulse-dot bg-[var(--accent-bright)]"
            : state === "synced"
              ? "bg-[var(--accent)]"
              : "bg-[var(--live)]"
        }`}
      />
      {LABELS[state]}
    </span>
  );
}
