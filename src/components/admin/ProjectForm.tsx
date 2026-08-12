"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "@/components/admin/FormField";
import FormActions from "@/components/admin/FormActions";
import ImageUpload from "@/components/admin/ImageUpload";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { createProject, updateProject, deleteProject } from "@/lib/actions/projects";
import type { ProjectRow } from "@/types/database";
import { useRouter } from "next/navigation";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
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

type FormValues = z.infer<typeof schema>;

type Props = {
  initialData?: ProjectRow;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function ProjectForm({ initialData }: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          eyebrow: initialData.eyebrow ?? "",
          category: initialData.category,
          client: initialData.client ?? "",
          year: initialData.year ?? undefined,
          summary: initialData.summary ?? "",
          challenge: initialData.challenge ?? "",
          approach: initialData.approach ?? "",
          services: initialData.services?.join(", ") ?? "",
          gallery_urls: initialData.gallery_urls ?? [],
          mux_playback_id: initialData.mux_playback_id ?? "",
          youtube_id: initialData.youtube_id ?? "",
          poster_url: initialData.poster_url ?? "",
          aspect_ratio: initialData.aspect_ratio,
          grid_size: initialData.grid_size,
          featured: initialData.featured,
          display_order: initialData.display_order,
          published: initialData.published,
        }
      : {
          category: "brand",
          aspect_ratio: "16:9",
          grid_size: "medium",
          featured: false,
          display_order: 0,
          published: false,
          gallery_urls: [],
        },
  });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      if (isEdit && initialData) {
        await updateProject(initialData.id, data);
      } else {
        await createProject(data);
        router.push("/admin/projects");
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDelete = async () => {
    if (!initialData) return;
    setIsDeleting(true);
    try {
      await deleteProject(initialData.id);
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Delete failed");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ── Core ─────────────────────────────────────────── */}
        <SectionHeader>Core</SectionHeader>
        <FieldGrid>
          <FormField label="Title *" error={errors.title?.message}>
            <input
              {...register("title")}
              style={inputStyle}
              onChange={(e) => {
                register("title").onChange(e);
                if (!isEdit) setValue("slug", slugify(e.target.value));
              }}
            />
          </FormField>

          <FormField label="Slug *" error={errors.slug?.message} hint="URL-safe: lowercase letters, numbers, hyphens">
            <input {...register("slug")} style={inputStyle} />
          </FormField>

          <FormField label="Eyebrow" error={errors.eyebrow?.message}>
            <input {...register("eyebrow")} style={inputStyle} placeholder="e.g. Maxmark Studio Originals" />
          </FormField>

          <FormField label="Category *" error={errors.category?.message}>
            <select {...register("category")} style={selectStyle}>
              <option value="brand">Brand</option>
              <option value="narrative">Narrative</option>
              <option value="music">Music</option>
            </select>
          </FormField>

          <FormField label="Client" error={errors.client?.message}>
            <input {...register("client")} style={inputStyle} />
          </FormField>

          <FormField label="Year" error={errors.year?.message}>
            <input {...register("year")} type="number" style={inputStyle} placeholder={String(new Date().getFullYear())} />
          </FormField>
        </FieldGrid>

        {/* ── Summary ──────────────────────────────────────── */}
        <SectionHeader>Summary</SectionHeader>
        <FormField label="Summary" error={errors.summary?.message}>
          <textarea {...register("summary")} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
        </FormField>
        <FieldGrid>
          <FormField label="Challenge" error={errors.challenge?.message}>
            <textarea {...register("challenge")} rows={5} style={{ ...inputStyle, resize: "vertical" }} />
          </FormField>
          <FormField label="Approach" error={errors.approach?.message}>
            <textarea {...register("approach")} rows={5} style={{ ...inputStyle, resize: "vertical" }} />
          </FormField>
        </FieldGrid>
        <FormField label="Services" error={errors.services?.message} hint="Comma-separated, e.g. Direction, Production, VFX">
          <input {...register("services")} style={inputStyle} />
        </FormField>

        {/* ── Media ────────────────────────────────────────── */}
        <SectionHeader>Media</SectionHeader>
        <FieldGrid>
          <div style={{ gridColumn: "1 / -1" }}>
            <Controller
              name="poster_url"
              control={control}
              render={({ field }: { field: { value: string | undefined; onChange: (url: string) => void } }) => (
                <ImageUpload value={field.value ?? ""} onChange={field.onChange} />
              )}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <Controller
              name="gallery_urls"
              control={control}
              render={({ field }) => (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "18px" }}>
                  {[0, 1, 2, 3].map((index) => (
                    <ImageUpload key={index} bucket="project-gallery" label={`Gallery image ${index + 1}`} value={field.value?.[index] ?? ""} onChange={(url) => { const next = [...(field.value ?? [])]; next[index] = url; field.onChange(next.filter(Boolean)); }} />
                  ))}
                </div>
              )}
            />
          </div>

          <FormField label="Mux Playback ID" error={errors.mux_playback_id?.message} hint="From Mux dashboard → Asset details">
            <input {...register("mux_playback_id")} style={inputStyle} />
          </FormField>

          <FormField label="YouTube Video ID" error={errors.youtube_id?.message} hint="The part after ?v= in the YouTube URL">
            <input {...register("youtube_id")} style={inputStyle} />
          </FormField>
        </FieldGrid>

        {/* ── Display ──────────────────────────────────────── */}
        <SectionHeader>Display</SectionHeader>
        <FieldGrid>
          <FormField label="Aspect Ratio" error={errors.aspect_ratio?.message}>
            <select {...register("aspect_ratio")} style={selectStyle}>
              <option value="16:9">16:9</option>
              <option value="4:3">4:3</option>
              <option value="1:1">1:1</option>
              <option value="21:9">21:9</option>
            </select>
          </FormField>

          <FormField label="Grid Size" error={errors.grid_size?.message}>
            <select {...register("grid_size")} style={selectStyle}>
              <option value="large">Large</option>
              <option value="medium">Medium</option>
              <option value="small">Small</option>
            </select>
          </FormField>

          <FormField label="Display Order" error={errors.display_order?.message}>
            <input {...register("display_order")} type="number" style={inputStyle} />
          </FormField>
        </FieldGrid>

        <div style={{ display: "flex", gap: "32px", marginTop: "16px" }}>
          <label style={checkboxLabelStyle}>
            <input {...register("featured")} type="checkbox" style={{ marginRight: "8px" }} />
            Featured — show on home reel
          </label>
        </div>

        {/* ── Publishing ───────────────────────────────────── */}
        <SectionHeader>Publishing</SectionHeader>
        <label style={checkboxLabelStyle}>
          <input {...register("published")} type="checkbox" style={{ marginRight: "8px" }} />
          Published — visible on public site
        </label>

        {serverError && (
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--accent)", marginTop: "16px" }}>
            {serverError}
          </p>
        )}

        <FormActions
          isSubmitting={isSubmitting}
          cancelHref="/admin/projects"
          onDelete={isEdit ? () => setShowDeleteModal(true) : undefined}
          isEdit={isEdit}
        />
      </form>

      {showDeleteModal && initialData && (
        <DeleteConfirmModal
          title={initialData.title}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-fraunces)",
        fontSize: "18px",
        fontWeight: 400,
        color: "var(--fg-primary)",
        marginTop: "40px",
        marginBottom: "20px",
        paddingBottom: "12px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </h2>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid var(--admin-input-border)",
  borderRadius: 0,
  padding: "10px 0",
  color: "var(--fg-primary)",
  fontFamily: "var(--font-geist-sans)",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
};

const checkboxLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  fontFamily: "var(--font-geist-mono)",
  fontSize: "12px",
  color: "var(--fg-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  cursor: "pointer",
};
