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
    summary: "A Maxmark Animations production built around a clear idea, a strong visual language, and careful craft.",
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
    {
      id: "animated-film",
      name: "Animated Short Film / Narrative",
      duration_minutes: 60,
      description: "Original narrative animated films, festival shorts, and script-to-screen production.",
      active: true,
      display_order: 1,
    },
    {
      id: "commercial-spot",
      name: "3D & AI Commercial Spot",
      duration_minutes: 45,
      description: "High-impact visual campaigns, broadcast commercials, and 3D product animation.",
      active: true,
      display_order: 2,
    },
    {
      id: "animated-music-video",
      name: "Animated Music Video",
      duration_minutes: 60,
      description: "Full-length animated music videos, cinematic visualizers, and artist worldbuilding.",
      active: true,
      display_order: 3,
    },
    {
      id: "directorial-consultation",
      name: "Directorial Consultation & Pipeline",
      duration_minutes: 30,
      description: "Creative treatment review, visual lore bibles, and custom diffusion pipeline architecture.",
      active: true,
      display_order: 4,
    },
  ];
  if (!isSupabaseConfigured()) return fallback;
  const supabase = await createClient();
  const { data, error } = await supabase.from("booking_services").select("*").eq("active", true).order("display_order");
  return error || !data?.length ? fallback : (data as BookingServiceRow[]);
}
