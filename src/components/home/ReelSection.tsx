"use client";

import { motion } from "framer-motion";
import MuxLoopPlayer from "@/components/video/MuxLoopPlayer";
import PillButton from "@/components/ui/PillButton";
import TiltedSection from "@/components/home/TiltedSection";
import { fadeUpVariants, staggerContainer, EASE_OUT_EXPO } from "@/lib/motion";
import type { ReelSectionData } from "@/content/reel-sections";

type ReelSectionProps = ReelSectionData & {
  index: number;
  isActive: boolean;
};

export default function ReelSection({
  muxPlaybackId,
  variant,
  eyebrow,
  title,
  strapline,
  primaryCta,
  secondaryCta,
  index,
  isActive,
}: ReelSectionProps) {
  return (
    <TiltedSection>
      {/* Full-bleed video */}
      <MuxLoopPlayer
        playbackId={muxPlaybackId}
        title={title}
        className="absolute inset-0"
        paused={!isActive}
      />

      {/* Base overlay — uniform dark tint */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
      />

      {/* Bottom scrim — stronger gradient for text legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)",
        }}
      />

      {variant === "studio" ? (
        <StudioOverlay
          eyebrow={eyebrow}
          title={title}
          strapline={strapline}
          primaryCta={primaryCta}
          index={index}
          isActive={isActive}
        />
      ) : (
        <ProjectOverlay
          eyebrow={eyebrow}
          title={title}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
          index={index}
          isActive={isActive}
        />
      )}
    </TiltedSection>
  );
}

/* ── Studio variant — centred layout ──────────────────────────────── */

function StudioOverlay({
  eyebrow,
  title,
  strapline,
  primaryCta,
  isActive,
}: {
  eyebrow: string;
  title: string;
  strapline?: string;
  primaryCta: { label: string; href: string };
  index: number;
  isActive: boolean;
}) {
  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
      variants={staggerContainer}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
    >
      {/* Eyebrow */}
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
        }}
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--fg-muted)",
          marginBottom: "24px",
        }}
      >
        {eyebrow}
      </motion.p>

      {/* Headline */}
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
        {title}
      </motion.h1>

      {/* Strapline */}
      {strapline && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.08 },
            },
          }}
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "18px",
            lineHeight: 1.6,
            color: "rgba(245,245,240,0.72)",
            maxWidth: "560px",
            marginTop: "28px",
          }}
        >
          {strapline}
        </motion.p>
      )}

      {/* CTA */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.16 },
          },
        }}
        style={{ marginTop: "40px" }}
      >
        <PillButton href={primaryCta.href} variant="glass" withArrow>
          {primaryCta.label}
        </PillButton>
      </motion.div>
    </motion.div>
  );
}

/* ── Project variant — bottom-left layout ─────────────────────────── */

function ProjectOverlay({
  eyebrow,
  title,
  primaryCta,
  secondaryCta,
  isActive,
}: {
  eyebrow: string;
  title: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  index: number;
  isActive: boolean;
}) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 z-10"
      style={{
        padding: "clamp(32px, 5vw, 80px)",
        maxWidth: "1200px",
      }}
      variants={staggerContainer}
      initial="hidden"
      animate={isActive ? "visible" : "hidden"}
    >
      {/* Eyebrow — Fraunces italic for editorial feel */}
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
        }}
        style={{
          fontFamily: "var(--font-fraunces)",
          fontStyle: "italic",
          fontSize: "20px",
          color: "rgba(245,245,240,0.85)",
          marginBottom: "12px",
        }}
      >
        {eyebrow}
      </motion.p>

      {/* Project title */}
      <motion.h2
        variants={fadeUpVariants}
        style={{
          fontFamily: "var(--font-anton)",
          fontWeight: 400,
          fontSize: "clamp(72px, 10vw, 180px)",
          lineHeight: 0.9,
          letterSpacing: "-0.01em",
          textTransform: "uppercase",
          color: "var(--fg-primary)",
        }}
      >
        {title}
      </motion.h2>

      {/* CTA row */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 },
          },
        }}
        style={{ display: "flex", gap: "12px", marginTop: "32px", flexWrap: "wrap" }}
      >
        <PillButton href={primaryCta.href} variant="glass" withArrow>
          {primaryCta.label}
        </PillButton>
        {secondaryCta && (
          <PillButton href={secondaryCta.href} variant="glass">
            {secondaryCta.label}
          </PillButton>
        )}
      </motion.div>
    </motion.div>
  );
}
