import { NextResponse } from "next/server";
import { isRoomExpired } from "@/lib/room-code";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { roomCode, partnerName } = body;

    if (!roomCode || typeof roomCode !== "string") {
      return NextResponse.json(
        { error: "Kode room wajib diisi." },
        { status: 400 }
      );
    }

    if (!partnerName || typeof partnerName !== "string" || partnerName.trim().length === 0) {
      return NextResponse.json(
        { error: "Nama panggilan Anda wajib diisi untuk bergabung." },
        { status: 400 }
      );
    }

    // Mock validation room session
    const normalizedCode = roomCode.trim().toUpperCase();

    return NextResponse.json({
      success: true,
      session: {
        roomCode: normalizedCode,
        partnerName: partnerName.trim(),
        status: "CONNECTED",
        message: "Berhasil terhubung ke ruang bermain pasangan!",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal bergabung ke sesi: " + err.message },
      { status: 500 }
    );
  }
}
