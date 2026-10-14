import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import {
  calcStripMetrics,
  FILTER_CSS,
  FRAME_STYLES,
  STICKER_PRESETS,
  Sound,
  type FilterKind,
  type FrameTheme,
  type PlacedSticker,
} from "../booth.utils.ts";

export function BoothPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stripCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera & Stream State
  const [streamError, setStreamError] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(true);
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
    setStreamLoading(true);

    if (!navigator?.mediaDevices?.getUserMedia) {
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
        activeStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setStreamLoading(false);
      })
      .catch((err: Error) => {
        setStreamError(
          err.name === "NotAllowedError"
            ? "Izin kamera ditolak. Silakan izinkan akses webcam di pengaturan browser."
            : `Gagal mengakses kamera: ${err.message}`
        );
        setStreamLoading(false);
      });

    return () => {
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
      xPercent: 20 + Math.random() * 60,
      yPercent: 15 + Math.random() * 70,
      size: 44,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
  };

  const removeSticker = (id: string) => {
    setPlacedStickers((prev) => prev.filter((s) => s.id !== id));
  };
  void removeSticker;

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

          // Draw Placed Stickers
          placedStickers.forEach((sticker) => {
            const sx = (sticker.xPercent / 100) * metrics.width;
            const sy = (sticker.yPercent / 100) * metrics.height;
            ctx.font = `${sticker.size}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(sticker.emoji, sx, sy);
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
        }
      };
      img.src = src;
      images.push(img);
    });
  }, [shots, frameTheme, caption, showDate, placedStickers]);

  // Export PNG Strip
  const downloadPng = () => {
    const canvas = stripCanvasRef.current;
    if (!canvas || shots.length === 0) return;
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-rose-500 selection:text-white">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto px-5 lg:px-6 py-4 flex items-center justify-between border-b border-zinc-800">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition"
            title={soundEnabled ? "Nonaktifkan Efek Suara" : "Aktifkan Efek Suara"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <span className="font-extrabold text-sm tracking-wide text-zinc-200">
            BeautyBooth <span className="text-rose-400">Studio</span>
          </span>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="max-w-6xl w-full mx-auto px-5 lg:px-6 py-6 lg:py-8 grid lg:grid-cols-12 gap-8 flex-1">
        {/* Left Side: Camera Live View & Session Controls */}
        <section className="lg:col-span-7 space-y-5">
          {/* Viewfinder Window */}
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-zinc-900 border-2 border-zinc-800/80 shadow-2xl flex items-center justify-center">
            {streamError ? (
              <div className="p-8 text-center space-y-3 max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-red-400 font-semibold text-sm leading-relaxed">{streamError}</p>
                <p className="text-xs text-zinc-500">
                  Pastikan kamera terhubung dan telah memberikan izin akses pada pop-up browser.
                </p>
              </div>
            ) : streamLoading ? (
              <div className="text-center space-y-2 text-zinc-500 text-xs">
                <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Menghubungkan ke webcam perangkat...</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  filter: FILTER_CSS[filter],
                  transform: mirrored ? "scaleX(-1)" : "none",
                }}
                className="w-full h-full object-cover"
              />
            )}

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-rose-500/90 text-white flex items-center justify-center text-6xl font-black shadow-2xl animate-pulse">
                  {countdown}
                </div>
              </div>
            )}

            {/* Flash Effect */}
            {flash && <div className="absolute inset-0 bg-white transition-opacity duration-150 z-30" />}

            {/* Mirror Toggle Button overlay */}
            {!streamError && (
              <button
                type="button"
                onClick={() => setMirrored((m) => !m)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs inline-flex items-center gap-1.5 transition border border-white/10"
                title="Putar Balik Kamera"
              >
                <FlipHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Flip Mirror</span>
              </button>
            )}
          </div>

          {/* Studio Controls Box */}
          <div className="p-5 rounded-3xl bg-zinc-900/80 border border-zinc-800 space-y-4">
            {/* Filter Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>Filter Kecantikan & Efek</span>
                </label>
                <span className="text-[11px] text-zinc-500 capitalize">{filter.replace("-", " ")}</span>
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
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold capitalize transition text-center truncate ${
                      filter === f
                        ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                        : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {f.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Poses & Theme Customization */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/80">
              {/* Pose Count */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Jumlah Pose
                </label>
                <div className="flex items-center gap-2">
                  {([3, 4] as const).map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      disabled={isCapturing}
                      onClick={() => setShotTarget(cnt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                        shotTarget === cnt
                          ? "bg-rose-500 text-white shadow-md"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {cnt} Pose Strip
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Colors */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Warna Bingkai
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
                          ? "bg-rose-500 text-white font-semibold"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {FRAME_STYLES[t].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Caption & Date Setting */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/80">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Teks Bawah Bingkai
                </label>
                <input
                  type="text"
                  maxLength={28}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="BEAUTY BOOTH"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-start gap-3 pt-6">
                <label className="text-xs text-zinc-300 font-medium cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showDate}
                    onChange={(e) => setShowDate(e.target.checked)}
                    className="rounded bg-zinc-950 border-zinc-800 text-rose-500 focus:ring-rose-500"
                  />
                  <span>Tampilkan Tanggal Otomatis</span>
                </label>
              </div>
            </div>

            {/* Action Trigger Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={startSession}
                disabled={isCapturing || !!streamError || streamLoading}
                className="flex-1 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25 active:scale-95"
              >
                <Camera className="w-5 h-5" />
                <span>
                  {isCapturing
                    ? `Sedang Mengambil Foto (${shots.length + 1}/${shotTarget})...`
                    : `Mulai Sesi (${shotTarget} Pose)`}
                </span>
              </button>

              {shots.length > 0 && !isCapturing && (
                <button
                  type="button"
                  onClick={() => {
                    setShots([]);
                    setPlacedStickers([]);
                  }}
                  className="px-4 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold inline-flex items-center gap-1.5 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Ulangi Sesi</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Right Side: Composite Result Strip, Stickers & Download Hub */}
        <section className="lg:col-span-5 flex flex-col items-center justify-start p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div className="w-full flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-sm text-zinc-200">Hasil Strip Foto</h2>
              <p className="text-[11px] text-zinc-400">Siap disimpan atau dibagikan</p>
            </div>

            {/* Download Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={downloadPng}
                disabled={shots.length === 0 || isCapturing}
                className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-30 text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PNG</span>
              </button>

              <button
                type="button"
                onClick={downloadGif}
                disabled={shots.length === 0 || isCapturing || isGeneratingGif}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white font-bold text-xs inline-flex items-center gap-1.5 transition shadow-sm"
              >
                <Film className="w-3.5 h-3.5" />
                <span>{isGeneratingGif ? `${gifProgress}%` : "GIF"}</span>
              </button>
            </div>
          </div>

          {/* Stickers Palettes */}
          {shots.length > 0 && (
            <div className="w-full p-3 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Tempel Stiker Lucu (Klik untuk menambah)
                </span>
                {placedStickers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPlacedStickers([])}
                    className="text-[10px] text-zinc-500 hover:text-red-400 inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus Semua</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {STICKER_PRESETS.map((sticker) => (
                  <button
                    key={sticker.id}
                    type="button"
                    onClick={() => addSticker(sticker.emoji)}
                    className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-rose-500/20 hover:border-rose-500/40 border border-zinc-800 flex items-center justify-center text-lg transition active:scale-90"
                    title={`Tambah ${sticker.label}`}
                  >
                    {sticker.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Canvas or Empty State */}
          {shots.length === 0 ? (
            <div className="flex-1 w-full min-h-[380px] rounded-2xl border-2 border-dashed border-zinc-800/80 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm text-zinc-300">Belum ada foto yang diambil</p>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                  Posisikan wajah Anda pada kamera lalu klik tombol <strong>Mulai Sesi</strong> untuk mengambil 3 atau 4 pose otomatis.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              <canvas
                ref={stripCanvasRef}
                className="max-w-[260px] w-full h-auto rounded-2xl shadow-2xl border border-zinc-800 transition duration-300"
              />
              <p className="text-[11px] text-zinc-500 mt-3 text-center">
                Klik tombol <strong>PNG</strong> untuk cetak resolusi tinggi atau <strong>GIF</strong> untuk animasi gerak.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
