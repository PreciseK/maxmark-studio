type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
};

export default function FormField({ label, error, children, hint }: FormFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--fg-muted)",
        }}
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--fg-subtle)" }}>
          {hint}
        </p>
      )}
      {error && (
        <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--accent)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
