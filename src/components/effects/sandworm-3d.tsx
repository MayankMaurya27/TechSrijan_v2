"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Sandworm3DProps {
  onComplete: () => void;
}

export function Sandworm3D({ onComplete }: Sandworm3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDispersing, setIsDispersing] = useState(false);
  const [slashActive, setSlashActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090704, 0.04);

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- SAND PARTICLES SYSTEM (6,000 GPU Particles) ---
    const particleCount = 6000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 14 + 1;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 6 - 2;

      positions[i3] = Math.cos(theta) * radius;
      positions[i3 + 1] = y;
      positions[i3 + 2] = Math.sin(theta) * radius;

      originalPositions[i3] = positions[i3];
      originalPositions[i3 + 1] = positions[i3 + 1];
      originalPositions[i3 + 2] = positions[i3 + 2];

      velocities[i3] = (Math.random() - 0.5) * 0.04;
      velocities[i3 + 1] = Math.random() * 0.02 + 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.04;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      color: 0xd4a843,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const sandPoints = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(sandPoints);

    // --- PROCEDURAL SANDWORM CHITIN BODY ---
    // Procedural segmented tube representing the emerging behemoth
    const curvePoints = [
      new THREE.Vector3(0, -18, -10),
      new THREE.Vector3(0, -6, -4),
      new THREE.Vector3(0, 2, 0),
      new THREE.Vector3(0, 9, 4),
      new THREE.Vector3(0, 15, 8),
    ];
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const wormGeometry = new THREE.TubeGeometry(curve, 64, 2.2, 24, false);

    // Segmented Chitin Texture Wireframe Material
    const wormMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f160b,
      roughness: 0.75,
      metalness: 0.25,
      wireframe: true,
    });
    const worm = new THREE.Mesh(wormGeometry, wormMaterial);
    worm.position.y = -8; // Starts emerging
    scene.add(worm);

    // Inner Maw Glow
    const innerLight = new THREE.PointLight(0xd4a843, 8, 20);
    innerLight.position.set(0, 12, 6);
    scene.add(innerLight);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const solarLight = new THREE.DirectionalLight(0xf3ce7a, 2.5);
    solarLight.position.set(15, 25, 10);
    scene.add(solarLight);

    // --- INTERACTIVE MOUSE-DRAG ROTATION ---
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotationY = 0;
    let targetRotationX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        // Subtle idle parallax tracking
        targetRotationY = ((e.clientX / window.innerWidth) - 0.5) * 0.4;
        targetRotationX = ((e.clientY / window.innerHeight) - 0.5) * 0.2;
        return;
      }
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // --- ESCAPE KEY LISTENER ---
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerDispersion();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // --- RESIZE LISTENER ---
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    let time = 0;
    let dispersing = false;
    let dispersionProgress = 0;

    function triggerDispersion() {
      if (dispersing) return;
      dispersing = true;
      setIsDispersing(true);
      setSlashActive(true);

      setTimeout(() => {
        renderer.dispose();
        onComplete();
      }, 700);
    }

    // Expose trigger to outer scope via custom event or button
    const handleTriggerEvent = () => triggerDispersion();
    window.addEventListener("techsrijan-initialize", handleTriggerEvent);

    const animate = () => {
      time += 0.015;

      // Smooth Rotation Damping
      worm.rotation.y += (targetRotationY - worm.rotation.y) * 0.06;
      worm.rotation.x += (targetRotationX - worm.rotation.x) * 0.06;

      // Natural Sinusoidal Undulation
      worm.position.y = -4 + Math.sin(time) * 0.8;
      worm.rotation.z = Math.cos(time * 0.8) * 0.06;

      // Particle Motion
      const pos = particleGeometry.attributes.position.array as Float32Array;

      if (!dispersing) {
        // Orbiting Spice Sand Motion
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          pos[i3 + 1] += velocities[i3 + 1];
          if (pos[i3 + 1] > 8) {
            pos[i3 + 1] = -4;
          }
        }
        sandPoints.rotation.y += 0.002;
      } else {
        // VIOLENT SHOCKWAVE DISPERSION
        dispersionProgress += 0.05;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          pos[i3] += pos[i3] * 0.12;
          pos[i3 + 1] += (Math.random() - 0.5) * 1.5;
          pos[i3 + 2] += pos[i3 + 2] * 0.12;
        }
        particleMaterial.opacity = Math.max(0, 0.85 - dispersionProgress);
        wormMaterial.opacity = Math.max(0, 1 - dispersionProgress);
      }

      particleGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("techsrijan-initialize", handleTriggerEvent);
      renderer.dispose();
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [onComplete]);

  const handleInitializeClick = () => {
    window.dispatchEvent(new Event("techsrijan-initialize"));
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#090704] transition-opacity duration-700 ease-out select-none ${
        isDispersing ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Code Geass Ceremonial Blade Slash Overlay */}
      {slashActive && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div className="h-[2px] w-[200vw] rotate-[-25deg] bg-gradient-to-r from-transparent via-[#FF1E27] to-transparent shadow-[0_0_35px_#FF1E27] animate-pulse" />
        </div>
      )}

      {/* Top Telemetry Header & Skip Button */}
      <div className="relative z-10 flex w-full items-center justify-between p-6 sm:p-10 font-mono text-xs tracking-widest text-[#BBA382]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#D4A843] animate-ping" />
          <span>ARRAKIS DEEP DESERT // CONTACT DETECTED</span>
        </div>

        <button
          onClick={handleInitializeClick}
          className="rounded border border-[#D4A843]/30 bg-[#24180D]/60 px-3.5 py-1.5 font-mono text-[10px] text-[#D4A843] transition-colors hover:border-[#D4A843] hover:bg-[#362414]"
        >
          SKIP SEQUENCE [ESC]
        </button>
      </div>

      {/* Center Prompt & Shockwave Trigger */}
      <div className="relative z-10 flex flex-col items-center pb-12 sm:pb-16 text-center px-4">
        <div className="font-mono text-xs tracking-[0.4em] text-[#D4A843] uppercase mb-4 animate-pulse">
          DRAG TO ROTATE // CLICK TO ENTER
        </div>

        <button
          onClick={handleInitializeClick}
          className="mecha-bracket group relative overflow-hidden border border-[#D4A843] bg-[#24180D]/80 px-8 py-4 font-mono text-sm font-black tracking-[0.3em] text-[#F8EED9] shadow-[0_0_25px_rgba(212,168,67,0.3)] transition-all duration-300 hover:scale-105 hover:border-[#F3CE7A] hover:bg-[#362414] hover:shadow-[0_0_40px_rgba(212,168,67,0.6)]"
        >
          <span className="relative z-10 flex items-center gap-3">
            <span>[ INITIALIZE IMPERIUM ]</span>
          </span>
          {/* Subtle button sweep */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#D4A843]/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>

        <p className="mt-4 font-mono text-[10px] tracking-widest text-[#6B5944]">
          MADAN MOHAN MALAVIYA UNIVERSITY OF TECHNOLOGY // 2026
        </p>
      </div>
    </div>
  );
}
