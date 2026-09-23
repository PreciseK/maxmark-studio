"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type HeroRevealProps = {
  children: ReactNode;
  delay?: number;
  yOffset?: number;
  className?: string;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export default function HeroReveal({
  children,
  delay = 0,
  yOffset = 20,
  className,
}: HeroRevealProps) {
  const shouldReduceMotion = useReducedMotion();

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
        duration: 0.5,
        delay,
        ease: EASE_OUT,
      }}
    >
      {children}
    </motion.div>
  );
}
