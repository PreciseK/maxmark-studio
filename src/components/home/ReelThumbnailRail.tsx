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
    <div
      className="hidden lg:flex"
      style={{
        position: "fixed",
        top: "50%",
        left: "24px",
        transform: "translateY(-50%)",
        zIndex: 30,
        flexDirection: "column",
        gap: "8px",
      }}
      role="list"
      aria-label="Reel navigation"
    >
      {sections.map((section, i) => {
        const isActive = i === activeIndex;
        const isPlaceholder = section.muxPlaybackId.startsWith("PLACEHOLDER_");
        const thumbUrl = isPlaceholder
          ? null
          : getMuxThumbnail(section.muxPlaybackId, { width: 200, height: 140 });

        return (
          <button
            key={section.id}
            role="listitem"
            aria-label={`Go to ${section.title}`}
            aria-current={isActive ? "true" : "false"}
            onClick={() => onThumbnailClick(i)}
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
              border: "none",
              transition: "opacity 200ms ease, box-shadow 200ms ease, filter 200ms ease",
              opacity: isActive ? 1 : 0.55,
              boxShadow: isActive
                ? "0 0 0 2px #0a0a0a, 0 0 0 4px var(--accent-highlight)"
                : "none",
              filter: isActive
                ? "drop-shadow(0 0 6px rgba(212,255,62,0.45))"
                : "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.opacity = "0.55";
            }}
          >
            {thumbUrl ? (
              <Image
                src={thumbUrl}
                alt={section.title}
                fill
                sizes="72px"
                style={{ objectFit: "cover" }}
                unoptimized
              />
            ) : (
              <div style={{ width: "100%", height: "100%", backgroundColor: "var(--bg-elevated)" }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
