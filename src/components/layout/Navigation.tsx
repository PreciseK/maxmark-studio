"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PillButton from "@/components/ui/PillButton";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "@/lib/motion";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/journal", label: "Journal" },
];

const GLASS_SCROLLED = "rgba(255, 255, 255, 0.14)";
const BACKDROP = "var(--glass-blur)";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHovered, setNavHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const pillBg = scrolled
    ? GLASS_SCROLLED
    : navHovered
      ? "var(--glass-bg-hover)"
      : "var(--glass-bg)";

  return (
    <>
      {/* ── Centre nav pill (desktop) ─────────────────────────────── */}
      <nav
        className="fixed left-1/2 z-50 hidden -translate-x-1/2 items-center lg:flex"
        style={{
          top: "24px",
          borderRadius: "9999px",
          backdropFilter: BACKDROP,
          WebkitBackdropFilter: BACKDROP,
          backgroundColor: pillBg,
          border: `1px solid ${navHovered && !scrolled ? "var(--glass-border-hover)" : "var(--glass-border)"}`,
          boxShadow: navHovered && !scrolled
            ? "inset 0 1px 0 var(--glass-highlight-hover)"
            : "inset 0 1px 0 var(--glass-highlight)",
          padding: "12px 32px",
          gap: "32px",
          transition:
            "background-color 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--fg-muted)",
              transition: "color 200ms ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--fg-primary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* ── Right CTA pill (desktop) ──────────────────────────────── */}
      <div className="fixed right-6 z-50 hidden lg:block" style={{ top: "24px" }}>
        <PillButton href="/contact" variant="glass" withArrow>
          Get In Touch
        </PillButton>
      </div>

      {/* ── Mobile hamburger pill ─────────────────────────────────── */}
      <div
        className="fixed right-6 z-50 flex lg:hidden"
        style={{
          top: "24px",
          borderRadius: "9999px",
          backdropFilter: BACKDROP,
          WebkitBackdropFilter: BACKDROP,
          backgroundColor: pillBg,
          border: "1px solid var(--glass-border)",
          boxShadow: "inset 0 1px 0 var(--glass-highlight), 0 1px 3px rgba(0,0,0,0.2)",
          padding: "10px 16px",
          transition: "background-color 400ms ease",
        }}
      >
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex flex-col items-center justify-center gap-[5px]"
          style={{ width: "24px", height: "24px" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-px w-5 origin-center"
              style={{
                backgroundColor: "var(--fg-primary)",
                transition: "transform 300ms ease, opacity 300ms ease",
                transform:
                  i === 0 && menuOpen
                    ? "translateY(6px) rotate(45deg)"
                    : i === 2 && menuOpen
                      ? "translateY(-6px) rotate(-45deg)"
                      : "none",
                opacity: i === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* ── Mobile full-screen overlay ───────────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col items-start justify-center px-8 lg:hidden",
          "transition-all duration-500",
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
              style={{
                fontFamily: "var(--font-anton)",
                fontSize: "clamp(40px, 10vw, 72px)",
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                color: "var(--fg-primary)",
                lineHeight: 0.95,
                textDecoration: "none",
                transition: `transform 400ms cubic-bezier(${EASE_OUT_EXPO.join(",")}), opacity 400ms ease`,
                transitionDelay: menuOpen ? `${i * 60}ms` : "0ms",
                transform: menuOpen ? "none" : "translateY(20px)",
                opacity: menuOpen ? 1 : 0,
              }}
            >
              {link.label}
            </Link>
          ))}
          <div
            style={{
              marginTop: "16px",
              transition: `transform 400ms cubic-bezier(${EASE_OUT_EXPO.join(",")}), opacity 400ms ease`,
              transitionDelay: menuOpen ? `${navLinks.length * 60}ms` : "0ms",
              transform: menuOpen ? "none" : "translateY(20px)",
              opacity: menuOpen ? 1 : 0,
            }}
          >
            <PillButton href="/contact" variant="glass" withArrow onClick={() => setMenuOpen(false)}>
              Get In Touch
            </PillButton>
          </div>
        </nav>
      </div>
    </>
  );
}
