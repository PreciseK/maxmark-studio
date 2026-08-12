"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/about", label: "About Page" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/studio-info", label: "Studio Info" },
  { href: "/admin/contact-submissions", label: "Contacts" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/bookings", label: "Bookings" },
];

type Props = { userEmail: string };

export default function AdminSidebar({ userEmail }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className="admin-sidebar"
      style={{
        width: "var(--admin-sidebar-width)",
        minHeight: "100vh",
        backgroundColor: "var(--admin-sidebar-bg)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid var(--border)" }}>
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--fg-muted)" }}>
          Maxmark Studio
        </p>
        <p style={{ fontFamily: "var(--font-fraunces)", fontSize: "16px", color: "var(--fg-primary)", marginTop: "4px" }}>
          Admin
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0" }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "block",
                padding: "10px 24px",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: isActive ? "var(--fg-primary)" : "var(--fg-muted)",
                textDecoration: "none",
                borderLeft: isActive ? "3px solid var(--accent-highlight)" : "3px solid transparent",
                transition: "color 150ms ease, border-color 150ms ease",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--fg-subtle)", marginBottom: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {userEmail}
        </p>
        <form action="/admin/logout" method="POST">
          <button
            type="submit"
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--fg-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
