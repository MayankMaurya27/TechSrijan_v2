import { NextRequest, NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import type { SafeUser } from "@/lib/types";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // Determine sanitized origin
  const rawForwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const rawHost = rawForwardedHost || req.headers.get("host")?.split(",")[0].trim() || "localhost:3000";
  const rawProto = req.headers.get("x-forwarded-proto")?.split(",")[0].trim() || (rawHost.includes("localhost") ? "http" : "https");
  const origin = rawHost ? `${rawProto}://${rawHost}` : req.nextUrl.origin;

  if (error || !code) {
    console.error("Google OAuth callback error:", error || "Missing code");
    return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(error || "Google authorization was cancelled.")}`);
  }

  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Missing Google OAuth credentials in environment variables.");
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent("Google OAuth credentials are not configured on the server.")}`
    );
  }

  const redirectUri = `${origin}/api/auth/callback/google`;

  try {
    // 1. Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Failed to exchange Google OAuth code:", errText);
      return NextResponse.redirect(
        `${origin}/signin?error=${encodeURIComponent("Google token exchange failed. Please verify redirect URIs.")}`
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch user profile from Google UserInfo endpoint
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      throw new Error("Failed to fetch user profile from Google.");
    }

    const googleUser = await profileRes.json();
    const email = (googleUser.email || "").toLowerCase().trim();
    const name = googleUser.name || email.split("@")[0] || "Participant";
    const image = googleUser.picture || null;
    const isMmmutStudent = email.endsWith("@mmmut.ac.in");

    // 3. Assemble SafeUser profile
    const safeUser: SafeUser = {
      id: crypto.randomUUID(),
      email,
      name,
      collegeName: isMmmutStudent
        ? "Madan Mohan Malaviya University of Technology, Gorakhpur"
        : "",
      mobile: "",
      gender: "OTHER",
      role: "STUDENT",
      club: null,
      isMmmutStudent,
      rollNumber: null,
      isOnboarded: false,
      totalPoints: 0,
      image,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 4. Issue standard Session JWT (HS256) matching backend specification
    const jwtSecret =
      process.env.JWT_SECRET ||
      "techsrijan27_production_master_jwt_secret_key_minimum_32_characters_long_for_security";

    const sessionPayload = {
      id: safeUser.id,
      email: safeUser.email,
      name: safeUser.name,
      role: safeUser.role,
      club: safeUser.club,
      isMmmutStudent: safeUser.isMmmutStudent,
      rollNumber: safeUser.rollNumber,
      isOnboarded: safeUser.isOnboarded,
    };

    const token = signJwt(sessionPayload, jwtSecret, 7 * 86400);

    // 5. Build redirect response with secure session cookies
    const callbackTarget = `${origin}/auth/callback?provider=google&token=${encodeURIComponent(
      token
    )}&user=${encodeURIComponent(JSON.stringify(safeUser))}`;

    const response = NextResponse.redirect(callbackTarget);

    // Set cookies for both server-rendered and client hydration
    response.cookies.set("ts27_token", token, {
      path: "/",
      maxAge: 7 * 86400,
      sameSite: "lax",
      httpOnly: false,
      secure: origin.startsWith("https"),
    });

    response.cookies.set("ts27_user_profile", JSON.stringify(safeUser), {
      path: "/",
      maxAge: 7 * 86400,
      sameSite: "lax",
      httpOnly: false,
      secure: origin.startsWith("https"),
    });

    return response;
  } catch (err: any) {
    console.error("Google OAuth Handler Exception:", err);
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent(err.message || "Authentication process failed.")}`
    );
  }
}
