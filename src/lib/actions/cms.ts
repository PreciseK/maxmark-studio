"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type ActionResult = { ok: boolean; message: string };

function unavailable(): ActionResult {
  return { ok: false, message: "Connect Supabase and run the CMS migrations before saving content." };
}

function cleanHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/javascript:/gi, "");
}

const blogSchema = z.object({
  title: z.string().min(1), slug: z.string().regex(/^[a-z0-9-]+$/), category: z.string().min(1),
  excerpt: z.string().max(500), content_html: z.string(), hero_image_url: z.string().optional(),
  mux_playback_id: z.string().optional(), featured: z.boolean(), published: z.boolean(),
});

export async function saveBlogPost(id: string | null, input: z.infer<typeof blogSchema>): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return unavailable();
  const parsed = blogSchema.parse(input);
  const supabase = await createClient();
  const payload = { ...parsed, content_html: cleanHtml(parsed.content_html), hero_image_url: parsed.hero_image_url || null, mux_playback_id: parsed.mux_playback_id || null, published_at: parsed.published ? new Date().toISOString() : null, updated_at: new Date().toISOString() };
  const result = id ? await supabase.from("blog_posts").update(payload as never).eq("id", id) : await supabase.from("blog_posts").insert(payload as never);
  if (result.error) return { ok: false, message: result.error.message };
  revalidatePath("/blog"); revalidatePath("/admin/blog");
  return { ok: true, message: id ? "Article updated." : "Article created." };
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return unavailable();
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").update({ deleted_at: new Date().toISOString(), published: false } as never).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/blog"); revalidatePath("/admin/blog");
  return { ok: true, message: "Article archived." };
}

export async function saveSitePage(pageKey: "about" | "studio", title: string, content: Record<string, string>): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return unavailable();
  const supabase = await createClient();
  const safeContent = Object.fromEntries(Object.entries(content).map(([key, value]) => [key, key.toLowerCase().includes("html") ? cleanHtml(value) : value]));
  const { error } = await supabase.from("site_pages").upsert({ page_key: pageKey, title, content_json: safeContent, updated_at: new Date().toISOString() } as never, { onConflict: "page_key" });
  if (error) return { ok: false, message: error.message };
  revalidatePath(`/${pageKey}`); revalidatePath(`/admin/${pageKey}`);
  return { ok: true, message: `${title} page updated.` };
}

const teamSchema = z.object({ name: z.string().min(1), role: z.string().min(1), bio_html: z.string(), image_url: z.string().optional(), display_order: z.coerce.number().int(), published: z.boolean() });
export async function saveTeamMember(id: string | null, input: z.infer<typeof teamSchema>): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return unavailable();
  const parsed = teamSchema.parse(input); const supabase = await createClient();
  const payload = { ...parsed, bio_html: cleanHtml(parsed.bio_html), image_url: parsed.image_url || null, updated_at: new Date().toISOString(), deleted_at: null };
  const result = id ? await supabase.from("team_members").update(payload as never).eq("id", id) : await supabase.from("team_members").insert(payload as never);
  if (result.error) return { ok: false, message: result.error.message };
  revalidatePath("/about"); revalidatePath("/admin/team");
  return { ok: true, message: id ? "Team member updated." : "Team member added." };
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return unavailable();
  const supabase = await createClient();
  const { error } = await supabase.from("team_members").update({ deleted_at: new Date().toISOString(), published: false } as never).eq("id", id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/about"); revalidatePath("/admin/team");
  return { ok: true, message: "Team member removed." };
}

export async function subscribe(email: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return unavailable();
  const parsed = z.string().email().parse(email); const supabase = createAdminClient();
  const { error } = await supabase.from("subscribers").upsert({ email: parsed.toLowerCase(), status: "active", source: "website", subscribed_at: new Date().toISOString(), unsubscribed_at: null } as never, { onConflict: "email" });
  return error ? { ok: false, message: error.message } : { ok: true, message: "You’re in. Watch this space." };
}

const contactSchema = z.object({ name: z.string().min(1), email: z.string().email(), company: z.string().optional(), inquiry_type: z.string().min(1), message: z.string().min(10) });
export async function submitContact(input: z.infer<typeof contactSchema>): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return unavailable();
  const parsed = contactSchema.parse(input); const supabase = createAdminClient();
  const { error } = await supabase.from("contact_submissions").insert({ ...parsed, company: parsed.company || null, status: "new" } as never);
  if (!error) revalidatePath("/admin/contact-submissions");
  return error ? { ok: false, message: error.message } : { ok: true, message: "Thanks. Your inquiry is with the studio." };
}

export async function updateContactStatus(id: string, status: "new" | "in_progress" | "closed" | "spam"): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return unavailable();
  const supabase = await createClient(); const { error } = await supabase.from("contact_submissions").update({ status, updated_at: new Date().toISOString() } as never).eq("id", id);
  revalidatePath("/admin/contact-submissions"); return error ? { ok: false, message: error.message } : { ok: true, message: "Status updated." };
}

const bookingSchema = z.object({ service_id: z.string().min(1), service_name: z.string().min(1), booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), start_time: z.string().regex(/^\d{2}:\d{2}$/), duration_minutes: z.coerce.number().int().positive(), name: z.string().min(1), email: z.string().email(), phone: z.string().optional(), company: z.string().optional(), notes: z.string().optional() });
export async function createBooking(input: z.infer<typeof bookingSchema>): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return unavailable();
  const parsed = bookingSchema.parse(input);
  if (new Date(`${parsed.booking_date}T${parsed.start_time}:00`) < new Date()) return { ok: false, message: "Choose a future date and time." };
  const supabase = createAdminClient();
  const { data: conflict } = await supabase.from("bookings").select("id").eq("booking_date", parsed.booking_date).eq("start_time", `${parsed.start_time}:00`).neq("status", "cancelled").maybeSingle();
  if (conflict) return { ok: false, message: "That time was just taken. Please choose another slot." };
  const { error } = await supabase.from("bookings").insert({ ...parsed, phone: parsed.phone || null, company: parsed.company || null, notes: parsed.notes || null, status: "pending" } as never);
  if (!error) revalidatePath("/admin/bookings");
  return error ? { ok: false, message: error.message } : { ok: true, message: "Booking request received. We’ll confirm it by email." };
}

export async function updateBookingStatus(id: string, status: "pending" | "confirmed" | "completed" | "cancelled"): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return unavailable();
  const supabase = await createClient(); const { error } = await supabase.from("bookings").update({ status, updated_at: new Date().toISOString() } as never).eq("id", id);
  revalidatePath("/admin/bookings"); return error ? { ok: false, message: error.message } : { ok: true, message: "Booking updated." };
}

export async function updateSubscriberStatus(id: string, status: "active" | "unsubscribed"): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return unavailable();
  const supabase = await createClient(); const { error } = await supabase.from("subscribers").update({ status, unsubscribed_at: status === "unsubscribed" ? new Date().toISOString() : null } as never).eq("id", id);
  revalidatePath("/admin/subscribers"); return error ? { ok: false, message: error.message } : { ok: true, message: "Subscriber updated." };
}
