import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LenisProvider } from "@/components/effects/lenis-provider";
import { AmbientParticles } from "@/components/effects/ambient-particles";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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

export const metadata: Metadata = {
  title: "TechSrijan 2026 — IMPERIUM: REQUIEM | MMMUT",
  description: "Annual Technical Symposium of Madan Mohan Malaviya University of Technology, Gorakhpur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="arrakis" suppressHydrationWarning className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans relative selection:bg-[var(--accent-primary)] selection:text-[var(--bg-primary)]">
        <ThemeProvider>
          <LenisProvider>
            {/* Film Grain Layer */}
            <div className="pointer-events-none fixed inset-0 z-40 film-grain" />

            {/* Ambient Spice / Ember Particles */}
            <AmbientParticles />

            {/* Global Navbar */}
            <Navbar />

            {/* Primary Main Content */}
            <main className="relative z-10 flex min-h-screen flex-col pt-16">
              {children}
            </main>

            {/* Global Footer */}
            <Footer />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
