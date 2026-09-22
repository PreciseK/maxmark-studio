import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

const FALLBACK_URL = "https://agzsfvmxbvcyhtueyatk.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnenNmdm14YnZjeWh0dWV5YXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NjI1MTMsImV4cCI6MjEwMjAzODUxM30.cFYhecmzhJN6Ny8KwjBXSZZTUiOs5ecrX1gR7yCWYcY";

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          try {
            return cookieStore.getAll();
          } catch {
            return [];
          }
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server component — cookies are read-only here
          }
        },
      },
    },
  );
}
