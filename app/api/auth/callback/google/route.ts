import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isSuperAdminEmail, signSessionToken } from "@/lib/auth";

export async function GET(req: Request) {
  const urlObj = new URL(req.url);
  const code = urlObj.searchParams.get("code");
  const error = urlObj.searchParams.get("error");

  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || urlObj.host;
  const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${proto}://${host}`;
  const redirectUri = `${baseUrl}/api/auth/callback/google`;

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=GoogleAuthCancelled`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/login?error=MissingGoogleConfig`);
  }

  try {
    // 1. Tukar authorization code dengan Access Token Google
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

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Google Token Exchange Failed:", tokenData);
      return NextResponse.redirect(`${baseUrl}/login?error=TokenExchangeFailed`);
    }

    // 2. Ambil informasi profil pengguna dari Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await userRes.json();

    if (!profile.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=EmailNotFound`);
    }

    const email = profile.email.toLowerCase().trim();
    const name = profile.name || email.split("@")[0];
    const avatarUrl = profile.picture || null;
    const role = isSuperAdminEmail(email) ? "SUPER_ADMIN" : "USER";

    // 3. Upsert user di database
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        avatar_url: avatarUrl,
        role: isSuperAdminEmail(email) ? "SUPER_ADMIN" : undefined,
      },
      create: {
        email,
        name,
        avatar_url: avatarUrl,
        role,
      },
    });

    const sessionUser = {
      id: user.id,
      email: user.email!,
      name: user.name || name,
      role: (isSuperAdminEmail(email) ? "SUPER_ADMIN" : user.role) as "USER" | "SUPER_ADMIN",
      avatarUrl: user.avatar_url || undefined,
    };

    const token = await signSessionToken(sessionUser);

    const redirectResponse = NextResponse.redirect(`${baseUrl}/profile`);
    redirectResponse.cookies.set("lovefun_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 hari
    });

    return redirectResponse;
  } catch (err: any) {
    console.error("Google OAuth Callback Error:", err);
    return NextResponse.redirect(`${baseUrl}/login?error=GoogleAuthFailed`);
  }
}
