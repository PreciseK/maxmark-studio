import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { checkCurrentUserAcademyAccess } from "@/lib/academy/access";
import PillButton from "@/components/ui/PillButton";

export const metadata = {
  title: "Student Portal — Masterclasses | Maxmark Animations",
  description:
    "Active student dashboard for AI animation, persistent character pipelines, and narrative storytelling masterclasses.",
};

// Production starter courses
const defaultCourses = [
  {
    id: "course-1",
    slug: "cinematic-ai-animation",
    title: "Cinematic AI Animation & Motion Mechanics",
    subtitle: "From Prompt Composition to Fluid Generative Video",
    description:
      "Master character turnaround consistency, camera trajectory controls, motion brush dynamics, and hybrid diffusion workflows for festival-grade animated films.",
    modulesCount: 5,
    lessonsCount: 22,
    introSlug: "intro",
    featuredBadge: "Flagship Masterclass",
  },
  {
    id: "course-2",
    slug: "visual-storytelling-directing",
    title: "Visual Storytelling & Narrative Directing",
    subtitle: "Directing Short Films, Commercials & Music Videos",
    description:
      "Learn how to write dramatic beat sheets, construct cinematic storyboards, pace narrative tension, and direct coherent story worlds using generative video pipelines.",
    modulesCount: 4,
    lessonsCount: 16,
    introSlug: "intro",
    featuredBadge: "Core Directing Track",
  },
];

export default async function StudentDashboardPage() {
  let access = { hasAccess: false, accessType: undefined as any };
  let dbCourses: any[] | null = null;

  try {
    const supabase = await createClient();
    access = (await checkCurrentUserAcademyAccess()) as any;

    const { data } = await (supabase as any)
      .from("academy_courses")
      .select("*, modules:academy_modules(*)")
      .eq("published", true)
      .order("display_order", { ascending: true });
    dbCourses = data;
  } catch (err) {
    console.error("StudentDashboardPage data error:", err);
  }

  const courses = dbCourses && dbCourses.length > 0 ? dbCourses : defaultCourses;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-base)",
        color: "var(--fg-primary)",
        paddingTop: "140px",
        paddingBottom: "120px",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 64px)" }}>
        {/* 1. Header Section */}
        <header
          style={{
            borderBottom: "1px solid var(--border-strong)",
            paddingBottom: "48px",
            marginBottom: "64px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <p
                style={{
                  margin: "0 0 12px",
                  color: "var(--accent-highlight)",
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Maxmark Animations // Student Portal
              </p>
              <h1
                style={{
                  margin: 0,
                  fontFamily: "var(--font-anton)",
                  fontSize: "clamp(48px, 6vw, 84px)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.03em",
                  textTransform: "uppercase",
                  color: "var(--fg-primary)",
                }}
              >
                My Masterclasses.
              </h1>
            </div>

            {/* Access Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px 16px",
                borderRadius: "999px",
                border: "1px solid var(--border-strong)",
                background: "var(--bg-elevated)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "11px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ color: "var(--fg-muted)" }}>Membership:</span>
              <span
                style={{
                  color: access.hasAccess ? "var(--accent-highlight)" : "var(--fg-subtle)",
                  fontWeight: 700,
                }}
              >
                {access.hasAccess
                  ? access.accessType === "lifetime"
                    ? "Lifetime All-Access"
                    : "Active Member"
                  : "Preview Access"}
              </span>
            </div>
          </div>

          <p
            style={{
              margin: 0,
              maxWidth: "740px",
              color: "var(--fg-muted)",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            Welcome to the direct learning suite. Select any masterclass to open the cinema player,
            access lesson breakdowns, download production starter assets, and follow the complete director’s pipeline.
          </p>

          {!access.hasAccess && (
            <div
              style={{
                padding: "16px 24px",
                borderRadius: "12px",
                border: "1px solid var(--border-strong)",
                background: "color-mix(in srgb, var(--accent-highlight) 4%, var(--bg-base))",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "12px",
                  color: "var(--fg-primary)",
                }}
              >
                🔓 You are viewing in Preview Mode with free introductory lessons unlocked.
              </span>
              <div style={{ display: "flex", gap: "12px" }}>
                <PillButton href="/academy#pricing" variant="solid" size="default">
                  Enroll in Academy →
                </PillButton>
                <PillButton href="/admin/login" variant="glass" size="default">
                  Student Login
                </PillButton>
              </div>
            </div>
          )}
        </header>

        {/* 2. Courses Grid */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "32px",
            marginBottom: "80px",
          }}
        >
          {courses.map((course: any, idx: number) => (
            <article
              key={course.id || idx}
              style={{
                border: "1px solid var(--border-strong)",
                background: "var(--bg-elevated)",
                padding: "clamp(32px, 3.5vw, 48px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "440px",
                position: "relative",
              }}
            >
              <div>
                {/* Card Top Meta */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    style={{
                      color: "var(--accent-highlight)",
                      fontWeight: 700,
                    }}
                  >
                    0{idx + 1} // MASTERCLASS
                  </span>
                  <span style={{ color: "var(--fg-muted)" }}>
                    {course.modulesCount || course.modules?.length || 4} Modules · {course.lessonsCount || 18} Lessons
                  </span>
                </div>

                {/* Course Title */}
                <h2
                  style={{
                    margin: "0 0 12px",
                    fontFamily: "var(--font-anton)",
                    fontSize: "clamp(28px, 2.5vw, 38px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 0.95,
                    textTransform: "uppercase",
                    color: "var(--fg-primary)",
                  }}
                >
                  {course.title}
                </h2>

                {course.subtitle && (
                  <p
                    style={{
                      margin: "0 0 20px",
                      color: "var(--accent-highlight)",
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: "11px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {course.subtitle}
                  </p>
                )}

                <p
                  style={{
                    margin: 0,
                    color: "var(--fg-muted)",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "13px",
                    lineHeight: 1.6,
                  }}
                >
                  {course.description}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div
                style={{
                  marginTop: "40px",
                  paddingTop: "24px",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <PillButton
                  href={`/academy/learn/${course.slug}/${course.introSlug || "intro"}`}
                  variant="solid"
                  size="large"
                  withArrow
                >
                  Launch Masterclass
                </PillButton>

                <span
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "10px",
                    color: "var(--fg-subtle)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Free Preview Included
                </span>
              </div>
            </article>
          ))}
        </section>

        {/* 3. Discord Creator Circle Community Banner */}
        <section
          style={{
            border: "1px solid var(--border-strong)",
            background: "var(--bg-elevated)",
            padding: "48px clamp(24px, 4vw, 56px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "32px",
          }}
        >
          <div style={{ maxWidth: "640px" }}>
            <p
              style={{
                margin: "0 0 8px",
                color: "var(--accent-highlight)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Private Director Circle
            </p>
            <h3
              style={{
                margin: "0 0 12px",
                fontFamily: "var(--font-anton)",
                fontSize: "clamp(26px, 2.8vw, 42px)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: "var(--fg-primary)",
              }}
            >
              Maxmark Creator Circle Discord
            </h3>
            <p
              style={{
                margin: 0,
                color: "var(--fg-muted)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              Connect with fellow animators and filmmakers, share work-in-progress, and receive direct
              portfolio and timeline critiques from the Maxmark directing team.
            </p>
          </div>

          <PillButton
            href="https://discord.com"
            target="_blank"
            variant="glass"
            size="large"
          >
            Join Discord Channel ↗
          </PillButton>
        </section>
      </div>
    </div>
  );
}
