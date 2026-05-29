import { isAdminGateOpen } from "@/lib/auth/admin-gate";

export async function requireAdminGate() {
  const ok = await isAdminGateOpen();
  if (!ok) return { ok: false as const, status: 401 };
  return { ok: true as const, status: 200 };
}
