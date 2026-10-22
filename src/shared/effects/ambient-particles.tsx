"use client";

import { useEffect, useRef } from "react";
import { getPrefersReducedMotion } from "@/core/utils/reduced-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  targetOpacity: number;
}

export function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleColor = "196, 125, 72";

  const particleColorRef = useRef(particleColor);
  particleColorRef.current = particleColor;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    let animationFrameId: number | null = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = getPrefersReducedMotion();

    const drawStaticConstellation = () => {
      ctx.clearRect(0, 0, width, height);
      const count = 12; // Static, faint resting constellation
      const color = particleColorRef.current;
      for (let i = 0; i < count; i++) {
        const px = (i * 8.3 + 12) % width;
        const py = (i * 7.7 + 15) % height;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.25)`;
        ctx.fill();
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      if (prefersReducedMotion) {
        drawStaticConstellation();
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });

    if (prefersReducedMotion) {
      drawStaticConstellation();
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const isMobile = width < 768;
    const particleCount = isMobile ? 18 : Math.min(80, Math.floor(width / 20));
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.6,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.45 - 0.15,
      opacity: Math.random() * 0.5 + 0.1,
      targetOpacity: Math.random() * 0.6 + 0.2,
    }));

    let frameCount = 0;

    const render = () => {
      if (document.hidden || window.scrollY > height * 1.5) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      frameCount++;
      if (isMobile && frameCount % 2 !== 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const color = particleColorRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 0.6;
          p.y -= (dy / dist) * 0.6;
        }

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
