"use client";

import { AgentPipelineVisual } from "@/components/run/agent-pipeline-visual";
import { LiveBadge } from "@/components/ui/live-badge";

export function HomeAgentPipeline() {
  return (
    <section className="cyob-reveal">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Agent system</p>
          <h2 className="page-title mt-2">Ten agents · one pipeline</h2>
        </div>
        <LiveBadge state="synced" />
      </div>

      <div className="stealth-card mt-8 p-5 md:p-6">
        <AgentPipelineVisual
          currentAgent={10}
          status="complete"
          interactive
          minimal={false}
        />
      </div>
    </section>
  );
}
