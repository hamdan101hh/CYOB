import Link from "next/link";

export default function LibraryPlaceholderPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      <p className="text-sm text-[var(--text-3)]">Library</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-[var(--text)]">
        Coming in Phase 3
      </h1>
      <p className="mt-3 text-[var(--text-2)]">
        Campaign tiles, DALL-E frames, and Seedance previews land here with
        tier-aware depth.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex text-sm text-[var(--gold)] underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
