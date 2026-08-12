import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BlogPostRow } from "@/types/database";

export default async function BlogAdminPage() {
  const supabase = await createClient(); const { data } = await supabase.from("blog_posts").select("*").is("deleted_at", null).order("updated_at", { ascending: false }); const posts = (data as BlogPostRow[] | null) ?? [];
  return <div><header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}><div><h1 style={titleStyle}>Blog</h1><p style={noteStyle}>Write, format, preview, and publish studio stories.</p></div><Link href="/admin/blog/new" style={newStyle}>New article</Link></header>
    <div style={{ borderTop: "1px solid var(--border)" }}>{posts.length ? posts.map((post) => <Link href={`/admin/blog/${post.id}`} key={post.id} style={rowStyle}><div><strong style={{ color: "var(--fg-primary)", fontFamily: "var(--font-geist-sans)" }}>{post.title}</strong><span style={metaStyle}>{post.category} · {post.slug}</span></div><span style={{ ...metaStyle, color: post.published ? "var(--accent-highlight)" : "var(--fg-muted)" }}>{post.published ? "Published" : "Draft"} →</span></Link>) : <p style={{ ...noteStyle, padding: "60px 0" }}>No database articles yet. The public Blog continues using its built-in starter stories until you publish one.</p>}</div>
  </div>;
}
const titleStyle: React.CSSProperties={margin:0,fontFamily:"var(--font-anton)",fontSize:"52px",fontWeight:400,textTransform:"uppercase"};
const noteStyle: React.CSSProperties={margin:"8px 0 0",fontFamily:"var(--font-geist-mono)",fontSize:"11px",color:"var(--fg-muted)"};
const newStyle: React.CSSProperties={padding:"12px 20px",background:"var(--accent-highlight)",color:"#080808",fontFamily:"var(--font-geist-mono)",fontSize:"10px",fontWeight:700,textTransform:"uppercase",textDecoration:"none"};
const rowStyle: React.CSSProperties={display:"flex",justifyContent:"space-between",alignItems:"center",padding:"22px 0",borderBottom:"1px solid var(--border)",textDecoration:"none"};
const metaStyle: React.CSSProperties={display:"block",marginTop:"6px",fontFamily:"var(--font-geist-mono)",fontSize:"9px",color:"var(--fg-muted)",textTransform:"uppercase"};
