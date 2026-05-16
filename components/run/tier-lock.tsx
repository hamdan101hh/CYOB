import type { ReactNode } from "react";

export function TierLock({
  locked,
  children,
}: {
  locked: boolean;
  children: ReactNode;
}) {
  if (!locked) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
      <div className="pointer-events-none select-none blur-[7px]">{children}</div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color-mix(in_oklab,var(--bg)_55%,transparent)] px-4 text-center">
        <p className="text-xs font-medium text-[var(--gold)]">
          Upgrade for full depth
        </p>
      </div>
    </div>
  );
}
