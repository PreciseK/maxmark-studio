"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";

type PillButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "glass" | "solid";
  withArrow?: boolean;
  className?: string;
  "aria-label"?: string;
};

export default function PillButton({
  children,
  href,
  onClick,
  variant = "glass",
  withArrow = false,
  className,
  "aria-label": ariaLabel,
}: PillButtonProps) {
  const [hovered, setHovered] = useState(false);

  const glassBase: React.CSSProperties = {
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    backgroundColor: hovered ? "var(--fg-primary)" : "rgba(8, 8, 8, 0.35)",
    border: "1px solid var(--border)",
    color: hovered ? "var(--bg-base)" : "var(--fg-primary)",
    transition: "background-color 300ms ease, color 300ms ease",
  };

  const solidBase: React.CSSProperties = {
    backgroundColor: hovered ? "rgba(220,220,215,1)" : "var(--fg-primary)",
    color: "var(--bg-base)",
    transition: "background-color 200ms ease",
  };

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "9999px",
    cursor: "pointer",
    userSelect: "none",
    textDecoration: "none",
    paddingTop: "12px",
    paddingBottom: "12px",
    paddingLeft: "20px",
    paddingRight: withArrow ? "6px" : "20px",
    gap: withArrow ? "12px" : undefined,
    ...(variant === "glass" ? glassBase : solidBase),
  };

  const textStyle: React.CSSProperties = {
    fontFamily: "var(--font-geist-mono)",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    whiteSpace: "nowrap",
  };

  const arrowCircleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    borderRadius: "9999px",
    backgroundColor: hovered
      ? variant === "glass"
        ? "rgba(10,10,10,0.15)"
        : "rgba(10,10,10,0.15)"
      : "rgba(245,245,240,0.12)",
    flexShrink: 0,
    transition: "background-color 300ms ease",
  };

  const arrowColor = hovered && variant === "glass" ? "var(--bg-base)" : "var(--fg-primary)";

  const inner = (
    <>
      <span style={textStyle}>{children}</span>
      {withArrow && (
        <span style={arrowCircleStyle}>
          <svg
            viewBox="0 0 12 12"
            fill="none"
            width="12"
            height="12"
            stroke={arrowColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6h8M6 2l4 4-4 4" />
          </svg>
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        style={containerStyle}
        className={cn(className)}
        aria-label={ariaLabel}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      style={containerStyle}
      className={cn(className)}
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </button>
  );
}
