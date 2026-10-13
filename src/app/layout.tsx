import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Cinzel, Playfair_Display, Bebas_Neue, Geist, Montserrat } from "next/font/google";
import { ThemeProvider, LenisProvider, AuthProvider, cn } from "@/core";
import { SITE_URL } from "@/core/site";
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

const DESCRIPTION =
  "TechSrijan'27 is the annual techfest of MMMUT (Madan Mohan Malaviya University of Technology), Gorakhpur — 25–27 December 2026. Robotics, coding, hackathons, design and management events by the Technical Sub Council with MMMUT RESO, SAE MMMUT, IEEE MMMUT and the Robotics Club.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TechSrijan'27 — Techfest of MMMUT Gorakhpur | 25–27 Dec 2026",
    template: "%s | TechSrijan'27",
  },
  description: DESCRIPTION,
  applicationName: "TechSrijan",
  keywords: [
    "TechSrijan",
    "TechSrijan'27",
    "TechSrijan 2026",
    "TechSrijan MMMUT",
    "MMMUT techfest",
    "techfest MMMUT",
    "MMMUT tech fest",
    "Gorakhpur techfest",
    "techfest in Gorakhpur",
    "technical fest Gorakhpur",
    "tech fest Uttar Pradesh",
    "MMMUT Gorakhpur",
    "Madan Mohan Malaviya University of Technology",
    "TSC MMMUT",
    "Technical Sub Council",
    "MMMUT RESO",
    "SAE MMMUT",
    "IEEE MMMUT",
    "Robotics Club MMMUT",
    "Imperium Requiem",
  ],
  authors: [{ name: "Technical Sub Council (TSC) MMMUT", url: SITE_URL }],
  creator: "Technical Sub Council (TSC) MMMUT",
  publisher: "Madan Mohan Malaviya University of Technology, Gorakhpur",
  category: "education",
  openGraph: {
    title: "TechSrijan'27 — Techfest of MMMUT Gorakhpur",
    description: DESCRIPTION,
    url: "/",
    siteName: "TechSrijan'27",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechSrijan'27 — Techfest of MMMUT Gorakhpur",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  }),
};

const ORG_ID = `${SITE_URL}/#organization`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "TechSrijan",
      alternateName: ["TechSrijan'27", "TechSrijan MMMUT", "MMMUT Techfest"],
      inLanguage: "en-IN",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Technical Sub Council (TSC) MMMUT",
      alternateName: "TechSrijan",
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      email: "techsrijan@mmmut.ac.in",
      parentOrganization: {
        "@type": "CollegeOrUniversity",
        name: "Madan Mohan Malaviya University of Technology",
        alternateName: "MMMUT",
        url: "https://www.mmmut.ac.in",
      },
      subOrganization: [
        { "@type": "Organization", name: "MMMUT RESO" },
        { "@type": "Organization", name: "SAE MMMUT" },
        { "@type": "Organization", name: "IEEE MMMUT" },
        { "@type": "Organization", name: "RC (Robotics Club) MMMUT" },
      ],
    },
    {
      "@type": "Event",
      "@id": `${SITE_URL}/#event`,
      name: "TechSrijan'27 — Imperium: Requiem",
      alternateName: ["TechSrijan 2026", "MMMUT Techfest 2026"],
      description: DESCRIPTION,
      url: SITE_URL,
      image: [`${SITE_URL}/opengraph-image.jpg`],
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
      organizer: { "@id": ORG_ID },
    },
  ],
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
        {/* Automatic Cloudinary -> Vercel Edge failover handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(typeof window==='undefined')return;window.addEventListener('error',function(e){var t=e.target;if(!t||!t.tagName)return;if(t.tagName==='IMG'){var src=t.src||'';if(src.indexOf('res.cloudinary.com')!==-1&&!t.getAttribute('data-cld-fallback')){t.setAttribute('data-cld-fallback','1');var m=src.match(/\\/techsrijan\\/(.+?)(?:\\?.*)?$/);if(m&&m[1]){t.src='/'+m[1];}}}if(t.tagName==='VIDEO'){var vSrc=t.src||t.currentSrc||'';if(vSrc.indexOf('res.cloudinary.com')!==-1&&!t.getAttribute('data-cld-fallback')){t.setAttribute('data-cld-fallback','1');var vm=vSrc.match(/\\/techsrijan\\/videos\\/(.+?\\.mp4)(?:\\?.*)?$/);if(vm&&vm[1]){t.src='/'+vm[1];if(typeof t.load==='function')t.load();}}}},true);})();`,
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
