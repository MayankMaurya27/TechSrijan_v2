"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue } from "framer-motion";
import {
  ArrowUpRight,
  Trophy,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Bot,
  Terminal,
  Plane,
  Cpu,
  Gamepad2,
  Brain,
  Shield,
  Sparkles,
} from "lucide-react";
import { ButtonSandEffect } from "@/components/ui/button";

interface EventItem {
  id: string;
  slug: string;
  coordinate: string;
  title: string;
  category: string;
  description: string;
  prize: string;
  team: string;
  duration: string;
  icon: typeof Bot;
}

/**
 * Flagship Directives 3D Stacked Deck
 * - Real-time interactive drag & swipe sliding (mouse drag + touch drag + trackpad horizontal wheel)
 * - True 3D spatial depth: translateZ, perspective, directional cast shadows, and subtle atmospheric depth fading
 * - Subtle depth-of-field blur & brightness falloff for authentic 3D optical perspective
 * - High contrast styling adhering strictly to FIGMA_DESIGN_SPEC.txt tokens
 */
const DIRECTIVE_EVENTS: EventItem[] = [
  {
    id: "01",
    slug: "algo-exile",
    coordinate: "SECTOR // A-1",
    title: "ALGO EXILE",
    category: "COMPETITIVE CODING",
    description:
      "Algorithmic speed warfare in isolated sandboxes with escalating memory and runtime throttling.",
    prize: "₹50,000",
    team: "SOLO",
    duration: "3 HOURS",
    icon: Terminal,
  },
  {
    id: "02",
    slug: "hack-imperium",
    coordinate: "SECTOR // B-4",
    title: "HACK IMPERIUM",
    category: "36H FLAGSHIP SPRINT",
    description:
      "Build cutting-edge full-stack, AI, and autonomous cybernetic prototypes under strict time pressure.",
    prize: "₹1,50,000",
    team: "2 - 4 MEMBERS",
    duration: "36 HOURS",
    icon: Shield,
  },
  {
    id: "03",
    slug: "robo-gladiators",
    coordinate: "SECTOR // C-2",
    title: "ROBO GLADIATORS",
    category: "COMBAT ROBOTICS",
    description:
      "High-octane mechanized arena warfare. Custom combat mechs clash in a reinforced hazard pit.",
    prize: "₹80,000",
    team: "UP TO 5",
    duration: "TOURNAMENT",
    icon: Bot,
  },
  {
    id: "04",
    slug: "aero-gliders",
    coordinate: "SECTOR // D-7",
    title: "AERO GLIDERS",
    category: "AERODYNAMICS",
    description:
      "Precision RC aircraft aerial combat, obstacle interception, and autonomous payload drops.",
    prize: "₹40,000",
    team: "2 - 3 MEMBERS",
    duration: "1 DAY",
    icon: Plane,
  },
  {
    id: "05",
    slug: "cadence",
    coordinate: "SECTOR // E-5",
    title: "CADENCE",
    category: "CIRCUIT DESIGN",
    description:
      "Analog & digital VLSI silicon floor-planning, logic synthesis, and FPGA bug isolation under noise.",
    prize: "₹35,000",
    team: "SOLO / DUO",
    duration: "4 HOURS",
    icon: Cpu,
  },
  {
    id: "06",
    slug: "game-craft",
    coordinate: "SECTOR // F-3",
    title: "GAME CRAFT",
    category: "GAME DEVELOPMENT",
    description:
      "48-hour game development sprint using Unreal Engine 5, physical shader rigging, and gameplay critique.",
    prize: "₹60,000",
    team: "UP TO 4",
    duration: "48 HOURS",
    icon: Gamepad2,
  },
  {
    id: "07",
    slug: "neural-nexus",
    coordinate: "SECTOR // G-8",
    title: "NEURAL NEXUS",
    category: "AI & CYBERNETICS",
    description:
      "Deploy autonomous multi-agent swarms, zero-shot perception pipelines, and edge inference under pressure.",
    prize: "₹75,000",
    team: "2 - 3 MEMBERS",
    duration: "24 HOURS",
    icon: Brain,
  },
];

export function HoltzmanCylinder() {
  const [activeIndex, setActiveIndex] = useState(2); // Start on Robo Gladiators
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1400);
  const [isDragging, setIsDragging] = useState(false);
  const prevOffsetsRef = useRef<{ [key: string]: number }>({});
  const isDraggingRef = useRef(false);
  const lastWheelTimeRef = useRef(0);
  const dragX = useMotionValue(0);

  const totalCards = DIRECTIVE_EVENTS.length;

  // Window resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Safe navigation
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  const handleSelectCard = useCallback((index: number) => {
    if (isDraggingRef.current) return;
    setActiveIndex(index);
  }, []);

  // Auto-play interval with hover-pause
  useEffect(() => {
    if (isPaused || isDragging) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, isDragging, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Trackpad horizontal swipe support
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTimeRef.current < 450) return;
    if (Math.abs(e.deltaX) > 25) {
      if (e.deltaX > 25) {
        handleNext();
        lastWheelTimeRef.current = now;
      } else if (e.deltaX < -25) {
        handlePrev();
        lastWheelTimeRef.current = now;
      }
    }
  };

  /**
   * 3D Card Spatial Layout Calculator
   * - Cards extend all the way towards the corners
   * - Strictly straight (rotate = 0) with true 3D spatial depth (translateZ)
   * - Subtle atmospheric depth fading (opacity, brightness falloff, micro blur)
   */
  const getCardLayout = (index: number) => {
    let offset = index - activeIndex;
    if (offset > Math.floor(totalCards / 2)) offset -= totalCards;
    if (offset < -Math.floor(totalCards / 2)) offset += totalCards;

    // Detect cyclic wrap around boundary
    const prevOffset = prevOffsetsRef.current[index] ?? offset;
    prevOffsetsRef.current[index] = offset;
    const isWrapping = Math.abs(offset - prevOffset) > 3;

    const absOffset = Math.abs(offset);
    const sign = offset < 0 ? -1 : 1;

    // Responsive horizontal spacing
    let step = 230;
    if (windowWidth < 640) {
      step = 70;
    } else if (windowWidth < 1024) {
      step = 150;
    } else if (windowWidth < 1440) {
      step = 205;
    } else {
      step = 245;
    }

    const x = sign * absOffset * step;

    // When wrapping, slide smoothly in from outside the corner
    const offscreenX = sign * (windowWidth / 2 + 350);
    const animatedX = isWrapping ? [offscreenX, x] : x;

    let z = 0;
    let scale = 1;
    let zIndex = 30;
    let opacity = 1.0;
    let blur = 0;
    let brightness = 1.0;

    // 3D Optical Perspective Gradient: subtle fading effect for depth
    if (absOffset === 0) {
      z = 70;
      scale = 1.0;
      zIndex = 30;
      opacity = 1.0;
      blur = 0;
      brightness = 1.0;
    } else if (absOffset === 1) {
      z = -40;
      scale = 0.92;
      zIndex = 20;
      opacity = 0.90; // Just a bit of fading
      blur = 0;
      brightness = 0.92;
    } else if (absOffset === 2) {
      z = -110;
      scale = 0.84;
      zIndex = 10;
      opacity = 0.72; // Receded depth
      blur = 0.6;
      brightness = 0.82;
    } else {
      z = -180;
      scale = 0.76;
      zIndex = 5;
      opacity = 0.48; // Corner background card
      blur = 1.2;
      brightness = 0.70;
    }

    return {
      offset,
      absOffset,
      x: animatedX,
      z,
      scale,
      zIndex,
      opacity,
      blur,
      brightness,
      isActive: offset === 0,
    };
  };

  return (
    <section
      className="relative w-full py-20 select-none overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onWheel={handleWheel}
    >
      {/* Background Volumetric Sunbeam Accent strictly adhering to Figma Palette */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] rounded-full blur-[150px] opacity-25 transition-all duration-700"
        style={{
          background: "radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)",
        }}
      />

      {/* Hairline Grid Overlay using Figma --border token */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, var(--text-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Section Header (Contained in standard max-w-7xl) */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 mb-12 sm:mb-16 border-b border-[var(--border)] pb-6 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] uppercase">
              // SECTOR 01 // DIRECTIVE STACK MATRIX
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2.5 py-0.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              HUD LIVE
            </span>
          </div>
          <h2 className="mt-2 font-mono text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            FLAGSHIP DIRECTIVES
          </h2>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-4 font-mono text-xs text-[var(--text-muted)]">
          <span className="hidden sm:flex items-center gap-1.5 text-[var(--accent-primary)] font-bold">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            DRAG OR SWIPE TO SLIDE
          </span>
          <Link
            href="/events"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] tracking-widest flex items-center gap-1 transition-colors font-mono"
          >
            VIEW ALL 24+ <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 
        3D FULL-BLEED INTERACTIVE SLIDING STAGE
        - drag="x" allows interactive real-time mouse & touch dragging!
        - Subtle 3% edge feathering ensures smooth integration at extreme corners
        - perspective: 1200px provides deep 3D spatial depth
      */}
      <div
        className="relative w-full flex h-[540px] sm:h-[580px] items-center justify-center overflow-visible"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)",
        }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          style={{ x: dragX, transformStyle: "preserve-3d" }}
          onDragStart={() => {
            isDraggingRef.current = true;
            setIsDragging(true);
            setIsPaused(true);
          }}
          onDragEnd={(e, info) => {
            // Delay resetting drag ref slightly so card clicks during drag are cancelled
            setTimeout(() => {
              isDraggingRef.current = false;
              setIsDragging(false);
            }, 60);

            const threshold = 40;
            const velocity = 200;
            if (info.offset.x < -threshold || info.velocity.x < -velocity) {
              handleNext();
            } else if (info.offset.x > threshold || info.velocity.x > velocity) {
              handlePrev();
            }
          }}
          className={`relative h-full w-full flex items-center justify-center select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {DIRECTIVE_EVENTS.map((event, index) => {
            const layout = getCardLayout(index);
            const Icon = event.icon;

            // Directional 3D cast shadows
            let castShadow = "0 15px 30px rgba(0,0,0,0.7)";
            if (layout.isActive) {
              castShadow =
                "0 25px 60px -10px rgba(0,0,0,0.95), 0 0 35px var(--accent-glow), 0 0 1px 1px var(--border-accent)";
            } else if (layout.offset < 0) {
              castShadow =
                "0 20px 45px -10px rgba(0,0,0,0.9), 18px 0 35px -5px rgba(0,0,0,0.85)";
            } else if (layout.offset > 0) {
              castShadow =
                "0 20px 45px -10px rgba(0,0,0,0.9), -18px 0 35px -5px rgba(0,0,0,0.85)";
            }

            return (
              <motion.div
                key={event.id}
                onClick={(e) => {
                  if (isDraggingRef.current) {
                    e.stopPropagation();
                    return;
                  }
                  if (!layout.isActive) {
                    handleSelectCard(index);
                  }
                }}
                className={`absolute w-[300px] sm:w-[330px] md:w-[340px] h-[460px] sm:h-[480px] rounded p-6 sm:p-7 flex flex-col justify-between transition-colors duration-300 pointer-events-auto ${
                  layout.isActive
                    ? "mecha-bracket border border-[var(--border-accent)] bg-[#140E07] ring-1 ring-[var(--accent-primary)]/40"
                    : "border border-[var(--border)] bg-[#110B05] hover:border-[var(--border-accent)]"
                }`}
                style={{
                  zIndex: layout.zIndex,
                  boxShadow: castShadow,
                  transformStyle: "preserve-3d",
                }}
                initial={false}
                animate={{
                  x: layout.x,
                  z: layout.z,
                  scale: layout.scale,
                  opacity: layout.opacity,
                  filter: `blur(${layout.blur}px) brightness(${layout.brightness})`,
                  // STRICTLY STRAIGHT (0 rotation across all axes)
                  rotate: 0,
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                }}
                whileHover={
                  !isDragging && layout.isActive
                    ? { y: -6, z: layout.z + 15 }
                    : !isDragging
                    ? {
                        y: -8,
                        z: layout.z + 25,
                        opacity: Math.min(layout.opacity + 0.22, 1),
                        filter: "blur(0px) brightness(0.95)",
                        transition: { duration: 0.2 },
                      }
                    : {}
                }
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 25,
                  mass: 0.85,
                }}
              >
                {/* Active Card Top Hairline Gold Shimmer */}
                {layout.isActive && (
                  <div
                    className="pointer-events-none absolute -top-px left-4 right-4 h-[1.5px]"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, var(--accent-primary), transparent)",
                    }}
                  />
                )}

                {/* Card Header: Coordinate & Sector ID with High Contrast */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] tracking-widest border-b border-[var(--border)] pb-3 mb-4">
                    <span className="flex items-center gap-2 text-[var(--accent-secondary)] font-medium">
                      <span
                        className="h-2 w-2 rounded-full transition-colors"
                        style={{
                          backgroundColor: layout.isActive
                            ? "var(--accent-primary)"
                            : "var(--accent-secondary)",
                          boxShadow: layout.isActive
                            ? "0 0 8px var(--accent-primary)"
                            : "none",
                        }}
                      />
                      {event.coordinate}
                    </span>
                    <span
                      className="font-mono font-black text-sm tracking-wider"
                      style={{
                        color: layout.isActive
                          ? "var(--accent-primary)"
                          : "var(--accent-secondary)",
                      }}
                    >
                      {event.id}
                    </span>
                  </div>

                  {/* Category Pill with Icon (Figma Token Pill) */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <span
                      className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.25em] font-bold uppercase px-3 py-1 rounded border transition-colors"
                      style={{
                        color: "var(--accent-secondary)",
                        borderColor: layout.isActive
                          ? "var(--border-accent)"
                          : "var(--border)",
                        backgroundColor: layout.isActive
                          ? "rgba(212, 168, 67, 0.12)"
                          : "rgba(0, 0, 0, 0.35)",
                      }}
                    >
                      <Icon className="h-3 w-3 text-[var(--accent-primary)]" />
                      {event.category}
                    </span>
                  </div>

                  {/* Title (High-Contrast Display) */}
                  <h3
                    className="font-mono text-2xl sm:text-3xl font-black tracking-tight transition-colors mt-1"
                    style={{
                      color: layout.isActive ? "#FFFFFF" : "#F0E2C8",
                      textShadow: layout.isActive
                        ? "0 0 25px rgba(212, 168, 67, 0.4)"
                        : "none",
                    }}
                  >
                    {event.title}
                  </h3>

                  {/* Description with crisp legibility */}
                  <p
                    className="mt-3 text-xs leading-relaxed line-clamp-3 font-sans transition-colors"
                    style={{
                      color: layout.isActive ? "#D6C5A9" : "#B8A58D",
                    }}
                  >
                    {event.description}
                  </p>
                </div>

                {/* Directive HUD Footer */}
                <div className="mt-auto">
                  {/* 3-Point Telemetry Row with High-Contrast Text */}
                  <div className="grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-4 mb-5 font-mono text-[10px]">
                    <div>
                      <div className="text-[var(--text-secondary)] flex items-center gap-1 font-semibold">
                        <Trophy className="h-3 w-3 text-[var(--accent-primary)]" /> PRIZE
                      </div>
                      <div className="font-bold text-white mt-1 text-[11px] tracking-wide">
                        {event.prize}
                      </div>
                    </div>
                    <div>
                      <div className="text-[var(--text-secondary)] flex items-center gap-1 font-semibold">
                        <Users className="h-3 w-3 text-[var(--accent-primary)]" /> TEAM
                      </div>
                      <div className="font-bold text-white mt-1 text-[11px] tracking-wide">
                        {event.team}
                      </div>
                    </div>
                    <div>
                      <div className="text-[var(--text-secondary)] flex items-center gap-1 font-semibold">
                        <Clock className="h-3 w-3 text-[var(--accent-primary)]" /> TIME
                      </div>
                      <div className="font-bold text-white mt-1 text-[11px] tracking-wide">
                        {event.duration}
                      </div>
                    </div>
                  </div>

                  {/* Action CTA: High-Contrast Solid Gold Button on Active Card */}
                  {layout.isActive ? (
                    <Link
                      href={`/events/${event.slug}`}
                      className="w-full block"
                      onClick={(e) => {
                        if (isDraggingRef.current) e.preventDefault();
                      }}
                    >
                      <button
                        className="relative overflow-hidden w-full py-2.5 px-4 rounded font-mono font-black text-xs tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                        style={{
                          backgroundColor: "var(--accent-primary)",
                          color: "var(--bg-primary)",
                          boxShadow: "0 0 20px var(--accent-glow)",
                        }}
                      >
                        <ButtonSandEffect />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <span>ENGAGE DIRECTIVE</span>
                          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </button>
                    </Link>
                  ) : (
                    <div className="w-full text-center py-2 font-mono text-[10px] tracking-widest text-[var(--accent-secondary)] hover:text-white transition-colors flex items-center justify-center gap-1">
                      <Sparkles className="h-3 w-3 opacity-70" /> CLICK TO INSPECT
                    </div>
                  )}
                </div>

                {/* Subtle depth vignette on side cards */}
                {!layout.isActive && (
                  <div className="pointer-events-none absolute inset-0 rounded bg-gradient-to-t from-black/40 via-transparent to-black/25 transition-opacity" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Navigation Controls: Circular Arrows & Pagination Dots */}
      <div className="relative mx-auto max-w-7xl px-4 mt-8 sm:mt-10 flex items-center justify-center gap-4 sm:gap-6">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous directive"
          className="relative overflow-hidden h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-[var(--border-accent)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:shadow-[var(--glow)] flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-md group"
        >
          <ButtonSandEffect className="rounded-full" />
          <ChevronLeft className="h-5 w-5 relative z-10" />
        </button>

        {/* Pagination Indicator Dots */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
          {DIRECTIVE_EVENTS.map((item, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectCard(idx)}
                aria-label={`Jump to directive ${item.title}`}
                className="group relative flex items-center justify-center p-1 cursor-pointer"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isSelected
                      ? "h-2 w-6 sm:w-8 bg-[var(--accent-primary)] shadow-[var(--glow)]"
                      : "h-2 w-2 bg-[var(--text-muted)] hover:bg-[var(--text-secondary)] group-hover:scale-125"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next directive"
          className="relative overflow-hidden h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-[var(--border-accent)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:shadow-[var(--glow)] flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-md group"
        >
          <ButtonSandEffect className="rounded-full" />
          <ChevronRight className="h-5 w-5 relative z-10" />
        </button>
      </div>

      {/* Active Directive Quick Index Telemetry */}
      <div className="mt-4 text-center font-mono text-[11px] tracking-[0.2em] text-[var(--text-muted)]">
        DIRECTIVE [{DIRECTIVE_EVENTS[activeIndex].id} / 0{totalCards}]:{" "}
        <span className="text-[var(--accent-primary)] font-bold">
          {DIRECTIVE_EVENTS[activeIndex].title}
        </span>
      </div>
    </section>
  );
}

// Alias export for backward and forward compatibility
export { HoltzmanCylinder as StackedDirectivesDeck };
