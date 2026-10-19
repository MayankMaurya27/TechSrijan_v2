"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArenaSpatialCards } from "./arena-spatial-cards";
import type { ClubId } from "./arena-spatial-cards";
import { getMediaVideoUrl } from "@/shared/utils/cloudinary-video";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";
import { whenIdleAfterLoad } from "@/core";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Max speed the scrubbed video may move at when catching up to a fast scroll (× real time).
// 3 → the ~5s walk-in takes ≥1.7s on a hard flick instead of skipping. Lower = more cinematic, more lag.
const MAX_CATCHUP_RATE = 3;

interface EventsHeroScrollProps {
  onScrollProgress?: (progress: number) => void;
  onClubSelect?: (clubId: ClubId) => void;
  onCategorySelect?: (categoryId: string) => void;
}

export function EventsHeroScroll({
  onScrollProgress,
  onClubSelect,
  onCategorySelect,
}: EventsHeroScrollProps) {
  // Container & Stage Refs
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const pinnedStageRef = useRef<HTMLDivElement>(null);

  // Hardware Canvas & Video Decoder
  const bgArenaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hero overlays
  const heroTextRef = useRef<HTMLDivElement>(null);
  const arenaHudRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const exitOverlayRef = useRef<HTMLDivElement>(null);

  // State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasDrawnFrame, setHasDrawnFrame] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);

  // Decoder priming & throttle refs (proven from landing page mobile optimization)
  const isSeekingRef = useRef(false);
  const targetTimeRef = useRef(0); // time currently being shown/seeked (chases scrollTargetRef)
  const scrollTargetRef = useRef(0); // time the scroll position maps to
  const catchUpRafRef = useRef(0);
  const seekWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSeekTimeRef = useRef(0);
  const throttledSeekTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPrimedRef = useRef(false);
  const lastPaintedTimeRef = useRef(-1);
  const lastProgressStateRef = useRef(0);

  // Detect mobile viewport (< 768px or touch device)
  useEffect(() => {
    const check = () => {
      const mobile =
        window.innerWidth < 768 ||
        (typeof navigator !== "undefined" && navigator.maxTouchPoints > 1 && window.innerWidth < 1024);
      setIsMobile(mobile);
      isMobileRef.current = mobile;
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ─── Precision Canvas Frame Painting ────────────────────────────────────────
  // Uses alpha: false for 2x-3x GPU compositor throughput on mobile chips.
  // Draws with DPR clamping (1.25 on mobile) to eliminate fill-rate stutter.
  const renderFrameToCanvas = useCallback((force = false) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    // Never paint during active seeking or insufficient buffered data
    if (video.seeking || video.readyState < 2) return;

    // Avoid redundant frame repaints of identical timestamps
    if (!force && Math.abs(video.currentTime - lastPaintedTimeRef.current) < 0.004) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const cW = canvas.width;
    const cH = canvas.height;
    const vW = video.videoWidth;
    const vH = video.videoHeight;
    const canvasAspect = cW / cH;
    const videoAspect = vW / vH;

    let drawW = cW;
    let drawH = cH;
    let offX = 0;
    let offY = 0;

    if (canvasAspect > videoAspect) {
      drawW = cW;
      drawH = cW / videoAspect;
      offY = (cH - drawH) / 2;
    } else {
      drawH = cH;
      drawW = cH * videoAspect;
      offX = (cW - drawW) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = isMobileRef.current ? "medium" : "high";
    ctx.drawImage(video, offX, offY, drawW, drawH);
    lastPaintedTimeRef.current = video.currentTime;
    setHasDrawnFrame(true);
  }, []);

  // Sync canvas dimensions with optimal DPR clamping for mobile devices
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobileRef.current ? 1.25 : 1.5);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round((rect.width || window.innerWidth) * dpr);
    const h = Math.round((rect.height || window.innerHeight) * dpr);
    if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w;
      canvas.height = h;
    }
  }, []);

  // Pre-paint initial baseline poster onto canvas on mount (Zero blank pause)
  useEffect(() => {
    syncCanvasSize();

    const poster = new Image();
    poster.crossOrigin = "anonymous";
    poster.src = isMobile ? "/events-mobile-hero-poster.webp" : "/events-hero-poster.webp";
    poster.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const cW = canvas.width;
      const cH = canvas.height;
      const pW = poster.naturalWidth || 720;
      const pH = poster.naturalHeight || 1280;
      const canvasAspect = cW / cH;
      const posterAspect = pW / pH;

      let dW = cW;
      let dH = cH;
      let oX = 0;
      let oY = 0;

      if (canvasAspect > posterAspect) {
        dW = cW;
        dH = cW / posterAspect;
        oY = (cH - dH) / 2;
      } else {
        dH = cH;
        dW = cH * posterAspect;
        oX = (cW - dW) / 2;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
      ctx.drawImage(poster, oX, oY, dW, dH);
      setHasDrawnFrame(true);
    };

    if (poster.complete) {
      poster.onload?.(new Event("load") as any);
    }

    const handleResize = () => {
      syncCanvasSize();
      renderFrameToCanvas(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, renderFrameToCanvas, syncCanvasSize]);

  // Prime mobile video decoder on mount and first user gesture (iOS/Android requirement)
  const primeMobileVideo = useCallback(() => {
    if (isPrimedRef.current) return;
    isPrimedRef.current = true;
    const v = videoRef.current;
    if (v && v.paused) {
      v.play()
        .then(() => v.pause())
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    // The scrub video is preload="none" so it doesn't compete with first paint. Start downloading it
    // (and attempt non-gesture priming) once the page has loaded and gone idle; a gesture starts it sooner.
    const cancelIdle = whenIdleAfterLoad(() => {
      const v = videoRef.current;
      if (!v) return;
      v.preload = "auto";
      if (v.paused) {
        v.play()
          .then(() => v.pause())
          .catch(() => {});
      }
    });

    window.addEventListener("touchstart", primeMobileVideo, { passive: true, once: true });
    window.addEventListener("pointerdown", primeMobileVideo, { passive: true, once: true });
    window.addEventListener("wheel", primeMobileVideo, { passive: true, once: true });
    return () => {
      cancelIdle();
      window.removeEventListener("touchstart", primeMobileVideo);
      window.removeEventListener("pointerdown", primeMobileVideo);
      window.removeEventListener("wheel", primeMobileVideo);
    };
  }, [primeMobileVideo]);

  // ─── Smooth Hardware Video Scrubber (Universal 28ms throttle) ─────────────
  const attemptSeek = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration || isSeekingRef.current) return;

    // Universal hardware decoder throttle: 28ms to prevent compositor queue choke
    const now = performance.now();
    const elapsed = now - lastSeekTimeRef.current;
    if (elapsed < 28) {
      if (!throttledSeekTimerRef.current) {
        throttledSeekTimerRef.current = setTimeout(() => {
          throttledSeekTimerRef.current = null;
          attemptSeek();
        }, 28 - elapsed);
      }
      return;
    }

    const maxDuration = Math.max(0, video.duration - 0.05);
    const target = Math.max(0, Math.min(maxDuration, targetTimeRef.current));
    const minDelta = 0.02;

    if (Math.abs(video.currentTime - target) > minDelta) {
      isSeekingRef.current = true;
      lastSeekTimeRef.current = performance.now();

      // Direct currentTime seek on All-Intra media (zero latency, exact frame precision)
      video.currentTime = target;

      // Watchdog: If browser drops seeked callback, unblock after 75ms
      if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);
      seekWatchdogRef.current = setTimeout(() => {
        isSeekingRef.current = false;
        renderFrameToCanvas(true);
        attemptSeek();
      }, 75);
    }
  }, [renderFrameToCanvas]);

  // ─── Rate-limited catch-up ──────────────────────────────────────────────────
  // Scroll only sets where the video *should* be (scrollTargetRef). The shown time chases it at up to
  // MAX_CATCHUP_RATE× real time, so a fast flick plays the walk-in quickly instead of jumping past it.
  const startCatchUp = useCallback(() => {
    if (catchUpRafRef.current) return;
    let last = performance.now();
    const step = (now: number) => {
      const video = videoRef.current;
      if (!video || !video.duration) {
        catchUpRafRef.current = 0;
        return;
      }
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const goal = Math.max(0, Math.min(video.duration - 0.05, scrollTargetRef.current));
      const maxStep = dt * MAX_CATCHUP_RATE;
      targetTimeRef.current += Math.max(-maxStep, Math.min(maxStep, goal - targetTimeRef.current));
      attemptSeek();
      catchUpRafRef.current =
        Math.abs(goal - targetTimeRef.current) > 0.001 ? requestAnimationFrame(step) : 0;
    };
    catchUpRafRef.current = requestAnimationFrame(step);
  }, [attemptSeek]);

  useEffect(() => () => cancelAnimationFrame(catchUpRafRef.current), []);

  const handleLoadedMetadata = useCallback(() => {
    setIsVideoLoaded(true);
    syncCanvasSize();
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0.01;
      renderFrameToCanvas(true);
      startCatchUp(); // user may have scrolled before the video finished loading
    }
  }, [renderFrameToCanvas, syncCanvasSize, startCatchUp]);

  const handleSeeked = useCallback(() => {
    if (seekWatchdogRef.current) {
      clearTimeout(seekWatchdogRef.current);
      seekWatchdogRef.current = null;
    }
    isSeekingRef.current = false;
    renderFrameToCanvas();

    // Chain to pending scroll target if user moved during previous seek
    const video = videoRef.current;
    if (video && video.duration) {
      const maxDuration = Math.max(0, video.duration - 0.05);
      const target = Math.max(0, Math.min(maxDuration, targetTimeRef.current));
      const minDelta = 0.02;
      if (Math.abs(video.currentTime - target) > minDelta) {
        attemptSeek();
      }
    }
  }, [attemptSeek, renderFrameToCanvas]);

  // Scroll directly into Our Events Dossier with seamless cinematic transition
  const scrollToOurEvents = useCallback(() => {
    const target = document.getElementById("our-events-section");
    const lenis = (window as any).__lenis;
    const st = ScrollTrigger.getById("events-hero-scroll");

    // The clean unpinned start of Our Events dossier is st.end (or target offset if fallback)
    const destination = st
      ? st.end
      : target
      ? target.getBoundingClientRect().top +
        (window.pageYOffset || document.documentElement.scrollTop || (lenis ? lenis.scroll : 0))
      : 0;

    if (destination > 0) {
      if (lenis) {
        lenis.scrollTo(destination, {
          duration: 1.25,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: destination, behavior: "smooth" });
      }
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

    const isMobileViewport = isMobileRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          id: "events-hero-scroll",
          trigger: scrollWrapperRef.current,
          start: "top top",
          end: isMobileViewport ? "+=240%" : "+=340%",
          pin: pinnedStageRef.current,
          scrub: isMobileViewport ? 0.35 : 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (Math.abs(p - lastProgressStateRef.current) >= 0.003) {
              lastProgressStateRef.current = p;
              setScrollProgress(p);
              if (onScrollProgress) onScrollProgress(p);
            }

            // Map scroll progress to video time:
            // The scroll scrub finishes first with the arena view and text arrival (p: 0.00 - 0.28)
            let target = 0;

            if (isMobileViewport) {
              // Mobile Video (6.0s 9:16 portrait):
              // 0.00 - 0.14: Character close-up portrait (0.0s - 2.0s)
              // 0.14 - 0.28: Steps into arena, reaches amphitheatre view (2.0s - 5.4s)
              // 0.28 - 1.00: Remains parked on majestic wide arena amphitheatre
              if (p <= 0.14) {
                const norm = p / 0.14;
                target = norm * 2.0;
              } else if (p <= 0.28) {
                const norm = (p - 0.14) / 0.14;
                target = 2.0 + norm * 3.4;
              } else {
                target = 5.4;
              }
            } else {
              // Desktop Video (5.04s 16:9 landscape):
              // 0.00 - 0.28: Completes full entrance scrub to 5.04s
              // 0.28 - 1.00: Remains parked on grand amphitheatre
              if (p <= 0.28) {
                const norm = p / 0.28;
                target = norm * 5.04;
              } else {
                target = 5.04;
              }
            }

            scrollTargetRef.current = target;
            startCatchUp();
          },
        },
      });

      // ─────────────────────────────────────────────────────────────────────────
      // PHASE 1: 0.00 - 0.12 Hero Text Fade-out
      // ─────────────────────────────────────────────────────────────────────────
      if (heroTextRef.current) {
        tl.to(
          heroTextRef.current,
          {
            opacity: 0,
            y: isMobileViewport ? -25 : -40,
            scale: 0.95,
            ease: "power2.inOut",
            duration: 0.12,
          },
          0
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      // PHASE 2: 0.16 - 0.38 The Arena Text Arrival & Showcase
      // Video completes scroll scrub -> "THE ARENA" text prominently appears
      // ─────────────────────────────────────────────────────────────────────────
      if (arenaHudRef.current) {
        tl.fromTo(
          arenaHudRef.current,
          { opacity: 0, y: 35, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.08, ease: "power2.out" },
          0.16
        );
        tl.to(
          arenaHudRef.current,
          { opacity: 0, y: -25, scale: 1.04, duration: 0.07, ease: "power2.in" },
          0.34
        );
      }

      // ─────────────────────────────────────────────────────────────────────────
      // PHASE 3: 0.42 - 0.90 All Club Cards Appear While Scrolling & Full Dwell
      // Club cards enter and dwell across ample scroll distance before Our Events
      // ─────────────────────────────────────────────────────────────────────────
      if (cardsContainerRef.current) {
        tl.fromTo(
          cardsContainerRef.current,
          { opacity: 0, y: isMobileViewport ? 30 : 50, scale: 0.94, pointerEvents: "none" },
          { opacity: 1, y: 0, scale: 1, pointerEvents: "auto", duration: 0.12, ease: "power2.out" },
          0.42
        );
        tl.to(
          cardsContainerRef.current,
          { opacity: 0, y: isMobileViewport ? -20 : -35, scale: 0.97, pointerEvents: "none", duration: 0.10, ease: "power2.in" },
          0.90
        );
      }

      // Smooth atmospheric curtain dissolve into Our Events dossier
      if (exitOverlayRef.current) {
        tl.fromTo(
          exitOverlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.12, ease: "power2.inOut" },
          0.88
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
  }, [startCatchUp, onScrollProgress]);

  // Poster URLs tailored to device aspect ratio with Cloudinary CDN optimization
  const heroPoster = getOptimizedImageUrl(
    isMobile ? "/events-mobile-hero-poster.webp" : "/events-hero-poster.webp",
    1200
  );
  const midPoster = getOptimizedImageUrl(
    isMobile ? "/events-mobile-mid-poster.webp" : "/events-mid-poster.webp",
    1200
  );
  const arenaPoster = getOptimizedImageUrl(
    isMobile ? "/events-mobile-arena-poster.webp" : "/events-arena-poster.webp",
    1200
  );

  return (
    <div
      ref={scrollWrapperRef}
      className="relative w-full bg-[#030406] select-none"
    >
      {/* Cinematic Stage Viewport (Pinned by GSAP ScrollTrigger) */}
      <div
        ref={pinnedStageRef}
        className="relative h-screen h-[100dvh] w-full overflow-hidden bg-[#030406]"
      >
        {/* =================================================================== */}
        {/* LAYER 0 & 1: HARDWARE CANVAS FRAME SCRUBBER & BASELINE WEBP POSTERS */}
        {/* =================================================================== */}
        <div ref={bgArenaRef} className="absolute inset-0 h-full w-full will-change-transform z-0">
          {/* Baseline WebP Posters: Always render underneath to prevent any blank frames */}
          <div
            className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-300 bg-cover bg-center z-[1]"
            style={{
              backgroundImage: `url('${heroPoster}')`,
              opacity: scrollProgress < 0.16 ? 1 : 0,
            }}
          />
          <div
            className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-300 bg-cover bg-center z-[1]"
            style={{
              backgroundImage: `url('${midPoster}')`,
              opacity: scrollProgress >= 0.16 && scrollProgress < 0.28 ? 1 : 0,
            }}
          />
          <div
            className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-300 bg-cover bg-center z-[1]"
            style={{
              backgroundImage: `url('${arenaPoster}')`,
              opacity: scrollProgress >= 0.28 ? 1 : 0,
            }}
          />

          {/* High-Performance Canvas Frame Scrubber: Retains frame buffer in GPU memory */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-300"
            style={{
              opacity: hasDrawnFrame ? 1 : 0,
              zIndex: 2,
              filter: "contrast(1.04) brightness(1.02)",
            }}
          />

          {/* Active Off-Screen Video Element for Hardware Media Decoding (Safe on iOS Safari & Android Chrome) */}
          <video
            ref={videoRef}
            src={getMediaVideoUrl(isMobile ? "/event_video_mobile.mp4" : "/event_video_desktop.mp4")}
            poster={heroPoster}
            playsInline
            muted
            preload="none"
            crossOrigin="anonymous"
            onLoadedMetadata={handleLoadedMetadata}
            onSeeked={handleSeeked}
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              opacity: 0.001,
              pointerEvents: "none",
              zIndex: -1,
              top: 0,
              left: 0,
            }}
          />

          {/* Deep Obsidian Left/Bottom Vignette for cinematic depth and typography contrast */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: isMobile
                ? "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.5) 100%)"
                : "linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.15) 60%, transparent 100%)",
              opacity: Math.max(0, 1 - scrollProgress * 2.8),
            }}
          />

          {/* Permanent Bottom Atmospheric Feather: Eliminates any hard cutoff of the arena amphitheatre floor */}
          <div className="absolute bottom-0 inset-x-0 h-44 sm:h-72 bg-gradient-to-t from-[#030406] via-[#030406]/80 to-transparent pointer-events-none z-15" />

          {/* Top Navbar Protection */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/90 to-transparent pointer-events-none z-20" />

          {/* Exit Dissolve Curtain: Fades the entire stage into deep void as user approaches dossier */}
          <div
            ref={exitOverlayRef}
            className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#030406]/85 to-[#030406] pointer-events-none z-25 opacity-0"
          />
        </div>

        {/* =================================================================== */}
        {/* LAYER 2: HERO TEXT OVERLAY                                          */}
        {/* =================================================================== */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 z-20 flex items-center px-5 sm:px-12 md:px-16 lg:px-24 pointer-events-none"
        >
          <div className="max-w-[90vw] sm:max-w-xl text-left">
            <h1 className="font-montserrat tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,1)]">
              EVENTS<span className="sr-only"> at TechSrijan&apos;27, the techfest of MMMUT Gorakhpur</span>
            </h1>
            <p className="mt-2.5 sm:mt-6 font-chancery text-sm sm:text-xl md:text-2xl tracking-wide text-neutral-300 max-w-2xl leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] italic">
              &ldquo;Fear is the mind-killer. Beyond fear lies destiny. Step into the crucible and forge your legacy.&rdquo;
            </p>
            <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 backdrop-blur-sm">
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
          <h2 className="font-montserrat tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white uppercase drop-shadow-[0_4px_35px_rgba(0,0,0,1)]">
            THE ARENA
          </h2>
        </div>

        {/* =================================================================== */}
        {/* LAYER 3: 5 SPATIAL CLUB CARDS                                       */}
        {/* Dwells through phase 3, then smoothly transitions into Our Events!  */}
        {/* =================================================================== */}
        <div
          ref={cardsContainerRef}
          className={`absolute inset-0 z-30 opacity-0 ${
            scrollProgress >= 0.38 ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <ArenaSpatialCards
            isVisible={scrollProgress >= 0.38}
            onClubSelect={onClubSelect}
            onCategorySelect={onCategorySelect}
            onExploreEvents={scrollToOurEvents}
          />
        </div>
      </div>
    </div>
  );
}
