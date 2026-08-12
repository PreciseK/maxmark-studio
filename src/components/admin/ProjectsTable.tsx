"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProjectRow } from "@/types/database";

type Props = { projects: ProjectRow[] };

export default function ProjectsTable({ projects }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = projects.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || p.category === category;
    const matchStatus =
      status === "all" ||
      (status === "published" && p.published) ||
      (status === "draft" && !p.published);
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div>
      {/* Filter row */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search…"
          style={{
            backgroundColor: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "8px 14px",
            color: "var(--fg-primary)",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "12px",
            outline: "none",
            minWidth: "200px",
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 14px", color: "var(--fg-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "12px", cursor: "pointer" }}
        >
          <option value="all">All Categories</option>
          <option value="brand">Brand</option>
          <option value="narrative">Narrative</option>
          <option value="music">Music</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px 14px", color: "var(--fg-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "12px", cursor: "pointer" }}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <p style={{ fontFamily: "var(--font-fraunces)", fontSize: "22px", color: "var(--fg-muted)", marginBottom: "16px" }}>
            {projects.length === 0 ? "No projects yet." : "No results."}
          </p>
          {projects.length === 0 && (
            <Link
              href="/admin/projects/new"
              style={{ fontFamily: "var(--font-geist-mono)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-highlight)", textDecoration: "none" }}
            >
              Create your first project →
            </Link>
          )}
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[
                { key: "thumbnail", label: "" },
                { key: "title", label: "Title" },
                { key: "category", label: "Category" },
                { key: "featured", label: "Featured" },
                { key: "status", label: "Status" },
                { key: "updated", label: "Updated" },
                { key: "actions", label: "" },
              ].map((column) => (
                <th
                  key={column.key}
                  style={{
                    textAlign: "left",
                    padding: "0 16px 12px 0",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: "var(--fg-muted)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((project) => (
              <tr key={project.id} style={{ borderBottom: "1px solid var(--border)" }}>
                {/* Thumbnail */}
                <td style={{ padding: "14px 16px 14px 0", width: "64px" }}>
                  {project.poster_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={project.poster_url} alt="" style={{ width: "48px", height: "32px", objectFit: "cover", borderRadius: "3px" }} />
                  ) : project.mux_playback_id ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`https://image.mux.com/${project.mux_playback_id}/thumbnail.jpg?width=96&height=64&fit_mode=crop`}
                      alt=""
                      style={{ width: "48px", height: "32px", objectFit: "cover", borderRadius: "3px" }}
                    />
                  ) : (
                    <div style={{ width: "48px", height: "32px", backgroundColor: "var(--bg-elevated)", borderRadius: "3px" }} />
                  )}
                </td>
                {/* Title */}
                <td style={{ padding: "14px 24px 14px 0" }}>
                  <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: "14px", color: "var(--fg-primary)", margin: 0 }}>{project.title}</p>
                  <p style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--fg-muted)", margin: 0, marginTop: "2px" }}>{project.slug}</p>
                </td>
                {/* Category */}
                <td style={{ padding: "14px 24px 14px 0" }}>
                  <span style={{
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "3px 10px",
                    borderRadius: "9999px",
                    border: "1px solid var(--border)",
                    color: "var(--fg-muted)",
                  }}>
                    {project.category}
                  </span>
                </td>
                {/* Featured */}
                <td style={{ padding: "14px 24px 14px 0" }}>
                  {project.featured && <span style={{ color: "var(--accent-highlight)", fontSize: "16px" }}>✓</span>}
                </td>
                {/* Status */}
                <td style={{ padding: "14px 24px 14px 0" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: project.published ? "var(--accent-highlight)" : "var(--fg-muted)" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: project.published ? "var(--accent-highlight)" : "var(--fg-subtle)", flexShrink: 0 }} />
                    {project.published ? "Published" : "Draft"}
                  </span>
                </td>
                {/* Updated */}
                <td style={{ padding: "14px 24px 14px 0" }}>
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", color: "var(--fg-muted)" }}>
                    {new Date(project.updated_at).toLocaleDateString()}
                  </span>
                </td>
                {/* Actions */}
                <td style={{ padding: "14px 0" }}>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    style={{ fontFamily: "var(--font-geist-mono)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", textDecoration: "none" }}
                  >
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
