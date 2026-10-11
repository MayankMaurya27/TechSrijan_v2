"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImperiumPass3D } from "./imperium-pass-3d";
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Users,
  Compass,
  Bed,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/core/providers/auth-provider";
import { api } from "@/lib/api";
import type { MeResponse } from "@/lib/types";
import { Button } from "@/shared";

export function StudentDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [meData, setMeData] = useState<MeResponse | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (!user) {
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    api.auth
      .getMe()
      .then((data) => {
        if (isMounted) {
          setMeData(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to hydrate student dashboard:", err);
          setError("Failed to load real-time battle roster. Displaying cached state.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingData(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (isAuthLoading || (isLoadingData && user)) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center font-sans text-center">
        <Loader2 className="w-10 h-10 text-[var(--accent-primary)] animate-spin mb-4" />
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] font-mono">
          AUTHENTICATING OPERATIVE SECURITY CLEARANCE...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center font-sans text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-[var(--geass-crimson)] mb-4" />
        <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--text-primary)] mb-2">
          AUTHENTICATION REQUIRED
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mb-6 leading-relaxed">
          Access to the high-security Imperium Pass and tactical squad deployment roster requires active operative credentials.
        </p>
        <Link href="/signin">
          <Button variant="default" size="default">
            <span>SIGN IN TO PORTAL</span>
          </Button>
        </Link>
      </div>
    );
  }

  // Derive pass details
  const passEvents = (meData?.eventRegistrations || []).map((reg) => ({
    title: (reg.eventTitle || reg.event?.title || `EVENT #${reg.eventId.slice(0, 6)}`).toUpperCase(),
    status: (reg.status === "CONFIRMED" ? "confirmed" : "pending_manual_review") as
      | "confirmed"
      | "pending_manual_review",
  }));

  const passCode = user.rollNumber
    ? `TS26-${user.rollNumber}`
    : `TS26-${user.id.slice(0, 8).toUpperCase()}`;

  const squadRegistrations = (meData?.eventRegistrations || []).filter(
    (reg) => reg.team || reg.teamName || reg.teamCode
  );

  const stayBooking = meData?.stayBooking?.booking;
  const stayGuests = meData?.stayBooking?.guests;
  const assignedWing =
    stayGuests?.[0]?.gender === "girls"
      ? "Sarojini Bhavan · Girls Wing"
      : "Subhash Bhavan · Boys Wing";

  return (
    <div className="min-h-screen pt-24 px-6 lg:px-12 mx-auto max-w-7xl font-sans">
      <div className="border-b border-[var(--border)] pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <span className="text-xs tracking-[0.35em] text-[var(--accent-primary)] uppercase font-semibold">
            TACTICAL OPERATIVE PORTAL
          </span>
          <h1 className="mt-2 text-3xl sm:text-5xl font-black text-[var(--text-primary)] uppercase tracking-tight">
            STUDENT DASHBOARD
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-1">
          <div className="text-xs text-[var(--text-primary)] tracking-wider uppercase font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            OPERATIVE: {user.name}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] tracking-widest font-mono">
            {user.collegeName || (user.isMmmutStudent ? "MMMUT GORAKHPUR" : "EXTERNAL")} · {user.email}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded border border-[var(--geass-crimson)]/50 bg-[var(--geass-crimson)]/10 text-xs text-[var(--geass-crimson)] flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {/* Accommodation notification card if user has a booking */}
      {stayBooking && (
        <div className="mb-8 mecha-bracket border border-[var(--border-accent)] bg-[var(--surface)] p-5 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs tracking-widest font-mono text-[var(--accent-primary)] uppercase font-semibold">
                HOSTEL ACCOMMODATION SECURED
              </div>
              <div className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                WING: {assignedWing}
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
                STATUS: {stayBooking.overallStatus} · TOTAL GUESTS: {stayBooking.numPeople}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded text-[10px] font-mono font-bold tracking-widest ${
                stayBooking.overallStatus === "CONFIRMED"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              }`}
            >
              {stayBooking.overallStatus}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 flex flex-col items-center">
          <span className="text-xs tracking-widest text-[var(--text-muted)] self-start mb-2 uppercase font-medium">
            OFFICIAL SECURITY PASS (INTERACTIVE 3D BADGE)
          </span>
          <ImperiumPass3D
            userName={user.name}
            college={user.collegeName || (user.isMmmutStudent ? "MMMUT Gorakhpur" : "External")}
            passCode={passCode}
            events={passEvents}
          />
        </div>

        <div className="lg:col-span-6 space-y-8">
          {/* REGISTERED EVENTS SECTION */}
          <section aria-labelledby="registered-events-heading">
            <div className="flex items-center justify-between mb-4">
              <h2
                id="registered-events-heading"
                className="text-xs tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold"
              >
                REGISTERED EVENTS ({meData?.eventRegistrations?.length || 0})
              </h2>
              <Link
                href="/events"
                className="text-[10px] tracking-widest text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors uppercase font-mono flex items-center gap-1"
              >
                <span>MOBILIZE MORE</span>
                <Compass className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {(!meData?.eventRegistrations || meData.eventRegistrations.length === 0) ? (
                <div className="mecha-bracket border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 rounded text-center">
                  <Sparkles className="w-8 h-8 text-[var(--accent-primary)]/50 mx-auto mb-2" />
                  <div className="text-sm font-bold text-[var(--text-primary)]">
                    NO REGISTERED EVENTS
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm mx-auto">
                    You have not enlisted in any technical or cultural competitions yet. Explore the battle arena to secure your spot.
                  </p>
                  <Link href="/events" className="inline-block mt-4">
                    <Button variant="outline" size="sm" className="text-xs">
                      <span>BROWSE EVENTS</span>
                    </Button>
                  </Link>
                </div>
              ) : (
                meData.eventRegistrations.map((reg, idx) => {
                  const eventTitle = reg.eventTitle || reg.event?.title || `Event #${reg.eventId.slice(0, 8)}`;
                  const isSquad = Boolean(reg.teamId || reg.teamName || reg.team);
                  const teamInfo = isSquad
                    ? `TEAM: ${reg.teamName || reg.team?.name || "Squad"} · ${reg.teamRole || "MEMBER"}`
                    : "INDIVIDUAL PARTICIPANT";

                  return (
                    <article
                      key={reg.registrationId || reg.id || idx}
                      className="mecha-bracket flex items-center justify-between border border-[var(--border)] bg-[var(--surface)] p-4 rounded hover:border-[var(--border-accent)] transition-colors"
                    >
                      <div>
                        <div className="text-sm font-bold text-[var(--text-primary)] uppercase">
                          {eventTitle}
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 tracking-wide font-mono">
                          {teamInfo}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        {reg.status === "CONFIRMED" ? (
                          <div className="flex items-center gap-1 text-[var(--accent-primary)]">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>CONFIRMED</span>
                          </div>
                        ) : reg.status === "PENDING_PAYMENT" ? (
                          <div className="flex items-center gap-1 text-[var(--geass-crimson)]">
                            <ShieldAlert className="h-4 w-4 animate-pulse" />
                            <span>PENDING VERIFICATION</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[var(--text-muted)]">
                            <Clock className="h-4 w-4" />
                            <span>{reg.status}</span>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          {/* TEAM ROSTERS SECTION */}
          <section aria-labelledby="team-rosters-heading">
            <h2
              id="team-rosters-heading"
              className="text-xs tracking-[0.25em] text-[var(--accent-primary)] uppercase font-semibold mb-4"
            >
              TEAM ROSTERS ({squadRegistrations.length})
            </h2>

            {squadRegistrations.length === 0 ? (
              <div className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-6 rounded text-center">
                <Users className="w-6 h-6 text-[var(--text-muted)] mx-auto mb-2" />
                <div className="text-xs font-bold text-[var(--text-secondary)]">
                  NO SQUAD DEPLOYMENTS ACTIVE
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                  Join or form a tactical squad when registering for team challenges.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {squadRegistrations.map((reg, idx) => {
                  const teamName = reg.teamName || reg.team?.name || "Tactical Squad";
                  const joinCode = reg.teamCode || reg.team?.joinCode || reg.team?.code || "";
                  const members = reg.team?.members || [];

                  return (
                    <div
                      key={reg.teamId || reg.registrationId || idx}
                      className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-5 rounded space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border)] pb-3 gap-2">
                        <div>
                          <div className="text-sm font-black text-[var(--text-primary)] uppercase">
                            {teamName}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] tracking-wide font-mono">
                            EVENT: {reg.eventTitle || reg.event?.title || reg.eventId}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {joinCode && (
                            <button
                              onClick={() => handleCopy(joinCode)}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--surface-hover)] border border-[var(--border)] text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                              title="Click to copy Squad Code"
                            >
                              <span>CODE: <strong className="text-[var(--accent-primary)]">{joinCode}</strong></span>
                              {copiedCode === joinCode ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                          <div className="text-xs font-bold text-[var(--accent-primary)] bg-[var(--bg-primary)] px-2.5 py-1 rounded border border-[var(--border)] uppercase font-mono">
                            {reg.teamRole || "MEMBER"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        {members.length > 0 ? (
                          members.map((member: { id: string; name: string; email: string; role?: "LEADER" | "MEMBER" }) => {
                            const isMe = member.email === user.email || member.id === user.id;
                            return (
                              <div
                                key={member.id}
                                className="flex items-center justify-between py-1 border-b border-[var(--border)]/40 text-[var(--text-secondary)]"
                              >
                                <span className={isMe ? "font-bold text-[var(--text-primary)]" : ""}>
                                  {member.name} {isMe && "(You)"}
                                </span>
                                <span
                                  className={`text-[10px] font-mono ${
                                    member.role === "LEADER"
                                      ? "text-[var(--accent-primary)] font-bold"
                                      : "text-[var(--text-muted)]"
                                  }`}
                                >
                                  {member.role || "MEMBER"}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex items-center justify-between py-1 text-[var(--text-primary)]">
                            <span className="font-bold">{user.name} (You)</span>
                            <span className="text-[10px] text-[var(--accent-primary)] font-mono">
                              {reg.teamRole || "LEADER"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}


