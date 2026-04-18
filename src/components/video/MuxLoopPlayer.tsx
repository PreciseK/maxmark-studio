"use client";

import { useRef, useEffect } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { getMuxThumbnail } from "@/lib/mux";

interface MuxLoopPlayerProps {
  playbackId: string;
  title?: string;
  className?: string;
  /** When true, pauses the video. When false/undefined, plays it. */
  paused?: boolean;
}

type MuxStyleProps = React.CSSProperties & { [key: `--${string}`]: string | undefined };

type MuxPlayerEl = HTMLVideoElement & { play(): Promise<void>; pause(): void };

export default function MuxLoopPlayer({
  playbackId,
  title,
  className,
  paused,
}: MuxLoopPlayerProps) {
  const isPlaceholder = playbackId.startsWith("PLACEHOLDER_");
  const posterUrl = getMuxThumbnail(playbackId, { time: 0, width: 1280 });

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const muxPlayerRef = useRef<MuxPlayerEl | null>(null);

  useEffect(() => {
    if (!muxPlayerRef.current || isPlaceholder || prefersReduced) return;
    if (paused) {
      muxPlayerRef.current.pause();
    } else {
      muxPlayerRef.current.play().catch(() => {});
    }
  }, [paused, isPlaceholder, prefersReduced]);

  if (isPlaceholder || prefersReduced) {
    return (
      <div
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
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <MuxPlayer
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={muxPlayerRef as any}
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
