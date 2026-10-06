"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/core";

export function TwinSunsRays() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

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

    let mouseX = width * 0.75;
    let mouseY = height * 0.2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    const rayCount = 14;
    const rays = Array.from({ length: rayCount }, (_, i) => ({
      angleOffset: (i / rayCount) * Math.PI * 0.9 + 0.1,
      width: Math.random() * 0.12 + 0.05,
      speed: (Math.random() - 0.5) * 0.0008,
      baseAlpha: Math.random() * 0.08 + 0.03,
      currentAngle: 0,
    }));

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const sunX = width * 0.82 + (mouseX - width / 2) * 0.08;
      const sunY = height * 0.12 + (mouseY - height / 2) * 0.06;

      let primaryColor = "196, 125, 72";
      let secondaryColor = "240, 234, 225";
      let glowAlpha = 0.14;

      if (theme === "krelln-night") {
        primaryColor = "119, 130, 146";
        secondaryColor = "215, 219, 226";
        glowAlpha = 0.10;
      } else if (theme === "geass-moon" || theme === "giedi-prime") {
        primaryColor = "200, 0, 20";
        secondaryColor = "255, 30, 39";
        glowAlpha = 0.13;
      }

      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, width * 0.7);
      sunGlow.addColorStop(0, `rgba(${secondaryColor}, ${glowAlpha})`);
      sunGlow.addColorStop(0.3, `rgba(${primaryColor}, ${glowAlpha * 0.45})`);
      sunGlow.addColorStop(1, "transparent");
      ctx.fillStyle = sunGlow;
      ctx.fillRect(0, 0, width, height);

      const rayLength = Math.max(width, height) * 1.5;
      const sharedRayGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, rayLength * 0.8);
      sharedRayGrad.addColorStop(0, `rgba(${primaryColor}, 0.95)`);
      sharedRayGrad.addColorStop(0.4, `rgba(${secondaryColor}, 0.45)`);
      sharedRayGrad.addColorStop(1, "transparent");

      ctx.save();
      for (let i = 0; i < rays.length; i++) {
        const ray = rays[i];
        ray.currentAngle = ray.angleOffset + Math.sin(time * 0.8 + i) * 0.04;

        const x1 = sunX + Math.cos(ray.currentAngle - ray.width) * rayLength;
        const y1 = sunY + Math.sin(ray.currentAngle - ray.width) * rayLength;
        const x2 = sunX + Math.cos(ray.currentAngle + ray.width) * rayLength;
        const y2 = sunY + Math.sin(ray.currentAngle + ray.width) * rayLength;

        const alpha = Math.max(0, Math.min(1, ray.baseAlpha + Math.sin(time + i * 2) * 0.02));
        ctx.globalAlpha = alpha * 1.2;

        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fillStyle = sharedRayGrad;
        ctx.fill();
      }
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90 transition-opacity duration-1000"
    />
  );
}
