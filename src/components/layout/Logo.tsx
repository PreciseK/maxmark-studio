import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="Maxmark Studio — Home"
      style={{
        position: "fixed",
        top: "24px",
        left: "24px",
        zIndex: 50,
        display: "block",
        lineHeight: 0.85,
        textDecoration: "none",
      }}
    >
      <span
        style={{
          display: "block",
          fontFamily: "var(--font-anton)",
          fontSize: "15px",
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          color: "var(--fg-primary)",
          lineHeight: 0.85,
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
