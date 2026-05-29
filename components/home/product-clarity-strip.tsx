import { BarChart3, GitCompare, ImageIcon, Radar } from "lucide-react";

const STEPS = [
  {
    icon: Radar,
    title: "Research trends",
    body: "Live scan of category momentum and content signals.",
  },
  {
    icon: GitCompare,
    title: "Compare companies",
    body: "Side-by-side rivals — spend, POV, positioning.",
  },
  {
    icon: ImageIcon,
    title: "Analyze visuals",
    body: "Campaign frames, social content, brand snapshots.",
  },
  {
    icon: BarChart3,
    title: "Output strategy",
    body: "Charts, compares, and export-ready documents.",
  },
] as const;

export function ProductClarityStrip() {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-2)]">
      <div className="page-wrap max-w-6xl py-10 md:py-12">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-4)]">
          What CYOB does
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--graphite)]">
                  <Icon className="h-4 w-4 text-[var(--accent)]" aria-hidden />
                </div>
                <div>
                  <p className="text-[10px] tabular-nums text-[var(--text-4)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-[var(--text)]">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-3)]">
                    {step.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
