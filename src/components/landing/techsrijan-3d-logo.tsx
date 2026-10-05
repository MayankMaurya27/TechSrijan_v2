"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import * as THREE from "three";
import gsap from "gsap";

interface TechSrijan3DLogoProps {
  scrollProgress: number;
  hasEntered: boolean;
}

export function TechSrijan3DLogo({ scrollProgress, hasEntered }: TechSrijan3DLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse & interactive 3D physics
  const [tilt, setTilt] = useState({ rotX: 0, rotY: 0, translateZ: 0 });
  const [specularPos, setSpecularPos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const targetTiltRef = useRef({ rotX: 0, rotY: 0, translateZ: 0, lightX: 50, lightY: 50, lightOpacity: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Shockwave state
  const [shockwaves, setShockwaves] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const shockwaveIdRef = useRef(0);

  // Three.js Ember Particles System (delicate golden/ruby stardust floating in 3D depth)
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;

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
    const sCtx = spriteCanvas.getContext("2d");
    if (sCtx) {
      const grad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255, 235, 190, 1)");
      grad.addColorStop(0.25, "rgba(255, 160, 50, 0.85)");
      grad.addColorStop(0.6, "rgba(220, 60, 20, 0.25)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(spriteCanvas);

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

    const animateParticles = () => {
      if (!isRunning) return;
      requestAnimationFrame(animateParticles);

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
    };

    animateParticles();

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
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  // Spring physics loop for 3D tilt and specular lighting
  useEffect(() => {
    let active = true;

    const updatePhysics = () => {
      if (!active) return;

      const target = targetTiltRef.current;
      setTilt((prev) => ({
        rotX: prev.rotX + (target.rotX - prev.rotX) * 0.08,
        rotY: prev.rotY + (target.rotY - prev.rotY) * 0.08,
        translateZ: prev.translateZ + (target.translateZ - prev.translateZ) * 0.1,
      }));

      setSpecularPos((prev) => ({
        x: prev.x + (target.lightX - prev.x) * 0.1,
        y: prev.y + (target.lightY - prev.y) * 0.1,
        opacity: prev.opacity + (target.lightOpacity - prev.opacity) * 0.08,
      }));

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Entrance specular sweep with GSAP
  useEffect(() => {
    if (!hasEntered) return;

    // Specular light sweeps across letters from left to right on initial entrance
    const target = targetTiltRef.current;
    target.lightOpacity = 0.85;
    target.lightX = -20;
    target.lightY = 50;

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
  }, [hasEntered]);

  // Pointer movement tracking
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    const normX = (x - 0.5) * 2; // -1 to 1
    const normY = (y - 0.5) * 2; // -1 to 1

    // Gentle 3D perspective tilt
    targetTiltRef.current.rotX = -normY * 7.5; // Max 7.5 deg tilt
    targetTiltRef.current.rotY = normX * 10.5; // Max 10.5 deg swivel
    targetTiltRef.current.translateZ = 12;

    // Move specular sheen highlight across the metallic surface
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
    setIsPressed(false);
  }, []);

  // Click / Tap shockwave and tactile 3D bounce
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setIsPressed(true);
    setIsInteractive(true);
    targetTiltRef.current.translateZ = -15;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newId = ++shockwaveIdRef.current;
    setShockwaves((prev) => [...prev, { id: newId, x: clickX, y: clickY }]);

    // Remove shockwave after animation completes
    setTimeout(() => {
      setShockwaves((prev) => prev.filter((sw) => sw.id !== newId));
    }, 900);

    // Tactile card bounce with GSAP
    if (cardRef.current) {
      gsap.killTweensOf(cardRef.current);
      gsap.timeline()
        .to(cardRef.current, {
          scale: 0.97,
          duration: 0.08,
          ease: "power2.out",
        })
        .to(cardRef.current, {
          scale: 1.0,
          duration: 0.6,
          ease: "elastic.out(1.1, 0.4)",
        });
    }

    // Flash specular sheen
    targetTiltRef.current.lightOpacity = 1.0;
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsPressed(false);
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
      className="relative w-full max-w-[94vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl flex items-center justify-center cursor-pointer select-none pointer-events-auto touch-none py-2"
      style={{
        perspective: "1200px",
      }}
      title="Interact with the 3D TechSrijan Emblem"
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
          transform: `rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) translateZ(${tilt.translateZ}px)`,
          transition: isPressed ? "transform 0.08s ease-out" : "none",
          willChange: "transform",
        }}
      >
        {/* Layer 1: The Exact, Authentic High-Resolution Emblem (100% faithful to Image 2) */}
        <div className="relative w-full flex justify-center">
          <picture className="w-full flex justify-center">
            <source srcSet="/hero-logo.webp" type="image/webp" />
            <Image
              src="/hero-logo.png"
              alt="TechSrijan '27 — The Awakening Begins — Coming Soon"
              width={2172}
              height={724}
              priority
              quality={100}
              className="w-full h-auto object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]"
              style={{
                imageRendering: "-webkit-optimize-contrast",
              }}
            />
          </picture>

          {/* Layer 2: Interactive Specular Sheen (Gleams across the metallic bevels on cursor move without shifting colors) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              maskImage: "url(/hero-logo.webp)",
              WebkitMaskImage: "url(/hero-logo.webp)",
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              mixBlendMode: "color-dodge",
              opacity: specularPos.opacity,
              transition: "opacity 0.25s ease-out",
            }}
          >
            <div
              className="absolute rounded-full pointer-events-none blur-[24px]"
              style={{
                width: "360px",
                height: "360px",
                left: `${specularPos.x}%`,
                top: `${specularPos.y}%`,
                transform: "translate(-50%, -50%)",
                background:
                  "radial-gradient(circle, rgba(255, 245, 215, 0.95) 0%, rgba(255, 205, 120, 0.55) 35%, rgba(255, 140, 50, 0.2) 65%, transparent 80%)",
              }}
            />
          </div>

          {/* Layer 3: Interactive Click Shockwave Rings */}
          {shockwaves.map((sw) => (
            <div
              key={sw.id}
              className="absolute pointer-events-none rounded-full border border-amber-400/80 animate-ping"
              style={{
                left: sw.x,
                top: sw.y,
                width: "40px",
                height: "40px",
                transform: "translate(-50%, -50%)",
                boxShadow:
                  "0 0 25px 6px rgba(255, 180, 50, 0.6), inset 0 0 15px 4px rgba(255, 220, 100, 0.4)",
                animationDuration: "0.85s",
              }}
            />
          ))}
        </div>
      </div>


    </div>
  );
}
