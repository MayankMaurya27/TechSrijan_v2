"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, FastForward } from "lucide-react";
import { isMobileDevice } from "@/lib/device-tier";

const SESSION_KEY = "techsrijan_intro_video_played";

export interface IntroVideoProps {
  src?: string;
  poster?: string;
  onComplete?: () => void;
  isFading?: boolean;
}

export function IntroVideo({
  src = "/videos/intro.mp4",
  poster = "/images/intro-poster.jpg",
  onComplete,
  isFading = false,
}: IntroVideoProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [activeSrc, setActiveSrc] = useState(src);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCompletedRef = useRef(false);

  const forceScrollTop = useCallback(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (window.__lenis && typeof window.__lenis.scrollTo === "function") {
        window.__lenis.scrollTo(0, { immediate: true });
      }
    }
  }, []);

  const handleComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {}
      window.dispatchEvent(new CustomEvent("intro-complete"));
    }

    forceScrollTop();
    if (onComplete) {
      onComplete();
    }
  }, [forceScrollTop, onComplete]);

  useEffect(() => {
    forceScrollTop();
    if (isMobileDevice()) {
      setActiveSrc("/intro-mobile.mp4");
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      forceScrollTop();
    };
  }, [forceScrollTop]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }, [isMuted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        handleComplete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleComplete]);

  const handleContainerClick = () => {
    if (videoRef.current && videoRef.current.muted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const next = !videoRef.current.muted;
      videoRef.current.muted = next;
      setIsMuted(next);
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none transition-opacity duration-700 ease-in-out cursor-pointer ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
    >
      <video
        ref={videoRef}
        src={activeSrc}
        poster={poster}
        autoPlay
        muted={isMuted}
        playsInline
        preload="auto"
        onEnded={handleComplete}
        onError={handleComplete}
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none"
      />

      {/* Atmospheric vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

      {/* Top Controls Bar */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMute}
          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] sm:text-xs tracking-widest uppercase border border-[rgba(212,168,67,0.35)] bg-black/60 backdrop-blur-md text-[#d4a843] hover:bg-[#d4a843] hover:text-black transition-all rounded active:scale-95 cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="h-3.5 w-3.5" />
              <span>UNMUTE</span>
            </>
          ) : (
            <>
              <Volume2 className="h-3.5 w-3.5" />
              <span>MUTE</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleComplete();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase border border-[rgba(212,168,67,0.45)] bg-black/70 backdrop-blur-md text-[#f8eed9] hover:border-[#d4a843] hover:text-[#d4a843] transition-all rounded active:scale-95 cursor-pointer"
        >
          <span>SKIP</span>
          <span className="hidden sm:inline text-[#8a765e]">// ESC</span>
          <FastForward className="h-3 w-3 ml-0.5" />
        </button>
      </div>

      {/* Prominent "CLICK ANYWHERE TO UNMUTE" HUD Button */}
      {isMuted && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#d4a843]/60 bg-black/75 backdrop-blur-md text-[#d4a843] font-mono text-[11px] sm:text-xs tracking-[0.22em] uppercase shadow-[0_0_25px_rgba(212,168,67,0.35)] animate-pulse">
            <Volume2 className="h-4 w-4" />
            <span>CLICK ANYWHERE TO UNMUTE</span>
          </div>
        </div>
      )}
    </div>
  );
}
