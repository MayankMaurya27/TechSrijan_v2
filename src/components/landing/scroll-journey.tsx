"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { isMobileDevice } from "@/lib/device-tier";
import { HeroTitle } from "./hero-title";
import { Paul3D } from "./paul-3d";
import { SocialConstellation } from "./social-constellation";

interface ScrollJourneyProps {
  landingSrc?: string;
  scrollSrc?: string;
}

export function ScrollJourney({
  landingSrc = "/landing-bg.mp4",
  scrollSrc,
}: ScrollJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollVideoRef = useRef<HTMLVideoElement>(null);
  const landingVideoRef = useRef<HTMLVideoElement>(null);

  // Hardware Canvas for mobile (immune to mobile browser seek blanking)
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const seekWatchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPrimedRef = useRef(false);
  const isMobileRef = useRef(false);
  const rafIdRef = useRef<number>(0);
  const lastPaintedTimeRef = useRef(-1);

  // Detect device tier once on mount for branching render strategy
  const [isMobile, setIsMobile] = useState(false);

  // Choose video source based on device (all-intra lightweight 960x540 on mobile)
  const activeScrollSrc =
    scrollSrc || (isMobile ? "/scrolling-mobile.mp4" : "/scrolling-hd.mp4");

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    isMobileRef.current = mobile;
  }, []);

  // ─── Canvas Frame Painting (Mobile Only) ────────────────────────
  const paintCanvas = useCallback(() => {
    if (!isMobileRef.current) return;
    const canvas = canvasRef.current;
    const video = scrollVideoRef.current;
    if (!canvas || !video) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    // CRITICAL: NEVER paint while video is actively seeking or doesn't have current frame data!
    // Drawing during seeking is what causes mobile WebKit/Chrome to paint solid black frames.
    if (video.seeking || video.readyState < 2) return;

    // Avoid redundant repaints of the exact same frame timestamp
    if (Math.abs(video.currentTime - lastPaintedTimeRef.current) < 0.005) return;

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

    ctx.drawImage(video, offX, offY, drawW, drawH);
    lastPaintedTimeRef.current = video.currentTime;
  }, []);

  // Size canvas to viewport (capped at 1x DPR on mobile to save GPU memory)
  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = isMobileRef.current ? 1 : Math.min(window.devicePixelRatio, 1.5);
    const w = Math.round(window.innerWidth * dpr);
    const h = Math.round(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }, []);

  // Paint initial baseline poster onto canvas so it is never blank on mount
  useEffect(() => {
    if (!isMobile) return;
    syncCanvasSize();

    const poster = new Image();
    poster.src = "/scrolling-hd-poster.jpg";
    poster.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;
      const cW = canvas.width;
      const cH = canvas.height;
      const pW = poster.naturalWidth;
      const pH = poster.naturalHeight;
      const canvasAspect = cW / cH;
      const posterAspect = pW / pH;
      let dW = cW, dH = cH, oX = 0, oY = 0;
      if (canvasAspect > posterAspect) {
        dW = cW;
        dH = cW / posterAspect;
        oY = (cH - dH) / 2;
      } else {
        dH = cH;
        dW = cH * posterAspect;
        oX = (cW - dW) / 2;
      }
      ctx.drawImage(poster, oX, oY, dW, dH);
    };

    const onResize = () => {
      syncCanvasSize();
      paintCanvas();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobile, paintCanvas, syncCanvasSize]);

  // ─── Precision Video Seeking & Queue Chaining ────────────────────
  const attemptSeek = useCallback(() => {
    const video = scrollVideoRef.current;
    if (!video || !video.duration) return;
    if (isSeekingRef.current) return;

    const maxSafe = Math.max(0, video.duration - 0.05);
    const target = Math.max(0, Math.min(maxSafe, targetTimeRef.current));

    if (Math.abs(video.currentTime - target) > 0.02) {
      isSeekingRef.current = true;
      video.currentTime = target;

      // Watchdog: If browser drops `seeked` event, unlock after 300ms
      if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);
      seekWatchdogRef.current = setTimeout(() => {
        isSeekingRef.current = false;
        attemptSeek();
      }, 300);
    }
  }, []);

  const handleSeeked = useCallback(() => {
    if (seekWatchdogRef.current) {
      clearTimeout(seekWatchdogRef.current);
      seekWatchdogRef.current = null;
    }
    isSeekingRef.current = false;

    // Immediately paint decoded frame to canvas on mobile
    paintCanvas();

    // If user scrolled while the previous seek was executing, chain to latest target
    const video = scrollVideoRef.current;
    if (video && video.duration) {
      const maxSafe = Math.max(0, video.duration - 0.05);
      const target = Math.max(0, Math.min(maxSafe, targetTimeRef.current));
      if (Math.abs(video.currentTime - target) > 0.025) {
        attemptSeek();
      }
    }
  }, [attemptSeek, paintCanvas]);

  // Prime mobile video decoder on first user gesture
  const primeMobileVideo = useCallback(() => {
    if (isPrimedRef.current) return;
    isPrimedRef.current = true;
    const v = scrollVideoRef.current;
    if (v && v.paused) {
      v.play().then(() => v.pause()).catch(() => {});
    }
  }, []);

  // ─── Scroll Reset ────────────────────────────────────────────────
  useEffect(() => {
    const resetToTop = () => {
      setScrollProgress(0);
      targetTimeRef.current = 0;
      if (scrollVideoRef.current) scrollVideoRef.current.currentTime = 0;
      if (landingVideoRef.current) {
        landingVideoRef.current.currentTime = 0;
        landingVideoRef.current.play().catch(() => {});
      }
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
      }
    };

    resetToTop();
    window.addEventListener("intro-complete", resetToTop);
    return () => window.removeEventListener("intro-complete", resetToTop);
  }, []);

  // ─── Scroll Listener ─────────────────────────────────────────────
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

        const progress = Math.max(0, Math.min(1, -rect.top / totalDist));
        setScrollProgress(progress);

        // Manage landing loop playback to free mobile GPU decoder
        if (progress > 0.04) {
          if (landingVideoRef.current && !landingVideoRef.current.paused) {
            landingVideoRef.current.pause();
          }
        } else {
          if (landingVideoRef.current && landingVideoRef.current.paused) {
            landingVideoRef.current.play().catch(() => {});
          }
        }

        // Calculate target video timestamp
        const video = scrollVideoRef.current;
        if (video && video.duration) {
          targetTimeRef.current = Math.max(
            0,
            Math.min(video.duration - 0.05, progress * video.duration)
          );
          attemptSeek();
        }

        ticking = false;
      });
      ticking = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", primeMobileVideo, { passive: true, once: true });
    window.addEventListener("pointerdown", primeMobileVideo, { passive: true, once: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", primeMobileVideo);
      window.removeEventListener("pointerdown", primeMobileVideo);
      if (seekWatchdogRef.current) clearTimeout(seekWatchdogRef.current);
    };
  }, [attemptSeek, primeMobileVideo]);

  // ─── Derived Layer Opacities ─────────────────────────────────────
  const landingOpacity = Math.max(0, 1 - scrollProgress * 12);
  const scrollVideoOpacity = Math.min(1, scrollProgress * 14);
  const citadelBackdropOpacity =
    scrollProgress > 0.65 ? Math.min(1, (scrollProgress - 0.65) * 4) : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[220vh] sm:min-h-[300vh] md:min-h-[420vh] bg-black -mt-16"
    >
      {/* Sticky Fullscreen Video Window */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none bg-black">
        {/* Layer 0: Static baseline poster (never pitch black) */}
        <div
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{
            backgroundImage: "url('/scrolling-hd-poster.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* === MOBILE PATH: Hardware Canvas (immune to browser seek blanking) === */}
        {isMobile && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full pointer-events-none"
            style={{ zIndex: 1 }}
          />
        )}

        {/* === DESKTOP PATH: Direct video element === */}
        {!isMobile && (
          <video
            ref={scrollVideoRef}
            src={activeScrollSrc}
            poster="/scrolling-hd-poster.jpg"
            playsInline
            muted
            preload="auto"
            onSeeked={handleSeeked}
            className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none transition-opacity duration-150"
            style={{
              opacity: scrollVideoOpacity,
              zIndex: 1,
            }}
          />
        )}

        {/* === MOBILE: Decoder video element (kept active in layout tree) === */}
        {isMobile && (
          <video
            ref={scrollVideoRef}
            src={activeScrollSrc}
            playsInline
            muted
            preload="auto"
            onSeeked={handleSeeked}
            className="pointer-events-none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1px",
              height: "1px",
              opacity: 0.01,
              zIndex: -10,
            }}
          />
        )}

        {/* Layer 1.2: Ambient Landing Background Loop */}
        <video
          ref={landingVideoRef}
          src={landingSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none transition-opacity duration-300"
          style={{
            opacity: landingOpacity,
            visibility: scrollProgress > 0.12 ? "hidden" : "visible",
            zIndex: 2,
          }}
        />

        {/* Layer 1.5: Citadel Avenue Backdrop (ensures citadel interior stays visible) */}
        <div
          className="absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: "url('/citadel-poster.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: citadelBackdropOpacity,
            zIndex: 3,
          }}
        />

        {/* Layer 3: TechSrijan Main Landing Hero Title */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
          <HeroTitle scrollProgress={scrollProgress} />
        </div>

        {/* Layer 3.5: Celestial Social Constellation Hologram on the Rock */}
        <SocialConstellation scrollProgress={scrollProgress} />

        {/* Layer 4: Paul Atreides 3D Model */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
          <Paul3D scrollProgress={scrollProgress} />
        </div>
      </div>
    </div>
  );
}
