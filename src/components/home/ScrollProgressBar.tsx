"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      if (barRef.current) {
        barRef.current.style.width = `${progress * 100}%`;
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="hidden lg:block"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "2px",
        zIndex: 50,
        backgroundColor: "transparent",
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "0%",
          backgroundColor: "var(--accent-highlight)",
        }}
      />
    </div>
  );
}
