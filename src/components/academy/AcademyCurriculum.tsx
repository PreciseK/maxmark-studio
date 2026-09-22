"use client";

import styles from "./Academy.module.css";

const stages = [
  {
    step: "01",
    title: "Narrative Architecture & Storyboarding",
    duration: "4 Modules · 18 Lessons",
    summary:
      "Master script-to-screen translation, emotional pacing, worldbuilding bibles, and storyboard prompt composition that anchors a cinematic film.",
    highlights: [
      "Dramatic beat sheets, three-act structure & narrative pacing",
      "Worldbuilding bibles, lore design & stylistic coherence",
      "Camera angle vocabulary: Anamorphic lenses, focal lengths & shot scales",
      "Converting emotional story beats into high-fidelity storyboard sequences",
    ],
  },
  {
    step: "02",
    title: "Persistent Character & World Design",
    duration: "5 Modules · 22 Lessons",
    summary:
      "Solve the hardest challenge in AI animation: keeping characters, costumes, textures, and lighting identical across varying angles, close-ups, and action shots.",
    highlights: [
      "Multi-angle turnaround sheets & facial embedding consistency",
      "Costume, lighting & environment preservation across shots",
      "Seed locking, IP-Adapter, LoRA fine-tuning & reference rigging",
      "Multi-character staging, eye-line continuity & spatial blocking",
    ],
  },
  {
    step: "03",
    title: "Motion Mechanics & Camera Choreography",
    duration: "4 Modules · 16 Lessons",
    summary:
      "Transform static generations into dynamic, fluid cinematic animation. Direct camera orbits, zooms, tracking shots, and physical action without uncanny AI morphing.",
    highlights: [
      "Motion brush direction, trajectory paths & virtual camera rigs",
      "Dynamic kinetic physics: Velocity, weight, hair & cloth dynamics",
      "Hybrid pipelines: 3D blockout depth passes & optical flow guidance",
      "Choreographing fast-action sequences, weather & atmospheric VFX",
    ],
  },
  {
    step: "04",
    title: "Editorial Pacing, Sound & Final Polish",
    duration: "3 Modules · 12 Lessons",
    summary:
      "Assemble, color grade, score, and polish your animation to broadcast and festival standard. Strip generative artifacts, layer immersive soundscapes, and deliver commercial-grade films.",
    highlights: [
      "Timeline editing, match cuts, montage rhythm & tension curves",
      "Immersive sound design: Foley, spatial ambience & dialogue synch",
      "Film color science, ACES workflows, grain emulation & lighting polish",
      "Packaging and pitching commercial AI animation briefs to clients",
    ],
  },
];

export default function AcademyCurriculum() {
  return (
    <section className={styles.curriculumSection} id="curriculum">
      <div className={styles.sectionIntro}>
        <p className={styles.kicker}>Curriculum Architecture · 4 Production Stages</p>
        <h2>The complete director's pipeline.</h2>
        <p className={styles.heroDescription} style={{ margin: "24px 0 0", maxWidth: "700px" }}>
          Structured around how real films are made. From initial script concepts and multi-angle
          character turnaround sheets to fluid camera choreography, audio mixing, and commercial
          festival grading.
        </p>
      </div>

      <div className={styles.curriculumGrid}>
        {stages.map((stage) => (
          <article className={styles.curriculumArticle} key={stage.step}>
            <div>
              <span className={styles.curriculumNumber}>{stage.step}</span>
              <h3 className={styles.curriculumTitle}>{stage.title}</h3>
              <p className={styles.curriculumSummary}>{stage.summary}</p>
              <ul className={styles.curriculumList}>
                {stage.highlights.map((item, i) => (
                  <li key={i}>
                    <span>›</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.curriculumDuration}>{stage.duration}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
