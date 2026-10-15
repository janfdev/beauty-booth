import Link from "next/link";
import {
  Camera,
  Sparkles,
  Heart,
  ArrowRight,
  Film,
  Palette,
  Sticker,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#2B2D42] flex flex-col justify-between selection:bg-[#FB6F92] selection:text-white">
      {/* Top Floating Island Header */}
      <header className="sticky top-4 z-40 max-w-5xl w-full mx-auto px-4">
        <div className="rounded-full bg-white/80 backdrop-blur-md border border-[#FB6F92]/20 px-6 py-3.5 flex items-center justify-between shadow-sm shadow-[#FB6F92]/5">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-[#FFE5EC] border border-[#FB6F92]/30 flex items-center justify-center text-[#FB6F92]">
              <Heart className="size-4.5 fill-[#FB6F92]" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base text-[#2B2D42]">
                BeautyBooth
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-[#7D7F9A] font-medium">
                Digital Photo Strip Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/booth">
              <Button size="sm" className="rounded-full shadow-sm">
                <span>Masuk Booth</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl w-full mx-auto px-5 lg:px-8 py-10 lg:py-16 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <Badge variant="primary" className="rounded-full py-1 px-3.5 text-xs font-semibold">
            <Sparkles className="size-3.5 text-[#FB6F92]" />
            <span>Studio Foto Digital Ala Seoul Photobooth</span>
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.12] text-[#2B2D42]">
            Cetak Photo Strip Manis & Animasi GIF,{" "}
            <span className="text-[#FB6F92]">
              Langsung di Web Browser Anda.
            </span>
          </h1>

          <p className="text-[#7D7F9A] text-base sm:text-lg max-w-xl leading-relaxed">
            Abadikan momen seru dengan 3 atau 4 pose estetik. Lengkapi dengan filter kecantikan, stiker manis, bingkai pastel favorit, lalu unduh hasilnya sebagai cetakan foto beresolusi tinggi maupun animasi GIF bergerak.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/booth">
              <Button size="lg" className="rounded-full shadow-lg shadow-[#FB6F92]/25">
                <Camera className="size-5" />
                <span>Mulai Ambil Foto</span>
              </Button>
            </Link>
            <a href="#fitur">
              <Button variant="outline" size="lg" className="rounded-full">
                <span>Pelajari Fitur Studio</span>
              </Button>
            </a>
          </div>

          {/* Quick Perks Pill */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-3 text-xs text-[#7D7F9A] font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-[#FB6F92]" />
              <span>Tanpa Install Aplikasi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-[#FB6F92]" />
              <span>100% Privacy di Browser</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-[#FB6F92]" />
              <span>Gratis & Bebas Iklan</span>
            </div>
          </div>
        </div>

        {/* Visual Strip Showcase Mockup with Double-Bezel Frame */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-xs">
            {/* Soft Ambient Pastel Glow */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-[#FFE5EC] via-[#E8DFF5] to-[#FB6F92]/20 blur-2xl opacity-70 -z-10" />

            {/* Double-Bezel Physical Strip Card */}
            <div className="rounded-[2.25rem] p-3 bg-white/90 border border-[#FB6F92]/20 shadow-xl shadow-[#FB6F92]/10 backdrop-blur-md">
              <div className="rounded-[1.75rem] p-3.5 bg-[#FFF0F4] border border-[#FB6F92]/25 flex flex-col items-center gap-2.5">
                {/* Simulated Frames */}
                <div className="w-full aspect-[4/3] rounded-xl bg-white overflow-hidden shadow-xs border border-[#FB6F92]/15 flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FFE5EC] to-white flex flex-col items-center justify-center p-3 text-center">
                    <span className="text-xs font-bold text-[#FB6F92]">Pose 1 · Sweet Smile</span>
                    <span className="text-[10px] text-[#7D7F9A]">Soft Beauty Glow</span>
                  </div>
                </div>

                <div className="w-full aspect-[4/3] rounded-xl bg-white overflow-hidden shadow-xs border border-[#FB6F92]/15 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#E8DFF5] to-white flex flex-col items-center justify-center p-3 text-center">
                    <span className="text-xs font-bold text-[#5A4E7A]">Pose 2 · V-Sign</span>
                    <span className="text-[10px] text-[#7D7F9A]">Soft Peach Filter</span>
                  </div>
                </div>

                <div className="w-full aspect-[4/3] rounded-xl bg-white overflow-hidden shadow-xs border border-[#FB6F92]/15 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FFE5EC] to-white flex flex-col items-center justify-center p-3 text-center">
                    <span className="text-xs font-bold text-[#FB6F92]">Pose 3 · Heart Hands</span>
                    <span className="text-[10px] text-[#7D7F9A]">Warm Aesthetic</span>
                  </div>
                </div>

                {/* Strip Footer */}
                <div className="w-full pt-1 flex items-center justify-between text-[11px] font-bold text-[#FB6F92] px-1">
                  <span>BEAUTY BOOTH</span>
                  <Heart className="size-3.5 fill-[#FB6F92]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Feature Section Bento */}
      <section id="fitur" className="max-w-6xl w-full mx-auto px-5 lg:px-8 py-12 border-t border-[#FB6F92]/15">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <Badge variant="secondary" className="rounded-full">
            Fitur Utama Studio
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2B2D42]">
            Pengalaman Photobooth Lengkap & Otomatis
          </h2>
          <p className="text-sm text-[#7D7F9A]">
            Setiap fitur dirancang khusus untuk kenyamanan dan keindahan hasil foto Anda.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card doubleBezel className="space-y-2.5">
            <div className="size-10 rounded-2xl bg-[#FFE5EC] flex items-center justify-center text-[#FB6F92]">
              <Sparkles className="size-5" />
            </div>
            <h3 className="font-bold text-base text-[#2B2D42]">Real-time Beauty Glow</h3>
            <p className="text-xs text-[#7D7F9A] leading-relaxed">
              Pilihan filter wajah halus, soft peach, retro vintage, dan monokrom kontras tinggi.
            </p>
          </Card>

          <Card doubleBezel className="space-y-2.5">
            <div className="size-10 rounded-2xl bg-[#E8DFF5] flex items-center justify-center text-[#5A4E7A]">
              <Palette className="size-5" />
            </div>
            <h3 className="font-bold text-base text-[#2B2D42]">Pastel Frame Themes</h3>
            <p className="text-xs text-[#7D7F9A] leading-relaxed">
              Pilihan bingkai warna estetik: Blush Pink, Warm Cream, Pastel Lilac, dan Midnight Dark.
            </p>
          </Card>

          <Card doubleBezel className="space-y-2.5">
            <div className="size-10 rounded-2xl bg-[#FFE5EC] flex items-center justify-center text-[#FB6F92]">
              <Sticker className="size-5" />
            </div>
            <h3 className="font-bold text-base text-[#2B2D42]">Cute Stickers Drag & Drop</h3>
            <p className="text-xs text-[#7D7F9A] leading-relaxed">
              Hias strip dengan stiker pita, bunga ceri, glitter spark, dan atur ukuran dengan bebas.
            </p>
          </Card>

          <Card doubleBezel className="space-y-2.5">
            <div className="size-10 rounded-2xl bg-[#E8DFF5] flex items-center justify-center text-[#5A4E7A]">
              <Film className="size-5" />
            </div>
            <h3 className="font-bold text-base text-[#2B2D42]">Animasi GIF Bergerak</h3>
            <p className="text-xs text-[#7D7F9A] leading-relaxed">
              Selain cetak strip PNG berkualitas tinggi, Anda dapat mengunduh animasi looping GIF.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto px-5 lg:px-8 py-8 border-t border-[#FB6F92]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7D7F9A]">
        <div className="flex items-center gap-2">
          <Heart className="size-3.5 fill-[#FB6F92] text-[#FB6F92]" />
          <span>Beauty Booth Studio · Dibuat untuk momen terbaik Anda</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/booth" className="hover:text-[#FB6F92] font-semibold transition">
            Buka Studio Kamera
          </Link>
          <span>·</span>
          <span>100% Client-Side Privacy</span>
        </div>
      </footer>
    </div>
  );
}
