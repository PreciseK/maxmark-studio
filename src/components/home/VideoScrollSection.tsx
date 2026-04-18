"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import MuxLoopPlayer from "@/components/video/MuxLoopPlayer";
import Eyebrow from "@/components/ui/Eyebrow";
import { fadeUpVariants, EASE_OUT_EXPO } from "@/lib/motion";
import type { Project } from "@/types";

interface VideoScrollSectionProps {
  project: Project;
  index: number;
}

export default function VideoScrollSection({ project, index }: VideoScrollSectionProps) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      style={{
        position: "sticky",
        top: 0,
        height: "100dvh",
        overflow: "hidden",
        zIndex: index + 1,
      }}
    >
      <Link
        href={`/work/${project.slug}`}
        className="block h-full w-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Full-bleed video */}
        <MuxLoopPlayer
          playbackId={project.muxPlaybackId}
          title={project.title}
          className="absolute inset-0"
        />

        {/* Gradient overlay — bottom-to-top, intensifies on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={{
            background: hovered
              ? "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.1) 100%)"
              : "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.05) 100%)",
          }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        />

        {/* Top-left: eyebrow */}
        <div
          className="absolute left-0 top-0 z-10"
          style={{
            paddingLeft: "clamp(24px, 3.33vw, 48px)",
            paddingTop: "calc(var(--nav-height) + 24px)",
          }}
        >
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <Eyebrow>{project.category}</Eyebrow>
          </motion.div>
        </div>

        {/* Bottom: title left, CTA right */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between"
          style={{
            paddingLeft: "clamp(24px, 3.33vw, 48px)",
            paddingRight: "clamp(24px, 3.33vw, 48px)",
            paddingBottom: "clamp(40px, 5vh, 72px)",
          }}
        >
          {/* Title + client */}
          <div>
            <motion.h2
              variants={fadeUpVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              style={{
                fontFamily: "var(--font-fraunces)",
                fontWeight: 500,
                fontSize: "clamp(36px, 6vw, 96px)",
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: "var(--fg-primary)",
              }}
            >
              {project.title}
            </motion.h2>
            {project.client && (
              <motion.p
                variants={fadeUpVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--fg-muted)",
                  marginTop: "10px",
                }}
              >
                {project.client} — {project.year}
              </motion.p>
            )}
          </div>

          {/* Watch CTA — fades in on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 12 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="flex shrink-0 items-center gap-3 pb-1"
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--fg-primary)",
            }}
          >
            Watch Project
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </motion.div>
        </div>
      </Link>
    </section>
  );
}
