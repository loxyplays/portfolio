/**
 * Regenerate every logo-derived asset from a single source image.
 *
 *   node scripts/logo-assets.mjs <path-to-logo.png>
 *
 * Expects the mark drawn on a solid black background (which is how the
 * original was supplied). That means the image is effectively "colour
 * composited over black", so alpha can be recovered from the brightest
 * channel and the RGB un-premultiplied. Skipping the un-premultiply leaves
 * every anti-aliased edge still blended toward black, which reads as a dirty
 * grey fringe anywhere the mark sits on a lighter surface — the glass navbar
 * being exactly that.
 *
 * Writes:
 *   public/logo.png        transparent, trimmed wordmark
 *   src/app/icon.png       favicon, dark plate so it reads on light chrome
 *   src/app/apple-icon.png iOS home-screen icon
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { existsSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(root, "public");
const APP = join(root, "src", "app");

const srcArg = process.argv[2];
if (!srcArg) {
  console.error("\n  Usage: node scripts/logo-assets.mjs <path-to-logo.png>\n");
  process.exit(1);
}

const SRC = resolve(srcArg);
if (!existsSync(SRC)) {
  console.error(`\n  Not found: ${SRC}\n`);
  process.exit(1);
}

const meta = await sharp(SRC).metadata();
console.log(`\n  source: ${meta.width}x${meta.height} ${meta.format}`);

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const px = info.width * info.height;
let lit = 0;

for (let i = 0; i < px; i++) {
  const o = i * 4;
  const r = data[o];
  const g = data[o + 1];
  const b = data[o + 2];

  // Brightest channel = how much ink covered the black backdrop.
  const a = Math.max(r, g, b);
  if (a === 0) {
    data[o + 3] = 0;
    continue;
  }

  const k = 255 / a;
  data[o] = Math.min(255, Math.round(r * k));
  data[o + 1] = Math.min(255, Math.round(g * k));
  data[o + 2] = Math.min(255, Math.round(b * k));
  data[o + 3] = a;
  if (a > 8) lit++;
}

console.log(`  ink coverage: ${((lit / px) * 100).toFixed(1)}% of source`);

const transparent = sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
}).png();

// Trim the now-transparent padding down to the mark itself.
const trimmed = await transparent.trim({ threshold: 8 }).toBuffer();
const t = await sharp(trimmed).metadata();
console.log(`  trimmed to: ${t.width}x${t.height}`);

/* --- Wordmark ----------------------------------------------------------- */

// 320px is ~8x the largest place the mark is drawn (the ~40px About plate),
// so it stays sharp on any display while palette quantisation takes it from
// 134KB to ~17KB. The gradient survives quantisation fine — it spans two
// small accents, not a large field.
await sharp(trimmed)
  .resize({ width: 320, fit: "inside", withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toFile(join(PUBLIC, "logo.png"));
console.log("  ✓ public/logo.png");

/* --- Favicon ------------------------------------------------------------ */

const ICON = 256;
const PAD = 30;

const iconInner = await sharp(trimmed)
  .resize({
    width: ICON - PAD * 2,
    height: ICON - PAD * 2,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .toBuffer();

// A dark plate rather than transparency: a white mark on a transparent
// favicon disappears entirely against a light browser tab strip.
const plate = Buffer.from(
  `<svg width="${ICON}" height="${ICON}" xmlns="http://www.w3.org/2000/svg">
     <rect width="${ICON}" height="${ICON}" rx="56" fill="#0b0b0e"/>
   </svg>`,
);

await sharp(plate)
  .composite([{ input: iconInner, gravity: "center" }])
  .png({ compressionLevel: 9 })
  .toFile(join(APP, "icon.png"));
console.log("  ✓ src/app/icon.png");

/* --- Apple touch icon --------------------------------------------------- */

const appleInner = await sharp(trimmed)
  .resize({
    width: 132,
    height: 132,
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .toBuffer();

await sharp(
  Buffer.from(
    `<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
       <rect width="180" height="180" fill="#0b0b0e"/>
     </svg>`,
  ),
)
  .composite([{ input: appleInner, gravity: "center" }])
  .png({ compressionLevel: 9 })
  .toFile(join(APP, "apple-icon.png"));
console.log("  ✓ src/app/apple-icon.png\n");
