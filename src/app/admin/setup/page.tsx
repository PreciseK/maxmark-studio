import Link from "next/link";

export default function AdminSetupPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px" }}>
      <div style={{ maxWidth: "720px" }}>
        <p style={{ fontFamily: "var(--font-geist-mono)", color: "var(--accent-highlight)", fontSize: "10px", letterSpacing: ".12em", textTransform: "uppercase" }}>CMS setup required</p>
        <h1 style={{ fontFamily: "var(--font-anton)", fontSize: "clamp(64px,9vw,120px)", fontWeight: 400, lineHeight: .82, textTransform: "uppercase", margin: "24px 0 40px" }}>Connect the content database.</h1>
        <ol style={{ color: "var(--fg-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "13px", lineHeight: 1.9, paddingLeft: "20px" }}>
          <li>Create a Supabase project and replace the placeholder values in <code>.env.local</code>.</li>
          <li>Run <code>001_initial_schema.sql</code>, then <code>002_full_cms.sql</code> in the Supabase SQL editor.</li>
          <li>Create an admin user in Supabase Authentication and disable public signups.</li>
          <li>Restart the development server, then sign in.</li>
        </ol>
        <Link href="/" style={{ display: "inline-block", marginTop: "34px", color: "var(--fg-primary)", fontFamily: "var(--font-geist-mono)", fontSize: "11px", textTransform: "uppercase" }}>← Back to website</Link>
      </div>
    </main>
  );
}
