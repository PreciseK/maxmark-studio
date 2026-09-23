"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";

type PillButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "glass" | "solid" | "clay";
  size?: "default" | "large";
  withArrow?: boolean;
  className?: string;
  "aria-label"?: string;
  target?: string;
  rel?: string;
};

const LIQUID_GLASS_TRANSITION =
  "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), background-color 250ms cubic-bezier(0.22, 1, 0.36, 1), border-color 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms cubic-bezier(0.22, 1, 0.36, 1)";

export default function PillButton({
  children,
  href,
  onClick,
  variant: _variant,
  size = "default",
  withArrow = false,
  className,
  "aria-label": ariaLabel,
  target,
  rel,
}: PillButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Pure transparent normal standard liquid glass material (no solid, no tint)
  const glassStyle: React.CSSProperties = {
    backdropFilter: "var(--glass-blur)",
    WebkitBackdropFilter: "var(--glass-blur)",
    backgroundColor: hovered ? "var(--glass-bg-hover)" : "var(--glass-bg)",
    border: `1px solid ${hovered ? "var(--glass-border-hover)" : "var(--glass-border)"}`,
    color: "var(--fg-primary)",
    boxShadow: hovered
      ? "inset 0 1px 0 var(--glass-highlight-hover), inset 0 -8px 18px rgba(0, 0, 0, 0.10), 0 16px 36px -10px rgba(0, 0, 0, 0.60)"
      : "inset 0 1px 0 var(--glass-highlight), inset 0 -8px 18px rgba(0, 0, 0, 0.12), 0 12px 30px -12px rgba(0, 0, 0, 0.45)",
    transform: pressed
      ? "scale(0.97)"
      : hovered
        ? "scale(1.015) translateY(-1px)"
        : "scale(1) translateY(0px)",
    transition: LIQUID_GLASS_TRANSITION,
  };

  const containerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "9999px",
    cursor: "pointer",
    userSelect: "none",
    textDecoration: "none",
    minHeight: size === "large" ? "64px" : "54px",
    paddingTop: size === "large" ? "16px" : "12px",
    paddingBottom: size === "large" ? "16px" : "12px",
    paddingLeft: size === "large" ? "32px" : "20px",
    paddingRight: withArrow
      ? size === "large"
        ? "10px"
        : "8px"
      : size === "large"
        ? "32px"
        : "20px",
    gap: withArrow ? (size === "large" ? "16px" : "12px") : undefined,
    ...glassStyle,
  };

  const textStyle: React.CSSProperties = {
    fontFamily: "var(--font-geist-mono)",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    whiteSpace: "nowrap",
  };

  // Transparent glass inset tile for arrow: no nested backdrop-filter per liquid glass rules
  const arrowCircleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: size === "large" ? "32px" : "28px",
    height: size === "large" ? "32px" : "28px",
    borderRadius: "9999px",
    backgroundColor: hovered ? "rgba(255, 255, 255, 0.20)" : "rgba(255, 255, 255, 0.10)",
    border: "1px solid var(--glass-border)",
    boxShadow: "inset 0 1px 0 var(--glass-highlight)",
    flexShrink: 0,
    transition:
      "background-color 250ms cubic-bezier(0.22, 1, 0.36, 1), border-color 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms cubic-bezier(0.22, 1, 0.36, 1)",
  };

  const arrowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: hovered ? "translateX(2px)" : "translateX(0px)",
    transition: "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)",
  };

  const inner = (
    <>
      <span style={textStyle}>{children}</span>
      {withArrow && (
        <span style={arrowCircleStyle}>
          <span style={arrowStyle}>
            <svg
              viewBox="0 0 12 12"
              fill="none"
              width="12"
              height="12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 6h8M6 2l4 4-4 4" />
            </svg>
          </span>
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        rel={target === "_blank" ? rel || "noopener noreferrer" : rel}
        style={containerStyle}
        className={cn("glass-btn", className)}
        aria-label={ariaLabel}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => {
          setHovered(false);
          setPressed(false);
        }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      style={containerStyle}
      className={cn("glass-btn", className)}
      aria-label={ariaLabel}
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => {
        setHovered(false);
        setPressed(false);
      }}
    >
      {inner}
    </button>
  );
}

