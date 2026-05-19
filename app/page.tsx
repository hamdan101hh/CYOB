import Link from "next/link";

import { IntakeCta } from "@/components/home/intake-cta";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_-10%,rgba(212,184,150,0.12),transparent_55%),radial-gradient(700px_circle_at_90%_10%,rgba(108,180,245,0.08),transparent_50%)]"
      />
      <section className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 pb-24 pt-20 md:px-10 md:pb-32 md:pt-28">
        <p className="text-sm tracking-wide text-[var(--text-3)]">
          cyob.site
        </p>
        <h1 className="max-w-3xl text-balance text-4xl leading-[1.08] text-[var(--text)] md:text-6xl">
          A private AI war room for industry intelligence and company
          strategy.
        </h1>
        <p className="max-w-2xl text-pretty text-lg text-[var(--text-2)] md:text-xl">
          Ten specialist agents. One war room. Use{" "}
          <span className="text-[var(--text)]">Skip login (local demo)</span> on
          the email step to run the full flow without Supabase.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <IntakeCta />
          <Link
            href="/pricing"
            className="inline-flex h-12 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-medium text-[var(--text-2)] transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-[var(--border-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          >
            View pricing
          </Link>
        </div>
        <div className="mt-6 grid gap-4 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
              Stack
            </p>
            <p className="text-sm text-[var(--text-2)]">
              Next.js 15 · React 19 · TypeScript strict
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
              Styling
            </p>
            <p className="text-sm text-[var(--text-2)]">
              Tailwind 4 · cinematic tokens in globals
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
              Env
            </p>
            <p className="text-sm text-[var(--text-2)]">
              @t3-oss/env-nextjs with fail-fast defaults for prod
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
