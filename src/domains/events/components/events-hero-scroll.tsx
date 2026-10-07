"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArenaSpatialCards } from "./arena-spatial-cards";

interface EventsHeroScrollProps {
  onScrollProgress?: (progress: number) => void;
}

export function EventsHeroScroll({ onScrollProgress }: EventsHeroScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const poster1Ref = useRef<HTMLDivElement>(null);
  const poster2Ref = useRef<HTMLDivElement>(null);
  const poster3Ref = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

  const [, setVideoDuration] = useState(6.04);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isArenaVisible, setIsArenaVisible] = useState(false);
  const isArenaVisibleRef = useRef(false);

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

  // Zero-reconciliation RAF scroll loop: updates styles via direct DOM mutation
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
        if (onScrollProgress) onScrollProgress(p);

        // Hardware DOM Style Updates without triggering React reconciliation:
        if (poster1Ref.current) {
          poster1Ref.current.style.opacity = p < 0.60 ? "1" : "0";
        }
        if (poster2Ref.current) {
          poster2Ref.current.style.opacity = p >= 0.60 && p < 0.76 ? "1" : "0";
        }
        if (poster3Ref.current) {
          poster3Ref.current.style.opacity = p >= 0.76 ? "1" : "0";
        }
        if (vignetteRef.current) {
          vignetteRef.current.style.opacity = String(Math.max(0, 1 - p * 1.8));
        }
        if (heroTextRef.current) {
          const heroOpacity = Math.max(0, 1 - p * 2.2);
          const heroTranslateY = -p * 70;
          heroTextRef.current.style.opacity = String(heroOpacity);
          heroTextRef.current.style.transform = `translateY(${heroTranslateY}px)`;
          heroTextRef.current.style.display = heroOpacity <= 0.01 ? "none" : "flex";
        }

        // Only trigger discrete React re-render when arena visibility boundary is crossed
        const arenaActive = p >= 0.76;
        if (arenaActive !== isArenaVisibleRef.current) {
          isArenaVisibleRef.current = arenaActive;
          setIsArenaVisible(arenaActive);
        }

        // Calibrated two-phase video timeline:
        // - Frame 1 (t = 0.0s): Hero close-up with sword down
        // - Frame 2 (t = 2.85s): Feyd walking down steps, sword held high on podium
        // - Arena (t = 3.71s): Wide stadium arena cut
        const video = videoRef.current;
        if (video && video.duration) {
          const tFrame1 = 0;
          const tFrame2 = 2.85;
          const tArena = 3.71;

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
            target = Math.min(video.duration - 0.05, tArena + (p - 0.78) * 0.4);
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

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[300vh] sm:min-h-[320vh] bg-black select-none"
    >
      {/* Sticky Fullscreen Arena Stage */}
      <div className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden bg-black">
        {/* Layer 0: High-Resolution Baseline Posters */}
        <div
          ref={poster1Ref}
          className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-500"
          style={{
            backgroundImage: "url('/events-hero-poster.png')",
            backgroundSize: "cover",
            backgroundPosition: "center right",
            opacity: 1,
          }}
        />
        <div
          ref={poster2Ref}
          className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-500"
          style={{
            backgroundImage: "url('/events-mid-poster.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0,
          }}
        />
        <div
          ref={poster3Ref}
          className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-500"
          style={{
            backgroundImage: "url('/events-arena-poster.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0,
          }}
        />

        {/* Layer 1: Hardware-Accelerated Video Scrubber */}
        <video
          ref={videoRef}
          src="/events.mp4"
          poster="/events-hero-poster.png"
          playsInline
          muted
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          onSeeked={handleSeeked}
          className="absolute inset-0 h-full w-full object-cover object-right sm:object-center pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isVideoLoaded ? 1 : 0.9,
            zIndex: 2,
          }}
        />

        {/* Layer 2: Deep Obsidian Left Vignette (Guarantees crisp typography readability and void contrast) */}
        <div
          ref={vignetteRef}
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 85%, transparent 100%)",
            opacity: 1,
          }}
        />

        {/* Top Gradient for Navbar legibility */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-20" />

        {/* Layer 3: Left-Side Hero Text (Stuck at first frame with Feyd-Rautha on right) */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 z-30 flex items-center px-6 sm:px-12 md:px-16 lg:px-24 pointer-events-none"
          style={{
            opacity: 1,
            transform: "translateY(0px)",
          }}
        >
          <div className="max-w-xl text-left">
            {/* Stark Monochromatic Hero Title */}
            <h1 className="font-serif tracking-tight text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,1)]">
              EVENTS
            </h1>

            {/* Dune Style Morale Quote */}
            <p className="mt-6 sm:mt-8 font-serif text-lg sm:text-xl md:text-2xl tracking-[0.15em] text-neutral-300 max-w-2xl leading-relaxed uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] italic">
              &ldquo;Fear is the mind-killer. Beyond fear lies destiny. Step into the crucible and forge your legacy.&rdquo;
            </p>
          </div>
        </div>

        {/* Layer 4: Spatial Event Cards — appear smoothly when entering the arena */}
        <ArenaSpatialCards isVisible={isArenaVisible} />
      </div>
    </div>
  );
}
