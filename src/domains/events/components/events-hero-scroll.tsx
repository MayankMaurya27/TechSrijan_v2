"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArenaSpatialCards } from "./arena-spatial-cards";
import type { ClubId } from "./arena-spatial-cards";

// Register GSAP plugins on client
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Radial Dissolution Spark Particles (Matches Stay Section) ────────────────
const DISSOLVE_PARTICLES = [
  { size: 5, top: 26, left: 45, dx: -55, dy: -70, color: "silver" },
  { size: 6, top: 30, left: 53, dx: 65, dy: -80, color: "white" },
  { size: 4, top: 38, left: 48, dx: -85, dy: -30, color: "silver" },
  { size: 7, top: 42, left: 56, dx: 75, dy: -40, color: "dark" },
  { size: 5, top: 48, left: 42, dx: -100, dy: 10, color: "white" },
  { size: 6, top: 54, left: 58, dx: 95, dy: 20, color: "silver" },
  { size: 4, top: 58, left: 46, dx: -65, dy: 55, color: "white" },
  { size: 5, top: 64, left: 54, dx: 55, dy: 65, color: "dark" },
  { size: 6, top: 33, left: 50, dx: 25, dy: -90, color: "white" },
  { size: 4, top: 46, left: 52, dx: -35, dy: -80, color: "silver" },
  { size: 7, top: 56, left: 48, dx: 90, dy: 40, color: "white" },
  { size: 5, top: 60, left: 52, dx: -80, dy: 45, color: "dark" },
  { size: 4, top: 28, left: 47, dx: -45, dy: -55, color: "silver" },
  { size: 5, top: 36, left: 54, dx: 50, dy: -45, color: "white" },
  { size: 6, top: 44, left: 44, dx: -70, dy: -10, color: "silver" },
  { size: 4, top: 50, left: 55, dx: 80, dy: 5, color: "dark" },
];

interface EventsHeroScrollProps {
  onScrollProgress?: (progress: number) => void;
  onClubSelect?: (clubId: ClubId) => void;
}

export function EventsHeroScroll({
  onScrollProgress,
  onClubSelect,
}: EventsHeroScrollProps) {
  // Container & Stage Refs
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const pinnedStageRef = useRef<HTMLDivElement>(null);

  // Video scrubber elements
  const bgArenaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hero text overlay
  const heroTextRef = useRef<HTMLDivElement>(null);

  // Arena card collapse refs
  const leftCardsRef = useRef<HTMLDivElement>(null);
  const centerCardRef = useRef<HTMLDivElement>(null);
  const rightCardsRef = useRef<HTMLDivElement>(null);

  // Stay-style Transition Layers
  const scanBeamRef = useRef<HTMLDivElement>(null);
  const headingScanLinesRef = useRef<HTMLDivElement>(null);
  const lowerSmokeRef = useRef<HTMLDivElement>(null);
  const dissolveParticlesRef = useRef<HTMLDivElement>(null);
  const chamberBgRef = useRef<HTMLDivElement>(null);

  // State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Seeking watchdog
  const isSeekingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const seekWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Hardware-accelerated video seeking
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

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setIsVideoLoaded(true);
    }
  };

  // ─── Smooth Scroll to Our Events Section ─────────────────────────────────────
  const scrollToOurEvents = useCallback(() => {
    const target = document.getElementById("our-events-section");
    if (target) {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(target, { offset: -30, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  // ─── GSAP ScrollTrigger Sequence (Exact Stay Section Physics & Timing) ────────
  useEffect(() => {
    if (typeof window === "undefined" || !scrollWrapperRef.current || !pinnedStageRef.current)
      return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollWrapperRef.current,
          start: "top top",
          end: "+=380%",
          pin: pinnedStageRef.current,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollProgress(p);
            if (onScrollProgress) onScrollProgress(p);

            // Synchronize video scrubber time
            const video = videoRef.current;
            if (video && video.duration) {
              const tFrame1 = 0;
              const tFrame2 = 3.5;
              const tArena = 5.04;

              let target = 0;
              if (p <= 0.28) {
                // Phase 1 (Frame 1 -> Frame 2)
                const norm = p / 0.28;
                target = tFrame1 + norm * (tFrame2 - tFrame1);
              } else if (p <= 0.44) {
                // Phase 2 (Frame 2 -> Arena)
                const norm = (p - 0.28) / 0.16;
                target = tFrame2 + norm * (tArena - tFrame2);
              } else {
                // Settle and dwell inside the arena with subtle slow drift
                target = Math.min(video.duration - 0.05, tArena + Math.min(0.4, (p - 0.44) * 0.8));
              }

              targetTimeRef.current = Math.max(0, Math.min(video.duration - 0.05, target));
              attemptSeek();
            }
          },
        },
      });

      // ─────────────────────────────────────────────────────────────────────────
      // 0.00 - 0.20: Hero Text Fade-out
      // ─────────────────────────────────────────────────────────────────────────
      if (heroTextRef.current) {
        tl.to(
          heroTextRef.current,
          {
            opacity: 0,
            y: -50,
            scale: 0.96,
            ease: "power2.inOut",
            duration: 0.18,
          },
          0
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      // 0.82 - 0.93: Structural Collapse (Left & Right Cards Shoot Outward)
      // Extended dwell time (0.44 to 0.82) allows ample trackpad scroll to browse
      // ─────────────────────────────────────────────────────────────────────────
      if (leftCardsRef.current) {
        tl.to(
          leftCardsRef.current,
          {
            xPercent: -130,
            opacity: 0,
            scaleX: 0.88,
            scaleY: 0.45,
            filter: "grayscale(1) brightness(2.4) contrast(1.8) drop-shadow(0 0 4px rgba(255,255,255,0.9))",
            ease: "power2.inOut",
            duration: 0.11,
          },
          0.82
        );
      }

      if (rightCardsRef.current) {
        tl.to(
          rightCardsRef.current,
          {
            xPercent: 130,
            opacity: 0,
            scaleX: 0.88,
            scaleY: 0.45,
            filter: "grayscale(1) brightness(2.4) contrast(1.8) drop-shadow(0 0 4px rgba(255,255,255,0.9))",
            ease: "power2.inOut",
            duration: 0.11,
          },
          0.82
        );
      }

      if (centerCardRef.current) {
        tl.to(
          centerCardRef.current,
          {
            scale: 0.72,
            y: 40,
            filter: "brightness(0) contrast(300%) blur(8px)",
            opacity: 0,
            ease: "power2.inOut",
            duration: 0.11,
          },
          0.82
        );
      }

      // Horizontal Scanlines Split Flicker
      if (headingScanLinesRef.current) {
        tl.fromTo(
          headingScanLinesRef.current,
          { opacity: 0 },
          { opacity: 0.9, duration: 0.05, yoyo: true, repeat: 1, ease: "steps(3)" },
          0.82
        );
      }

      // Vertical Scan Beam travels downwards across full viewport
      if (scanBeamRef.current) {
        tl.fromTo(
          scanBeamRef.current,
          { y: "-8vh", opacity: 0 },
          {
            y: "112vh",
            opacity: 1,
            ease: "power1.inOut",
            duration: 0.12,
          },
          0.82
        );
        tl.to(
          scanBeamRef.current,
          { opacity: 0, duration: 0.04 },
          0.94
        );
      }

      if (lowerSmokeRef.current) {
        tl.to(
          lowerSmokeRef.current,
          {
            opacity: 0.85,
            y: -25,
            scaleY: 1.35,
            ease: "power1.out",
            duration: 0.11,
          },
          0.82
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      // 0.90 - 0.98: Central Arena Zoom & Dissolve Particle Explosion
      // ─────────────────────────────────────────────────────────────────────────
      if (bgArenaRef.current) {
        tl.to(
          bgArenaRef.current,
          {
            scale: 3.0,
            filter: "blur(18px)",
            opacity: 0,
            ease: "power3.inOut",
            duration: 0.09,
          },
          0.90
        );
      }

      if (dissolveParticlesRef.current) {
        tl.fromTo(
          dissolveParticlesRef.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1.3, duration: 0.04, ease: "power1.out" },
          0.90
        );
        tl.to(
          ".dissolve-spark",
          {
            x: (i) => DISSOLVE_PARTICLES[i % DISSOLVE_PARTICLES.length].dx,
            y: (i) => DISSOLVE_PARTICLES[i % DISSOLVE_PARTICLES.length].dy,
            opacity: 0,
            scale: 0.2,
            duration: 0.08,
            stagger: 0.004,
            ease: "power2.out",
          },
          0.91
        );
      }

      // Abstract Control Chamber Fade-in
      if (chamberBgRef.current) {
        tl.to(
          chamberBgRef.current,
          {
            opacity: 1,
            ease: "power2.inOut",
            duration: 0.09,
          },
          0.90
        );
      }
    }, scrollWrapperRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
      }
      ctx.revert();
    };
  }, [attemptSeek, onScrollProgress]);

  // Dynamic horizontal focal point for mobile so character stays centered
  const mobileFocalX = scrollProgress <= 0.28 ? Math.round(72 - (scrollProgress / 0.28) * 22) : 50;
  const currentFocal = isMobile ? `${mobileFocalX}% center` : "center center";

  return (
    <div
      ref={scrollWrapperRef}
      className="relative w-full min-h-[440vh] sm:min-h-[480vh] bg-black select-none"
    >
      {/* Sticky Fullscreen Pinned Stage for Video & Arena Cards Transition */}
      <div
        ref={pinnedStageRef}
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden bg-black"
      >
        {/* =================================================================== */}
        {/* LAYER 0 & 1: VIDEO SCRUBBER & BASELINE ARENA POSTERS               */}
        {/* =================================================================== */}
        <div ref={bgArenaRef} className="absolute inset-0 h-full w-full will-change-transform z-0">
          <div
            className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-500 bg-cover"
            style={{
              backgroundImage: "url('/events-hero-poster.webp')",
              backgroundPosition: currentFocal,
              opacity: scrollProgress < 0.28 ? 1 : 0,
            }}
          />
          <div
            className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-500 bg-cover"
            style={{
              backgroundImage: "url('/events-mid-poster.webp')",
              backgroundPosition: isMobile ? "50% center" : "center center",
              opacity: scrollProgress >= 0.28 && scrollProgress < 0.44 ? 1 : 0,
            }}
          />
          <div
            className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-500 bg-cover bg-center"
            style={{
              backgroundImage: "url('/events-arena-poster.webp')",
              opacity: scrollProgress >= 0.44 ? 1 : 0,
            }}
          />

          {/* Upscaled QHD Video Scrubber */}
          <video
            ref={videoRef}
            src="/event_video.mp4"
            poster="/events-hero-poster.webp"
            playsInline
            muted
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            onSeeked={handleSeeked}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isVideoLoaded ? 1 : 0.9,
              zIndex: 2,
              filter: "contrast(1.04) brightness(1.02)",
              transform: "translate3d(0, 0, 0)",
              backfaceVisibility: "hidden",
              objectPosition: currentFocal,
            }}
          />

          {/* Deep Obsidian Left Vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 85%, transparent 100%)",
              opacity: Math.max(0, 1 - scrollProgress * 3.0),
            }}
          />

          {/* Top Navbar Protection */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-20" />
        </div>

        {/* =================================================================== */}
        {/* LAYER 2: HERO TEXT OVERLAY (FADES OUT IN FIRST 20%)                */}
        {/* =================================================================== */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 z-20 flex items-center px-5 sm:px-12 md:px-16 lg:px-24 pointer-events-none"
        >
          <div className="max-w-[85vw] sm:max-w-xl text-left">
            <h1 className="font-montserrat tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,1)]">
              EVENTS
            </h1>
            <p className="mt-4 sm:mt-8 font-chancery text-base sm:text-xl md:text-2xl tracking-wide text-neutral-300 max-w-2xl leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] italic">
              &ldquo;Fear is the mind-killer. Beyond fear lies destiny. Step into the crucible and forge your legacy.&rdquo;
            </p>
            <div className="mt-6 sm:hidden inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-bebas text-xs tracking-widest uppercase text-neutral-300">
                SCROLL TO ENTER THE ARENA
              </span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAYER 3: 5 SPATIAL CLUB CARDS (EXTENDED DWELL: 44%-82%, COLLAPSE 82%-93%) */}
        {/* =================================================================== */}
        <ArenaSpatialCards
          isVisible={scrollProgress >= 0.44 && scrollProgress <= 0.92}
          onClubSelect={onClubSelect}
          onExploreEvents={scrollToOurEvents}
          leftCardsRef={leftCardsRef}
          centerCardRef={centerCardRef}
          rightCardsRef={rightCardsRef}
        />

        {/* =================================================================== */}
        {/* LAYER 4: TRANSITION - ABSTRACT CYBERNETIC CHAMBER (ACTIVATES 84%)  */}
        {/* =================================================================== */}
        <div
          ref={chamberBgRef}
          className="absolute inset-0 pointer-events-none opacity-0 will-change-transform z-15"
        >
          <div className="absolute inset-0 bg-[#040507]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.02)_0px,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_80px)] opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#040507]/90 via-transparent to-[#040507]/90" />
        </div>

        {/* =================================================================== */}
        {/* LAYER 5: TRANSITION - SCAN BEAM SWEEP (TRAVELS DOWN AT 74%-88%)     */}
        {/* =================================================================== */}
        <div
          ref={scanBeamRef}
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_25px_#ffffff,0_0_50px_rgba(255,255,255,0.7)] z-40 pointer-events-none opacity-0"
        />

        {/* Horizontal Scanlines Split Flicker */}
        <div
          ref={headingScanLinesRef}
          className="absolute inset-0 pointer-events-none opacity-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_3px,rgba(255,255,255,0.6)_3px,rgba(255,255,255,0.6)_4px)] mix-blend-overlay z-40"
        />

        {/* Lower Smoke Drift */}
        <div
          ref={lowerSmokeRef}
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent opacity-30 z-20 pointer-events-none"
        />

        {/* =================================================================== */}
        {/* LAYER 6: TRANSITION - RADIAL DISSOLUTION PARTICLES EXPLOSION (84%) */}
        {/* =================================================================== */}
        <div
          ref={dissolveParticlesRef}
          className="absolute inset-0 pointer-events-none opacity-0 flex items-center justify-center z-35"
        >
          {DISSOLVE_PARTICLES.map((p, idx) => (
            <div
              key={idx}
              className={`dissolve-spark absolute rounded-full ${
                p.color === "white"
                  ? "bg-white shadow-[0_0_12px_#ffffff,0_0_24px_rgba(255,255,255,0.85)]"
                  : p.color === "silver"
                  ? "bg-slate-200 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                  : "bg-neutral-900 border border-white/40"
              }`}
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                top: `${p.top}%`,
                left: `${p.left}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
