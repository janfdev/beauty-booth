import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, isSuperAdminEmail, signSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, password } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Nama lengkap wajib diisi." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Alamat email tidak valid." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Cek apakah email sudah terdaftar
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    }).catch(() => null);

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan masuk menggunakan akun Anda." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const role = isSuperAdminEmail(normalizedEmail) ? "SUPER_ADMIN" : "USER";

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role,
      },
    });

    const sessionUser = {
      id: user.id,
      email: user.email!,
      name: user.name || name.trim(),
      role: user.role as "USER" | "SUPER_ADMIN",
      avatarUrl: user.avatar_url || undefined,
    };

    const token = await signSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      message: "Pendaftaran akun berhasil!",
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
      { error: "Gagal mendaftar akun: " + err.message },
      { status: 500 }
    );
  }
}
