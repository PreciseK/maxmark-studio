export default function StudioPage() {
  return (
    <section
      className="flex min-h-screen flex-col items-center justify-center"
      style={{ paddingTop: "var(--nav-height)" }}
    >
      <h1
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "clamp(48px, 8vw, 120px)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 0.95,
          color: "var(--fg-primary)",
          textAlign: "center",
        }}
      >
        Studio
      </h1>
      <p
        className="mt-6"
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--fg-muted)",
        }}
      >
        In production.
      </p>
    </section>
  );
}
