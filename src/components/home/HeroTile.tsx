"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import MuxLoopPlayer from "@/components/video/MuxLoopPlayer";
import Eyebrow from "@/components/ui/Eyebrow";
import { fadeUpVariants, EASE_OUT_EXPO } from "@/lib/motion";
import type { Project, AspectRatio } from "@/types";

const aspectRatioMap: Record<AspectRatio, string> = {
  "4:3": "4/3",
  "16:9": "16/9",
  "1:1": "1/1",
};

interface HeroTileProps {
  project: Project;
  index: number;
}

export default function HeroTile({ project, index }: HeroTileProps) {
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
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        >
          {/* Video */}
          <MuxLoopPlayer
            playbackId={project.muxPlaybackId}
            title={project.title}
            className="absolute inset-0"
          />

          {/* Gradient overlay — always present, stronger on hover */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{
              background: hovered
                ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
                : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)",
            }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          />

          {/* Eyebrow — top left */}
          <div className="absolute left-4 top-4 z-10">
            <motion.div
              animate={{ opacity: hovered ? 1 : 0.7 }}
              transition={{ duration: 0.4 }}
            >
              <Eyebrow>{project.category}</Eyebrow>
            </motion.div>
          </div>

          {/* Title + CTA — bottom */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between p-4">
            <div>
              <motion.h2
                animate={{ opacity: hovered ? 1 : 0.7, y: hovered ? 0 : 4 }}
                transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontWeight: 500,
                  fontSize: "clamp(18px, 2.5vw, 36px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: "var(--fg-primary)",
                }}
              >
                {project.title}
              </motion.h2>
              {project.client && (
                <motion.p
                  animate={{ opacity: hovered ? 0.7 : 0.4 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "11px",
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

            {/* Watch arrow */}
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 8 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              className="flex items-center gap-2"
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "11px",
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
                className="h-4 w-4"
              >
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
