"use client";

import { useEffect, useState } from "react";
import { X, Send, ExternalLink, Shield, Check, Copy } from "lucide-react";
import type { Operative } from "../data/team-roster";

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconGithub({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

interface OperativeDossierModalProps {
  operative: Operative | null;
  onClose: () => void;
}

export function OperativeDossierModal({ operative, onClose }: OperativeDossierModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (operative) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [operative, onClose]);

  if (!operative) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${operative.name} — ${operative.role} (TechSrijan '27)`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-black/80 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0C0D12] p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.12] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Portrait Thumbnail */}
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-white/[0.1] bg-[#12141C]">
            {operative.image ? (
              <img
                src={operative.image}
                alt={operative.name}
                className="h-full w-full object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white/80">
                {operative.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/[0.08] px-3 py-1 text-xs text-zinc-300">
              <span>{operative.house}</span>
              <span>·</span>
              <span className="text-emerald-400">{operative.status}</span>
            </div>

            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {operative.name}
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              {operative.role} {operative.yearOrDesignation ? `— ${operative.yearOrDesignation}` : ""}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 text-xs sm:text-sm leading-relaxed text-zinc-300">
          {operative.bio}
        </div>

        {/* Key Responsibilities / Skills */}
        {operative.keyDirectives && operative.keyDirectives.length > 0 && (
          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Directives & Focus
            </h4>
            <ul className="mt-2.5 space-y-2">
              {operative.keyDirectives.map((directive, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>{directive}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills Pills */}
        {operative.weaponsOfChoice && operative.weaponsOfChoice.length > 0 && (
          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Core Skills & Tools
            </h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {operative.weaponsOfChoice.map((w) => (
                <span
                  key={w.skill}
                  className="rounded-lg bg-white/[0.05] border border-white/[0.08] px-2.5 py-1 text-xs text-zinc-300"
                >
                  {w.skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5">
          <button
            onClick={handleCopy}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to clipboard</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Share Profile</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {operative.contacts.email && (
              <a
                href={`mailto:${operative.contacts.email}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-zinc-300 hover:bg-white/[0.12] hover:text-white transition-colors"
                title="Email"
              >
                <Send className="h-4 w-4" />
              </a>
            )}
            {operative.contacts.linkedin && (
              <a
                href={operative.contacts.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-zinc-300 hover:bg-white/[0.12] hover:text-white transition-colors"
                title="LinkedIn"
              >
                <IconLinkedin className="h-4 w-4" />
              </a>
            )}
            {operative.contacts.github && (
              <a
                href={operative.contacts.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-zinc-300 hover:bg-white/[0.12] hover:text-white transition-colors"
                title="GitHub"
              >
                <IconGithub className="h-4 w-4" />
              </a>
            )}
            {operative.contacts.instagram && (
              <a
                href={operative.contacts.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-zinc-300 hover:bg-white/[0.12] hover:text-white transition-colors"
                title="Instagram"
              >
                <IconInstagram className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
