import Link from "next/link";
import PillButton from "@/components/ui/PillButton";
import Logo from "@/components/layout/Logo";

export const metadata = {
  title: "404 — Scene Not Found | Maxmark Animations",
  description: "The requested route does not exist in the Maxmark Animations archive.",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-base)",
        color: "var(--fg-primary)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(24px, 4vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top Brand Mark */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Logo />
        <span
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "11px",
            color: "var(--accent-highlight)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          // Error State: 404
        </span>
      </header>

      {/* Main Error Presentation */}
      <main
        style={{
          maxWidth: "1100px",
          margin: "120px 0 80px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 16px",
              color: "var(--accent-highlight)",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            System Exception · 404 Route Missing
          </p>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-anton)",
              fontSize: "clamp(64px, 11vw, 160px)",
              lineHeight: 0.88,
              letterSpacing: "-0.035em",
              textTransform: "uppercase",
              color: "var(--fg-primary)",
            }}
          >
            Lost in the pipeline.
          </h1>
        </div>

        <p
          style={{
            margin: 0,
            maxWidth: "680px",
            color: "var(--fg-muted)",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "clamp(14px, 1.2vw, 18px)",
            lineHeight: 1.6,
          }}
        >
          The requested cut, scene, or masterclass could not be located in the Maxmark
          Animations production archive. It may have been moved, archived, or never rendered.
        </p>

        {/* Action Triggers */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            paddingTop: "16px",
          }}
        >
          <PillButton href="/" variant="solid" size="large" withArrow>
            Return to Home
          </PillButton>
          <PillButton href="/academy" variant="glass" size="large">
            The Academy →
          </PillButton>
          <PillButton href="/work" variant="glass" size="large">
            Explore Work ↗
          </PillButton>
        </div>
      </main>

      {/* Bottom Technical Metadata Bar */}
      <footer
        style={{
          borderTop: "1px solid var(--border-strong)",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          color: "var(--fg-subtle)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <div>STATUS: 404_NOT_FOUND // ORIGIN: CLIENT_ROUTER</div>
        <div>MAXMARK ANIMATIONS ARCHIVE SYSTEM</div>
      </footer>
    </div>
  );
}
