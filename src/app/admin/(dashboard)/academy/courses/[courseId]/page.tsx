"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CourseCurriculumEditorPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Module Form State
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  // New Lesson Form State
  const [activeModuleForLesson, setActiveModuleForLesson] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonSlug, setNewLessonSlug] = useState("");
  const [newLessonYoutubeId, setNewLessonYoutubeId] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState(15);
  const [newLessonFreePreview, setNewLessonFreePreview] = useState(false);
  const [newLessonDescription, setNewLessonDescription] = useState("");

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    const { data: courseData } = await (supabase as any)
      .from("academy_courses")
      .select("*")
      .eq("id", courseId)
      .single();

    const { data: modulesData } = await (supabase as any)
      .from("academy_modules")
      .select("*, lessons:academy_lessons(*)")
      .eq("course_id", courseId)
      .order("display_order", { ascending: true });

    setCourse(courseData);
    setModules(modulesData || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle) return;
    setSaving(true);

    const { error } = await (supabase as any).from("academy_modules").insert({
      course_id: courseId,
      title: newModuleTitle,
      display_order: modules.length + 1,
    });

    if (!error) {
      setNewModuleTitle("");
      setShowAddModule(false);
      await loadData();
      setStatusMessage("Module created successfully");
    }
    setSaving(false);
  };

  const handleAddLesson = async (moduleId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle || !newLessonYoutubeId) return;
    setSaving(true);

    const slug =
      newLessonSlug ||
      newLessonTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const { error } = await (supabase as any).from("academy_lessons").insert({
      course_id: courseId,
      module_id: moduleId,
      title: newLessonTitle,
      slug,
      youtube_video_id: newLessonYoutubeId,
      duration_minutes: newLessonDuration,
      is_free_preview: newLessonFreePreview,
      description_markdown: newLessonDescription,
      display_order: 1,
      published: true,
    });

    if (!error) {
      setActiveModuleForLesson(null);
      setNewLessonTitle("");
      setNewLessonSlug("");
      setNewLessonYoutubeId("");
      setNewLessonDescription("");
      await loadData();
      setStatusMessage("Lesson added successfully!");
    } else {
      setStatusMessage(`Error: ${error.message}`);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-neutral-400">
        Loading masterclass curriculum...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-10">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 space-y-3">
        <Link
          href="/admin/academy"
          className="text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors"
        >
          ← Back to All Masterclasses
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{course?.title}</h1>
            <p className="text-xs font-mono text-neutral-400 mt-1">
              SLUG: /academy/learn/{course?.slug}
            </p>
          </div>
          <button
            onClick={() => setShowAddModule(true)}
            className="px-4 py-2 rounded-lg bg-[#E3FF39] text-black font-bold text-xs uppercase hover:bg-[#d6f030]"
          >
            + Add Module
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-lg bg-[#E3FF39]/10 border border-[#E3FF39]/30 text-[#E3FF39] text-xs font-mono">
          {statusMessage}
        </div>
      )}

      {/* Add Module Modal/Form */}
      {showAddModule && (
        <form
          onSubmit={handleAddModule}
          className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-4"
        >
          <h3 className="text-sm font-bold uppercase text-white">Create New Module</h3>
          <input
            type="text"
            required
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            placeholder="e.g. Module 1: Foundations of Kinetic Motion"
            className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:outline-none focus:border-[#E3FF39]"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded bg-[#E3FF39] text-black font-bold text-xs uppercase"
            >
              {saving ? "Saving..." : "Save Module"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddModule(false)}
              className="px-4 py-2 rounded bg-neutral-800 text-neutral-300 text-xs uppercase"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Modules and Lessons List */}
      <div className="space-y-8">
        {modules.map((mod, modIdx) => (
          <div
            key={mod.id}
            className="rounded-xl border border-neutral-800 bg-neutral-900/30 overflow-hidden"
          >
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-[#E3FF39]">
                  M{modIdx + 1}
                </span>
                <h3 className="text-base font-bold text-white">{mod.title}</h3>
              </div>
              <button
                onClick={() =>
                  setActiveModuleForLesson(
                    activeModuleForLesson === mod.id ? null : mod.id
                  )
                }
                className="px-3 py-1.5 rounded text-xs font-mono uppercase bg-white/10 hover:bg-white/20 text-white"
              >
                + Add Lesson
              </button>
            </div>

            {/* Add Lesson Form inside this Module */}
            {activeModuleForLesson === mod.id && (
              <form
                onSubmit={(e) => handleAddLesson(mod.id, e)}
                className="p-6 bg-neutral-950 border-b border-neutral-800 space-y-4"
              >
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#E3FF39]">
                  NEW LESSON FOR {mod.title}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      placeholder="01. Perceived Speed & Easing"
                      className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                      YouTube Video ID (Unlisted or Public)
                    </label>
                    <input
                      type="text"
                      required
                      value={newLessonYoutubeId}
                      onChange={(e) => setNewLessonYoutubeId(e.target.value)}
                      placeholder="dQw4w9WgXcQ"
                      className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={newLessonDuration}
                      onChange={(e) => setNewLessonDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id={`preview-${mod.id}`}
                      checked={newLessonFreePreview}
                      onChange={(e) => setNewLessonFreePreview(e.target.checked)}
                      className="w-4 h-4 rounded text-[#E3FF39]"
                    />
                    <label
                      htmlFor={`preview-${mod.id}`}
                      className="text-xs font-mono text-neutral-300"
                    >
                      Make this a Free Preview Lesson
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                    Lesson Directing Notes & Markdown
                  </label>
                  <textarea
                    rows={3}
                    value={newLessonDescription}
                    onChange={(e) => setNewLessonDescription(e.target.value)}
                    placeholder="Key principles, code snippets, and takeaway notes for the student..."
                    className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white text-xs"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded bg-[#E3FF39] text-black font-bold text-xs uppercase"
                  >
                    {saving ? "Adding..." : "Add Lesson"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModuleForLesson(null)}
                    className="px-3 py-2 rounded bg-neutral-800 text-neutral-400 text-xs uppercase"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Lessons List */}
            <div className="divide-y divide-neutral-800/60">
              {mod.lessons && mod.lessons.length > 0 ? (
                mod.lessons.map((lesson: any, lessonIdx: number) => (
                  <div
                    key={lesson.id}
                    className="p-4 px-6 flex items-center justify-between text-xs hover:bg-neutral-800/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-500 font-mono">#{lessonIdx + 1}</span>
                      <span className="font-medium text-white">{lesson.title}</span>
                      {lesson.is_free_preview && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          FREE PREVIEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-neutral-400 font-mono">
                      <span>{lesson.duration_minutes}m</span>
                      <span className="text-neutral-600">YT: {lesson.youtube_video_id}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs font-mono text-neutral-500">
                  No lessons in this module yet. Click "+ Add Lesson" to upload one!
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
