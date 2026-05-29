"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { IntakeCta } from "@/components/home/intake-cta";
import {
  createSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/client";

export function HomeHeroActions({ compact }: { compact?: boolean }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    void supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(Boolean(data.user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(Boolean(session?.user));
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center ${compact ? "" : "mt-10"}`}
    >
      <IntakeCta />
      <Link href="/pricing" className="btn btn-secondary h-12 px-6">
        View pricing
      </Link>
      {loggedIn ? (
        <Link href="/dashboard" className="btn btn-secondary h-12 px-6">
          Open dashboard
        </Link>
      ) : isSupabaseBrowserConfigured() ? (
        <Link href="/login" className="btn btn-secondary h-12 px-6">
          Sign in
        </Link>
      ) : null}
    </div>
  );
}
