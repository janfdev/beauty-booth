import assert from "node:assert/strict";
import {
  calcStripMetrics,
  FILTER_CSS,
  FRAME_STYLES,
  STICKER_PRESETS,
  type FilterKind,
  type FrameTheme,
} from "./booth.utils.ts";

// 1. Layout Metrics test (3 poses & 4 poses)
const m3 = calcStripMetrics(3, 640, 480);
assert.equal(m3.width, 704, "width must be photoW + pad*2 (640 + 64 = 704)");
assert.equal(m3.height, 32 + 3 * (480 + 32) + 96, "height matches 3 photos formula");
assert.equal(m3.pad, 32);
assert.equal(m3.footerH, 96);

const m4 = calcStripMetrics(4, 640, 480);
assert.equal(m4.width, 704);
assert.equal(m4.height, 32 + 4 * (480 + 32) + 96);

// 2. Filters check
const filters: FilterKind[] = ["normal", "beauty-glow", "soft-peach", "bw-classic", "vintage-warm", "cyber-pop"];
for (const f of filters) {
  assert.ok(FILTER_CSS[f] !== undefined, `Filter ${f} must exist`);
}
assert.equal(FILTER_CSS.normal, "none");
assert.ok(FILTER_CSS["beauty-glow"].includes("contrast"), "beauty glow must enhance contrast and brightness");

// 3. Frame styles check
const themes: FrameTheme[] = ["blush-pink", "cream-pearl", "midnight-noir", "lavender-haze", "matcha-mint"];
for (const t of themes) {
  const style = FRAME_STYLES[t];
  assert.ok(style.bg && style.text && style.border, `Theme ${t} must have complete colors`);
}
assert.equal(FRAME_STYLES["blush-pink"].bg, "#FFF1F2");

// 4. Stickers check
assert.ok(STICKER_PRESETS.length >= 6, "Must provide at least 6 cute stickers");
assert.ok(STICKER_PRESETS.some((s) => s.label.includes("Love") || s.emoji === "💖"));

console.log("PASS: booth.test.ts all unit checks succeeded!");
