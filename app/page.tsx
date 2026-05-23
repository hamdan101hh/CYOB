import Link from "next/link";

import { IntakeCta } from "@/components/home/intake-cta";

const agents = [
  "Industry Historian",
  "Trend Analyst",
  "Company Research",
  "Competitor Scout",
  "Gap Detection",
  "Strategic Planner",
  "Content Creator",
  "Future Engine",
  "Master Synthesis",
  "Document Generator",
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <section className="page-wrap relative max-w-5xl pb-20 pt-16 md:pb-28 md:pt-20">
        <div className="chip chip-live w-fit">Private war room</div>
        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.06] tracking-tight md:text-6xl">
          <span className="gradient-text">Ten agents.</span> One strategy
          command center.
        </h1>
        <p className="page-lead mt-6">
          cyob runs a full intelligence pipeline for your company — market,
          competitors, gaps, plan, creative, and export — in one focused
          workspace.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <IntakeCta />
          <Link href="/pricing" className="btn btn-secondary h-12 px-6">
            View pricing
          </Link>
          <Link href="/login" className="btn btn-secondary h-12 px-6 sm:ml-0">
            Sign in
          </Link>
        </div>

        <div className="mt-16 card card-pad">
          <p className="eyebrow">Agent pipeline</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {agents.map((name, i) => (
              <div
                key={name}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2.5 transition-colors hover:border-[color-mix(in_oklab,var(--accent)_30%,transparent)]"
              >
                <p className="text-[10px] font-medium tabular-nums text-[var(--text-4)]">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 text-xs font-medium leading-snug text-[var(--text-2)]">
                  {name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Intake → run",
              body: "Company, market, and vibe in minutes. Pipeline runs automatically.",
            },
            {
              title: "Dashboard & plan",
              body: "Live agent status, priorities, horizons, and a print-ready strategy PDF.",
            },
            {
              title: "Library",
              body: "Campaign frames and creative previews tied to each run.",
            },
          ].map((item) => (
            <div key={item.title} className="card card-pad">
              <p className="text-sm font-medium text-[var(--text)]">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-3)]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
