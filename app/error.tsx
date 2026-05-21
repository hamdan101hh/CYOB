"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-6 py-20 md:px-10">
      <h1 className="text-2xl font-medium text-[var(--text)]">
        Something went wrong
      </h1>
      <p className="mt-3 text-sm text-[var(--text-2)]">
        An unexpected error occurred. You can try again or return home.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--gold)]/50 bg-[color-mix(in_oklab,var(--gold)_16%,transparent)] px-5 text-sm font-medium text-[var(--text)]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-5 text-sm text-[var(--text-2)] hover:text-[var(--text)]"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
