import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAcademyPage() {
  const supabase = await createClient();

  // Fetch courses
  const { data: courses } = await (supabase as any)
    .from("academy_courses")
    .select("*, modules:academy_modules(count)")
    .order("display_order", { ascending: true });

  // Fetch enrollments count
  const { count: studentCount } = await (supabase as any)
    .from("academy_enrollments")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#E3FF39]">
            EDUCATION & MASTERCLASSES
          </span>
          <h1 className="text-3xl font-bold text-white mt-1">Academy Management</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Publish video masterclasses, organize modules, and monitor student enrollments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/academy/enrollments"
            className="px-4 py-2.5 rounded-lg border border-neutral-700 hover:border-neutral-500 text-xs font-mono uppercase text-neutral-300 transition-colors"
          >
            Students ({studentCount || 0})
          </Link>
          <Link
            href="/admin/academy/courses/new"
            className="px-5 py-2.5 rounded-lg bg-[#E3FF39] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#d6f030] transition-colors"
          >
            + New Masterclass
          </Link>
        </div>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          ALL ACADEMY COURSES
        </h2>

        {courses && courses.length > 0 ? (
          <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
            {courses.map((course: any) => (
              <div
                key={course.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-800/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white">{course.title}</h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        course.published
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-neutral-700 text-neutral-400"
                      }`}
                    >
                      {course.published ? "PUBLISHED" : "DRAFT"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-1">
                    {course.description || "No description provided."}
                  </p>
                  <div className="text-[11px] font-mono text-neutral-500">
                    SLUG: /academy/learn/{course.slug}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/academy/learn/${course.slug}/intro`}
                    target="_blank"
                    className="px-3 py-1.5 rounded text-xs font-mono text-neutral-400 hover:text-white transition-colors"
                  >
                    Preview ↗
                  </Link>
                  <Link
                    href={`/admin/academy/courses/${course.id}`}
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase font-bold transition-colors"
                  >
                    Edit Curriculum →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 space-y-4">
            <p className="text-sm text-neutral-400">
              No masterclasses in the database yet. Create your first course to populate the academy!
            </p>
            <Link
              href="/admin/academy/courses/new"
              className="inline-block px-5 py-2.5 rounded-lg bg-[#E3FF39] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#d6f030]"
            >
              Create Masterclass
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
