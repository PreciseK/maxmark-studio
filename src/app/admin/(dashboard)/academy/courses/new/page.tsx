"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [trailerYoutubeId, setTrailerYoutubeId] = useState("");
  const [published, setPublished] = useState(true);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { data, error: insertError } = await (supabase as any)
      .from("academy_courses")
      .insert({
        title,
        slug,
        subtitle,
        description,
        trailer_youtube_id: trailerYoutubeId,
        published,
        display_order: 1,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push(`/admin/academy/courses/${data.id}`);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <Link
          href="/admin/academy"
          className="text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors"
        >
          ← Back to Academy
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">New Masterclass Course</h1>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
            Course Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Motion Engineering & Spring Physics"
            className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#E3FF39]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="motion-engineering"
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#E3FF39]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              Trailer YouTube Video ID
            </label>
            <input
              type="text"
              value={trailerYoutubeId}
              onChange={(e) => setTrailerYoutubeId(e.target.value)}
              placeholder="dQw4w9WgXcQ"
              className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#E3FF39]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
            Subtitle / Tagline
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="From Micro-Interactions to 60fps Kinetic UI"
            className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#E3FF39]"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Comprehensive overview of what students will achieve in this masterclass..."
            className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#E3FF39]"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-700 text-[#E3FF39] focus:ring-0"
          />
          <label htmlFor="published" className="text-xs font-mono uppercase text-neutral-300">
            Publish immediately on Academy
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-[#E3FF39] text-black font-bold uppercase text-xs tracking-wider hover:bg-[#d6f030] disabled:opacity-50"
        >
          {loading ? "Creating Masterclass..." : "Create & Build Curriculum →"}
        </button>
      </form>
    </div>
  );
}
