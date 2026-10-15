"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Gamepad2,
  Heart,
  Users,
  Copy,
  Check,
  Sparkles,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SyncGamePage() {
  const [tab, setTab] = useState<"create" | "join">("create");
  const [hostName, setHostName] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [partnerName, setPartnerName] = useState("");

  const [createdRoom, setCreatedRoom] = useState<{
    roomCode: string;
    expiresAt: string;
    shareUrl: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    if (!hostName.trim()) {
      setMessage("Silakan masukkan nama panggilan Anda.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat room");

      setCreatedRoom({
        roomCode: data.room.roomCode,
        expiresAt: data.room.expiresAt,
        shareUrl: data.room.shareUrl,
      });
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!createdRoom) return;
    navigator.clipboard.writeText(createdRoom.roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#2B2D42] flex flex-col justify-between selection:bg-[#735D96] selection:text-white">
      {/* Top Floating Header */}
      <header className="sticky top-3 z-40 max-w-5xl w-full mx-auto px-4 py-2">
        <div className="rounded-full bg-white/85 backdrop-blur-md border border-[#5A4E7A]/20 px-5 py-3 flex items-center justify-between shadow-sm shadow-[#5A4E7A]/5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#7D7F9A] hover:text-[#5A4E7A] transition"
          >
            <ArrowLeft className="size-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#2B2D42]">
            <Heart className="size-4 text-[#FB6F92] fill-[#FB6F92]" />
            <span>SYNC OR SINK</span>
          </div>
        </div>
      </header>

      {/* Main Game Shell Container */}
      <main className="max-w-xl w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="lavender" className="rounded-full font-mono text-[11px] uppercase tracking-wider">
            COUPLE CHEMISTRY CHALLENGE
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#2B2D42] tracking-tight">
            Sync or Sink
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#7D7F9A] leading-relaxed">
            Uji seberapa sehati pikiran kalian berdua lewat kuis sinkronisasi pilihan cepat dan pertanyaan reflektif.
          </p>
        </div>

        {/* Action Card with Double-Bezel */}
        <div className="rounded-[2.25rem] p-3 bg-white/90 border border-[#5A4E7A]/25 shadow-xl shadow-[#5A4E7A]/10 backdrop-blur-xs">
          <div className="rounded-[1.75rem] p-6 bg-[#F5F0FB] border border-[#5A4E7A]/20 space-y-5">
            {/* Tab Selection */}
            <div className="flex rounded-2xl bg-white p-1 border border-[#5A4E7A]/15">
              <button
                type="button"
                onClick={() => {
                  setTab("create");
                  setMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition select-none ${
                  tab === "create"
                    ? "bg-[#735D96] text-white shadow-xs"
                    : "text-[#7D7F9A] hover:text-[#2B2D42]"
                }`}
              >
                Buat Ruangan Baru
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("join");
                  setMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition select-none ${
                  tab === "join"
                    ? "bg-[#735D96] text-white shadow-xs"
                    : "text-[#7D7F9A] hover:text-[#2B2D42]"
                }`}
              >
                Gabung dengan Kode
              </button>
            </div>

            {/* Error or Notice Message */}
            {message && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-semibold text-center">
                {message}
              </div>
            )}

            {tab === "create" ? (
              <div className="space-y-4">
                {!createdRoom ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider">
                        Nama Panggilan Anda
                      </label>
                      <Input
                        type="text"
                        value={hostName}
                        onChange={(e) => setHostName(e.target.value)}
                        placeholder="Contoh: Fauzan"
                        className="bg-white border-[#5A4E7A]/20"
                      />
                    </div>

                    <Button
                      size="lg"
                      onClick={handleCreateRoom}
                      disabled={loading}
                      className="w-full rounded-2xl bg-[#735D96] hover:bg-[#624D82] text-white font-display font-bold shadow-md shadow-[#735D96]/20"
                    >
                      <Users className="size-4" />
                      <span>{loading ? "Menyiapkan Room..." : "Buat Room (Aktif 5 Jam)"}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className="p-4 rounded-2xl bg-white border border-[#5A4E7A]/20 space-y-2">
                      <span className="font-mono text-[10px] text-[#7D7F9A] uppercase tracking-wider block">
                        BAGIKAN KODE INI KE PASANGAN ANDA
                      </span>
                      <div className="font-mono font-black text-3xl tracking-widest text-[#735D96] py-1 select-all">
                        {createdRoom.roomCode}
                      </div>
                      <span className="font-mono text-[11px] text-amber-600 font-semibold block">
                        Aktif selama 5 jam sejak dibuat
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="md"
                        variant="secondary"
                        onClick={handleCopyLink}
                        className="flex-1 rounded-xl font-mono text-xs font-bold"
                      >
                        {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                        <span>{copied ? "KODE DISALIN" : "SALIN KODE"}</span>
                      </Button>
                      <Button
                        size="md"
                        onClick={() => alert("Menunggu pasangan memasukkan kode untuk mulai!")}
                        className="flex-1 rounded-xl bg-[#735D96] hover:bg-[#624D82] text-white font-display font-bold"
                      >
                        <span>Mulai Permainan</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider">
                    Kode Ruangan (Room Code)
                  </label>
                  <Input
                    type="text"
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    placeholder="Contoh: LOVE-A9B2"
                    className="font-mono font-bold text-center tracking-widest bg-white border-[#5A4E7A]/20 uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider">
                    Nama Panggilan Anda
                  </label>
                  <Input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Contoh: Ayu"
                    className="bg-white border-[#5A4E7A]/20"
                  />
                </div>

                <Button
                  size="lg"
                  onClick={() => alert(`Menghubungkan ke room ${roomCodeInput}...`)}
                  className="w-full rounded-2xl bg-[#735D96] hover:bg-[#624D82] text-white font-display font-bold shadow-md shadow-[#735D96]/20"
                >
                  <Gamepad2 className="size-4" />
                  <span>Gabung ke Room Pasangan</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto px-4 py-6 text-center text-xs font-mono text-[#7D7F9A]">
        LoveFun Studio · Uji Kekompakan & Bounding Pasangan
      </footer>
    </div>
  );
}
