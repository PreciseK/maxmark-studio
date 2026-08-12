"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ProjectInsert, ProjectUpdate } from "@/types/database";

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  eyebrow: z.string().optional(),
  category: z.enum(["brand", "narrative", "music"]),
  client: z.string().optional(),
  year: z.coerce.number().int().optional(),
  summary: z.string().optional(),
  challenge: z.string().optional(),
  approach: z.string().optional(),
  services: z.string().optional(),
  gallery_urls: z.array(z.string()).optional(),
  mux_playback_id: z.string().optional(),
  youtube_id: z.string().optional(),
  poster_url: z.string().optional(),
  aspect_ratio: z.enum(["4:3", "16:9", "1:1", "21:9"]),
  grid_size: z.enum(["large", "medium", "small"]),
  featured: z.boolean(),
  display_order: z.coerce.number().int(),
  published: z.boolean(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export async function createProject(formData: ProjectFormData) {
  const supabase = await createClient();
  const data = projectSchema.parse(formData);

  const payload: ProjectInsert = {
    ...data,
    services: data.services?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
    published_at: data.published ? new Date().toISOString() : null,
  };

  // Supabase's generated mutation overload resolves to `never` with this hand-authored schema.
  // Keep the cast at the client boundary while preserving typed payloads throughout the app.
  const { error } = await supabase.from("projects").insert(payload as never);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${data.slug}`);
}

export async function updateProject(id: string, formData: ProjectFormData) {
  const supabase = await createClient();
  const data = projectSchema.parse(formData);

  const payload: ProjectUpdate = {
    ...data,
    services: data.services?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
    published_at: data.published ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("projects")
    .update(payload as never)
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${id}/edit`);
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath(`/work/${data.slug}`);
}

export async function deleteProject(id: string) {
  const supabase = await createClient();

  const payload: ProjectUpdate = { deleted_at: new Date().toISOString() };

  const { error } = await supabase
    .from("projects")
    .update(payload as never)
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/work");
}

export async function toggleProjectPublish(id: string, published: boolean) {
  const supabase = await createClient();

  const payload: ProjectUpdate = {
    published,
    published_at: published ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("projects")
    .update(payload as never)
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/work");
}
