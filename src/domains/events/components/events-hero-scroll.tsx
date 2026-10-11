"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArenaSpatialCards } from "./arena-spatial-cards";
import type { ClubId } from "./arena-spatial-cards";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

  // Video scrubber elements: Canvas frame buffer (zero-black frame guarantee) & hidden video decoder
  const bgArenaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hero overlays
  const heroTextRef = useRef<HTMLDivElement>(null);
  const arenaHudRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasDrawnFrame, setHasDrawnFrame] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Seeking watchdog & throttling
  const isSeekingRef = useRef(false);
  const targetTimeRef = useRef(0);
  const seekWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ─── Draw Video Frame to Persistent Canvas ──────────────────────────────────
  // A canvas retains its frame buffer in GPU memory during seeks, which physically
  // prevents the browser video decoder from flashing a blank or black surface!
  const renderFrameToCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth || window.innerWidth;
      canvas.height = canvas.clientHeight || window.innerHeight;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx || !video.videoWidth || !video.videoHeight) return;

    const cWidth = canvas.width;
    const cHeight = canvas.height;
    const vWidth = video.videoWidth;
    const vHeight = video.videoHeight;

    const hRatio = cWidth / vWidth;
    const vRatio = cHeight / vHeight;
    const ratio = Math.max(hRatio, vRatio);

    const drawWidth = vWidth * ratio;
    const drawHeight = vHeight * ratio;
    const offsetX = (cWidth - drawWidth) / 2;
    const offsetY = (cHeight - drawHeight) / 2;

    ctx.drawImage(video, 0, 0, vWidth, vHeight, offsetX, offsetY, drawWidth, drawHeight);
    setHasDrawnFrame(true);
  }, []);

  // Trigger first frame draw as soon as video is ready
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (video.readyState >= 2) {
        setIsVideoLoaded(true);
        renderFrameToCanvas();
      }
    }
  }, [renderFrameToCanvas]);

  // Handle Canvas resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.clientWidth || window.innerWidth;
        canvas.height = canvas.clientHeight || window.innerHeight;
        renderFrameToCanvas();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrameToCanvas]);

  // ─── Smooth Video Seek Scrubber ─────────────────────────────────────────────
  const attemptSeek = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration || isSeekingRef.current) return;

    const target = targetTimeRef.current;
    if (Math.abs(video.currentTime - target) < 0.03) return;

    isSeekingRef.current = true;
    try {
      video.currentTime = target;
    } catch {
      isSeekingRef.current = false;
    }

    if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);
    seekWatchdogRef.current = setTimeout(() => {
      if (isSeekingRef.current) {
        isSeekingRef.current = false;
        renderFrameToCanvas();
      }
    }, 80);
  }, [renderFrameToCanvas]);

  const handleLoadedMetadata = useCallback(() => {
    setIsVideoLoaded(true);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0.01;
      renderFrameToCanvas();
    }
  }, [renderFrameToCanvas]);

  const handleSeeked = useCallback(() => {
    if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);
    isSeekingRef.current = false;
    renderFrameToCanvas();

    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - targetTimeRef.current) >= 0.04) {
      attemptSeek();
    }
  }, [attemptSeek, renderFrameToCanvas]);

  // Scroll directly into Our Events Dossier
  const scrollToOurEvents = useCallback(() => {
    const target = document.getElementById("our-events-section");
    if (target) {
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.1, offset: -20 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const st = ScrollTrigger.getById("events-hero-scroll");
    if (st) {
      window.scrollTo({ top: st.end, behavior: "smooth" });
    }
  }, []);

  // ─── GSAP ScrollTrigger Sequence ─────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !scrollWrapperRef.current || !pinnedStageRef.current)
      return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    const isMobileViewport = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "events-hero-scroll",
          trigger: scrollWrapperRef.current,
          start: "top top",
          end: isMobileViewport ? "+=130%" : "+=150%",
          pin: pinnedStageRef.current,
          scrub: isMobileViewport ? 0.4 : 0.6,
          anticipatePin: 0,
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
              if (p <= 0.25) {
                const norm = p / 0.25;
                target = tFrame1 + norm * (tFrame2 - tFrame1);
              } else if (p <= 0.45) {
                const norm = (p - 0.25) / 0.20;
                target = tFrame2 + norm * (tArena - tFrame2);
              } else {
                target = tArena;
              }

              targetTimeRef.current = Math.max(0, Math.min(video.duration - 0.05, target));
              attemptSeek();
            }
          },
        },
      });

      // ─────────────────────────────────────────────────────────────────────────
      // PHASE 1: 0.00 - 0.20 Hero Text Fade-out
      // ─────────────────────────────────────────────────────────────────────────
      if (heroTextRef.current) {
        tl.to(
          heroTextRef.current,
          {
            opacity: 0,
            y: -35,
            scale: 0.96,
            ease: "power2.inOut",
            duration: 0.20,
          },
          0
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      // PHASE 2: 0.12 - 0.35 Crucible / Horizon HUD (Smooth Bridge)
      // ─────────────────────────────────────────────────────────────────────────
      if (arenaHudRef.current) {
        tl.fromTo(
          arenaHudRef.current,
          { opacity: 0, y: 25, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.10, ease: "power2.out" },
          0.12
        );
        tl.to(
          arenaHudRef.current,
          { opacity: 0, y: -25, scale: 1.04, duration: 0.08, ease: "power2.in" },
          0.28
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      // PHASE 3: 0.26 - 1.00 Arena Spatial Cards Entrance & Solid Dwell
      // Note: Cards and Arena background remain fully visible all the way to 1.00!
      // Once progress reaches 1.00, the stage cleanly unpins directly into
      // the Our Events section with zero black gap or blank screen!
      // ─────────────────────────────────────────────────────────────────────────
      if (cardsContainerRef.current) {
        tl.fromTo(
          cardsContainerRef.current,
          { opacity: 0, y: 40, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.16, ease: "power2.out" },
          0.26
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

  return (
    <div
      ref={scrollWrapperRef}
      className="relative w-full bg-[#030406] select-none"
    >
      {/* Cinematic Stage Viewport (Pinned by GSAP ScrollTrigger on Desktop & Mobile) */}
      <div
        ref={pinnedStageRef}
        className="relative h-screen h-[100dvh] w-full overflow-hidden bg-[#030406]"
      >
        {/* =================================================================== */}
        {/* LAYER 0 & 1: VIDEO SCRUBBER, PERSISTENT CANVAS & BASELINE POSTERS   */}
        {/* =================================================================== */}
        <div ref={bgArenaRef} className="absolute inset-0 h-full w-full will-change-transform z-0">
          {/* Baseline WebP Posters: Solid foundation prevents blank flashes */}
          <div
            className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-300 bg-cover bg-center z-1"
            style={{
              backgroundImage: "url('/events-hero-poster.webp')",
              opacity: scrollProgress < 0.26 ? 1 : 0,
            }}
          />
          <div
            className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-300 bg-cover bg-center z-1"
            style={{
              backgroundImage: "url('/events-mid-poster.webp')",
              opacity: scrollProgress >= 0.26 && scrollProgress < 0.45 ? 1 : 0,
            }}
          />
          <div
            className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-300 bg-cover bg-center z-1"
            style={{
              backgroundImage: "url('/events-arena-poster.webp')",
              opacity: scrollProgress >= 0.45 ? 1 : 0,
            }}
          />

          {/* High-Performance Canvas Frame Scrubber: Retains previous frame during seeks so it NEVER goes black */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isVideoLoaded && hasDrawnFrame ? 1 : 0,
              zIndex: 2,
              filter: "contrast(1.04) brightness(1.02)",
            }}
          />

          {/* Hidden Video element for hardware decoding (Desktop: 1080p, Mobile: 720p 1.3MB with GOP=2) */}
          <video
            ref={videoRef}
            src={isMobile ? "/event_video_mobile.mp4" : "/event_video_desktop.mp4"}
            poster="/events-hero-poster.webp"
            playsInline
            muted
            preload="auto"
            onLoadedMetadata={handleLoadedMetadata}
            onSeeked={handleSeeked}
            className="hidden"
          />

          {/* Deep Obsidian Left Vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 30%, rgba(0,0,0,0.3) 60%, transparent 100%)",
              opacity: Math.max(0, 1 - scrollProgress * 3.2),
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
          <div className="max-w-[88vw] sm:max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/20 backdrop-blur-md mb-3 sm:mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-[8px] sm:text-[9.5px] tracking-[0.25em] uppercase text-white/80">
                TECHSRIJAN &apos;27 // THE ARENA
              </span>
            </div>
            <h1 className="font-montserrat tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,1)]">
              EVENTS
            </h1>
            <p className="mt-3 sm:mt-6 font-chancery text-base sm:text-xl md:text-2xl tracking-wide text-neutral-300 max-w-2xl leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] italic">
              &ldquo;Fear is the mind-killer. Beyond fear lies destiny. Step into the crucible and forge your legacy.&rdquo;
            </p>
            <div className="mt-5 sm:mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="font-bebas text-xs sm:text-sm tracking-widest uppercase text-neutral-300">
                SCROLL TO ENTER THE ARENA
              </span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAYER 2.5: MID-TRANSITION HORIZON HUD (BRIDGES HERO & ARENA CARDS) */}
        {/* =================================================================== */}
        <div
          ref={arenaHudRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4 text-center opacity-0"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/20 backdrop-blur-md mb-3 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/90">
              CRUCIBLE MATRIX // ONLINE
            </span>
          </div>
          <h2 className="font-montserrat tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase drop-shadow-[0_4px_35px_rgba(0,0,0,1)]">
            THE ARENA
          </h2>
          <p className="mt-2 sm:mt-3 font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.25em] text-neutral-300 uppercase max-w-lg">
            5 CHAPTERS · 23 CHAMPIONSHIP EVENTS
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-white/50" />
            <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.3em] text-white/60 uppercase">
              SCROLL TO ACCESS CLUBS
            </span>
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-white/50" />
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAYER 3: 5 SPATIAL CLUB CARDS                                       */}
        {/* Dwells until end of stage, then flows directly into Our Events!     */}
        {/* =================================================================== */}
        <div
          ref={cardsContainerRef}
          className="absolute inset-0 z-30 opacity-0 pointer-events-auto"
        >
          <ArenaSpatialCards
            isVisible={scrollProgress >= 0.26}
            onClubSelect={onClubSelect}
            onExploreEvents={scrollToOurEvents}
          />
        </div>
      </div>
    </div>
  );
}
