import type { ReactNode } from "react";

export function InsightPreviewCard({
  tag,
  title,
  body,
  children,
}: {
  tag: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <article className="stealth-card flex h-full flex-col p-4 transition-all duration-300 hover:border-[color-mix(in_oklab,var(--accent)_30%,transparent)] md:p-5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--accent-bright)]">
        {tag}
      </p>
      <h3 className="mt-2 text-sm font-semibold text-[var(--text)]">{title}</h3>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-[var(--text-3)]">{body}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}
