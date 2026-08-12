import type { Metadata } from "next";
import Link from "next/link";
import WorkShowcase from "@/components/work/WorkShowcase";
import { getPublishedProjects } from "@/lib/content";
import styles from "@/components/work/WorkShowcase.module.css";

export const metadata: Metadata = {
  title: "Work — Maxmark Studio",
  description: "AI-native brand films, narratives, and music visuals created by Maxmark Studio.",
};

const partnerMarks = [
  "ADIDAS",
  "NETFLIX",
  "BURNA BOY",
  "JOHNNIE WALKER",
  "AYRA STARR",
  "MAXMARK ORIGINALS",
];

export default async function WorkPage() {
  const projects = await getPublishedProjects();
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Selected projects · 2024—2026</p>
          <h1 className={styles.heroTitle}>Work</h1>
          <p className={styles.heroDescription}>
            We create AI-native films, brand worlds, and music visuals for ambitious brands and
            artists—combining cinematic craft with production built for the speed of African
            culture.
          </p>
        </div>

        <div className={styles.partnerRail} aria-label="Selected clients and collaborators">
          <div className={styles.partnerTrack}>
            {[0, 1].map((group) => (
              <div className={styles.partnerGroup} key={group} aria-hidden={group === 1}>
                {partnerMarks.map((partner) => (
                  <span className={styles.partnerMark} key={`${group}-${partner}`}>
                    {partner}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </header>

      <WorkShowcase projects={projects} />

      <Link href="/studio" className={styles.continueLink}>
        <span className={styles.continueLabel}>Continue to</span>
        <span className={styles.continueTitle}>Studio</span>
        <span className={styles.continueArrow} aria-hidden="true">
          ↗
        </span>
      </Link>
    </div>
  );
}
