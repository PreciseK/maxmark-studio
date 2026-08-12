import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    if (request.nextUrl.pathname.startsWith("/admin") && !["/admin/login", "/admin/setup"].includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/admin/setup", request.url));
    }
    return NextResponse.next({ request });
  }
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    request.nextUrl.pathname.startsWith("/admin") &&
    !["/admin/login", "/admin/setup"].includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (user && request.nextUrl.pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/admin/projects", request.url));
  }

  return supabaseResponse;
}
