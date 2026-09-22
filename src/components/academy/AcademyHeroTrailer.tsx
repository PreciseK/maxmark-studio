import YouTubeDisguisedPlayer from "./YouTubeDisguisedPlayer";
import styles from "./Academy.module.css";

type AcademyHeroTrailerProps = {
  videoId?: string;
};

export default function AcademyHeroTrailer({
  videoId = "dQw4w9WgXcQ",
}: AcademyHeroTrailerProps) {
  return (
    <section className={styles.screeningSection}>
      <div className={styles.screeningHeader}>
        <div>
          <p className={styles.kicker}>Cinema Screening Room</p>
          <span className={styles.screeningMeta}>
            Maxmark Animations // AI Animation & Narrative Filmmaking Reel
          </span>
        </div>
        <span className={styles.screeningMeta} style={{ color: "var(--accent-highlight)" }}>
          HD 1080P · 60 FPS
        </span>
      </div>

      <div className={styles.screeningFrame}>
        <YouTubeDisguisedPlayer
          videoId={videoId}
          autoplay={false}
          muted={false}
          title="Maxmark Animations Academy Official Trailer"
          className="w-full h-full"
        />
      </div>
    </section>
  );
}
