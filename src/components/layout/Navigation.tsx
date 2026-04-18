"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/journal", label: "Journal" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "backdrop-blur-[12px]" : "",
        )}
        style={{
          backgroundColor: "rgba(10, 10, 10, 0.72)",
          height: "var(--nav-height)",
          borderBottom: isScrolled ? "1px solid var(--border)" : "none",
        }}
      >
        <div
          className="mx-auto flex h-full items-center justify-between"
          style={{
            maxWidth: "1440px",
            paddingLeft: "clamp(24px, 3.33vw, 48px)",
            paddingRight: "clamp(24px, 3.33vw, 48px)",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 shrink-0"
            style={{ color: "var(--fg-primary)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "20px",
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              Maxmark Studio
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--fg-muted)",
                  transition: "color 200ms ease",
                }}
                className="hover:text-[var(--fg-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden items-center rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.1em] transition-all duration-300 lg:flex"
              style={{
                fontFamily: "var(--font-geist-mono)",
                color: "var(--fg-primary)",
                border: "1px solid var(--border-strong)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--fg-primary)";
                (e.currentTarget as HTMLElement).style.color = "var(--bg-base)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--fg-primary)";
              }}
            >
              Get In Touch
            </Link>

            {/* Hamburger */}
            <button
              className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span
                className="h-px w-6 origin-center transition-all duration-300"
                style={{
                  backgroundColor: "var(--fg-primary)",
                  transform: menuOpen
                    ? "translateY(4px) rotate(45deg)"
                    : "none",
                }}
              />
              <span
                className="h-px w-6 transition-all duration-300"
                style={{
                  backgroundColor: "var(--fg-primary)",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="h-px w-6 origin-center transition-all duration-300"
                style={{
                  backgroundColor: "var(--fg-primary)",
                  transform: menuOpen
                    ? "translateY(-4px) rotate(-45deg)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col items-start justify-center px-6 transition-all duration-500 lg:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <nav className="flex w-full flex-col gap-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block transition-all duration-300"
              style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "clamp(36px, 8vw, 64px)",
                fontWeight: 500,
                color: "var(--fg-primary)",
                letterSpacing: "-0.02em",
                transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                transform: menuOpen ? "none" : "translateY(16px)",
                opacity: menuOpen ? 1 : 0,
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex items-center rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.1em]"
            style={{
              fontFamily: "var(--font-geist-mono)",
              color: "var(--fg-primary)",
              border: "1px solid var(--border-strong)",
              width: "fit-content",
              transitionDelay: menuOpen ? `${navLinks.length * 60}ms` : "0ms",
              transform: menuOpen ? "none" : "translateY(16px)",
              opacity: menuOpen ? 1 : 0,
              transition: "transform 400ms ease, opacity 400ms ease",
            }}
          >
            Get In Touch
          </Link>
        </nav>
      </div>
    </>
  );
}
