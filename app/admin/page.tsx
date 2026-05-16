import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const sb = await createSupabaseServerClient();
  if (!sb) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
        <h1 className="text-2xl font-medium text-[var(--text)]">Admin</h1>
        <p className="mt-3 text-sm text-[var(--text-2)]">
          Configure Supabase to enable admin checks.
        </p>
      </div>
    );
  }

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await sb
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
        <h1 className="text-2xl font-medium text-[var(--text)]">Admin</h1>
        <p className="mt-3 text-sm text-[var(--text-2)]">
          Your account is not marked as admin. Set is_admin in public.users after
          migration.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-14 md:px-10">
      <div>
        <p className="text-sm text-[var(--text-3)]">Admin</p>
        <h1 className="mt-1 text-3xl font-medium text-[var(--text)]">
          Operations
        </h1>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
            Monthly cap
          </p>
          <p className="mt-3 text-sm text-[var(--text-2)]">
            Default $200. Raise via Stripe admin product when wired.
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--text-4)]">
            Stack control
          </p>
          <p className="mt-3 text-sm text-[var(--text-2)]">
            Service tier upgrades connect after Stripe billing is live.
          </p>
        </div>
      </section>
    </div>
  );
}
