import { projects } from "@/content/projects";
import VideoScrollSection from "@/components/home/VideoScrollSection";

export default function VideoScrollStack() {
  return (
    <div
      style={{
        position: "relative",
        height: `calc(100dvh * ${projects.length})`,
      }}
    >
      {projects.map((project, i) => (
        <VideoScrollSection key={project.slug} project={project} index={i} />
      ))}
    </div>
  );
}
