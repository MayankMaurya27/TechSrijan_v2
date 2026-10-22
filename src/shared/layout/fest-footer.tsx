"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { usePageTheme } from "@/core";

/* Social Icon SVGs */
function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31c-.82-1.31-1.26-2.83-1.26-4.38 0-4.54 3.7-8.24 8.24-8.24m4.52 11.59c-.25-.12-1.47-.72-1.7-.81-.23-.09-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.06 0 1.21.88 2.39 1 2.56.12.17 1.74 2.66 4.21 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.13-.22-.19-.47-.32" />
    </svg>
  );
}

export function FestFooter({ className = "" }: { className?: string }) {
  const pageTheme = usePageTheme();

  return (
    <footer className={`relative w-full overflow-hidden bg-[#07060a] ${className}`}>
      {/* Full-Frame Background Artwork */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/contact/contact-bg-citadel.webp"
          alt="Panoramic sunset desert canyon and glowing citadel towers"
          fill
          sizes="100vw"
          className="object-cover object-center w-full h-full filter contrast-[1.05] brightness-75 opacity-40"
        />

        {/* Deep dark gradient on left for crystal-clear navigation legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07060a] via-[#07060a]/90 to-[#07060a]/95" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07060a] to-transparent" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-20 pt-20 sm:pt-28 pb-10">
        {/* Main 4-Column Navigation Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b transition-colors duration-300"
          style={{ borderColor: pageTheme.border }}
        >
          {/* Col 1: Brand & Socials (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <Link href="/" className="inline-flex items-center gap-2 group">
                <span className="font-montserrat font-black text-2xl sm:text-3xl tracking-wider text-white uppercase">
                  TECH<span style={{ color: pageTheme.accent }} className="text-xl inline-block -translate-y-0.5 transition-colors duration-300">✳</span>SRIJAN
                </span>
              </Link>
              <div
                className="font-bebas text-sm tracking-[0.25em] uppercase mt-1 transition-colors duration-300"
                style={{ color: pageTheme.accent }}
              >
                IMPERIUM : REQUIEM
              </div>
            </div>

            <p className="text-base text-zinc-300 font-chancery leading-relaxed max-w-sm">
              A confluence of ideas, innovation and impact. Building a tomorrow that dares to be different.
            </p>

            {/* Social Icons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {[
                  {
                    icon: IconInstagram,
                    label: "Instagram",
                    href: "https://www.instagram.com/techsrijan_mmmut",
                  },
                  {
                    icon: IconWhatsApp,
                    label: "WhatsApp Channel",
                    href: "https://whatsapp.com/channel/0029VbBGctj1Hsq0KeSlRl0G",
                  },
                  {
                    icon: IconLinkedin,
                    label: "LinkedIn",
                    href: "https://www.linkedin.com/company/techsrijan-mmmut/",
                  },
                  {
                    icon: IconX,
                    label: "X",
                    href: "https://x.com/TechSrijan_Fest",
                  },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 border border-white/15 text-zinc-300 hover:scale-105 transition-all"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
              <div className="font-bebas text-xs tracking-[0.25em] text-zinc-400 uppercase">
                FOLLOW OUR JOURNEY
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div
              className="flex items-center gap-2 font-bebas text-base tracking-[0.2em] uppercase transition-colors duration-300"
              style={{ color: pageTheme.accent }}
            >
              <span>✦</span>
              <span>QUICK LINKS</span>
            </div>
            <ul className="space-y-2.5 text-sm font-geist text-zinc-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">Events</Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors">Team</Link>
              </li>
              <li>
                <Link href="/sponsors" className="hover:text-white transition-colors">Sponsors</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Get In Touch (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div
              className="flex items-center gap-2 font-bebas text-base tracking-[0.2em] uppercase transition-colors duration-300"
              style={{ color: pageTheme.accent }}
            >
              <span>✦</span>
              <span>GET IN TOUCH</span>
            </div>
            
            <div className="space-y-2 text-sm font-geist text-zinc-300">
              <a
                href="mailto:techsrijan@mmmut.ac.in"
                className="flex items-center gap-2.5 hover:text-white transition-colors group"
                style={{ color: pageTheme.accent }}
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span className="font-medium underline underline-offset-4 group-hover:decoration-white">
                  techsrijan@mmmut.ac.in
                </span>
              </a>
              <p className="text-xs text-zinc-400 leading-relaxed">
                For general queries and collaborations.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                Stay connected for updates, announcements and more.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div>
            © 2026 TechSrijan. All Rights Reserved.
          </div>

          {/* Central Imperial Winged Crest Marker */}
          <div className="hidden md:flex items-center gap-4 transition-colors duration-300" style={{ color: pageTheme.accent }}>
            <div
              className="h-px w-20"
              style={{
                background: `linear-gradient(to right, transparent, ${pageTheme.accent})`,
              }}
            />
            <span className="text-sm font-serif">❖</span>
            <div
              className="h-px w-20"
              style={{
                background: `linear-gradient(to left, transparent, ${pageTheme.accent})`,
              }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-zinc-400 font-medium">
            <span>Website Powered By MMMUT RESO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
