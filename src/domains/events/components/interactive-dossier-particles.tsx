"use client";

import { useEffect, useRef } from "react";

export interface InteractiveDossierParticlesProps {
  /** Active club glow color, e.g. "rgba(168, 85, 247, 0.5)" */
  activeClubGlow?: string;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  baseSize: number;
  alpha: number;
  targetAlpha: number;
  phase: number;
  frequency: number;
  type: "micro" | "spark" | "orb" | "diamond";
  colorTier: "white" | "silver" | "gold" | "accent";
  rotation: number;
  rotationSpeed: number;
}

interface ClickRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

// Helper to extract RGB numbers from color strings like "rgba(168, 85, 247, 0.5)" or "#a855f7"
function parseRgb(colorStr?: string): [number, number, number] {
  if (!colorStr) return [212, 168, 67]; // Default Dune Spice Gold

  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (match) {
    return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
  }

  // Hex fallback
  if (colorStr.startsWith("#") && colorStr.length >= 7) {
    const r = parseInt(colorStr.slice(1, 3), 16);
    const g = parseInt(colorStr.slice(3, 5), 16);
    const b = parseInt(colorStr.slice(5, 7), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return [r, g, b];
  }

  return [212, 168, 67];
}

export function InteractiveDossierParticles({
  activeClubGlow,
  className = "",
}: InteractiveDossierParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Store target accent color and interpolate smoothly
  const targetAccentRef = useRef<[number, number, number]>([212, 168, 67]);
  const currentAccentRef = useRef<[number, number, number]>([212, 168, 67]);

  useEffect(() => {
    targetAccentRef.current = parseRgb(activeClubGlow);
  }, [activeClubGlow]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let isVisible = true;

    // Track mouse coordinates relative to container
    let mouseX = -9999;
    let mouseY = -9999;
    let targetMouseX = -9999;
    let targetMouseY = -9999;
    let isMouseActive = false;
    let mouseFadeTimer: ReturnType<typeof setTimeout> | null = null;

    const ripples: ClickRipple[] = [];

    // Resize handling with DPR capping at 2 for silky 60fps performance
    const updateDimensions = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(container);

    // Visibility toggle when scrolled into/out of view
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisible = entry?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Pointer move listener on window so movement over cards & buttons still registers
    let rawClientX = -9999;
    let rawClientY = -9999;

    const updateMouseCoords = () => {
      if (rawClientX === -9999) return;
      const rect = container.getBoundingClientRect();
      targetMouseX = rawClientX - rect.left;
      targetMouseY = rawClientY - rect.top;
    };

    const handlePointerMove = (e: PointerEvent) => {
      rawClientX = e.clientX;
      rawClientY = e.clientY;
      updateMouseCoords();

      isMouseActive = true;
      if (mouseFadeTimer) clearTimeout(mouseFadeTimer);
      mouseFadeTimer = setTimeout(() => {
        isMouseActive = false;
      }, 3500);
    };

    const handleScroll = () => {
      updateMouseCoords();
    };

    // Pointer leave listener
    const handlePointerLeave = () => {
      isMouseActive = false;
    };

    // Click / Tap shockwave ripple generator
    const handlePointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Only trigger if click occurs within or near the section bounds
      if (clickX >= 0 && clickX <= width && clickY >= -50 && clickY <= height + 50) {
        ripples.push({
          x: clickX,
          y: clickY,
          radius: 0,
          maxRadius: Math.min(width, 360),
          alpha: 0.7,
          speed: 7.5,
        });
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    // Particle Population Generator
    const isMobile = width < 768;
    const count = isMobile ? 65 : Math.min(150, Math.max(90, Math.floor((width * height) / 14000)));

    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      let type: Particle["type"] = "micro";
      let colorTier: Particle["colorTier"] = "white";
      let baseSize = Math.random() * 1.5 + 1; // 1 to 2.5px micro

      if (roll < 0.12) {
        // Big ethereal bokeh orbs (12% of particles)
        type = "orb";
        baseSize = Math.random() * 16 + 12; // 12px to 28px
        colorTier = Math.random() < 0.5 ? "accent" : "gold";
      } else if (roll < 0.32) {
        // Cybernetic diamond sparks (20% of particles)
        type = "diamond";
        baseSize = Math.random() * 3.5 + 3; // 3px to 6.5px
        colorTier = Math.random() < 0.4 ? "accent" : Math.random() < 0.7 ? "gold" : "silver";
      } else if (roll < 0.55) {
        // Medium glow nodes (23% of particles)
        type = "spark";
        baseSize = Math.random() * 2.5 + 2.5; // 2.5px to 5px
        colorTier = Math.random() < 0.4 ? "accent" : "white";
      } else {
        // Micro stardust (45% of particles)
        type = "micro";
        baseSize = Math.random() * 1.6 + 0.8;
        colorTier = Math.random() < 0.4 ? "white" : Math.random() < 0.7 ? "silver" : "gold";
      }

      // Smooth omnidirectional base velocity ("moving here and there")
      const angle = Math.random() * Math.PI * 2;
      const speed =
        type === "orb"
          ? Math.random() * 0.22 + 0.08
          : type === "diamond"
          ? Math.random() * 0.35 + 0.15
          : Math.random() * 0.45 + 0.2;

      particles.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 900),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        size: baseSize,
        baseSize,
        alpha: Math.random() * 0.4 + 0.2,
        targetAlpha: Math.random() * 0.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        frequency: Math.random() * 0.02 + 0.008,
        type,
        colorTier,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    let time = 0;

    // Main 60fps render loop
    const render = () => {
      animId = requestAnimationFrame(render);

      if (!isVisible || width <= 0 || height <= 0) return;

      time += 0.02;

      // Smooth color transition for dynamic club switching
      const [curR, curG, curB] = currentAccentRef.current;
      const [tgtR, tgtG, tgtB] = targetAccentRef.current;
      currentAccentRef.current = [
        curR + (tgtR - curR) * 0.06,
        curG + (tgtG - curG) * 0.06,
        curB + (tgtB - curB) * 0.06,
      ];
      const [accentR, accentG, accentB] = currentAccentRef.current.map(Math.round);

      // Smooth mouse interpolation
      if (isMouseActive) {
        mouseX += (targetMouseX - mouseX) * 0.12;
        mouseY += (targetMouseY - mouseY) * 0.12;
      } else {
        mouseX += (-9999 - mouseX) * 0.05;
        mouseY += (-9999 - mouseY) * 0.05;
      }

      ctx.clearRect(0, 0, width, height);

      // ─── 1. Cursor Flashlight / Celestial Aura ─────────────────────────────
      if (isMouseActive && mouseX > -100 && mouseX < width + 100 && mouseY > -100 && mouseY < height + 100) {
        const mouseAura = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 240);
        mouseAura.addColorStop(0, `rgba(${accentR}, ${accentG}, ${accentB}, 0.1)`);
        mouseAura.addColorStop(0.4, "rgba(255, 255, 255, 0.03)");
        mouseAura.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = mouseAura;
        ctx.fillRect(mouseX - 240, mouseY - 240, 480, 480);
      }

      // ─── 2. Expanding Click Shockwave Ripples ──────────────────────────────
      for (let rIdx = ripples.length - 1; rIdx >= 0; rIdx--) {
        const rip = ripples[rIdx];
        rip.radius += rip.speed;
        rip.alpha *= 0.94;

        if (rip.alpha < 0.02 || rip.radius >= rip.maxRadius) {
          ripples.splice(rIdx, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${rip.alpha * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Secondary soft inner halo
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, Math.max(0, rip.radius - 8), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${rip.alpha * 0.3})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // ─── 3. Constellation & Tether Lines ──────────────────────────────────
      // Connect nearby nodes together and to mouse for high-tech cybernetic look
      const connectThreshold = isMobile ? 65 : 95;
      const tetherThreshold = isMobile ? 90 : 130;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.type === "micro") continue; // Keep micro dust free of heavy line calculations

        // Inter-particle links
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.type === "micro" || p2.type === "orb") continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectThreshold * connectThreshold) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / connectThreshold) * 0.12 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Filament line connecting particle to cursor
        if (isMouseActive) {
          const mdx = mouseX - p1.x;
          const mdy = mouseY - p1.y;
          const mDistSq = mdx * mdx + mdy * mdy;

          if (mDistSq < tetherThreshold * tetherThreshold) {
            const mDist = Math.sqrt(mDistSq);
            const tetherAlpha = (1 - mDist / tetherThreshold) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(${accentR}, ${accentG}, ${accentB}, ${tetherAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // ─── 4. Particle Physics & Drawing Loop ────────────────────────────────
      const interactionRadius = isMobile ? 120 : 180;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic organic turbulence ("moving here and there")
        const waveX = Math.sin(time + p.phase) * (p.type === "orb" ? 0.25 : 0.4);
        const waveY = Math.cos(time * 0.8 + p.phase) * (p.type === "orb" ? 0.25 : 0.4);

        p.x += p.vx + waveX;
        p.y += p.vy + waveY;

        // Rotation for diamonds & sparkles
        p.rotation += p.rotationSpeed;

        // Natural alpha pulse (twinkle)
        p.alpha += (Math.sin(time * 2 + p.phase) * 0.5 + 0.5) * 0.008;
        p.alpha = Math.max(0.12, Math.min(0.85, p.alpha));

        // ── Interactive Mouse Repulsion & Vortex Eddy Swirl ──
        if (isMouseActive) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.hypot(dx, dy);

          if (dist < interactionRadius && dist > 2) {
            const force = (1 - dist / interactionRadius);
            const push = force * (p.type === "orb" ? 1.8 : 3.2);

            // Radial push away from cursor
            p.x += (dx / dist) * push;
            p.y += (dy / dist) * push;

            // Perpendicular vortex swirl (fluid spiral effect)
            const swirl = force * 1.4;
            p.x += (-dy / dist) * swirl;
            p.y += (dx / dist) * swirl;

            // Dynamic illumination glow when near cursor
            p.alpha = Math.min(0.95, p.alpha + force * 0.35);
          }
        }

        // ── Shockwave Kinetic Impulse from Click Ripples ──
        for (let rIdx = 0; rIdx < ripples.length; rIdx++) {
          const rip = ripples[rIdx];
          const distFromRip = Math.hypot(p.x - rip.x, p.y - rip.y);
          const diff = distFromRip - rip.radius;

          if (Math.abs(diff) < 32 && distFromRip > 2) {
            const imp = (1 - Math.abs(diff) / 32) * rip.alpha * 6;
            p.x += ((p.x - rip.x) / distFromRip) * imp;
            p.y += ((p.y - rip.y) / distFromRip) * imp;
            p.alpha = Math.min(1, p.alpha + 0.4);
          }
        }

        // Dampen velocity back to base drift
        p.vx += (p.baseVx - p.vx) * 0.04;
        p.vy += (p.baseVy - p.vy) * 0.04;

        // Toroidal screen boundary wrapping
        const margin = p.size * 2 + 10;
        if (p.x < -margin) p.x = width + margin;
        if (p.x > width + margin) p.x = -margin;
        if (p.y < -margin) p.y = height + margin;
        if (p.y > height + margin) p.y = -margin;

        // ── Color Selection based on Tier ──
        let r = 255;
        let g = 255;
        let b = 255;

        if (p.colorTier === "silver") {
          r = 200;
          g = 215;
          b = 235;
        } else if (p.colorTier === "gold") {
          r = 224;
          g = 175;
          b = 85;
        } else if (p.colorTier === "accent") {
          r = accentR;
          g = accentG;
          b = accentB;
        }

        // ── Render by Particle Type ──
        if (p.type === "orb") {
          // Big ethereal bokeh orbs with volumetric radial falloff
          const rad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          rad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.55})`);
          rad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.25})`);
          rad.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.07})`);
          rad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = rad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Luminous bright pinprick core
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, p.size * 0.08), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "diamond") {
          // 4-point sci-fi diamond flare
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -s);
          ctx.quadraticCurveTo(0, 0, s, 0);
          ctx.quadraticCurveTo(0, 0, 0, s);
          ctx.quadraticCurveTo(0, 0, -s, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s);
          ctx.closePath();

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.9})`;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.6})`;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.restore();
        } else if (p.type === "spark") {
          // Glowing round nodes
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.85})`;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.5})`;
          ctx.shadowBlur = 4;
          ctx.fill();
        } else {
          // Micro stardust
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.75})`;
          ctx.fill();
        }
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handlePointerLeave);
      if (mouseFadeTimer) clearTimeout(mouseFadeTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
