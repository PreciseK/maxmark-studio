import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div style={{ maxWidth: "760px" }}>
      <h1 style={{ fontFamily: "var(--font-fraunces)", fontSize: "36px", fontWeight: 400, color: "var(--fg-primary)", marginBottom: "40px" }}>
        New Project
      </h1>
      <ProjectForm />
    </div>
  );
}
