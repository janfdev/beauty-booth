import Link from "next/link";
import { Camera, Sparkles, Image, ShieldCheck, Heart, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="max-w-6xl w-full mx-auto px-5 lg:px-6 py-5 flex items-center justify-between border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-sm">
            <Heart className="w-5 h-5 fill-rose-500/20" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-lg text-zinc-100">BeautyBooth</span>
            <span className="block text-[10px] text-zinc-400 font-medium">Digital Photo Strip & GIF Studio</span>
          </div>
        </div>
        <Link
          href="/booth"
          className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold text-sm transition shadow-lg shadow-rose-500/20 inline-flex items-center gap-1.5"
        >
          <span>Masuk Booth</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl w-full mx-auto px-5 lg:px-6 py-12 lg:py-20 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Studio Foto Pribadi di Web Browser</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] text-zinc-50">
            Foto Strip Lucu & Animasi GIF,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">
              Langsung Jadi di Browser.
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
            Abadikan 3 atau 4 pose seru menggunakan webcam Anda. Terapkan filter kecantikan, hias dengan stiker lucu, pilih tema bingkai pastel, dan simpan hasilnya sebagai cetakan foto PNG maupun animasi GIF bergerak.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/booth"
              className="px-7 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-base transition flex items-center gap-2 shadow-xl shadow-rose-500/25 active:scale-95"
            >
              <Camera className="w-5 h-5" />
              <span>Coba Booth Sekarang</span>
            </Link>
            <a
              href="#fitur"
              className="px-5 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium text-sm border border-zinc-800 transition"
            >
              Lihat Kemampuan Studio
            </a>
          </div>

          {/* Quick Pillars */}
          <div id="fitur" className="grid sm:grid-cols-3 gap-4 pt-8 border-t border-zinc-800/80">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-zinc-200">Beauty & Color Filters</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Filter Beauty Glow, Soft Peach, Retro Warm, dan B&W yang diproses real-time.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Image className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-zinc-200">Cute Stickers & Themes</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pilih tema Blush Pink, Cream, atau Lavender, lalu tempel stiker pita dan glitter.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-zinc-200">100% Privacy-First</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Kamera dan render foto diproses di browser Anda sendiri tanpa diunggah ke server.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Strip Showcase Mockup */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group">
            {/* Ambient subtle glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-rose-500/20 to-purple-500/20 blur-xl opacity-70 group-hover:opacity-100 transition duration-500" />
            
            <div className="relative bg-rose-50 text-zinc-900 p-4 rounded-3xl shadow-2xl w-64 border-2 border-rose-200 space-y-3.5 transform rotate-2 hover:rotate-0 transition duration-300">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-bold tracking-wider text-rose-500 uppercase">Beauty Booth</span>
                <span className="text-[10px] text-rose-400 font-mono">3 POSES</span>
              </div>

              <div className="aspect-[4/3] rounded-xl bg-zinc-900/90 border border-zinc-700/60 flex items-center justify-center text-zinc-400 text-xs font-mono relative overflow-hidden">
                <span className="relative z-10">POSE 01</span>
                <div className="absolute top-2 right-2 text-sm">✨</div>
              </div>

              <div className="aspect-[4/3] rounded-xl bg-zinc-800/90 border border-zinc-700/60 flex items-center justify-center text-zinc-300 text-xs font-mono relative overflow-hidden">
                <span className="relative z-10">POSE 02</span>
                <div className="absolute bottom-2 left-2 text-sm">🎀</div>
              </div>

              <div className="aspect-[4/3] rounded-xl bg-zinc-900/90 border border-zinc-700/60 flex items-center justify-center text-zinc-400 text-xs font-mono relative overflow-hidden">
                <span className="relative z-10">POSE 03</span>
                <div className="absolute top-2 left-2 text-sm">💖</div>
              </div>

              <div className="pt-2 text-center border-t border-rose-200">
                <p className="font-extrabold text-xs tracking-widest uppercase text-rose-600">BEAUTY BOOTH</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">EST. 2026 · DIGITAL STRIP</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto px-5 lg:px-6 py-6 border-t border-zinc-900 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>BeautyBooth Studio · Dibuat dengan kecintaan pada fotografi web</p>
        <Link href="/booth" className="text-rose-400 hover:text-rose-300 font-medium transition">
          Buka Halaman Studio (/booth) →
        </Link>
      </footer>
    </div>
  );
}
