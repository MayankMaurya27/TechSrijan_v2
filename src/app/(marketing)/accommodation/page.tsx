"use client";

import { useState } from "react";
import { Check, Shield, MapPin, Calendar, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACCOMMODATION_TIERS = [
  {
    id: "TIER-01",
    name: "SINGLE NIGHT PASS",
    price: "₹249",
    duration: "24 HOURS STAY",
    recommended: false,
    features: [
      "Secured hostel room bunk bed",
      "Standard campus Wi-Fi access",
      "24/7 Gate security & surveillance",
      "Access to fest common rooms",
    ],
  },
  {
    id: "TIER-02",
    name: "FULL FEST CONCLAVE",
    price: "₹649",
    duration: "3 DAYS / 3 NIGHTS",
    recommended: true,
    features: [
      "Priority hostel allocation for 72 hours",
      "High-speed campus fiber Wi-Fi",
      "Fest welcome kit & survival lanyard",
      "Dedicated locker & charging bay",
      "Late-night hackathon transport shuttle",
    ],
  },
  {
    id: "TIER-03",
    name: "IMPERIAL MESS ALL-INCLUSIVE",
    price: "₹999",
    duration: "3 DAYS + 9 MEALS",
    recommended: false,
    features: [
      "All inclusions of Full Fest Conclave",
      "Full 3-Day University Mess access (Breakfast, Lunch, Dinner)",
      "Express security queue at entry gates",
      "Complimentary TechSrijan official jersey",
    ],
  },
];

export function AccommodationPortal() {
  const [selectedTier, setSelectedTier] = useState("TIER-02");
  const [gender, setGender] = useState<"boys" | "girls">("boys");
  const [checkIn, setCheckIn] = useState("2026-11-13");
  const [checkOut, setCheckOut] = useState("2026-11-16");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-20 font-mono">
      {/* Header Banner */}
      <div className="mx-auto max-w-7xl px-6 pt-12 lg:px-12 border-b border-[var(--border)] pb-8 mb-12">
        <span className="text-xs tracking-[0.35em] text-[var(--accent-primary)] uppercase">
          // ON-CAMPUS HABITAT ALLOCATION // HOSTEL DIRECTIVE
        </span>
        <h1 className="mt-2 text-4xl sm:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tight">
          ACCOMMODATION
        </h1>
        <p className="mt-3 max-w-2xl text-xs sm:text-sm text-[var(--text-secondary)]">
          SECURE ON-CAMPUS RESIDENCE IN UNIVERSITY HOSTELS FOR OUTSTATION OPERATIVES THROUGHOUT TECHSRIJAN 2026.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-16">
        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ACCOMMODATION_TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`mecha-bracket relative flex flex-col justify-between rounded border p-8 cursor-pointer transition-all duration-300 ${
                selectedTier === tier.id
                  ? "border-[var(--accent-primary)] bg-[var(--surface)] shadow-[var(--glow)] scale-[1.02]"
                  : "border-[var(--border)] bg-[var(--surface)]/70 hover:border-[var(--border-accent)]"
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3.5 right-6 rounded bg-[var(--accent-primary)] px-3 py-1 text-[9px] font-black tracking-widest text-[var(--bg-primary)] uppercase shadow-[0_0_15px_var(--accent-glow)]">
                  RECOMMENDED // CONCLAVE
                </div>
              )}

              <div>
                <div className="text-[10px] text-[var(--text-muted)] tracking-widest mb-2">
                  {tier.id}
                </div>
                <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-wide">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[var(--accent-primary)]">
                    {tier.price}
                  </span>
                  <span className="text-[10px] text-[var(--text-secondary)]">
                    // {tier.duration}
                  </span>
                </div>

                <ul className="mt-8 space-y-3 text-xs text-[var(--text-secondary)]">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Button
                  variant={selectedTier === tier.id ? "default" : "outline"}
                  size="sm"
                  className="w-full text-xs"
                >
                  {selectedTier === tier.id ? "TIER SELECTED" : "SELECT TIER"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Form & Logistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-[var(--border)] pt-12">
          {/* Booking Form (7 Cols) */}
          <div className="lg:col-span-7">
            <h3 className="text-xs tracking-[0.25em] text-[var(--accent-primary)] uppercase mb-6">
              // OPERATIVE ALLOCATION FORM
            </h3>

            {confirmed ? (
              <div className="mecha-bracket rounded border border-[var(--accent-primary)] bg-[var(--surface)] p-8 text-center space-y-4">
                <div className="h-12 w-12 rounded-full border border-[var(--accent-primary)] bg-[var(--bg-primary)] flex items-center justify-center mx-auto text-[var(--accent-primary)] shadow-[var(--glow)]">
                  <Check className="h-6 w-6" />
                </div>
                <h4 className="text-2xl font-black text-[var(--text-primary)]">
                  ALLOCATION INITIATED
                </h4>
                <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                  HOSTEL SLOT HAS BEEN TEMPORARILY RESERVED. PLEASE COMPLETE GATEWAY PAYMENT AT REGISTRATION DESK UPON CHECK-IN.
                </p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" onClick={() => setConfirmed(false)}>
                    MODIFY RESERVATION
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mecha-bracket border border-[var(--border)] bg-[var(--surface)] p-8 rounded space-y-6">
                {/* Gender Segregation */}
                <div>
                  <label className="text-[10px] tracking-widest text-[var(--text-muted)] block mb-2">
                    HOSTEL WING (CAMPUS SEGREGATION PROTOCOL)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setGender("boys")}
                      className={`h-11 rounded border text-xs font-bold transition-all ${
                        gender === "boys"
                          ? "border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--bg-primary)] font-black"
                          : "border-[var(--border)] text-[var(--text-secondary)]"
                      }`}
                    >
                      SUBHASH BHAWAN (BOYS)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("girls")}
                      className={`h-11 rounded border text-xs font-bold transition-all ${
                        gender === "girls"
                          ? "border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--bg-primary)] font-black"
                          : "border-[var(--border)] text-[var(--text-secondary)]"
                      }`}
                    >
                      SAROJINI BHAWAN (GIRLS)
                    </button>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] tracking-widest text-[var(--text-muted)] block mb-2">
                      CHECK-IN DATE
                    </label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="h-11 w-full rounded border border-[var(--border)] bg-[var(--bg-primary)] px-4 text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest text-[var(--text-muted)] block mb-2">
                      CHECK-OUT DATE
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="h-11 w-full rounded border border-[var(--border)] bg-[var(--bg-primary)] px-4 text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Contact & College */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] tracking-widest text-[var(--text-muted)] block mb-2">
                      EMERGENCY PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 w-full rounded border border-[var(--border)] bg-[var(--bg-primary)] px-4 text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest text-[var(--text-muted)] block mb-2">
                      INSTITUTION / UNIVERSITY
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. IIT Kanpur / HBTU"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="h-11 w-full rounded border border-[var(--border)] bg-[var(--bg-primary)] px-4 text-xs text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  CONFIRM ALLOCATION & PROCEED TO SECURE BED
                </Button>
              </form>
            )}
          </div>

          {/* Logistics Guidelines & Coordinates (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xs tracking-[0.25em] text-[var(--accent-primary)] uppercase">
              // LOGISTICS & CURFEW DIRECTIVES
            </h3>

            <div className="border border-[var(--border)] bg-[var(--surface)] p-6 rounded space-y-4 text-xs text-[var(--text-secondary)]">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">CHECK-IN TIMINGS</span>
                  <span>Operational 24/7 throughout fest dates. Report to Gate 01 Reception Desk.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-[var(--border)] pt-4">
                <Shield className="h-4 w-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">MANDATORY IDENTIFICATION</span>
                  <span>Physical college identity card and government photo ID (Aadhar/Passport) mandatory.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-[var(--border)] pt-4">
                <MapPin className="h-4 w-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">CAMPUS LOCATION</span>
                  <span>MMMUT Gorakhpur, Deoria Road, Gorakhpur, Uttar Pradesh 273010.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-[var(--border)] pt-4">
                <Phone className="h-4 w-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[var(--text-primary)] block">HELP DESK FREQUENCY</span>
                  <span>Hostel Warden Desk: +91 551 227 3958 (Ext. 402)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccommodationPage() {
  return <AccommodationPortal />;
}
