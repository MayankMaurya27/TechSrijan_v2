"use client";

import { useEffect, useRef } from "react";

/**
 * Clean, soft volumetric atmospheric lighting without ANY noisy dots or particle points.
 * Fluidly reacts to mouse movement and scroll position to enhance the background gradient.
 */
export function About3DScene() {
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

      // Smooth soft atmospheric light blooms (No dots, no harsh points)
      // 1. Warm Golden/Amber Core Light
      const goldX = width * 0.65 + (mouseX - width * 0.5) * 0.08 + Math.sin(time * 0.6) * 30;
      const goldY = height * 0.3 + (mouseY - height * 0.5) * 0.08 + Math.cos(time * 0.5) * 20 - (scrollY * 0.15) % height;

      const grad1 = ctx.createRadialGradient(goldX, goldY, 20, goldX, goldY, width * 0.45);
      grad1.addColorStop(0, "rgba(212, 168, 67, 0.12)");
      grad1.addColorStop(0.5, "rgba(202, 164, 207, 0.06)");
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // 2. Celestial Cyan Light Bloom
      const cyanX = width * 0.2 + (mouseX - width * 0.5) * 0.06 + Math.cos(time * 0.7) * 25;
      const cyanY = height * 0.7 + (mouseY - height * 0.5) * 0.06 + Math.sin(time * 0.6) * 20 - (scrollY * 0.2) % height;

      const grad2 = ctx.createRadialGradient(cyanX, cyanY, 20, cyanX, cyanY, width * 0.4);
      grad2.addColorStop(0, "rgba(121, 199, 227, 0.10)");
      grad2.addColorStop(0.6, "rgba(100, 160, 220, 0.04)");
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
