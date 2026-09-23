"use client";

import { useEffect } from "react";
import Link from "next/link";
import PillButton from "@/components/ui/PillButton";
import MuxLoopPlayer from "@/components/video/MuxLoopPlayer";
import styles from "./home.module.css";

const CONCEPT_FILMS = [
  {
    id: "ritual-of-motion",
    number: "01",
    title: "RITUAL OF MOTION",
    category: "Fashion & Beauty Concept Film",
    muxPlaybackId: "VCBESmjDlV4eRLTFzQ2j75KtN1XrKyV9sdwaAQXNv38",
    href: "/work/ritual-of-motion",
    badge: "15s Concept",
  },
  {
    id: "heritage-drop",
    number: "02",
    title: "HERITAGE DROP",
    category: "Luxury Product Concept Film",
    muxPlaybackId: "00uZ5D3R3y7XM7J67GBZQCBe89j02E1uL01HZ8MW2ocBUc",
    href: "/work/heritage-drop",
    badge: "15s Concept",
  },
  {
    id: "future-within-reach",
    number: "03",
    title: "FUTURE WITHIN REACH",
    category: "Technology & Innovation Concept Film",
    muxPlaybackId: "q3ld4vu00a9IeOlIQFuj6jltcdbS1MM102yz2Of1n601t4",
    href: "/work/golden-hour",
    badge: "15s Concept",
  },
  {
    id: "the-last-frontier",
    number: "04",
    title: "THE LAST FRONTIER",
    category: "Cinematic Brand World",
    muxPlaybackId: "CkqEBNBjOnsS5xdeHV9VakK2k8j1j500FATUoIAWnnv4",
    href: "/work/the-last-frontier",
    badge: "Brand World",
  },
  {
    id: "frequency",
    number: "05",
    title: "FREQUENCY",
    category: "Music & Culture Visual",
    muxPlaybackId: "zFaTv2EtIEW3dzkNTxBzHvcCJPEG009AR61Ng8h2RPGI",
    href: "/work/frequency",
    badge: "Music Visual",
  },
  {
    id: "isoka",
    number: "06",
    title: "ISOKA",
    category: "African Narrative Short",
    muxPlaybackId: "KN702xowBcoN1Qq7NKudjBv1l02HMkW2QMkHAlmY7jsak",
    href: "/work/isoka",
    badge: "Narrative",
  },
];

const CAPABILITIES = [
  {
    number: "01",
    title: "AI COMMERCIALS",
    description:
      "High-impact advertising films for television, digital campaigns, product launches and social media.",
  },
  {
    number: "02",
    title: "BRAND FILMS",
    description:
      "Cinematic stories that communicate what a company believes, builds and brings to the world.",
  },
  {
    number: "03",
    title: "NARRATIVE FILMS & ORIGINALS",
    description:
      "Short films, episodic stories and original worlds designed to hold attention and build an audience.",
  },
  {
    number: "04",
    title: "MUSIC VISUALS",
    description:
      "Performance films, visualisers and imaginative cinematic worlds for artists, labels and cultural projects.",
  },
  {
    number: "05",
    title: "ANIMATION & MOTION",
    description:
      "Character animation, motion design, explainers and stylised visual experiences.",
  },
  {
    number: "06",
    title: "HYBRID PRODUCTION",
    description:
      "Live action, animation, visual effects and generative AI combined inside one controlled production process.",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    name: "STRATEGY",
    detail:
      "We identify the audience, objective and single most important job the film must accomplish.",
  },
  {
    step: "02",
    name: "STORY & WORLDBUILDING",
    detail:
      "We develop the concept, script, storyboard, characters, visual language and rules of the world.",
  },
  {
    step: "03",
    name: "AI PRODUCTION",
    detail:
      "Our directors and AI artists create, control and refine every shot for quality and continuity.",
  },
  {
    step: "04",
    name: "FINISHING",
    detail:
      "Editing, sound, music, colour and motion bring everything together into a delivery-ready film.",
  },
];

const RESPONSIBLE_PILLARS = [
  {
    title: "HUMAN CREATIVE CONTROL",
    text: "Every frame and creative decision is steered by experienced directors, writers, and visual artists.",
  },
  {
    title: "CONSENT-CONSCIOUS PRODUCTION",
    text: "Ethical workflows, talent rights protection, and conscious cultural representation.",
  },
  {
    title: "BRAND AND IP CARE",
    text: "Strict data privacy, clean chain of title, and confidential handling of client assets.",
  },
  {
    title: "CLEAR CLIENT APPROVALS",
    text: "Transparent review gates from initial treatment and storyboard to final master delivery.",
  },
];

export default function HomePage() {
  // Enforce dark mode strictly on the Home page
  useEffect(() => {
    const previousTheme = document.documentElement.dataset.theme;
    document.documentElement.dataset.theme = "dark";

    return () => {
      const stored = localStorage.getItem("maxmark-theme");
      if (stored === "light" || stored === "dark") {
        document.documentElement.dataset.theme = stored;
      } else if (stored === "system" || !stored) {
        document.documentElement.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      } else if (previousTheme) {
        document.documentElement.dataset.theme = previousTheme;
      }
    };
  }, []);

  const scrollToWork = () => {
    const el = document.getElementById("selected-work");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={styles.page}>
      {/* =====================================================================
          1. HERO SECTION
          ===================================================================== */}
      <section className={styles.hero} aria-label="Maxmark Animations Hero">
        <div className={styles.heroMedia}>
          <MuxLoopPlayer
            playbackId="VCBESmjDlV4eRLTFzQ2j75KtN1XrKyV9sdwaAQXNv38"
            title="Maxmark Animations Showreel"
            className={styles.heroVideo}
          />
        </div>
        <div className={styles.heroScrim} />

        <div className={styles.heroContent}>
          <span className={styles.heroKicker}>
            AI-NATIVE FILM &amp; ANIMATION STUDIO // LAGOS / WORKING WORLDWIDE
          </span>

          <h1 className={styles.heroTitle}>
            AI FILMS THAT LOOK DIRECTED.
            <br />
            <span>NOT GENERATED.</span>
          </h1>

          <p className={styles.heroCopy}>
            Maxmark Animations creates commercials, brand films, narrative worlds and music
            visuals with cinematic craft, human direction and AI-native speed.
          </p>

          <div className={styles.heroActions}>
            <PillButton
              variant="solid"
              size="large"
              withArrow
              onClick={scrollToWork}
            >
              WATCH THE 15-SECOND FILMS
            </PillButton>
            <PillButton href="/booking" variant="glass" size="large" withArrow>
              START A PROJECT
            </PillButton>
          </div>

          <div className={styles.trustBar}>
            <span>HUMAN DIRECTED</span>
            <span>·</span>
            <span>AI ACCELERATED</span>
            <span>·</span>
            <span>RESPONSIBLY PRODUCED</span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. INTRODUCTION (PHILOSOPHY)
          ===================================================================== */}
      <section className={styles.introSection} aria-label="Studio Manifesto">
        <div className={styles.introGrid}>
          <div>
            <div className={styles.introEyebrow}>PHILOSOPHY</div>
            <h2 className={styles.introHeading}>
              AI IS THE TOOL.
              <br />
              DIRECTION IS THE DIFFERENCE.
            </h2>
          </div>

          <div className={styles.introCopy}>
            <p className={styles.introLead}>Anyone can generate a clip.</p>
            <p className={styles.introBody}>
              We develop the idea, shape the story, build a consistent visual world and
              direct every shot until it becomes a film people can believe, feel and remember.
            </p>
            <span className={styles.introOrigin}>
              Created from Lagos. Built for global screens.
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. SELECTED WORK (15-SECOND CONCEPT FILMS)
          ===================================================================== */}
      <section id="selected-work" className={styles.workSection} aria-label="Selected Concept Films">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>SELECTED WORK</div>
          <h2 className={styles.sectionTitle}>
            15 SECONDS. ONE CLEAR IDEA.
            <br />
            A WORLD YOU REMEMBER.
          </h2>
          <p className={styles.sectionSubtitle}>
            A collection of short AI concept films demonstrating our approach to commercial
            storytelling, visual worldbuilding, character continuity, motion and cinematic finishing.
          </p>
        </div>

        <div className={styles.filmsGrid}>
          {CONCEPT_FILMS.map((film) => (
            <Link key={film.id} href={film.href} className={styles.filmCard}>
              <div className={styles.filmMedia}>
                <MuxLoopPlayer
                  playbackId={film.muxPlaybackId}
                  title={film.title}
                  className={styles.filmVideo}
                />
                <span className={styles.filmBadge}>{film.badge}</span>
              </div>
              <div className={styles.filmContent}>
                <div>
                  <div className={styles.filmNumber}>{film.number} — CONCEPT</div>
                  <h3 className={styles.filmTitle}>{film.title}</h3>
                </div>
                <div className={styles.filmCategory}>{film.category}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.workFooterActions}>
          <PillButton href="/work" variant="solid" size="large" withArrow>
            WATCH ALL FILMS
          </PillButton>
          <PillButton href="/reels" variant="glass" size="large" withArrow>
            EXPLORE FULLSCREEN REELS
          </PillButton>
        </div>
      </section>

      {/* =====================================================================
          4. CAPABILITIES
          ===================================================================== */}
      <section id="capabilities" className={styles.capabilitiesSection} aria-label="Capabilities">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>CAPABILITIES</div>
          <h2 className={styles.sectionTitle}>
            ONE AI-NATIVE STUDIO.
            <br />
            EVERY SCREEN.
          </h2>
          <p className={styles.sectionSubtitle}>
            From one breakthrough commercial to an ongoing content system, we build the right
            production model around the idea.
          </p>
        </div>

        <div className={styles.capabilitiesGrid}>
          {CAPABILITIES.map((cap) => (
            <div key={cap.title} className={styles.capabilityCard}>
              <span className={styles.capabilityIndex}>{cap.number}</span>
              <h3 className={styles.capabilityTitle}>{cap.title}</h3>
              <p className={styles.capabilityText}>{cap.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          5. PROCESS ("NOT PROMPT AND HOPE")
          ===================================================================== */}
      <section id="process" className={styles.processSection} aria-label="Production Process">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>PROCESS</div>
          <h2 className={styles.sectionTitle}>NOT “PROMPT AND HOPE.”</h2>
          <p className={styles.sectionSubtitle}>
            A directed production process from the first idea to the final frame.
          </p>
        </div>

        <div className={styles.processGrid}>
          {PROCESS_STEPS.map((step) => (
            <div key={step.name} className={styles.processCard}>
              <span className={styles.processStep}>{step.step}</span>
              <h3 className={styles.processName}>{step.name}</h3>
              <p className={styles.processDetail}>{step.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          6. RESPONSIBLE AI
          ===================================================================== */}
      <section className={styles.responsibleSection} aria-label="Responsible AI Production">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>RESPONSIBLE AI</div>
          <h2 className={styles.sectionTitle}>
            BOLD IMAGINATION.
            <br />
            CLEAR ACCOUNTABILITY.
          </h2>
          <p className={styles.sectionSubtitle}>
            We believe the future of production should expand creativity without removing
            responsibility. Every Maxmark production retains human creative direction, client
            approvals, representation awareness and careful handling of brand materials, identities
            and intellectual property.
          </p>
        </div>

        <div className={styles.responsiblePillars}>
          {RESPONSIBLE_PILLARS.map((pillar) => (
            <div key={pillar.title} className={styles.pillarCard}>
              <strong>{pillar.title}</strong>
              <p>{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          7 & 8. ACADEMY & ABOUT TEASERS
          ===================================================================== */}
      <section className={styles.splitTeasers} aria-label="Academy and About">
        <div className={styles.teaserCol}>
          <div>
            <div className={styles.sectionEyebrow}>ACADEMY</div>
            <h3>LEARN THE NEW LANGUAGE OF PRODUCTION.</h3>
            <p>
              Maxmark Academy helps creators, marketing teams and organisations understand how to
              use AI for film, animation and visual storytelling without losing strategy, craft or
              human judgement.
            </p>
          </div>
          <div>
            <PillButton href="/academy" variant="solid" withArrow>
              EXPLORE THE ACADEMY
            </PillButton>
          </div>
        </div>

        <div className={styles.teaserCol}>
          <div>
            <div className={styles.sectionEyebrow}>ABOUT</div>
            <h3>MADE FROM LAGOS. READY FOR THE WORLD.</h3>
            <p>
              Maxmark Animations combines African cultural intelligence with global production
              standards. We understand the pace of today’s market—but we also know that speed
              means nothing without an idea worth watching.
            </p>
          </div>
          <div>
            <PillButton href="/about" variant="glass" withArrow>
              ABOUT THE STUDIO
            </PillButton>
          </div>
        </div>
      </section>

      {/* =====================================================================
          9. FINAL CTA
          ===================================================================== */}
      <section className={styles.finalCtaSection} aria-label="Start A Project">
        <div className={styles.finalCtaEyebrow}>START A PRODUCTION</div>
        <h2 className={styles.finalCtaTitle}>
          WHAT CAN YOUR NEXT
          <br />
          15 SECONDS MAKE PEOPLE FEEL?
        </h2>

        <p className={styles.finalCtaCopy}>
          Bring us the brief, product, story or idea that feels difficult to produce.
          <br />
          We will help you turn it into a world people will remember.
        </p>

        <div className={styles.finalCtaActions}>
          <PillButton href="/booking" variant="solid" size="large" withArrow>
            START A PROJECT
          </PillButton>
          <a href="mailto:info@maxmarkagency.com" className={styles.finalCtaEmail}>
            info@maxmarkagency.com ↗
          </a>
        </div>

        <div className={styles.finalCtaFoot}>
          LAGOS, NIGERIA · AVAILABLE WORLDWIDE
        </div>
      </section>
    </div>
  );
}
