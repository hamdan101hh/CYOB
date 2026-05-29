import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_GATE_COOKIE = "cyob_admin_gate";

function gateSecret(): string {
  return (
    process.env.ADMIN_GATE_SECRET ??
    process.env.CRON_SECRET ??
    "cyob-dev-gate-change-me"
  );
}

export function getAdminGatePassword(): string {
  const fromEnv = process.env.ADMIN_GATE_PASSWORD?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "development") return "142011";
  return "";
}

export function signAdminGateToken(): string {
  return createHmac("sha256", gateSecret())
    .update("cyob-admin-gate-v1")
    .digest("hex");
}

export function verifyAdminGateToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = signAdminGateToken();
  try {
    const a = Buffer.from(token, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyAdminGatePassword(password: string): boolean {
  const expected = getAdminGatePassword();
  if (!expected) return false;
  try {
    const a = Buffer.from(password, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function isAdminGateOpen(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminGateToken(jar.get(ADMIN_GATE_COOKIE)?.value);
}

export const ADMIN_GATE_MAX_AGE = 60 * 60 * 24 * 7;
