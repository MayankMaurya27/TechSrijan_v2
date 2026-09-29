"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function SandwormIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1206, 0.05);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Sand Particles
    const particles = new THREE.BufferGeometry();
    const particleCount = 2000;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 40;
    }
    particles.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      color: 0xd4a843,
      transparent: true,
      opacity: 0.8,
    });
    const sandMesh = new THREE.Points(particles, particleMaterial);
    scene.add(sandMesh);

    // Procedural Worm
    const wormGeo = new THREE.TorusKnotGeometry(10, 2, 100, 16);
    const wormMat = new THREE.MeshStandardMaterial({
      color: 0x2d1f0e,
      roughness: 0.9,
      metalness: 0.1,
      wireframe: true,
    });
    const worm = new THREE.Mesh(wormGeo, wormMat);
    worm.position.y = -20;
    scene.add(worm);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xd4a843, 2);
    directionalLight.position.set(10, 20, 10);
    scene.add(ambientLight, directionalLight);

    let frame = 0;
    const totalFrames = 150; // 2.5 seconds at 60fps

    const animate = () => {
      frame++;
      const progress = frame / totalFrames;

      worm.position.y = THREE.MathUtils.lerp(-20, 0, progress);
      worm.rotation.x += 0.01;
      worm.rotation.y += 0.02;
      
      sandMesh.rotation.y -= 0.005;

      renderer.render(scene, camera);

      if (frame < totalFrames) {
        requestAnimationFrame(animate);
      } else {
        setIsFading(true);
        setTimeout(() => {
          renderer.dispose();
          onComplete();
        }, 500);
      }
    };

    animate();

    return () => {
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[var(--bg-primary)] transition-opacity duration-500 flex items-center justify-center ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div ref={containerRef} className="absolute inset-0" />
      <h1 className="absolute z-10 font-mono text-2xl md:text-5xl text-[var(--accent-primary)] tracking-[0.5em] animate-pulse pointer-events-none">
        REQUIEM
      </h1>
    </div>
  );
}
