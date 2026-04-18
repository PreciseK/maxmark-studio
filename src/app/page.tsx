"use client";

import { useEffect, useRef, useState } from "react";
import { reelSections } from "@/content/reel-sections";
import ReelSection from "@/components/home/ReelSection";
import ReelThumbnailRail from "@/components/home/ReelThumbnailRail";
import ScrollProgressBar from "@/components/home/ScrollProgressBar";

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = Number(entry.target.getAttribute("data-section-index"));
            setActiveIndex(index);
          }
        });
      },
      { threshold: [0.5] },
    );

    sectionRefs.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleThumbnailClick = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const railSections = reelSections.map((s) => ({
    id: s.id,
    muxPlaybackId: s.muxPlaybackId,
    title: s.title,
  }));

  return (
    <>
      <ReelThumbnailRail
        sections={railSections}
        activeIndex={activeIndex}
        onThumbnailClick={handleThumbnailClick}
      />
      <ScrollProgressBar />
      <main>
        {reelSections.map((section, i) => (
          <section
            key={section.id}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            id={`reel-section-${i}`}
            data-section-index={String(i)}
            style={{
              position: "relative",
              height: "100dvh",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <ReelSection {...section} index={i} isActive={activeIndex === i} />
          </section>
        ))}
      </main>
    </>
  );
}
