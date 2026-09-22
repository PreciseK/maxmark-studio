import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { checkCurrentUserAcademyAccess } from "@/lib/academy/access";

// Default starter courses if no database courses are added yet
const defaultCourses = [
  {
    id: "course-1",
    slug: "cinematic-ai-animation",
    title: "Cinematic AI Animation & Motion Mechanics",
    subtitle: "From Prompt Composition to Fluid Generative Video",
    description:
      "Master character consistency, camera trajectory controls, motion brush physics, and diffusion pipelines for high-end animated films.",
    modulesCount: 5,
    lessonsCount: 22,
    thumbnailUrl: null,
  },
  {
    id: "course-2",
    slug: "visual-storytelling-directing",
    title: "Visual Storytelling & Narrative Directing",
    subtitle: "Directing Short Films, Commercials & Music Videos",
    description:
      "Learn how to write dramatic beat sheets, assemble cinematic storyboards, pace narrative tension, and direct coherent story worlds using generative video.",
    modulesCount: 4,
    lessonsCount: 16,
    thumbnailUrl: null,
  },
];

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const access = await checkCurrentUserAcademyAccess();

  // Fetch courses from Supabase
  const { data: dbCourses } = await (supabase as any)
    .from("academy_courses")
    .select("*, modules:academy_modules(*)")
    .eq("published", true)
    .order("display_order", { ascending: true });

  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : defaultCourses;

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E3FF39]">
            // STUDENT PORTAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
            My Masterclasses
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Welcome back. Select a course to continue your training.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono">
            <span className="text-neutral-400">MEMBERSHIP: </span>
            <span className="text-[#E3FF39] font-bold uppercase">
              {access.accessType === "lifetime" ? "Lifetime All-Access" : "Active Member"}
            </span>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map((course: any) => (
          <div
            key={course.id}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300 space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#E3FF39]">
                  HD MASTERCLASS
                </span>
                <span>
                  {course.modulesCount || course.modules?.length || 4} MODULES
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-1">
                  {course.title}
                </h3>
                {course.subtitle && (
                  <p className="text-xs font-mono text-[#E3FF39]/80 uppercase">
                    {course.subtitle}
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <Link
                href={`/academy/learn/${course.slug}/intro`}
                className="px-6 py-3 rounded-xl bg-[#E3FF39] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-[#d6f030] transition-transform active:scale-95"
              >
                Launch Course Player →
              </Link>
              <span className="text-xs font-mono text-neutral-500">
                SOURCE FILES INCLUDED
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Student Resources & Community Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-neutral-900/60 to-black border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-xl font-bold text-white uppercase tracking-tight">
            Maxmark Creator Circle Discord
          </h4>
          <p className="text-xs text-neutral-400 max-w-xl">
            Join other enrolled creators, share work-in-progress, and get direct feedback from our directing team.
          </p>
        </div>
        <a
          href="https://discord.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors shrink-0"
        >
          Join Discord Channel ↗
        </a>
      </div>
    </div>
  );
}
