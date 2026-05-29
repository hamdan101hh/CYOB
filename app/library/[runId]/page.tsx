import Link from "next/link";

import { AssetPromptStudio } from "@/components/library/asset-prompt-studio";
import { LibraryCompareRow } from "@/components/run/visual-blocks";
import { listRunAssets } from "@/lib/data/list-run-assets";
import { requireRunBundle } from "@/lib/data/require-run";
import { parseRunDisplay } from "@/lib/data/parse-run-display";
import { isRunContentLocked } from "@/lib/features/content-access";
import { TierLock } from "@/components/run/tier-lock";

export default async function LibraryRunPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const bundle = await requireRunBundle(runId, `/library/${runId}`);
  const assets = await listRunAssets(runId);

  const locked = isRunContentLocked(bundle.tier);
  const display = parseRunDisplay(bundle);
  const campaigns =
    display.campaigns.length > 0
      ? display.campaigns
      : [
          { name: "The Proof Room", big_idea: "Proof-led launch" },
          { name: "Founder Frequency", big_idea: "Weekly POV" },
        ];

  const assetsByCampaign = new Map<number, typeof assets>();
  for (const asset of assets) {
    const idx = asset.campaign_index ?? 0;
    const list = assetsByCampaign.get(idx) ?? [];
    list.push(asset);
    assetsByCampaign.set(idx, list);
  }

  const needsAssets =
    assets.filter((a) => a.public_url && a.asset_type === "image").length <
    Math.min(campaigns.length, 1);

  return (
    <div className="page-wrap space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Creative library</p>
          <h1 className="page-title mt-1">{bundle.intake.company}</h1>
          <p className="mt-1 text-xs text-[var(--text-4)]">
            Visual compare · minimal copy
          </p>
        </div>
        <Link href={`/dashboard/${runId}`} className="link-accent text-sm">
          ← War room
        </Link>
      </div>

      {needsAssets ? (
        <AssetPromptStudio
          runId={runId}
          company={bundle.intake.company}
          industry={bundle.intake.industry}
          vibe={bundle.intake.vibe}
          campaignName={campaigns[0]?.name}
        />
      ) : null}

      <div className="space-y-10">
        {campaigns.map((campaign, i) => {
          const campaignAssets = assetsByCampaign.get(i) ?? [];
          const hero = campaignAssets.find((a) => a.asset_type === "image");
          const alt = campaignAssets.find((a) => a.asset_type === "video");

          return (
            <TierLock key={campaign.name} locked={locked && i > 0} preview={locked && i === 0}>
              <article className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
                <div className="border-b border-[var(--border)] px-5 py-3">
                  <p className="text-[10px] uppercase tracking-wide text-[var(--accent)]">
                    {campaign.type ?? "Campaign"} {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="text-lg font-medium text-[var(--text)]">
                    {campaign.name}
                  </h2>
                </div>

                <div className="p-5">
                  <LibraryCompareRow
                    titleA="Concept A"
                    titleB="Concept B"
                    imageA={hero?.public_url}
                    imageB={alt?.public_url ?? hero?.public_url}
                    slogan={
                      campaign.big_idea?.slice(0, 72) ??
                      "Side-by-side before motion"
                    }
                  />
                </div>
              </article>
            </TierLock>
          );
        })}
      </div>
    </div>
  );
}
