"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme, normalizeTheme, type CanonicalTheme } from "@/core";

interface PointerThemePalette {
  primary: string;
  stroke: string;
  bodyFill: string;
  innerFacet: string;
  glow: string;
  glowHover: string;
  rippleStroke: string;
}

const THEME_PALETTES: Record<CanonicalTheme, PointerThemePalette> = {
  // Arrakis Solar Day - Deep Spice Amber with Tiny Golden Framing Border
  "arrakis-day": {
    primary: "#F59E0B",
    stroke: "#FDE68A", // Tiny crisp golden border for instant distinction
    bodyFill: "#92400E",
    innerFacet: "#D97706",
    glow: "rgba(245, 158, 11, 0.35)",
    glowHover: "rgba(245, 158, 11, 0.75)",
    rippleStroke: "#F59E0B",
  },

  // Geass Moon - Deep Bloody Crimson with Tiny Rose-Crimson Framing Border
  "geass-moon": {
    primary: "#DC2626",
    stroke: "#FFA6AC", // Tiny crisp illuminated crimson border for instant distinction
    bodyFill: "#8A0303",
    innerFacet: "#B91C1C",
    glow: "rgba(220, 38, 38, 0.45)",
    glowHover: "rgba(255, 38, 50, 0.8)",
    rippleStroke: "#DC2626",
  },

  // Krelln Night - Sleek Dark Slate Grey with Tiny Lunar Platinum Silver Border
  "krelln-night": {
    primary: "#94A3B8",
    stroke: "#CBD5E1", // Tiny crisp platinum silver border for instant distinction
    bodyFill: "#334155",
    innerFacet: "#64748B",
    glow: "rgba(148, 163, 184, 0.35)",
    glowHover: "rgba(203, 213, 225, 0.65)",
    rippleStroke: "#94A3B8",
  },
};

/**
 * Enhanced Precision Mouse Pointer
 *
 * Best UI/UX Practices:
 * 1. Preserves the familiar, natural, and ergonomic mouse pointer arrow (no confusing dots).
 * 2. Filled with rich dark/bloody theme colors with a tiny 1px crisp border for distinction.
 * 3. No black border and no tiny white dot artifact.
 * 4. 0ms zero-lag hardware tracking directly at the arrow tip (0, 0).
 * 5. Soft atmospheric ambient aura that trails smoothly behind the cursor.
 * 6. Distinctive, responsive hover state: expands ambient glow on interactive elements.
 * 7. Kinetic click ripple wave: creates an elegant tactile shockwave confirmation on every click.
 * 8. Flawless text input handover: seamlessly hides over inputs so native text caret is 100% natural.
 * 9. Hardware accelerated via direct ref transforms (0 React re-renders on move, 60-120fps).
 */
export function EnhancedCursor() {
  const pointerRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  const themeContext = useTheme();

  const [currentTheme, setCurrentTheme] = useState<CanonicalTheme>(
    () => normalizeTheme(themeContext?.resolvedTheme)
  );
  const [isEnabled, setIsEnabled] = useState(false);

  // Synchronize theme dynamically on theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const resolveTheme = (): CanonicalTheme => {
      const docTheme = document.documentElement.getAttribute("data-theme");
      return normalizeTheme(docTheme || themeContext?.resolvedTheme);
    };

    const applyTheme = () => {
      setCurrentTheme(resolveTheme());
    };

    applyTheme();

    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    window.addEventListener("techsrijan-theme-change", applyTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("techsrijan-theme-change", applyTheme);
    };
  }, [themeContext?.resolvedTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setIsEnabled(true);
    document.documentElement.classList.add("has-enhanced-cursor", "has-sword-cursor");
    document.body.classList.add("has-enhanced-cursor", "has-sword-cursor");

    let mouseX = -100;
    let mouseY = -100;
    let auraX = -100;
    let auraY = -100;
    let isVisible = false;
    let isInteractive = false;
    let isMouseDown = false;
    let rafId: number | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isVisible = true;

      // 0ms instant positioning for pointer arrow (tip at 0, 0)
      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${
          isMouseDown ? 0.92 : isInteractive ? 1.12 : 1
        })`;
        pointerRef.current.style.opacity = "1";
      }

      // Check context: text input vs interactive link/button
      const target = e.target as HTMLElement | null;
      if (target) {
        const isTextInput = Boolean(
          target.closest('input, textarea, [contenteditable="true"]')
        );
        const isClickable = Boolean(
          target.closest(
            'a, button, [role="button"], select, label, .cursor-pointer, [tabindex="0"]'
          )
        );

        // Over text inputs, smoothly fade out custom arrow to let native text cursor take over
        if (isTextInput) {
          if (pointerRef.current) pointerRef.current.style.opacity = "0";
          if (auraRef.current) auraRef.current.style.opacity = "0";
          return;
        }

        isInteractive = isClickable;

        if (pointerRef.current) {
          pointerRef.current.dataset.interactive = isInteractive ? "true" : "false";
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0.92)`;
      }

      // Spawn click ripple wave at click coordinate
      if (rippleContainerRef.current) {
        const ripple = document.createElement("div");
        ripple.className = "cursor-click-ripple";
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        rippleContainerRef.current.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 500);
      }
    };

    const handleMouseUp = () => {
      isMouseDown = false;
      if (pointerRef.current) {
        pointerRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${
          isInteractive ? 1.12 : 1
        })`;
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (pointerRef.current) pointerRef.current.style.opacity = "0";
      if (auraRef.current) auraRef.current.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      isVisible = true;
      if (pointerRef.current) pointerRef.current.style.opacity = "1";
      if (auraRef.current) auraRef.current.style.opacity = "1";
    };

    // Smooth spring render loop for the ambient trailing aura
    const renderLoop = () => {
      if (isVisible) {
        auraX += (mouseX - auraX) * 0.22;
        auraY += (mouseY - auraY) * 0.22;

        if (auraRef.current) {
          auraRef.current.style.transform = `translate3d(${auraX}px, ${auraY}px, 0) scale(${
            isInteractive ? 1.4 : 1
          })`;
          auraRef.current.style.opacity = isVisible
            ? isInteractive
              ? "0.85"
              : "0.45"
            : "0";
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      document.documentElement.classList.remove("has-enhanced-cursor", "has-sword-cursor");
      document.body.classList.remove("has-enhanced-cursor", "has-sword-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isEnabled) return null;

  const palette = THEME_PALETTES[currentTheme] || THEME_PALETTES["arrakis-day"];

  return (
    <>
      <style jsx global>{`
        .cursor-click-ripple {
          position: fixed;
          width: 8px;
          height: 8px;
          margin-top: -4px;
          margin-left: -4px;
          border-radius: 9999px;
          border: 1.5px solid ${palette.rippleStroke};
          pointer-events: none;
          z-index: 9999996;
          animation: cursorRippleAnim 0.45s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        @keyframes cursorRippleAnim {
          0% {
            transform: scale(0.6);
            opacity: 1;
            box-shadow: 0 0 10px ${palette.primary};
          }
          100% {
            transform: scale(5.5);
            opacity: 0;
            box-shadow: 0 0 25px ${palette.primary};
          }
        }
      `}</style>

      {/* CLICK RIPPLE CONTAINER */}
      <div ref={rippleContainerRef} className="pointer-events-none" aria-hidden="true" />

      {/* AMBIENT KINETIC SPOTLIGHT AURA */}
      <div
        ref={auraRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999997] will-change-transform opacity-0"
        style={{
          width: "56px",
          height: "56px",
          marginTop: "-28px",
          marginLeft: "-28px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.glow} 0%, rgba(0,0,0,0) 70%)`,
          filter: "blur(6px)",
          transition: "opacity 0.2s ease-out, transform 0.1s ease-out",
        }}
        aria-hidden="true"
      />

      {/* THE ENHANCED THEME-FILLED MOUSE ARROW */}
      <div
        ref={pointerRef}
        data-interactive="false"
        className="fixed top-0 left-0 pointer-events-none z-[9999999] will-change-transform opacity-0"
        style={{
          width: "20px",
          height: "20px",
          transformOrigin: "0 0",
          transition: "opacity 0.15s ease-out, transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)",
        }}
        aria-hidden="true"
      >
        <div
          className="relative w-full h-full"
          style={{
            filter: `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.55)) drop-shadow(0 0 6px ${palette.glow})`,
          }}
        >
          {/* Classic high-precision arrow filled with dark/bloody tone, tiny 1px distinction border, refined shorter length */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Main Arrow Body - Tiny 1px crisp framing border for instant distinction */}
            <path
              d="M0.5 0.5 L0.5 15.2 L4.2 11.6 L7.4 18.5 L9.8 17.5 L6.6 10.6 L11.2 10.6 Z"
              fill={palette.bodyFill}
              stroke={palette.stroke}
              strokeWidth="1"
              strokeLinejoin="round"
            />

            {/* Inner dimensional facet */}
            <path
              d="M1.8 2.2 L1.8 11.5 L3.8 9.8 L6.6 16 L7.4 15.6 L4.9 9.8 L8.2 9.8 Z"
              fill={palette.innerFacet}
              fillOpacity="0.4"
            />
          </svg>
        </div>
      </div>
    </>
  );
}

// Backward-compatible alias for existing imports in layout.tsx
export const SwordCursor = EnhancedCursor;
