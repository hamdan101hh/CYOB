import Link from "next/link";

import { LiveIntelligenceDashboard } from "@/components/dashboard/live-intelligence-dashboard";
import { RefreshTrendsButton } from "@/components/dashboard/refresh-trends-button";
import { LiveBadge } from "@/components/ui/live-badge";
import { requireRunBundle } from "@/lib/data/require-run";
import { parseRunDisplay } from "@/lib/data/parse-run-display";
import { isRunContentLocked } from "@/lib/features/content-access";
import { listRunAssets } from "@/lib/data/list-run-assets";

export default async function DashboardRunPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const bundle = await requireRunBundle(runId, `/dashboard/${runId}`);
  const assets = await listRunAssets(runId);

  const locked = isRunContentLocked(bundle.tier);
  const display = parseRunDisplay(bundle);
  const heroAsset = assets.find((a) => a.asset_type === "image");

  return (
    <div className="page-wrap max-w-6xl space-y-8">
      <header className="flex flex-col gap-4 border-b border-[var(--border)] pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">Live intelligence</p>
            <LiveBadge state={bundle.status === "running" ? "updating" : "synced"} />
          </div>
          <h1 className="page-title mt-2 md:text-4xl">{bundle.intake.company}</h1>
          <p className="mt-2 text-sm text-[var(--text-3)]">
            {bundle.intake.industry}
            {bundle.intake.city ? ` · ${bundle.intake.city}` : ""}
            {bundle.intake.geography ? ` · ${bundle.intake.geography}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <RefreshTrendsButton runId={runId} />
          <Link href={`/plan/${runId}`} className="btn btn-primary h-10 px-4">
            Plan
          </Link>
          <Link href={`/library/${runId}`} className="btn btn-secondary h-10 px-4">
            Library
          </Link>
        </div>
      </header>

      <LiveIntelligenceDashboard
        company={bundle.intake.company}
        trends={display.trends}
        competitors={display.competitors}
        heroImageUrl={heroAsset?.public_url}
        currentAgent={bundle.current_agent}
        status={bundle.status}
        runId={runId}
        insights={display.insights}
      />

      {!locked ? (
        <p className="text-center text-xs text-[var(--text-4)]">
          Full memos in{" "}
          <Link href={`/plan/${runId}`} className="link-accent">
            Plan
          </Link>
          {" · "}Frames in{" "}
          <Link href={`/library/${runId}`} className="link-accent">
            Library
          </Link>
        </p>
      ) : null}
    </div>
  );
}
