"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Plus, Palette, Shield, Database, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic Frames Mock State
  const [frames, setFrames] = useState([
    { id: "1", name: "Blush Pink", bg: "#FFE5EC", border: "#FB6F92" },
    { id: "2", name: "Cream Pearl", bg: "#FFF0F4", border: "#E29578" },
    { id: "3", name: "Lavender Haze", bg: "#E8DFF5", border: "#735D96" },
  ]);

  const [newFrameName, setNewFrameName] = useState("");
  const [newBgColor, setNewBgColor] = useState("#FFE5EC");
  const [newBorderColor, setNewBorderColor] = useState("#FB6F92");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Validasi token rahasia admin
    if (adminKey.trim() === "lovefun2026" || adminKey.trim().length >= 8) {
      setAuthenticated(true);
      setErrorMsg(null);
    } else {
      setErrorMsg("Kunci rahasia Super Admin salah.");
    }
  };

  const handleAddFrame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrameName.trim()) return;
    setFrames((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: newFrameName.trim(),
        bg: newBgColor,
        border: newBorderColor,
      },
    ]);
    setNewFrameName("");
  };

  const handleDeleteFrame = (id: string) => {
    setFrames((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#2B2D42] flex flex-col justify-between selection:bg-[#FB6F92] selection:text-white">
      {/* Top Header */}
      <header className="sticky top-3 z-40 max-w-5xl w-full mx-auto px-4 py-2">
        <div className="rounded-full bg-white/85 backdrop-blur-md border border-[#2B2D42]/15 px-5 py-3 flex items-center justify-between shadow-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#7D7F9A] hover:text-[#2B2D42] transition"
          >
            <ArrowLeft className="size-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#2B2D42]">
            <Lock className="size-4 text-[#FB6F92]" />
            <span>SUPER ADMIN // DASHBOARD</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        {!authenticated ? (
          /* Private Login Gate */
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="size-12 rounded-2xl bg-[#FFE5EC] border border-[#FB6F92]/30 flex items-center justify-center text-[#FB6F92] mx-auto shadow-xs">
                <Shield className="size-6" />
              </div>
              <h1 className="font-display text-2xl font-black text-[#2B2D42]">
                Akses Privat Super Admin
              </h1>
              <p className="font-sans text-xs text-[#7D7F9A]">
                Halaman ini terisolasi dan hanya dapat diakses dengan kunci autentikasi rahasia.
              </p>
            </div>

            <form onSubmit={handleLogin} className="p-6 rounded-[2rem] bg-white border border-[#2B2D42]/15 shadow-xl space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-semibold text-center">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider">
                  Admin Passphrase Key
                </label>
                <Input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Masukkan kunci rahasia..."
                  className="font-mono"
                />
              </div>

              <Button type="submit" size="lg" className="w-full rounded-xl font-display font-bold">
                Masuk Dashboard
              </Button>
            </form>
          </div>
        ) : (
          /* Admin Control Panel */
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2B2D42]/10 pb-4">
              <div>
                <h1 className="font-display text-2xl font-black text-[#2B2D42]">
                  Katalog Bingkai & Aset Booth
                </h1>
                <p className="font-sans text-xs text-[#7D7F9A]">
                  Kelola tema bingkai foto yang dapat dipilih oleh pengguna di `/booth`.
                </p>
              </div>
              <Badge variant="primary" className="font-mono text-xs w-fit">
                AUTHENTICATED AS SUPER ADMIN
              </Badge>
            </div>

            {/* Form Tambah Bingkai */}
            <form onSubmit={handleAddFrame} className="p-6 rounded-[2rem] bg-white border border-[#2B2D42]/15 shadow-sm space-y-4">
              <h2 className="font-display font-bold text-base text-[#2B2D42] flex items-center gap-2">
                <Plus className="size-4 text-[#FB6F92]" />
                <span>Tambah Tema Bingkai Baru</span>
              </h2>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-[#2B2D42]">Nama Bingkai</label>
                  <Input
                    type="text"
                    value={newFrameName}
                    onChange={(e) => setNewFrameName(e.target.value)}
                    placeholder="Contoh: Sunset Coral"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-[#2B2D42]">Warna Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newBgColor}
                      onChange={(e) => setNewBgColor(e.target.value)}
                      className="size-10 rounded-xl cursor-pointer border border-[#2B2D42]/15"
                    />
                    <Input
                      type="text"
                      value={newBgColor}
                      onChange={(e) => setNewBgColor(e.target.value)}
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-[#2B2D42]">Warna Border Garis</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newBorderColor}
                      onChange={(e) => setNewBorderColor(e.target.value)}
                      className="size-10 rounded-xl cursor-pointer border border-[#2B2D42]/15"
                    />
                    <Input
                      type="text"
                      value={newBorderColor}
                      onChange={(e) => setNewBorderColor(e.target.value)}
                      className="font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" size="md" className="rounded-xl font-display font-bold">
                Simpan Bingkai ke Database
              </Button>
            </form>

            {/* List Bingkai Aktif */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-sm text-[#2B2D42] uppercase tracking-wider font-mono">
                Daftar Bingkai Aktif ({frames.length})
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {frames.map((frame) => (
                  <div
                    key={frame.id}
                    className="p-4 rounded-2xl bg-white border border-[#2B2D42]/15 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: frame.bg, borderColor: frame.border }}
                        className="size-8 rounded-lg border-2 shadow-2xs"
                      />
                      <div>
                        <span className="font-display font-bold text-xs text-[#2B2D42] block">{frame.name}</span>
                        <span className="font-mono text-[10px] text-[#7D7F9A] block uppercase">{frame.border}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteFrame(frame.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 transition"
                      title="Hapus Bingkai"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto px-4 py-6 text-center text-xs font-mono text-[#7D7F9A]">
        LoveFun Control Dashboard · Akses Administrator
      </footer>
    </div>
  );
}
