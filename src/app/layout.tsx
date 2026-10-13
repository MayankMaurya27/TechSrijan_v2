import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Cinzel, Playfair_Display, Bebas_Neue, Geist, Montserrat } from "next/font/google";
import { ThemeProvider, LenisProvider, AuthProvider, cn } from "@/core";
import { AmbientParticles, TwinSunsRays, Navbar, SwordCursor, TechSrijanPreloader } from "@/shared";

import "@/styles/globals.css";
// Direct file imports (not the @/domains/auth barrel) so framer-motion-heavy auth views stay out of the root bundle
import { AuthModalProvider } from "@/domains/auth/context/auth-modal-context";
import { LazySignInRouteModal } from "@/domains/auth/components/lazy-sign-in-route-modal";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// Used for a single glyph: keep off the critical path
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

// Stays preloaded: it renders hero copy (chancery fallback) and a late swap re-lays out the page (measured ~600ms TBT on /events)
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#4B3629",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://techsrijan.mmmut.ac.in"),
  title: {
    default: "TechSrijan'27 — IMPERIUM: REQUIEM | MMMUT",
    template: "%s | TechSrijan'27",
  },
  description: "Annual Technical Fest of Madan Mohan Malaviya University of Technology, Gorakhpur. Starts 25 Dec. Conducted by Technical Sub Council (TSC) MMMUT — MMMUT RESO, SAE MMMUT, IEEE MMMUT, RC (Robotics Club) MMMUT.",
  keywords: [
    "TechSrijan'27",
    "TechSrijan",
    "TechSrijan 2026",
    "TSC MMMUT",
    "Technical Sub Council",
    "MMMUT Gorakhpur",
    "Technical Fest",
    "MMMUT RESO",
    "SAE MMMUT",
    "IEEE MMMUT",
    "Robotics Club MMMUT",
    "Imperium Requiem",
  ],
  authors: [{ name: "Technical Sub Council (TSC) MMMUT", url: "https://techsrijan.mmmut.ac.in" }],
  creator: "Technical Sub Council (TSC) MMMUT",
  publisher: "Madan Mohan Malaviya University of Technology, Gorakhpur",
  openGraph: {
    title: "TechSrijan'27 — IMPERIUM: REQUIEM | MMMUT",
    description: "Annual Technical Fest of MMMUT Gorakhpur. Starts 25 Dec. Conducted by Technical Sub Council (TSC) MMMUT.",
    url: "https://techsrijan.mmmut.ac.in",
    siteName: "TechSrijan'27",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/TS LOGO NEW.png",
        width: 1200,
        height: 630,
        alt: "TechSrijan'27 — Imperium Requiem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechSrijan'27 — IMPERIUM: REQUIEM",
    description: "Annual Technical Fest of MMMUT Gorakhpur. Starts 25 Dec. Conducted by Technical Sub Council (TSC) MMMUT.",
    creator: "@techsrijan_mmmut",
    images: ["/images/TS LOGO NEW.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "TechSrijan'27 — IMPERIUM: REQUIEM",
  alternateName: "TechSrijan 2026",
  startDate: "2026-12-25T09:00:00+05:30",
  endDate: "2026-12-27T22:00:00+05:30",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "Madan Mohan Malaviya University of Technology",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Deoria Road, Singhariya, Kunraghat",
      addressLocality: "Gorakhpur",
      postalCode: "273010",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
  },
  description: "Annual Technical Fest of Madan Mohan Malaviya University of Technology, Gorakhpur. Conducted by Technical Sub Council (TSC) MMMUT, involving MMMUT RESO, SAE MMMUT, IEEE MMMUT, and RC (Robotics Club) MMMUT. Starts 25 Dec.",
  organizer: {
    "@type": "Organization",
    name: "Technical Sub Council (TSC) MMMUT",
    url: "https://techsrijan.mmmut.ac.in",
    subOrganization: [
      { "@type": "Organization", "name": "MMMUT RESO" },
      { "@type": "Organization", "name": "SAE MMMUT" },
      { "@type": "Organization", "name": "IEEE MMMUT" },
      { "@type": "Organization", "name": "RC (Robotics Club) MMMUT" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="arrakis-day" suppressHydrationWarning className={cn(jetbrainsMono.variable, cinzel.variable, playfairDisplay.variable, bebasNeue.variable, montserrat.variable, geist.variable, "font-sans")}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('techsrijan-theme')||localStorage.getItem('imperium-theme');if(s){s=s.trim().toLowerCase();var t='arrakis-day';if(s==='geass-moon'||s==='giedi-prime'||s==='geass')t='geass-moon';else if(s==='krelln-night'||s==='kelln-night'||s==='krelln')t='krelln-night';document.documentElement.setAttribute('data-theme',t);}}catch(e){}try{document.documentElement.setAttribute('data-intro-played','true');sessionStorage.setItem('techsrijan_intro_video_played','true');}catch(e){}try{if(sessionStorage.getItem('techsrijan_site_booted'))document.documentElement.setAttribute('data-booted','');}catch(e){}})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative selection:bg-[var(--accent-primary)] selection:text-[var(--bg-primary)] overflow-x-hidden">
        <ThemeProvider>
          <AuthProvider>
            <TechSrijanPreloader />
            <AuthModalProvider>
              <LenisProvider>
                <SwordCursor />
                <div className="pointer-events-none fixed inset-0 z-40 film-grain" />
                <TwinSunsRays />
                <AmbientParticles />
                <Navbar />
                <main className="relative z-10 flex min-h-screen flex-col">
                  {children}
                </main>
                <LazySignInRouteModal />
              </LenisProvider>
            </AuthModalProvider>
          </AuthProvider>

        </ThemeProvider>
      </body>
    </html>
  );
}
