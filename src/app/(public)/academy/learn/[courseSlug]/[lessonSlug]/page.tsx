import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkCurrentUserAcademyAccess } from "@/lib/academy/access";
import YouTubeDisguisedPlayer from "@/components/academy/YouTubeDisguisedPlayer";
import StudentSidebar from "@/components/academy/StudentSidebar";
import PillButton from "@/components/ui/PillButton";
import type { AcademyLesson } from "@/types/academy";

// Comprehensive fallback courses map for offline/preview mode and unseeded DB
const fallbackCoursesMap: Record<string, any> = {
  "cinematic-ai-animation": {
    id: "cinematic-ai-animation",
    title: "Cinematic AI Animation & Motion Mechanics",
    slug: "cinematic-ai-animation",
    modules: [
      {
        id: "mod-1",
        course_id: "cinematic-ai-animation",
        title: "Foundations of Generative Motion & Prompt Architecture",
        display_order: 1,
        lessons: [
          {
            id: "lesson-1",
            course_id: "cinematic-ai-animation",
            module_id: "mod-1",
            slug: "intro",
            title: "01. Introduction: The AI Animation Director's Pipeline",
            description_markdown:
              "Welcome to the flagship Masterclass in Cinematic AI Animation. In this opening session, we dissect the end-to-end studio pipeline: structuring cinematic seed prompts, controlling temporal coherence across diffusion checkpoints, and establishing a unified directorial vision before generating frames.",
            youtube_video_id: "dQw4w9WgXcQ",
            duration_minutes: 16,
            is_free_preview: true,
            resources: [
              { title: "AI Animation Production Blueprint.pdf", url: "#", type: "file" as const },
              { title: "Prompt Architecture & Negative Weight Matrix.txt", url: "#", type: "file" as const },
            ],
            display_order: 1,
            published: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "lesson-2",
            course_id: "cinematic-ai-animation",
            module_id: "mod-1",
            slug: "character-turnarounds",
            title: "02. Consistent Character Turnarounds & Custom LoRAs",
            description_markdown:
              "Achieving character consistency across dramatic cuts is the hallmark of professional production. Discover how to train lightweight LoRAs, create 360-degree orthographic turnaround sheets, and anchor facial anatomy across dynamic camera movements.",
            youtube_video_id: "dQw4w9WgXcQ",
            duration_minutes: 24,
            is_free_preview: false,
            resources: [
              { title: "Character Turnaround Sheet Template.psd", url: "#", type: "file" as const },
              { title: "LoRA Training Dataset Curation Guide.pdf", url: "#", type: "file" as const },
            ],
            display_order: 2,
            published: true,
            created_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: "mod-2",
        course_id: "cinematic-ai-animation",
        title: "Camera Choreography & Latent Space Dynamics",
        display_order: 2,
        lessons: [
          {
            id: "lesson-3",
            course_id: "cinematic-ai-animation",
            module_id: "mod-2",
            slug: "camera-choreography",
            title: "03. Camera Paths, Latent Motion & Brush Physics",
            description_markdown:
              "Break free from static camera drifts. Master 3D camera projections, velocity curves, optical flow alignment, and directional motion brushes to generate dramatic push-ins, parallax pans, and fluid tracking shots.",
            youtube_video_id: "dQw4w9WgXcQ",
            duration_minutes: 22,
            is_free_preview: false,
            resources: [
              { title: "Camera Trajectory & Velocity Presets.json", url: "#", type: "preset" as const },
            ],
            display_order: 3,
            published: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "lesson-4",
            course_id: "cinematic-ai-animation",
            module_id: "mod-2",
            slug: "vfx-pipeline",
            title: "04. Hybrid VFX Pipeline: Upscaling, Interpolation & Grain",
            description_markdown:
              "Transform raw generative outputs into 4K master deliverables. Learn spatial-temporal upscaling techniques, custom optical flow interpolation, 35mm film grain overlays, and color grade matching in DaVinci Resolve.",
            youtube_video_id: "dQw4w9WgXcQ",
            duration_minutes: 28,
            is_free_preview: false,
            resources: [
              { title: "Film Stock Emulation LUTs Pack.cube", url: "#", type: "preset" as const },
              { title: "Upscaling & Frame Interpolation Workflow.pdf", url: "#", type: "file" as const },
            ],
            display_order: 4,
            published: true,
            created_at: new Date().toISOString(),
          },
        ],
      },
    ],
  },
  "visual-storytelling-directing": {
    id: "visual-storytelling-directing",
    title: "Visual Storytelling & Narrative Directing",
    slug: "visual-storytelling-directing",
    modules: [
      {
        id: "mod-1",
        course_id: "visual-storytelling-directing",
        title: "Story Architecture & Worldbuilding Bibles",
        display_order: 1,
        lessons: [
          {
            id: "lesson-1",
            course_id: "visual-storytelling-directing",
            module_id: "mod-1",
            slug: "intro",
            title: "01. Introduction: Directing Emotion in the Generative Era",
            description_markdown:
              "Storytelling precedes software. In this opening directing masterclass, we explore how to build resonant character arcs, establish tone poetry, and engineer story tension before generating a single visual frame.",
            youtube_video_id: "dQw4w9WgXcQ",
            duration_minutes: 18,
            is_free_preview: true,
            resources: [
              { title: "Directorial Beat Sheet & Scene Breakdown.pdf", url: "#", type: "file" as const },
            ],
            display_order: 1,
            published: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "lesson-2",
            course_id: "visual-storytelling-directing",
            module_id: "mod-1",
            slug: "worldbuilding-bibles",
            title: "02. Worldbuilding Bibles & Visual Lore Engineering",
            description_markdown:
              "Every cinematic universe requires rules of light, architecture, and texture. Learn how to craft a comprehensive Visual Lore Bible that aligns character aesthetics, color theory, and environment palettes.",
            youtube_video_id: "dQw4w9WgXcQ",
            duration_minutes: 26,
            is_free_preview: false,
            resources: [
              { title: "Master Worldbuilding Lore Bible Template.pdf", url: "#", type: "file" as const },
            ],
            display_order: 2,
            published: true,
            created_at: new Date().toISOString(),
          },
        ],
      },
      {
        id: "mod-2",
        course_id: "visual-storytelling-directing",
        title: "Editorial Rhythm & Cinematic Language",
        display_order: 2,
        lessons: [
          {
            id: "lesson-3",
            course_id: "visual-storytelling-directing",
            module_id: "mod-2",
            slug: "editorial-rhythm",
            title: "03. Editorial Pacing, Cut Rhythm & Sound Design Cohesion",
            description_markdown:
              "Editing is where directing takes its final form. We analyze cut rhythms, match-cutting generative motion, and layering atmospheric soundscapes that give visceral weight to animated worlds.",
            youtube_video_id: "dQw4w9WgXcQ",
            duration_minutes: 25,
            is_free_preview: false,
            resources: [
              { title: "Editorial Timeline Stems & Temp Tracks.zip", url: "#", type: "file" as const },
            ],
            display_order: 3,
            published: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "lesson-4",
            course_id: "visual-storytelling-directing",
            module_id: "mod-2",
            slug: "pitch-decks",
            title: "04. Constructing Production Pitch Decks & Animatics",
            description_markdown:
              "Package your vision for studios, commissioners, and film festivals. Build animatic proof-of-concepts, visual pitch bibles, and pitch deck presentations that get projects funded.",
            youtube_video_id: "dQw4w9WgXcQ",
            duration_minutes: 20,
            is_free_preview: false,
            resources: [
              { title: "Executive Pitch Deck Slide Kit.key", url: "#", type: "file" as const },
            ],
            display_order: 4,
            published: true,
            created_at: new Date().toISOString(),
          },
        ],
      },
    ],
  },
  "motion-engineering-masterclass": {
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
  },
};

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const supabase = await createClient();
  const access = await checkCurrentUserAcademyAccess();

  // Try fetching course from Supabase DB
  let dbCourse: any = null;
  try {
    const { data } = await (supabase as any)
      .from("academy_courses")
      .select("*, modules:academy_modules(*, lessons:academy_lessons(*))")
      .eq("slug", courseSlug)
      .single();
    dbCourse = data;
  } catch {
    // Database fallback
  }

  const course = dbCourse || fallbackCoursesMap[courseSlug] || fallbackCoursesMap["cinematic-ai-animation"];

  if (!course) {
    notFound();
  }

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

  // Determine lesson unlock state
  const isUnlocked = access.hasAccess || Boolean(currentLesson.is_free_preview);

  // Find next lesson
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen pt-20"
      style={{
        backgroundColor: "var(--bg-base)",
        color: "var(--fg-primary)",
      }}
    >
      {/* 1. Sidebar Syllabus */}
      <StudentSidebar
        courseSlug={course.slug}
        courseTitle={course.title}
        modules={course.modules as any}
        completedLessonIds={[]}
      />

      {/* 2. Main Lesson Content Area */}
      <main
        className="flex-1 min-w-0 px-4 sm:px-8 lg:px-10 py-6 max-w-5xl mx-auto w-full flex flex-col gap-6 overflow-y-auto"
      >
        {/* Breadcrumb Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "11px",
            color: "var(--fg-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/academy/learn"
            style={{ color: "var(--fg-muted)", textDecoration: "none" }}
            className="hover:text-white transition-colors"
          >
            STUDENT PORTAL
          </Link>
          <span>/</span>
          <span style={{ color: "var(--fg-primary)" }}>{course.title}</span>
          <span>/</span>
          <span style={{ color: "var(--accent-highlight)", fontWeight: 700 }}>
            {currentLesson.title}
          </span>
        </div>

        {/* Video Player or Locked State Container */}
        <div
          style={{
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid var(--border-strong)",
            backgroundColor: "var(--bg-elevated)",
            boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5)",
            position: "relative",
          }}
        >
          {isUnlocked ? (
            <div>
              <YouTubeDisguisedPlayer
                videoId={currentLesson.youtube_video_id || "dQw4w9WgXcQ"}
                autoplay={false}
                muted={false}
                title={currentLesson.title}
                className="w-full aspect-video"
              />
              {currentLesson.is_free_preview && !access.hasAccess && (
                <div
                  style={{
                    padding: "12px 20px",
                    borderTop: "1px solid var(--border)",
                    backgroundColor: "color-mix(in srgb, var(--accent-highlight) 5%, var(--bg-base))",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "11px",
                  }}
                >
                  <span style={{ color: "var(--fg-primary)" }}>
                    ✨ <strong style={{ color: "var(--accent-highlight)" }}>FREE PREVIEW LESSON</strong> · Enjoy this introductory session. Enroll in Academy to unlock the full 22-lesson curriculum.
                  </span>
                  <Link
                    href="/academy#pricing"
                    style={{
                      color: "var(--accent-highlight)",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      textDecoration: "underline",
                    }}
                  >
                    Unlock Full Masterclass →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                aspectRatio: "16 / 9",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "clamp(24px, 5vw, 64px)",
                background: "linear-gradient(180deg, rgba(15,15,18,0.95) 0%, rgba(5,5,8,0.98) 100%)",
                gap: "24px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "999px",
                  border: "1px solid var(--border-strong)",
                  backgroundColor: "var(--bg-base)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  color: "var(--accent-highlight)",
                }}
              >
                🔒
              </div>

              <div>
                <p
                  style={{
                    margin: "0 0 8px",
                    color: "var(--accent-highlight)",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Member Content · Lesson Locked
                </p>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-anton)",
                    fontSize: "clamp(28px, 3.5vw, 44px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 0.95,
                    textTransform: "uppercase",
                    color: "var(--fg-primary)",
                  }}
                >
                  Enroll to Unlock Full Access.
                </h2>
              </div>

              <p
                style={{
                  margin: 0,
                  maxWidth: "520px",
                  color: "var(--fg-muted)",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                }}
              >
                This lesson and its associated project files, turnaround models, and prompt matrices are
                exclusive to enrolled Academy members.
              </p>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                <PillButton href="/academy#pricing" variant="solid" size="large" withArrow>
                  Enroll in Masterclass
                </PillButton>
                <PillButton
                  href={`/academy/learn/${course.slug}/${allLessons.find((l) => l.is_free_preview)?.slug || "intro"}`}
                  variant="glass"
                  size="large"
                >
                  Watch Free Preview
                </PillButton>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Header & Action Controls */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            borderBottom: "1px solid var(--border-strong)",
            paddingBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  margin: "0 0 8px",
                  fontFamily: "var(--font-anton)",
                  fontSize: "clamp(26px, 3vw, 40px)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  color: "var(--fg-primary)",
                }}
              >
                {currentLesson.title}
              </h1>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "var(--accent-highlight)", fontWeight: 700 }}>
                  DURATION: {currentLesson.duration_minutes || 15} MINUTES
                </span>
                <span style={{ color: "var(--fg-subtle)" }}>•</span>
                <span style={{ color: currentLesson.is_free_preview ? "var(--accent-highlight)" : "var(--fg-muted)" }}>
                  {currentLesson.is_free_preview ? "FREE PREVIEW LESSON" : "STUDENT EXCLUSIVE"}
                </span>
              </div>
            </div>

            {nextLesson && (
              <PillButton
                href={`/academy/learn/${course.slug}/${nextLesson.slug}`}
                variant="glass"
                size="default"
                withArrow
              >
                Next Lesson
              </PillButton>
            )}
          </div>
        </div>

        {/* Lesson Notes & Director Principles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-geist-mono)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent-highlight)",
            }}
          >
            // LESSON NOTES & DIRECTING PRINCIPLES
          </h2>
          <div
            style={{
              color: "var(--fg-muted)",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "14px",
              lineHeight: 1.7,
              maxWidth: "840px",
            }}
          >
            <p style={{ margin: 0 }}>{currentLesson.description_markdown}</p>
          </div>
        </div>

        {/* Downloadable Source Assets */}
        {currentLesson.resources && currentLesson.resources.length > 0 && (
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontFamily: "var(--font-geist-mono)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
              }}
            >
              DOWNLOADABLE SOURCE ASSETS
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "12px",
              }}
            >
              {currentLesson.resources.map((res: any, idx: number) => (
                <a
                  key={idx}
                  href={res.url}
                  download
                  style={{
                    padding: "16px 20px",
                    borderRadius: "12px",
                    backgroundColor: "var(--bg-elevated)",
                    border: "1px solid var(--border-strong)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textDecoration: "none",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "12px",
                    color: "var(--fg-primary)",
                    transition: "border-color 200ms ease, background-color 200ms ease",
                  }}
                  className="hover:border-[#E3FF39] transition-colors"
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "var(--accent-highlight)" }}>📦</span>
                    <span>{res.title}</span>
                  </span>
                  <span style={{ color: "var(--fg-muted)" }}>↓</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
