import type { Metadata } from "next";
import BookingCalendar from "@/components/booking/BookingCalendar";
import { getBookingServices } from "@/lib/content";
import styles from "./booking.module.css";

export const metadata: Metadata = {
  title: "Book Us for Your Animation Video — Maxmark Animations",
  description:
    "Commission Maxmark Animations for your animated films, 3D brand commercials, music videos, and cinematic AI production pipelines.",
};

export default async function BookingPage() {
  const services = await getBookingServices();

  return (
    <div className={styles.page}>
      {/* 1. Hero Header */}
      <header className={styles.hero}>
        <p className={styles.heroKicker}>Maxmark Animations // Production Commissioning</p>
        <h1 className={styles.heroTitle}>Book us for your animation video.</h1>
        <div className={styles.heroTags}>
          <span className={styles.heroTagItem}>Narrative Films</span>
          <span className={styles.heroTagItem}>Brand Commercials</span>
          <span className={styles.heroTagItem}>Animated Music Videos</span>
          <span className={styles.heroTagItem}>Cinematic AI Pipelines</span>
          <span className={styles.heroTagItem}>Hybrid VFX & DaVinci Finishing</span>
        </div>
      </header>

      {/* 2. Main Booking Experience */}
      <main className={styles.mainContainer}>
        <div className={styles.intro}>
          <p className={styles.introCopy}>
            Reserve production timeline capacity with the Maxmark directing team. Select your animation
            discipline, choose a discovery session date, and share your project brief. We review every
            submission to ensure cinematic alignment and deliver a tailored production roadmap.
          </p>
          <span className={styles.introMeta}>Directorial Intake Active · Mon—Sat</span>
        </div>

        <BookingCalendar services={services} />
      </main>
    </div>
  );
}
