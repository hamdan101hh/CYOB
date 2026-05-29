"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const detail =
    process.env.NODE_ENV === "development"
      ? error.message || error.digest
      : null;

  return (
    <div className="page-wrap-narrow">
      <p className="eyebrow">Error</p>
      <h1 className="page-title">Something went wrong</h1>
      <p className="page-lead">
        An unexpected error occurred. You can try again or return home.
      </p>
      {detail ? (
        <p className="mt-4 font-mono text-sm text-[var(--red)]">{detail}</p>
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
