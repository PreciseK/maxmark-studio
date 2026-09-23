"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ItemSpeed = "1s" | "2s" | "3s" | 1 | 2 | 3;

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayStart?: number;
};

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  yOffset?: number;
  duration?: number;
  speed?: ItemSpeed;
};

// Luxurious cinematic deceleration curve
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function resolveItemDuration(duration?: number, speed?: ItemSpeed): number {
  if (duration !== undefined) return duration;
  if (speed === "1s" || speed === 1) return 1.2;
  if (speed === "3s" || speed === 3) return 2.8;
  return 1.8; // Default for card items: 1.8s
}

export function StaggerGroup({
  children,
  className,
  staggerDelay = 0.22,
  delayStart = 0.1,
}: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: shouldReduceMotion ? 0 : delayStart,
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  yOffset = 32,
  duration,
  speed = "2s",
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const effectiveDuration = resolveItemDuration(duration, speed);

  const itemVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          transform: `translateY(${yOffset}px) scale(0.97)`,
        },
    visible: shouldReduceMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          transform: "translateY(0px) scale(1)",
          transition: {
            duration: effectiveDuration,
            ease: EASE_OUT,
          },
        },
  };

  return (
    <motion.div className={cn("will-change-transform", className)} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
