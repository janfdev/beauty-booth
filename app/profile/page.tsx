"use client";

import Link from "next/link";
import { ArrowLeft, User, Heart, Award, Image as ImageIcon, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#2B2D42] flex flex-col justify-between selection:bg-[#FB6F92] selection:text-white">
      {/* Top Floating Header */}
      <header className="sticky top-3 z-40 max-w-5xl w-full mx-auto px-4 py-2">
        <div className="rounded-full bg-white/85 backdrop-blur-md border border-[#FB6F92]/20 px-5 py-3 flex items-center justify-between shadow-sm shadow-[#FB6F92]/5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#7D7F9A] hover:text-[#FB6F92] transition"
          >
            <ArrowLeft className="size-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#2B2D42]">
            <Heart className="size-4 text-[#FB6F92] fill-[#FB6F92]" />
            <span>PROFIL PASANGAN</span>
          </div>
        </div>
      </header>

      {/* Main Profile Content */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 space-y-8 flex-1">
        {/* User Card */}
        <div className="rounded-[2.25rem] p-3 bg-white/90 border border-[#FB6F92]/25 shadow-xl shadow-[#FB6F92]/10 backdrop-blur-xs">
          <div className="rounded-[1.75rem] p-6 bg-[#FFF0F4] border border-[#FB6F92]/20 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full bg-white border-2 border-[#FB6F92]/30 flex items-center justify-center text-[#FB6F92] text-2xl font-black shadow-xs font-display">
                F
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h1 className="font-display font-extrabold text-xl text-[#2B2D42]">Fauzan & Partner</h1>
                  <Badge variant="primary" className="text-[10px] py-0.5">TERHUBUNG</Badge>
                </div>
                <p className="font-mono text-xs text-[#7D7F9A]">MEMBER SEJAK OKTOBER 2026</p>
              </div>
            </div>

            <Link href="/booth">
              <Button size="sm" className="rounded-full font-display font-bold">
                <Camera className="size-4" />
                <span>Foto Berdua Sekarang</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Badges Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-lg text-[#2B2D42] flex items-center gap-2">
              <Award className="size-5 text-[#FB6F92]" />
              <span>Koleksi Lencana Kekompakan (Badges)</span>
            </h2>
            <span className="font-mono text-xs text-[#7D7F9A]">3 DIPEROLEH</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Card doubleBezel className="space-y-2 text-center p-4">
              <div className="text-3xl">🔥</div>
              <h3 className="font-display font-bold text-sm text-[#2B2D42]">Twin Flames</h3>
              <p className="font-sans text-[11px] text-[#7D7F9A]">Skor kekompakan kuis mencapai 95%+</p>
            </Card>

            <Card doubleBezel className="space-y-2 text-center p-4">
              <div className="text-3xl">📸</div>
              <h3 className="font-display font-bold text-sm text-[#2B2D42]">First Memory</h3>
              <p className="font-sans text-[11px] text-[#7D7F9A]">Menyelesaikan cetak foto strip pertama</p>
            </Card>

            <Card doubleBezel className="space-y-2 text-center p-4">
              <div className="text-3xl">💖</div>
              <h3 className="font-display font-bold text-sm text-[#2B2D42]">Sweet Sync</h3>
              <p className="font-sans text-[11px] text-[#7D7F9A]">Memilih jawaban yang sama 5 kali berturut-turut</p>
            </Card>
          </div>
        </div>

        {/* Photo Strip History Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-lg text-[#2B2D42] flex items-center gap-2">
              <ImageIcon className="size-5 text-[#FB6F92]" />
              <span>Riwayat Kenangan Photo Strip</span>
            </h2>
            <span className="font-mono text-xs text-[#7D7F9A]">TERSIMPAN DI CLOUD</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-3xl bg-white border border-[#FB6F92]/20 shadow-sm space-y-3">
              <div className="aspect-[3/4] rounded-2xl bg-[#FFE5EC] flex items-center justify-center text-center p-4">
                <span className="font-mono text-xs font-bold text-[#FB6F92]">PHOTO STRIP #01<br/><span className="text-[10px] text-[#7D7F9A]">Blush Pink Theme</span></span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[#7D7F9A]">
                <span>15 OKT 2026</span>
                <span className="text-[#FB6F92] font-bold">3 POSES</span>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-[#FB6F92]/20 shadow-sm space-y-3">
              <div className="aspect-[3/4] rounded-2xl bg-[#E8DFF5] flex items-center justify-center text-center p-4">
                <span className="font-mono text-xs font-bold text-[#5A4E7A]">PHOTO STRIP #02<br/><span className="text-[10px] text-[#7D7F9A]">Lavender Theme</span></span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-[#7D7F9A]">
                <span>12 OKT 2026</span>
                <span className="text-[#5A4E7A] font-bold">4 POSES</span>
              </div>
            </div>

            <div className="p-4 rounded-3xl border-2 border-dashed border-[#FB6F92]/30 flex flex-col items-center justify-center text-center p-6 space-y-2 text-[#7D7F9A]">
              <Sparkles className="size-6 text-[#FB6F92]" />
              <p className="font-sans text-xs">Ambil foto baru di studio untuk menambah kenangan.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto px-4 py-6 text-center text-xs font-mono text-[#7D7F9A]">
        LoveFun Studio · Koleksi Kenangan Pribadi
      </footer>
    </div>
  );
}
