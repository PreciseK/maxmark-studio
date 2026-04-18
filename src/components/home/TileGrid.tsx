"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import MuxLoopPlayer from "@/components/video/MuxLoopPlayer";
import Eyebrow from "@/components/ui/Eyebrow";
import { projects } from "@/content/projects";
import { fadeUpVariants, staggerContainer, EASE_OUT_EXPO } from "@/lib/motion";
import type { Project, AspectRatio } from "@/types";

const aspectRatioMap: Record<AspectRatio, string> = {
  "4:3": "4/3",
  "16:9": "16/9",
  "1:1": "1/1",
};

function Tile({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <motion.div
      ref={ref}
      variants={fadeUpVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ delay: index * 0.08 }}
    >
      <Link href={`/work/${project.slug}`} className="block">
        <motion.div
          className="relative overflow-hidden"
          style={{
            aspectRatio: aspectRatioMap[project.aspectRatio],
            backgroundColor: "var(--bg-elevated)",
          }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.015 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          <MuxLoopPlayer
            playbackId={project.muxPlaybackId}
            title={project.title}
            className="absolute inset-0"
          />

          {/* Gradient overlay */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              background: hovered
                ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
                : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)",
            }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          />

          {/* Eyebrow top-left */}
          <div className="absolute left-4 top-4 z-10">
            <motion.div animate={{ opacity: hovered ? 1 : 0.7 }} transition={{ duration: 0.4 }}>
              <Eyebrow>{project.category}</Eyebrow>
            </motion.div>
          </div>

          {/* Title + CTA bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between p-4">
            <div>
              <motion.h3
                animate={{ opacity: hovered ? 1 : 0.8, y: hovered ? 0 : 4 }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontWeight: 500,
                  fontSize: "clamp(16px, 2.2vw, 32px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "var(--fg-primary)",
                }}
              >
                {project.title}
              </motion.h3>
              {project.client && (
                <motion.p
                  animate={{ opacity: hovered ? 0.7 : 0.4 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--fg-muted)",
                    marginTop: "4px",
                  }}
                >
                  {project.client}
                </motion.p>
              )}
            </div>

            <motion.div
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 8 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="flex items-center gap-1.5"
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--fg-primary)",
              }}
            >
              Watch
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function TileGrid() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-15%" });

  const large = projects.filter((p) => p.gridSize === "large");
  const medium = projects.filter((p) => p.gridSize === "medium");
  const small = projects.filter((p) => p.gridSize === "small");

  return (
    <section id="featured-work">
      {/* Section header */}
      <motion.div
        ref={headerRef}
        variants={staggerContainer}
        initial="hidden"
        animate={headerInView ? "visible" : "hidden"}
        style={{
          paddingTop: "120px",
          paddingLeft: "clamp(24px, 3.33vw, 48px)",
          paddingRight: "clamp(24px, 3.33vw, 48px)",
          paddingBottom: "48px",
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        <motion.div variants={fadeUpVariants}>
          <Eyebrow>Featured Work</Eyebrow>
        </motion.div>
        <motion.h2
          variants={fadeUpVariants}
          style={{
            fontFamily: "var(--font-fraunces)",
            fontWeight: 500,
            fontSize: "clamp(32px, 4vw, 64px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: "var(--fg-primary)",
            marginTop: "16px",
          }}
        >
          Recent Work
        </motion.h2>
      </motion.div>

      {/* Grid */}
      <div
        style={{
          paddingLeft: "clamp(24px, 3.33vw, 48px)",
          paddingRight: "clamp(24px, 3.33vw, 48px)",
          paddingBottom: "160px",
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        {/* Row 1: large tiles (7fr + 5fr) */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "7fr 5fr", marginBottom: "16px" }}
        >
          {large[0] && <Tile project={large[0]} index={0} />}
          {large[1] && <Tile project={large[1]} index={1} />}
        </div>

        {/* Row 2: medium tiles (5fr + 7fr reversed) */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "5fr 7fr", marginBottom: "16px" }}
        >
          {medium[0] && <Tile project={medium[0]} index={2} />}
          {medium[1] && <Tile project={medium[1]} index={3} />}
        </div>

        {/* Row 3: small tiles */}
        <div className="grid grid-cols-2 gap-4">
          {small[0] && <Tile project={small[0]} index={4} />}
          {small[1] && <Tile project={small[1]} index={5} />}
        </div>
      </div>
    </section>
  );
}
