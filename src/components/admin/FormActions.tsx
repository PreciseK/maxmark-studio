"use client";

import Link from "next/link";

type FormActionsProps = {
  isSubmitting: boolean;
  cancelHref: string;
  onDelete?: () => void;
  isEdit?: boolean;
};

export default function FormActions({ isSubmitting, cancelHref, onDelete, isEdit }: FormActionsProps) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center", paddingTop: "32px", borderTop: "1px solid var(--border)", marginTop: "32px" }}>
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: "12px 28px",
          backgroundColor: "var(--fg-primary)",
          color: "var(--bg-base)",
          border: "none",
          borderRadius: "9999px",
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.6 : 1,
        }}
      >
        {isSubmitting ? "Saving…" : "Save"}
      </button>

      <Link
        href={cancelHref}
        style={{
          padding: "12px 28px",
          backgroundColor: "transparent",
          color: "var(--fg-muted)",
          border: "1px solid var(--border)",
          borderRadius: "9999px",
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        Cancel
      </Link>

      {isEdit && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          style={{
            marginLeft: "auto",
            padding: "12px 28px",
            backgroundColor: "transparent",
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            borderRadius: "9999px",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            cursor: "pointer",
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
}
