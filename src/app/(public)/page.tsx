"use client";

import { useEffect, useRef, useState } from "react";
import { reelSections } from "@/content/reel-sections";
import ReelSection from "@/components/home/ReelSection";
import ReelThumbnailRail from "@/components/home/ReelThumbnailRail";

export default function HomePage() {
  const [sections, setSections] = useState(reelSections);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const isLooping = useRef(false);
  const displaySections = [...sections, sections[0]];
  const closingHeroIndex = displaySections.length - 1;
  const activeRailIndex = activeSectionIndex === closingHeroIndex ? 0 : activeSectionIndex;

  useEffect(() => {
    fetch("/api/featured-projects", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (Array.isArray(data) && data.length > 1) setSections(data); })
      .catch(() => {});
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const sectionIndex = Number(entry.target.getAttribute("data-section-index"));
            setActiveSectionIndex(sectionIndex);
          }
        });
      },
      { threshold: [0.5] },
    );

    sectionRefs.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // The closing hero is a visual duplicate of the opening hero. As soon as it
  // reaches the viewport, jump to the opening copy at the same visual frame.
  useEffect(() => {
    const handleLoop = () => {
      if (isLooping.current) return;

      const closingHero = sectionRefs.current[closingHeroIndex];
      if (!closingHero || window.scrollY < closingHero.offsetTop - 1) return;

      isLooping.current = true;
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
      setActiveSectionIndex(0);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isLooping.current = false;
        });
      });
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) handleLoop();
    };

    window.addEventListener("scroll", handleLoop, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    handleLoop();

    return () => {
      window.removeEventListener("scroll", handleLoop);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [closingHeroIndex]);

  const handleThumbnailClick = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const railSections = sections.map((s) => ({
    id: s.id,
    muxPlaybackId: s.muxPlaybackId,
    title: s.title,
  }));

  return (
    <>
      <ReelThumbnailRail
        sections={railSections}
        activeIndex={activeRailIndex}
        onThumbnailClick={handleThumbnailClick}
      />
      <div className="reel" aria-label="Featured projects">
        {displaySections.map((section, i) => {
          const isClosingHero = i === displaySections.length - 1;

          return (
            <section
              key={isClosingHero ? `${section.id}-closing` : section.id}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              id={isClosingHero ? "reel-section-studio-hero-closing" : `reel-section-${section.id}`}
              data-section-index={String(i)}
              aria-label={
                isClosingHero
                  ? `${section.title.replace("\n", " ")}, closing`
                  : section.title.replace("\n", " ")
              }
              style={{
                position: "relative",
                height: "100svh",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <ReelSection {...section} isActive={activeSectionIndex === i} />
            </section>
          );
        })}
      </div>
    </>
  );
}
