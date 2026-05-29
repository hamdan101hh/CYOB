import {
  BarChart3,
  BookOpen,
  FileText,
  GitCompare,
  Lightbulb,
  Megaphone,
  Radar,
  Search,
  Sparkles,
  Telescope,
} from "lucide-react";

import { listAgentTiles } from "@/lib/orchestrator/agent-metadata";

const ICONS = [
  BookOpen,
  Radar,
  Search,
  GitCompare,
  BarChart3,
  Lightbulb,
  Megaphone,
  Telescope,
  Sparkles,
  FileText,
] as const;

type AgentPipelineVisualProps = {
  currentAgent: number;
  status: string;
  compact?: boolean;
  /** Landing page: hover glow, lift, role labels */
  interactive?: boolean;
  /** Stealth UI: smaller, quieter cards */
  minimal?: boolean;
  /** Homepage: graphite cards, blue accents, status labels */
  premium?: boolean;
};

const ROLE_LABELS = [
  "History",
  "Trends",
  "Research",
  "Scout",
  "Gaps",
  "Strategy",
  "Content",
  "Future",
  "Synthesis",
  "Document",
] as const;

export function AgentPipelineVisual({
  currentAgent,
  status,
  compact,
  interactive,
  minimal,
  premium,
}: AgentPipelineVisualProps) {
  const tiles = listAgentTiles(currentAgent, status);

  const statusLabel = (state: "done" | "active" | "idle") => {
    if (premium) {
      if (state === "active") return "scanning";
      if (state === "done") return "ready";
      return "idle";
    }
    return null;
  };

  return (
    <div
      className={
        premium
          ? "grid gap-2 sm:grid-cols-5 lg:grid-cols-10"
          : minimal
            ? "grid gap-1.5 grid-cols-5"
            : compact
              ? "grid gap-2 sm:grid-cols-5"
              : "grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
      }
    >
      {tiles.map((t) => {
        const Icon = ICONS[t.number - 1] ?? Sparkles;
        const role = ROLE_LABELS[t.number - 1] ?? "Agent";
        return (
          <div
            key={t.number}
            className={`relative overflow-hidden rounded-[var(--radius-md)] border transition-all duration-300 ${
              premium ? "px-2 py-2.5" : minimal ? "px-1.5 py-2" : "px-3 py-3"
            } ${
              interactive || premium
                ? "hover:-translate-y-px hover:border-[color-mix(in_oklab,var(--accent)_35%,transparent)] hover:shadow-[0_12px_32px_-20px_var(--accent-glow)]"
                : ""
            } ${
              premium
                ? t.state === "active"
                  ? "border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[var(--graphite)] shadow-[0_0_20px_-12px_var(--accent-glow)]"
                  : t.state === "done"
                    ? "border-[var(--border)] bg-[var(--graphite)]"
                    : "border-[var(--border)] bg-[color-mix(in_oklab,var(--bg-3)_90%,transparent)]"
                : t.state === "done"
                  ? minimal
                    ? "border-[var(--border)] bg-[var(--bg-3)]"
                    : "border-[color-mix(in_oklab,var(--green)_35%,transparent)] bg-[color-mix(in_oklab,var(--green)_8%,transparent)]"
                  : t.state === "active"
                    ? "border-[color-mix(in_oklab,var(--accent)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] shadow-[0_0_16px_-10px_var(--accent-glow)]"
                    : interactive
                      ? "border-[var(--border)] bg-[var(--bg-3)] hover:border-[color-mix(in_oklab,var(--accent)_28%,transparent)]"
                      : "border-[var(--border)] bg-[var(--bg-3)]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              {t.state === "active" ? (
                <span className="cyob-pulse-dot absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[var(--accent-bright)]" />
              ) : t.state === "done" ? (
                <span
                  className={`absolute top-2 right-2 h-1.5 w-1.5 rounded-full ${
                    premium ? "bg-[var(--accent)]" : "bg-[var(--live)]"
                  }`}
                />
              ) : premium ? (
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[var(--text-4)] opacity-50" />
              ) : null}
              <Icon
                className={`${premium || minimal ? "h-3 w-3" : "h-4 w-4"} shrink-0 ${
                  t.state === "active"
                    ? "text-[var(--accent-bright)]"
                    : t.state === "done"
                      ? premium
                        ? "text-[var(--accent)]"
                        : "text-[var(--live)]"
                      : "text-[var(--text-4)]"
                }`}
                aria-hidden
              />
              <span className="text-[9px] tabular-nums text-[var(--text-4)]">
                {String(t.number).padStart(2, "0")}
              </span>
            </div>
            {premium ? (
              <p className="mt-1.5 text-[9px] uppercase tracking-wide text-[var(--text-4)]">
                {statusLabel(t.state)}
              </p>
            ) : interactive && !compact ? (
              <p className="mt-1 text-[9px] uppercase tracking-wide text-[var(--text-4)]">
                {role}
              </p>
            ) : null}
            <p
              className={`${premium ? "mt-0.5 truncate" : interactive && !compact ? "mt-0.5" : "mt-2"} leading-snug ${
                premium ? "text-[10px]" : compact ? "text-[10px]" : "text-xs"
              } font-medium ${
                t.state === "idle" ? "text-[var(--text-3)]" : "text-[var(--text)]"
              }`}
            >
              {premium ? role : compact ? role : t.label}
            </p>
            {t.state === "active" ? (
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--bg-3)]">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-[var(--accent)]" />
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
