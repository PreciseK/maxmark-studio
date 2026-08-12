"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MuxLoopPlayer from "@/components/video/MuxLoopPlayer";
import PillButton from "@/components/ui/PillButton";
import TiltedSection from "@/components/home/TiltedSection";
import { fadeUpVariants, staggerContainer, EASE_OUT_EXPO } from "@/lib/motion";
import type { ReelSectionData } from "@/content/reel-sections";

type ReelSectionProps = ReelSectionData & {
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
  isActive,
}: ReelSectionProps) {
  return (
    <TiltedSection>
      <MuxLoopPlayer
        playbackId={muxPlaybackId}
        title={title}
        className="absolute inset-0"
        paused={!isActive}
      />

      <div className="reel-media-scrim pointer-events-none absolute inset-0" />

      {variant === "studio" ? (
        <StudioOverlay title={title} strapline={strapline} primaryCta={primaryCta} />
      ) : (
        <ProjectOverlay
          eyebrow={eyebrow}
          title={title}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
        />
      )}
    </TiltedSection>
  );
}

function StudioOverlay({
  title,
  strapline,
  primaryCta,
}: {
  title: string;
  strapline?: string;
  primaryCta: { label: string; href: string };
}) {
  return (
    <motion.div
      className="reel-overlay reel-overlay--studio"
      variants={staggerContainer}
      initial={false}
      animate="visible"
    >
      <motion.h1 variants={fadeUpVariants} className="reel-studio-title">
        {title}
      </motion.h1>

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
          className="reel-studio-strapline"
        >
          {strapline}
        </motion.p>
      )}

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.16 },
          },
        }}
        className="reel-studio-cta"
      >
        <PillButton href={primaryCta.href} variant="glass" size="large" withArrow>
          {primaryCta.label}
        </PillButton>
      </motion.div>
    </motion.div>
  );
}

function ProjectOverlay({
  eyebrow,
  title,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <motion.div
      className="reel-overlay reel-overlay--project"
      variants={staggerContainer}
      initial={false}
      animate="visible"
    >
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
        }}
        className="reel-project-eyebrow"
      >
        {eyebrow}
      </motion.p>

      <motion.h2 variants={fadeUpVariants} className="reel-project-title">
        {title}
      </motion.h2>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 },
          },
        }}
        className="reel-project-actions"
      >
        <PillButton href={primaryCta.href} variant="glass" size="large" withArrow>
          {primaryCta.label}
        </PillButton>
        {secondaryCta && (
          <Link href={secondaryCta.href} className="reel-secondary-link">
            <span>{secondaryCta.label}</span>
            <span className="reel-secondary-link-icon" aria-hidden="true">
              ›
            </span>
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}
