"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { HeroTitle } from "./hero-title";
import { Paul3D } from "./paul-3d";

interface ScrollJourneyProps {
  landingSrc?: string;
  scrollSrc?: string;
}

/**
 * Draws an image or video onto a canvas simulating `object-fit: cover; object-position: center;`
 */
function drawCover(
  ctx: CanvasRenderingContext2D,
  source: HTMLVideoElement | HTMLImageElement,
  srcW: number,
  srcH: number,
  canvasW: number,
  canvasH: number
) {
  if (!srcW || !srcH || !canvasW || !canvasH) return;
  const canvasAspect = canvasW / canvasH;
  const srcAspect = srcW / srcH;

  let renderW = canvasW;
  let renderH = canvasH;
  let offsetX = 0;
  let offsetY = 0;

  if (canvasAspect > srcAspect) {
    renderW = canvasW;
    renderH = canvasW / srcAspect;
    offsetY = (canvasH - renderH) / 2;
  } else {
    renderH = canvasH;
    renderW = canvasH * srcAspect;
    offsetX = (canvasW - renderW) / 2;
  }

  ctx.drawImage(source, offsetX, offsetY, renderW, renderH);
}

export function ScrollJourney({
  landingSrc = "/landing-bg.mp4",
  scrollSrc,
}: ScrollJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollVideoRef = useRef<HTMLVideoElement>(null);
  const landingVideoRef = useRef<HTMLVideoElement>(null);

  // Default directly to mobile stream to avoid mid-mount resource resets on mobile devices
  const [activeScrollSrc, setActiveScrollSrc] = useState(
    scrollSrc || "/scrolling-mobile.mp4"
  );

  const [scrollProgress, setScrollProgress] = useState(0);
  const targetTimeRef = useRef(0);
  const isSeekingRef = useRef(false);
  const isPrimedRef = useRef(false);
  const posterLoadedRef = useRef(false);

  // Upgrade desktop high-end screens to 1080p stream on mount
  useEffect(() => {
    if (scrollSrc) return;
    const isDesktop =
      window.innerWidth >= 1024 &&
      !window.matchMedia("(pointer: coarse)").matches;
    if (isDesktop) {
      setActiveScrollSrc("/scrolling-hd.mp4");
    }
  }, [scrollSrc]);

  // Paint canvas with current video frame or poster
  const paintCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const video = scrollVideoRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    if (video && video.videoWidth > 0 && video.videoHeight > 0) {
      drawCover(
        ctx,
        video,
        video.videoWidth,
        video.videoHeight,
        canvas.width,
        canvas.height
      );
    }
  }, []);

  // Request a seek without interrupting in-flight hardware decoding
  const requestSeek = useCallback(
    (targetTime: number) => {
      const video = scrollVideoRef.current;
      if (!video || !video.duration) return;

      const maxSafeTime = Math.max(0, video.duration - 0.08);
      const safeTarget = Math.max(0, Math.min(maxSafeTime, targetTime));
      targetTimeRef.current = safeTarget;

      if (!isSeekingRef.current) {
        if (Math.abs(video.currentTime - safeTarget) > 0.02) {
          isSeekingRef.current = true;
          // Use fastSeek if supported for instantaneous zero-latency keyframe scrub
          if ("fastSeek" in video && typeof (video as any).fastSeek === "function") {
            (video as any).fastSeek(safeTarget);
          } else {
            video.currentTime = safeTarget;
          }
        }
      }
    },
    []
  );

  // Fired when the browser hardware decoder completes a seek
  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false;
    paintCanvas();

    // Check if user scrolled further while this seek was in flight
    const video = scrollVideoRef.current;
    if (video && video.duration) {
      const safeTarget = targetTimeRef.current;
      if (Math.abs(video.currentTime - safeTarget) > 0.03) {
        isSeekingRef.current = true;
        if ("fastSeek" in video && typeof (video as any).fastSeek === "function") {
          (video as any).fastSeek(safeTarget);
        } else {
          video.currentTime = safeTarget;
        }
      }
    }
  }, [paintCanvas]);

  // Prime mobile video decoder on first touch/interaction
  const primeMobileVideo = useCallback(() => {
    if (isPrimedRef.current) return;
    isPrimedRef.current = true;
    const v = scrollVideoRef.current;
    if (v && v.paused) {
      v.play()
        .then(() => {
          v.pause();
        })
        .catch(() => {});
    }
  }, []);

  // Synchronize canvas size to viewport
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.round(window.innerWidth * dpr);
    const h = Math.round(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      paintCanvas();
    }
  }, [paintCanvas]);

  // Preload initial poster image and paint canvas on mount
  useEffect(() => {
    updateCanvasDimensions();
    const poster = new Image();
    poster.src = "/scrolling-hd-poster.jpg";
    poster.onload = () => {
      posterLoadedRef.current = true;
      const canvas = canvasRef.current;
      if (canvas && (!scrollVideoRef.current || scrollVideoRef.current.currentTime === 0)) {
        const ctx = canvas.getContext("2d", { alpha: false });
        if (ctx) {
          drawCover(ctx, poster, poster.naturalWidth, poster.naturalHeight, canvas.width, canvas.height);
        }
      }
    };

    window.addEventListener("resize", updateCanvasDimensions);
    return () => window.removeEventListener("resize", updateCanvasDimensions);
  }, [updateCanvasDimensions]);

  // Synchronize and lock scroll to top on mount and when intro video completes
  useEffect(() => {
    const resetToTop = () => {
      setScrollProgress(0);
      targetTimeRef.current = 0;
      if (scrollVideoRef.current) {
        scrollVideoRef.current.currentTime = 0;
      }
      if (landingVideoRef.current) {
        landingVideoRef.current.currentTime = 0;
        landingVideoRef.current.play().catch(() => {});
      }
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (window.__lenis) {
          window.__lenis.scrollTo(0, { immediate: true });
        }
      }
    };

    resetToTop();

    window.addEventListener("intro-complete", resetToTop);
    return () => {
      window.removeEventListener("intro-complete", resetToTop);
    };
  }, []);

  // Handle scroll events with RAF throttling
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }

          const rect = containerRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const totalDistance = rect.height - windowHeight;

          if (totalDistance <= 0) {
            ticking = false;
            return;
          }

          // Calculate normalized progress (0.0 to 1.0)
          const currentScroll = -rect.top;
          const rawProgress = currentScroll / totalDistance;
          const progress = Math.max(0, Math.min(1, rawProgress));

          setScrollProgress(progress);

          // Pause ambient landing loop when user scrolls away to free mobile GPU decoder
          if (progress > 0.05) {
            if (landingVideoRef.current && !landingVideoRef.current.paused) {
              landingVideoRef.current.pause();
            }
          } else {
            if (landingVideoRef.current && landingVideoRef.current.paused) {
              landingVideoRef.current.play().catch(() => {});
            }
          }

          const video = scrollVideoRef.current;
          if (video && video.duration) {
            requestSeek(progress * video.duration);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", primeMobileVideo, { passive: true, once: true });
    window.addEventListener("pointerdown", primeMobileVideo, { passive: true, once: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", primeMobileVideo);
      window.removeEventListener("pointerdown", primeMobileVideo);
    };
  }, [requestSeek, primeMobileVideo]);

  // Ambient landing loop opacity (fades out as user begins scroll journey)
  const landingOpacity = Math.max(0, 1 - scrollProgress * 10);

  // Citadel Hall Backdrop (guarantees crystal-clear citadel interior behind Paul 3D at end of scroll)
  const citadelBackdropOpacity =
    scrollProgress > 0.65 ? Math.min(1, (scrollProgress - 0.65) * 4) : 0;

  return (
    <div
      ref={containerRef}
      /* Snappy mobile scroll journey: 280vh for mobile phones, 350vh for tablets, 420vh for desktop */
      className="relative w-full min-h-[280vh] sm:min-h-[350vh] md:min-h-[420vh] bg-black -mt-16"
    >
      {/* Sticky Fullscreen Video Window */}
      <div className="sticky top-0 h-screen w-full overflow-hidden select-none bg-black">
        {/* Layer 0: Static baseline poster (never pitch black) */}
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/scrolling-hd-poster.jpg')" }}
        />

        {/* Layer 1: Hardware-Accelerated Canvas (Renders decoded video frames; immune to browser seek blanking) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none object-cover"
        />

        {/* Layer 1.2: Ambient Landing Background Loop (landing-bg.mp4) */}
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
          }}
        />

        {/* Layer 1.5: Citadel Avenue Backdrop (Permanently illuminates citadel interior behind Paul 3D as gate opens) */}
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: "url('/citadel-poster.jpg')",
            opacity: citadelBackdropOpacity,
          }}
        />

        {/* Layer 2: Offscreen Video Decoder (Active in DOM for hardware decoding, but visually hidden so stalled frames never show) */}
        <video
          ref={scrollVideoRef}
          src={activeScrollSrc}
          playsInline
          muted
          preload="auto"
          onSeeked={handleSeeked}
          onLoadedMetadata={paintCanvas}
          className="pointer-events-none opacity-0 absolute w-px h-px overflow-hidden -z-50"
        />

        {/* Layer 3: TechSrijan '27 Main Landing Hero Title (enters on intro end, fades on scroll) */}
        <HeroTitle scrollProgress={scrollProgress} />

        {/* Layer 4: Paul Atreides 3D Model with interactive sideways rotation */}
        <Paul3D scrollProgress={scrollProgress} />
      </div>
    </div>
  );
}
