import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Maxmark Studio — Home"
      className="fixed top-5 left-5 z-50 block lg:top-7 lg:left-12"
      style={{ lineHeight: 0.78, textDecoration: "none", mixBlendMode: "difference" }}
    >
      <span
        style={{
          display: "block",
          fontFamily: "var(--font-anton)",
          fontSize: "clamp(22px, 1.9vw, 27px)",
          textTransform: "uppercase",
          letterSpacing: "-0.045em",
          // White is intentional: difference blending turns it dark on light
          // surfaces and light on dark/media surfaces.
          color: "#fff",
          lineHeight: 0.78,
          userSelect: "none",
        }}
      >
        Maxmark
        <br />
        Studio
      </span>
    </Link>
  );
}
