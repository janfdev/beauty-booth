import { NextResponse } from "next/server";
import { verifySessionToken, parseCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const token = parseCookie(cookieHeader, "lovefun_session");

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const sessionUser = await verifySessionToken(token);
    if (!sessionUser) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: sessionUser,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal memeriksa sesi: " + err.message },
      { status: 500 }
    );
  }
}
