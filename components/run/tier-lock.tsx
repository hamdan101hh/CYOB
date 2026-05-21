import Link from "next/link";
import type { ReactNode } from "react";

export function TierLock({
  locked,
  children,
  preview = false,
}: {
  locked: boolean;
  children: ReactNode;
  /** Show agent 1 content unblurred on free tier */
  preview?: boolean;
}) {
  if (!locked || preview) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
      <div className="pointer-events-none select-none blur-[7px]">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[color-mix(in_oklab,var(--bg)_55%,transparent)] px-4 text-center">
        <p className="text-xs font-medium text-[var(--gold)]">
          Upgrade for full depth
        </p>
        <Link
          href="/pricing"
          className="pointer-events-auto rounded-[var(--radius-md)] border border-[var(--gold)]/50 px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[color-mix(in_oklab,var(--gold)_12%,transparent)]"
        >
          View plans
        </Link>
      </div>
    </div>
  );
}
