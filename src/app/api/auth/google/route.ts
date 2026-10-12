import { NextRequest, NextResponse } from "next/server";
import { getServerEnv } from "@/lib/server-env";

export async function GET(req: NextRequest) {
  const rawForwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const rawHost = rawForwardedHost || req.headers.get("host")?.split(",")[0].trim() || "localhost:3000";
  const rawProto =
    req.headers.get("x-forwarded-proto")?.split(",")[0].trim() ||
    (rawHost.includes("localhost") || rawHost.includes("127.0.0.1") ? "http" : "https");
  const origin = `${rawProto}://${rawHost}`;

  const clientId =
    getServerEnv("GOOGLE_CLIENT_ID") ||
    getServerEnv("NEXT_PUBLIC_GOOGLE_CLIENT_ID");

  if (!clientId) {
    console.error("[Google OAuth] GOOGLE_CLIENT_ID is not configured in .env or .env.local");
    return NextResponse.redirect(
      `${origin}/signin?error=${encodeURIComponent("Google OAuth Client ID is not configured on the server.")}`
    );
  }

  const redirectUri = `${origin}/api/auth/callback/google`;

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=select_account`;

  return NextResponse.redirect(googleAuthUrl);
}
