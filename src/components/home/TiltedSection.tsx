"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const MAX_TILT_DEGREES = 12;
const EDGE_SCALE = 0.88;
const EDGE_OPACITY = 0.6;
const DEPTH_TRANSLATE = -200;
const PERSPECTIVE = 1200;

type TiltedSectionProps = {
  children: React.ReactNode;
};

export default function TiltedSection({ children }: TiltedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [MAX_TILT_DEGREES, 0, -MAX_TILT_DEGREES],
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [EDGE_SCALE, 1, EDGE_SCALE]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [EDGE_OPACITY, 1, EDGE_OPACITY]);
  const translateZ = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [DEPTH_TRANSLATE, 0, DEPTH_TRANSLATE],
  );

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className="relative h-full w-full">
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative h-full w-full"
      style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "center center" }}
    >
      <motion.div
        className="relative h-full w-full will-change-transform"
        style={{
          rotateX,
          scale,
          opacity,
          translateZ,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
