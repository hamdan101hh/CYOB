import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminGateScreen } from "@/components/admin/admin-gate-screen";
import { isAdminGateOpen } from "@/lib/auth/admin-gate";
import { createSupabaseAdminClientOrNull } from "@/lib/db/supabase-admin";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const open = await isAdminGateOpen();

  if (!open) {
    return <AdminGateScreen />;
  }

  const admin = createSupabaseAdminClientOrNull();
  const monthYear = new Date().toISOString().slice(0, 7);
  const { data: cap } = admin
    ? await admin
        .from("monthly_cap")
        .select("cap_cents,spent_cents")
        .eq("month_year", monthYear)
        .maybeSingle()
    : { data: null };

  return (
    <AdminDashboard
      cap={cap as { spent_cents: number; cap_cents: number } | null}
    />
  );
}
