"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Send,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Crown,
} from "lucide-react";
import { SponsorsInquiryModal } from "./sponsors-inquiry-modal";
import { useTheme, type CanonicalTheme } from "@/core";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";
import { api } from "@/lib/api";
import { FestFooter } from "@/shared/layout/fest-footer";


export const SPONSOR_THEMES = {
  "geass-moon": {
    name: "Geass Moon",
    accent: "#E61E25",
    accentBright: "#FF1E27",
    accentGlow: "rgba(230, 30, 37, 0.75)",
    gold: "#D4AF37",
    goldBright: "#FFE55C",
    robotImage: getOptimizedImageUrl("/images/sponsors/spons_robot.webp", 1200),
    robotWebp: getOptimizedImageUrl("/images/sponsors/spons_robot.webp", 1200),
    robotGlowColor: "#E61E25",
    sigilImage: getOptimizedImageUrl("/images/sponsors/3-sigil.webp", 800),
    sigilWebp: getOptimizedImageUrl("/images/sponsors/3-sigil.webp", 800),
    sigilGlowDrop: "drop-shadow-[0_0_70px_rgba(230,30,37,0.95)]",
    curtainAmbientGlow1: "#E61E25",
    curtainAmbientGlow2: "#D4AF37",
    laserLineGradient: "via-[#E61E25]",
    laserLineShadow: "shadow-[0_0_25px_#E61E25]",
    emberColors: ["#E61E25", "#FF1E27", "#D4AF37"],
    arrowColor: "#E61E25",
    cardHoverBorder: "hover:border-[#E61E25]/50",
    ctaGradient: "bg-gradient-to-r from-[#990000] to-[#E61E25] hover:from-[#B30000] hover:to-[#FF1E27]",
    ctaBorder: "border-[#E61E25]/60",
    ctaShadow: "shadow-[0_0_25px_rgba(230,30,37,0.4)]",
    liaisonsBadgeBorder: "border-[#D4AF37]/30",
    liaisonsBadgeBg: "bg-[#D4AF37]/10",
    liaisonsBadgeText: "text-[#D4AF37]",
    liaisonsCardHoverBorder: "hover:border-[#D4AF37]/50",
    liaisonsCardBg: "from-[#120709]/90 to-[#070304]/95",
    liaisonsCardBorder: "border-red-950/40",
    secretariatBg: "bg-[#0C0608]",
    liaisonsPrimaryBtn: "bg-[#E61E25] hover:bg-[#ff2b33] text-white shadow-[0_0_20px_rgba(230,30,37,0.35)]",
    brochureBorder: "border-[#D4AF37]/40",
    brochureBg: "bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20",
    brochureText: "text-[#D4AF37]",
  },
  "arrakis-day": {
    name: "Arrakis Day",
    accent: "#F59E0B",
    accentBright: "#FBBF24",
    accentGlow: "rgba(245, 158, 11, 0.75)",
    gold: "#FDE68A",
    goldBright: "#FFFBEB",
    robotImage: getOptimizedImageUrl("/images/sponsors/spons_robot_arrakis.webp", 1200),
    robotWebp: getOptimizedImageUrl("/images/sponsors/spons_robot_arrakis.webp", 1200),
    robotGlowColor: "#F59E0B",
    sigilImage: getOptimizedImageUrl("/images/sponsors/3-sigil_arrakis.webp", 800),
    sigilWebp: getOptimizedImageUrl("/images/sponsors/3-sigil_arrakis.webp", 800),
    sigilGlowDrop: "drop-shadow-[0_0_70px_rgba(245,158,11,0.95)]",
    curtainAmbientGlow1: "#F59E0B",
    curtainAmbientGlow2: "#FBBF24",
    laserLineGradient: "via-[#F59E0B]",
    laserLineShadow: "shadow-[0_0_25px_#F59E0B]",
    emberColors: ["#F59E0B", "#FBBF24", "#FDE68A"],
    arrowColor: "#F59E0B",
    cardHoverBorder: "hover:border-[#F59E0B]/50",
    ctaGradient: "bg-gradient-to-r from-[#B45309] to-[#F59E0B] hover:from-[#D97706] hover:to-[#FBBF24]",
    ctaBorder: "border-[#F59E0B]/60",
    ctaShadow: "shadow-[0_0_25px_rgba(245,158,11,0.4)]",
    liaisonsBadgeBorder: "border-[#F59E0B]/30",
    liaisonsBadgeBg: "bg-[#F59E0B]/10",
    liaisonsBadgeText: "text-[#F59E0B]",
    liaisonsCardHoverBorder: "hover:border-[#F59E0B]/50",
    liaisonsCardBg: "from-[#140E06]/90 to-[#080503]/95",
    liaisonsCardBorder: "border-amber-950/40",
    secretariatBg: "bg-[#0E0905]",
    liaisonsPrimaryBtn: "bg-[#F59E0B] hover:bg-[#FBBF24] text-black font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.35)]",
    brochureBorder: "border-[#FBBF24]/40",
    brochureBg: "bg-[#FBBF24]/10 hover:bg-[#FBBF24]/20",
    brochureText: "text-[#FBBF24]",
  },
  "krelln-night": {
    name: "Krelln Night",
    accent: "#D7DBE2",
    accentBright: "#FFFFFF",
    accentGlow: "rgba(215, 219, 226, 0.70)",
    gold: "#94A3B8",
    goldBright: "#E2E8F0",
    robotImage: getOptimizedImageUrl("/images/sponsors/spons_robot_krelln.webp", 1200),
    robotWebp: getOptimizedImageUrl("/images/sponsors/spons_robot_krelln.webp", 1200),
    robotGlowColor: "#CBD5E1",
    sigilImage: getOptimizedImageUrl("/images/sponsors/3-sigil_krelln.webp", 800),
    sigilWebp: getOptimizedImageUrl("/images/sponsors/3-sigil_krelln.webp", 800),
    sigilGlowDrop: "drop-shadow-[0_0_70px_rgba(215,219,226,0.90)]",
    curtainAmbientGlow1: "#CBD5E1",
    curtainAmbientGlow2: "#778292",
    laserLineGradient: "via-[#D7DBE2]",
    laserLineShadow: "shadow-[0_0_25px_#D7DBE2]",
    emberColors: ["#FFFFFF", "#D7DBE2", "#CBD5E1", "#94A3B8"],
    arrowColor: "#D7DBE2",
    cardHoverBorder: "hover:border-[#D7DBE2]/50",
    ctaGradient: "bg-gradient-to-r from-[#CBD5E1] via-[#E2E8F0] to-[#FFFFFF] text-black font-extrabold hover:from-[#FFFFFF] hover:to-[#E2E8F0]",
    ctaBorder: "border-[#D7DBE2]/70",
    ctaShadow: "shadow-[0_0_25px_rgba(215,219,226,0.35)]",
    liaisonsBadgeBorder: "border-[#D7DBE2]/30",
    liaisonsBadgeBg: "bg-[#D7DBE2]/10",
    liaisonsBadgeText: "text-[#D7DBE2]",
    liaisonsCardHoverBorder: "hover:border-[#D7DBE2]/50",
    liaisonsCardBg: "from-[#14171B]/90 to-[#0A0C0E]/95",
    liaisonsCardBorder: "border-slate-800/60",
    secretariatBg: "bg-[#0F1215]",
    liaisonsPrimaryBtn: "bg-[#D7DBE2] hover:bg-[#FFFFFF] text-black font-extrabold shadow-[0_0_20px_rgba(215,219,226,0.35)]",
    brochureBorder: "border-[#94A3B8]/40",
    brochureBg: "bg-[#94A3B8]/10 hover:bg-[#94A3B8]/20",
    brochureText: "text-[#CBD5E1]",
  },
} as const;

// ─── TYPES & DATA MODELS ──────────────────────────────────────────────
export interface Sponsor {
  id: string;
  name: string;
  tier: "Title Partner" | "Gold Partner" | "Silver Partner" | "Associate Partner" | "Supporting Partner" | "Strategic Partner";
  role: "KING" | "QUEEN" | "ROOK" | "BISHOP" | "KNIGHT" | "PAWN";
  pieceImg: string;
  pieceName: string;
  logoType: "nova" | "aether" | "quantum" | "gridline" | "skyward" | "custom";
  logoUrl?: string | null;
  websiteUrl?: string | null;
  customLogoText?: string;
  accent: string;
  borderGlow: string;
  rankWeight: number; // 5 = King, 4 = Queen, 3 = Rook, 2 = Knight/Bishop, 1 = Pawn
}


const PARTNERSHIP_COLUMNS = [
  {
    numeral: "I",
    number: "01",
    title: "LIVE EXPERIENCES",
    icon: "knight",
    items: [
      {
        title: "EDM Night Sponsor",
        desc: "Prime visual immersion during flagship star night concerts",
      },
      {
        title: "Main Stage Partner",
        desc: "Continuous brand presence on the main amphitheatre arena",
      },
      {
        title: "Artist & Guest Partner",
        desc: "Direct brand association with celebrity performers & keynotes",
      },
      {
        title: "Championship Track Sponsor",
        desc: "Prominent arena branding and presentation for flagship competitions",
      },
    ],
  },
  {
    numeral: "II",
    number: "02",
    title: "CAMPUS PRESENCE",
    icon: "rook",
    items: [
      {
        title: "Beverage & Hospitality",
        desc: "Exclusive distribution & refreshment lounges across campus",
      },
      {
        title: "Official Merchandise",
        desc: "Co-branded badges, hoodies, lanyards, and welcome kits",
      },
      {
        title: "Technical Infrastructure",
        desc: "Cloud credits, hardware dev-kits, and compute clusters",
      },
      {
        title: "Mobility Partner",
        desc: "Official transit and campus commute logistics partner",
      },
    ],
  },
  {
    numeral: "III",
    number: "03",
    title: "DIGITAL & CULTURE",
    icon: "bishop",
    items: [
      {
        title: "Digital Platform Partner",
        desc: "Interactive in-app sponsor booths and virtual passes",
      },
      {
        title: "Social Media Partner",
        desc: "Viral campaigns, creator collaborations & reels series",
      },
      {
        title: "Photography & Film",
        desc: "Watermarked official festival recap reels & galleries",
      },
      {
        title: "Innovation Grant",
        desc: "Direct cash awards & pre-seed incubation support",
      },
    ],
  },
];


// ─── CHESS & EDITORIAL GLYPHS FOR IMAGE 4 ─────────────────────────────
function HeraldicKnightIcon({ className = "w-4 h-4 text-[#D4AF37]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 21H5v-2h14v2zm-1.5-4H6.5v-2c0-.6.4-1 1-1h1c0-1.7 1.3-3 3-3V9c0-1.7-1.3-3-3-3-.4 0-.8.1-1.1.3L6.2 4.1C6.9 3.4 8 3 9.2 3c3 0 5.4 2.2 5.7 5.1.7.3 1.3.8 1.8 1.4 1.2 1.6 1.4 3.7.8 5.5l-.2.7c-.1.5-.5.9-1 .9h-.8v.4z" />
    </svg>
  );
}

function ChessRookIcon({ className = "w-4 h-4 text-[#D4AF37]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M5 20h14v2H5v-2zm1-3h12v-2l-1.5-1.5V9.5h1V5h-2.5v2h-2V5h-2v2h-2V5H6.5v4.5h1V13.5L6 15v2zm2.5-3.5V9.5h7v4h-7z" />
    </svg>
  );
}

function ChessBishopIcon({ className = "w-4 h-4 text-[#D4AF37]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5c0 .3-.1.6-.3.8A5.5 5.5 0 0 1 17 9.5c0 2.2-1.3 4.1-3.2 5V17h3v2H7.2v-2h3v-2.5C8.3 13.6 7 11.7 7 9.5a5.5 5.5 0 0 1 3.8-5.2 1.5 1.5 0 0 1 1.2-2.3zm-.5 4.5v2H9.5v1h2v3h1v-3h2v-1h-2v-2h-1zM5 20h14v2H5v-2z" />
    </svg>
  );
}

function ThemeArrowIcon({ className = "w-3.5 h-3.5", color = "#E61E25" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={color} className={className}>
      <path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.7 12l-8.85-7.85-1.42 1.42L16.86 11H5v2z" />
    </svg>
  );
}

// ─── GEASS ICON & LOGO GLYPHS ─────────────────────────────────────────
function GeassBirdSigil({ className = "w-5 h-5", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} style={style}>
      <path d="M50 15 C52 28 58 38 68 44 C58 46 52 52 50 65 C48 52 42 46 32 44 C42 38 48 28 50 15 Z" />
      <path d="M50 35 C58 20 75 18 85 24 C75 32 68 45 66 58 C62 50 56 42 50 35 Z" />
      <path d="M50 35 C42 20 25 18 15 24 C25 32 32 45 34 58 C38 50 44 42 50 35 Z" />
      <path d="M50 65 L46 90 L50 85 L54 90 Z" />
    </svg>
  );
}

// Logo graphics matching Image 1
function SponsorLogoGraphic({
  type,
  logoUrl,
  className = "w-8 h-8",
}: {
  type: Sponsor["logoType"];
  logoUrl?: string | null;
  className?: string;
}) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Sponsor Logo"
        className={`${className} object-contain rounded-full`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  switch (type) {
    case "nova":
      return (
        <svg viewBox="0 0 60 40" fill="none" className={className}>
          <path d="M12 34 L26 8 L34 22 L48 8 L36 34 L28 18 Z" fill="#E5C158" />
        </svg>
      );
    case "aether":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <path d="M20 6 L34 32 L26 32 L20 18 L14 32 L6 32 Z" fill="#38BDF8" />
        </svg>
      );
    case "quantum":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <circle cx="20" cy="18" r="10" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M26 24 L32 32" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "gridline":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <path d="M10 12 L20 6 L30 12 L30 24 L20 30 L10 24 Z" stroke="#E61E25" strokeWidth="3" fill="#E61E25" fillOpacity="0.15" />
          <path d="M16 16 L20 13 L24 16 L24 22 L20 25 L16 22 Z" fill="#E61E25" />
        </svg>
      );
    case "skyward":
      return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
          <path d="M28 10 L14 10 L10 18 L24 20 L28 24 L26 30 L12 30" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center font-mono text-[10px] text-white">
          TS
        </div>
      );
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────
export function SponsorsPageView() {
  const { resolvedTheme } = useTheme();
  const currentTheme: CanonicalTheme = resolvedTheme || "geass-moon";
  const t = SPONSOR_THEMES[currentTheme] || SPONSOR_THEMES["geass-moon"];

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [activeSponsor, setActiveSponsor] = useState<string>("");
  const [isLoadingSponsors, setIsLoadingSponsors] = useState(true);


  // Mouse Parallax Springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 45, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 28 });

  // Scroll Progress across entire page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Hero section scroll progress
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax on hero layers
  const cityBgY = useTransform(heroScrollProgress, [0, 1], ["0%", "12%"]);
  const robotScrollY = useTransform(heroScrollProgress, [0, 1], ["0%", "-6%"]);
  const heroOpacity = useTransform(heroScrollProgress, [0.65, 0.95], [1, 0.2]);

  // Subtle 3D mouse shifts
  const mouseParallaxRobotX = useTransform(springX, (v) => v * -0.5);
  const mouseParallaxRobotY = useTransform(springY, (v) => v * -0.3);
  const mouseParallaxBgX = useTransform(springX, (v) => v * 0.2);
  const mouseParallaxBgY = useTransform(springY, (v) => v * 0.2);

  // ─── TRANSITION EYE SIGIL (Image 2 - Fixed overlay on scroll, zero page gap) ───
  // Blackout curtain turns screen pitch black so NO background shows through!
  // Fast & snappy transition window: passes quickly on mobile in 1 flick without lingering lag!
  const curtainOpacity = useTransform(scrollYProgress, [0.03, 0.07, 0.18, 0.22], [0, 1, 1, 0]);
  const sigilOpacity = useTransform(scrollYProgress, [0.04, 0.08, 0.17, 0.21], [0, 1, 1, 0]);
  const sigilScale = useTransform(scrollYProgress, [0.04, 0.12, 0.21], [0.85, 1.1, 1.35]);
  const sigilRotate = useTransform(scrollYProgress, [0.04, 0.21], [-3, 3]);
  const sigilBlur = useTransform(scrollYProgress, [0.04, 0.08, 0.17, 0.21], [8, 0, 0, 10]);
  const sigilFilter = useTransform(sigilBlur, (b) => `blur(${b}px)`);

  // Robot Incoming Entrance Animation State
  const [robotSpawned, setRobotSpawned] = useState(false);

  // Modal State
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    const timer = setTimeout(() => {
      setRobotSpawned(true);
    }, 150);

    api.sponsors
      .list()
      .then((backendSponsors) => {
        if (backendSponsors && backendSponsors.length > 0) {
          const mapped: Sponsor[] = backendSponsors.map((bs, idx) => {
            const pieceIdx = (idx % 6) + 1;
            const tierName =
              bs.category === "TITLE"
                ? "Title Partner"
                : bs.category === "POWERED_BY"
                ? "Gold Partner"
                : bs.category === "ASSOCIATE"
                ? "Associate Partner"
                : bs.category === "MEDIA"
                ? "Supporting Partner"
                : "Strategic Partner";

            const role: Sponsor["role"] =
              bs.category === "TITLE"
                ? "KING"
                : bs.category === "POWERED_BY"
                ? "QUEEN"
                : bs.category === "ASSOCIATE"
                ? "ROOK"
                : idx % 2 === 0
                ? "KNIGHT"
                : "PAWN";

            const accent =
              bs.category === "TITLE"
                ? "#FFE600"
                : bs.category === "POWERED_BY"
                ? "#F59E0B"
                : bs.category === "ASSOCIATE"
                ? "#EF4444"
                : "#38BDF8";

            const borderGlow =
              bs.category === "TITLE"
                ? "rgba(255, 230, 0, 1)"
                : bs.category === "POWERED_BY"
                ? "rgba(245, 158, 11, 0.95)"
                : bs.category === "ASSOCIATE"
                ? "rgba(239, 68, 68, 0.95)"
                : "rgba(56, 189, 248, 0.95)";

            const rankWeight =
              bs.category === "TITLE"
                ? 5
                : bs.category === "POWERED_BY"
                ? 4
                : bs.category === "ASSOCIATE"
                ? 3
                : 2;

            return {
              id: bs.id,
              name: bs.name.toUpperCase(),
              tier: tierName as Sponsor["tier"],
              role,
              pieceImg: getOptimizedImageUrl(`/images/sponsors/cp-${pieceIdx}.webp`, 400),
              pieceName: role,
              logoType: "custom" as const,
              logoUrl: bs.logoUrl || null,
              websiteUrl: bs.websiteUrl || null,
              customLogoText: bs.name,
              accent,
              borderGlow,
              rankWeight,
            };
          });
          setSponsors(mapped);
          if (mapped[0]) setActiveSponsor(mapped[0].id);
        } else {
          setSponsors([]);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch DB sponsors:", err);
        setSponsors([]);
      })
      .finally(() => {
        setIsLoadingSponsors(false);
      });

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 24;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);


  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#050202] text-white selection:bg-[#E61E25] selection:text-white overflow-x-hidden"
    >
      {/* ========================================================
          TRANSITION LENS OVERLAY (IMAGE 2 - EYE SIGIL)
          - Opaque Blackout Curtain hides the hero and upcoming content completely!
          - The Geass Awakening Sigil awakens inside the pure dark void in theme color!
          ======================================================== */}
      {mounted && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden will-change-[opacity]"
          style={{
            opacity: curtainOpacity,
          }}
        >
          {/* Pure Pitch Black Void Curtain (Hides all background, robot, circles, text completely!) */}
          <div className="absolute inset-0 bg-[#050202]" />

          {/* Ambient Theme Shockwave Glow (Desktop: lush blur, Mobile: lightweight radial gradient for 60fps) */}
          <div
            className="hidden sm:block absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full blur-[150px] opacity-40 transition-colors duration-500 pointer-events-none"
            style={{ backgroundColor: t.curtainAmbientGlow1 }}
          />
          <div
            className="hidden sm:block absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full blur-[100px] opacity-25 transition-colors duration-500 pointer-events-none"
            style={{ backgroundColor: t.curtainAmbientGlow2 }}
          />
          <div
            className="sm:hidden absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${t.curtainAmbientGlow1} 0%, transparent 70%)`,
            }}
          />

          {/* Central Horizontal Laser Horizon Line */}
          <div
            className="absolute inset-x-0 h-[1.5px] transition-all duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)`,
              boxShadow: `0 0 25px ${t.accent}`,
            }}
          />

          {/* The Geass Red Eye Sigil Artwork (Theme Responsive & Mobile Optimized) */}
          <motion.div
            className="relative w-[280px] h-[280px] sm:w-[480px] sm:h-[480px] md:w-[620px] md:h-[620px] select-none will-change-transform"
            style={{
              opacity: sigilOpacity,
              scale: sigilScale,
              rotate: sigilRotate,
              filter: isMobile ? undefined : sigilFilter,
            }}
          >
            <picture className="w-full h-full">
              <source srcSet={t.sigilWebp} type="image/webp" />
              <img
                src={t.sigilImage}
                alt="Geass Awakening Sigil"
                className={`w-full h-full object-contain mix-blend-screen ${isMobile ? "drop-shadow-[0_0_20px_rgba(230,30,37,0.7)]" : t.sigilGlowDrop}`}
                draggable={false}
              />
            </picture>
          </motion.div>
        </motion.div>
      )}

      {/* ========================================================
          HERO SECTION (IMAGE 1 REPLICA)
          Matches Image 1 precisely:
          - Background: spons_land.png
          - Foreground robot: spons_robot.png
          - Symmetrical circular pedestals with chess pieces on top
          - Editorial typography & Geass sigil
          ======================================================== */}
      <section
        ref={heroRef}
        className="relative w-full h-[100dvh] min-h-[640px] max-h-[1080px] flex flex-col justify-between overflow-hidden bg-black select-none pt-24 sm:pt-28 md:pt-30 lg:pt-[118px] pb-4 sm:pb-6"
      >
        {/* Layer 1: Background Landscape (spons_land.png) */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            x: mouseParallaxBgX,
            y: mouseParallaxBgY,
            translateY: cityBgY,
          }}
        >
          <picture className="w-full h-full">
            <source srcSet={getOptimizedImageUrl("/images/sponsors/spons_land.webp", 1920)} type="image/webp" />
            <img
              src={getOptimizedImageUrl("/images/sponsors/spons_land.webp", 1920)}
              alt="TechSrijan Imperial Citadel"
              className="w-full h-full object-cover object-bottom"
              draggable={false}
            />
          </picture>
          {/* Subtle vignette for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050202]/90 via-transparent to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/15 to-black/60 pointer-events-none" />
        </motion.div>

        {/* Layer 1.5: Spotlight Vignette (Centers focus directly onto Knightmare Mech) */}
        <div
          className="absolute inset-0 z-[11] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 50% 42%, transparent 22%, rgba(0, 0, 0, 0.45) 58%, rgba(2, 1, 2, 0.92) 100%)",
          }}
        />

        {/* Layer 2: Centered Knightmare Mech (spons_robot.png) */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none flex items-end justify-center pb-20 sm:pb-24 md:pb-28 lg:pb-30 xl:pb-32"
          style={{
            x: mouseParallaxRobotX,
            y: mouseParallaxRobotY,
            translateY: robotScrollY,
          }}
        >
          <motion.div
            className="relative w-[300px] sm:w-[420px] md:w-[540px] lg:w-[680px] xl:w-[760px] h-[54vh] sm:h-[62vh] lg:h-[72vh] flex items-end justify-center overflow-hidden"
            style={{
              maskImage: "linear-gradient(to bottom, black 0%, black 68%, transparent 84%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 68%, transparent 84%)",
            }}
            initial={{ y: 90, opacity: 0, scale: 0.92, filter: "brightness(0.2) blur(6px)" }}
            animate={
              robotSpawned
                ? { y: 0, opacity: 1, scale: 1, filter: "brightness(1) blur(0px)" }
                : { y: 90, opacity: 0, scale: 0.92, filter: "brightness(0.2) blur(6px)" }
            }
            transition={{
              duration: 1.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Atmospheric Ground & Cape Rim Glow (Pulses on incoming arrival) */}
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-[30px] rounded-[50%] blur-[35px] transition-colors duration-500"
              style={{ backgroundColor: t.robotGlowColor }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={robotSpawned ? { opacity: [0, 0.45, 0.2], scale: [0.5, 1.15, 1] } : {}}
              transition={{ duration: 1.8, ease: "easeOut" }}
            />
            <picture className="w-full h-full flex items-end justify-center">
              <source srcSet={t.robotWebp} type="image/webp" />
              <img
                src={t.robotImage}
                alt="Knightmare Frame Mech"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]"
                draggable={false}
              />
            </picture>
          </motion.div>
        </motion.div>

        {/* Floating Theme Embers */}
        {mounted && (
          <div className="absolute inset-0 z-[12] pointer-events-none overflow-hidden mix-blend-screen">
            {Array.from({ length: isMobile ? 6 : 22 }).map((_, i) => {
              const size = (i % 3) + 2;
              const left = (i * 4.3 + 7) % 96;
              const top = (i * 6.1 + 18) % 80;
              const emberColor = t.emberColors[i % t.emberColors.length];
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    left: `${left}%`,
                    top: `${top}%`,
                    backgroundColor: emberColor,
                    boxShadow: `0 0 8px ${emberColor}`,
                    willChange: "transform, opacity",
                  }}
                  animate={{
                    y: [0, -25 - (i % 15), 0],
                    x: [0, i % 2 === 0 ? 4 : -4, 0],
                    opacity: [0.15, 0.85, 0.15],
                  }}
                  transition={{
                    duration: 4 + (i % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: (i * 0.2) % 2,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* ========================================================
            TOP HEADER AREA (Precisely matching Image 1)
            - Top Left: TECHSRIJAN '27 // OUR [sigil] // PARTNERS // Subtitle
            - Top Right: STRONGER // TOGETHER // Geass bird sigil
            ======================================================== */}
        <div className="relative z-20 w-full px-6 sm:px-10 lg:px-16 flex items-start justify-between">
          {/* Top Left Title Block */}
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >

            {/* Main Headline: OUR [sigil] PARTNERS (Montserrat Heading) */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="font-montserrat text-[clamp(2.2rem,4.5vw,4.8rem)] font-black leading-[0.92] tracking-tight text-white uppercase drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
                  OUR
                </h1>
                {/* Geass Wing Sigil */}
                <GeassBirdSigil
                  className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 transition-all duration-500"
                  style={{
                    color: t.accent,
                    filter: `drop-shadow(0 0 15px ${t.accent})`,
                  }}
                />
              </div>
              <h1
                className="font-montserrat text-[clamp(2.2rem,4.5vw,4.8rem)] font-black leading-[0.92] tracking-tight uppercase transition-all duration-500"
                style={{
                  color: t.accent,
                  filter: `drop-shadow(0 0 35px ${t.accentGlow})`,
                }}
              >
                PARTNERS
              </h1>
            </div>

            {/* Subtitle Description */}
            <p className="mt-2 text-neutral-300 font-geist text-xs sm:text-sm max-w-sm sm:max-w-md leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              Powering innovation, creativity and a bigger tomorrow with brands who believe in technology and youth.
            </p>
          </motion.div>


        </div>

        {/* ========================================================
            DYNAMIC SPONSOR CIRCLES PEDESTAL LINEUP
            - Circles rendered dynamically from sponsors array
            - Chess pieces mounted right atop the circle rim with crisp white-core neon rim
            - Sized by hierarchy (King slightly larger; very subtle differences)
            - Tight neon glow with white-hot core and controlled spread
            - Responsive swipe / horizontal scroll on mobile
            ======================================================== */}
        <div className="relative z-20 w-full px-1.5 xs:px-2 sm:px-6 lg:px-10 pb-8 sm:pb-16 md:pb-20 lg:pb-24 -translate-y-5 xs:-translate-y-6 sm:-translate-y-4 md:-translate-y-6">
          {/* Subtle Base Dais Shadow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[90%] sm:w-[70%] max-w-3xl h-[20px] sm:h-[24px] rounded-[50%] bg-black/80 blur-md pointer-events-none" />

          {/* The Circular Pedestals Row - Fits all 5 seamlessly on mobile without horizontal scroll */}
          {isLoadingSponsors ? (
            <div className="py-12 sm:py-16 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <p className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
                LOADING ALLOCATED SPONSORS...
              </p>
            </div>
          ) : sponsors.length === 0 ? (
            <div className="py-12 sm:py-16 text-center flex flex-col items-center justify-center gap-2">
              <p className="font-mono text-xs tracking-[0.25em] text-neutral-400 uppercase">
                // DOSSIER OPEN FOR STRATEGIC ALLOCATIONS
              </p>
              <p className="font-sans text-xs text-neutral-500 max-w-sm">
                Official corporate partners and campus brand alliances are currently being finalized.
              </p>
            </div>
          ) : (
            <div className="flex items-end justify-center gap-1 xs:gap-1.5 sm:gap-3.5 md:gap-5 lg:gap-6 xl:gap-7 w-full max-w-full overflow-visible py-2 sm:py-3 px-0.5 sm:px-2 no-scrollbar">
            {sponsors.map((sponsor) => {
              const isKing = sponsor.role === "KING";
              const isQueen = sponsor.role === "QUEEN";
              const isRook = sponsor.role === "ROOK";
              const isSelected = activeSponsor === sponsor.id;

              // Size classes based on rank hierarchy:
              // Mobile (<sm): compact sizes so all 5 circles fit side-by-side on mobile without horizontal scroll!
              // Title Partner (King) stands out noticeably elevated at the top!
              let circleSize = "w-[48px] h-[48px] xs:w-[52px] xs:h-[52px] sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-52 xl:h-52";
              let pieceHeight = "h-7 xs:h-8 sm:h-18 md:h-20 lg:h-24 xl:h-28";
              let hierarchyOffset = "translate-y-1 sm:translate-y-0"; // Outer tiers sit slightly lower

              if (isKing) {
                circleSize = "w-[72px] h-[72px] xs:w-[78px] xs:h-[78px] sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64";
                pieceHeight = "h-13 xs:h-15 sm:h-22 md:h-26 lg:h-30 xl:h-36";
                hierarchyOffset = "-translate-y-3.5 sm:translate-y-0"; // Title Partner elevated noticeably on top!
              } else if (isQueen || isRook) {
                circleSize = "w-[56px] h-[56px] xs:w-[60px] xs:h-[60px] sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-50 lg:h-50 xl:w-56 xl:h-56";
                pieceHeight = "h-9 xs:h-10 sm:h-20 md:h-22 lg:h-26 xl:h-30";
                hierarchyOffset = "-translate-y-0.5 sm:translate-y-0"; // Inner flankers slightly stepped
              }

              // Tight neon glow with white-hot core and minimal color spread
              const neonBoxShadow = isKing
                ? isSelected
                  ? "0 0 3px #FFFFFF, 0 0 8px #FFE600, 0 0 16px rgba(255, 230, 0, 0.6), inset 0 0 6px rgba(255, 255, 255, 0.3)"
                  : "0 0 2px #FFFFFF, 0 0 6px #FFE600, 0 0 12px rgba(255, 230, 0, 0.45), inset 0 0 5px rgba(255, 255, 255, 0.2)"
                : isSelected
                  ? `0 0 3px #FFFFFF, 0 0 8px ${sponsor.accent}, 0 0 16px ${sponsor.accent}80, inset 0 0 5px rgba(255, 255, 255, 0.25)`
                  : `0 0 2px #FFFFFF, 0 0 6px ${sponsor.accent}, 0 0 12px ${sponsor.accent}50, inset 0 0 4px rgba(255, 255, 255, 0.15)`;

              return (
                <motion.div
                  key={sponsor.id}
                  onClick={() => setActiveSponsor(sponsor.id)}
                  className={`group relative flex flex-col items-center shrink-0 cursor-pointer transition-transform duration-300 ${hierarchyOffset} ${
                    isSelected ? "scale-[1.04]" : "hover:scale-[1.02]"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: sponsor.rankWeight * 0.06 }}
                >
                  {/* Top: Chess Piece Standing on Rim with Crisp White-Core Neon Outline */}
                  <div className={`relative ${pieceHeight} flex items-end justify-center -mb-2 sm:-mb-3 z-20 transition-transform duration-300 group-hover:-translate-y-1`}>
                    {/* Subtle, restrained backlight (no wide color spread) */}
                    <div
                      className="absolute -inset-1 rounded-full blur-[4px] sm:blur-[6px] pointer-events-none opacity-30"
                      style={{
                        background: `radial-gradient(circle, #FFFFFF 0%, ${sponsor.accent} 60%, transparent 80%)`,
                      }}
                    />

                    {/* Dark silhouette contrast backing to preserve intricate piece edge definition */}
                    <div className="absolute inset-x-1 sm:inset-x-2 bottom-1 h-4/5 rounded-full bg-black/80 blur-[2px] sm:blur-[4px] pointer-events-none" />

                    <picture className="relative z-10 h-full w-auto flex items-end">
                      <source
                        srcSet={sponsor.pieceImg.replace(".png", ".webp")}
                        type="image/webp"
                      />
                      <img
                        src={sponsor.pieceImg}
                        alt={`${sponsor.tier} ${sponsor.pieceName}`}
                        className="h-full w-auto object-contain transition-all duration-300"
                        style={{
                          filter: isKing
                            ? "drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 5px #FFE600) drop-shadow(0 0 10px rgba(255, 183, 3, 0.45)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.95))"
                            : isQueen
                              ? "drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 5px #FBBF24) drop-shadow(0 0 10px rgba(245, 158, 11, 0.4)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.95))"
                              : isRook
                                ? "drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 5px #7DD3FC) drop-shadow(0 0 10px rgba(56, 189, 248, 0.4)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.95))"
                                : sponsor.role === "KNIGHT"
                                  ? "drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 5px #F87171) drop-shadow(0 0 10px rgba(239, 68, 68, 0.4)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.95))"
                                  : "drop-shadow(0 0 1.5px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 5px #38BDF8) drop-shadow(0 0 10px rgba(6, 182, 212, 0.4)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.95))",
                        }}
                        draggable={false}
                      />
                    </picture>
                  </div>

                  {/* Ribbon / Pill Tier Badge below Chess Piece with Neon Trim */}
                  <div className="z-30 -mb-1.5 sm:-mb-2.5">
                    <div
                      className={`px-1 xs:px-1.5 sm:px-3 py-0.5 rounded-full border ${
                        isKing
                          ? "text-[6px] xs:text-[6.5px] sm:text-[8.5px] md:text-[9.5px]"
                          : "text-[5px] xs:text-[5.5px] sm:text-[8px] md:text-[9px]"
                      } font-mono font-bold tracking-tight sm:tracking-[0.2em] uppercase backdrop-blur-sm sm:backdrop-blur-md transition-all duration-300 whitespace-nowrap`}
                      style={{
                        background: "rgba(8, 6, 6, 0.95)",
                        color: "#FFFFFF",
                        borderColor: sponsor.accent,
                        boxShadow: `0 0 2px #FFFFFF, 0 0 6px ${sponsor.accent}`,
                      }}
                    >
                      <span className="sm:hidden">
                        {isKing
                          ? "TITLE PARTNER"
                          : sponsor.tier === "Associate Partner"
                          ? "ASSOCIATE"
                          : sponsor.tier === "Supporting Partner"
                          ? "SUPPORT"
                          : sponsor.tier === "Gold Partner"
                          ? "GOLD"
                          : sponsor.tier === "Silver Partner"
                          ? "SILVER"
                          : sponsor.tier}
                      </span>
                      <span className="hidden sm:inline">
                        {sponsor.tier}
                      </span>
                    </div>
                  </div>

                  {/* Main Circular Pedestal / Medallion with Crisp White-Core Neon Border */}
                  <div
                    className={`relative ${circleSize} rounded-full flex flex-col items-center justify-center p-1 xs:p-1.5 sm:p-4 select-none transition-all duration-500 overflow-hidden`}
                    style={{
                      background:
                        "radial-gradient(circle at 50% 35%, rgba(24, 20, 18, 0.98) 0%, rgba(10, 8, 8, 1) 60%, rgba(3, 2, 2, 1) 100%)",
                      boxShadow: neonBoxShadow,
                    }}
                  >
                    {/* Glowing Outer Neon Ring with Crisp Bright-White Highlight */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none transition-all duration-300"
                      style={{
                        border: isKing ? "2px solid #FFF8D6" : `1.5px solid ${sponsor.accent}`,
                        boxShadow: `0 0 3px #FFFFFF, 0 0 8px ${sponsor.accent}`,
                      }}
                    />

                    {/* Inset Subtle Rim */}
                    <div
                      className="absolute inset-[2px] sm:inset-[4px] rounded-full pointer-events-none border border-white/20"
                    />

                    {/* Faint Concentric Inlay Circles (Kept on desktop, hidden on tiny mobile circles) */}
                    <div className="hidden sm:block absolute inset-3 rounded-full border border-white/5 pointer-events-none" />
                    <div className="hidden sm:block absolute inset-6 rounded-full border border-white/5 pointer-events-none" />

                    {/* Inner Brand Logo & Name */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-0.5 sm:px-1">
                      {/* Logo Graphic with clean subtle rim */}
                      <div
                        className="mb-0.5 sm:mb-1.5 transition-transform duration-300 group-hover:scale-110"
                        style={{
                          filter: `drop-shadow(0 0 4px ${sponsor.accent})`,
                        }}
                      >
                        <SponsorLogoGraphic
                          type={sponsor.logoType}
                          logoUrl={sponsor.logoUrl}
                          className={
                            isKing
                              ? "w-4 h-4 xs:w-5 xs:h-5 sm:w-9 sm:h-9"
                              : isQueen || isRook
                              ? "w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-7 sm:h-7"
                              : "w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-6 sm:h-6"
                          }
                        />
                      </div>

                      {/* Brand Name */}
                      <span
                        className={`font-mono font-bold tracking-tight xs:tracking-wider uppercase leading-tight line-clamp-2 ${
                          isKing
                            ? "text-[7px] xs:text-[7.5px] sm:text-xs md:text-sm text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
                            : isQueen || isRook
                            ? "text-[5.5px] xs:text-[6px] sm:text-[10px] md:text-xs text-neutral-200"
                            : "text-[5px] xs:text-[5.5px] sm:text-[9px] md:text-xs text-neutral-300"
                        }`}
                      >
                        {sponsor.name}
                      </span>
                    </div>

                    {/* Bottom Rim Highlight */}
                    <div
                      className="absolute bottom-0.5 sm:bottom-1 inset-x-2 sm:inset-x-4 h-[1px] pointer-events-none"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${sponsor.accent}60, transparent)`,
                      }}
                    />
                  </div>

                  {/* Ground Base Subtle Contact Shadow */}
                  <div
                    className="w-[65%] h-1 sm:h-1.5 rounded-[50%] bg-black/90 blur-[2px] mt-0.5 sm:mt-1 pointer-events-none"
                    style={{
                      boxShadow: `0 0 6px ${sponsor.accent}30`,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
          )}
        </div>

        {/* Bottom subtle edge divider */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#050202] to-transparent z-10 pointer-events-none" />
      </section>

      {/* ========================================================
          PARTNERSHIP AVENUES (EXACT REPLICA OF IMAGE 4)
          - Removed Image 1 ("STRATEGIC INTEGRATION" pill)
          - Removed Image 2 ("Flexible & Multi-Tier Bundles" callout card)
          - Removed Image 5 ("TECHSRIJAN '27 • PARTNERSHIPS" eyebrow)
          - Removed chess pieces image as in Image 4 (citadel atmosphere without chess piece)
          - Exact typography: PARTNERSHIP AVENUES ✦
          - Subtitle: "A platform for brands shaping what comes next."
          - Highlights: "15,000+ attendees • Campus-wide reach • Year-round visibility"
          - 3 columns with Roman numerals I, II, III and chess icons (Knight, Rook, Bishop)
          - Bottom bar: "BUILD SOMETHING THAT MATTERS" + "DISCUSS A PARTNERSHIP ↗"
          ======================================================== */}
      <section id="opportunities" className="relative z-30 bg-[#050202] py-20 sm:py-24 px-6 sm:px-10 lg:px-16 border-t border-white/5 overflow-hidden">
        {/* Background Citadel Atmosphere (No chess pieces, subtle dark fog & spires) */}
        <div className="absolute inset-0 pointer-events-none opacity-25 select-none">
          <picture className="w-full h-full">
            <source srcSet={getOptimizedImageUrl("/images/sponsors/spons_land.webp", 1920)} type="image/webp" />
            <img
              src={getOptimizedImageUrl("/images/sponsors/spons_land.webp", 1920)}
              alt=""
              className="w-full h-full object-cover object-bottom"
              draggable={false}
            />
          </picture>
        </div>

        {/* Cinematic Vignette Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050202] via-[#050202]/85 to-[#050202] pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050202]/40 to-[#050202]/95 pointer-events-none" />

        {/* Ambient Theme Light Glow in Center (Desktop only to prevent mobile overdraw) */}
        <div
          className="hidden sm:block absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[160px] opacity-15 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: t.accent }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section Header (Exact Image 4 Replica) */}
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
            {/* Title: PARTNERSHIP AVENUES ✦ (Montserrat Heading) */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <h2 className="font-montserrat text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
                PARTNERSHIP
              </h2>
              <h2
                className="font-montserrat text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight flex items-center gap-2 transition-all duration-500"
                style={{
                  color: t.accent,
                  filter: `drop-shadow(0 0 35px ${t.accentGlow})`,
                }}
              >
                <span>AVENUES</span>
              </h2>
            </div>

            {/* Subtitle (Chancery Italic) */}
            <p className="mt-3 font-sans font-medium text-neutral-300 text-sm sm:text-base md:text-lg tracking-wide not-italic">
              A platform for brands shaping what comes next.
            </p>

            {/* Highlights Metadata Line */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono text-[11px] sm:text-xs tracking-[0.16em] uppercase text-neutral-400">
              <span className="text-neutral-300 font-semibold">15,000+ attendees</span>
              <span style={{ color: t.accent }} className="font-bold">•</span>
              <span className="text-neutral-300 font-semibold">Campus-wide reach</span>
              <span style={{ color: t.accent }} className="font-bold">•</span>
              <span className="text-neutral-300 font-semibold">Year-round visibility</span>
            </div>
          </div>

          {/* Three Column Matrix (Exact Image 4 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {PARTNERSHIP_COLUMNS.map((col) => (
              <div
                key={col.title}
                className={`group relative rounded-none sm:rounded-sm border border-white/10 bg-black/85 sm:bg-black/50 p-6 sm:p-7 backdrop-blur-none sm:backdrop-blur-md ${t.cardHoverBorder} transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between`}
              >
                <div>
                  {/* Column Header */}
                  <div
                    className="flex items-center justify-between pb-3.5 mb-6 border-b transition-colors duration-500"
                    style={{ borderColor: `${t.gold}40` }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Roman Numeral */}
                      <span
                        className="font-bebas text-2xl sm:text-3xl tracking-wider select-none transition-colors duration-500"
                        style={{ color: t.gold }}
                      >
                        {col.numeral}
                      </span>

                      {/* Heraldic / Chess Icon */}
                      <div className="shrink-0 transition-colors duration-500" style={{ color: t.gold }}>
                        {col.icon === "knight" && <HeraldicKnightIcon className="w-4 h-4" />}
                        {col.icon === "rook" && <ChessRookIcon className="w-4 h-4" />}
                        {col.icon === "bishop" && <ChessBishopIcon className="w-4 h-4" />}
                      </div>

                      {/* Title */}
                      <h3
                        className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] transition-colors duration-500"
                        style={{ color: t.gold }}
                      >
                        {col.title}
                      </h3>
                    </div>

                    {/* Numeric Index (01, 02, 03) */}
                    <span
                      className="font-mono text-xs font-bold tracking-wider transition-colors duration-500"
                      style={{ color: `${t.gold}90` }}
                    >
                      {col.number}
                    </span>
                  </div>

                  {/* Column Items */}
                  <div className="space-y-5">
                    {col.items.map((item, i) => (
                      <div key={i} className="group/item flex items-start gap-3">
                        {/* Theme Dynamic Arrow */}
                        <div className="mt-1 shrink-0 group-hover/item:translate-x-1 transition-transform duration-200">
                          <ThemeArrowIcon className="w-3.5 h-3.5" color={t.arrowColor} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white tracking-wide group-hover/item:text-[#FFFFFF] transition-colors leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Divider Bar (Exact Image 4 Replica) */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-6">
            {/* Right Theme CTA Button */}
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className={`group px-7 py-3.5 ${t.ctaGradient} ${t.ctaBorder} ${t.ctaShadow} text-white font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-2.5 active:scale-95 cursor-pointer`}
            >
              <span>DISCUSS A PARTNERSHIP</span>
              <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>



      {/* Standard Fest Footer */}
      <FestFooter />

      {/* ========================================================
          INQUIRY & CONTRACT INITIATION MODAL POPUP
          ======================================================== */}
      <SponsorsInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
      />
    </div>
  );
}
