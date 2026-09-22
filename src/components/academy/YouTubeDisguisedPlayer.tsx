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

function loadYouTubeApi(callback: () => void) {
  if (typeof window === "undefined") return;
  if (window.YT && window.YT.Player) {
    callback();
    return;
  }

  const prevCallback = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    if (prevCallback) {
      try {
        prevCallback();
      } catch {
        // ignore
      }
    }
    callback();
  };

  if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
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
  const isMountedRef = useRef(true);
  const onEndedRef = useRef(onEnded);
  onEndedRef.current = onEnded;

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

  // Initialize player once
  useEffect(() => {
    isMountedRef.current = true;

    // If player already exists and videoId changed, just load the new video
    if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
      try {
        playerRef.current.loadVideoById(videoId);
        return;
      } catch {
        // Fall through to re-init if player was in an unrecoverable state
      }
    }

    const initPlayer = () => {
      if (!isMountedRef.current || !iframeContainerRef.current || !window.YT || !window.YT.Player) return;

      try {
        const origin = typeof window !== "undefined" ? window.location.origin : undefined;

        playerRef.current = new window.YT.Player(iframeContainerRef.current, {
          videoId,
          host: "https://www.youtube.com",
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            controls: 0,
            enablejsapi: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
            loop: loop ? 1 : 0,
            playlist: loop ? videoId : undefined,
            origin,
            widget_referrer: origin,
          },
          events: {
            onReady: (event: any) => {
              if (!isMountedRef.current) return;
              setIsReady(true);
              try {
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
              } catch {
                // ignore
              }
            },
            onStateChange: (event: any) => {
              if (!isMountedRef.current) return;
              // YT.PlayerState.PLAYING === 1, PAUSED === 2, ENDED === 0
              if (event.data === 1) {
                setIsPlaying(true);
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                setIsPlaying(false);
                if (onEndedRef.current) onEndedRef.current();
              }
            },
            onError: (event: any) => {
              console.warn("YouTube iframe error:", event?.data);
            },
          },
        });
      } catch (err) {
        console.warn("Error initializing YouTube Player:", err);
      }
    };

    loadYouTubeApi(initPlayer);

    return () => {
      isMountedRef.current = false;
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch {
          // ignore
        }
      }
    };
  }, [videoId, autoplay, loop, muted]);

  // Sync mute state if muted prop changes
  useEffect(() => {
    if (playerRef.current) {
      try {
        if (muted) {
          playerRef.current.mute();
          setIsMuted(true);
        } else {
          playerRef.current.unMute();
          setIsMuted(false);
        }
      } catch {
        // ignore
      }
    }
  }, [muted]);

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
    try {
      playerRef.current.seekTo(seekTime, true);
      setCurrentTime(seekTime);
    } catch {
      // ignore
    }
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

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden group bg-black select-none font-mono",
        className
      )}
      onMouseMove={triggerShowControls}
      onMouseEnter={triggerShowControls}
      onClick={togglePlay}
    >
      {/* 1. Underlying YouTube Iframe (Completely disguise brand overlays) */}
      <div className="absolute inset-0 pointer-events-none scale-[1.35] origin-center">
        <div ref={iframeContainerRef} className="w-full h-full" />
      </div>

      {/* 2. Glass Ambient Scrim Overlay (Film Noir Cinema Feel) */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300 pointer-events-none",
          isPlaying && !showControls
            ? "opacity-0"
            : "opacity-100 bg-gradient-to-t from-black/80 via-black/20 to-black/40 backdrop-blur-[0.5px]"
        )}
      />

      {/* 3. Center Play/Pause Pulsing Trigger (when paused) */}
      {!isPlaying && isReady && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* 4. Top Header Bar (Title & Mode) */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 p-6 flex justify-between items-start transition-opacity duration-300 z-10",
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest text-[#E3FF39] font-bold uppercase">
            MAXMARK CINEMA PLAYER // 4K REEL
          </span>
          <h4 className="text-sm font-bold text-white tracking-wide uppercase line-clamp-1">
            {title}
          </h4>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] text-neutral-300 tracking-wider uppercase">
          {isPlaying ? "Live Stream" : "Ready"}
        </div>
      </div>

      {/* 5. Custom Bottom Player Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 p-6 space-y-3 transition-opacity duration-300 z-10",
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrubber Bar */}
        <div
          className="relative h-1.5 w-full bg-white/20 rounded-full cursor-pointer overflow-hidden group/bar transition-all hover:h-2.5"
          onClick={handleSeek}
        >
          <div
            className="absolute top-0 left-0 bottom-0 bg-[#E3FF39] rounded-full shadow-[0_0_12px_#E3FF39] transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Buttons and Time Display */}
        <div className="flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="hover:text-[#E3FF39] transition-colors focus:outline-none"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Mute Button */}
            <button
              type="button"
              onClick={toggleMute}
              className="hover:text-[#E3FF39] transition-colors focus:outline-none"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>

            {/* Time Stamp */}
            <span className="text-[11px] text-neutral-400 font-mono tracking-wider">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="hover:text-[#E3FF39] transition-colors focus:outline-none"
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
