"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./Studio.module.css";

const defaultServices = [
  {
    number: "01",
    title: "Recording",
    eyebrow: "Vocals · Instruments · Production",
    copy: "A focused space for capturing the performance while the feeling is still fresh. Bring the idea, the stems, or the whole session.",
    image: "/studio/recording-room.png",
    alt: "Concept view of a recording control room and vocal booth",
  },
  {
    number: "02",
    title: "Rehearsals",
    eyebrow: "Artists · Bands · Live set prep",
    copy: "Run the set, rebuild the arrangement, and get every transition tight in a room made for concentrated work.",
    image: "/studio/rehearsal-room.png",
    alt: "Concept view of a rehearsal room prepared with drums, amplifiers, and microphones",
  },
  {
    number: "03",
    title: "Podcasts",
    eyebrow: "Interviews · Conversations · Content",
    copy: "A calm, production-ready setting for clear conversation—whether you are recording an episode, an interview, or a new format.",
    image: "/studio/podcast-room.png",
    alt: "Concept view of a two-person podcast recording setup",
  },
];

export default function StudioServices({ images }: { images?: { recording?: string; rehearsal?: string; podcast?: string } }) {
  const services = defaultServices.map((service, index) => ({ ...service, image: [images?.recording, images?.rehearsal, images?.podcast][index] || service.image }));
  return (
    <section className={styles.services} id="spaces">
      <div className={styles.servicesHeading}>
        <p>Book the room your idea needs.</p>
        <span>Three ways to use the studio</span>
      </div>

      {services.map((service) => (
        <motion.article
          className={styles.service}
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          key={service.number}
        >
          <div className={styles.serviceMedia}>
            <Image
              src={service.image}
              alt={service.alt}
              fill
              sizes="(max-width: 900px) 100vw, 58vw"
              className={styles.serviceImage}
            />
            <span className={styles.serviceNumber}>{service.number}</span>
          </div>

          <div className={styles.serviceCopy}>
            <p className={styles.serviceEyebrow}>{service.eyebrow}</p>
            <h2>{service.title}</h2>
            <p>{service.copy}</p>
            <Link href={service.title === "Recording" ? "/contact?inquiry=recording" : `/booking?service=${service.title.toLowerCase()}`}>
              Enquire about {service.title.toLowerCase()} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </motion.article>
      ))}
    </section>
  );
}
