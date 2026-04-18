"use client";

import { useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { getMuxThumbnail } from "@/lib/mux";

interface MuxLoopPlayerProps {
  playbackId: string;
  title?: string;
  className?: string;
}

// MuxPlayer accepts CSS custom properties (--controls etc.) via its own type
type MuxStyleProps = React.CSSProperties & { [key: `--${string}`]: string | undefined };

export default function MuxLoopPlayer({ playbackId, title, className }: MuxLoopPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const isPlaceholder = playbackId.startsWith("PLACEHOLDER_");
  const posterUrl = getMuxThumbnail(playbackId, { time: 0, width: 1280 });

  // Respect prefers-reduced-motion — render poster only
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  if (isPlaceholder || prefersReduced) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "var(--bg-elevated)",
          backgroundImage: isPlaceholder ? undefined : `url(${posterUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  const muxStyle: MuxStyleProps = {
    "--controls": "none",
    "--media-object-fit": "cover",
    "--media-object-position": "center",
    width: "100%",
    height: "100%",
    display: "block",
  };

  return (
    <div ref={containerRef} className={className} style={{ width: "100%", height: "100%" }}>
      <MuxPlayer
        playbackId={playbackId}
        streamType="on-demand"
        autoPlay="muted"
        loop
        muted
        playsInline
        preload="auto"
        nohotkeys
        disableCookies
        title={title}
        poster={posterUrl}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        style={muxStyle as any}
      />
    </div>
  );
}
