"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";

type PillButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "glass" | "solid";
  size?: "default" | "large";
  withArrow?: boolean;
  className?: string;
  "aria-label"?: string;
};

const GLASS_TRANSITION =
  "background-color 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms cubic-bezier(0.22, 1, 0.36, 1)";

export default function PillButton({
  children,
  href,
  onClick,
  variant = "glass",
  size = "default",
  withArrow = false,
  className,
  "aria-label": ariaLabel,
}: PillButtonProps) {
  const [hovered, setHovered] = useState(false);

  const glassBase: React.CSSProperties = {
    backdropFilter: "var(--glass-blur)",
    WebkitBackdropFilter: "var(--glass-blur)",
    backgroundColor: hovered ? "var(--glass-bg-hover)" : "var(--glass-bg)",
    border: `1px solid ${hovered ? "var(--glass-border-hover)" : "var(--glass-border)"}`,
    color: "var(--fg-primary)",
    boxShadow: hovered
      ? "inset 0 1px 0 var(--glass-highlight-hover)"
      : "inset 0 1px 0 var(--glass-highlight)",
    transition: GLASS_TRANSITION,
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
    minHeight: size === "large" ? "64px" : "54px",
    paddingTop: size === "large" ? "16px" : "12px",
    paddingBottom: size === "large" ? "16px" : "12px",
    paddingLeft: size === "large" ? "32px" : "20px",
    paddingRight: withArrow
      ? size === "large"
        ? "8px"
        : "6px"
      : size === "large"
        ? "32px"
        : "20px",
    gap: withArrow ? (size === "large" ? "16px" : "12px") : undefined,
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
    width: size === "large" ? "30px" : "28px",
    height: size === "large" ? "30px" : "28px",
    borderRadius: "9999px",
    backgroundColor: hovered ? "rgba(245,245,240,0.22)" : "rgba(245,245,240,0.12)",
    flexShrink: 0,
    transition: "background-color 300ms cubic-bezier(0.22, 1, 0.36, 1)",
  };

  const arrowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: hovered ? "translateX(2px)" : "translateX(0px)",
    transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
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
              stroke="var(--fg-primary)"
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
        style={containerStyle}
        className={cn(className)}
        aria-label={ariaLabel}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
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
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {inner}
    </button>
  );
}
