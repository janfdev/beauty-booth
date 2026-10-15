"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Heart, Lock, Mail, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";
  const urlError = searchParams.get("error");

  const [tab, setTab] = useState<"login" | "register">(initialTab);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    urlError === "GoogleAuthFailed"
      ? "Autentikasi Google gagal. Silakan coba lagi."
      : urlError === "GoogleAuthCancelled"
      ? "Autentikasi Google dibatalkan."
      : null
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk ke akun");
      }

      setSuccessMsg("Berhasil masuk! Mengalihkan ke profil...");
      if (typeof window !== "undefined") {
        localStorage.setItem("lovefun_user", JSON.stringify(data.user));
      }

      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg("Nama lengkap wajib diisi.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Format email tidak valid.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Kata sandi minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftarkan akun");
      }

      setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke akun Anda...");
      if (typeof window !== "undefined") {
        localStorage.setItem("lovefun_user", JSON.stringify(data.user));
      }

      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#2B2D42] flex flex-col justify-between selection:bg-[#FB6F92] selection:text-white">
      {/* Top Header */}
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
            <span>LOVEFUN // AUTH</span>
          </div>
        </div>
      </header>

      {/* Main Auth Form Container */}
      <main className="max-w-md w-full mx-auto px-4 py-8 flex-1 flex flex-col justify-center space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="primary" className="rounded-full font-mono text-[11px] uppercase tracking-wider">
            AKUN PASANGAN & KENANGAN
          </Badge>
          <h1 className="font-display text-3xl font-black text-[#2B2D42] tracking-tight">
            {tab === "login" ? "Selamat Datang Kembali" : "Buat Akun Baru"}
          </h1>
          <p className="font-sans text-xs text-[#7D7F9A]">
            {tab === "login"
              ? "Masuk untuk menyimpan riwayat photo strip dan mengoleksi lencana."
              : "Daftar untuk mengabadikan momen dan skor kekompakan berdua."}
          </p>
        </div>

        {/* Double-Bezel Form Enclosure */}
        <div className="rounded-[2.25rem] p-3 bg-white/90 border border-[#FB6F92]/25 shadow-xl shadow-[#FB6F92]/10 backdrop-blur-xs">
          <div className="rounded-[1.75rem] p-6 bg-[#FFF0F4] border border-[#FB6F92]/20 space-y-5">
            {/* Google OAuth Login Button */}
            <a href="/api/auth/google" className="block w-full">
              <button
                type="button"
                className="w-full h-11 rounded-2xl bg-white border border-[#2B2D42]/15 hover:border-[#FB6F92]/50 hover:bg-[#FFF9FB] text-xs font-bold text-[#2B2D42] shadow-sm flex items-center justify-center gap-3 transition select-none active:scale-98"
              >
                {/* Official Google 'G' SVG Logo */}
                <svg width="20" height="20" className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Lanjutkan dengan Google</span>
              </button>
            </a>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#FB6F92]/20 w-full" />
              <span className="bg-[#FFF0F4] px-3 font-mono text-[10px] text-[#7D7F9A] uppercase tracking-wider relative z-10">
                ATAU DENGAN EMAIL
              </span>
            </div>

            {/* Tab Selection: Masuk vs Daftar */}
            <div className="flex rounded-2xl bg-white p-1 border border-[#FB6F92]/15">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition select-none ${
                  tab === "login"
                    ? "bg-[#FB6F92] text-white shadow-xs"
                    : "text-[#7D7F9A] hover:text-[#2B2D42]"
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition select-none ${
                  tab === "register"
                    ? "bg-[#FB6F92] text-white shadow-xs"
                    : "text-[#7D7F9A] hover:text-[#2B2D42]"
                }`}
              >
                Daftar Akun
              </button>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 font-semibold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 font-semibold flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {tab === "login" ? (
              /* Form Login */
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="size-3.5 text-[#FB6F92]" />
                    <span>Email</span>
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="size-3.5 text-[#FB6F92]" />
                    <span>Kata Sandi</span>
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    autoComplete="current-password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full rounded-2xl shadow-md shadow-[#FB6F92]/25 font-display font-bold mt-2"
                >
                  <span>{loading ? "Memverifikasi..." : "Masuk ke Akun"}</span>
                </Button>
              </form>
            ) : (
              /* Form Register */
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider flex items-center gap-1.5">
                    <User className="size-3.5 text-[#FB6F92]" />
                    <span>Nama Lengkap</span>
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama panggilan berdua..."
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="size-3.5 text-[#FB6F92]" />
                    <span>Email</span>
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="size-3.5 text-[#FB6F92]" />
                    <span>Kata Sandi</span>
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter..."
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="size-3.5 text-[#FB6F92]" />
                    <span>Ulangi Kata Sandi</span>
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi..."
                    autoComplete="new-password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full rounded-2xl shadow-md shadow-[#FB6F92]/25 font-display font-bold mt-2"
                >
                  <span>{loading ? "Mendaftarkan..." : "Daftar Akun Sekarang"}</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto px-4 py-6 text-center text-xs font-mono text-[#7D7F9A]">
        LoveFun Studio · Privasi & Keamanan Terjaga
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF9FB] flex items-center justify-center font-mono text-xs text-[#7D7F9A]">Memuat halaman autentikasi...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
