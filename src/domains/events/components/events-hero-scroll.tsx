"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowDown, Shield, Terminal, Zap } from "lucide-react";
import { ArenaSpatialCards } from "./arena-spatial-cards";

interface EventsHeroScrollProps {
  onScrollProgress?: (progress: number) => void;
}

export function EventsHeroScroll({ onScrollProgress }: EventsHeroScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(6.04);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isSeekingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const seekWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Smooth hardware-accelerated video seeking
  const attemptSeek = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    if (isSeekingRef.current) return;

    const maxSafe = Math.max(0, video.duration - 0.05);
    const target = Math.max(0, Math.min(maxSafe, targetTimeRef.current));

    if (Math.abs(video.currentTime - target) > 0.02) {
      isSeekingRef.current = true;
      video.currentTime = target;

      if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);
      seekWatchdogRef.current = setTimeout(() => {
        isSeekingRef.current = false;
        attemptSeek();
      }, 100);
    }
  }, []);

  const handleSeeked = useCallback(() => {
    if (seekWatchdogRef.current) {
      clearTimeout(seekWatchdogRef.current);
      seekWatchdogRef.current = null;
    }
    isSeekingRef.current = false;

    const video = videoRef.current;
    if (video && video.duration) {
      const maxSafe = Math.max(0, video.duration - 0.05);
      const target = Math.max(0, Math.min(maxSafe, targetTimeRef.current));
      if (Math.abs(video.currentTime - target) > 0.02) {
        attemptSeek();
      }
    }
  }, [attemptSeek]);

  // Video loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || 6.04);
      setIsVideoLoaded(true);
    }
  };

  // Scroll handler with calibrated 2-speed curve:
  // SLOW between Frame 1 (close-up) and Frame 2 (sword raised), then FAST into the Arena
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        if (!containerRef.current) {
          ticking = false;
          return;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const winH = window.innerHeight;
        const totalDist = rect.height - winH;
        if (totalDist <= 0) {
          ticking = false;
          return;
        }

        // Progress 0.0 (top) to 1.0 (end of video scrub track)
        const p = Math.max(0, Math.min(1, -rect.top / totalDist));
        setProgress(p);
        if (onScrollProgress) onScrollProgress(p);

        // Calibrated two-phase video timeline:
        // - Frame 1 (t = 0.0s): Hero close-up
        // - Frame 2 (t = 3.50s): Feyd walking on podium, sword held high
        // - Arena (t = 5.04s): Wide stadium arena cut
        //
        // Phase 1 (SLOW): p = 0.00 -> 0.65 (65% of scroll distance allocated to Frame 1 -> Frame 2)
        // Phase 2 (FAST): p = 0.65 -> 0.78 (only 13% of scroll distance to transition from Frame 2 into the Arena)
        // Phase 3 (ARENA): p >= 0.78 (Event boxes visible and locked in the stadium arena)
        const video = videoRef.current;
        if (video && video.duration) {
          const tFrame1 = 0;
          const tFrame2 = 3.5;
          const tArena = 5.04;

          let target = 0;
          if (p <= 0.65) {
            // Slow progression between Frame 1 and Frame 2
            const norm = p / 0.65;
            target = tFrame1 + norm * (tFrame2 - tFrame1);
          } else if (p <= 0.78) {
            // Fast progression from Frame 2 to Arena
            const norm = (p - 0.65) / (0.78 - 0.65);
            target = tFrame2 + norm * (tArena - tFrame2);
          } else {
            // Settle in the arena
            target = Math.min(video.duration - 0.05, tArena + (p - 0.78) * 4.0);
          }

          targetTimeRef.current = Math.max(0, Math.min(video.duration - 0.05, target));
          attemptSeek();
        }

        ticking = false;
      });
      ticking = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);
    };
  }, [attemptSeek, onScrollProgress]);

  // Fade out left hero text smoothly during the first half of the slow scroll
  const heroOpacity = Math.max(0, 1 - progress * 2.2);
  const heroTranslateY = -progress * 70;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[280vh] sm:min-h-[320vh] bg-black select-none"
    >
      {/* Sticky Fullscreen Arena Stage */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden bg-black">
        {/* Layer 0: High-Resolution Baseline Posters */}
        <div
          className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-500 bg-cover bg-[72%_center] sm:bg-center"
          style={{
            backgroundImage: "url('/events-hero-poster.webp')",
            opacity: progress < 0.60 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-500 bg-cover bg-center"
          style={{
            backgroundImage: "url('/events-mid-poster.webp')",
            opacity: progress >= 0.60 && progress < 0.76 ? 1 : 0,
          }}
        />
        <div
          className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-500 bg-cover bg-center"
          style={{
            backgroundImage: "url('/events-arena-poster.webp')",
            opacity: progress >= 0.76 ? 1 : 0,
          }}
        />

        {/* Layer 1: Hardware-Accelerated Video Scrubber (Upscaled 2560x1440 QHD) */}
        <video
          ref={videoRef}
          src="/event_video.mp4"
          poster="/events-hero-poster.webp"
          playsInline
          muted
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          onSeeked={handleSeeked}
          className="absolute inset-0 h-full w-full object-cover object-[72%_center] sm:object-center pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isVideoLoaded ? 1 : 0.9,
            zIndex: 2,
            filter: "contrast(1.04) brightness(1.02)",
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
          }}
        />

        {/* Layer 2: Deep Obsidian Left Vignette (Guarantees crisp typography readability and void contrast) */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 85%, transparent 100%)",
            opacity: Math.max(0, 1 - progress * 1.8),
          }}
        />

        {/* Top Gradient for Navbar legibility */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-20" />

        {/* Layer 3: Left-Side Hero Text (Stuck at first frame with Feyd-Rautha on right) */}
        <div
          className="absolute inset-0 z-30 flex items-center px-5 sm:px-12 md:px-16 lg:px-24 pointer-events-none"
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroTranslateY}px)`,
            display: heroOpacity <= 0.01 ? "none" : "flex",
          }}
        >
          <div className="max-w-[85vw] sm:max-w-xl text-left">
            {/* Stark Monochromatic Hero Title (Montserrat Heading) */}
            <h1 className="font-montserrat tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,1)]">
              EVENTS
            </h1>

            {/* Dune Style Morale Quote (Chancery Italic) */}
            <p className="mt-4 sm:mt-8 font-chancery text-base sm:text-xl md:text-2xl tracking-wide text-neutral-300 max-w-2xl leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] italic">
              &ldquo;Fear is the mind-killer. Beyond fear lies destiny. Step into the crucible and forge your legacy.&rdquo;
            </p>

            {/* Mobile scroll cue pill (Bebas Neue Subheading) */}
            <div className="mt-6 sm:hidden inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-bebas text-xs tracking-widest uppercase text-neutral-300">SCROLL TO ENTER THE ARENA</span>
            </div>
          </div>
        </div>

        {/* Layer 4: Spatial Event Cards — appear smoothly when entering the arena */}
        <ArenaSpatialCards isVisible={progress >= 0.76} />
      </div>
    </div>
  );
}
