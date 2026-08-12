import type { Metadata } from "next";
import Link from "next/link";
import StudioHero from "@/components/studio/StudioHero";
import StudioServices from "@/components/studio/StudioServices";
import styles from "@/components/studio/Studio.module.css";
import { getSitePage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Studio Bookings — Maxmark Studio",
  description:
    "Book Maxmark Studio for recording sessions, rehearsals, podcasts, and creative production.",
};

const bookingSteps = [
  {
    number: "01",
    title: "Tell us what you’re making",
    copy: "Share the session type, your preferred date, and what you need in the room.",
  },
  {
    number: "02",
    title: "Shape the session",
    copy: "We’ll confirm availability and recommend the right setup for your time with us.",
  },
  {
    number: "03",
    title: "Make it happen",
    copy: "Arrive ready to record, rehearse, or have the conversation. We’ll handle the room.",
  },
];

export default async function StudioPage() {
  const content = await getSitePage("studio", {
    heroTitle: "Built for sound.",
    heroCopy: "A physical studio for recording, rehearsals, podcasts, and the moments between the idea and the take.",
    heroImageUrl: "/studio/recording-room.png",
    recordingImageUrl: "/studio/recording-room.png",
    rehearsalImageUrl: "/studio/rehearsal-room.png",
    podcastImageUrl: "/studio/podcast-room.png",
  });
  return (
    <div className={styles.page}>
      <StudioHero title={content.heroTitle} copy={content.heroCopy} image={content.heroImageUrl} spaces={[
        { title: "Recording", eyebrow: "Vocals · Instruments · Production", copy: "A focused control room and booth for capturing performances while the feeling is still fresh.", image: content.recordingImageUrl },
        { title: "Rehearsals", eyebrow: "Artists · Bands · Live set prep", copy: "A flexible room for running the set, rebuilding arrangements, and tightening every transition.", image: content.rehearsalImageUrl },
        { title: "Podcasts", eyebrow: "Interviews · Conversations · Content", copy: "A calm, production-ready setup for clear conversation and multi-camera podcast recording.", image: content.podcastImageUrl },
      ]} />

      <section className={styles.statement}>
        <p className={styles.eyebrow}>A physical home for the work</p>
        <h2>A room changes the way the work feels.</h2>
        <div className={styles.statementCopy}>
          <p>
            Maxmark Studio is a bookable creative space for artists, bands, producers, hosts,
            and teams who need a focused place to make something worth hearing.
          </p>
          <p>
            From the first run-through to the final take, the space is designed to keep the
            technology quiet and the ideas moving.
          </p>
        </div>
      </section>

      <StudioServices images={{ recording: content.recordingImageUrl, rehearsal: content.rehearsalImageUrl, podcast: content.podcastImageUrl }} />

      <section className={styles.promiseSection}>
        <div className={styles.promiseHeader}>
          <p className={styles.eyebrow}>Built around your session</p>
          <h2>Come with the plan. Leave with progress.</h2>
        </div>
        <div className={styles.promiseList}>
          {[
            ["01", "A focused room", "A calm, treated environment that keeps the session on the work."],
            ["02", "Flexible setups", "The space can be arranged around recording, rehearsal, or conversation."],
            ["03", "Creative support", "Tell us what you need and we’ll shape the booking around the session."],
          ].map(([number, title, copy]) => (
            <article className={styles.promiseItem} key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <div className={styles.typeMarquee} aria-hidden="true">
        <div>
          Record · Rehearse · Talk · Create · Record · Rehearse · Talk · Create ·
        </div>
      </div>

      <section className={styles.bookingSection} id="booking">
        <div className={styles.bookingIntro}>
          <p className={styles.eyebrow}>How booking works</p>
          <h2>Simple from first message to first take.</h2>
          <p className={styles.bookingNote}>
            Every session is different. Send the essentials and we’ll reply with availability,
            location details, and a tailored quote.
          </p>
        </div>

        <div className={styles.bookingSteps}>
          {bookingSteps.map((step) => (
            <article className={styles.bookingStep} key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <Link
        className={styles.bookingCta}
        href="/booking"
      >
        <span className={styles.bookingCtaLabel}>Recording · Rehearsals · Podcasts</span>
        <span className={styles.bookingCtaTitle}>Book the studio</span>
        <span className={styles.bookingCtaArrow} aria-hidden="true">
          ↗
        </span>
      </Link>
    </div>
  );
}
