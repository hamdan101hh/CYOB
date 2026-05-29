import { ArrowRight, LayoutDashboard, Sparkles } from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Intake",
    body: "Company, market, and goals — one focused flow.",
    icon: Sparkles,
  },
  {
    n: "02",
    title: "Agents analyze",
    body: "Parallel research across trends, rivals, and gaps.",
    icon: ArrowRight,
  },
  {
    n: "03",
    title: "Visual command center",
    body: "Charts, compares, and document previews — not text walls.",
    icon: LayoutDashboard,
  },
] as const;

export function HowItWorks() {
  return (
    <section className="cyob-reveal">
      <p className="eyebrow text-center">How it works</p>
      <h2 className="page-title mt-2 text-center">Three steps to intelligence</h2>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.n} className="stealth-card p-6">
              <span className="text-[10px] font-medium tabular-nums text-[var(--accent-bright)]">
                {step.n}
              </span>
              <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-3)]">
                <Icon className="h-4 w-4 text-[var(--accent)]" aria-hidden />
              </div>
              <h3 className="mt-4 text-base font-semibold text-[var(--text)]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-3)]">{step.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
