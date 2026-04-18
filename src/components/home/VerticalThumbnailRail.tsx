"use client";

import Image from "next/image";
import { getMuxThumbnail } from "@/lib/mux";
import type { Project } from "@/types";

interface VerticalThumbnailRailProps {
  projects: Project[];
  activeId: string;
  onSelect: (slug: string) => void;
  className?: string;
}

export default function VerticalThumbnailRail({
  projects,
  activeId,
  onSelect,
  className,
}: VerticalThumbnailRailProps) {
  return (
    <div
      className={`hidden flex-col gap-2 lg:flex ${className ?? ""}`}
      role="list"
      aria-label="Project selector"
    >
      {projects.map((project) => {
        const isActive = project.slug === activeId;
        const isPlaceholder = project.muxPlaybackId.startsWith("PLACEHOLDER_");
        const thumbUrl = isPlaceholder
          ? null
          : getMuxThumbnail(project.muxPlaybackId, { width: 200, height: 140 });

        return (
          <button
            key={project.slug}
            role="listitem"
            aria-label={`Play ${project.title}`}
            aria-current={isActive ? "true" : "false"}
            onClick={() => onSelect(project.slug)}
            style={{
              width: "72px",
              height: "48px",
              borderRadius: "6px",
              overflow: "hidden",
              flexShrink: 0,
              padding: 0,
              cursor: "pointer",
              position: "relative",
              outline: "none",
              /* active ring */
              boxShadow: isActive
                ? `0 0 0 2px #0a0a0a, 0 0 0 4px var(--accent-highlight)`
                : "none",
              opacity: isActive ? 1 : 0.65,
              transition: "opacity 200ms ease, box-shadow 200ms ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.opacity = "0.65";
            }}
          >
            {thumbUrl ? (
              <Image
                src={thumbUrl}
                alt={project.title}
                fill
                sizes="72px"
                style={{ objectFit: "cover" }}
                unoptimized
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "var(--bg-elevated)",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
