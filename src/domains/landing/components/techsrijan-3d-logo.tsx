"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
// three.js and gsap are imported dynamically (after load/idle, or on interaction) to keep them off the critical path
import type * as THREE from "three";
import { whenIdleAfterLoad, type CanonicalTheme } from "@/core";
import { getPrefersReducedMotion } from "@/core/utils/reduced-motion";
import { useActiveCanonicalTheme } from "../hooks/use-active-theme";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";

interface TechSrijan3DLogoProps {
  scrollProgress: number;
  hasEntered: boolean;
}

const ALL_THEMES: CanonicalTheme[] = ["arrakis-day", "geass-moon", "krelln-night"];

const LOGO_THEMES: Record<
  CanonicalTheme,
  {
    imageSrcWebp: string;
    particleGrad: [string, string, string];
    specularGradient: string;
    shockwaveBorder: string;
    shockwaveShadow: string;
    dropGlow: string;
  }
> = {
  // Arrakis Solar Day - Imperial Sand Gold & Radiant Solar Amber
  "arrakis-day": {
    imageSrcWebp: "/hero-logo-arrakis-day.webp",
    particleGrad: [
      "rgba(255, 245, 215, 1)",
      "rgba(245, 158, 11, 0.85)",
      "rgba(180, 83, 9, 0.25)",
    ],
    specularGradient:
      "radial-gradient(circle, rgba(255, 245, 215, 0.95) 0%, rgba(255, 205, 120, 0.55) 35%, rgba(245, 158, 11, 0.2) 65%, transparent 80%)",
    shockwaveBorder: "border-amber-400/80",
    shockwaveShadow:
      "0 0 25px 6px rgba(245, 158, 11, 0.6), inset 0 0 15px 4px rgba(254, 240, 138, 0.4)",
    dropGlow: "drop-shadow(0 0 4px rgba(212, 168, 67, 0.2))",
  },

  // Geass Moon - The Iconic Piercing Crimson & Sakuradite Core
  "geass-moon": {
    imageSrcWebp: "/hero-logo-geass-moon.webp",
    particleGrad: [
      "rgba(255, 215, 220, 1)",
      "rgba(255, 30, 39, 0.85)",
      "rgba(184, 0, 12, 0.25)",
    ],
    specularGradient:
      "radial-gradient(circle, rgba(255, 230, 235, 0.95) 0%, rgba(255, 60, 70, 0.55) 35%, rgba(200, 0, 20, 0.15) 65%, transparent 80%)",
    shockwaveBorder: "border-red-500/80",
    shockwaveShadow:
      "0 0 15px 3px rgba(255, 30, 39, 0.4), inset 0 0 8px 2px rgba(255, 166, 172, 0.3)",
    dropGlow: "drop-shadow(0 0 4px rgba(255, 30, 39, 0.2))",
  },

  // Krelln Night - Moonlit Dust & Stark Monochromatic Silver / Grey
  "krelln-night": {
    imageSrcWebp: "/hero-logo-krelln-night.webp",
    particleGrad: [
      "rgba(255, 255, 255, 1)",
      "rgba(215, 220, 228, 0.85)",
      "rgba(148, 163, 184, 0.25)",
    ],
    specularGradient:
      "radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(215, 220, 228, 0.55) 35%, rgba(148, 163, 184, 0.15) 65%, transparent 80%)",
    shockwaveBorder: "border-slate-400/80",
    shockwaveShadow:
      "0 0 15px 3px rgba(148, 163, 184, 0.4), inset 0 0 8px 2px rgba(241, 245, 249, 0.3)",
    dropGlow: "drop-shadow(0 0 4px rgba(148, 163, 184, 0.2))",
  },
};

export function TechSrijan3DLogo({ scrollProgress, hasEntered }: TechSrijan3DLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);
  const scrollProgressRef = useRef(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  // Synchronize active theme dynamically with zero latency
  const currentTheme = useActiveCanonicalTheme();
  const activeConf = LOGO_THEMES[currentTheme] || LOGO_THEMES["arrakis-day"];

  // Mouse & interactive 3D physics — direct DOM mutation via refs (Zero React re-render churn)
  const currentTiltRef = useRef({ rotX: 0, rotY: 0, translateZ: 0 });
  const currentSpecularRef = useRef({ x: 50, y: 50, opacity: 0 });
  const targetTiltRef = useRef({ rotX: 0, rotY: 0, translateZ: 0, lightX: 50, lightY: 50, lightOpacity: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Direct element references for 60/120fps hardware composite mutations
  const sheenLayerRef = useRef<HTMLDivElement>(null);
  const sheenDotRef = useRef<HTMLDivElement>(null);

  // Shockwave state
  const [shockwaves, setShockwaves] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const shockwaveIdRef = useRef(0);

  // Ref for Three.js texture updating
  const spriteCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Update Three.js particle colors when theme changes
  useEffect(() => {
    const sCanvas = spriteCanvasRef.current;
    const pTexture = particleTextureRef.current;
    if (!sCanvas || !pTexture) return;

    const sCtx = sCanvas.getContext("2d");
    if (!sCtx) return;

    const [c0, c1, c2] = activeConf.particleGrad;
    sCtx.clearRect(0, 0, 32, 32);
    const grad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, c0);
    grad.addColorStop(0.28, c1);
    grad.addColorStop(0.65, c2);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 32, 32);

    pTexture.needsUpdate = true;
  }, [currentTheme, activeConf]);

  // Three.js Ember Particles System (loaded once the page is idle so it never delays the logo paint)
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let stopParticles: (() => void) | undefined;
    // WebGL setup is a ~400ms main-thread task on mid-range phones: keep it well clear of startup
    const cancelIdle = whenIdleAfterLoad(() => {
      import("three").then((THREE) => {
        if (!disposed) stopParticles = startParticles(THREE);
      });
    }, 3000);

    const startParticles = (THREE: typeof import("three")) => {
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || 450;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // Create soft glowing circle sprite for particles
      const spriteCanvas = document.createElement("canvas");
      spriteCanvas.width = 32;
      spriteCanvas.height = 32;
      spriteCanvasRef.current = spriteCanvas;

      const sCtx = spriteCanvas.getContext("2d");
      if (sCtx) {
        const [c0, c1, c2] = activeConf.particleGrad;
        const grad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, c0);
        grad.addColorStop(0.28, c1);
        grad.addColorStop(0.65, c2);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        sCtx.fillStyle = grad;
        sCtx.fillRect(0, 0, 32, 32);
      }
      const particleTexture = new THREE.CanvasTexture(spriteCanvas);
      particleTextureRef.current = particleTexture;

      // Particle geometries
      const particleCount = 45;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 6.5;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1.8;

        velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.003;
        velocities[i * 3 + 1] = Math.random() * 0.005 + 0.002; // drift upward
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: 0.12,
        map: particleTexture,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      let isRunning = true;
      let startTime = performance.now();
      let particleRafId: number | null = null;

      const animateParticles = () => {
        if (!isRunning) return;

        // Skip GPU computation & render when logo is scrolled out of view or tab is hidden
        if (scrollProgressRef.current > 0.15 || document.hidden) {
          particleRafId = requestAnimationFrame(animateParticles);
          return;
        }

        const elapsed = (performance.now() - startTime) * 0.001;
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const pos = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          pos[idx + 0] += velocities[idx + 0] + Math.sin(elapsed + i) * 0.0008;
          pos[idx + 1] += velocities[idx + 1];
          pos[idx + 2] += velocities[idx + 2];

          // Reset if floated above top
          if (pos[idx + 1] > 1.4) {
            pos[idx + 1] = -1.3;
            pos[idx + 0] = (Math.random() - 0.5) * 6.5;
          }
        }
        posAttr.needsUpdate = true;
        renderer.render(scene, camera);

        particleRafId = requestAnimationFrame(animateParticles);
      };

      // Check prefers-reduced-motion: if enabled, render single static frame without continuous animation
      const prefersReducedMotion = getPrefersReducedMotion();
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      } else {
        particleRafId = requestAnimationFrame(animateParticles);
      }

      const handleResize = () => {
        if (!canvas.parentElement) return;
        const w = canvas.parentElement.clientWidth || window.innerWidth;
        const h = canvas.parentElement.clientHeight || 450;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        isRunning = false;
        if (particleRafId !== null) {
          cancelAnimationFrame(particleRafId);
          particleRafId = null;
        }
        window.removeEventListener("resize", handleResize);

        // Complete Three.js & WebGL Resource Disposal
        scene.remove(points);
        geometry.dispose();
        material.dispose();
        particleTexture.dispose();
        particleTextureRef.current = null;
        spriteCanvasRef.current = null;

        renderer.forceContextLoss();
        renderer.dispose();
      };
    };

    return () => {
      disposed = true;
      cancelIdle();
      stopParticles?.();
    };
  }, []);

  // Spring physics loop for 3D tilt and specular lighting — Direct DOM mutations without React re-renders
  useEffect(() => {
    let active = true;

    // Prefers-reduced-motion check: lock to resting equilibrium without running rAF loop
    const prefersReducedMotion = getPrefersReducedMotion();
    if (prefersReducedMotion) {
      if (cardRef.current) {
        cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
      }
      return;
    }

    const updatePhysics = () => {
      if (!active) return;

      // When scrolled out of view or tab hidden, throttle physics updates
      if (scrollProgressRef.current > 0.15 || document.hidden) {
        animFrameRef.current = requestAnimationFrame(updatePhysics);
        return;
      }

      const cur = currentTiltRef.current;
      const target = targetTiltRef.current;

      const diffX = target.rotX - cur.rotX;
      const diffY = target.rotY - cur.rotY;
      const diffZ = target.translateZ - cur.translateZ;

      if (Math.abs(diffX) >= 0.005 || Math.abs(diffY) >= 0.005 || Math.abs(diffZ) >= 0.01) {
        cur.rotX += diffX * 0.08;
        cur.rotY += diffY * 0.08;
        cur.translateZ += diffZ * 0.1;

        if (cardRef.current) {
          cardRef.current.style.transform = `rotateX(${cur.rotX.toFixed(2)}deg) rotateY(${cur.rotY.toFixed(2)}deg) translateZ(${cur.translateZ.toFixed(1)}px)`;
        }
      }

      const curSpec = currentSpecularRef.current;
      const specDiffX = target.lightX - curSpec.x;
      const specDiffY = target.lightY - curSpec.y;
      const specDiffOp = target.lightOpacity - curSpec.opacity;

      if (Math.abs(specDiffX) >= 0.05 || Math.abs(specDiffY) >= 0.05 || Math.abs(specDiffOp) >= 0.005) {
        curSpec.x += specDiffX * 0.1;
        curSpec.y += specDiffY * 0.1;
        curSpec.opacity += specDiffOp * 0.08;

        if (sheenLayerRef.current) {
          sheenLayerRef.current.style.opacity = curSpec.opacity.toFixed(3);
        }
        if (sheenDotRef.current) {
          sheenDotRef.current.style.left = `${curSpec.x.toFixed(2)}%`;
          sheenDotRef.current.style.top = `${curSpec.y.toFixed(2)}%`;
        }
      }

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      active = false;
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, []);

  // Entrance specular sweep with GSAP
  useEffect(() => {
    if (!hasEntered) return;

    if (getPrefersReducedMotion()) {
      targetTiltRef.current.lightOpacity = 0.35;
      targetTiltRef.current.lightX = 50;
      targetTiltRef.current.lightY = 50;
      return;
    }

    const target = targetTiltRef.current;
    target.lightOpacity = 0.85;
    target.lightX = -20;
    target.lightY = 50;

    let cancelled = false;
    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      gsap.to(target, {
        lightX: 120,
        duration: 1.8,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to(target, {
            lightOpacity: 0.45,
            lightX: 50,
            lightY: 50,
            duration: 0.8,
            ease: "power2.out",
          });
        },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [hasEntered]);

  // Pointer movement tracking
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const normX = (x - 0.5) * 2;
    const normY = (y - 0.5) * 2;

    targetTiltRef.current.rotX = -normY * 7.5;
    targetTiltRef.current.rotY = normX * 10.5;
    targetTiltRef.current.translateZ = 12;

    targetTiltRef.current.lightX = x * 100;
    targetTiltRef.current.lightY = y * 100;
    targetTiltRef.current.lightOpacity = 0.65;
  }, []);

  const handlePointerLeave = useCallback(() => {
    targetTiltRef.current.rotX = 0;
    targetTiltRef.current.rotY = 0;
    targetTiltRef.current.translateZ = 0;
    targetTiltRef.current.lightOpacity = 0.25;
    targetTiltRef.current.lightX = 50;
    targetTiltRef.current.lightY = 50;
    if (cardRef.current) {
      cardRef.current.style.transition = "none";
    }
  }, []);

  // Click / Tap shockwave and tactile 3D bounce
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    targetTiltRef.current.translateZ = -15;
    if (cardRef.current) {
      cardRef.current.style.transition = "transform 0.08s ease-out";
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newId = ++shockwaveIdRef.current;
    setShockwaves((prev) => [...prev, { id: newId, x: clickX, y: clickY }]);

    setTimeout(() => {
      setShockwaves((prev) => prev.filter((sw) => sw.id !== newId));
    }, 900);

    const card = cardRef.current;
    if (card) {
      import("gsap").then(({ gsap }) => {
        gsap.killTweensOf(card);
        gsap.timeline()
          .to(card, {
            scale: 0.97,
            duration: 0.08,
            ease: "power2.out",
          })
          .to(card, {
            scale: 1.0,
            duration: 0.6,
            ease: "elastic.out(1.1, 0.4)",
          });
      });
    }

    targetTiltRef.current.lightOpacity = 1.0;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transition = "none";
    }
    targetTiltRef.current.translateZ = 12;
    setTimeout(() => {
      targetTiltRef.current.lightOpacity = 0.55;
    }, 200);
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative w-full max-w-[94vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl flex items-center justify-center cursor-pointer select-none pointer-events-auto touch-pan-y py-2"
      style={{
        perspective: "1200px",
      }}
    >
      {/* Background 3D Ember Particles Canvas */}
      <canvas
        ref={particlesCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-75"
      />

      {/* Main 3D Interactive Card Container */}
      <div
        ref={cardRef}
        className="relative w-full flex justify-center items-center"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          willChange: "transform",
        }}
      >
        {/* Layer 1: Themed emblem. Visibility comes from CSS on html[data-theme] (set before first paint by the
            inline head script), so the server HTML already shows the right logo. Inactive logos are display:none,
            and lazy images that are display:none are never fetched, so only the active theme downloads. */}
        <div className="relative w-full flex justify-center">
          {ALL_THEMES.map((tKey) => {
            const conf = LOGO_THEMES[tKey];
            return (
              <div key={tKey} data-logo-theme={tKey} className="hero-logo-theme w-full justify-center">
                <Image
                  src={conf.imageSrcWebp}
                  alt="TechSrijan'27 — The Awakening Begins — techfest of MMMUT Gorakhpur"
                  width={2172}
                  height={724}
                  fetchPriority="high"
                  sizes="(max-width: 640px) 94vw, 1024px"
                  quality={75}
                  className="w-full h-auto object-contain"
                  style={{
                    imageRendering: "-webkit-optimize-contrast",
                    filter: `drop-shadow(0 3px 8px rgba(0,0,0,0.75)) ${conf.dropGlow}`,
                  }}
                />
              </div>
            );
          })}

          {/* Layer 2: Interactive Specular Sheen (Directly animated via sheenLayerRef and sheenDotRef) */}
          <div
            ref={sheenLayerRef}
            className="absolute inset-0 pointer-events-none overflow-hidden z-20"
            style={{
              maskImage: `url(${activeConf.imageSrcWebp}?v=tsfinal1)`,
              WebkitMaskImage: `url(${activeConf.imageSrcWebp}?v=tsfinal1)`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              mixBlendMode: "color-dodge",
              opacity: 0,
              transition: "opacity 0.25s ease-out",
            }}
          >
            <div
              ref={sheenDotRef}
              className="absolute rounded-full pointer-events-none blur-[24px]"
              style={{
                width: "360px",
                height: "360px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                background: activeConf.specularGradient,
              }}
            />
          </div>

          {/* Layer 3: Interactive Click Shockwave Rings in Theme Colors */}
          {shockwaves.map((sw) => (
            <div
              key={sw.id}
              className={`absolute pointer-events-none rounded-full border ${activeConf.shockwaveBorder} animate-ping z-30`}
              style={{
                left: sw.x,
                top: sw.y,
                width: "40px",
                height: "40px",
                transform: "translate(-50%, -50%)",
                boxShadow: activeConf.shockwaveShadow,
                animationDuration: "0.85s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
