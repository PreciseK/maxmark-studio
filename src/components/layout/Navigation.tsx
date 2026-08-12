"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PillButton from "@/components/ui/PillButton";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "@/lib/motion";
import ThemeToggle from "@/components/layout/ThemeToggle";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/studio", label: "Studio" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

const BACKDROP = "var(--glass-blur)";

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHovered, setNavHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.4);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : previousOverflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const pillBg = scrolled
    ? "var(--glass-bg-scrolled)"
    : navHovered
      ? "var(--glass-bg-hover)"
      : "var(--glass-bg)";

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="fixed z-50 hidden items-center lg:flex"
        style={{
          top: "24px",
          left: "clamp(180px, 19.3vw, 278px)",
          minHeight: "56px",
          borderRadius: "9999px",
          backdropFilter: BACKDROP,
          WebkitBackdropFilter: BACKDROP,
          backgroundColor: pillBg,
          border: `1px solid ${navHovered && !scrolled ? "var(--glass-border-hover)" : "var(--glass-border)"}`,
          boxShadow:
            navHovered && !scrolled
              ? "inset 0 1px 0 var(--glass-highlight-hover), 0 12px 40px rgba(0,0,0,0.16)"
              : "inset 0 1px 0 var(--glass-highlight), 0 12px 40px rgba(0,0,0,0.12)",
          padding: "0 22px",
          gap: "28px",
          transition:
            "background-color 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
      >
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="site-nav-link">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="fixed top-6 right-12 z-50 hidden items-center gap-2 lg:flex">
        <ThemeToggle />
        <PillButton href="/contact" variant="glass" withArrow>
          Get In Touch
        </PillButton>
      </div>

      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        className="fixed top-5 right-5 z-50 flex items-center lg:hidden"
        style={{
          minWidth: "88px",
          minHeight: "40px",
          justifyContent: "space-between",
          gap: "8px",
          borderRadius: "9999px",
          backdropFilter: BACKDROP,
          WebkitBackdropFilter: BACKDROP,
          backgroundColor: pillBg,
          border: "1px solid var(--glass-border)",
          boxShadow: "inset 0 1px 0 var(--glass-highlight), 0 8px 24px rgba(0,0,0,0.18)",
          padding: "5px 6px 5px 14px",
          color: "var(--fg-primary)",
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          transition: "background-color 300ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <span>{menuOpen ? "Close" : "Menu"}</span>
        <span
          className="flex h-7 w-7 flex-col items-center justify-center gap-[4px] rounded-full"
          style={{ backgroundColor: "rgba(245,245,240,0.1)" }}
          aria-hidden="true"
        >
          {[0, 1, 2].map((line) => (
            <span
              key={line}
              className="block h-px w-3.5 origin-center"
              style={{
                backgroundColor: "var(--fg-primary)",
                transition: "transform 300ms ease, opacity 300ms ease",
                transform:
                  line === 0 && menuOpen
                    ? "translateY(5px) rotate(45deg)"
                    : line === 2 && menuOpen
                      ? "translateY(-5px) rotate(-45deg)"
                      : "none",
                opacity: line === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </span>
      </button>

      <div
        id="mobile-navigation"
        className={cn(
          "fixed inset-0 z-40 flex flex-col items-start justify-center px-8 lg:hidden",
          "transition-all duration-500",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{ backgroundColor: "var(--bg-base)" }}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation" className="flex w-full flex-col gap-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-anton)",
                fontSize: "clamp(48px, 13vw, 72px)",
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                color: "var(--fg-primary)",
                lineHeight: 0.92,
                textDecoration: "none",
                transition: `transform 400ms cubic-bezier(${EASE_OUT_EXPO.join(",")}), opacity 400ms ease`,
                transitionDelay: menuOpen ? `${index * 60}ms` : "0ms",
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
            <ThemeToggle mobile />
            <PillButton
              href="/contact"
              variant="glass"
              size="large"
              withArrow
              onClick={() => setMenuOpen(false)}
            >
              Get In Touch
            </PillButton>
          </div>
        </nav>
      </div>
    </>
  );
}
