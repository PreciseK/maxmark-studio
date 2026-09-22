import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("SignOut error:", err);
  }
  const url = new URL("/admin/login", request.url);
  return Response.redirect(url, 303);
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("SignOut error:", err);
  }
  const url = new URL("/admin/login", request.url);
  return Response.redirect(url, 303);
}
