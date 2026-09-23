"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeroSpeed = "1s" | "2s" | "3s" | 1 | 2 | 3;

type HeroRevealProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  speed?: HeroSpeed;
  yOffset?: number;
  className?: string;
};

// Luxurious cinematic deceleration curve
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function resolveHeroDuration(duration?: number, speed?: HeroSpeed): number {
  if (duration !== undefined) return duration;
  if (speed === "1s" || speed === 1) return 1.2;
  if (speed === "3s" || speed === 3) return 3.0;
  return 2.0; // Default: 2.0s
}

export default function HeroReveal({
  children,
  delay = 0,
  duration,
  speed = "2s",
  yOffset = 32,
  className,
}: HeroRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const effectiveDuration = resolveHeroDuration(duration, speed);

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              transform: `translateY(${yOffset}px) scale(0.98)`,
            }
      }
      animate={
        shouldReduceMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              transform: "translateY(0px) scale(1)",
            }
      }
      transition={{
        duration: effectiveDuration,
        delay,
        ease: EASE_OUT,
      }}
    >
      {children}
    </motion.div>
  );
}
