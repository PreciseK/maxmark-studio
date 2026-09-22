import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const FALLBACK_URL = "https://agzsfvmxbvcyhtueyatk.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnenNmdm14YnZjeWh0dWV5YXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NjI1MTMsImV4cCI6MjEwMjAzODUxM30.cFYhecmzhJN6Ny8KwjBXSZZTUiOs5ecrX1gR7yCWYcY";

export async function updateSession(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      if (
        request.nextUrl.pathname.startsWith("/admin") &&
        !["/admin/login", "/admin/setup"].includes(request.nextUrl.pathname)
      ) {
        return NextResponse.redirect(new URL("/admin/setup", request.url));
      }
      return NextResponse.next({ request });
    }

    let supabaseResponse = NextResponse.next({ request });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

    const supabase = createServerClient<Database>(
      url,
      key,
      {
        cookies: {
          getAll() {
            try {
              return request.cookies.getAll();
            } catch {
              return [];
            }
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            try {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
              supabaseResponse = NextResponse.next({ request });
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options),
              );
            } catch {
              // Ignore cookie write failures in middleware
            }
          },
        },
      },
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (
      (!user || error) &&
      request.nextUrl.pathname.startsWith("/admin") &&
      !["/admin/login", "/admin/setup"].includes(request.nextUrl.pathname)
    ) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (user && !error && request.nextUrl.pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin/projects", request.url));
    }

    return supabaseResponse;
  } catch (err) {
    console.error("Middleware updateSession error:", err);
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      !["/admin/login", "/admin/setup"].includes(request.nextUrl.pathname)
    ) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next({ request });
  }
}

