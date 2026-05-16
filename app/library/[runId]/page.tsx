import Link from "next/link";
import { notFound } from "next/navigation";

import { TierLock } from "@/components/run/tier-lock";
import { getRunBundle } from "@/lib/data/get-run";

export default async function LibraryRunPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const bundle = await getRunBundle(runId);
  if (!bundle) notFound();

  const locked = bundle.tier === "free";
  const creative = bundle.outputs[7]?.output_text;

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--text-3)]">Creative library</p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight text-[var(--text)]">
            {bundle.intake.company}
          </h1>
        </div>
        <Link
          href={`/dashboard/${runId}`}
          className="text-sm text-[var(--gold)] underline-offset-4 hover:underline"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <TierLock key={i} locked={locked && i > 1}>
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
              <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
                Campaign {i}
              </p>
              <p className="mt-3 text-sm text-[var(--text-2)]">
                {creative ??
                  "DALL-E frames and Seedance previews render here after Agent 07."}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <PreviewTile
                  title="Hero frame"
                  campaign={i}
                  accent="var(--gold)"
                />
                <PreviewTile
                  title="Video preview"
                  campaign={i}
                  accent="var(--blue)"
                />
              </div>
            </div>
          </TierLock>
        ))}
      </div>
    </div>
  );
}

function PreviewTile({
  title,
  campaign,
  accent,
}: {
  title: string;
  campaign: number;
  accent: string;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-3)]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 360 202"
        role="img"
        aria-label={`${title} placeholder for campaign ${campaign}`}
      >
        <defs>
          <radialGradient id={`glow-${campaign}-${title}`} cx="28%" cy="22%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
            <stop offset="60%" stopColor={accent} stopOpacity="0.08" />
            <stop offset="100%" stopColor="#08080c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`line-${campaign}-${title}`} x1="0" x2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <rect width="360" height="202" fill="#0e0e15" />
        <rect width="360" height="202" fill={`url(#glow-${campaign}-${title})`} />
        <path
          d="M24 148 C82 96, 116 182, 178 118 S288 72, 336 116"
          fill="none"
          stroke={`url(#line-${campaign}-${title})`}
          strokeWidth="18"
        />
        <rect
          x="24"
          y="24"
          width="82"
          height="8"
          rx="4"
          fill={accent}
          opacity="0.75"
        />
        <rect x="24" y="42" width="146" height="6" rx="3" fill="#f5f5f7" opacity="0.18" />
        <circle cx="300" cy="54" r="26" fill={accent} opacity="0.16" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3">
        <p className="text-xs font-medium text-[var(--text)]">{title}</p>
        <p className="text-[10px] text-[var(--text-3)]">
          Campaign {campaign} placeholder
        </p>
      </div>
    </div>
  );
}
