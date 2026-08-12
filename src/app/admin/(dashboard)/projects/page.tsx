import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProjectsTable from "@/components/admin/ProjectsTable";
import type { ProjectRow } from "@/types/database";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  const projects = (data as ProjectRow[]) ?? [];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "36px", fontWeight: 400, color: "var(--fg-primary)", margin: 0 }}>
          Projects
        </h1>
        <Link
          href="/admin/projects/new"
          style={{
            padding: "12px 24px",
            backgroundColor: "var(--fg-primary)",
            color: "var(--bg-base)",
            borderRadius: "9999px",
            fontFamily: "var(--font-geist-mono)",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            textDecoration: "none",
          }}
        >
          New Project
        </Link>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}
