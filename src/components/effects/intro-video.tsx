"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Volume2, VolumeX, FastForward, Crosshair } from "lucide-react";

const SESSION_KEY = "techsrijan_intro_video_played";

interface IntroVideoProps {
  src?: string;
  poster?: string;
}

export function IntroVideo({
  src = "/intro.mp4",
  poster = "/intro-poster.jpg",
}: IntroVideoProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check sessionStorage on mount (scoped per browser tab)
  useEffect(() => {
    const hasSeen = sessionStorage.getItem(SESSION_KEY);
    if (!hasSeen) {
      setShouldRender(true);
    }
  }, []);

  const handleComplete = useCallback(() => {
    setIsFading(true);
    sessionStorage.setItem(SESSION_KEY, "true");
    setTimeout(() => {
      setShouldRender(false);
    }, 600);
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

  // Lock body scroll while intro is visible
  useEffect(() => {
    if (shouldRender) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [shouldRender]);

  const handleStartPlay = async () => {
    if (!videoRef.current) return;
    try {
      videoRef.current.muted = isMuted;
      await videoRef.current.play();
      setIsPlaying(true);
    } catch {
      // If unmuted playback is blocked on mobile, fallback to muted
      if (videoRef.current) {
        videoRef.current.muted = true;
        setIsMuted(true);
        await videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col justify-between bg-black overflow-hidden select-none transition-opacity duration-700 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Video Layer */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        webkit-playsinline="true"
        preload="auto"
        onEnded={handleComplete}
        onError={() => {
          // Gracefully skip to main site if video fails to load
          handleComplete();
        }}
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      />

      {/* Atmospheric Film Texture & Vignette */}
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
          {isPlaying && (
            <button
              type="button"
              onClick={toggleAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] sm:text-xs tracking-widest uppercase border border-[var(--border,#d4a8432e)] bg-black/60 backdrop-blur-md text-[var(--accent-primary,#d4a843)] hover:bg-[var(--accent-primary,#d4a843)] hover:text-black transition-all rounded active:scale-95"
            >
              {isMuted ? (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">UNMUTE</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">MUTE</span>
                </>
              )}
            </button>
          )}

          {/* Top Skip Button */}
          <button
            type="button"
            onClick={handleComplete}
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

      {/* Center Interactive Enter Overlay (Before Playback Starts) */}
      {!isPlaying && (
        <div
          onClick={handleStartPlay}
          className="relative z-20 mx-auto flex flex-col items-center justify-center cursor-pointer px-4 text-center my-auto"
        >
          {/* Pulsing Tactical Ring & Enter Button */}
          <div className="group relative flex flex-col items-center">
            {/* Ambient Conic / Glow Behind */}
            <div className="absolute -inset-4 rounded-full bg-[var(--accent-primary,#d4a843)] opacity-20 blur-xl group-hover:opacity-40 transition-opacity animate-pulse" />

            {/* Enter Button */}
            <button
              type="button"
              onClick={handleStartPlay}
              className="mecha-bracket relative inline-flex items-center gap-3 px-8 py-3.5 sm:px-10 sm:py-4 font-mono text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-black bg-[var(--accent-primary,#d4a843)] hover:bg-[var(--accent-secondary,#f3ce7a)] border border-[var(--accent-primary,#d4a843)] shadow-[0_0_35px_rgba(212,168,67,0.45)] transition-all transform active:scale-95"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>ENTER TECHSRIJAN</span>
            </button>

            {/* Prompt Subtext */}
            <p className="mt-4 font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[var(--accent-secondary,#f3ce7a)] opacity-90 uppercase">
              [ CLICK TO INITIALIZE TRANSMISSION WITH AUDIO ]
            </p>
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
