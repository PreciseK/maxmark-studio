"use client";

import Image from "next/image";
import { getMuxThumbnail } from "@/lib/mux";

type RailSection = {
  id: string;
  muxPlaybackId: string;
  title: string;
};

interface ReelThumbnailRailProps {
  sections: RailSection[];
  activeIndex: number;
  onThumbnailClick: (index: number) => void;
}

export default function ReelThumbnailRail({
  sections,
  activeIndex,
  onThumbnailClick,
}: ReelThumbnailRailProps) {
  return (
    <nav
      className="fixed top-1/2 left-12 z-30 hidden -translate-y-1/2 lg:block"
      aria-label="Reel navigation"
    >
      <ol className="m-0 flex list-none flex-col gap-3 p-0">
        {sections.map((section, index) => {
          const isActive = index === activeIndex;
          const isPlaceholder = section.muxPlaybackId.startsWith("PLACEHOLDER_");
          const thumbUrl = isPlaceholder
            ? null
            : getMuxThumbnail(section.muxPlaybackId, { width: 200, height: 120 });

          return (
            <li key={section.id}>
              <button
                type="button"
                aria-label={`Go to ${section.title.replace("\n", " ")}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => onThumbnailClick(index)}
                className="relative block h-12 w-20 shrink-0 cursor-pointer overflow-hidden rounded-[5px] p-0"
                style={{
                  border: isActive ? "2px solid var(--accent-highlight)" : "2px solid transparent",
                  opacity: isActive ? 1 : 0.56,
                  filter: isActive ? "none" : "saturate(0.82)",
                  transition:
                    "opacity 220ms cubic-bezier(0.22, 1, 0.36, 1), border-color 220ms cubic-bezier(0.22, 1, 0.36, 1), filter 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onMouseEnter={(event) => {
                  if (!isActive) event.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(event) => {
                  if (!isActive) event.currentTarget.style.opacity = "0.56";
                }}
              >
                {thumbUrl ? (
                  <Image
                    src={thumbUrl}
                    alt=""
                    fill
                    sizes="80px"
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                ) : (
                  <span className="bg-bg-elevated block h-full w-full" />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
