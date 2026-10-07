"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  Shield,
  Wifi,
  Utensils,
  Headphones,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FacilityItem {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: typeof Shield;
}

const LEFT_FACILITIES: FacilityItem[] = [
  {
    id: "fac-residence",
    code: "01",
    title: "SECURED RESIDENCE",
    description: "24/7 guarded quarters with controlled resident access.",
    icon: Shield,
  },
  {
    id: "fac-wifi",
    code: "02",
    title: "CAMPUS WI-FI",
    description: "High-speed connectivity across hostel and common areas.",
    icon: Wifi,
  },
];

const RIGHT_FACILITIES: FacilityItem[] = [
  {
    id: "fac-meals",
    code: "03",
    title: "MEALS & REFRESHMENT",
    description: "Scheduled mess access and refreshment points throughout campus.",
    icon: Utensils,
  },
  {
    id: "fac-support",
    code: "04",
    title: "HELP DESK SUPPORT",
    description: "On-ground assistance for check-in, navigation, and urgent queries.",
    icon: Headphones,
  },
];

const DISSOLVE_PARTICLES = [
  { size: 5, top: 26, left: 45, dx: -55, dy: -70, color: "crimson" },
  { size: 6, top: 30, left: 53, dx: 65, dy: -80, color: "crimson" },
  { size: 4, top: 38, left: 48, dx: -85, dy: -30, color: "silver" },
  { size: 7, top: 42, left: 56, dx: 75, dy: -40, color: "dark" },
  { size: 5, top: 48, left: 42, dx: -100, dy: 10, color: "crimson" },
  { size: 6, top: 54, left: 58, dx: 95, dy: 20, color: "crimson" },
  { size: 4, top: 58, left: 46, dx: -65, dy: 55, color: "silver" },
  { size: 5, top: 64, left: 54, dx: 55, dy: 65, color: "dark" },
  { size: 6, top: 33, left: 50, dx: 25, dy: -90, color: "crimson" },
  { size: 4, top: 46, left: 52, dx: -35, dy: -80, color: "crimson" },
  { size: 7, top: 56, left: 48, dx: 90, dy: 40, color: "silver" },
  { size: 5, top: 60, left: 52, dx: -80, dy: 45, color: "dark" },
  { size: 4, top: 28, left: 47, dx: -45, dy: -55, color: "crimson" },
  { size: 5, top: 36, left: 54, dx: 50, dy: -45, color: "crimson" },
  { size: 6, top: 44, left: 44, dx: -70, dy: -10, color: "silver" },
  { size: 4, top: 50, left: 55, dx: 80, dy: 5, color: "dark" },
];

export default function AccommodationPage() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("giedi-prime");
  }, [setTheme]);

  // Mobile detection (< 768px skips GSAP pin for performance)
  const [isMobile, setIsMobile] = useState(false);
  const [mobileScrollY, setMobileScrollY] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Mobile scroll progress for parallax
  useEffect(() => {
    if (!isMobile) return;
    const onScroll = () => setMobileScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  // Active hover stance: "none" | "left" | "right"
  const [activeHover, setActiveHover] = useState<"none" | "left" | "right">("none");
  const [isCharHovered, setIsCharHovered] = useState(false);
  const hoverResetTimer = useRef<NodeJS.Timeout | null>(null);

  // Parallax refs for hero mouse movement
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // GSAP Cinematic Scroll Container Refs
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const pinnedStageRef = useRef<HTMLDivElement>(null);

  // Phase elements
  const bgCityRef = useRef<HTMLDivElement>(null);
  const chamberBgRef = useRef<HTMLDivElement>(null);
  const headerSectionRef = useRef<HTMLDivElement>(null);
  const headingScanLinesRef = useRef<HTMLDivElement>(null);
  const leftCardsRef = useRef<HTMLDivElement>(null);
  const rightCardsRef = useRef<HTMLDivElement>(null);
  const centerCharacterRef = useRef<HTMLDivElement>(null);
  const charImageWrapRef = useRef<HTMLDivElement>(null);
  const dissolveParticlesRef = useRef<HTMLDivElement>(null);
  const bottomStatusBarRef = useRef<HTMLDivElement>(null);
  const scanBeamRef = useRef<HTMLDivElement>(null);
  const lowerSmokeRef = useRef<HTMLDivElement>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);
  const formFieldsRef = useRef<HTMLDivElement>(null);

  // Form State & Validation
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    city: "",
    nights: "3 Nights (Full Fest)",
    specialRequirements: "",
    confirmed: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Card Mouse Event Handlers with 2s retention
  const handleCardMouseEnter = useCallback((side: "left" | "right") => {
    if (hoverResetTimer.current) {
      clearTimeout(hoverResetTimer.current);
      hoverResetTimer.current = null;
    }
    setActiveHover(side);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    if (hoverResetTimer.current) {
      clearTimeout(hoverResetTimer.current);
    }
    hoverResetTimer.current = setTimeout(() => {
      setActiveHover("none");
      hoverResetTimer.current = null;
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverResetTimer.current) {
        clearTimeout(hoverResetTimer.current);
      }
    };
  }, []);

  // Mouse move handler for hero parallax
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!pinnedStageRef.current) return;
    const rect = pinnedStageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mousePos.current.targetX = x;
    mousePos.current.targetY = y;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mousePos.current.targetX = 0;
    mousePos.current.targetY = 0;
  }, []);

  // GSAP ScrollTrigger Cinematic Sequence (desktop only)
  useEffect(() => {
    if (typeof window === "undefined" || !scrollWrapperRef.current || !pinnedStageRef.current)
      return;

    // Skip GSAP pin on mobile — vertical scroll used instead
    if (window.innerWidth < 768) return;

    // Connect Lenis with GSAP ScrollTrigger
    const lenis = window.__lenis;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollWrapperRef.current,
          start: "top top",
          end: "+=250%",
          pin: pinnedStageRef.current,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      // =========================================================================
      // 0% - 25%: Facilities Introduction
      // Subtle depth parallax, floating cards at different depths, stable heading
      // =========================================================================
      // Background architecture moves more slowly than foreground
      tl.fromTo(
        bgCityRef.current,
        { y: 0, scale: 1 },
        { y: 22, scale: 1.03, ease: "none", duration: 0.25 },
        0
      );

      // Character subtle depth parallax
      tl.fromTo(
        charImageWrapRef.current,
        { y: 0, scale: 1 },
        { y: -16, scale: 1.015, ease: "none", duration: 0.25 },
        0
      );

      // Facility cards float slightly at different depths
      tl.fromTo(
        leftCardsRef.current,
        { y: 0 },
        { y: -10, ease: "none", duration: 0.25 },
        0
      );

      tl.fromTo(
        rightCardsRef.current,
        { y: 0 },
        { y: -18, ease: "none", duration: 0.25 },
        0
      );

      // Heading and subtitle remain crisp and stable
      tl.to(headerSectionRef.current, { y: 0, opacity: 1, duration: 0.25 }, 0);

      // =========================================================================
      // 25% - 50%: Structural Collapse
      // =========================================================================
      // Left cards slide outward, collapse into thin silver structural outline & fade
      tl.to(
        leftCardsRef.current,
        {
          x: -340,
          opacity: 0,
          scaleX: 0.88,
          scaleY: 0.45,
          filter: "grayscale(1) brightness(2.4) contrast(1.8) drop-shadow(0 0 2px rgba(255,255,255,0.9))",
          ease: "power2.inOut",
          duration: 0.25,
        },
        0.25
      );

      // Right cards slide outward, collapse into thin silver structural outline & fade
      tl.to(
        rightCardsRef.current,
        {
          x: 340,
          opacity: 0,
          scaleX: 0.88,
          scaleY: 0.45,
          filter: "grayscale(1) brightness(2.4) contrast(1.8) drop-shadow(0 0 2px rgba(255,255,255,0.9))",
          ease: "power2.inOut",
          duration: 0.25,
        },
        0.25
      );

      // Heading stretches slightly, splits apart with horizontal scan blur & fades
      tl.to(
        headerSectionRef.current,
        {
          scaleX: 1.35,
          scaleY: 0.85,
          letterSpacing: "0.45em",
          opacity: 0,
          filter: "blur(6px)",
          y: -35,
          ease: "power2.inOut",
          duration: 0.22,
        },
        0.25
      );

      // Horizontal scan lines tear across the heading
      if (headingScanLinesRef.current) {
        tl.fromTo(
          headingScanLinesRef.current,
          { opacity: 0 },
          { opacity: 0.9, duration: 0.1, yoyo: true, repeat: 1, ease: "steps(3)" },
          0.25
        );
      }

      // Bottom status bar slides down & fades
      tl.to(
        bottomStatusBarRef.current,
        {
          y: 45,
          opacity: 0,
          ease: "power2.in",
          duration: 0.2,
        },
        0.25
      );

      // Character scales down slightly and recedes into corridor
      tl.to(
        charImageWrapRef.current,
        {
          scale: 0.82,
          y: 35,
          ease: "power2.inOut",
          duration: 0.25,
        },
        0.25
      );

      // Crimson scan beam travels vertically across the screen
      tl.fromTo(
        scanBeamRef.current,
        { y: "-8vh", opacity: 0 },
        {
          y: "112vh",
          opacity: 1,
          ease: "power1.inOut",
          duration: 0.25,
        },
        0.25
      );

      // Lower dark smoke and dust moves across the bottom
      tl.to(
        lowerSmokeRef.current,
        {
          opacity: 0.85,
          y: -25,
          scaleY: 1.35,
          ease: "power1.out",
          duration: 0.25,
        },
        0.25
      );

      // =========================================================================
      // 50% - 75%: Cinematic Transition (Passing Through Central Architecture)
      // =========================================================================
      // Central corridor background pushes forward with deep zoom effect
      tl.to(
        bgCityRef.current,
        {
          scale: 3.5,
          filter: "blur(18px)",
          opacity: 0,
          ease: "power3.inOut",
          duration: 0.25,
        },
        0.5
      );

      // Character becomes a silhouette, then dissolves into darkness & red particles
      tl.to(
        charImageWrapRef.current,
        {
          filter: "brightness(0) contrast(300%) blur(8px)",
          scale: 0.6,
          opacity: 0,
          y: 75,
          ease: "power3.inOut",
          duration: 0.25,
        },
        0.5
      );

      // Dissolution particles burst outward as character dissolves
      if (dissolveParticlesRef.current) {
        tl.fromTo(
          dissolveParticlesRef.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1.3, duration: 0.1, ease: "power1.out" },
          0.5
        );
        tl.to(
          ".dissolve-spark",
          {
            x: (i) => DISSOLVE_PARTICLES[i % DISSOLVE_PARTICLES.length].dx,
            y: (i) => DISSOLVE_PARTICLES[i % DISSOLVE_PARTICLES.length].dy,
            opacity: 0,
            scale: 0.2,
            duration: 0.22,
            stagger: 0.005,
            ease: "power2.out",
          },
          0.52
        );
      }

      // Top navigation fades slightly but remains usable
      const navElement = document.querySelector("header") || document.querySelector("nav");
      if (navElement) {
        tl.to(navElement, { opacity: 0.45, ease: "power1.inOut", duration: 0.25 }, 0.5);
        tl.to(navElement, { opacity: 0.95, ease: "power1.inOut", duration: 0.25 }, 0.75);
      }

      // Transition to abstract black residence-control chamber with faint silver lines
      tl.to(
        chamberBgRef.current,
        {
          opacity: 1,
          ease: "power2.inOut",
          duration: 0.25,
        },
        0.5
      );

      // Scan beam fades out completely
      tl.to(
        scanBeamRef.current,
        {
          opacity: 0,
          duration: 0.1,
        },
        0.5
      );

      // =========================================================================
      // 75% - 100%: Form Reveal (Aperture Opening & Dossier Panel Stabilization)
      // =========================================================================
      // Aperture vertical reveal of smoked-glass dossier panel with subtle 4deg -> 0deg perspective
      tl.fromTo(
        formPanelRef.current,
        {
          opacity: 0,
          clipPath: "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
          rotateX: 4,
          scale: 0.94,
          y: 20,
        },
        {
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          rotateX: 0,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.2,
        },
        0.75
      );

      // Staggered reveal of form fields
      if (formFieldsRef.current) {
        const fieldElements = formFieldsRef.current.children;
        tl.fromTo(
          fieldElements,
          {
            opacity: 0,
            y: 18,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.02,
            ease: "power2.out",
            duration: 0.18,
          },
          0.8
        );
      }
    }, scrollWrapperRef);

    return () => {
      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
      }
      const navElement = document.querySelector("header") || document.querySelector("nav");
      if (navElement) {
        gsap.set(navElement, { opacity: 1 });
      }
      ctx.revert();
    };
  }, []);

  // Form Validation & Submission
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Valid email is required";
    if (!formData.phone.trim() || formData.phone.length < 10)
      errors.phone = "Valid 10-digit phone number is required";
    if (!formData.college.trim()) errors.college = "College / University is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.confirmed) errors.confirmed = "Please confirm that your details are accurate";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const randomRef = `TS27-RES-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmationId(randomRef);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 900);
  };

  // ─── MOBILE LAYOUT ─────────────────────────────────────────────────────────
  if (isMobile) {
    const ALL_FACILITIES = [...LEFT_FACILITIES, ...RIGHT_FACILITIES];
    const charParallax = Math.max(0, Math.min(1, mobileScrollY / (window?.innerHeight ?? 600)));

    return (
      <div className="relative w-full min-h-screen bg-[#050608] text-[#F0EAE1] overflow-x-hidden">
        {/* ── MOBILE HERO ── */}
        <section className="relative h-[100dvh] w-full flex flex-col items-center justify-between pb-8 overflow-hidden">
          {/* Background city with scroll parallax */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ transform: `scale(${1 + charParallax * 0.06}) translateY(${charParallax * 18}px)`, willChange: "transform" }}
          >
            <Image
              src="/images/accommodation-city-bg.jpg"
              alt="Residence citadel"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[0.8] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/40 to-[#050608]/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/60 via-transparent to-[#050608]/60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#050608_95%)] opacity-90" />
            {/* Ambient crimson glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-[#E61924]/15 blur-[80px] pointer-events-none" />
          </div>

          {/* Header */}
          <div className="relative z-10 text-center pt-20 px-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E61924]" />
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#D2CCC0]">CAMPUS ACCOMMODATION</p>
            </div>
            <h1 className="font-[family-name:var(--font-impact)] text-7xl tracking-widest uppercase text-[#F5F2EB] leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">FACILITIES</h1>
            <p className="font-sans text-xs text-[#C4BEB2] max-w-xs mx-auto leading-relaxed tracking-wide">
              Secure, connected quarters for every participant throughout the fest.
            </p>
          </div>

          {/* Character — centered, scroll-aware eye glow */}
          <div className="relative z-10 w-full flex items-end justify-center flex-1">
            <div
              className="relative w-[280px] h-[380px] select-none"
              style={{ transform: `translateY(${-charParallax * 12}px)`, willChange: "transform" }}
            >
              <Image
                src="/images/lelouch-character.png"
                alt="Zero - Commander"
                fill
                priority
                sizes="280px"
                className="object-contain object-bottom brightness-[0.98] contrast-[1.06] drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
              />
              {/* Eye glow activates as user scrolls */}
              <div
                className="absolute rounded-full bg-[#E61924] blur-[3px] transition-opacity duration-500"
                style={{
                  top: "24.8%", left: "55.8%",
                  transform: "translate(-50%, -50%)",
                  width: "16px", height: "16px",
                  opacity: Math.min(1, charParallax * 3),
                }}
              />
            </div>
          </div>

          {/* Scroll hint */}
          <div className="relative z-10 flex flex-col items-center gap-1 pb-2 animate-bounce">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-neutral-500">SCROLL</span>
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </section>

        {/* ── MOBILE FACILITIES CARDS ── */}
        <section className="relative px-4 py-10 space-y-4">
          <div className="text-center mb-6">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-500">// INCLUDED SERVICES</span>
            <h2 className="font-[family-name:var(--font-impact)] text-3xl uppercase tracking-wider text-[#F5F2EB] mt-1">WHAT YOU GET</h2>
          </div>
          {ALL_FACILITIES.map((facility, idx) => {
            const Icon = facility.icon;
            return (
              <div
                key={facility.id}
                className="group relative w-full flex items-center gap-4 p-4 bg-[#0c0d10]/80 border border-white/[0.08] active:border-[#E61924]/60 active:bg-[#E61924]/5 transition-all duration-200 rounded-sm"
                style={{
                  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  animationDelay: `${idx * 80}ms`,
                }}
              >
                {/* HUD corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E61924]/50 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 pointer-events-none" />

                <div className="p-2.5 rounded bg-white/[0.04] border border-white/10 text-[#D2CCC0] flex-shrink-0">
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-mono text-xs font-bold tracking-[0.14em] uppercase text-[#F5F2EB]">{facility.title}</h3>
                    <span className="font-mono text-[9px] text-neutral-600">{facility.code}</span>
                  </div>
                  <p className="mt-1 font-sans text-[11px] text-[#A8A49C] leading-relaxed">{facility.description}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* ── MOBILE FORM SECTION ── */}
        <section className="relative px-4 pb-16 pt-4">
          <div className="p-1 rounded-sm border border-white/[0.07] bg-[#07080b]/90 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.95)]" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
            {/* HUD corners */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#E61924]/70 pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#E61924]/70 pointer-events-none" />

            <div className="p-5">
              {isSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="inline-flex p-4 rounded-full bg-[#E61924]/10 border border-[#E61924]/40 text-[#E61924]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#E61924] font-semibold block">DISPATCH CONFIRMED</span>
                    <h2 className="font-[family-name:var(--font-impact)] text-3xl uppercase tracking-wider text-[#F5F2EB]">REQUEST RECEIVED</h2>
                    <p className="font-sans text-xs text-[#A8A49C] max-w-[280px] mx-auto leading-relaxed">Your residency directive has been registered. Check your email for the allocation dossier.</p>
                  </div>
                  <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06] text-left font-mono text-[10px] space-y-2">
                    <div className="flex justify-between"><span className="text-neutral-500">REF:</span><span className="text-[#E61924] font-bold">{confirmationId}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-500">NAME:</span><span className="text-[#F5F2EB]">{formData.fullName}</span></div>
                    <div className="flex justify-between"><span className="text-neutral-500">DURATION:</span><span className="text-[#F5F2EB]">{formData.nights}</span></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsSubmitted(false); setFormData({ fullName: "", email: "", phone: "", college: "", city: "", nights: "3 Nights (Full Fest)", specialRequirements: "", confirmed: false }); }}
                    className="w-full py-3 font-mono text-xs uppercase tracking-[0.2em] bg-white/[0.03] border border-white/20 text-[#F5F2EB] active:bg-[#E61924] active:border-[#E61924] transition-all duration-200"
                  >SUBMIT ANOTHER REQUEST</button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Form header */}
                  <div className="pb-4 border-b border-white/[0.07] space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E61924] shadow-[0_0_6px_#E61924]" />
                      <span className="font-mono text-[9px] tracking-[0.28em] uppercase text-[#C4BEB2]">RESIDENCE DIRECTIVE</span>
                    </div>
                    <h2 className="font-[family-name:var(--font-impact)] text-3xl uppercase tracking-wider text-[#F5F2EB] leading-none">RESERVE YOUR STAY</h2>
                    <p className="font-sans text-xs text-[#A8A49C] tracking-wide">Submit your details to begin your accommodation request.</p>
                  </div>

                  {/* Fields */}
                  <div className="space-y-3">
                    {[
                      { key: "fullName", label: "Full Name", type: "text", placeholder: "e.g. Lelouch Lamperouge", Icon: User, required: true },
                      { key: "email", label: "Email Address", type: "email", placeholder: "resident@institution.edu", Icon: Mail, required: true },
                      { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 9876543210", Icon: Phone, required: true },
                      { key: "college", label: "College / University", type: "text", placeholder: "e.g. MMMUT / IIT / NIT", Icon: Building, required: true },
                      { key: "city", label: "City", type: "text", placeholder: "e.g. Lucknow, Delhi", Icon: MapPin, required: true },
                    ].map(({ key, label, type, placeholder, Icon: FieldIcon, required }) => (
                      <div key={key} className="space-y-1">
                        <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A8A49C] flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><FieldIcon className="w-2.5 h-2.5 text-[#E61924]" />{label}</span>
                          {required && <span className="text-[#E61924] text-[10px]">*</span>}
                        </label>
                        <input
                          type={type}
                          value={(formData as Record<string, string | boolean>)[key] as string}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          placeholder={placeholder}
                          className={`w-full px-3 py-3 rounded bg-white/[0.025] border text-xs text-[#F5F2EB] placeholder:text-neutral-600 focus:outline-none transition-all ${
                            (formErrors as Record<string, string>)[key] ? "border-[#E61924]" : "border-white/[0.08] focus:border-[#E61924]"
                          }`}
                        />
                        {(formErrors as Record<string, string>)[key] && (
                          <p className="font-mono text-[9px] text-[#E61924] flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" />{(formErrors as Record<string, string>)[key]}
                          </p>
                        )}
                      </div>
                    ))}

                    {/* Nights select */}
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A8A49C] flex items-center gap-1.5">
                        <Calendar className="w-2.5 h-2.5 text-[#E61924]" />Number of Nights
                      </label>
                      <div className="relative">
                        <select
                          value={formData.nights}
                          onChange={(e) => setFormData({ ...formData, nights: e.target.value })}
                          className="w-full appearance-none px-3 py-3 pr-8 rounded bg-white/[0.025] border border-white/[0.08] focus:border-[#E61924] text-xs text-[#F5F2EB] focus:outline-none cursor-pointer"
                        >
                          <option value="1 Night" className="bg-[#0e1015]">1 Night (Day Pass)</option>
                          <option value="2 Nights" className="bg-[#0e1015]">2 Nights (Weekend)</option>
                          <option value="3 Nights (Full Fest)" className="bg-[#0e1015]">3 Nights (Full Fest)</option>
                          <option value="4 Nights" className="bg-[#0e1015]">4 Nights (Extended)</option>
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Special requirements */}
                    <div className="space-y-1">
                      <label className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A8A49C] flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><FileText className="w-2.5 h-2.5 text-[#E61924]" />Special Requirements</span>
                        <span className="text-neutral-500 text-[9px]">OPTIONAL</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formData.specialRequirements}
                        onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                        placeholder="Dietary requirements, room adjacency..."
                        className="w-full px-3 py-3 rounded bg-white/[0.025] border border-white/[0.08] focus:border-[#E61924] text-xs text-[#F5F2EB] placeholder:text-neutral-600 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Confirmation checkbox */}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, confirmed: !formData.confirmed })}
                      className="flex items-center gap-3 text-left cursor-pointer select-none w-full"
                    >
                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                        formData.confirmed ? "bg-[#E61924] border-[#E61924]" : "bg-white/[0.03] border-white/20"
                      }`}>
                        {formData.confirmed && <svg className="w-3 h-3 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12" /></svg>}
                      </div>
                      <span className="font-mono text-[10px] text-[#C4BEB2]">I confirm my details are accurate.</span>
                    </button>
                    {formErrors.confirmed && <p className="font-mono text-[9px] text-[#E61924] flex items-center gap-1 pl-7"><AlertCircle className="w-2.5 h-2.5" />{formErrors.confirmed}</p>}
                  </div>

                  {/* Submit */}
                  <div className="pt-3 border-t border-white/[0.07]">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 font-mono text-xs font-semibold tracking-[0.22em] uppercase text-white bg-gradient-to-r from-[#8b141d] to-[#b31926] border border-[#E61924]/60 transition-all duration-300 shadow-[0_4px_25px_rgba(230,25,36,0.35)] active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? "PROCESSING..." : "SUBMIT ACCOMMODATION REQUEST →"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }
  // ─── END MOBILE LAYOUT ──────────────────────────────────────────────────────

  return (
    <div
      ref={scrollWrapperRef}
      className="relative w-full bg-[#050608] text-[#F0EAE1] select-none"
    >
      {/* PINNED CINEMATIC STAGE VIEWPORT (PINNED FOR ~250vh SCROLL DISTANCE) */}
      <div
        ref={pinnedStageRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#050608]"
      >
        {/* =================================================================== */}
        {/* BACKGROUND LAYER 1: MONUMENTAL CITADEL ARCHITECTURE                */}
        {/* =================================================================== */}
        <div
          ref={bgCityRef}
          className="absolute inset-0 pointer-events-none will-change-transform"
        >
          <Image
            src="/images/accommodation-city-bg.jpg"
            alt="Monumental Sci-Fi Residence Citadel Architecture"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.85] contrast-[1.12]"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-transparent to-[#050608]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/90 via-transparent to-[#050608]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#050608_100%)] opacity-95" />

          {/* Mood Atmospheric Lighting */}
          <div
            className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none transition-colors duration-700 ${
              activeHover === "right"
                ? "bg-[#3a0937]/30"
                : activeHover === "left"
                ? "bg-[#45101a]/30"
                : "bg-[#3a0912]/20"
            }`}
          />
          <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-[#161820]/40 rounded-full blur-[140px] pointer-events-none" />

          {/* Grid Lines & Grain */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_65%,transparent_100%)] opacity-70" />
          <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* =================================================================== */}
        {/* BACKGROUND LAYER 2: ABSTRACT CONTROL CHAMBER (FADES IN AT 50%-75%) */}
        {/* =================================================================== */}
        <div
          ref={chamberBgRef}
          className="absolute inset-0 pointer-events-none opacity-0 will-change-transform z-10"
        >
          {/* Pitch-black background with subtle vertical silver lines */}
          <div className="absolute inset-0 bg-[#050608]" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.02)_0px,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_80px)] opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(230,25,36,0.06)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050608]/90 via-transparent to-[#050608]/90" />
        </div>

        {/* =================================================================== */}
        {/* CRIMSON SCAN BEAM (TRAVELS ACROSS AT 25%-50%)                       */}
        {/* =================================================================== */}
        <div
          ref={scanBeamRef}
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E61924] to-transparent shadow-[0_0_25px_#E61924,0_0_50px_rgba(230,25,36,0.5)] z-25 pointer-events-none opacity-0"
        />

        {/* =================================================================== */}
        {/* LOWER SMOKE & DUST DRIFT LAYER (ACCELERATES AT 25%-50%)             */}
        {/* =================================================================== */}
        <div
          ref={lowerSmokeRef}
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050608] to-transparent opacity-30 z-20 pointer-events-none"
        />

        {/* =================================================================== */}
        {/* HERO PHASE LAYER: FACILITIES INTRODUCTION & CHARACTER (0% - 75%)     */}
        {/* =================================================================== */}
        <div
          className={`relative z-20 w-full max-w-7xl mx-auto h-full px-4 sm:px-8 lg:px-12 flex flex-col justify-between py-6 lg:py-10 transition-opacity duration-300 ${
            scrollProgress > 0.7 ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          {/* TOP CENTERED HEADER SECTION */}
          <section
            ref={headerSectionRef}
            className="relative text-center pt-2 sm:pt-4 max-w-3xl mx-auto space-y-2.5 will-change-transform"
          >
            {/* Horizontal Scan Lines Split Overlay (active during 25%-50% collapse) */}
            <div
              ref={headingScanLinesRef}
              className="absolute inset-0 pointer-events-none opacity-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_3px,rgba(255,255,255,0.7)_3px,rgba(255,255,255,0.7)_4px)] mix-blend-overlay"
            />

            {/* Eyebrow Copy */}
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  activeHover === "right" ? "bg-purple-500" : "bg-[#E61924]"
                }`}
              />
              <p className="font-mono text-[11px] sm:text-xs tracking-[0.32em] uppercase text-[#D2CCC0] font-medium">
                CAMPUS ACCOMMODATION · RESIDENT SERVICES
              </p>
            </div>

            {/* Large Centered Heading */}
            <h1 className="font-[family-name:var(--font-impact)] text-6xl sm:text-7xl lg:text-8xl tracking-widest uppercase text-[#F5F2EB] leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              FACILITIES
            </h1>

            {/* Supporting Line */}
            <p className="font-sans text-xs sm:text-sm md:text-[15px] text-[#C4BEB2] max-w-2xl mx-auto leading-relaxed tracking-wide font-normal">
              Secure, connected, and comfortable living spaces for every participant throughout the fest.
            </p>
          </section>

          {/* MIDDLE SECTION: 3-COLUMN SPATIAL COMPOSITION */}
          <div className="relative w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-6 my-4 lg:my-0">
            {/* LEFT COLUMN: 2 FACILITY CARDS */}
            <div
              ref={leftCardsRef}
              className="w-full lg:w-[30%] max-w-[420px] flex flex-col gap-4 sm:gap-5 z-20 will-change-transform"
            >
              {LEFT_FACILITIES.map((facility) => {
                const Icon = facility.icon;
                return (
                  <div
                    key={facility.id}
                    onMouseEnter={() => handleCardMouseEnter("left")}
                    onMouseLeave={handleCardMouseLeave}
                    className="group relative w-full aspect-[975/319] min-h-[110px] sm:min-h-[120px] flex items-center transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none"
                  >
                    {/* Transparent Frame Asset Layer */}
                    <div className="absolute inset-0 pointer-events-none transition-all duration-300">
                      <Image
                        src="/images/facility-card-frame.png"
                        alt=""
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-fill transition-all duration-300 filter group-hover:brightness-125 group-hover:drop-shadow-[0_0_14px_rgba(230,25,36,0.35)]"
                      />
                      <div className="absolute bottom-1 right-2.5 w-6 h-3 rounded-full bg-[#E61924]/0 group-hover:bg-[#E61924]/60 blur-[4px] transition-all duration-300 pointer-events-none" />
                    </div>

                    {/* Live HTML Content Layer */}
                    <div className="relative z-10 w-full h-full flex items-center px-6 sm:px-8 py-3 sm:py-4 gap-3.5 sm:gap-4">
                      <div className="p-2 sm:p-2.5 rounded bg-white/[0.03] border border-white/5 group-hover:border-white/20 text-[#D2CCC0] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                        <Icon className="w-4 sm:w-5 h-4 sm:h-5 stroke-[1.8] group-hover:stroke-[#E61924] transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0 pr-3 sm:pr-6">
                        <div className="flex items-center justify-between gap-1">
                          <h2 className="font-mono text-xs sm:text-[13px] font-bold tracking-[0.16em] uppercase text-[#F5F2EB] group-hover:text-white transition-colors duration-300 truncate">
                            {facility.title}
                          </h2>
                          <span className="font-mono text-[9px] tracking-widest text-neutral-600 group-hover:text-neutral-400 transition-colors">
                            {facility.code}
                          </span>
                        </div>
                        <p className="mt-1 font-sans text-[11px] sm:text-xs text-[#A8A49C] group-hover:text-[#D4CEC3] leading-relaxed transition-colors duration-300">
                          {facility.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CENTER COLUMN: DYNAMIC CHARACTER STAGE */}
            <div
              ref={centerCharacterRef}
              onMouseEnter={() => setIsCharHovered(true)}
              onMouseLeave={() => setIsCharHovered(false)}
              className="relative w-full lg:w-[40%] h-[380px] sm:h-[480px] lg:h-[580px] flex items-end justify-center z-10 will-change-transform cursor-pointer group"
            >
              {/* Restrained Dynamic Outline Rim Glow */}
              <div
                className={`absolute inset-x-12 bottom-0 top-12 rounded-full transition-all duration-700 pointer-events-none blur-3xl ${
                  activeHover === "right"
                    ? "opacity-60 bg-purple-600/30"
                    : activeHover === "left"
                    ? "opacity-65 bg-[#E61924]/35"
                    : isCharHovered
                    ? "opacity-60 bg-[#E61924]/30"
                    : "opacity-15 bg-neutral-700/20"
                }`}
              />

              {/* Character Stage Wrapper */}
              <div
                ref={charImageWrapRef}
                className="relative w-[340px] sm:w-[420px] lg:w-[500px] h-[360px] sm:h-[460px] lg:h-[560px] select-none flex items-end justify-center will-change-transform"
              >
                {/* 1. DEFAULT STATE: NORMAL CENTERED LELOUCH CHARACTER CUTOUT */}
                <div
                  className={`absolute inset-0 flex items-end justify-center transition-all duration-500 ease-out ${
                    activeHover === "none"
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-95 pointer-events-none z-0"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/lelouch-character.png"
                      alt="Zero - Code Geass Commander Character"
                      fill
                      priority
                      sizes="(max-width: 768px) 340px, (max-width: 1200px) 440px, 520px"
                      className={`object-contain object-bottom filter transition-all duration-500 ${
                        isCharHovered
                          ? "brightness-[1.08] contrast-[1.12] drop-shadow-[0_0_28px_rgba(230,25,36,0.55)] drop-shadow-[0_15px_45px_rgba(0,0,0,0.95)]"
                          : "brightness-[0.98] contrast-[1.06] drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                      }`}
                    />

                    {/* Pinpoint Geass Red Eye Glow */}
                    <div
                      className={`absolute transition-all duration-500 pointer-events-none ${
                        isCharHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
                      }`}
                      style={{
                        top: "24.8%",
                        left: "55.8%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="relative flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-[#E61924] blur-[3px] animate-pulse" />
                        <div className="absolute w-2 h-2 rounded-full bg-white blur-[0.5px]" />
                        <div className="absolute w-12 h-12 rounded-full bg-[#E61924]/40 blur-md pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. LEFT HOVER STATE: BRAND NEW GENERATED CUTOUT (Lelouch looking left) */}
                <div
                  className={`absolute inset-0 flex items-end justify-center transition-all duration-500 ease-out ${
                    activeHover === "left"
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-95 pointer-events-none z-0"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/lelouch-tactical-left.png"
                      alt="Lelouch - Command Vision Looking Towards Left Facilities"
                      fill
                      priority
                      sizes="(max-width: 768px) 340px, (max-width: 1200px) 440px, 520px"
                      className="object-contain object-bottom filter brightness-[1.02] contrast-[1.08] transition-all duration-500 drop-shadow-[0_0_25px_rgba(230,25,36,0.45)] drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
                    />

                    {/* Pinpoint Geass Iris Flare */}
                    <div
                      className="absolute w-4 h-4 rounded-full bg-[#E61924]/90 blur-[2px] animate-pulse pointer-events-none"
                      style={{
                        top: "23.2%",
                        left: "47.1%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </div>
                </div>

                {/* 3. RIGHT HOVER STATE: COMPLETE UNCROPPED CUTOUT (Lelouch with Zero helmet) */}
                <div
                  className={`absolute inset-0 flex items-end justify-center transition-all duration-500 ease-out ${
                    activeHover === "right"
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-95 pointer-events-none z-0"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/lelouch-tactical-right.png"
                      alt="Lelouch - Zero Command with Helmet (Complete Cutout)"
                      fill
                      priority
                      sizes="(max-width: 768px) 340px, (max-width: 1200px) 440px, 520px"
                      className="object-contain object-bottom filter brightness-[1.02] contrast-[1.1] transition-all duration-500 drop-shadow-[0_0_25px_rgba(168,85,247,0.45)] drop-shadow-[0_20px_45px_rgba(0,0,0,0.95)]"
                    />

                    {/* Pinpoint Geass Crimson Flare on Eye */}
                    <div
                      className="absolute w-4 h-4 rounded-full bg-[#E61924]/90 blur-[2px] animate-pulse pointer-events-none"
                      style={{
                        top: "18.3%",
                        left: "54.9%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </div>
                </div>

                {/* 4. RED & BLACK DISSOLUTION PARTICLES (ACTIVATES AT 50%-75%) */}
                <div
                  ref={dissolveParticlesRef}
                  className="absolute inset-0 pointer-events-none opacity-0 flex items-center justify-center z-20"
                >
                  {DISSOLVE_PARTICLES.map((p, idx) => (
                    <div
                      key={idx}
                      className={`dissolve-spark absolute rounded-full ${
                        p.color === "crimson"
                          ? "bg-[#E61924] shadow-[0_0_10px_#E61924,0_0_20px_rgba(230,25,36,0.6)]"
                          : p.color === "silver"
                          ? "bg-slate-200 shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                          : "bg-[#2a0408] border border-[#E61924]/40"
                      }`}
                      style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        top: `${p.top}%`,
                        left: `${p.left}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 2 FACILITY CARDS */}
            <div
              ref={rightCardsRef}
              className="w-full lg:w-[30%] max-w-[420px] flex flex-col gap-4 sm:gap-5 z-20 will-change-transform"
            >
              {RIGHT_FACILITIES.map((facility) => {
                const Icon = facility.icon;
                return (
                  <div
                    key={facility.id}
                    onMouseEnter={() => handleCardMouseEnter("right")}
                    onMouseLeave={handleCardMouseLeave}
                    className="group relative w-full aspect-[975/319] min-h-[110px] sm:min-h-[120px] flex items-center transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none"
                  >
                    {/* Transparent Frame Asset Layer */}
                    <div className="absolute inset-0 pointer-events-none transition-all duration-300">
                      <Image
                        src="/images/facility-card-frame.png"
                        alt=""
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-fill transition-all duration-300 filter group-hover:brightness-125 group-hover:drop-shadow-[0_0_14px_rgba(230,25,36,0.35)]"
                      />
                      <div className="absolute bottom-1 right-2.5 w-6 h-3 rounded-full bg-[#E61924]/0 group-hover:bg-[#E61924]/60 blur-[4px] transition-all duration-300 pointer-events-none" />
                    </div>

                    {/* Live HTML Content Layer */}
                    <div className="relative z-10 w-full h-full flex items-center px-6 sm:px-8 py-3 sm:py-4 gap-3.5 sm:gap-4">
                      <div className="p-2 sm:p-2.5 rounded bg-white/[0.03] border border-white/5 group-hover:border-white/20 text-[#D2CCC0] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                        <Icon className="w-4 sm:w-5 h-4 sm:h-5 stroke-[1.8] group-hover:stroke-[#E61924] transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0 pr-3 sm:pr-6">
                        <div className="flex items-center justify-between gap-1">
                          <h2 className="font-mono text-xs sm:text-[13px] font-bold tracking-[0.16em] uppercase text-[#F5F2EB] group-hover:text-white transition-colors duration-300 truncate">
                            {facility.title}
                          </h2>
                          <span className="font-mono text-[9px] tracking-widest text-neutral-600 group-hover:text-neutral-400 transition-colors">
                            {facility.code}
                          </span>
                        </div>
                        <p className="mt-1 font-sans text-[11px] sm:text-xs text-[#A8A49C] group-hover:text-[#D4CEC3] leading-relaxed transition-colors duration-300">
                          {facility.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BOTTOM SECTION: STATUS LINE & REFINED CTA BUTTON */}
          <section
            ref={bottomStatusBarRef}
            className="relative z-30 pt-4 pb-2 border-t border-neutral-800/70 flex flex-col sm:flex-row items-center justify-between gap-4 will-change-transform"
          >
            <div className="flex items-center gap-3 font-mono text-[11px] sm:text-xs text-[#D6D0C5] tracking-[0.22em] uppercase">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>RESIDENT QUARTERS STATUS: ALLOCATIONS OPEN</span>
            </div>

            <button
              type="button"
              onClick={() => {
                const lenis = window.__lenis;
                if (lenis && scrollWrapperRef.current) {
                  lenis.scrollTo(scrollWrapperRef.current.offsetTop + window.innerHeight * 2.3);
                } else {
                  window.scrollTo({
                    top: window.innerHeight * 2.5,
                    behavior: "smooth",
                  });
                }
              }}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-3 font-mono text-xs font-semibold tracking-[0.25em] uppercase text-[#F5F2EB] hover:text-white bg-[#0e1015]/90 hover:bg-[#8b1525] border border-neutral-600/70 hover:border-[#E61924] transition-all duration-300 shadow-[0_6px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_35px_rgba(230,25,36,0.35)] active:scale-95 cursor-pointer"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
              }}
            >
              <span>RESERVE PASS</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </section>
        </div>

        {/* =================================================================== */}
        {/* PHASE 4: FORM REVEAL LAYER (75% - 100%)                             */}
        {/* =================================================================== */}
        <div
          ref={formPanelRef}
          className={`absolute z-30 inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 will-change-transform ${
            scrollProgress >= 0.72 ? "pointer-events-auto" : "pointer-events-none opacity-0"
          }`}
          style={{ perspective: "1200px" }}
        >
          {/* Large Centered Smoked-Black Glass Panel */}
          <div
            data-lenis-prevent
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-lg bg-[#07080b]/92 backdrop-blur-2xl border border-white/[0.09] p-6 sm:p-9 shadow-[0_25px_80px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            {/* Subtle cybernetic grid texture inside panel */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none rounded-lg opacity-60" />

            {/* Ambient subtle crimson backlight */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#E61924]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Architectural HUD Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#E61924]/70 pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#E61924]/70 pointer-events-none" />

            {/* SUCCESS STATE */}
            {isSubmitted ? (
              <div className="relative z-10 py-10 px-4 text-center space-y-6">
                <div className="inline-flex p-4 rounded-full bg-[#E61924]/10 border border-[#E61924]/40 text-[#E61924] shadow-[0_0_35px_rgba(230,25,36,0.3)] animate-in zoom-in-75 duration-500">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#E61924] font-semibold">
                    DISPATCH CONFIRMED · ALLOCATION LOGGED
                  </span>
                  <h2 className="font-[family-name:var(--font-impact)] text-4xl sm:text-5xl uppercase tracking-wider text-[#F5F2EB]">
                    ACCOMMODATION REQUEST RECEIVED
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-[#A8A49C] max-w-lg mx-auto leading-relaxed">
                    Your residency directive has been securely registered with the Central Directorate.
                    A formal allocation dossier has been dispatched to your institutional email.
                  </p>
                </div>

                {/* Dossier Ticket Details */}
                <div className="max-w-md mx-auto p-4 rounded bg-white/[0.02] border border-white/[0.08] text-left font-mono text-xs space-y-2.5">
                  <div className="flex justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-neutral-500">CONFIRMATION REF:</span>
                    <span className="text-[#E61924] font-bold">{confirmationId}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-neutral-500">RESIDENT:</span>
                    <span className="text-[#F5F2EB]">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-neutral-500">INSTITUTION:</span>
                    <span className="text-[#F5F2EB] truncate max-w-[200px]">{formData.college}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-neutral-500">CITY:</span>
                    <span className="text-[#F5F2EB]">{formData.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">DURATION:</span>
                    <span className="text-[#F5F2EB]">{formData.nights}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        college: "",
                        city: "",
                        nights: "3 Nights (Full Fest)",
                        specialRequirements: "",
                        confirmed: false,
                      });
                    }}
                    className="px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] bg-white/[0.03] hover:bg-[#E61924] border border-white/20 hover:border-[#E61924] text-[#F5F2EB] transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.5)] cursor-pointer"
                  >
                    SUBMIT ANOTHER REQUEST
                  </button>
                </div>
              </div>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleFormSubmit} className="relative z-10 space-y-5">
                {/* Form Header */}
                <div className="relative pb-5 border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E61924] shadow-[0_0_6px_#E61924]" />
                      <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#C4BEB2] font-medium">
                        RESIDENCE DIRECTIVE · STEP 01
                      </span>
                    </div>
                    <h2 className="font-[family-name:var(--font-impact)] text-4xl sm:text-5xl uppercase tracking-wider text-[#F5F2EB] leading-none pt-1">
                      RESERVE YOUR STAY
                    </h2>
                    <p className="font-sans text-xs sm:text-[13px] text-[#A8A49C] tracking-wide">
                      Submit your details to begin your accommodation request.
                    </p>
                  </div>

                  {/* Micro Metadata on Top Right */}
                  <div className="hidden sm:flex flex-col items-end text-right font-mono text-[9px] tracking-[0.22em] text-neutral-500 space-y-0.5">
                    <span className="text-[#E61924] font-medium">STATUS: ALLOCATIONS ACTIVE</span>
                    <span>DIRECTIVE // RES-27</span>
                  </div>
                </div>

                {/* Staggered Form Fields Container - Balanced 3 Rows of 2 Columns */}
                <div ref={formFieldsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {/* Row 1, Col 1: Full Name */}
                  <div className="space-y-1.5 group">
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A8A49C] group-focus-within:text-[#F5F2EB] transition-colors flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-[#E61924]" />
                        Full Name
                      </span>
                      <span className="text-[#E61924] text-xs leading-none">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Lelouch Lamperouge"
                        className={`w-full px-3.5 py-2.5 rounded bg-white/[0.025] hover:bg-white/[0.04] border text-xs sm:text-sm text-[#F5F2EB] placeholder:text-neutral-600 focus:outline-none transition-all duration-200 ${
                          formErrors.fullName
                            ? "border-[#E61924] shadow-[0_0_12px_rgba(230,25,36,0.25)]"
                            : "border-white/[0.08] hover:border-white/[0.18] focus:border-[#E61924] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(230,25,36,0.18)]"
                        }`}
                      />
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20 pointer-events-none group-focus-within:border-[#E61924]" />
                    </div>
                    {formErrors.fullName && (
                      <p className="font-mono text-[9px] text-[#E61924] tracking-wider flex items-center gap-1 mt-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Row 1, Col 2: Email Address */}
                  <div className="space-y-1.5 group">
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A8A49C] group-focus-within:text-[#F5F2EB] transition-colors flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-[#E61924]" />
                        Email Address
                      </span>
                      <span className="text-[#E61924] text-xs leading-none">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="resident@institution.edu"
                        className={`w-full px-3.5 py-2.5 rounded bg-white/[0.025] hover:bg-white/[0.04] border text-xs sm:text-sm text-[#F5F2EB] placeholder:text-neutral-600 focus:outline-none transition-all duration-200 ${
                          formErrors.email
                            ? "border-[#E61924] shadow-[0_0_12px_rgba(230,25,36,0.25)]"
                            : "border-white/[0.08] hover:border-white/[0.18] focus:border-[#E61924] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(230,25,36,0.18)]"
                        }`}
                      />
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20 pointer-events-none group-focus-within:border-[#E61924]" />
                    </div>
                    {formErrors.email && (
                      <p className="font-mono text-[9px] text-[#E61924] tracking-wider flex items-center gap-1 mt-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Row 2, Col 1: Phone Number */}
                  <div className="space-y-1.5 group">
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A8A49C] group-focus-within:text-[#F5F2EB] transition-colors flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-[#E61924]" />
                        Phone Number
                      </span>
                      <span className="text-[#E61924] text-xs leading-none">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className={`w-full px-3.5 py-2.5 rounded bg-white/[0.025] hover:bg-white/[0.04] border text-xs sm:text-sm text-[#F5F2EB] placeholder:text-neutral-600 focus:outline-none transition-all duration-200 ${
                          formErrors.phone
                            ? "border-[#E61924] shadow-[0_0_12px_rgba(230,25,36,0.25)]"
                            : "border-white/[0.08] hover:border-white/[0.18] focus:border-[#E61924] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(230,25,36,0.18)]"
                        }`}
                      />
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20 pointer-events-none group-focus-within:border-[#E61924]" />
                    </div>
                    {formErrors.phone && (
                      <p className="font-mono text-[9px] text-[#E61924] tracking-wider flex items-center gap-1 mt-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Row 2, Col 2: College / University */}
                  <div className="space-y-1.5 group">
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A8A49C] group-focus-within:text-[#F5F2EB] transition-colors flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Building className="w-3 h-3 text-[#E61924]" />
                        College / University
                      </span>
                      <span className="text-[#E61924] text-xs leading-none">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        placeholder="e.g. MMMUT Gorakhpur / IIT / NIT"
                        className={`w-full px-3.5 py-2.5 rounded bg-white/[0.025] hover:bg-white/[0.04] border text-xs sm:text-sm text-[#F5F2EB] placeholder:text-neutral-600 focus:outline-none transition-all duration-200 ${
                          formErrors.college
                            ? "border-[#E61924] shadow-[0_0_12px_rgba(230,25,36,0.25)]"
                            : "border-white/[0.08] hover:border-white/[0.18] focus:border-[#E61924] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(230,25,36,0.18)]"
                        }`}
                      />
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20 pointer-events-none group-focus-within:border-[#E61924]" />
                    </div>
                    {formErrors.college && (
                      <p className="font-mono text-[9px] text-[#E61924] tracking-wider flex items-center gap-1 mt-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {formErrors.college}
                      </p>
                    )}
                  </div>

                  {/* Row 3, Col 1: City */}
                  <div className="space-y-1.5 group">
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A8A49C] group-focus-within:text-[#F5F2EB] transition-colors flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#E61924]" />
                        City
                      </span>
                      <span className="text-[#E61924] text-xs leading-none">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Lucknow, Varanasi, Delhi"
                        className={`w-full px-3.5 py-2.5 rounded bg-white/[0.025] hover:bg-white/[0.04] border text-xs sm:text-sm text-[#F5F2EB] placeholder:text-neutral-600 focus:outline-none transition-all duration-200 ${
                          formErrors.city
                            ? "border-[#E61924] shadow-[0_0_12px_rgba(230,25,36,0.25)]"
                            : "border-white/[0.08] hover:border-white/[0.18] focus:border-[#E61924] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(230,25,36,0.18)]"
                        }`}
                      />
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20 pointer-events-none group-focus-within:border-[#E61924]" />
                    </div>
                    {formErrors.city && (
                      <p className="font-mono text-[9px] text-[#E61924] tracking-wider flex items-center gap-1 mt-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {formErrors.city}
                      </p>
                    )}
                  </div>

                  {/* Row 3, Col 2: Number of Nights */}
                  <div className="space-y-1.5 group">
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A8A49C] group-focus-within:text-[#F5F2EB] transition-colors flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-[#E61924]" />
                        Number of Nights
                      </span>
                      <span className="text-neutral-500 text-[9px]">SELECT</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.nights}
                        onChange={(e) => setFormData({ ...formData, nights: e.target.value })}
                        className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded bg-white/[0.025] hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.18] focus:border-[#E61924] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(230,25,36,0.18)] text-xs sm:text-sm text-[#F5F2EB] focus:outline-none transition-all duration-200 cursor-pointer"
                      >
                        <option value="1 Night" className="bg-[#0e1015] text-[#F5F2EB]">
                          1 Night (Day Pass)
                        </option>
                        <option value="2 Nights" className="bg-[#0e1015] text-[#F5F2EB]">
                          2 Nights (Weekend Conclave)
                        </option>
                        <option value="3 Nights (Full Fest)" className="bg-[#0e1015] text-[#F5F2EB]">
                          3 Nights (Full Fest Conclave)
                        </option>
                        <option value="4 Nights" className="bg-[#0e1015] text-[#F5F2EB]">
                          4 Nights (Extended Hackathon)
                        </option>
                      </select>
                      {/* Custom dropdown chevron */}
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 group-hover:text-white transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20 pointer-events-none group-focus-within:border-[#E61924]" />
                    </div>
                  </div>

                  {/* Row 4: Special Requirements (Full Width) */}
                  <div className="space-y-1.5 md:col-span-2 group">
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A8A49C] group-focus-within:text-[#F5F2EB] transition-colors flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-[#E61924]" />
                        Special Requirements
                      </span>
                      <span className="text-neutral-500 text-[9px] font-mono">OPTIONAL</span>
                    </label>
                    <div className="relative">
                      <textarea
                        rows={2}
                        value={formData.specialRequirements}
                        onChange={(e) =>
                          setFormData({ ...formData, specialRequirements: e.target.value })
                        }
                        placeholder="Dietary requirements, room adjacency with team, early arrival time..."
                        className="w-full px-3.5 py-2.5 rounded bg-white/[0.025] hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.18] focus:border-[#E61924] focus:bg-white/[0.05] focus:shadow-[0_0_15px_rgba(230,25,36,0.18)] text-xs sm:text-sm text-[#F5F2EB] placeholder:text-neutral-600 focus:outline-none transition-all duration-200 resize-none"
                      />
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20 pointer-events-none group-focus-within:border-[#E61924]" />
                    </div>
                  </div>

                  {/* Row 5: Custom Cybernetic Checkbox Confirmation */}
                  <div className="space-y-1 md:col-span-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, confirmed: !formData.confirmed })}
                      className="flex items-center gap-3 text-left cursor-pointer group select-none"
                    >
                      <div
                        className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                          formData.confirmed
                            ? "bg-[#E61924] border-[#E61924] shadow-[0_0_10px_rgba(230,25,36,0.5)]"
                            : "bg-white/[0.03] border-white/20 group-hover:border-white/40"
                        }`}
                      >
                        {formData.confirmed && (
                          <svg className="w-3 h-3 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span className="font-mono text-xs text-[#C4BEB2] group-hover:text-white transition-colors">
                        I confirm that the details provided are accurate.
                      </span>
                    </button>
                    {formErrors.confirmed && (
                      <p className="font-mono text-[9px] text-[#E61924] tracking-wider pl-7 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5" />
                        {formErrors.confirmed}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 6: Submit Bar */}
                <div className="pt-4 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E61924] shadow-[0_0_6px_#E61924]" />
                    <span>PRIORITY VERIFICATION APPLIED</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 font-mono text-xs font-semibold tracking-[0.22em] uppercase text-white bg-gradient-to-r from-[#8b141d] to-[#b31926] hover:from-[#a81824] hover:to-[#c91d2d] border border-[#E61924]/60 hover:border-[#E61924] transition-all duration-300 shadow-[0_4px_25px_rgba(230,25,36,0.35)] hover:shadow-[0_6px_35px_rgba(230,25,36,0.55)] active:scale-95 cursor-pointer disabled:opacity-50"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                    }}
                  >
                    <span>
                      {isSubmitting
                        ? "PROCESSING DIRECTIVE..."
                        : "SUBMIT ACCOMMODATION REQUEST →"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
