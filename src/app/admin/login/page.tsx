"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    router.push("/admin/projects");
    router.refresh();
  };

  if (!configured) return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px" }}><div style={{ maxWidth: "560px" }}><p style={{ fontFamily: "var(--font-geist-mono)", color: "var(--accent-highlight)", fontSize: "10px", textTransform: "uppercase" }}>CMS setup required</p><h1 style={{ fontFamily: "var(--font-anton)", fontSize: "72px", fontWeight: 400, lineHeight: .85, textTransform: "uppercase", margin: "24px 0" }}>Connect Supabase first.</h1><Link href="/admin/setup" style={{ color: "var(--fg-primary)", fontFamily: "var(--font-geist-mono)", fontSize: "11px" }}>Open setup instructions →</Link></div></div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Logo / wordmark */}
      <p
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "var(--fg-muted)",
          marginBottom: "12px",
        }}
      >
        Maxmark Studio
      </p>

      <h1
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "32px",
          fontWeight: 400,
          color: "var(--fg-primary)",
          marginBottom: "40px",
        }}
      >
        Studio Admin
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <div>
          <label style={labelStyle}>Email</label>
          <input {...register("email")} type="email" autoComplete="email" style={inputStyle} />
          {errors.email && <p style={fieldErrorStyle}>{errors.email.message}</p>}
        </div>

        <div>
          <label style={labelStyle}>Password</label>
          <input {...register("password")} type="password" autoComplete="current-password" style={inputStyle} />
          {errors.password && <p style={fieldErrorStyle}>{errors.password.message}</p>}
        </div>

        {serverError && (
          <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", color: "var(--accent)", marginTop: "-8px" }}>
            {serverError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} style={submitStyle}>
          {isSubmitting ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-geist-mono)",
  fontSize: "11px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--fg-muted)",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid var(--admin-input-border)",
  borderRadius: 0,
  padding: "10px 0",
  color: "var(--fg-primary)",
  fontFamily: "var(--font-geist-sans)",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const fieldErrorStyle: React.CSSProperties = {
  fontFamily: "var(--font-geist-mono)",
  fontSize: "11px",
  color: "var(--accent)",
  marginTop: "6px",
};

const submitStyle: React.CSSProperties = {
  marginTop: "8px",
  padding: "14px 24px",
  backgroundColor: "var(--fg-primary)",
  color: "var(--bg-base)",
  border: "none",
  borderRadius: "9999px",
  fontFamily: "var(--font-geist-mono)",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  cursor: "pointer",
};
