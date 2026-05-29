import { redirect } from "next/navigation";

import { RunsHub } from "@/components/runs/runs-hub";
import { bootstrapAdminIfListed } from "@/lib/auth/bootstrap-admin";
import { listUserRuns } from "@/lib/data/list-user-runs";

export default async function DashboardPage() {
  const { user, runs } = await listUserRuns();
  if (!user) redirect("/login?next=/dashboard");

  if (user.email) {
    await bootstrapAdminIfListed(user.id, user.email);
  }

  return (
    <RunsHub
      title="Dashboard"
      description="Open a run for live trends, comparisons, and visual intelligence."
      runs={runs}
      linkPrefix="dashboard"
    />
  );
}
