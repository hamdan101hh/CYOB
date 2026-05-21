import { redirect } from "next/navigation";

import { AdminPanel } from "@/components/admin/admin-panel";
import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  robots: { index: false, follow: false },
};

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
  if (!user) redirect("/login?next=/admin");

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
          Your account is not marked as admin. Add your email to ADMIN_EMAILS and
          sign in again.
        </p>
      </div>
    );
  }

  const admin = createSupabaseAdminClientOrNull();
  const monthYear = new Date().toISOString().slice(0, 7);
  const { data: cap } = admin
    ? await admin
        .from("monthly_cap")
        .select("month_year,cap_cents,spent_cents")
        .eq("month_year", monthYear)
        .maybeSingle()
    : { data: null };

  const { data: tiers } = admin
    ? await admin.from("service_tiers").select("id,current_tier,monthly_cost_cents")
    : { data: [] };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-14 md:px-10">
      <div>
        <p className="text-sm text-[var(--text-3)]">Admin</p>
        <h1 className="mt-1 text-3xl font-medium text-[var(--text)]">
          Operations
        </h1>
      </div>
      <AdminPanel
        cap={cap as { month_year: string; cap_cents: number; spent_cents: number } | null}
        tiers={(tiers ?? []) as { id: string; current_tier: string; monthly_cost_cents: number }[]}
      />
    </div>
  );
}
