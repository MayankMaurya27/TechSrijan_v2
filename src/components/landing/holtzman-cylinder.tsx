"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Trophy, Users, Clock, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

const CYLINDER_EVENTS: EventItem[] = [
  {
    id: "01",
    slug: "algo-exile",
    coordinate: "SECTOR // A-1",
    title: "ALGO EXILE",
    category: "COMPETITIVE CODING",
    description: "Algorithmic speed warfare in isolated sandboxes with escalating resource constraints.",
    prize: "₹50,000",
    team: "SOLO",
    duration: "3 HOURS",
  },
  {
    id: "02",
    slug: "hack-imperium",
    coordinate: "SECTOR // B-4",
    title: "HACK IMPERIUM",
    category: "36H FLAGSHIP SPRINT",
    description: "Build cutting-edge full-stack, AI, and hardware prototypes under strict time pressure.",
    prize: "₹1,50,000",
    team: "2 - 4 MEMBERS",
    duration: "36 HOURS",
  },
  {
    id: "03",
    slug: "robo-gladiators",
    coordinate: "SECTOR // C-2",
    title: "ROBO GLADIATORS",
    category: "COMBAT ROBOTICS",
    description: "High-octane mechanized arena warfare. Destroy opponent bots in direct combat.",
    prize: "₹80,000",
    team: "UP TO 5",
    duration: "TOURNAMENT",
  },
  {
    id: "04",
    slug: "aero-gliders",
    coordinate: "SECTOR // D-7",
    title: "AERO GLIDERS",
    category: "AERODYNAMICS",
    description: "Precision RC aircraft combat, obstacle courses, and autonomous payload drops.",
    prize: "₹40,000",
    team: "2 - 3 MEMBERS",
    duration: "1 DAY",
  },
  {
    id: "05",
    slug: "cadence",
    coordinate: "SECTOR // E-5",
    title: "CADENCE",
    category: "CIRCUIT DESIGN",
    description: "Analog & digital VLSI silicon floor-planning, synthesis, and FPGA bug isolation.",
    prize: "₹35,000",
    team: "SOLO / DUO",
    duration: "4 HOURS",
  },
  {
    id: "06",
    slug: "game-craft",
    coordinate: "SECTOR // F-3",
    title: "GAME CRAFT",
    category: "GAME DEVELOPMENT",
    description: "48-hour game development sprint using Unreal Engine 5 and custom shaders.",
    prize: "₹60,000",
    team: "UP TO 4",
    duration: "48 HOURS",
  },
];

export function HoltzmanCylinder() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const cardCount = CYLINDER_EVENTS.length;
  const angleStep = 360 / cardCount;
  // Calculate radius so cards form an unobstructed cylinder
  const cylinderRadius = 380; // pixels

  // Auto-rotation idle loop
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => prev - 0.25);
    }, 30);
    return () => clearInterval(interval);
  }, [isDragging]);

  // Pointer drag controls
  const handlePointerDown = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    setRotationAngle((prev) => prev + deltaX * 0.4);
    setStartX(clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 overflow-hidden select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[var(--border)] pb-6">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] uppercase">
            // SECTOR 01 // 3D HOLTZMAN CYLINDER
          </span>
          <h2 className="mt-2 font-mono text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            FLAGSHIP DIRECTIVES
          </h2>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4 font-mono text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5 text-[var(--accent-primary)]">
            <RotateCw className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "12s" }} />
            DRAG TO REVOLVE CYLINDER
          </span>
          <Link
            href="/events"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] tracking-widest flex items-center gap-1"
          >
            VIEW ALL 24+ <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 3D Cylindrical Arena */}
      <div
        ref={containerRef}
        className="relative flex h-[580px] w-full items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: "1100px" }}
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
      >
        {/* Revolving Cylinder Center Anchor */}
        <div
          className="relative h-full w-full flex items-center justify-center transition-transform duration-75 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotationAngle}deg)`,
          }}
        >
          {CYLINDER_EVENTS.map((event, index) => {
            const cardAngle = index * angleStep;
            // Compute relative angle to detect whether card is facing front
            const normalizedAngle = ((cardAngle + rotationAngle) % 360 + 360) % 360;
            const isFront = normalizedAngle > 300 || normalizedAngle < 60;

            return (
              <div
                key={event.id}
                className="mecha-bracket absolute h-[430px] w-[310px] sm:w-[330px] rounded border border-[var(--border)] bg-[var(--surface)]/95 p-6 flex flex-col justify-between shadow-2xl transition-all duration-300"
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${cylinderRadius}px)`,
                  backfaceVisibility: "hidden",
                  opacity: isFront ? 1 : 0.45,
                  filter: isFront ? "none" : "blur(1.5px)",
                  borderColor: isFront ? "var(--border-accent)" : "var(--border)",
                  boxShadow: isFront ? "var(--glow)" : "none",
                }}
              >
                <div>
                  {/* Chessboard Coordinate & Index */}
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-[var(--text-muted)] border-b border-[var(--border)] pb-3 mb-4">
                    <span>{event.coordinate}</span>
                    <span className="font-bold text-[var(--accent-primary)]">{event.id}</span>
                  </div>

                  <span className="font-mono text-[9px] tracking-[0.25em] text-[var(--accent-primary)] font-bold uppercase">
                    {event.category}
                  </span>

                  <h3 className="mt-1 font-mono text-2xl font-black text-[var(--text-primary)]">
                    {event.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-[var(--text-secondary)] line-clamp-3">
                    {event.description}
                  </p>
                </div>

                <div>
                  {/* 3-Point Telemetry Row */}
                  <div className="grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-4 mb-6 font-mono text-[10px]">
                    <div>
                      <div className="text-[var(--text-muted)] flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-[var(--accent-primary)]" /> PRIZE
                      </div>
                      <div className="font-bold text-[var(--text-primary)] mt-1">{event.prize}</div>
                    </div>
                    <div>
                      <div className="text-[var(--text-muted)] flex items-center gap-1">
                        <Users className="h-3 w-3 text-[var(--accent-primary)]" /> TEAM
                      </div>
                      <div className="font-bold text-[var(--text-primary)] mt-1">{event.team}</div>
                    </div>
                    <div>
                      <div className="text-[var(--text-muted)] flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[var(--accent-primary)]" /> TIME
                      </div>
                      <div className="font-bold text-[var(--text-primary)] mt-1">{event.duration}</div>
                    </div>
                  </div>

                  <Link href={`/events/${event.slug}`} className="w-full block">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <span>ENGAGE DIRECTIVE</span>
                      <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
