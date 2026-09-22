"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/cn";
import type { AcademyModule, AcademyLesson } from "@/types/academy";

type StudentSidebarProps = {
  courseSlug: string;
  courseTitle: string;
  modules: (AcademyModule & { lessons: AcademyLesson[] })[];
  completedLessonIds: string[];
  onToggleComplete?: (lessonId: string) => void;
  className?: string;
};

export default function StudentSidebar({
  courseSlug,
  courseTitle,
  modules,
  completedLessonIds,
  onToggleComplete,
  className,
}: StudentSidebarProps) {
  const params = useParams();
  const currentLessonSlug = params?.lessonSlug as string | undefined;

  // Calculate progress percentage
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const completedCount = completedLessonIds.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <aside
      className={cn(
        "w-full lg:w-80 lg:min-w-[320px] lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 bg-neutral-950/90 backdrop-blur-2xl border-r border-white/10 flex flex-col shrink-0 overflow-y-auto select-none",
        className
      )}
    >
      {/* Course Title & Progress Header */}
      <div className="p-6 border-b border-white/10 space-y-4 liquid-glass-dock">
        <Link
          href="/academy/learn"
          className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 hover:text-[#E3FF39] transition-colors block"
        >
          ← Back to Dashboard
        </Link>
        <div>
          <h2 className="text-base font-bold text-white leading-snug">{courseTitle}</h2>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-neutral-400">
              <span>PROGRESS</span>
              <span className="text-[#E3FF39] font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E3FF39] to-[#d4ff3e] shadow-[0_0_10px_#E3FF39] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modules & Lessons List */}
      <div className="flex-1 py-4 divide-y divide-white/5">
        {modules.map((mod, modIdx) => (
          <div key={mod.id || modIdx} className="py-3">
            <div className="px-6 py-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E3FF39] font-bold">
                MODULE {modIdx + 1}
              </span>
              <h3 className="text-xs font-bold uppercase text-neutral-300 tracking-wider">
                {mod.title}
              </h3>
            </div>

            <div className="mt-1 space-y-1 px-3">
              {mod.lessons?.map((lesson) => {
                const isActive = currentLessonSlug === lesson.slug;
                const isCompleted = completedLessonIds.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200",
                      isActive
                        ? "liquid-glass-surface specular-border bg-[#E3FF39]/15 border-[#E3FF39]/50 text-white shadow-[0_0_16px_rgba(227,255,57,0.15)]"
                        : "hover:bg-white/[0.05] text-neutral-400 hover:text-white"
                    )}
                  >
                    <Link
                      href={`/academy/learn/${courseSlug}/${lesson.slug}`}
                      className="flex-1 text-xs font-medium pr-3 line-clamp-1"
                    >
                      {lesson.title}
                      {lesson.is_free_preview && (
                        <span className="ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                          PREVIEW
                        </span>
                      )}
                    </Link>

                    {/* Completion checkbox button */}
                    <button
                      type="button"
                      onClick={() => onToggleComplete && onToggleComplete(lesson.id)}
                      className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center text-[10px] transition-transform duration-150 active:scale-90 cursor-pointer specular-border",
                        isCompleted
                          ? "bg-[#E3FF39] border-[#E3FF39] text-black shadow-sm shadow-[#E3FF39]/40"
                          : "border-white/20 hover:border-white/40"
                      )}
                      aria-label="Toggle Complete"
                    >
                      {isCompleted && "✓"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
