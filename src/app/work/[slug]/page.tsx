import { projects } from "@/content/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <section
      className="flex min-h-screen flex-col items-center justify-center"
      style={{ paddingTop: "var(--nav-height)" }}
    >
      <h1
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "clamp(36px, 6vw, 96px)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 0.95,
          color: "var(--fg-primary)",
          textAlign: "center",
          textTransform: "capitalize",
        }}
      >
        {slug.replace(/-/g, " ")}
      </h1>
      <p
        className="mt-6"
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--fg-muted)",
        }}
      >
        In production.
      </p>
    </section>
  );
}
