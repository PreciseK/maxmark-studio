"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MuxLoopPlayer from "@/components/video/MuxLoopPlayer";
import VerticalThumbnailRail from "@/components/home/VerticalThumbnailRail";
import PillButton from "@/components/ui/PillButton";
import { projects } from "@/content/projects";
import { fadeUpVariants, staggerContainer, EASE_OUT_EXPO } from "@/lib/motion";

export default function VideoHero() {
  const [activeId, setActiveId] = useState(projects[0].slug);
  const activeProject = projects.find((p) => p.slug === activeId) ?? projects[0];

  return (
    <section
      style={{
        position: "relative",
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      {/* Full-bleed background video */}
      <MuxLoopPlayer
        playbackId={activeProject.muxPlaybackId}
        title={activeProject.title}
        className="absolute inset-0"
      />

      {/* 20% dark overlay for legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      />

      {/* Vertical thumbnail rail — left edge, vertically centred */}
      <VerticalThumbnailRail
        projects={projects}
        activeId={activeId}
        onSelect={setActiveId}
        className="absolute left-6 top-1/2 z-10 -translate-y-1/2"
      />

      {/* Centred overlay content */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Display headline */}
        <motion.h1
          variants={fadeUpVariants}
          style={{
            fontFamily: "var(--font-anton)",
            fontWeight: 400,
            fontSize: "clamp(48px, 8vw, 144px)",
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "var(--fg-primary)",
            maxWidth: "1400px",
          }}
        >
          An AI-Native
          <br />
          Production Studio
        </motion.h1>

        {/* Strapline */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 },
            },
          }}
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "16px",
            lineHeight: 1.6,
            color: "rgba(245,245,240,0.75)",
            maxWidth: "580px",
            marginTop: "28px",
          }}
        >
          Maxmark Studio creates brand films, narratives, and music visuals
          with cinematic craft — at African market speed.
        </motion.p>

        {/* Watch Showreel CTA */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.2 },
            },
          }}
          style={{ marginTop: "40px" }}
        >
          <PillButton href="#featured-work" variant="glass" withArrow>
            Watch Showreel
          </PillButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
