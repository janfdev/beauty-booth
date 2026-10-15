"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Download,
  RefreshCw,
  FlipHorizontal,
  Sparkles,
  Film,
  Trash2,
  Volume2,
  VolumeX,
  Heart,
  Palette,
  Layers,
  Smile,
  Type,
} from "lucide-react";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  calcStripMetrics,
  FILTER_CSS,
  FRAME_STYLES,
  STICKER_PRESETS,
  Sound,
  type FilterKind,
  type FrameTheme,
  type PlacedSticker,
} from "@/src/booth.utils";

export default function BoothPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stripCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera & Stream State
  const [streamError, setStreamError] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [mirrored, setMirrored] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Booth Preferences
  const [shotTarget, setShotTarget] = useState<3 | 4>(3);
  const [filter, setFilter] = useState<FilterKind>("beauty-glow");
  const [frameTheme, setFrameTheme] = useState<FrameTheme>("blush-pink");
  const [caption, setCaption] = useState("BEAUTY BOOTH");
  const [showDate, setShowDate] = useState(true);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);

  // Capture State
  const [shots, setShots] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  // GIF Export State
  const [isGeneratingGif, setIsGeneratingGif] = useState(false);
  const [gifProgress, setGifProgress] = useState(0);

  // Start Camera Stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isMounted = true;
    setStreamLoading(true);

    if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
      setStreamError("Browser Anda tidak mendukung akses kamera langsung.");
      setStreamLoading(false);
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 960 },
          facingMode: "user",
        },
        audio: false,
      })
      .then((stream) => {
        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        activeStream = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play().catch(console.error);
            if (isMounted) {
              setStreamLoading(false);
              setCameraActive(true);
            }
          };
        } else {
          if (isMounted) {
            setStreamLoading(false);
            setCameraActive(true);
          }
        }
      })
      .catch((err: Error) => {
        if (!isMounted) return;
        setStreamError(
          err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
            ? "Izin kamera ditolak. Silakan izinkan akses webcam di pengaturan browser."
            : `Gagal mengakses kamera: ${err.message}`
        );
        setStreamLoading(false);
      });

    return () => {
      isMounted = false;
      activeStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Capture a single frame from video element
  const captureCurrentFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return null;

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.filter = FILTER_CSS[filter];
    if (mirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  }, [filter, mirrored]);

  // Automated Multi-Shot Session Loop
  const startSession = async () => {
    if (isCapturing || streamError || streamLoading) return;
    setShots([]);
    setIsCapturing(true);

    const capturedFrames: string[] = [];

    for (let shotIndex = 0; shotIndex < shotTarget; shotIndex++) {
      for (let sec = 3; sec >= 1; sec--) {
        setCountdown(sec);
        if (soundEnabled) Sound.playBeep();
        await new Promise((r) => setTimeout(r, 950));
      }

      setCountdown(null);
      setFlash(true);
      if (soundEnabled) Sound.playShutter();

      const dataUrl = captureCurrentFrame();
      if (dataUrl) {
        capturedFrames.push(dataUrl);
        setShots([...capturedFrames]);
      }

      setTimeout(() => setFlash(false), 200);
      await new Promise((r) => setTimeout(r, 650));
    }

    setIsCapturing(false);
  };

  // Sticker Placement Helper
  const addSticker = (emoji: string) => {
    if (shots.length === 0) return;
    const newSticker: PlacedSticker = {
      id: `sticker_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      emoji,
      xPercent: 50,
      yPercent: 30 + Math.random() * 40,
      size: 48,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
  };

  const removeSticker = (id: string) => {
    setPlacedStickers((prev) => prev.filter((s) => s.id !== id));
  };

  // Sticker Drag Handlers via Pointer Events (Touch & Mouse friendly)
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStartPos = useRef<{ x: number; y: number; initialXPercent: number; initialYPercent: number } | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const sticker = placedStickers.find((s) => s.id === id);
    if (!sticker || !canvasContainerRef.current) return;

    setDraggingId(id);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      initialXPercent: sticker.xPercent,
      initialYPercent: sticker.yPercent,
    };
  };

  const handlePointerMove = (id: string, e: React.PointerEvent) => {
    if (draggingId !== id || !dragStartPos.current || !canvasContainerRef.current) return;

    const rect = canvasContainerRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    const deltaXPercent = (deltaX / rect.width) * 100;
    const deltaYPercent = (deltaY / rect.height) * 100;

    const newX = Math.max(5, Math.min(95, dragStartPos.current.initialXPercent + deltaXPercent));
    const newY = Math.max(5, Math.min(95, dragStartPos.current.initialYPercent + deltaYPercent));

    setPlacedStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, xPercent: newX, yPercent: newY } : s))
    );
  };

  const handlePointerUp = (id: string, e: React.PointerEvent) => {
    if (draggingId === id) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
      setDraggingId(null);
      dragStartPos.current = null;
    }
  };

  // Draw Composite Strip on HTML5 Canvas
  useEffect(() => {
    const canvas = stripCanvasRef.current;
    if (!canvas || shots.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const metrics = calcStripMetrics(shots.length, 640, 480);
    canvas.width = metrics.width;
    canvas.height = metrics.height;

    const theme = FRAME_STYLES[frameTheme];

    // Background fill
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, metrics.width, metrics.height);

    // Draw frame header
    ctx.fillStyle = theme.sub;
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("★ BEAUTY BOOTH STUDIO ★", metrics.width / 2, 22);

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    shots.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === shots.length) {
          // Render each photo slot with rounded borders
          shots.forEach((_, photoIdx) => {
            const photoImg = images[photoIdx];
            const y = metrics.pad + photoIdx * (metrics.photoH + metrics.pad);

            ctx.save();
            // Rounded corners for photo
            const radius = 16;
            ctx.beginPath();
            ctx.moveTo(metrics.pad + radius, y);
            ctx.lineTo(metrics.pad + metrics.photoW - radius, y);
            ctx.quadraticCurveTo(metrics.pad + metrics.photoW, y, metrics.pad + metrics.photoW, y + radius);
            ctx.lineTo(metrics.pad + metrics.photoW, y + metrics.photoH - radius);
            ctx.quadraticCurveTo(metrics.pad + metrics.photoW, y + metrics.photoH, metrics.pad + metrics.photoW - radius, y + metrics.photoH);
            ctx.lineTo(metrics.pad + radius, y + metrics.photoH);
            ctx.quadraticCurveTo(metrics.pad, y + metrics.photoH, metrics.pad, y + metrics.photoH - radius);
            ctx.lineTo(metrics.pad, y + radius);
            ctx.quadraticCurveTo(metrics.pad, y, metrics.pad + radius, y);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(photoImg, metrics.pad, y, metrics.photoW, metrics.photoH);
            ctx.restore();

            // Inner border stroke
            ctx.strokeStyle = theme.border;
            ctx.lineWidth = 3;
            ctx.stroke();
          });

          // Footer Text
          const footerCenterY = metrics.height - metrics.footerH / 2;
          ctx.fillStyle = theme.text;
          ctx.font = "bold 26px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText((caption || "BEAUTY BOOTH").slice(0, 28), metrics.width / 2, footerCenterY - (showDate ? 8 : -2));

          if (showDate) {
            ctx.fillStyle = theme.sub;
            ctx.font = "bold 13px monospace";
            const todayStr = new Date().toISOString().slice(0, 10);
            ctx.fillText(`${todayStr} · MEMORY STRIP`, metrics.width / 2, footerCenterY + 18);
          }

          // Draw Placed Stickers onto final Canvas (only when NOT dragging, so drag overlay handles active movement)
          if (!draggingId) {
            placedStickers.forEach((sticker) => {
              const sx = (sticker.xPercent / 100) * metrics.width;
              const sy = (sticker.yPercent / 100) * metrics.height;
              ctx.font = `${sticker.size}px sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(sticker.emoji, sx, sy);
            });
          }
        }
      };
      img.src = src;
      images.push(img);
    });
    // Draw Composite Strip on HTML5 Canvas
    // (Stickers are handled interactively via HTML drag overlay during editing to prevent double-draw,
    // and rendered directly on canvas before final export)
  }, [shots, frameTheme, caption, showDate, placedStickers, draggingId]);

  // Export PNG Strip
  const downloadPng = () => {
    const canvas = stripCanvasRef.current;
    if (!canvas || shots.length === 0) return;

    // Ensure all stickers are rendered on canvas before exporting
    const ctx = canvas.getContext("2d");
    if (ctx) {
      placedStickers.forEach((sticker) => {
        const sx = (sticker.xPercent / 100) * canvas.width;
        const sy = (sticker.yPercent / 100) * canvas.height;
        ctx.font = `${sticker.size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(sticker.emoji, sx, sy);
      });
    }

    const link = document.createElement("a");
    link.download = `beauty-booth-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Export Animated GIF using gifenc
  const downloadGif = async () => {
    if (shots.length === 0 || isGeneratingGif) return;
    setIsGeneratingGif(true);
    setGifProgress(10);

    try {
      const gifWidth = 480;
      const gifHeight = 360;
      const gif = GIFEncoder();

      // Load all images
      const loadedImgs = await Promise.all(
        shots.map((src) => {
          return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
          });
        })
      );

      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = gifWidth;
      frameCanvas.height = gifHeight;
      const frameCtx = frameCanvas.getContext("2d", { willReadFrequently: true });
      if (!frameCtx) throw new Error("Canvas context 2D not supported");

      for (let i = 0; i < loadedImgs.length; i++) {
        setGifProgress(Math.round(20 + ((i + 1) / loadedImgs.length) * 60));
        const img = loadedImgs[i];
        frameCtx.clearRect(0, 0, gifWidth, gifHeight);
        frameCtx.drawImage(img, 0, 0, gifWidth, gifHeight);

        // Watermark on GIF frame
        frameCtx.fillStyle = "rgba(0,0,0,0.5)";
        frameCtx.fillRect(10, gifHeight - 34, 180, 24);
        frameCtx.fillStyle = "#ffffff";
        frameCtx.font = "bold 12px sans-serif";
        frameCtx.fillText(`BEAUTY BOOTH · POSE ${i + 1}`, 16, gifHeight - 18);

        // Draw placed stickers on each frame of animated GIF
        placedStickers.forEach((sticker) => {
          const sx = (sticker.xPercent / 100) * gifWidth;
          const sy = (sticker.yPercent / 100) * gifHeight;
          frameCtx.font = `${Math.round(sticker.size * 0.75)}px sans-serif`;
          frameCtx.textAlign = "center";
          frameCtx.textBaseline = "middle";
          frameCtx.fillText(sticker.emoji, sx, sy);
        });

        const imageData = frameCtx.getImageData(0, 0, gifWidth, gifHeight);
        const palette = quantize(imageData.data, 128);
        const index = applyPalette(imageData.data, palette);

        // 600ms per pose loop
        gif.writeFrame(index, gifWidth, gifHeight, { palette, delay: 600 });
      }

      gif.finish();
      setGifProgress(95);

      const buffer = gif.bytes();
      const blob = new Blob([new Uint8Array(buffer)], { type: "image/gif" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = `beauty-booth-${Date.now()}.gif`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("GIF export failed:", err);
    } finally {
      setIsGeneratingGif(false);
      setGifProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9FB] text-[#2B2D42] flex flex-col selection:bg-[#FB6F92] selection:text-white">
      {/* Top Floating Header */}
      <header className="sticky top-3 z-40 max-w-6xl w-full mx-auto px-4 py-2">
        <div className="rounded-full bg-white/85 backdrop-blur-md border border-[#FB6F92]/20 px-5 py-3 flex items-center justify-between shadow-sm shadow-[#FB6F92]/5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#7D7F9A] hover:text-[#FB6F92] transition"
          >
            <ArrowLeft className="size-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSoundEnabled((s) => !s)}
              className="size-8 rounded-full bg-[#FFE5EC] border border-[#FB6F92]/20 text-[#FB6F92] flex items-center justify-center transition hover:scale-105 active:scale-95"
              title={soundEnabled ? "Nonaktifkan Efek Suara" : "Aktifkan Efek Suara"}
            >
              {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4 text-[#7D7F9A]" />}
            </button>
            <div className="flex items-center gap-1.5 text-xs font-mono font-extrabold text-[#2B2D42]">
              <Heart className="size-4 text-[#FB6F92] fill-[#FB6F92]" />
              <span>STUDIO // CAMERA</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="max-w-6xl w-full mx-auto px-4 lg:px-6 py-4 lg:py-6 grid lg:grid-cols-12 gap-8 flex-1 items-start">
        {/* Left Side: Double-Bezel Camera Viewfinder & Controls */}
        <section className="lg:col-span-7 space-y-5">
          {/* Double-Bezel Camera Viewfinder Frame */}
          <div className="rounded-[2.25rem] p-3 bg-white/90 border border-[#FB6F92]/20 shadow-xl shadow-[#FB6F92]/10 backdrop-blur-xs">
            <div className="relative aspect-[4/3] w-full rounded-[1.75rem] overflow-hidden bg-[#2B2D42] border border-[#2B2D42]/10 flex items-center justify-center">
              {streamError ? (
                <div className="p-8 text-center space-y-3 max-w-md">
                  <div className="size-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 mx-auto flex items-center justify-center">
                    <Camera className="size-6" />
                  </div>
                  <p className="text-red-500 font-semibold text-sm leading-relaxed">{streamError}</p>
                  <p className="text-xs text-white/60">
                    Pastikan webcam terhubung dan izin akses telah disetujui di browser.
                  </p>
                </div>
              ) : null}

              {/* Video Element rendered permanently so ref is never null */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  filter: FILTER_CSS[filter],
                  transform: mirrored ? "scaleX(-1)" : "none",
                }}
                className={`w-full h-full object-cover ${streamLoading || streamError ? "hidden" : "block"}`}
              />

              {streamLoading && !streamError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#2B2D42] text-white/70 text-xs space-y-2">
                  <div className="size-7 border-2 border-[#FB6F92] border-t-transparent rounded-full animate-spin" />
                  <p className="font-medium tracking-wide">Menghubungkan ke kamera...</p>
                </div>
              ) : null}

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-20">
                  <div className="size-24 rounded-full bg-[#FB6F92] text-white flex items-center justify-center text-5xl font-mono font-black shadow-2xl animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Camera Flash Effect */}
              {flash && <div className="absolute inset-0 bg-white camera-flash z-30" />}

              {/* Mirror Toggle Floating Button */}
              {!streamError && (
                <button
                  type="button"
                  onClick={() => setMirrored((m) => !m)}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs inline-flex items-center gap-1.5 transition border border-white/20 active:scale-95"
                  title="Putar Balik Kamera"
                >
                  <FlipHorizontal className="size-3.5" />
                  <span>Flip</span>
                </button>
              )}
            </div>
          </div>

          {/* Studio Controls Bento Card */}
          <Card doubleBezel className="space-y-4">
            {/* Filter Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-[#FB6F92]" />
                  <span>FILTER & TONE</span>
                </label>
                <Badge variant="primary" className="font-mono uppercase text-[10px] py-0.5">
                  {filter.replace("-", " ")}
                </Badge>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(
                  [
                    "beauty-glow",
                    "soft-peach",
                    "normal",
                    "vintage-warm",
                    "bw-classic",
                    "cyber-pop",
                  ] as FilterKind[]
                ).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={`py-2 px-2 rounded-xl text-xs font-sans font-semibold capitalize transition text-center truncate ${
                      filter === f
                        ? "bg-[#FB6F92] text-white shadow-sm shadow-[#FB6F92]/25 font-bold"
                        : "bg-[#FFF9FB] text-[#2B2D42] border border-[#2B2D42]/10 hover:border-[#FB6F92]/40"
                    }`}
                  >
                    {f.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Poses Count & Frame Theme Customization */}
            <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-[#FB6F92]/15">
              {/* Pose Count Segmented */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="size-3.5 text-[#FB6F92]" />
                  <span>POSE COUNT</span>
                </label>
                <div className="flex items-center gap-2">
                  {([3, 4] as const).map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      disabled={isCapturing}
                      onClick={() => setShotTarget(cnt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition ${
                        shotTarget === cnt
                          ? "bg-[#FB6F92] text-white shadow-sm"
                          : "bg-[#FFF9FB] text-[#2B2D42] border border-[#2B2D42]/10 hover:border-[#FB6F92]/40"
                      }`}
                    >
                      {cnt} POSES
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Colors */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="size-3.5 text-[#FB6F92]" />
                  <span>FRAME THEME</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      "blush-pink",
                      "cream-pearl",
                      "midnight-noir",
                      "lavender-haze",
                      "matcha-mint",
                    ] as FrameTheme[]
                  ).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFrameTheme(t)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                        frameTheme === t
                          ? "bg-[#FB6F92] text-white font-bold shadow-xs"
                          : "bg-[#FFF9FB] text-[#2B2D42] border border-[#2B2D42]/10 hover:border-[#FB6F92]/40"
                      }`}
                    >
                      {FRAME_STYLES[t].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Caption & Date Setting */}
            <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-[#FB6F92]/15">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#2B2D42] uppercase tracking-wider flex items-center gap-1.5">
                  <Type className="size-3.5 text-[#FB6F92]" />
                  <span>FRAME CAPTION</span>
                </label>
                <input
                  type="text"
                  maxLength={28}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="BEAUTY BOOTH"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFF9FB] border border-[#2B2D42]/15 text-xs text-[#2B2D42] font-mono font-bold focus:outline-none focus:border-[#FB6F92]"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-3 pt-6">
                <label className="text-xs text-[#2B2D42] font-semibold cursor-pointer flex items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    checked={showDate}
                    onChange={(e) => setShowDate(e.target.checked)}
                    className="rounded accent-[#FB6F92] size-4"
                  />
                  <span className="font-sans">Tampilkan Tanggal Otomatis</span>
                </label>
              </div>
            </div>

            {/* Action Trigger Buttons */}
            <div className="flex items-center gap-3 pt-3">
              <Button
                size="lg"
                onClick={startSession}
                disabled={isCapturing || !!streamError || streamLoading || !cameraActive}
                className="flex-1 rounded-2xl shadow-lg shadow-[#FB6F92]/25"
              >
                <Camera className="size-5" />
                <span>
                  {isCapturing
                    ? `Sedang Mengambil Foto (${shots.length + 1}/${shotTarget})...`
                    : `Mulai Sesi (${shotTarget} Pose)`}
                </span>
              </Button>

              {shots.length > 0 && !isCapturing && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setShots([]);
                    setPlacedStickers([]);
                  }}
                  className="rounded-2xl"
                >
                  <RefreshCw className="size-4" />
                  <span>Ulangi</span>
                </Button>
              )}
            </div>
          </Card>
        </section>

        {/* Right Side: Photo Strip Preview, Cute Stickers, & Export Hub */}
        <section className="lg:col-span-5 flex flex-col items-center justify-start p-5 rounded-[2.25rem] bg-white/90 border border-[#FB6F92]/20 shadow-xl shadow-[#FB6F92]/10 space-y-4">
          <div className="w-full flex items-center justify-between pb-2 border-b border-[#FB6F92]/15">
            <div>
              <h2 className="font-display font-extrabold text-sm text-[#2B2D42]">Hasil Strip Foto</h2>
              <p className="font-mono text-[11px] text-[#7D7F9A]">PNG // GIF ANIMATED</p>
            </div>

            {/* Download Buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={downloadPng}
                disabled={shots.length === 0 || isCapturing}
                className="rounded-xl shadow-xs font-mono font-bold"
              >
                <Download className="size-3.5" />
                <span>PNG</span>
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={downloadGif}
                disabled={shots.length === 0 || isCapturing || isGeneratingGif}
                className="rounded-xl text-[#5A4E7A] bg-[#E8DFF5] hover:bg-[#DDD2ED] border border-[#5A4E7A]/20 font-mono font-bold"
              >
                <Film className="size-3.5" />
                <span>{isGeneratingGif ? `${gifProgress}%` : "GIF"}</span>
              </Button>
            </div>
          </div>

          {/* Cute Sticker Palette */}
          {shots.length > 0 && (
            <div className="w-full p-3 rounded-2xl bg-[#FFF9FB] border border-[#FB6F92]/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-[#2B2D42] uppercase tracking-wider flex items-center gap-1.5">
                  <Smile className="size-3.5 text-[#FB6F92]" />
                  <span>STICKERS PALETTE</span>
                </span>
                {placedStickers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPlacedStickers([])}
                    className="text-[10px] font-mono text-red-500 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="size-3" />
                    <span>CLEAR ALL</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {STICKER_PRESETS.map((sticker) => (
                  <button
                    key={sticker.id}
                    type="button"
                    onClick={() => addSticker(sticker.emoji)}
                    className="size-8 rounded-xl bg-white hover:bg-[#FFE5EC] border border-[#FB6F92]/25 flex items-center justify-center text-lg transition active:scale-90 shadow-2xs"
                    title={`Tambah ${sticker.label}`}
                  >
                    {sticker.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Canvas or Empty State Container */}
          {shots.length === 0 ? (
            <div className="flex-1 w-full min-h-[360px] rounded-2xl border-2 border-dashed border-[#FB6F92]/30 bg-[#FFF9FB] flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="size-14 rounded-full bg-[#FFE5EC] border border-[#FB6F92]/30 text-[#FB6F92] flex items-center justify-center shadow-xs">
                <Camera className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="font-display font-bold text-sm text-[#2B2D42]">Belum ada foto yang diambil</p>
                <p className="font-sans text-xs text-[#7D7F9A] max-w-xs leading-relaxed">
                  Posisikan wajah Anda pada kamera lalu klik tombol <strong>Mulai Sesi</strong> untuk mengambil pose otomatis.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              {/* Interactive Canvas Container with Drag Overlay */}
              <div
                ref={canvasContainerRef}
                className="relative max-w-[250px] w-full select-none"
              >
                <canvas
                  ref={stripCanvasRef}
                  className="w-full h-auto rounded-2xl shadow-xl border border-[#FB6F92]/25 transition duration-300 block"
                />

                {/* Draggable Sticker Interactive Anchors */}
                {placedStickers.map((sticker) => (
                  <div
                    key={sticker.id}
                    onPointerDown={(e) => handlePointerDown(sticker.id, e)}
                    onPointerMove={(e) => handlePointerMove(sticker.id, e)}
                    onPointerUp={(e) => handlePointerUp(sticker.id, e)}
                    onPointerCancel={(e) => handlePointerUp(sticker.id, e)}
                    style={{
                      left: `${sticker.xPercent}%`,
                      top: `${sticker.yPercent}%`,
                      transform: "translate(-50%, -50%)",
                      touchAction: "none",
                    }}
                    className={`absolute z-20 cursor-grab active:cursor-grabbing p-1 rounded-xl transition-transform ${
                      draggingId === sticker.id
                        ? "scale-125 ring-2 ring-[#FB6F92] bg-white/40 backdrop-blur-xs shadow-lg"
                        : "hover:scale-110 hover:bg-white/40 hover:ring-1 hover:ring-[#FB6F92]/40"
                    }`}
                    title="Drag untuk memindahkan posisi stiker"
                  >
                    <span className="text-3xl leading-none select-none pointer-events-none drop-shadow-sm">
                      {sticker.emoji}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSticker(sticker.id);
                      }}
                      className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs hover:bg-red-600"
                      title="Hapus stiker"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <p className="font-mono text-[11px] text-[#7D7F9A] mt-3 text-center">
                DRAG STICKER UNTUK MENGATUR POSISI · EXPORT READY
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
