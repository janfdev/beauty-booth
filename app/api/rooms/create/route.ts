import { NextResponse } from "next/server";
import { generateRoomCode, calculateExpirationDate } from "@/lib/room-code";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { hostName, hostUserId } = body;

    if (!hostName || typeof hostName !== "string" || hostName.trim().length === 0) {
      return NextResponse.json(
        { error: "Nama panggilan host wajib diisi." },
        { status: 400 }
      );
    }

    const roomCode = generateRoomCode();
    const expiresAt = calculateExpirationDate();

    // Response session data
    return NextResponse.json({
      success: true,
      room: {
        roomCode,
        hostName: hostName.trim(),
        hostUserId: hostUserId || null,
        gameType: "SYNC_OR_SINK",
        status: "WAITING",
        expiresAt: expiresAt.toISOString(),
        ttlHours: 5,
        shareUrl: `https://fun.fizaa.me/games/sync?code=${roomCode}`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Gagal membuat sesi room: " + err.message },
      { status: 500 }
    );
  }
}
