"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

const MAX_ROTATION_DEGREES = 7;
const EDGE_SCALE = 1.3;
const EDGE_OFFSET = 180;

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

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [MAX_ROTATION_DEGREES, 0, -MAX_ROTATION_DEGREES],
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [EDGE_SCALE, 1, EDGE_SCALE]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [-EDGE_OFFSET, 0, EDGE_OFFSET]);

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className="relative h-full w-full">
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-full w-full">
      <motion.div
        className="relative h-full w-full will-change-transform"
        style={{
          rotate,
          scale,
          y,
          transformOrigin: "center center",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
