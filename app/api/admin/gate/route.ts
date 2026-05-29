import { NextResponse } from "next/server";

import {
  ADMIN_GATE_COOKIE,
  ADMIN_GATE_MAX_AGE,
  signAdminGateToken,
  verifyAdminGatePassword,
} from "@/lib/auth/admin-gate";

export async function GET() {
  const { isAdminGateOpen } = await import("@/lib/auth/admin-gate");
  const open = await isAdminGateOpen();
  return NextResponse.json({ ok: open });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  const password = body.password ?? "";

  if (!verifyAdminGatePassword(password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_GATE_COOKIE, signAdminGateToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_GATE_MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_GATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
