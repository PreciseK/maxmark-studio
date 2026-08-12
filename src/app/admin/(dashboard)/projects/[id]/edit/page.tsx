import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectForm from "@/components/admin/ProjectForm";
import type { ProjectRow } from "@/types/database";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  const project = data as ProjectRow | null;

  if (error || !project) notFound();

  return (
    <div style={{ maxWidth: "760px" }}>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "36px", fontWeight: 400, color: "var(--fg-primary)", marginBottom: "40px" }}>
        Edit: {project.title}
      </h1>
      <ProjectForm initialData={project} />
    </div>
  );
}
