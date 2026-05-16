import { NextResponse, type NextRequest } from "next/server";

/**
 * Keep middleware Edge-safe: importing `@supabase/ssr` here has caused
 * "self is not defined" / broken `.next` caches for some Windows + Next 15 setups.
 * Session refresh still works via `lib/supabase/server.ts` on server routes.
 * Re-enable Supabase in middleware when you want cookie refresh on every navigation
 * (see `lib/supabase/middleware.ts` + Supabase Next.js docs).
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
