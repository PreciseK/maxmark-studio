"use client";

import { useState } from "react";
import PillButton from "@/components/ui/PillButton";
import styles from "./Academy.module.css";

export default function FreeFieldGuideModal() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 500);
  };

  return (
    <section className={styles.fieldGuideSection} id="field-guide">
      <div className={styles.fieldGuideCopy}>
        <p className={styles.kicker}>Complimentary Download · 48-Page PDF Guide</p>
        <h2>The AI animation & storytelling field guide.</h2>
        <p>
          A production manual covering character seed consistency, camera vocabulary,
          dramatic beat sequencing, and studio prompt engineering from inside Maxmark Animations.
        </p>
      </div>

      <div className={styles.fieldGuideForm}>
        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={styles.fieldGuideInput}
            />
            <div>
              <PillButton
                onClick={() => {}}
                variant="solid"
                size="large"
                withArrow
                className="w-full justify-center"
              >
                {loading ? "Sending..." : "Download Field Guide"}
              </PillButton>
            </div>
          </form>
        ) : (
          <div
            style={{
              padding: "28px",
              border: "1px solid var(--border-strong)",
              background: "var(--bg-elevated)",
              borderRadius: "16px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "var(--accent-highlight)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              ✓ Guide Dispatched
            </p>
            <p
              style={{
                margin: "12px 0 0",
                color: "var(--fg-muted)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              We have sent the field guide and asset presets to{" "}
              <strong style={{ color: "var(--fg-primary)" }}>{email}</strong>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
