import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/dashboard", "/plan", "/library", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PROTECTED_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    )
  ) {
    const hasAuthCookie = request.cookies
      .getAll()
      .some((c) => c.name.startsWith("sb-") && c.name.includes("auth"));
    if (!hasAuthCookie && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
