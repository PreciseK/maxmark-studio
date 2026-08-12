"use client";

type Props = {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
};

export default function DeleteConfirmModal({ title, onConfirm, onCancel, isDeleting }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "40px",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "22px",
            fontWeight: 400,
            color: "var(--fg-primary)",
            marginBottom: "12px",
          }}
        >
          Delete {title}?
        </h2>
        <p
          style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "14px",
            color: "var(--fg-muted)",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          This project will be hidden from the site immediately. The record will remain in the database and can be restored.
        </p>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              padding: "12px 28px",
              backgroundColor: "transparent",
              color: "var(--accent)",
              border: "1px solid var(--accent)",
              borderRadius: "9999px",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              cursor: isDeleting ? "not-allowed" : "pointer",
              opacity: isDeleting ? 0.6 : 1,
            }}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
          <button
            onClick={onCancel}
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
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
