"use client";

import { AgentPipelineVisual } from "@/components/run/agent-pipeline-visual";
import { LiveBadge } from "@/components/ui/live-badge";

export function AgentPipeline() {
  return (
    <section className="cyob-reveal">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="eyebrow">Agent pipeline</p>
          <h2 className="page-title mt-2">Ten specialized agents · one flow</h2>
          <p className="mt-2 text-sm text-[var(--text-3)]">
            From market history to final document — each agent adds a visual layer to your
            war room.
          </p>
        </div>
        <LiveBadge state="synced" />
      </div>

      <div className="stealth-card relative mt-8 overflow-hidden p-5 md:p-8">
        <div
          className="pointer-events-none absolute top-[42%] right-[6%] left-[6%] hidden h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--accent)_40%,transparent)] to-transparent md:block"
          aria-hidden
        />
        <AgentPipelineVisual
          currentAgent={7}
          status="running"
          premium
          interactive
        />
      </div>
    </section>
  );
}
