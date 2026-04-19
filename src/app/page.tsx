"use client";

import { useEffect, useRef, useState } from "react";
import { reelSections } from "@/content/reel-sections";
import ReelSection from "@/components/home/ReelSection";
import ReelThumbnailRail from "@/components/home/ReelThumbnailRail";
import ScrollProgressBar from "@/components/home/ScrollProgressBar";

// TODO: anchor links from other pages (e.g. /#reel-section-ritual-of-motion)
// should resolve to the middle-copy equivalent section.

function lenisScrollTo(y: number) {
  const lenis = (window as any).__lenis;
  if (lenis) {
    lenis.scrollTo(y, { immediate: true });
  } else {
    window.scrollTo(0, y);
  }
}

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const isLooping = useRef(false);
  const sectionCount = reelSections.length;
  const totalCount = sectionCount * 3;

  const loopedSections = [...reelSections, ...reelSections, ...reelSections];

  // Start scrolled to the middle copy
  useEffect(() => {
    const targetY = window.innerHeight * sectionCount;
    lenisScrollTo(targetY);
  }, [sectionCount]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const rawIndex = Number(entry.target.getAttribute("data-section-index"));
            setActiveIndex(rawIndex % sectionCount);
          }
        });
      },
      { threshold: [0.5] },
    );

    sectionRefs.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, [sectionCount]);

  // Seamless infinite loop: jump when approaching either edge copy
  useEffect(() => {
    const handleScroll = () => {
      if (isLooping.current) return;
      const sectionHeight = window.innerHeight;
      const scrollY = window.scrollY;

      if (scrollY < sectionHeight * 0.5) {
        isLooping.current = true;
        lenisScrollTo(scrollY + sectionHeight * sectionCount);
        requestAnimationFrame(() => {
          isLooping.current = false;
        });
      } else if (scrollY > sectionHeight * (totalCount - 1.5)) {
        isLooping.current = true;
        lenisScrollTo(scrollY - sectionHeight * sectionCount);
        requestAnimationFrame(() => {
          isLooping.current = false;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionCount, totalCount]);

  const handleThumbnailClick = (index: number) => {
    const targetIndex = sectionCount + index;
    sectionRefs.current[targetIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        {loopedSections.map((section, i) => (
          <section
            key={`${section.id}-${i}`}
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
            <ReelSection
              {...section}
              index={i}
              isActive={activeIndex === i % sectionCount}
            />
          </section>
        ))}
      </main>
    </>
  );
}
