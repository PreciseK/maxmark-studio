"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const TRIANGLE_DURATION = 0.7;
const TRIANGLE_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const TRIANGLE_FEATHER_PERCENT = 80;

type Props = {
  children: React.ReactNode;
  isActive: boolean;
  direction?: "up" | "down";
};

export default function TriangleRevealMask({ children, isActive, direction = "up" }: Props) {
  const prefersReducedMotion = useReducedMotion();

  // Once revealed, stay revealed — never animate the outgoing section back to collapsed
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (isActive && !revealed) setRevealed(true);
  }, [isActive, revealed]);

  const expandedPath =
    direction === "up"
      ? "polygon(-20% 120%, 50% -50%, 120% 120%)"
      : "polygon(-20% -20%, 50% 150%, 120% -20%)";
  const collapsedPath = "polygon(50% 50%, 50% 50%, 50% 50%)";

  if (prefersReducedMotion) {
    return (
      <motion.div
        className="absolute inset-0 h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 h-full w-full"
      initial={{ clipPath: collapsedPath }}
      animate={{ clipPath: revealed ? expandedPath : collapsedPath }}
      transition={{ duration: TRIANGLE_DURATION, ease: TRIANGLE_EASE }}
      style={{
        WebkitMaskImage: `radial-gradient(circle at center, black ${TRIANGLE_FEATHER_PERCENT}%, transparent 100%)`,
        maskImage: `radial-gradient(circle at center, black ${TRIANGLE_FEATHER_PERCENT}%, transparent 100%)`,
      }}
    >
      {children}
    </motion.div>
  );
}
