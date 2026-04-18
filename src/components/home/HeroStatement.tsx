"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUpVariants, staggerContainer, EASE_OUT_EXPO } from "@/lib/motion";

export default function HeroStatement() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      ref={ref}
      className="flex items-end"
      style={{
        minHeight: "100dvh",
        paddingLeft: "clamp(24px, 3.33vw, 48px)",
        paddingRight: "clamp(24px, 3.33vw, 48px)",
        paddingTop: "calc(var(--nav-height) + 80px)",
        paddingBottom: "clamp(48px, 6vh, 96px)",
        maxWidth: "1440px",
        margin: "0 auto",
      }}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="w-full"
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: EASE_OUT_EXPO },
            },
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
          Maxmark Studio — Est. 2024
        </motion.p>
        <motion.h1
          variants={fadeUpVariants}
          style={{
            fontFamily: "var(--font-fraunces)",
            fontWeight: 500,
            fontSize: "clamp(48px, 8vw, 140px)",
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            color: "var(--fg-primary)",
            maxWidth: "1100px",
          }}
        >
          An AI-Native
          <br />
          Production Studio.
          <br />
          <span style={{ color: "var(--fg-muted)" }}>
            Cinematic Craft at
            <br />
            African Market Speed.
          </span>
        </motion.h1>
      </motion.div>
    </section>
  );
}
