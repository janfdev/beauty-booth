export type FilterKind =
  | "normal"
  | "beauty-glow"
  | "soft-peach"
  | "bw-classic"
  | "vintage-warm"
  | "cyber-pop";

export type FrameTheme =
  | "blush-pink"
  | "cream-pearl"
  | "midnight-noir"
  | "lavender-haze"
  | "matcha-mint";

export interface StripMetrics {
  width: number;
  height: number;
  pad: number;
  photoW: number;
  photoH: number;
  footerH: number;
}

export interface PlacedSticker {
  id: string;
  emoji: string;
  xPercent: number; // 0..100
  yPercent: number; // 0..100
  size: number;
}

// ponytail: single-column vertical strip formula; add multi-column 2x2 grid layout if requested
export function calcStripMetrics(
  shotCount: number,
  photoW = 640,
  photoH = 480
): StripMetrics {
  const pad = 32;
  const footerH = 96;
  const count = Math.max(1, shotCount);
  const width = photoW + pad * 2;
  const height = pad + count * (photoH + pad) + footerH;
  return { width, height, pad, photoW, photoH, footerH };
}

export const FILTER_CSS: Record<FilterKind, string> = {
  normal: "none",
  "beauty-glow": "brightness(108%) contrast(106%) saturate(110%)",
  "soft-peach": "sepia(20%) saturate(120%) brightness(105%) hue-rotate(-8deg)",
  "bw-classic": "grayscale(100%) contrast(120%) brightness(98%)",
  "vintage-warm": "sepia(45%) contrast(110%) brightness(96%) saturate(90%)",
  "cyber-pop": "contrast(130%) saturate(145%) hue-rotate(20deg)",
};

export const FRAME_STYLES: Record<
  FrameTheme,
  { bg: string; text: string; sub: string; border: string; label: string }
> = {
  "blush-pink": {
    bg: "#FFF1F2",
    text: "#E11D48",
    sub: "#FB7185",
    border: "#FECDD3",
    label: "Blush Pink",
  },
  "cream-pearl": {
    bg: "#FFFDF9",
    text: "#27272A",
    sub: "#71717A",
    border: "#F4EFE6",
    label: "Cream Pearl",
  },
  "midnight-noir": {
    bg: "#09090B",
    text: "#FAFAFA",
    sub: "#A1A1AA",
    border: "#27272A",
    label: "Midnight Noir",
  },
  "lavender-haze": {
    bg: "#FAF5FF",
    text: "#7E22CE",
    sub: "#C084FC",
    border: "#E9D5FF",
    label: "Lavender",
  },
  "matcha-mint": {
    bg: "#F0FDF4",
    text: "#15803D",
    sub: "#4ADE80",
    border: "#DCFCE7",
    label: "Matcha Mint",
  },
};

export const STICKER_PRESETS = [
  { id: "sparkles", emoji: "✨", label: "Sparkles" },
  { id: "heart", emoji: "💖", label: "Pink Heart" },
  { id: "ribbon", emoji: "🎀", label: "Ribbon" },
  { id: "cherries", emoji: "🍒", label: "Cherries" },
  { id: "cat", emoji: "🐱", label: "Kitty" },
  { id: "star", emoji: "⭐", label: "Star" },
  { id: "butterfly", emoji: "🦋", label: "Butterfly" },
  { id: "tulip", emoji: "🌷", label: "Tulip" },
];

/**
 * Audio Synthesizer (Web Audio API)
 * Zero external MP3 downloads required.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playBeep() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  playShutter() {
    const ctx = this.getContext();
    if (!ctx) return;
    // White noise click + burst simulation
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }
}

export const Sound = new SoundEngine();
