import { NextResponse } from "next/server";
import { getPublishedProjects } from "@/lib/content";
import { reelSections, type ReelSectionData } from "@/content/reel-sections";

export async function GET() {
  const projects = await getPublishedProjects({ featuredOnly: true });
  const studioHero = reelSections[0];
  const sections: ReelSectionData[] = [studioHero, ...projects
    .filter((project) => !project.muxPlaybackId.startsWith("PLACEHOLDER_"))
    .map((project) => ({
      id: project.slug,
      muxPlaybackId: project.muxPlaybackId,
      variant: "project" as const,
      eyebrow: project.client ?? project.eyebrow ?? "Maxmark Studio Originals",
      title: project.title,
      primaryCta: { label: "Watch Project", href: `/work/${project.slug}` },
      secondaryCta: { label: `See All ${project.category} Work`, href: `/work?category=${project.category.toLowerCase()}` },
    }))];
  return NextResponse.json(sections, { headers: { "Cache-Control": "no-store" } });
}
