import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword, isSuperAdminEmail, signSessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Alamat email wajib diisi." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    }).catch(() => null);

    if (!user || !user.password_hash) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Email atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    // Perbarui wewenang jika email admin terdaftar
    const expectedRole = isSuperAdminEmail(normalizedEmail) ? "SUPER_ADMIN" : user.role;
    if (user.role !== expectedRole) {
      await prisma.user.update({
        where: { id: user.id },
        data: { role: expectedRole },
      }).catch(() => null);
    }

    const sessionUser = {
      id: user.id,
      email: user.email!,
      name: user.name || "User",
      role: expectedRole as "USER" | "SUPER_ADMIN",
      avatarUrl: user.avatar_url || undefined,
    };

    const token = await signSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      message: "Berhasil masuk ke akun Anda!",
      user: sessionUser,
    });

    response.cookies.set("lovefun_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 hari
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal memproses login: " + err.message },
      { status: 500 }
    );
  }
}
