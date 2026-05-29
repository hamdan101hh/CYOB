import type { ReactNode } from "react";

import { LiveBadge } from "@/components/ui/live-badge";

type LiveState = "synced" | "updating" | "detected" | "changed" | "added";

export function MiniChartCard({
  title,
  caption,
  liveState,
  children,
  className = "",
}: {
  title: string;
  caption?: string;
  liveState?: LiveState;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`stealth-card group flex h-full flex-col p-4 transition-all duration-300 hover:border-[color-mix(in_oklab,var(--accent)_35%,transparent)] hover:shadow-[0_16px_48px_-24px_var(--accent-glow)] md:p-5 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-[var(--text)]">{title}</h3>
          {caption ? (
            <p className="mt-1 text-[11px] leading-snug text-[var(--text-3)]">{caption}</p>
          ) : null}
        </div>
        {liveState ? <LiveBadge state={liveState} /> : null}
      </div>
      <div className="mt-4 flex flex-1 flex-col justify-end cyob-chart-in">{children}</div>
    </article>
  );
}
