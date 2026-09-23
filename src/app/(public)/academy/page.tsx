import type { Metadata } from "next";
import Link from "next/link";
import PillButton from "@/components/ui/PillButton";
import AcademyHeroTrailer from "@/components/academy/AcademyHeroTrailer";
import AcademyCurriculum from "@/components/academy/AcademyCurriculum";
import AcademyPricing from "@/components/academy/AcademyPricing";
import AcademyInstructors from "@/components/academy/AcademyInstructors";
import AcademyFAQ from "@/components/academy/AcademyFAQ";
import FreeFieldGuideModal from "@/components/academy/FreeFieldGuideModal";
import MotionSection from "@/components/motion/MotionSection";
import styles from "@/components/academy/Academy.module.css";

export const metadata: Metadata = {
  title: "Academy — AI Animation & Cinematic Storytelling | Maxmark Animations",
  description:
    "Professional masterclasses in generative AI animation, persistent character consistency, camera choreography, and visual storytelling from Maxmark Animations.",
  openGraph: {
    title: "Maxmark Animations Academy — AI Animation & Storytelling",
    description:
      "Master AI animation, persistent character consistency, and cinematic storytelling pipelines.",
  },
};

const MARQUEE_ITEMS = [
  "AI Animation Videos",
  "Cinematic Storytelling",
  "Generative Cinematography",
  "Persistent Characters",
  "Prompt-to-Screen Direction",
  "Camera Choreography",
  "Dramatic Beat Sheets",
  "Commercial Film Polish",
];

export default function AcademyPage() {
  return (
    <div className={styles.page}>
      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Maxmark Animations // AI Animation & Storytelling Academy</p>
          <h1 className={styles.heroTitle}>The Academy.</h1>
          <p className={styles.heroDescription}>
            A master-level training ground for directors, animators, and digital storytellers.
            Master persistent character design, cinematic prompt architecture, camera choreography,
            and emotional narrative structure in generative video.
          </p>

          <div className={styles.heroActions}>
            <PillButton href="#pricing" variant="glass" size="large" withArrow>
              Enroll in Academy
            </PillButton>
            <PillButton href="/academy/learn" variant="glass" size="large">
              Student Portal →
            </PillButton>
          </div>
        </div>
      </section>

      {/* 2. DISCIPLINE MARQUEE */}
      <section className={styles.marqueeRail} aria-label="Curriculum disciplines">
        <div className={styles.marqueeTrack}>
          {[0, 1].map((copyIndex) => (
            <div
              key={copyIndex}
              className={styles.marqueeGroup}
              aria-hidden={copyIndex === 1 ? "true" : undefined}
            >
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={`${item}-${i}`} className={styles.marqueeMark}>
                  {item}
                  <span className={styles.marqueeSeparator}> · </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 3. CINEMA SCREENING ROOM (HERO TRAILER) */}
      <MotionSection tag="div">
        <AcademyHeroTrailer videoId="dQw4w9WgXcQ" />
      </MotionSection>

      {/* 4. PHILOSOPHY & STATEMENT */}
      <MotionSection className={styles.statementSection} tag="section">
        <div className={styles.statementHeading}>
          <p className={styles.kicker}>Directing & Visual Storytelling</p>
          <h2>From Isolated Prompts to Cinematic Films.</h2>
        </div>
        <div className={styles.statementCopy}>
          <p>
            Anyone can generate a 4-second random video clip. But directing a coherent, emotionally
            compelling animated film requires an entirely different caliber of craft. It demands
            deliberate camera choreography, persistent character consistency across shots, purposeful
            color grading, and disciplined narrative pacing.
          </p>
          <p>
            Maxmark Animations Academy was built to teach the complete director’s pipeline: translating
            script concepts into cinematic storyboards, controlling generative diffusion models,
            locking character identities across environments, and assembling edits with immersive sound
            design to broadcast and festival standard.
          </p>
        </div>
      </MotionSection>

      {/* 5. CURRICULUM ARCHITECTURAL GRID */}
      <MotionSection tag="div">
        <AcademyCurriculum />
      </MotionSection>

      {/* 6. INSTRUCTORS & DIRECTORS ROSTER */}
      <MotionSection tag="div">
        <AcademyInstructors />
      </MotionSection>

      {/* 7. TUITION & ENROLLMENT (PAYSTACK TIERS) */}
      <MotionSection tag="div">
        <AcademyPricing />
      </MotionSection>

      {/* 8. FIELD GUIDE COMPLIMENTARY DOWNLOAD */}
      <FreeFieldGuideModal />

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <MotionSection tag="div">
        <AcademyFAQ />
      </MotionSection>

      {/* 10. SIGNATURE CONTINUE BANNER */}
      <MotionSection tag="div">
        <Link href="/work" className={styles.continueLink}>
          <span className={styles.continueLabel}>Continue to</span>
          <span className={styles.continueTitle}>Work</span>
          <span className={styles.continueArrow}>↗</span>
        </Link>
      </MotionSection>
    </div>
  );
}
