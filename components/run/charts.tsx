import type { MarketMetricPoint } from "@/lib/market/types";

export function MetricStrip({
  items,
}: {
  items: { label: string; value: string | number; tone?: "accent" | "amber" | "green" }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5"
        >
          <p className="text-[10px] uppercase tracking-wide text-[var(--text-4)]">
            {item.label}
          </p>
          <p
            className={`mt-1 text-lg font-semibold tabular-nums ${
              item.tone === "amber"
                ? "text-[var(--amber)]"
                : item.tone === "green"
                  ? "text-[var(--green)]"
                  : "text-[var(--accent)]"
            }`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function SparkBars({
  series,
  className,
}: {
  series: MarketMetricPoint[];
  className?: string;
}) {
  const max = Math.max(...series.map((s) => s.value), 1);
  return (
    <div className={`flex items-end gap-1 ${className ?? ""}`}>
      {series.map((s) => (
        <div key={s.label} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full min-w-[6px] rounded-t-sm bg-[var(--accent)]"
            style={{ height: `${Math.max(12, (s.value / max) * 56)}px` }}
            title={`${s.label}: ${s.value}`}
          />
          <span className="text-[9px] text-[var(--text-4)]">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ChannelMixChart({
  channels,
}: {
  channels: { channel: string; heat: number }[];
}) {
  const max = Math.max(...channels.map((c) => c.heat), 1);
  return (
    <div className="space-y-2">
      {channels.map((c) => (
        <div key={c.channel}>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--text-2)]">{c.channel}</span>
            <span className="tabular-nums text-[var(--amber)]">{c.heat}</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--bg-3)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
              style={{ width: `${(c.heat / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SeverityChart({ gaps }: { gaps: { name: string; severity: string }[] }) {
  const weight = (s: string) =>
    s === "high" ? 3 : s === "medium" ? 2 : 1;
  const total = gaps.reduce((n, g) => n + weight(g.severity), 0) || 1;
  return (
    <div className="flex h-3 overflow-hidden rounded-full border border-[var(--border)]">
      {gaps.map((g) => (
        <div
          key={g.name}
          className={
            g.severity === "high"
              ? "bg-[var(--red)]"
              : g.severity === "medium"
                ? "bg-[var(--amber)]"
                : "bg-[var(--accent)]"
          }
          style={{ width: `${(weight(g.severity) / total) * 100}%` }}
          title={g.name}
        />
      ))}
    </div>
  );
}
