import type { Metadata } from "next";
import Link from "next/link";
import { SignInRouteModal } from "@/domains/auth";

export const metadata: Metadata = {
  title: "Account Access · Sign In / Sign Up | TechSrijan'27",
  description:
    "Choose your sign-in route for TechSrijan'27. Access MMMUT student portal or sign in with Google.",
};

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#050303] text-[#f8eed9] overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6">
      {/* ========================================================
          ATMOSPHERIC BACKDROP (Matching Reference Image)
          - Crimson red moon & citadel on right
          - Grand editorial typography on left
          - Darkened vignette overlays
          ======================================================== */}
      {/* Background Image: Red Moon & Imperial Landscape */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <picture className="w-full h-full">
          <source srcSet="/images/redmoon1.png" type="image/png" />
          <img
            src="/images/redmoon1.png"
            alt="Red Moon Atmosphere"
            className="w-full h-full object-cover object-center opacity-40 filter brightness-75 contrast-125"
            draggable={false}
          />
        </picture>
        {/* Dark Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/85" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/90" />
      </div>

      {/* Atmospheric Left Editorial Typography (Faint in background like screenshot) */}
      <div className="absolute left-6 sm:left-12 lg:left-20 top-1/2 -translate-y-1/2 z-[1] pointer-events-none opacity-20 hidden md:block select-none">
        <span className="font-bebas text-sm sm:text-base tracking-[0.35em] text-[#caa462] uppercase block mb-1">
          GORAKHPUR
        </span>
        <h1 className="font-montserrat text-7xl lg:text-9xl font-black tracking-tight text-white leading-none">
          FESTIVAL
        </h1>
        <p className="font-chancery italic text-xl sm:text-2xl text-neutral-300 mt-2 tracking-wide">
          TechSrijan &apos;27
        </p>
      </div>

      {/* ========================================================
          CENTER SIGN-IN ROUTE MODAL CHASSIS
          ======================================================== */}
      <div className="relative z-10 w-full max-w-[840px] my-auto">
        <SignInRouteModal isPageMode={true} />
      </div>
    </div>
  );
}
