"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import WysiwygEditor from "@/components/admin/WysiwygEditor";
import { deleteBlogPost, saveBlogPost } from "@/lib/actions/cms";
import type { BlogPostRow } from "@/types/database";

function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-"); }

export default function BlogEditorForm({ post }: { post?: BlogPostRow }) {
  const router = useRouter(); const [saving, setSaving] = useState(false); const [message, setMessage] = useState("");
  const [form, setForm] = useState({ title: post?.title ?? "", slug: post?.slug ?? "", category: post?.category ?? "Perspective", excerpt: post?.excerpt ?? "", content_html: post?.content_html ?? "<p>Start writing…</p>", hero_image_url: post?.hero_image_url ?? "", mux_playback_id: post?.mux_playback_id ?? "", featured: post?.featured ?? false, published: post?.published ?? false });
  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: React.FormEvent) { event.preventDefault(); setSaving(true); const result = await saveBlogPost(post?.id ?? null, form); setMessage(result.message); setSaving(false); if (result.ok && !post) router.push("/admin/blog"); router.refresh(); }
  async function remove() { if (!post || !window.confirm("Archive this article?")) return; const result = await deleteBlogPost(post.id); if (result.ok) router.push("/admin/blog"); else setMessage(result.message); }
  return (
    <form onSubmit={submit} style={{ maxWidth: "900px" }}>
      <div style={gridStyle}>
        <label style={labelStyle}>Title<input required value={form.title} onChange={(e) => { update("title", e.target.value); if (!post) update("slug", slugify(e.target.value)); }} style={inputStyle} /></label>
        <label style={labelStyle}>Slug<input required value={form.slug} onChange={(e) => update("slug", e.target.value)} style={inputStyle} /></label>
        <label style={labelStyle}>Category<input value={form.category} onChange={(e) => update("category", e.target.value)} style={inputStyle} /></label>
        <label style={labelStyle}>Mux playback ID<input value={form.mux_playback_id} onChange={(e) => update("mux_playback_id", e.target.value)} style={inputStyle} /></label>
      </div>
      <label style={{ ...labelStyle, marginTop: "28px" }}>Excerpt<textarea required value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={3} style={inputStyle} /></label>
      <div style={{ marginTop: "32px" }}><ImageUpload bucket="site-media" label="Article hero image" value={form.hero_image_url} onChange={(value) => update("hero_image_url", value)} /></div>
      <div style={{ marginTop: "38px" }}><WysiwygEditor value={form.content_html} onChange={(value) => update("content_html", value)} /></div>
      <div style={{ display: "flex", gap: "28px", marginTop: "30px" }}>
        <label style={checkStyle}><input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} /> Featured</label>
        <label style={checkStyle}><input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} /> Published</label>
      </div>
      {message && <p style={{ color: message.includes("updated") || message.includes("created") ? "var(--accent-highlight)" : "#ff7d7d", fontFamily: "var(--font-geist-mono)", fontSize: "11px", marginTop: "22px" }}>{message}</p>}
      <div style={{ display: "flex", gap: "12px", marginTop: "34px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
        <button disabled={saving} type="submit" style={primaryStyle}>{saving ? "Saving…" : "Save article"}</button>
        <button type="button" onClick={() => router.push("/admin/blog")} style={secondaryStyle}>Cancel</button>
        {post && <button type="button" onClick={remove} style={{ ...secondaryStyle, marginLeft: "auto", color: "#ff7d7d" }}>Archive</button>}
      </div>
    </form>
  );
}

const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "24px" };
const labelStyle: React.CSSProperties = { display: "block", color: "var(--fg-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase" };
const inputStyle: React.CSSProperties = { display: "block", width: "100%", marginTop: "9px", padding: "11px 0", border: 0, borderBottom: "1px solid var(--admin-input-border)", outline: 0, background: "transparent", color: "var(--fg-primary)", fontFamily: "var(--font-geist-sans)", fontSize: "15px", resize: "vertical" };
const checkStyle: React.CSSProperties = { display: "flex", gap: "8px", color: "var(--fg-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "11px", textTransform: "uppercase" };
const primaryStyle: React.CSSProperties = { padding: "12px 20px", border: 0, background: "var(--accent-highlight)", color: "#080808", cursor: "pointer", fontFamily: "var(--font-geist-mono)", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" };
const secondaryStyle: React.CSSProperties = { padding: "12px 20px", border: "1px solid var(--border)", background: "transparent", color: "var(--fg-muted)", cursor: "pointer", fontFamily: "var(--font-geist-mono)", fontSize: "10px", textTransform: "uppercase" };
