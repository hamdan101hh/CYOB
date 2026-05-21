import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-20 md:px-10">
      <p className="text-sm text-[var(--text-3)]">404</p>
      <h1 className="mt-2 text-2xl font-medium text-[var(--text)]">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-[var(--text-2)]">
        This URL does not exist on cyob.
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
