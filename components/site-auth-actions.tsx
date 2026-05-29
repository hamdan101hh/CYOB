"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { logoutAction } from "@/app/actions/logout";
import {
  createSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/client";

export function SiteAuthActions() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setReady(true);
      return;
    }

    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!ready && isSupabaseBrowserConfigured()) {
    return (
      <span className="h-10 w-20 animate-pulse rounded-[var(--radius-md)] bg-[var(--surface)]" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1 pl-3 pr-1">
        <span className="hidden max-w-[10rem] truncate text-xs text-[var(--text-3)] sm:inline">
          {user.email}
        </span>
        <form action={logoutAction}>
          <button
            type="submit"
            className="btn btn-secondary h-8 rounded-full px-3 text-xs"
          >
            Log out
          </button>
        </form>
      </div>
    );
  }

  return (
    <Link href="/login" className="btn btn-primary h-10 px-4">
      Login
    </Link>
  );
}
