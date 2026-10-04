import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider, LenisProvider } from "@/core";
import { AmbientParticles, TwinSunsRays, Navbar } from "@/shared";
import "@/styles/globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="en" data-theme="arrakis-day" suppressHydrationWarning className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative selection:bg-[var(--accent-primary)] selection:text-[var(--bg-primary)]">
        <ThemeProvider>
          <LenisProvider>
            <div className="pointer-events-none fixed inset-0 z-40 film-grain" />
            <TwinSunsRays />
            <AmbientParticles />
            <Navbar />
            <main className="relative z-10 flex min-h-screen flex-col pt-16">
              {children}
            </main>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
