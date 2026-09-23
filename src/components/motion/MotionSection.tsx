"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MotionSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  threshold?: number;
  yOffset?: number;
  tag?: "section" | "div" | "article";
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export default function MotionSection({
  children,
  className,
  id,
  delay = 0,
  yOffset = 28,
  tag = "section",
}: MotionSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const Component = tag === "div" ? motion.div : tag === "article" ? motion.article : motion.section;

  // Emil Kowalski rule: Never animate from scale(0). Start from scale(0.98) with opacity: 0.
  // Hardware accelerated using full transform string.
  return (
    <Component
      id={id}
      className={cn("will-change-transform", className)}
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              transform: `translateY(${yOffset}px) scale(0.98)`,
            }
      }
      whileInView={
        shouldReduceMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              transform: "translateY(0px) scale(1)",
            }
      }
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay,
        ease: EASE_OUT,
      }}
    >
      {children}
    </Component>
  );
}
