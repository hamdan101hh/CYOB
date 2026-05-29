import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value?: string | number;
  sub?: string;
  children?: ReactNode;
  className?: string;
  glow?: "accent" | "purple" | "green" | "none";
};

export function MetricCard({
  label,
  value,
  sub,
  children,
  className = "",
  glow = "none",
}: MetricCardProps) {
  const glowClass =
    glow === "accent"
      ? "shadow-[0_0_40px_-16px_var(--accent-glow)]"
      : glow === "purple"
        ? "shadow-[0_0_40px_-16px_rgba(167,139,250,0.35)]"
        : glow === "green"
          ? "shadow-[0_0_40px_-16px_rgba(94,233,181,0.25)]"
          : "";

  return (
    <div
      className={`glass-card rounded-[var(--radius-lg)] p-4 md:p-5 ${glowClass} ${className}`}
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-4)]">
        {label}
      </p>
      {value !== undefined ? (
        <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-[var(--text)]">
          {value}
        </p>
      ) : null}
      {sub ? <p className="mt-1 text-xs text-[var(--text-3)]">{sub}</p> : null}
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
