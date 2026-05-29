"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const showDetail = process.env.NODE_ENV === "development";

  return (
    <div className="page-wrap-narrow">
      <p className="eyebrow">Error</p>
      <h1 className="page-title">Something went wrong</h1>
      <p className="page-lead">
        An unexpected error occurred. You can try again or return home.
      </p>
      {showDetail && error?.message ? (
        <pre className="mt-4 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-2)] p-4 text-left text-xs text-[var(--text-3)] whitespace-pre-wrap">
          {error.message}
        </pre>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={() => reset()} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
    </div>
  );
}
