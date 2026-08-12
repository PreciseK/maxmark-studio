"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import styles from "./Studio.module.css";
import StudioSpacesModal, { type StudioSpace } from "./StudioSpacesModal";

export default function StudioHero({ title = "Built for sound.", copy = "A physical studio for recording, rehearsals, podcasts, and the moments between the idea and the take.", image = "/studio/recording-room.png", spaces }: { title?: string; copy?: string; image?: string; spaces: StudioSpace[] }) {
  const [spacesOpen, setSpacesOpen] = useState(false);
  const closeSpaces = useCallback(() => setSpacesOpen(false), []);
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -64]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <section className={styles.hero} ref={heroRef}>
      <motion.div
        className={styles.heroMedia}
        style={reduceMotion ? undefined : { y: imageY, scale: imageScale }}
      >
        <Image
          src={image}
          alt="Concept view of a dark recording room with a mixing console and vocal booth"
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
      </motion.div>
      <div className={styles.heroScrim} />

      <motion.div
        className={styles.heroContent}
        initial={reduceMotion ? false : { opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
        style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <p className={styles.heroKicker}>Maxmark Studio · Bookings open</p>
        <h1>{title}</h1>
        <p className={styles.heroCopy}>
          {copy}
        </p>
        <div className={styles.heroActions}>
          <button type="button" className={styles.primaryAction} onClick={() => setSpacesOpen(true)}>
            Explore the spaces <span aria-hidden="true">↓</span>
          </button>
          <Link
            href="/booking"
            className={styles.secondaryAction}
          >
            Book a session
          </Link>
        </div>
      </motion.div>

      <div className={styles.heroFoot}>
        <span>Recording · Rehearsal · Podcast</span>
        <span>Scroll to explore</span>
      </div>
      <StudioSpacesModal open={spacesOpen} onClose={closeSpaces} spaces={spaces} />
    </section>
  );
}
