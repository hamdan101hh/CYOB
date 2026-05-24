import { createServerClient } from "@supabase/ssr";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Supabase client for Route Handlers — session cookies must be attached to the
 * outgoing NextResponse (cookies() alone is not reliable for fetch clients).
 */
export async function createSupabaseRouteHandlerClient(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();
  let cookieCarrier = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Partial<ResponseCookie>;
        }[],
      ) {
        cookieCarrier = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieCarrier.cookies.set(name, value, options);
        });
      },
    },
  });

  return { supabase, cookieCarrier };
}

export function jsonWithSupabaseCookies(
  cookieCarrier: NextResponse,
  body: unknown,
  init?: ResponseInit,
) {
  const res = NextResponse.json(body, init);
  cookieCarrier.cookies.getAll().forEach((cookie) => {
    res.cookies.set(cookie);
  });
  return res;
}
