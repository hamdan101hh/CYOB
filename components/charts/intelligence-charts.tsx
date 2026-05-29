/** Minimal premium charts for intelligence dashboard */

export function MiniPieChart({
  slices,
  size = 88,
}: {
  slices: { label: string; value: number; color?: string }[];
  size?: number;
}) {
  const total = slices.reduce((n, s) => n + s.value, 0) || 1;
  let acc = 0;
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;

  const paths = slices.map((slice, i) => {
    const start = (acc / total) * 2 * Math.PI - Math.PI / 2;
    acc += slice.value;
    const end = (acc / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    const fill =
      slice.color ??
      (i === 0
        ? "var(--accent)"
        : i === 1
          ? "var(--accent-2)"
          : "var(--graphite-light)");
    return { d, fill, label: slice.label };
  });

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} aria-hidden>
        {paths.map((p, i) => (
          <path key={p.label} d={p.d} fill={p.fill} opacity={0.9 - i * 0.05} />
        ))}
        <circle cx={cx} cy={cy} r={r * 0.52} fill="var(--bg-2)" />
      </svg>
      <ul className="space-y-1">
        {slices.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2 text-[10px]">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background:
                  s.color ??
                  (i === 0 ? "var(--accent)" : i === 1 ? "var(--accent-2)" : "var(--text-4)"),
              }}
            />
            <span className="text-[var(--text-3)]">{s.label}</span>
            <span className="tabular-nums text-[var(--text-4)]">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Cleaner chart with legend — easier to read than dual overlapping lines alone */
export function SimpleTrendChart({
  series,
  leftLabel,
  rightLabel,
  leftColor,
  rightColor,
}: {
  series: { label: string; left: number; right: number }[];
  leftLabel: string;
  rightLabel: string;
  leftColor: string;
  rightColor: string;
}) {
  const max = Math.max(...series.flatMap((s) => [s.left, s.right]), 1);
  return (
    <div>
      <div className="flex h-24 items-end gap-2">
        {series.map((s) => (
          <div key={s.label} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex w-full items-end justify-center gap-0.5" style={{ height: 72 }}>
              <div
                className="w-[42%] rounded-t-sm"
                style={{
                  height: `${(s.left / max) * 100}%`,
                  background: leftColor,
                  minHeight: 4,
                }}
                title={`${leftLabel}: ${s.left}`}
              />
              <div
                className="w-[42%] rounded-t-sm opacity-75"
                style={{
                  height: `${(s.right / max) * 100}%`,
                  background: rightColor,
                  minHeight: 4,
                }}
                title={`${rightLabel}: ${s.right}`}
              />
            </div>
            <span className="text-[9px] text-[var(--text-4)]">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-4 text-[10px]">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm" style={{ background: leftColor }} />
          {leftLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm opacity-75" style={{ background: rightColor }} />
          {rightLabel}
        </span>
      </div>
    </div>
  );
}

export function DualLineChart({
  series,
  leftColor,
  rightColor,
  leftLabel,
  rightLabel,
}: {
  series: { label: string; left: number; right: number }[];
  leftColor: string;
  rightColor: string;
  leftLabel?: string;
  rightLabel?: string;
}) {
  const max = Math.max(...series.flatMap((s) => [s.left, s.right]), 1);

  const toPoints = (key: "left" | "right") =>
    series
      .map((s, i) => {
        const x = (i / Math.max(series.length - 1, 1)) * 100;
        const y = 100 - (s[key] / max) * 75 - 12;
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <div>
      <svg viewBox="0 0 100 44" className="h-20 w-full" aria-hidden>
        <polyline
          fill="none"
          stroke={leftColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          points={toPoints("left")}
          opacity={0.9}
        />
        <polyline
          fill="none"
          stroke={rightColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 2"
          points={toPoints("right")}
          opacity={0.85}
        />
      </svg>
      <div className="flex justify-between text-[9px] text-[var(--text-4)]">
        {series.map((s) => (
          <span key={s.label}>{s.label}</span>
        ))}
      </div>
      {leftLabel && rightLabel ? (
        <div className="mt-2 flex gap-4 text-[10px] text-[var(--text-4)]">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-3 rounded" style={{ background: leftColor }} />
            {leftLabel}
          </span>
          <span className="flex items-center gap-1">
            <span
              className="h-1.5 w-3 rounded border border-dashed opacity-80"
              style={{ borderColor: rightColor }}
            />
            {rightLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export function CompareBars({
  items,
}: {
  items: { label: string; left: number; right: number }[];
}) {
  const max = Math.max(...items.flatMap((i) => [i.left, i.right]), 1);
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label}>
          <p className="mb-1 text-[10px] text-[var(--text-4)]">{item.label}</p>
          <div className="space-y-1">
            <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-3)]">
              <div
                className="h-full rounded-full bg-[var(--accent)]"
                style={{ width: `${(item.left / max) * 100}%` }}
              />
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[var(--bg-3)]">
              <div
                className="h-full rounded-full bg-[var(--accent-2)] opacity-80"
                style={{ width: `${(item.right / max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
