"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";
import { Sparkles, Compass, Shield, Wind, Radio } from "lucide-react";

interface Contact3DStageProps {
  theme: "dune" | "geass";
  onToggleTheme: () => void;
}

export function Contact3DStage({ theme, onToggleTheme }: Contact3DStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [paulOffset, setPaulOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 800;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    const isDune = theme === "dune";

    // Atmospheric Fog
    const fogColor = isDune ? 0x0f0503 : 0x07020a;
    scene.fog = new THREE.FogExp2(fogColor, 0.02);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 3.4, 15);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- SOFT ROUND PARTICLE TEXTURE GENERATOR ---
    const createParticleTexture = () => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        if (isDune) {
          grad.addColorStop(0, "rgba(255, 245, 210, 1)");
          grad.addColorStop(0.25, "rgba(255, 180, 70, 0.85)");
          grad.addColorStop(0.6, "rgba(255, 80, 20, 0.3)");
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        } else {
          grad.addColorStop(0, "rgba(255, 230, 240, 1)");
          grad.addColorStop(0.25, "rgba(255, 40, 80, 0.85)");
          grad.addColorStop(0.6, "rgba(160, 20, 180, 0.3)");
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(c);
    };

    const particleTexture = createParticleTexture();

    // --- PROCEDURAL 3D SAND DUNES TERRAIN ---
    const terrainGeo = new THREE.PlaneGeometry(80, 80, 90, 90);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      // Fluid natural dune wave equation with ridges and valleys
      const vz =
        Math.sin(vx * 0.11) * 3.6 +
        Math.cos(vy * 0.14) * 3.0 +
        Math.sin(vx * 0.28 + vy * 0.2) * 1.5 +
        Math.cos(vx * 0.06 - vy * 0.08) * 2.0;
      pos.setZ(i, vz);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: isDune ? 0xa04218 : 0x160510,
      roughness: isDune ? 0.75 : 0.4,
      metalness: isDune ? 0.18 : 0.8,
      flatShading: true,
    });

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI * 0.45;
    terrain.position.set(0, -2.6, 0);
    scene.add(terrain);

    // Tactical Wireframe Elevation Grid
    const wireMat = new THREE.MeshBasicMaterial({
      color: isDune ? 0xff7b2e : 0xe61924,
      wireframe: true,
      transparent: true,
      opacity: isDune ? 0.1 : 0.2,
    });
    const wireTerrain = new THREE.Mesh(terrainGeo, wireMat);
    wireTerrain.rotation.x = -Math.PI * 0.45;
    wireTerrain.position.set(0, -2.58, 0);
    scene.add(wireTerrain);

    // --- CELESTIAL RED MOON OF ARRAKIS / GEASS EYE ---
    const moonGeo = new THREE.SphereGeometry(7.5, 40, 40);
    const moonMat = new THREE.MeshStandardMaterial({
      color: isDune ? 0xc42000 : 0x88001e,
      emissive: isDune ? 0xff2800 : 0xcc0033,
      emissiveIntensity: isDune ? 1.05 : 1.3,
      roughness: 0.45,
      metalness: 0.25,
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(0, 10, -30);
    scene.add(moon);

    // Moon Atmospheric Corona Outer Glow
    const coronaGeo = new THREE.RingGeometry(7.6, 12.5, 52);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: isDune ? 0xff4800 : 0xe61924,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: isDune ? 0.32 : 0.45,
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    corona.position.set(0, 10, -30.2);
    scene.add(corona);

    // --- 3D FLOATING SPICE PARTICLES (4,000 SOFT GLOW PARTICLES) ---
    const particleCount = 4000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 50;
      particlePositions[i3 + 1] = Math.random() * 24 - 4;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 40;

      particleSpeeds[i3] = (Math.random() - 0.5) * 0.025 + 0.015; // horizontal wind
      particleSpeeds[i3 + 1] = Math.random() * 0.02 + 0.006;      // vertical thermal lift
      particleSpeeds[i3 + 2] = (Math.random() - 0.5) * 0.015;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isDune ? 0.38 : 0.42,
      map: particleTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(isDune ? 0x4a180c : 0x24061e, 2.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(isDune ? 0xff7b22 : 0xff1744, 3.6);
    sunLight.position.set(6, 16, -8);
    scene.add(sunLight);

    const rimLight = new THREE.PointLight(isDune ? 0xffb338 : 0xaa00ff, 2.8, 35);
    rimLight.position.set(-6, 5, 10);
    scene.add(rimLight);

    // Cursor tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
      setPaulOffset({ x: x * 14, y: -y * 8 });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth || 600;
      height = container.clientHeight || 800;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // --- ANIMATION LOOP ---
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Mouse smoothing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.045;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.045;

      // Parallax camera tilt
      camera.position.x = mouseRef.current.x * 2.5;
      camera.position.y = 3.4 + mouseRef.current.y * 1.6;
      camera.lookAt(0, 3.6, -10);

      // Subtle terrain breathing
      terrain.rotation.z = Math.sin(elapsed * 0.12) * 0.02;
      wireTerrain.rotation.z = terrain.rotation.z;

      // Moon subtle breathing
      moon.rotation.y = elapsed * 0.04;
      corona.rotation.z = elapsed * 0.025;

      // Drifting spice particles
      const posAttr = particleGeo.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        arr[i3] += particleSpeeds[i3];
        arr[i3 + 1] += particleSpeeds[i3 + 1];
        arr[i3 + 2] += particleSpeeds[i3 + 2];

        // Wrap around bounds
        if (arr[i3] > 26) arr[i3] = -26;
        if (arr[i3 + 1] > 22) arr[i3 + 1] = -4;
        if (arr[i3 + 2] > 22) arr[i3 + 2] = -22;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
    };
  }, [theme]);

  const isDune = theme === "dune";

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden select-none bg-gradient-to-b from-[#090302] via-[#120704] to-[#040102] rounded-3xl lg:rounded-none"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full z-0 block cursor-grab active:cursor-grabbing"
      />

      {/* Atmospheric Vignette Masks */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#080911] to-transparent z-10" />

      {/* Paul Atreides Cinematic Cutout Anchored with Interactive Depth */}
      <div
        style={{
          transform: `translate3d(calc(-50% + ${paulOffset.x}px), ${paulOffset.y}px, 0)`,
        }}
        className="pointer-events-none absolute bottom-0 left-1/2 w-[85%] sm:w-[74%] max-w-[530px] aspect-[1/1.5] z-10 transition-transform duration-300 ease-out"
      >
        <Image
          src="/paul-atreides.png"
          alt="Paul Atreides — Imperium Leader on Arrakis"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 550px"
          className="object-contain object-bottom filter drop-shadow-[0_20px_40px_rgba(255,60,0,0.45)] contrast-110 brightness-95"
        />

        {/* Dune Sand Shimmer at his feet */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#090302] via-[#090302]/80 to-transparent" />
      </div>

      {/* ============================================================
          TOP-LEFT BRANDING (Matching Reference Logo Style)
          ============================================================ */}
      <div className="absolute top-8 left-8 sm:top-10 sm:left-10 z-20 flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <span className="font-editorial text-2xl sm:text-3xl tracking-wider text-white uppercase flex items-center gap-1.5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            TECH<span className="text-[#e2a850] text-xl inline-block -translate-y-0.5">✳</span>SRIJAN
          </span>
          <span className="rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-0.5 text-[9px] font-mono tracking-widest text-amber-200 uppercase">
            &apos;27
          </span>
        </div>
        <p className="text-[11px] font-mono tracking-[0.25em] text-zinc-300 uppercase">
          IMPERIUM : REQUIEM
        </p>
      </div>

      {/* ============================================================
          BOTTOM HUD & THEME SWITCHER
          ============================================================ */}
      <div className="absolute bottom-6 inset-x-6 sm:bottom-8 sm:inset-x-8 z-20 flex flex-wrap items-end justify-between gap-4 pointer-events-auto">
        {/* Environmental Coordinates */}
        <div className="space-y-1 text-[11px] font-mono text-zinc-300">
          <div className="flex items-center gap-2 text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>{isDune ? "ARRAKIS // SECTOR 04" : "TOKYO // SECTOR 11"}</span>
          </div>
          <p className="text-[10px] text-zinc-400">
            26.738° N, 83.433° E • MMMUT GORAKHPUR
          </p>
        </div>

        {/* Theme Switcher Pill (Dune vs Code Geass) */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="group relative inline-flex items-center gap-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/25 px-4 py-2 backdrop-blur-xl transition-all duration-300 hover:border-amber-400/70 hover:scale-105 shadow-[0_10px_30px_rgba(0,0,0,0.7)] cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-[11px] font-mono tracking-wider text-white font-semibold uppercase">
            {isDune ? "DUNE ARRAKIS" : "CODE GEASS"}
          </span>
          <span className="text-[9px] font-mono text-zinc-400 uppercase">
            [SWITCH]
          </span>
        </button>
      </div>
    </div>
  );
}
