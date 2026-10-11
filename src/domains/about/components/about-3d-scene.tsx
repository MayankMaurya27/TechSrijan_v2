"use client";

import { useEffect, useRef } from "react";
import { useAboutTheme } from "../data/about-theme";

/**
 * Clean, soft volumetric atmospheric lighting without ANY noisy dots or particle points.
 * Fluidly reacts to mouse movement, scroll position, and active theme colors.
 */
export function About3DScene() {
  const theme = useAboutTheme();
  const themeRef = useRef(theme);
  themeRef.current = theme;

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

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Draw ambient volumetric bloom once on mobile, saving 100% of GPU animation overhead
      const currentTheme = themeRef.current;
      ctx.clearRect(0, 0, width, height);
      const grad1 = ctx.createRadialGradient(width * 0.6, height * 0.3, 20, width * 0.6, height * 0.3, width * 0.55);
      grad1.addColorStop(0, `rgba(${currentTheme.particlePrimary}, 0.12)`);
      grad1.addColorStop(0.5, `rgba(${currentTheme.particleSecondary}, 0.05)`);
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }

    let mouseX = width * 0.5;
    let mouseY = height * 0.3;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let scrollY = window.scrollY;
    let targetScrollY = scrollY;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove);

    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.01;
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;
      scrollY += (targetScrollY - scrollY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const currentTheme = themeRef.current;

      // 1. Primary Volumetric Atmospheric Bloom
      const bloom1X = width * 0.65 + (mouseX - width * 0.5) * 0.08 + Math.sin(time * 0.6) * 30;
      const bloom1Y = height * 0.3 + (mouseY - height * 0.5) * 0.08 + Math.cos(time * 0.5) * 20 - (scrollY * 0.15) % height;

      const grad1 = ctx.createRadialGradient(bloom1X, bloom1Y, 20, bloom1X, bloom1Y, width * 0.45);
      grad1.addColorStop(0, `rgba(${currentTheme.particlePrimary}, 0.14)`);
      grad1.addColorStop(0.5, `rgba(${currentTheme.particleSecondary}, 0.06)`);
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // 2. Secondary Harmonic Light Bloom
      const bloom2X = width * 0.2 + (mouseX - width * 0.5) * 0.06 + Math.cos(time * 0.7) * 25;
      const bloom2Y = height * 0.7 + (mouseY - height * 0.5) * 0.06 + Math.sin(time * 0.6) * 20 - (scrollY * 0.2) % height;

      const grad2 = ctx.createRadialGradient(bloom2X, bloom2Y, 20, bloom2X, bloom2Y, width * 0.4);
      grad2.addColorStop(0, `rgba(${currentTheme.particleSecondary}, 0.10)`);
      grad2.addColorStop(0.6, `rgba(${currentTheme.particlePrimary}, 0.03)`);
      grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animId);
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
