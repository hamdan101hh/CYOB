import Link from "next/link";

import { logoutAction } from "@/app/actions/logout";
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
  let user: { email?: string } | null = null;
  if (supabase) {
    try {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      user = null;
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_75%,transparent)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex min-h-[4.25rem] max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:flex-nowrap md:gap-6 md:px-10">
        <Link href="/" className="group flex items-center gap-3" aria-label="cyob home">
          <span className="flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-[color-mix(in_oklab,var(--accent)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-xs font-semibold tracking-wider text-[var(--accent)] shadow-[0_0_20px_-6px_var(--accent-glow)] transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:-translate-y-px">
            C
          </span>
          <span className="hidden flex-col sm:flex">
            <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
              cyob
            </span>
            <span className="text-[11px] text-[var(--text-4)]">
              strategic intelligence
            </span>
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="order-3 flex w-full items-center gap-0.5 overflow-x-auto pb-1 md:order-none md:w-auto md:overflow-visible md:pb-0"
        >
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link shrink-0">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden max-w-[12rem] truncate text-xs text-[var(--text-4)] sm:inline">
                {user.email}
              </span>
              <form action={logoutAction}>
                <button type="submit" className="btn btn-secondary h-10 px-4">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary h-10 px-4">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
