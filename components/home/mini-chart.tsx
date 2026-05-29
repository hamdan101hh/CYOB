import type { MarketMetricPoint } from "@/lib/market/types";

export function MiniLineChart({
  series,
  className = "",
}: {
  series: MarketMetricPoint[];
  className?: string;
}) {
  const max = Math.max(...series.map((s) => s.value), 1);
  const gradId = `line-${series.map((s) => s.label).join("-")}`;
  const points = series
    .map((s, i) => {
      const x = (i / Math.max(series.length - 1, 1)) * 100;
      const y = 100 - (s.value / max) * 80 - 10;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={className}>
      <svg viewBox="0 0 100 40" className="h-16 w-full" aria-hidden>
        <defs>
          <linearGradient id={`${gradId}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
          <linearGradient id={`${gradId}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(126,182,255,0.35)" />
            <stop offset="100%" stopColor="rgba(126,182,255,0)" />
          </linearGradient>
        </defs>
        <polygon
          fill={`url(#${gradId}-area)`}
          points={`0,40 ${points} 100,40`}
        />
        <polyline
          fill="none"
          stroke={`url(#${gradId}-stroke)`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
      <div className="mt-1 flex justify-between text-[9px] text-[var(--text-4)]">
        {series.map((s) => (
          <span key={s.label}>{s.label}</span>
        ))}
      </div>
    </div>
  );
}

export function ProgressRing({
  value,
  label,
  size = 72,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const ringId = `ring-${label.replace(/\s+/g, "-")}`;

  return (
    <div className="relative flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--bg-3)"
          strokeWidth="6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${ringId})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700"
        />
        <defs>
          <linearGradient id={ringId}>
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className="pointer-events-none absolute text-sm font-semibold tabular-nums text-[var(--text)]"
        style={{ top: size / 2 - 8, left: "50%", transform: "translateX(-50%)" }}
      >
        {value}
      </span>
      <p className="text-[10px] text-[var(--text-4)]">{label}</p>
    </div>
  );
}

export function MiniHeatmap({
  rows,
}: {
  rows: { label: string; cells: number[] }[];
}) {
  return (
    <div className="space-y-1.5">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-2">
          <span className="w-14 shrink-0 truncate text-[9px] text-[var(--text-4)]">
            {row.label}
          </span>
          <div className="flex flex-1 gap-0.5">
            {row.cells.map((heat, i) => (
              <div
                key={`${row.label}-${i}`}
                className="h-5 flex-1 rounded-sm"
                style={{
                  background: `color-mix(in oklab, var(--accent) ${heat}%, var(--bg-3))`,
                }}
                title={`${heat}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MiniBarCompare({
  items,
}: {
  items: { label: string; value: number; tone?: "accent" | "purple" }[];
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--text-2)]">{item.label}</span>
            <span className="tabular-nums text-[var(--text-3)]">{item.value}%</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--bg-3)]">
            <div
              className={`h-full rounded-full ${
                item.tone === "purple"
                  ? "bg-gradient-to-r from-[var(--accent-2)] to-[var(--purple)]"
                  : "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
              }`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
