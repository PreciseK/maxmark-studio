"use client";

import { useState } from "react";

export default function NewsletterInput() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "12px",
          color: "var(--fg-muted)",
          letterSpacing: "0.06em",
        }}
      >
        You&apos;re in. Watch this space.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
        style={{
          fontFamily: "var(--font-geist-sans)",
          fontSize: "14px",
          color: "var(--fg-primary)",
          borderBottom: "1px solid var(--border-strong)",
          paddingBottom: "8px",
        }}
      />
      <button
        type="submit"
        className="shrink-0 pb-2 text-xs uppercase tracking-widest transition-colors duration-200"
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          color: "var(--fg-muted)",
          letterSpacing: "0.1em",
          borderBottom: "1px solid var(--border-strong)",
          paddingBottom: "8px",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color = "var(--fg-primary)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color = "var(--fg-muted)")
        }
      >
        Join
      </button>
    </form>
  );
}
