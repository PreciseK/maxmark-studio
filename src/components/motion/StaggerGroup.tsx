"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/cn";

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
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function StaggerGroup({
  children,
  className,
  staggerDelay = 0.06,
  delayStart = 0.05,
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
      viewport={{ once: true, margin: "-60px" }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, yOffset = 22 }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

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
            duration: 0.45,
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
