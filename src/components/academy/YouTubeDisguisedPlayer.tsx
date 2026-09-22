"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/cn";

type YouTubeDisguisedPlayerProps = {
  videoId: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  title?: string;
  onEnded?: () => void;
};

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function YouTubeDisguisedPlayer({
  videoId,
  autoplay = false,
  loop = false,
  muted = true,
  className,
  title = "Course Video",
  onEnded,
}: YouTubeDisguisedPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Load YouTube IFrame API
  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      if (!iframeContainerRef.current || !window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player(iframeContainerRef.current, {
        videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          loop: loop ? 1 : 0,
          playlist: loop ? videoId : undefined,
          origin: typeof window !== "undefined" ? window.location.origin : "",
        },
        events: {
          onReady: (event: any) => {
            if (!isMounted) return;
            setIsReady(true);
            const dur = event.target.getDuration();
            setDuration(dur);
            if (muted) {
              event.target.mute();
              setIsMuted(true);
            } else {
              event.target.unMute();
              setIsMuted(false);
            }
            if (autoplay) {
              event.target.playVideo();
              setIsPlaying(true);
            }
          },
          onStateChange: (event: any) => {
            if (!isMounted) return;
            // YT.PlayerState.PLAYING === 1, PAUSED === 2, ENDED === 0
            if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2) {
              setIsPlaying(false);
            } else if (event.data === 0) {
              setIsPlaying(false);
              if (onEnded) onEnded();
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      isMounted = false;
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [videoId, autoplay, loop, muted, onEnded]);

  // Track playback time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && playerRef.current?.getCurrentTime) {
      interval = setInterval(() => {
        try {
          const current = playerRef.current.getCurrentTime();
          setCurrentTime(current);
          const total = playerRef.current.getDuration();
          if (total && total !== duration) {
            setDuration(total);
          }
        } catch {
          // Player not yet accessible
        }
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration]);

  // Controls auto-hide
  const triggerShowControls = useCallback(() => {
    setShowControls(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3200);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        if (isMuted && muted) {
          playerRef.current.unMute();
          setIsMuted(false);
        }
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch {
      // ignore
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch {
      // ignore
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const seekTime = pos * duration;
    playerRef.current.seekTo(seekTime, true);
    setCurrentTime(seekTime);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full aspect-video bg-black overflow-hidden select-none rounded-xl border border-white/10 group shadow-2xl",
        className
      )}
      onMouseMove={triggerShowControls}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 1. Underlying YouTube iframe container */}
      <div className="absolute inset-0 pointer-events-none scale-105">
        <div ref={iframeContainerRef} className="w-full h-full" />
      </div>

      {/* 2. Top Shield: In-visible protective glass bar covering YouTube brand title / share buttons */}
      <div
        className="absolute top-0 left-0 right-0 h-16 z-20 pointer-events-auto cursor-pointer"
        onClick={togglePlay}
      />

      {/* 3. Click Overlay covering entire video */}
      <div
        className="absolute inset-0 z-10 cursor-pointer pointer-events-auto"
        onClick={togglePlay}
        aria-label="Toggle Play/Pause"
      />

      {/* 4. Centered Play Button (Maxmark Animations Style) */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer pointer-events-auto flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 group/play"
          style={{
            background: "rgba(10, 10, 10, 0.65)",
            border: "1px solid var(--border-strong)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
          }}
        >
          <svg
            className="w-7 h-7 text-white fill-current ml-1 transition-colors duration-200 group-hover/play:text-[var(--accent-highlight)]"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      {/* 5. Floating Controls Dock */}
      <div
        className={cn(
          "absolute bottom-4 left-4 right-4 z-30 px-6 py-3.5 rounded-xl flex flex-col gap-2.5 transition-all duration-300 pointer-events-auto",
          showControls || !isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        )}
        style={{
          background: "rgba(10, 10, 10, 0.85)",
          border: "1px solid var(--border-strong)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Scrubber Timeline */}
        <div
          onClick={handleSeek}
          className="relative w-full h-1.5 hover:h-2 bg-white/20 rounded-full cursor-pointer transition-all duration-150 overflow-hidden"
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%`, backgroundColor: "var(--accent-highlight)" }}
          />
        </div>

        {/* Controls Row */}
        <div
          className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase"
          style={{ fontFamily: "var(--font-geist-mono)", color: "var(--fg-primary)" }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="hover:text-[var(--accent-highlight)] transition-colors duration-150 py-1 cursor-pointer"
            >
              {isPlaying ? "PAUSE" : "PLAY"}
            </button>
            <span style={{ color: "var(--fg-muted)", fontFamily: "var(--font-geist-mono)", fontSize: "10px" }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={toggleMute}
              className="hover:text-[var(--accent-highlight)] transition-colors duration-150 py-1 cursor-pointer"
            >
              {isMuted ? "SOUND OFF" : "SOUND ON"}
            </button>
            <button
              onClick={toggleFullscreen}
              className="hover:text-[var(--accent-highlight)] transition-colors duration-150 py-1 cursor-pointer"
            >
              {isFullscreen ? "EXIT" : "FULLSCREEN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
