"use client";

import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { isMobileDevice } from "@/lib/device-tier";

interface Paul3DProps {
  scrollProgress: number;
}

export function Paul3D({ scrollProgress }: Paul3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // User interactive rotation (drag to rotate sideways in full 3D)
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const targetRotationYRef = useRef(0.18); // Default heroic 3/4 pose
  const currentRotationYRef = useRef(0.18);
  const [isHovered, setIsHovered] = useState(false);
  const isVisibleRef = useRef(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      isMobileDevice() || (typeof window !== "undefined" && window.innerWidth < 1024);
    setIsMobile(checkMobile());
    const onResize = () => setIsMobile(checkMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Timeline:
  // - ONLY as the gate flash light ends and Image 2 is on screen:
  // - Paul emerges purely through a silky-smooth opacity fade right where he stands (NO translation upward or downward)
  const anim = useMemo(() => {
    const enterStart = isMobile ? 0.74 : 0.78; // begins fading in as the flash ends
    const enterEnd = isMobile ? 0.86 : 0.89;   // fully faded in to normal solid presence

    // Before flash light ends: completely invisible
    if (scrollProgress < enterStart) {
      return {
        opacity: 0,
        translateYPercent: 0,
        scale: 1.0,
        visible: false,
      };
    }

    const normalOpacity = 0.96; // Restored normal solid cinematic opacity

    // Pure fade and blend: smoothly fades in with zero vertical translation
    if (scrollProgress < enterEnd) {
      const t = (scrollProgress - enterStart) / (enterEnd - enterStart);
      // Hermite smoothstep for natural gradual fade
      const eased = t * t * (3 - 2 * t);
      return {
        opacity: eased * normalOpacity,
        translateYPercent: 0, // NO upward or downward translation!
        scale: 1.0,
        visible: true,
      };
    }

    // Grounded presence in Citadel (firmly planted, normal solid 0.96 opacity)
    return {
      opacity: normalOpacity,
      translateYPercent: 0,
      scale: 1.0,
      visible: true,
    };
  }, [scrollProgress, isMobile]);

  // Track visibility so RAF loop can pause when hidden (saves GPU on mobile)
  useEffect(() => {
    isVisibleRef.current = anim.visible;
  }, [anim.visible]);

  // Set up Three.js Scene, Camera, Lights, Renderer, and load Model
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const mobile = isMobileDevice() || (typeof window !== "undefined" && window.innerWidth < 1024);
    const el = viewportRef.current || container;
    let width = el?.clientWidth || (typeof window !== "undefined" ? Math.min(window.innerWidth, 450) : 450);
    let height = el?.clientHeight || (typeof window !== "undefined" ? Math.round(window.innerHeight * 0.45) : 450);

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: Focused on upper 60-70% of Paul (head, shoulders, chest, Fremen cape and waist)
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.05, 2.5);
    camera.lookAt(0, 0.05, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer — reduce GPU pressure on mobile
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !mobile,  // Disable AA on mobile to save GPU
      powerPreference: mobile ? "low-power" : "high-performance",
    });
    // Cap pixel ratio: 1.0 on mobile, 2.0 on desktop
    renderer.setPixelRatio(mobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;

    // 4. Cinematic Arrakis Citadel Lighting
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.4);
    scene.add(ambientLight);

    // Main warm key light (torchlight & citadel golden sun)
    const keyLight = new THREE.DirectionalLight(0xffb74d, 2.8);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    // Secondary fill light for deep basalt folds
    const fillLight = new THREE.DirectionalLight(0xd4a843, 1.5);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    // Dramatic rim backlight (highlights curls and cape silhouette)
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // 5. Model Container Group (rotates around model's vertical center)
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 6. Load Texture and Model
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/paul_texture.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = false;
    });

    const loader = new GLTFLoader();
    loader.load(
      "/paul.glb",
      (gltf) => {
        const root = gltf.scene;

        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.geometry.computeVertexNormals();

            // High-resolution texture material for Fremen stillsuit & cape
            mesh.material = new THREE.MeshStandardMaterial({
              map: texture,
              roughness: 0.82,
              metalness: 0.08,
              side: THREE.DoubleSide,
            });
          }
        });

        // Compute bounding box to frame upper 60-70% (head, chest, Fremen cloak, waist) removing legs/feet
        const bbox = new THREE.Box3().setFromObject(root);
        const centerX = (bbox.min.x + bbox.max.x) / 2;
        const centerZ = (bbox.min.z + bbox.max.z) / 2;
        const modelHeight = bbox.max.y - bbox.min.y;

        // Display upper 65% of the model and crop out lower 35% (legs and boots)
        const visibleHeight = modelHeight * 0.65;
        const cutoffY = bbox.max.y - visibleHeight;
        const targetCenterY = (bbox.max.y + cutoffY) / 2;

        root.position.x = -centerX;
        root.position.y = -targetCenterY;
        root.position.z = -centerZ;

        modelGroup.add(root);
      },
      undefined,
      (err) => {
        console.error("Error loading Paul 3D model:", err);
      }
    );

    // 7. Animation Loop with visibility-aware throttling
    let animationFrameId: number;
    const startTime = performance.now();
    let lastRenderTime = 0;
    // On mobile, throttle to ~30 FPS to reduce GPU heat; desktop runs uncapped
    const minFrameInterval = mobile ? 33 : 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip rendering entirely when model is off-screen (saves massive GPU on mobile)
      if (!isVisibleRef.current) return;

      const now = performance.now();
      if (now - lastRenderTime < minFrameInterval) return;
      lastRenderTime = now;

      const elapsed = (now - startTime) / 1000;

      if (modelGroupRef.current) {
        // Idle gentle subtle breathing sway if not being dragged
        const idleSway = isDraggingRef.current ? 0 : Math.sin(elapsed * 1.2) * 0.025;

        // Smooth damping interpolation towards target rotation
        currentRotationYRef.current +=
          (targetRotationYRef.current + idleSway - currentRotationYRef.current) * 0.08;

        modelGroupRef.current.rotation.y = currentRotationYRef.current;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Handle Resize dynamically
    const updateSize = () => {
      const el = viewportRef.current || container;
      if (!el || !canvas) return;
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || Math.round(window.innerHeight * 0.42);
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };

    // Listen for resize
    window.addEventListener("resize", updateSize);
    const resizeObserver = new ResizeObserver(updateSize);
    if (viewportRef.current) {
      resizeObserver.observe(viewportRef.current);
    } else {
      resizeObserver.observe(container);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateSize);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Pointer / Mouse interaction to rotate sideways in full 3D with anatomical limits
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    startXRef.current = e.clientX;

    // Rotate within natural viewing bounds [-0.55 rad, +0.55 rad] (~ -32deg to +32deg)
    const newRot = targetRotationYRef.current + deltaX * 0.008;
    targetRotationYRef.current = Math.max(-0.55, Math.min(0.55, newRot));
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    // Gently ease back towards default iconic 3/4 angle
    targetRotationYRef.current = 0.18;
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 bottom-0 z-[25] flex flex-col items-center justify-end select-none pointer-events-none overflow-hidden"
      style={{
        opacity: anim.opacity,
        visibility: anim.visible ? "visible" : "hidden",
        transition: "opacity 0.4s ease-out",
        willChange: "transform, opacity",
      }}
    >
      {/* 3D Model Viewport — constrained height showing upper 60-70% with soft bottom dissolve */}
      <div
        ref={viewportRef}
        className="relative z-20 h-[42vh] sm:h-[48vh] md:h-[52vh] max-h-[520px] w-full max-w-[440px] sm:max-w-[520px] flex items-end justify-center touch-none -bottom-2 sm:-bottom-3 overflow-hidden"
        style={{
          cursor: isHovered ? (isDraggingRef.current ? "grabbing" : "grab") : "default",
          pointerEvents: anim.visible ? "auto" : "none",
          maskImage: "linear-gradient(to top, transparent 0%, black 16%, black 100%)",
          WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 16%, black 100%)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Soft atmospheric ground contact shadow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[20px] rounded-[50%] pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 80%)",
            filter: "blur(8px)",
            opacity: anim.opacity,
            transition: "opacity 0.4s ease-out",
          }}
        />

        {/* WebGL Canvas for 3D Model (Always mounted and ready) */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain pointer-events-auto select-none"
        />
      </div>
    </div>
  );
}
