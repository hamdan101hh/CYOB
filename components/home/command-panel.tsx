"use client";

import { FileText, GitCompare, Radar, Sparkles } from "lucide-react";

import { LiveBadge } from "@/components/ui/live-badge";
import { VisualThumbnail } from "@/components/home/visual-thumbnail";

const MINI_SIGNALS = [
  {
    label: "Trend pulse",
    state: "detected" as const,
    icon: Radar,
    caption: "Arabic-first Reels +14%",
    gradient: "bg-gradient-to-br from-[#0d2847] via-[#1a3a5c] to-[#0a1628]",
  },
  {
    label: "Competitor diff",
    state: "changed" as const,
    icon: GitCompare,
    caption: "talabat vs Deliveroo",
    gradient: "bg-gradient-to-br from-[#2a1810] via-[#0d2847] to-[#0a1628]",
  },
  {
    label: "Document ready",
    state: "added" as const,
    icon: FileText,
    caption: "Strategy brief · PDF",
    gradient: "bg-gradient-to-br from-[#1a1040] via-[#0d2847] to-[#050608]",
  },
];

export function CommandPanel() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        className="pointer-events-none absolute -inset-6 rounded-[var(--radius-xl)] bg-[radial-gradient(ellipse_at_60%_20%,rgba(59,130,246,0.08),transparent_55%)]"
        aria-hidden
      />

      <div className="stealth-card relative overflow-hidden rounded-[var(--radius-xl)] p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-3)]">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-medium tracking-tight text-[var(--text)]">
                Live command panel
              </p>
              <p className="text-[11px] text-[var(--text-4)]">UAE market · syncing</p>
            </div>
          </div>
          <LiveBadge state="synced" />
        </div>

        <div className="mt-5">
          <VisualThumbnail
            title="Market intelligence stream"
            subtitle="Trends · compares · signals"
            gradient="bg-gradient-to-br from-[#0a0c10] via-[#0d1f3a] to-[#12101a]"
            aspect="wide"
          />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {MINI_SIGNALS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="stealth-card overflow-hidden rounded-[var(--radius-md)] p-2"
              >
                <div className={`relative aspect-[4/3] overflow-hidden rounded-sm ${s.gradient}`}>
                  <Icon
                    className="absolute bottom-2 right-2 h-4 w-4 text-white/30"
                    aria-hidden
                  />
                </div>
                <p className="mt-2 truncate text-[10px] font-medium text-[var(--text-2)]">
                  {s.label}
                </p>
                <p className="truncate text-[9px] text-[var(--text-4)]">{s.caption}</p>
                <div className="mt-1.5">
                  <LiveBadge state={s.state} className="scale-90 origin-left" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
