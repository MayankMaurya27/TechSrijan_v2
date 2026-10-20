"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/core";
import { ShieldCheck, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import type { SafeUser } from "@/lib/types";
import { getOptimizedImageUrl } from "@/shared/utils/cloudinary-loader";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [statusText, setStatusText] = useState("Exchanging cryptographic clearance...");
  const [userName, setUserName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState<string>("/profile");

  const didRunRef = React.useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const processCallback = async () => {
      try {
        const provider = searchParams.get("provider") || "oauth";
        const code = searchParams.get("code");
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");
        const error = searchParams.get("error");
        const rollNumber = searchParams.get("urollno") || searchParams.get("roll");

        if (error) {
          throw new Error(decodeURIComponent(error));
        }

        setStatusText(`Authorizing ${provider === "mmmut" ? "MMMUT Campus" : "Google"} directive...`);

        // Case 1: Primary MMMUT SSO Code Verification (from mmmut.xyz / backend.mmmut.xyz)
        if (code) {
          setStatusText("Verifying clearance with MMMUT university portal...");

          const verifyUrl =
            process.env.NEXT_PUBLIC_MMMUT_SSO_VERIFY_URL ||
            "https://backend.mmmut.xyz/api/student/sso/verify";

          let verifyRes: Response;
          try {
            verifyRes = await fetch(verifyUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code }),
            });
          } catch (fetchErr: any) {
            throw new Error(`Unable to reach university verification service: ${fetchErr.message || "Network error"}`);
          }

          let verifyData: any;
          try {
            verifyData = await verifyRes.json();
          } catch {
            throw new Error(`University portal returned unexpected response (status ${verifyRes.status})`);
          }

          if (!verifyRes.ok || !verifyData.success || !verifyData.user) {
            const serverMsg = verifyData?.message || "Invalid or expired authorization code";
            if (typeof serverMsg === "string" && serverMsg.toLowerCase().includes("expired")) {
              throw new Error("University authentication code expired (30s limit). Please return and sign in again.");
            }
            if (typeof serverMsg === "string" && serverMsg.toLowerCase().includes("invalid")) {
              throw new Error("University authorization ticket was already used or invalid. Please sign in again.");
            }
            throw new Error(`MMMUT verification failed: ${serverMsg}`);
          }

          const ssoUser = verifyData.user;
          const studentRoll = ssoUser.id || ssoUser.urollno;
          const studentEmail = (
            ssoUser.email ||
            (studentRoll ? `${studentRoll.toLowerCase()}@mmmut.ac.in` : "")
          ).toLowerCase().trim();
          const studentName =
            ssoUser.name ||
            (studentRoll ? `Student (${studentRoll.toUpperCase()})` : "MMMUT Student");

          setStatusText("Establishing TechSrijan festival clearance...");

          // Persist user and obtain official session clearance from PostgreSQL
          const authRes = await api.auth.oauthLogin({
            email: studentEmail,
            name: studentName,
            rollNumber: studentRoll ? studentRoll.toUpperCase() : null,
            provider: "mmmut",
          });

          const loggedInUser = authRes.user;
          setUserName(loggedInUser.name);

          // Update global session across application
          window.dispatchEvent(new Event("storage"));
          await refreshUser();

          const savedReturnUrl = localStorage.getItem("ts27_auth_return_url");
          if (savedReturnUrl) localStorage.removeItem("ts27_auth_return_url");
          const destination =
            loggedInUser && !loggedInUser.isOnboarded
              ? "/onboarding"
              : savedReturnUrl || "/profile";

          setRedirectPath(destination);
          setStatus("success");
          setStatusText(`MMMUT Campus Directive Authorized: Welcome, ${loggedInUser.name}!`);

          setTimeout(() => {
            router.replace(destination);
          }, 1200);
          return;
        }

        // Case 2: Token provided in URL
        if (token) {
          localStorage.setItem("ts27_token", token);

          let userProfile: SafeUser | null = null;
          if (userParam) {
            try {
              userProfile = JSON.parse(decodeURIComponent(userParam));
              localStorage.setItem("ts27_user_profile", JSON.stringify(userProfile));
              if (userProfile?.name) setUserName(userProfile.name);
            } catch (e) {
              console.warn("Failed to parse user profile payload:", e);
            }
          }

          // Trigger global auth refresh
          window.dispatchEvent(new Event("storage"));
          await refreshUser();

          const savedReturnUrl = localStorage.getItem("ts27_auth_return_url");
          if (savedReturnUrl) localStorage.removeItem("ts27_auth_return_url");
          const destination = userProfile && !userProfile.isOnboarded ? "/onboarding" : (savedReturnUrl || "/profile");
          setRedirectPath(destination);
          setStatus("success");
          setStatusText(
            userProfile
              ? `Clearance Verified: Welcome, ${userProfile.name}!`
              : "Clearance Verified: Access Granted."
          );

          setTimeout(() => {
            router.replace(destination);
          }, 1200);
          return;
        }

        // Case 2: MMMUT SSO return (with roll number or return from mmmut.xyz)
        if (provider === "mmmut" || rollNumber) {
          const studentRoll = rollNumber || searchParams.get("urollno") || searchParams.get("roll");
          const emailParam = searchParams.get("email");
          const nameParam = searchParams.get("name");

          const studentEmail = (
            emailParam ||
            (studentRoll ? `${studentRoll.toLowerCase()}@mmmut.ac.in` : "")
          ).toLowerCase().trim();

          if (!studentEmail && !studentRoll) {
            throw new Error("No student identifier received from MMMUT authentication portal.");
          }

          const studentName =
            nameParam ||
            (studentRoll ? `Student (${studentRoll.toUpperCase()})` : "MMMUT Student");

          // Persist user and obtain official session clearance directly from backend PostgreSQL
          const authRes = await api.auth.oauthLogin({
            email: studentEmail || `${studentRoll?.toLowerCase()}@mmmut.ac.in`,
            name: studentName,
            rollNumber: studentRoll ? studentRoll.toUpperCase() : null,
            provider: "mmmut",
          });

          const loggedInUser = authRes.user;
          setUserName(loggedInUser.name);

          window.dispatchEvent(new Event("storage"));
          await refreshUser();

          const savedReturnUrl = localStorage.getItem("ts27_auth_return_url");
          if (savedReturnUrl) localStorage.removeItem("ts27_auth_return_url");
          const destination =
            loggedInUser && !loggedInUser.isOnboarded
              ? "/onboarding"
              : savedReturnUrl || "/profile";

          setRedirectPath(destination);
          setStatus("success");
          setStatusText(`MMMUT Campus Directive Authorized: Welcome, ${loggedInUser.name}!`);

          setTimeout(() => {
            router.replace(destination);
          }, 1200);
          return;
        }

        // Check if cookies already contain session
        const existingToken = localStorage.getItem("ts27_token");
        if (existingToken) {
          await refreshUser();
          setStatus("success");
          setStatusText("Session active. Redirecting to festival terminal...");
          setTimeout(() => router.replace("/profile"), 1000);
          return;
        }

        throw new Error("No authorization token or user credential returned from authentication server.");
      } catch (err: any) {
        console.error("Auth callback verification error:", err);
        setStatus("error");
        setErrorMessage(err.message || "Failed to complete authentication handshake.");
      }
    };

    processCallback();
  }, [searchParams, router, refreshUser]);

  return (
    <div className="relative min-h-screen w-full bg-[#050303] text-[#f8eed9] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background Starfield / Red Moon Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <picture className="w-full h-full">
          <source srcSet={getOptimizedImageUrl("/images/redmoon1.webp", 1920)} type="image/webp" />
          <img
            src={getOptimizedImageUrl("/images/redmoon1.webp", 1920)}
            alt="Atmosphere"
            className="w-full h-full object-cover object-center opacity-30 filter brightness-75 contrast-125"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/90" />
      </div>

      {/* Center Holographic HUD Card */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div
          className="relative rounded-2xl border border-[#caa462]/35 bg-[#120c0c]/90 backdrop-blur-xl p-8 sm:p-10 shadow-[0_12px_50px_rgba(0,0,0,0.9)] flex flex-col items-center text-center"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))",
          }}
        >
          {/* Top Imperial Status Chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#caa462]/30 bg-[#caa462]/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#caa462] animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#caa462] uppercase font-semibold">
              GATEWAY PROTOCOL
            </span>
          </div>

          {/* Icon HUD */}
          {status === "verifying" && (
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-t-[#caa462] border-r-[#caa462]/30 border-b-transparent border-l-transparent animate-spin" />
              <Loader2 className="w-8 h-8 text-[#caa462] animate-spin" />
            </div>
          )}

          {status === "success" && (
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center animate-in zoom-in duration-300">
              <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl" />
              <div className="w-16 h-16 rounded-full border border-emerald-500/50 bg-emerald-950/40 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <ShieldCheck className="w-9 h-9 text-emerald-400" />
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center animate-in zoom-in duration-300">
              <div className="absolute inset-0 rounded-full bg-red-500/10 blur-xl" />
              <div className="w-16 h-16 rounded-full border border-red-500/50 bg-red-950/40 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.3)]">
                <AlertCircle className="w-9 h-9 text-red-400" />
              </div>
            </div>
          )}

          {/* Typography */}
          <h2 className="font-montserrat text-xl sm:text-2xl font-black text-[#f7f2ea] tracking-tight mb-2">
            {status === "verifying" && "AUTHENTICATING IDENTIFIER"}
            {status === "success" && "CLEARANCE GRANTED"}
            {status === "error" && "AUTHENTICATION FAILED"}
          </h2>

          <p className="font-geist text-xs sm:text-sm text-[#a09484] max-w-xs leading-relaxed mb-6">
            {status === "verifying" && statusText}
            {status === "success" && (statusText || `Welcome to TechSrijan'27, ${userName}`)}
            {status === "error" && (errorMessage || "Unable to complete directive.")}
          </p>

          {/* Action button in case of failure or immediate proceed */}
          {status === "success" && (
            <button
              type="button"
              onClick={() => router.replace(redirectPath)}
              className="w-full py-3 px-5 rounded-lg font-mono text-xs font-bold tracking-wider uppercase text-[#f7f2ea] border border-red-500/85 bg-gradient-to-r from-[#200608] via-[#481216] to-[#200608] hover:from-[#5e161b] hover:to-[#5e161b] shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
            >
              <span>ENTER FESTIVAL TERMINAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {status === "error" && (
            <button
              type="button"
              onClick={() => router.replace("/signin")}
              className="w-full py-3 px-5 rounded-lg font-mono text-xs font-bold tracking-wider uppercase text-white border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>RETURN TO SIGN IN GATEWAY</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050303] flex items-center justify-center text-[#caa462]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
