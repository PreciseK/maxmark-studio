/**
 * Sprint 2 integration target for full-length project films.
 *
 * Implementation notes for Sprint 2:
 * - Use youtube-nocookie.com domain for privacy-enhanced embed
 * - Wrap in a responsive 16:9 aspect-ratio container
 * - Add loading="lazy" on the iframe
 * - Provide a custom poster frame fallback that renders before the iframe loads
 * - Enable JS API: enablejsapi=1 for programmatic control
 */

interface YouTubeEmbedProps {
  youtubeId: string;
  title?: string;
}

export default function YouTubeEmbed({ youtubeId, title }: YouTubeEmbedProps) {
  void youtubeId;
  void title;

  return (
    <div
      style={{
        aspectRatio: "16/9",
        backgroundColor: "var(--bg-elevated)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--fg-subtle)",
        }}
      >
        YouTube embed — Sprint 2
      </p>
    </div>
  );
}
