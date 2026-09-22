"use client";

import styles from "./Academy.module.css";

const instructors = [
  {
    number: "01",
    name: "Maxmark Creative Lead",
    title: "Executive Creative Director & Founder",
    bio: "Pioneering creative technologist and AI filmmaker. Directs high-concept narrative campaigns, commercial animation pipelines, and dramatic camera language for global clients.",
    initials: "ML",
  },
  {
    number: "02",
    name: "Narrative & Storyboard Lead",
    title: "Head of Visual Storytelling",
    bio: "Specializing in dramatic beat sheets, character emotional arcs, cinematic storyboard composition, and turning complex scripts into coherent generative sequences.",
    initials: "NS",
  },
  {
    number: "03",
    name: "AI Animator & VFX Director",
    title: "Head of Generative Cinematography",
    bio: "Master of camera motion trajectories, character turnaround sheet preservation, seed-locking, and hybrid post-production pipelines bridging AI diffusion models with AfterEffects and DaVinci.",
    initials: "AV",
  },
];

export default function AcademyInstructors() {
  return (
    <section className={styles.instructorsSection} id="instructors">
      <div className={styles.sectionIntro}>
        <p className={styles.kicker}>Mentorship & Directing · Studio Filmmakers</p>
        <h2>Learn from the directors.</h2>
        <p className={styles.heroDescription} style={{ margin: "24px 0 0", maxWidth: "700px" }}>
          No generic tool tutorials or toy demos. Direct workflows developed inside
          Maxmark Animations on commercial brand films, animated music videos, and narrative shorts.
        </p>
      </div>

      <div className={styles.peopleGrid}>
        {instructors.map((inst) => (
          <article className={styles.personCard} key={inst.number}>
            <div>
              <div className={styles.personAvatar}>{inst.initials}</div>
              <h3 className={styles.personName}>{inst.name}</h3>
              <p className={styles.personRole}>{inst.title}</p>
              <p className={styles.personBio}>{inst.bio}</p>
            </div>
            <div
              style={{
                marginTop: "32px",
                paddingTop: "16px",
                borderTop: "1px solid var(--border)",
                color: "var(--fg-subtle)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              // Active Studio Director
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
