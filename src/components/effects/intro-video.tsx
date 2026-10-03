"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, FastForward, Crosshair } from "lucide-react";

interface IntroVideoProps {
  src?: string;
  poster?: string;
}

export function IntroVideo({
  src = "/intro.mp4",
  poster = "/intro-poster.jpg",
}: IntroVideoProps) {
  const [shouldRender, setShouldRender] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCompletedRef = useRef(false);

  // Guarantee instant scroll reset to top of landing page
  const forceScrollTop = useCallback(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      }
    }
  }, []);

  const handleComplete = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    // Immediately anchor to top
    forceScrollTop();
    setIsFading(true);

    // Notify other components (ScrollJourney, etc.) to synchronize to 0
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("intro-complete"));
    }

    setTimeout(() => {
      setShouldRender(false);
      forceScrollTop();
    }, 500);
  }, [forceScrollTop]);

  // Initial scroll-to-top on mount
  useEffect(() => {
    forceScrollTop();
  }, [forceScrollTop]);

  // Attempt instant autoplay on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback if browser policies restrict autoplay
      });
    }
  }, []);

  // Listen for ESC key to skip
  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleComplete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shouldRender, handleComplete]);

  // Lock body scroll while intro is visible, and enforce top scroll on unmount
  useEffect(() => {
    if (shouldRender) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      forceScrollTop();
      return () => {
        document.body.style.overflow = originalOverflow;
        forceScrollTop();
      };
    }
  }, [shouldRender, forceScrollTop]);

  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      setHasInteracted(true);
    }
  };

  const handleScreenClick = () => {
    // If clicking screen while muted, unmute for cinematic experience
    if (videoRef.current && videoRef.current.muted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setHasInteracted(true);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      onClick={handleScreenClick}
      className={`fixed inset-0 z-[9999] flex flex-col justify-between bg-black overflow-hidden select-none transition-opacity duration-500 cursor-pointer ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Video Layer */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        onEnded={handleComplete}
        onError={handleComplete}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Atmospheric Film Texture & Subtle Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
      <div className="pointer-events-none absolute inset-0 bg-radial-vignette opacity-50" />

      {/* Top HUD Bar */}
      <header className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
        {/* Telemetry Branding */}
        <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs tracking-[0.25em] text-[var(--accent-primary,#d4a843)]">
          <Crosshair className="h-3.5 w-3.5 animate-spin-slow opacity-80" />
          <span className="font-bold">TECHSRIJAN // 2026</span>
          <span className="hidden md:inline text-[var(--text-muted,#6b5944)]">
            :: TRANSMISSION SEQUENCE
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] sm:text-xs tracking-widest uppercase border border-[var(--border,#d4a8432e)] bg-black/60 backdrop-blur-md text-[var(--accent-primary,#d4a843)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black transition-all rounded active:scale-95"
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

          {/* Top Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase border border-[var(--border-accent,#d4a84373)] bg-black/70 backdrop-blur-md text-[var(--text-primary,#f8eed9)] hover:border-[var(--accent-primary,#d4a843)] hover:text-[var(--accent-primary,#d4a843)] hover:shadow-[0_0_15px_rgba(212,168,67,0.3)] transition-all rounded active:scale-95"
          >
            <span>SKIP</span>
            <span className="hidden sm:inline text-[var(--text-muted,#6b5944)]">
              // ESC
            </span>
            <FastForward className="h-3 w-3 ml-0.5" />
          </button>
        </div>
      </header>

      {/* Ambient Unmute Prompt if still muted */}
      {isMuted && !hasInteracted && (
        <div className="relative z-20 mx-auto pointer-events-none animate-pulse text-center px-4 my-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-accent,#d4a84340)] bg-black/50 backdrop-blur-sm text-[var(--accent-primary,#d4a843)] font-mono text-[11px] sm:text-xs tracking-[0.2em] uppercase">
            <Volume2 className="h-3.5 w-3.5" />
            <span>CLICK ANYWHERE TO UNMUTE AUDIO</span>
          </div>
        </div>
      )}

      {/* Bottom Telemetry Footer */}
      <footer className="relative z-20 flex items-center justify-between px-4 py-3 sm:px-8 sm:py-4 font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-[var(--text-muted,#6b5944)]">
        <div>MADAN MOHAN MALAVIYA UNIVERSITY OF TECHNOLOGY</div>
        <div className="hidden sm:block">AUDIO TRANSMISSION // 48kHz STEREO</div>
      </footer>
    </div>
  );
}
