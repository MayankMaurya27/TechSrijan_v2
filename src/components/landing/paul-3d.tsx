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

  // Timeline:
  // - 0.00 → 0.58: Completely hidden while inside gate corridor.
  // - 0.58 → 0.72: Gate opens fully into citadel avenue. Paul gracefully rises from the floor stones with cinematic smoothstep easing.
  // - 0.72 → 1.00: Firmly planted at the bottom of the video, NOT fading out even when the video ends.
  const anim = useMemo(() => {
    const enterStart = 0.58; // Gate clears into citadel avenue
    const enterEnd = 0.72;   // Fully grounded presence in citadel

    // Before gate clears: completely invisible
    if (scrollProgress < enterStart) {
      return {
        opacity: 0,
        translateYPercent: 40,
        scale: 0.94,
        visible: false,
      };
    }

    // Entering as citadel opens: silky smooth rise & fade
    if (scrollProgress < enterEnd) {
      const t = (scrollProgress - enterStart) / (enterEnd - enterStart);
      // Hermite smoothstep easing: zero jerk at both start and finish
      const eased = t * t * (3 - 2 * t);
      return {
        opacity: eased * 0.92,
        translateYPercent: 40 * (1 - eased),
        scale: 0.94 + 0.06 * eased,
        visible: true,
      };
    }

    // Grounded presence in Citadel (0.72 → 1.00+):
    // Stays firmly planted, boots stuck flush to the bottom, gentle 0.92 cinematic opacity
    return {
      opacity: 0.92,
      translateYPercent: 0,
      scale: 1.0,
      visible: true,
    };
  }, [scrollProgress]);

  // Track visibility so RAF loop can pause when hidden (saves GPU on mobile)
  useEffect(() => {
    isVisibleRef.current = anim.visible;
  }, [anim.visible]);

  // Set up Three.js Scene, Camera, Lights, Renderer, and load Model
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const mobile = isMobileDevice();
    let width = container.clientWidth || 450;
    let height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 3.2);
    camera.lookAt(0, -0.05, 0);
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

        // Compute bounding box to align feet perfectly to bottom
        const bbox = new THREE.Box3().setFromObject(root);
        const centerX = (bbox.min.x + bbox.max.x) / 2;
        const centerZ = (bbox.min.z + bbox.max.z) / 2;

        // Position model inside group so feet are stuck firmly to bottom (-1.20) and centered horizontally
        root.position.x = -centerX;
        root.position.y = -bbox.min.y - 1.20;
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
    // On mobile, throttle to ~20 FPS to reduce GPU heat; desktop runs uncapped
    const minFrameInterval = mobile ? 50 : 0;

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
      if (!container || !canvas) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };

    // Listen for resize
    window.addEventListener("resize", updateSize);
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

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
      {/* 3D Model Viewport — constrained height so top 50%+ stays open */}
      <div
        className="relative z-20 h-[38vh] sm:h-[44vh] md:h-[48vh] lg:h-[50vh] max-h-[480px] w-full max-w-[420px] sm:max-w-[500px] flex items-end justify-center touch-none -bottom-2 sm:-bottom-3"
        style={{
          transform: `translate3d(0, ${anim.translateYPercent}%, 0) scale(${anim.scale})`,
          transformOrigin: "bottom center",
          transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          cursor: isHovered ? (isDraggingRef.current ? "grabbing" : "grab") : "default",
          pointerEvents: anim.visible ? "auto" : "none",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {/* Ground contact shadow right under boots */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[65%] h-[16px] rounded-[50%] pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.45) 55%, transparent 80%)",
            filter: "blur(6px)",
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
