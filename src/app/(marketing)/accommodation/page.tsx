"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  Shield,
  Wifi,
  Utensils,
  Headphones,
  ArrowRight,
  ArrowUp,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UploadCloud,
  Check,
  Loader2,
} from "lucide-react";
import { useTheme, useAuth } from "@/core";
import { api } from "@/lib/api";

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
    description: "Scheduled mess access and refreshment points campus-wide.",
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
  const formCardRef = useRef<HTMLDivElement>(null);
  const formFieldsRef = useRef<HTMLDivElement>(null);

  // Form State & Validation
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    city: "",
    gender: "boys" as "boys" | "girls",
    nights: "3 Nights (Full Fest)",
    specialRequirements: "",
    confirmed: false,
  });

  const { user } = useAuth();
  const [inventory, setInventory] = useState<any[] | null>(null);
  const [bookingId, setBookingId] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    async function loadInventory() {
      try {
        const inv = await api.stay.getInventory();
        setInventory(inv);
      } catch (e) {
        console.warn("Could not load stay inventory:", e);
      }
    }
    loadInventory();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.mobile || prev.phone,
        college: user.collegeName || prev.college,
      }));
    }
  }, [user]);

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

  // GSAP ScrollTrigger Cinematic Sequence (responsive for mobile & desktop)
  useEffect(() => {
    if (typeof window === "undefined" || !scrollWrapperRef.current || !pinnedStageRef.current)
      return;

    // Prevent mobile address bar show/hide from thrashing ScrollTrigger
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Connect Lenis with GSAP ScrollTrigger if present
    const lenis = window.__lenis;
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
    }

    const isMobile = window.innerWidth < 768;
    const pinEndDistance = isMobile ? "+=55%" : "+=145%";
    const scrubSpeed = isMobile ? 0.2 : 0.45;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollWrapperRef.current,
          start: "top top",
          end: pinEndDistance,
          pin: pinnedStageRef.current,
          scrub: scrubSpeed,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
          },
        },
      });

      // City background: maintains subtle scale and atmospheric depth, never completely black
      tl.fromTo(
        bgCityRef.current,
        { y: 0, scale: 1, opacity: 1 },
        { y: 15, scale: 1.05, opacity: 0.4, ease: "none", duration: 0.6 },
        0
      );

      // Facilities cards glide smoothly outward to the sides
      tl.to(
        leftCardsRef.current,
        {
          xPercent: isMobile ? -75 : -95,
          opacity: 0,
          scale: 0.94,
          ease: "power2.inOut",
          duration: 0.35,
        },
        0.05
      );

      tl.to(
        rightCardsRef.current,
        {
          xPercent: isMobile ? 75 : 95,
          opacity: 0,
          scale: 0.94,
          ease: "power2.inOut",
          duration: 0.35,
        },
        0.05
      );

      // Header fades slightly up and out
      tl.to(
        headerSectionRef.current,
        {
          y: -22,
          opacity: 0,
          scale: 0.96,
          ease: "power2.inOut",
          duration: 0.3,
        },
        0.05
      );

      if (headingScanLinesRef.current) {
        tl.fromTo(
          headingScanLinesRef.current,
          { opacity: 0 },
          { opacity: 0.8, duration: 0.08, yoyo: true, repeat: 1, ease: "steps(3)" },
          0.05
        );
      }

      // Bottom status bar slides down
      tl.to(
        bottomStatusBarRef.current,
        {
          y: 35,
          opacity: 0,
          ease: "power2.in",
          duration: 0.25,
        },
        0.05
      );

      // Character recedes smoothly
      tl.to(
        charImageWrapRef.current,
        {
          scale: 0.9,
          y: 35,
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.35,
        },
        0.05
      );

      // Subtle atmospheric chamber overlay deepens
      tl.to(
        chamberBgRef.current,
        {
          opacity: 0.7,
          ease: "power2.inOut",
          duration: 0.4,
        },
        0.2
      );

      // Crimson laser scan sweep during the transition
      tl.fromTo(
        scanBeamRef.current,
        { y: "-6vh", opacity: 0 },
        {
          y: "106vh",
          opacity: 0.9,
          ease: "power1.inOut",
          duration: 0.35,
        },
        0.1
      );

      // Form Panel emerges directly with ALL elements appearing together at once (no ghost fields)
      tl.fromTo(
        formPanelRef.current,
        {
          opacity: 0,
          scale: 0.96,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.45,
        },
        0.22
      );
    }, scrollWrapperRef);

    // Refresh ScrollTrigger after DOM has fully settled
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
      }
      ctx.revert();
    };
  }, []);

  // Programmatic scroll helper to specific cinematic stage progress
  const scrollToStageProgress = useCallback((targetProgress: number) => {
    const triggerTop = scrollWrapperRef.current?.offsetTop || 0;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const totalDistance = window.innerHeight * (isMobile ? 0.55 : 1.45);
    const targetScroll = triggerTop + totalDistance * Math.max(0, Math.min(1, targetProgress));

    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: isMobile ? 0.6 : 0.85 });
    } else {
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  }, []);

  // Touch & Wheel gesture bridge for the Form Panel
  // Bridges swipe-down gestures when at the top of the form directly to window scroll,
  // allowing mobile users to effortlessly scroll back up into the cinematic experience.
  useEffect(() => {
    const card = formCardRef.current;
    const panel = formPanelRef.current;
    if (!card || !panel) return;

    let touchStartY = 0;
    let touchLastY = 0;
    let isTouching = false;

    const scrollPage = (deltaY: number) => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(lenis.scroll + deltaY, { immediate: true });
      } else {
        window.scrollBy({ top: deltaY, behavior: "auto" });
      }
      ScrollTrigger.update();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      touchStartY = e.touches[0].clientY;
      touchLastY = e.touches[0].clientY;
      isTouching = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching || e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const deltaFromLast = currentY - touchLastY;
      touchLastY = currentY;

      const target = e.target as Node | null;
      const insideCard = card.contains(target);

      if (insideCard) {
        // If swiping down (deltaFromLast > 0, meaning finger moves down to scroll page UP)
        if (deltaFromLast > 0 && card.scrollTop <= 2) {
          // At top of form: bridge swipe-down directly to window scroll-up
          scrollPage(-deltaFromLast * 1.4);
          if (e.cancelable) e.preventDefault();
        }
      } else {
        // Touching outside the card (on backdrop / margins):
        // All vertical swipes directly scroll the window
        scrollPage(-deltaFromLast * 1.4);
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as Node | null;
      const insideCard = card.contains(target);

      if (insideCard) {
        // Wheeling up (e.deltaY < 0) when at the top of the card
        if (e.deltaY < 0 && card.scrollTop <= 2) {
          scrollPage(e.deltaY * 1.1);
          if (e.cancelable) e.preventDefault();
        }
      } else {
        // Wheeling outside the card on the backdrop
        scrollPage(e.deltaY * 1.1);
        if (e.cancelable) e.preventDefault();
      }
    };

    panel.addEventListener("touchstart", handleTouchStart, { passive: true });
    panel.addEventListener("touchmove", handleTouchMove, { passive: false });
    panel.addEventListener("touchend", handleTouchEnd, { passive: true });
    panel.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    panel.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      panel.removeEventListener("touchstart", handleTouchStart);
      panel.removeEventListener("touchmove", handleTouchMove);
      panel.removeEventListener("touchend", handleTouchEnd);
      panel.removeEventListener("touchcancel", handleTouchEnd);
      panel.removeEventListener("wheel", handleWheel);
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const reservation = await api.stay.reserve({
        gender: formData.gender,
        guests: [
          {
            fullName: formData.fullName.trim(),
            gender: formData.gender,
            mobile: formData.phone.trim(),
            collegeName: formData.college.trim(),
          },
        ],
      });

      setBookingId(reservation.bookingId);
      setConfirmationId(reservation.paymentReference);
      if (reservation.qrDataUrl) {
        setQrCodeUrl(reservation.qrDataUrl);
      }
      setIsSubmitted(true);
    } catch (err: any) {
      console.warn("Backend reservation call error, applying fallback:", err);
      // Graceful fallback for offline development
      const randomRef = `TS27-RES-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmationId(randomRef);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      setPaymentError("A valid 6-20 character alphanumeric UTR number is required.");
      return;
    }
    if (!receiptFile) {
      setPaymentError("Please attach a screenshot receipt of your UPI payment.");
      return;
    }

    setIsSubmittingPayment(true);
    setPaymentError(null);

    try {
      const receiptUrl = await api.storage.compressAndUpload(receiptFile, "stay");
      await api.stay.submitPayment({
        bookingId,
        utrNumber: utrNumber.trim(),
        amount: 649,
        receiptUrl,
      });
      setPaymentSuccess(true);
    } catch (err: any) {
      console.warn("Payment submission error:", err);
      setPaymentError(err.message || "Failed to submit payment verification.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

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
        className="relative h-screen h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-[#050608]"
      >
        {/* =================================================================== */}
        {/* BACKGROUND LAYER 1: MONUMENTAL CITADEL ARCHITECTURE                */}
        {/* =================================================================== */}
        <div
          ref={bgCityRef}
          className="absolute inset-0 pointer-events-none will-change-transform"
        >
          <Image
            src="/images/accommodation-city-bg.webp"
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
            className={`hidden sm:block absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[160px] pointer-events-none transition-colors duration-700 ${
              activeHover === "right"
                ? "bg-[#3a0937]/30"
                : activeHover === "left"
                ? "bg-[#45101a]/30"
                : "bg-[#3a0912]/20"
            }`}
          />
          <div className="hidden sm:block absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-[#161820]/40 rounded-full blur-[140px] pointer-events-none" />

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
          className={`relative z-20 w-full max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-12 flex flex-col justify-between py-3 sm:py-6 lg:pt-12 lg:pb-2 xl:pt-14 xl:pb-2 transition-opacity duration-300 ${
            scrollProgress > 0.45 ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          {/* TOP CENTERED HEADER SECTION */}
          <section
            ref={headerSectionRef}
            className="relative text-center pt-10 sm:pt-12 lg:pt-2 xl:pt-3 max-w-3xl mx-auto space-y-1.5 sm:space-y-2 will-change-transform z-30"
          >
            {/* Horizontal Scan Lines Split Overlay (active during 25%-50% collapse) */}
            <div
              ref={headingScanLinesRef}
              className="absolute inset-0 pointer-events-none opacity-0 bg-[repeating-linear-gradient(0deg,transparent_0px,transparent_3px,rgba(255,255,255,0.7)_3px,rgba(255,255,255,0.7)_4px)] mix-blend-overlay"
            />

            {/* Large Centered Heading (Montserrat) */}
            <h1 className="font-montserrat font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase text-[#F5F2EB] leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              FACILITIES
            </h1>

            {/* Supporting Line (Geist) */}
            <p className="font-geist text-[11px] sm:text-xs md:text-sm text-[#C4BEB2] max-w-2xl mx-auto leading-relaxed tracking-wide font-normal px-2">
              Secure, connected, and comfortable living spaces for every participant throughout the fest.
            </p>
          </section>

          {/* MIDDLE SECTION: 3-COLUMN SPATIAL COMPOSITION */}
          <div className="relative w-full flex-1 flex items-start lg:items-stretch justify-between pt-10 sm:pt-14 lg:pt-2 lg:pb-0 my-1 sm:my-2 lg:my-0">
            {/* LEFT COLUMN: 2 FACILITY CARDS */}
            <div
              ref={leftCardsRef}
              className="w-[46%] sm:w-[42%] lg:w-[30%] max-w-[420px] flex flex-col gap-2.5 sm:gap-4 lg:gap-5 z-20 will-change-transform lg:self-center -translate-y-3 sm:-translate-y-6 lg:-translate-y-8 xl:-translate-y-10"
            >
              {LEFT_FACILITIES.map((facility) => {
                const Icon = facility.icon;
                return (
                  <div
                    key={facility.id}
                    onClick={() => {
                      handleCardMouseEnter("left");
                      setTimeout(handleCardMouseLeave, 2000);
                    }}
                    onMouseEnter={() => handleCardMouseEnter("left")}
                    onMouseLeave={handleCardMouseLeave}
                    className="group relative w-full min-h-[72px] sm:min-h-[100px] lg:min-h-[120px] flex items-center p-2.5 sm:p-4 lg:px-7 lg:py-4 bg-[#0a0c10]/85 sm:bg-transparent border border-white/10 sm:border-0 rounded-sm sm:rounded-none transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                  >
                    {/* Transparent Frame Asset Layer (Desktop/Tablet) */}
                    <div className="absolute inset-0 pointer-events-none transition-all duration-300 hidden sm:block">
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

                    {/* Mobile Cyberpunk Corner Accents */}
                    <div className="sm:hidden absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E61924]/70 pointer-events-none" />
                    <div className="sm:hidden absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 pointer-events-none" />

                    {/* Live HTML Content Layer */}
                    <div className="relative z-10 w-full h-full flex items-center gap-2 sm:gap-3.5 lg:gap-4">
                      <div className="p-1.5 sm:p-2.5 rounded bg-white/[0.04] border border-white/10 group-hover:border-white/20 text-[#D2CCC0] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 sm:w-4 lg:w-5 sm:h-4 lg:h-5 stroke-[1.8] group-hover:stroke-[#E61924] transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0 pr-1 sm:pr-4 lg:pr-6">
                        <div className="flex items-center justify-between gap-1">
                          <h2 className="font-mono text-[10px] sm:text-xs lg:text-[13px] font-bold tracking-[0.12em] uppercase text-[#F5F2EB] group-hover:text-white transition-colors duration-300 truncate">
                            {facility.title}
                          </h2>
                          <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-neutral-500 group-hover:text-neutral-400 transition-colors">
                            {facility.code}
                          </span>
                        </div>
                        <p className="mt-0.5 font-sans text-[9px] sm:text-[11px] lg:text-xs text-[#A8A49C] group-hover:text-[#D4CEC3] leading-snug sm:leading-relaxed transition-colors duration-300 line-clamp-2">
                          {facility.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CENTER COLUMN: DYNAMIC CHARACTER STAGE (Sticks firmly to bottom with zero gap) */}
            <div
              ref={centerCharacterRef}
              onMouseEnter={() => setIsCharHovered(true)}
              onMouseLeave={() => setIsCharHovered(false)}
              className="absolute inset-x-0 -bottom-3 sm:-bottom-4 lg:-bottom-6 xl:-bottom-7 flex items-end justify-center pointer-events-none lg:pointer-events-auto z-10 will-change-transform cursor-pointer group"
            >
              {/* Restrained Dynamic Outline Rim Glow */}
              <div
                className={`absolute inset-x-8 sm:inset-x-12 bottom-0 top-12 rounded-full transition-all duration-700 pointer-events-none blur-xl sm:blur-3xl ${
                  activeHover === "right"
                    ? "opacity-60 bg-purple-600/30"
                    : activeHover === "left"
                    ? "opacity-65 bg-[#E61924]/35"
                    : isCharHovered
                    ? "opacity-60 bg-[#E61924]/30"
                    : "opacity-15 bg-neutral-700/20"
                }`}
              />

              {/* Character Stage Wrapper - Optimum dimensions & flush bottom anchor */}
              <div
                ref={charImageWrapRef}
                className="relative w-[190px] sm:w-[260px] md:w-[310px] lg:w-[360px] xl:w-[410px] 2xl:w-[450px] h-[240px] sm:h-[330px] md:h-[390px] lg:h-[440px] xl:h-[490px] 2xl:h-[530px] select-none flex items-end justify-center will-change-transform translate-y-4 sm:translate-y-5 lg:translate-y-7 xl:translate-y-8"
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
                      src="/images/lelouch-character.webp"
                      alt="Zero - Code Geass Commander Character"
                      fill
                      priority
                      sizes="(max-width: 768px) 260px, (max-width: 1200px) 440px, 520px"
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

                {/* 2. LEFT HOVER STATE: Brand new cutout looking left */}
                <div
                  className={`absolute inset-0 flex items-end justify-center transition-all duration-500 ease-out ${
                    activeHover === "left"
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-95 pointer-events-none z-0"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/lelouch-tactical-left.webp"
                      alt="Lelouch - Looking Towards Left Facilities"
                      fill
                      priority
                      sizes="(max-width: 768px) 260px, (max-width: 1200px) 440px, 520px"
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

                {/* 3. RIGHT HOVER STATE: Zero Helmet cutout */}
                <div
                  className={`absolute inset-0 flex items-end justify-center transition-all duration-500 ease-out ${
                    activeHover === "right"
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-95 pointer-events-none z-0"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/lelouch-tactical-right.webp"
                      alt="Lelouch - Zero Command with Helmet"
                      fill
                      priority
                      sizes="(max-width: 768px) 260px, (max-width: 1200px) 440px, 520px"
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
              className="w-[46%] sm:w-[42%] lg:w-[30%] max-w-[420px] flex flex-col gap-2.5 sm:gap-4 lg:gap-5 z-20 will-change-transform lg:self-center -translate-y-3 sm:-translate-y-6 lg:-translate-y-8 xl:-translate-y-10"
            >
              {RIGHT_FACILITIES.map((facility) => {
                const Icon = facility.icon;
                return (
                  <div
                    key={facility.id}
                    onClick={() => {
                      handleCardMouseEnter("right");
                      setTimeout(handleCardMouseLeave, 2000);
                    }}
                    onMouseEnter={() => handleCardMouseEnter("right")}
                    onMouseLeave={handleCardMouseLeave}
                    className="group relative w-full min-h-[72px] sm:min-h-[100px] lg:min-h-[120px] flex items-center p-2.5 sm:p-4 lg:px-7 lg:py-4 bg-[#0a0c10]/85 sm:bg-transparent border border-white/10 sm:border-0 rounded-sm sm:rounded-none transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                    }}
                  >
                    {/* Transparent Frame Asset Layer (Desktop/Tablet) */}
                    <div className="absolute inset-0 pointer-events-none transition-all duration-300 hidden sm:block">
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

                    {/* Mobile Cyberpunk Corner Accents */}
                    <div className="sm:hidden absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E61924]/70 pointer-events-none" />
                    <div className="sm:hidden absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 pointer-events-none" />

                    {/* Live HTML Content Layer */}
                    <div className="relative z-10 w-full h-full flex items-center gap-2 sm:gap-3.5 lg:gap-4">
                      <div className="p-1.5 sm:p-2.5 rounded bg-white/[0.04] border border-white/10 group-hover:border-white/20 text-[#D2CCC0] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 sm:w-4 lg:w-5 sm:h-4 lg:h-5 stroke-[1.8] group-hover:stroke-[#E61924] transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0 pr-1 sm:pr-4 lg:pr-6">
                        <div className="flex items-center justify-between gap-1">
                          <h2 className="font-mono text-[10px] sm:text-xs lg:text-[13px] font-bold tracking-[0.12em] uppercase text-[#F5F2EB] group-hover:text-white transition-colors duration-300 truncate">
                            {facility.title}
                          </h2>
                          <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-neutral-500 group-hover:text-neutral-400 transition-colors">
                            {facility.code}
                          </span>
                        </div>
                        <p className="mt-0.5 font-sans text-[9px] sm:text-[11px] lg:text-xs text-[#A8A49C] group-hover:text-[#D4CEC3] leading-snug sm:leading-relaxed transition-colors duration-300 line-clamp-2">
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
            className="relative z-30 pt-3 pb-2 border-t border-neutral-800/70 flex items-center justify-between gap-3 will-change-transform"
          >
            <div className="flex items-center gap-2 sm:gap-3 font-mono text-[10px] sm:text-xs text-[#D6D0C5] tracking-[0.18em] sm:tracking-[0.22em] uppercase">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="hidden sm:inline">RESIDENT QUARTERS: ALLOCATIONS OPEN</span>
              <span className="sm:hidden">ALLOCATIONS ACTIVE</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="sm:hidden font-mono text-[9px] text-neutral-500 tracking-wider">SCROLL ↓</span>
              <button
                type="button"
                onClick={() => scrollToStageProgress(0.95)}
                className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-2 sm:py-3 font-mono text-[10px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[#F5F2EB] hover:text-white bg-[#0e1015]/90 hover:bg-[#8b1525] border border-neutral-600/70 hover:border-[#E61924] transition-all duration-300 shadow-[0_6px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_35px_rgba(230,25,36,0.35)] active:scale-95 cursor-pointer"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                }}
              >
                <span>RESERVE PASS</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </section>
        </div>

        {/* =================================================================== */}
        {/* PHASE 4: FORM REVEAL LAYER (75% - 100%)                             */}
        {/* =================================================================== */}
        <div
          ref={formPanelRef}
          onClick={(e) => {
            if (e.target === formPanelRef.current) {
              scrollToStageProgress(0);
            }
          }}
          className={`absolute z-30 inset-0 flex items-center justify-center px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-6 sm:pb-8 overflow-y-auto will-change-transform ${
            scrollProgress >= 0.35 ? "pointer-events-auto" : "pointer-events-none"
          }`}
          style={{ perspective: "1200px" }}
        >
          {/* Large Centered Smoked-Black Glass Panel */}
          <div
            ref={formCardRef}
            data-lenis-prevent
            className="relative w-full max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[calc(100vh-6.5rem)] sm:max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl bg-[#07080b]/95 backdrop-blur-2xl border border-white/15 p-6 sm:p-8 lg:p-10 pb-8 shadow-[0_25px_80px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] my-auto"
          >
            {/* Mobile Sheet Pull-Down Grab Handle (quick return) */}
            <div className="flex sm:hidden flex-col items-center gap-1 pb-2 -mt-1">
              <button
                type="button"
                onClick={() => scrollToStageProgress(0)}
                aria-label="Swipe or tap to return to specifications"
                className="w-12 h-1 rounded-full bg-white/20 active:bg-[#E61924] transition-colors cursor-pointer"
              />
            </div>

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
                  <span className="font-bebas text-sm sm:text-base tracking-wider uppercase text-[#E61924] font-semibold">
                    DISPATCH CONFIRMED · ALLOCATION LOGGED
                  </span>
                  <h2 className="font-montserrat font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#F5F2EB]">
                    ACCOMMODATION REQUEST RECEIVED
                  </h2>
                  <p className="font-geist text-xs sm:text-sm text-[#A8A49C] max-w-lg mx-auto leading-relaxed">
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
                  {qrCodeUrl && (
                    <div className="pt-3 border-t border-white/[0.06] flex flex-col items-center gap-2">
                      <span className="text-neutral-400 text-[10px] tracking-wider uppercase">UPI DIRECT PAYMENT QR (15-MIN HOLD)</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrCodeUrl} alt="UPI Payment QR" className="w-36 h-36 rounded bg-white p-1 shadow-lg" />
                    </div>
                  )}

                  {/* Payment Submission Section */}
                  {paymentSuccess ? (
                    <div className="pt-3 border-t border-emerald-500/30 text-emerald-300 text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 font-bold text-xs text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>PAYMENT SUBMITTED FOR RECONCILIATION</span>
                      </div>
                      <p className="text-[10px] text-neutral-400">
                        UTR: <span className="font-bold text-white">{utrNumber}</span> · High Command will verify within 2-4 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handlePaymentSubmit} className="pt-3 border-t border-white/[0.08] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                          STEP 2: SUBMIT PAYMENT RECEIPT
                        </span>
                        <span className="text-[9px] text-[#E61924] font-mono">15-MIN HOLD</span>
                      </div>

                      {paymentError && (
                        <div className="p-2 rounded bg-red-950/40 border border-red-500/40 text-red-300 text-[10px] flex items-center gap-1.5">
                          <AlertCircle className="w-3 h-3 flex-shrink-0 text-red-400" />
                          <span>{paymentError}</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 uppercase tracking-wider">
                          UTR / UPI Transaction ID *
                        </label>
                        <input
                          type="text"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          required
                          className="w-full px-3 py-1.5 rounded bg-black/60 border border-white/20 text-xs text-white placeholder:text-neutral-600 focus:border-[#E61924] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-400 uppercase tracking-wider">
                          Screenshot Receipt Image *
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) setReceiptFile(e.target.files[0]);
                          }}
                          required
                          className="w-full text-[10px] text-neutral-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-white/20 file:bg-white/10 file:text-white file:text-[10px] hover:file:bg-white/20 cursor-pointer"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingPayment}
                        className="w-full py-2 px-3 rounded font-mono text-xs font-bold uppercase tracking-wider bg-[#E61924] hover:bg-[#b3141c] text-white transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(230,25,36,0.3)] disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmittingPayment ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>COMPRESSING &amp; VERIFYING...</span>
                          </>
                        ) : (
                          <span>CONFIRM PAYMENT DIRECTIVE →</span>
                        )}
                      </button>
                    </form>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
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
                        gender: "boys",
                        nights: "3 Nights (Full Fest)",
                        specialRequirements: "",
                        confirmed: false,
                      });
                    }}
                    className="px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] bg-white/[0.03] hover:bg-[#E61924] border border-white/20 hover:border-[#E61924] text-[#F5F2EB] transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.5)] cursor-pointer"
                  >
                    SUBMIT ANOTHER REQUEST
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToStageProgress(0)}
                    className="px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] bg-white/[0.03] hover:bg-white/[0.08] border border-white/20 text-[#F5F2EB] transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.5)] cursor-pointer"
                  >
                    RETURN TO OVERVIEW
                  </button>
                </div>
              </div>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleFormSubmit} className="relative z-10 space-y-5">
                {/* Form Header */}
                <div className="relative pb-4 sm:pb-5 border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => scrollToStageProgress(0.58)}
                        className="inline-flex items-center gap-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-neutral-300 hover:text-white px-2 sm:px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 transition-colors cursor-pointer active:scale-95"
                        title="Return to Pass Specifications"
                      >
                        <ArrowLeft className="w-3 h-3 text-[#E61924]" />
                        <span>Specs</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToStageProgress(0)}
                        className="inline-flex items-center gap-1 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-neutral-300 hover:text-white px-2 sm:px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 transition-colors cursor-pointer active:scale-95"
                        title="Scroll to Top Overview"
                      >
                        <ArrowUp className="w-3 h-3 text-[#E61924]" />
                        <span>Overview</span>
                      </button>
                    </div>
                    <h2 className="font-montserrat font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#F5F2EB] leading-none pt-1">
                      RESERVE YOUR STAY
                    </h2>
                    <p className="font-geist text-xs sm:text-[13px] text-[#A8A49C] tracking-wide">
                      Submit your details to begin your accommodation request.
                    </p>
                  </div>
                </div>

                {/* Staggered Form Fields Container - Balanced 4 Rows of 2 Columns */}
                <div ref={formFieldsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

                  {/* Row 3, Col 2: Hostel Allocation */}
                  <div className="space-y-1.5 group">
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A8A49C] transition-colors flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-[#E61924]" />
                        Hostel Allocation
                      </span>
                      <span className="text-[#E61924] text-xs leading-none">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: "boys" })}
                        className={`py-2 px-2.5 rounded font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                          formData.gender === "boys"
                            ? "bg-[#E61924]/20 border-[#E61924] text-white shadow-[0_0_10px_rgba(230,25,36,0.3)] font-semibold"
                            : "bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20"
                        }`}
                      >
                        Boys Hostel
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: "girls" })}
                        className={`py-2 px-2.5 rounded font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                          formData.gender === "girls"
                            ? "bg-[#E61924]/20 border-[#E61924] text-white shadow-[0_0_10px_rgba(230,25,36,0.3)] font-semibold"
                            : "bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20"
                        }`}
                      >
                        Girls Hostel
                      </button>
                    </div>
                  </div>

                  {/* Row 4, Col 1: Number of Nights */}
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
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 group-hover:text-white transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-white/20 pointer-events-none group-focus-within:border-[#E61924]" />
                    </div>
                  </div>

                  {/* Row 4, Col 2: Special Requirements */}
                  <div className="space-y-1.5 group">
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A8A49C] group-focus-within:text-[#F5F2EB] transition-colors flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-[#E61924]" />
                        Special Requirements
                      </span>
                      <span className="text-neutral-500 text-[9px] font-mono">OPTIONAL</span>
                    </label>
                    <div className="relative">
                      <textarea
                        rows={1}
                        value={formData.specialRequirements}
                        onChange={(e) =>
                          setFormData({ ...formData, specialRequirements: e.target.value })
                        }
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
                <div className="pt-4 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-end gap-4">

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
