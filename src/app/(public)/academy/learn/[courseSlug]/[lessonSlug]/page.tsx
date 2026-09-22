import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import YouTubeDisguisedPlayer from "@/components/academy/YouTubeDisguisedPlayer";
import StudentSidebar from "@/components/academy/StudentSidebar";
import type { AcademyModule, AcademyLesson } from "@/types/academy";

// Fallback course data if DB is initially empty
const fallbackCourseData = {
  id: "motion-engineering-masterclass",
  title: "Motion Engineering & Spring Physics",
  slug: "motion-engineering-masterclass",
  modules: [
    {
      id: "mod-1",
      course_id: "motion-engineering-masterclass",
      title: "Foundations of Taste & Physics",
      display_order: 1,
      lessons: [
        {
          id: "lesson-1",
          course_id: "motion-engineering-masterclass",
          module_id: "mod-1",
          slug: "intro",
          title: "01. Introduction: Taste Is Trained, Not Innate",
          description_markdown:
            "Good taste is not personal preference. It is a trained instinct: the ability to recognize what elevates an interface. In this opening masterclass, we break down why the aggregate of invisible correctness makes software users love without knowing why.",
          youtube_video_id: "dQw4w9WgXcQ",
          duration_minutes: 14,
          is_free_preview: true,
          resources: [
            { title: "Starter Starter Code Template.zip", url: "#", type: "file" as const },
            { title: "Motion Engineering Cheatsheet.pdf", url: "#", type: "file" as const },
          ],
          display_order: 1,
          published: true,
          created_at: new Date().toISOString(),
        },
        {
          id: "lesson-2",
          course_id: "motion-engineering-masterclass",
          module_id: "mod-1",
          slug: "easing-decision-framework",
          title: "02. The Animation Decision Framework",
          description_markdown:
            "Before writing any animation code, answer: How often will users see this? Learn why keyboard-initiated actions should never animate, and why UI transitions must stay strictly under 300ms.",
          youtube_video_id: "dQw4w9WgXcQ",
          duration_minutes: 18,
          is_free_preview: false,
          resources: [
            { title: "Custom Cubic-Bezier Presets.css", url: "#", type: "preset" as const },
          ],
          display_order: 2,
          published: true,
          created_at: new Date().toISOString(),
        },
      ],
    },
    {
      id: "mod-2",
      course_id: "motion-engineering-masterclass",
      title: "Spring Physics & Tactile Interactions",
      display_order: 2,
      lessons: [
        {
          id: "lesson-3",
          course_id: "motion-engineering-masterclass",
          module_id: "mod-2",
          slug: "tactile-buttons-and-scale",
          title: "03. Tactile Button Feedback & Scale Rules",
          description_markdown:
            "Buttons must feel responsive to press. Adding scale(0.97) on :active gives instant sensory feedback. Learn why you should never animate from scale(0) and how to configure origin-aware popovers.",
          youtube_video_id: "dQw4w9WgXcQ",
          duration_minutes: 20,
          is_free_preview: false,
          resources: [],
          display_order: 3,
          published: true,
          created_at: new Date().toISOString(),
        },
      ],
    },
  ],
};

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const supabase = await createClient();

  // Try fetching course from DB
  const { data: dbCourse } = await (supabase as any)
    .from("academy_courses")
    .select("*, modules:academy_modules(*, lessons:academy_lessons(*))")
    .eq("slug", courseSlug)
    .single();

  const course = dbCourse || fallbackCourseData;

  // Flatten lessons to find active lesson
  const allLessons: AcademyLesson[] = [];
  course.modules?.forEach((m: any) => {
    if (m.lessons) {
      allLessons.push(...m.lessons);
    }
  });

  const currentLesson =
    allLessons.find((l) => l.slug === lessonSlug) || allLessons[0];

  if (!currentLesson) {
    notFound();
  }

  // Find next lesson
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] pt-20">
      {/* 1. Sidebar Syllabus */}
      <StudentSidebar
        courseSlug={course.slug}
        courseTitle={course.title}
        modules={course.modules as any}
        completedLessonIds={[]}
      />

      {/* 2. Main Lesson Content Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 max-w-5xl space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Link href="/academy/learn" className="hover:text-white transition-colors">
            ACADEMY
          </Link>
          <span>/</span>
          <span className="text-white uppercase line-clamp-1">{course.title}</span>
          <span>/</span>
          <span className="text-[#E3FF39] uppercase font-bold">{currentLesson.title}</span>
        </div>

        {/* Video Player */}
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
          <YouTubeDisguisedPlayer
            videoId={currentLesson.youtube_video_id || "dQw4w9WgXcQ"}
            autoplay={false}
            muted={false}
            title={currentLesson.title}
            className="w-full aspect-video"
          />
        </div>

        {/* Lesson Header & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              {currentLesson.title}
            </h1>
            <span className="text-xs font-mono text-[#E3FF39]">
              DURATION: {currentLesson.duration_minutes || 15} MINUTES
            </span>
          </div>

          <div className="flex items-center gap-3">
            {nextLesson && (
              <Link
                href={`/academy/learn/${course.slug}/${nextLesson.slug}`}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors"
              >
                Next Lesson →
              </Link>
            )}
          </div>
        </div>

        {/* Lesson Description & Notes */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-[#E3FF39]">
            // LESSON NOTES & DIRECTING PRINCIPLES
          </h2>
          <div className="prose prose-invert max-w-none text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4">
            <p>{currentLesson.description_markdown}</p>
          </div>
        </div>

        {/* Resource Attachments */}
        {currentLesson.resources && currentLesson.resources.length > 0 && (
          <div className="border-t border-white/10 pt-6 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              DOWNLOADABLE SOURCE ASSETS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentLesson.resources.map((res: any, idx: number) => (
                <a
                  key={idx}
                  href={res.url}
                  download
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#E3FF39]/40 flex items-center justify-between text-xs font-mono text-white transition-all group"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#E3FF39]">📦</span>
                    <span className="group-hover:text-[#E3FF39] transition-colors">
                      {res.title}
                    </span>
                  </span>
                  <span className="text-neutral-500 group-hover:text-white">↓</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
