import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const nav = [
  { href: "/", label: "Start" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plan", label: "Plan" },
  { href: "/library", label: "Library" },
  { href: "/pricing", label: "Pricing" },
] as const;

export async function SiteHeader() {
  const supabase = await createSupabaseServerClient();
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_82%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:h-16 md:flex-nowrap md:gap-6 md:px-10 md:py-0">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-medium tracking-tight text-[var(--text)] transition-colors duration-150 ease-[var(--ease-out-expo)] hover:text-[var(--text)]"
          aria-label="cyob home"
        >
          <span className="rounded-[var(--radius-sm)] border border-[var(--border-2)] bg-[var(--surface-2)] px-2 py-1 text-xs uppercase text-[var(--text-3)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:-translate-y-px">
            cyob
          </span>
          <span className="hidden text-[var(--text-2)] sm:inline">
            strategic intelligence
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="order-3 flex w-full items-center gap-1 overflow-x-auto pb-1 md:order-none md:w-auto md:overflow-visible md:pb-0"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-2)] transition-colors duration-150 ease-[var(--ease-out-expo)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden max-w-[12rem] truncate text-xs text-[var(--text-3)] sm:inline">
                {user.email}
              </span>
              <form action="/api/auth/logout" method="post">
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--text-2)] transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-px hover:border-[var(--border-2)] hover:text-[var(--text)]"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--text)] transition-transform duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-px hover:border-[var(--border-2)] hover:bg-[var(--surface-2)]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
