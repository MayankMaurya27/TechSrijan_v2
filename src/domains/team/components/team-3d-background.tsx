"use client";

import { useEffect, useRef } from "react";

interface SpiceParticle {
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

export function Team3DBackground() {
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

    // Mouse tracking for smooth fluid parallax
    let mouseX = width * 0.5;
    let mouseY = height * 0.3;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    // 1. Floating Spice Embers & Starlight (Referencing ambient-particles & social-constellation)
    const particleCount = Math.min(85, Math.floor(width / 18));
    const palette = [
      "212, 168, 67",  // Spice Gold
      "245, 230, 200", // Parchment Star
      "220, 180, 110", // Warm Amber
      "120, 190, 240", // Deep Celestial Cyan
    ];

    const particles: SpiceParticle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.0 + 0.8,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.35 - 0.12,
      baseOpacity: Math.random() * 0.4 + 0.15,
      opacity: 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.008,
      twinklePhase: Math.random() * Math.PI * 2,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      const parallaxX = (mouseX - width / 2) * 0.04;
      const parallaxY = (mouseY - height / 2) * 0.03;

      // -----------------------------------------------------------------
      // LAYER 1: Deep Atmospheric Nebula Pools (Soft & Diffuse, No harsh rays)
      // -----------------------------------------------------------------
      const radial1 = ctx.createRadialGradient(
        width * 0.8 + parallaxX,
        height * 0.18 + parallaxY,
        20,
        width * 0.8 + parallaxX,
        height * 0.18 + parallaxY,
        width * 0.65
      );
      radial1.addColorStop(0, "rgba(212, 168, 67, 0.07)");
      radial1.addColorStop(0.45, "rgba(180, 120, 40, 0.025)");
      radial1.addColorStop(1, "transparent");
      ctx.fillStyle = radial1;
      ctx.fillRect(0, 0, width, height);

      const radial2 = ctx.createRadialGradient(
        width * 0.2 - parallaxX,
        height * 0.65 - parallaxY,
        10,
        width * 0.2 - parallaxX,
        height * 0.65 - parallaxY,
        width * 0.55
      );
      radial2.addColorStop(0, "rgba(70, 100, 180, 0.045)");
      radial2.addColorStop(1, "transparent");
      ctx.fillStyle = radial2;
      ctx.fillRect(0, 0, width, height);

      // -----------------------------------------------------------------
      // LAYER 2: Delicate Celestial Constellation Lines (Interactive Star Map)
      // -----------------------------------------------------------------
      ctx.save();
      const maxDistance = 110;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212, 168, 67, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // -----------------------------------------------------------------
      // LAYER 3: Subtle Rotating Astrolabe Orbit Ellipses (From social-constellation)
      // -----------------------------------------------------------------
      ctx.save();
      const astrolabeX = width * 0.5 + parallaxX * 0.5;
      const astrolabeY = height * 0.4 + parallaxY * 0.5;
      const ringRadius = Math.min(width, height) * 0.42;

      // Primary fine ellipse
      ctx.beginPath();
      ctx.ellipse(astrolabeX, astrolabeY, ringRadius, ringRadius * 0.44, time * 0.02, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(212, 168, 67, 0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Secondary counter-rotating dashed ellipse
      ctx.beginPath();
      ctx.setLineDash([4, 14]);
      ctx.ellipse(astrolabeX, astrolabeY, ringRadius * 1.2, ringRadius * 0.54, -time * 0.015 + 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0, 229, 255, 0.04)";
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // -----------------------------------------------------------------
      // LAYER 4: Floating Spice Embers with Mouse Physics
      // -----------------------------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Deflect gently away from cursor
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130 && dist > 0) {
          const force = (130 - dist) / 130;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        // Drifting velocity + natural wave
        p.x += p.speedX + Math.sin(time + p.twinklePhase) * 0.18;
        p.y += p.speedY;

        // Wrap around viewport edges
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Twinkle pulse
        const twinkle = (Math.sin(time * p.twinkleSpeed * 60 + p.twinklePhase) + 1) * 0.5;
        p.opacity = p.baseOpacity * (0.6 + twinkle * 0.8);

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.shadowColor = `rgba(${p.color}, 0.5)`;
        ctx.shadowBlur = p.size * 2.5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
