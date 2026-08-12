import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { projects as fallbackProjects } from "@/content/projects";
import { blogPosts as fallbackBlogPosts, type BlogPost } from "@/content/blog";
import { projectDetails } from "@/content/projectDetails";
import type { Project } from "@/types";
import type { BlogPostRow, BookingServiceRow, ProjectRow, SitePageRow, TeamMemberRow } from "@/types/database";

function mapProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    eyebrow: row.eyebrow ?? undefined,
    category: `${row.category.charAt(0).toUpperCase()}${row.category.slice(1)}` as Project["category"],
    client: row.client ?? undefined,
    year: row.year ?? new Date().getFullYear(),
    muxPlaybackId: row.mux_playback_id ?? "PLACEHOLDER_PROJECT",
    aspectRatio: row.aspect_ratio === "21:9" ? "16:9" : row.aspect_ratio,
    gridSize: row.grid_size,
    featured: row.featured,
  };
}

export async function getPublishedProjects(options?: { featuredOnly?: boolean }) {
  if (!isSupabaseConfigured()) {
    return fallbackProjects.filter((project) => !options?.featuredOnly || project.featured);
  }
  const supabase = await createClient();
  let query = supabase.from("projects").select("*").eq("published", true).is("deleted_at", null).order("display_order");
  if (options?.featuredOnly) query = query.eq("featured", true);
  const { data, error } = await query;
  if (error || !data) return fallbackProjects.filter((project) => !options?.featuredOnly || project.featured);
  return (data as ProjectRow[]).map(mapProject);
}

export async function getPublishedProject(slug: string) {
  const projects = await getPublishedProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getProjectPageDetail(slug: string) {
  const fallback = projectDetails[slug] ?? {
    summary: "A Maxmark Studio production built around a clear idea, a strong visual language, and careful craft.",
    challenge: "Translate the brief into a focused story that feels specific to its audience and ambitious in its execution.",
    approach: "A connected process across creative development, production, and finishing kept the original idea intact.",
    services: ["Creative direction", "Production", "Post-production"],
    galleryTimes: [0, 1, 2, 3, 4],
  };
  if (!isSupabaseConfigured()) return { ...fallback, galleryUrls: [] as string[] };
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("slug", slug).eq("published", true).is("deleted_at", null).maybeSingle();
  const row = data as ProjectRow | null;
  if (!row) return { ...fallback, galleryUrls: [] as string[] };
  return {
    summary: row.summary || fallback.summary,
    challenge: row.challenge || fallback.challenge,
    approach: row.approach || fallback.approach,
    services: row.services?.length ? row.services : fallback.services,
    galleryTimes: fallback.galleryTimes,
    galleryUrls: row.gallery_urls ?? [],
  };
}

export type CmsBlogPost = BlogPost & { id?: string; contentHtml?: string; imageUrl?: string };

function mapBlog(row: BlogPostRow): CmsBlogPost {
  const fallbackProject = fallbackProjects.find((item) => item.muxPlaybackId === row.mux_playback_id) ?? fallbackProjects[0];
  return {
    id: row.id, slug: row.slug, title: row.title, category: row.category,
    date: row.published_at ? new Date(row.published_at).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }) : "Draft",
    excerpt: row.excerpt ?? "", project: fallbackProject, heroTime: 1, body: [],
    contentHtml: row.content_html, imageUrl: row.hero_image_url ?? undefined,
  };
}

export async function getPublishedBlogPosts() {
  if (!isSupabaseConfigured()) return fallbackBlogPosts as CmsBlogPost[];
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("published", true).is("deleted_at", null).order("published_at", { ascending: false });
  if (error || !data) return fallbackBlogPosts as CmsBlogPost[];
  return (data as BlogPostRow[]).map(mapBlog);
}

export async function getPublishedBlogPost(slug: string) {
  const posts = await getPublishedBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getSitePage<T extends Record<string, unknown>>(pageKey: string, fallback: T): Promise<T> {
  if (!isSupabaseConfigured()) return fallback;
  const supabase = await createClient();
  const { data } = await supabase.from("site_pages").select("*").eq("page_key", pageKey).maybeSingle();
  const row = data as SitePageRow | null;
  return row ? { ...fallback, ...(row.content_json as T) } : fallback;
}

export async function getTeamMembers() {
  if (!isSupabaseConfigured()) return [] as TeamMemberRow[];
  const supabase = await createClient();
  const { data } = await supabase.from("team_members").select("*").eq("published", true).is("deleted_at", null).order("display_order");
  return (data as TeamMemberRow[] | null) ?? [];
}

export async function getBookingServices() {
  const fallback: BookingServiceRow[] = [
    { id: "recording", name: "Recording", duration_minutes: 120, description: "Vocals, instruments, and music production.", active: true, display_order: 1 },
    { id: "rehearsal", name: "Rehearsal", duration_minutes: 180, description: "Artist, band, and live-set preparation.", active: true, display_order: 2 },
    { id: "podcast", name: "Podcast", duration_minutes: 120, description: "Interviews, conversations, and video podcasts.", active: true, display_order: 3 },
  ];
  if (!isSupabaseConfigured()) return fallback;
  const supabase = await createClient();
  const { data, error } = await supabase.from("booking_services").select("*").eq("active", true).order("display_order");
  return error || !data?.length ? fallback : data as BookingServiceRow[];
}
