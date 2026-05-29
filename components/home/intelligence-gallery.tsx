import {
  BarChart3,
  BookOpen,
  FileText,
  GitCompare,
  Radar,
  Search,
} from "lucide-react";

import { VisualThumbnail } from "@/components/home/visual-thumbnail";
import { LiveBadge } from "@/components/ui/live-badge";

const AGENT_VISUALS = [
  {
    agent: "01 · History",
    title: "Market timeline",
    subtitle: "Brand evolution · category shifts",
    icon: BookOpen,
    gradient: "bg-gradient-to-br from-[#141820] via-[#1e2a3d] to-[#0a0c10]",
  },
  {
    agent: "02 · Trends",
    title: "Trend signal",
    subtitle: "Social & content heat map",
    icon: Radar,
    gradient: "bg-gradient-to-br from-[#1a1040] via-[#0d2847] to-[#0a0c10]",
  },
  {
    agent: "04 · Scout",
    title: "Competitor lens",
    subtitle: "Side-by-side brand snapshots",
    icon: GitCompare,
    gradient: "bg-gradient-to-br from-[#2a1810] via-[#0d2847] to-[#050608]",
  },
  {
    agent: "03 · Research",
    title: "Company depth",
    subtitle: "Positioning · audience · motion",
    icon: Search,
    gradient: "bg-gradient-to-br from-[#0d2847] via-[#12101a] to-[#0a0c10]",
  },
  {
    agent: "05 · Gaps",
    title: "Gap severity",
    subtitle: "Where rivals outpace you",
    icon: BarChart3,
    gradient: "bg-gradient-to-br from-[#1a0a14] via-[#141820] to-[#0a0c10]",
  },
  {
    agent: "10 · Document",
    title: "Strategy output",
    subtitle: "Polished brief · export ready",
    icon: FileText,
    gradient: "bg-gradient-to-br from-[#12101a] via-[#0d1f3a] to-[#050608]",
  },
] as const;

export function IntelligenceGallery() {
  return (
    <section className="cyob-reveal">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Visual intelligence</p>
          <h2 className="page-title mt-2">Image-first agent outputs</h2>
          <p className="mt-2 max-w-xl text-sm text-[var(--text-3)]">
            Each agent surfaces thumbnails, charts, and previews — not paragraphs of text.
          </p>
        </div>
        <LiveBadge state="synced" />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AGENT_VISUALS.map((v) => (
          <article key={v.agent} className="stealth-card group p-4 transition-transform duration-300 hover:-translate-y-0.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--accent)]">
              {v.agent}
            </p>
            <div className="mt-3">
              <VisualThumbnail
                title={v.title}
                subtitle={v.subtitle}
                gradient={v.gradient}
                icon={v.icon}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
