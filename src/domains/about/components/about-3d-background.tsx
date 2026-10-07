"use client";

import { useEffect, useRef } from "react";

interface StardustParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  baseOpacity: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

export function About3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // Parallax tracking
    let mouseX = width * 0.5;
    let mouseY = height * 0.3;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Stardust & celestial particle cloud
    const particleCount = Math.min(80, Math.floor(width / 20));
    const palette = [
      "212, 168, 67",  // Imperial Gold
      "245, 230, 200", // Warm Parchment
      "220, 180, 110", // Sand Amber
      "120, 200, 240", // Celestial Cyan
    ];

    const particles: StardustParticle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.35 - 0.08,
      baseOpacity: Math.random() * 0.55 + 0.2,
      opacity: 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      twinklePhase: Math.random() * Math.PI * 2,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));

    let time = 0;

    const render = () => {
      time += 0.012;

      // Smooth mouse easing
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, width, height);

      // 1. Soft atmospheric nebula glow
      const cx = width * 0.5 + (mouseX - width * 0.5) * 0.05;
      const cy = height * 0.35 + (mouseY - height * 0.35) * 0.05;

      const grad1 = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.55);
      grad1.addColorStop(0, "rgba(212, 168, 67, 0.07)");
      grad1.addColorStop(0.4, "rgba(160, 90, 40, 0.03)");
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // 2. Astrolabe Citadel Orbiting Rings
      const ringCenterX = width * 0.85;
      const ringCenterY = height * 0.25;
      const ringBaseRadius = Math.min(width, height) * 0.38;

      ctx.save();
      ctx.translate(ringCenterX, ringCenterY);

      // Ring 1
      ctx.beginPath();
      ctx.ellipse(0, 0, ringBaseRadius, ringBaseRadius * 0.42, time * 0.08, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(212, 168, 67, 0.05)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 12]);
      ctx.stroke();

      // Ring 2
      ctx.beginPath();
      ctx.ellipse(0, 0, ringBaseRadius * 1.35, ringBaseRadius * 0.58, -time * 0.05, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 18]);
      ctx.stroke();

      ctx.restore();

      // 3. Stardust particles with mouse avoidance & constellation links
      ctx.setLineDash([]);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Mouse gentle deflection
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const force = (130 - dist) / 130;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }

        p.twinklePhase += p.twinkleSpeed;
        p.opacity = p.baseOpacity * (0.65 + 0.35 * Math.sin(p.twinklePhase));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.shadowColor = `rgba(${p.color}, ${p.opacity * 0.8})`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Subtle constellation threads between neighboring particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < 85) {
            const lineAlpha = (1 - cdist / 85) * 0.12 * Math.min(p.opacity, p2.opacity);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 168, 67, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full bg-[#000000]"
    />
  );
}
