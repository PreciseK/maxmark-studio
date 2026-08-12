"use client";

import Link from "next/link";
import { studio } from "@/content/studio";
import NewsletterInput from "@/components/ui/NewsletterInput";
import type { Social } from "@/types";

function SocialIcon({ icon }: { icon: Social["icon"] }) {
  const icons: Record<Social["icon"], React.ReactNode> = {
    instagram: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    x: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.743l7.737-8.858L1.8 2.25h6.613l4.27 5.645L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.57A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
      </svg>
    ),
    vimeo: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M22 7.42c-.09 2.01-1.49 4.76-4.2 8.26C15.02 19.37 12.77 21 11 21c-1.05 0-1.94-1-2.67-2.98l-1.45-5.38C6.22 10.66 5.58 9.67 4.89 9.67c-.15 0-.68.32-1.58.97L2 9.31c1-.88 1.98-1.76 2.95-2.64 1.33-1.15 2.33-1.76 3-1.81 1.58-.15 2.55.93 2.92 3.22.4 2.45.67 3.97.83 4.54.46 2.1.97 3.14 1.52 3.14.43 0 1.07-.68 1.93-2.05.86-1.37 1.32-2.41 1.38-3.13.12-1.18-.34-1.78-1.38-1.78-.49 0-1 .11-1.52.34.9-2.95 2.63-4.38 5.18-4.28 1.88.07 2.77 1.28 2.67 3.66z" />
      </svg>
    ),
  };
  return icons[icon] ?? null;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "var(--bg-elevated)", color: "var(--fg-primary)" }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: "1440px",
          paddingLeft: "clamp(24px, 3.33vw, 48px)",
          paddingRight: "clamp(24px, 3.33vw, 48px)",
          paddingTop: "120px",
          paddingBottom: "120px",
        }}
      >
        {/* Manifesto */}
        <p
          className="mb-20"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(28px, 4vw, 56px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 0.95,
            maxWidth: "800px",
          }}
        >
          {studio.manifesto}
        </p>

        {/* Three columns */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {/* Sitemap */}
          <div>
            <p
              className="mb-5"
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--fg-muted)",
              }}
            >
              Navigation
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { href: "/work", label: "Work" },
                { href: "/studio", label: "Studio" },
                { href: "/about", label: "About" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
                { href: "/booking", label: "Book the Studio" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-geist-sans)",
                    fontSize: "15px",
                    color: "var(--fg-muted)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--fg-primary)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "var(--fg-muted)")
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p
              className="mb-5"
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--fg-muted)",
              }}
            >
              Contact
            </p>
            <div className="flex flex-col gap-4">
              {studio.contactEmails.map((contact) => (
                <div key={contact.email}>
                  <p
                    style={{
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "var(--fg-subtle)",
                      marginBottom: "2px",
                    }}
                  >
                    {contact.label}
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-geist-sans)",
                      fontSize: "15px",
                      color: "var(--fg-muted)",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        "var(--fg-primary)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        "var(--fg-muted)")
                    }
                  >
                    {contact.email}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p
              className="mb-5"
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--fg-muted)",
              }}
            >
              Stay in the loop
            </p>
            <p
              className="mb-4"
              style={{
                fontFamily: "var(--font-geist-sans)",
                fontSize: "14px",
                color: "var(--fg-muted)",
                lineHeight: 1.5,
              }}
            >
              New work, behind-the-scenes, and studio dispatches — no noise.
            </p>
            <NewsletterInput />
          </div>
        </div>

        {/* Social icons */}
        <div className="mt-16 flex items-center gap-5">
          {studio.socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="transition-opacity duration-200"
              style={{ color: "var(--fg-subtle)", opacity: 1 }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "var(--fg-primary)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "var(--fg-subtle)")
              }
            >
              <SocialIcon icon={social.icon} />
            </a>
          ))}
        </div>

        {/* Legal row */}
        <div
          className="mt-12 flex flex-wrap items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "11px",
              color: "var(--fg-subtle)",
              letterSpacing: "0.06em",
            }}
          >
            © {year} Maxmark Studio. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "11px",
                  color: "var(--fg-subtle)",
                  letterSpacing: "0.06em",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
