import sharp from 'sharp';

// Shared encoding settings for every image the build touches, used by both
// works-images.js (portfolio) and site-images.js (everything in public/).
//
// quality/effort are tuned for build time over the last few percent of size:
// AVIF at effort 9 takes ~10x longer for a couple of KB.
export const AVIF = { ext: 'avif', mime: 'image/avif' };
export const WEBP = { ext: 'webp', mime: 'image/webp' };

// Encodes AVIF + WebP variants of a PNG buffer, optionally downscaling first.
// Returns the variants plus the dimensions of the *original*, since the PNG is
// what stays behind as the fallback <img src>.
export async function encodeVariants(source, { maxWidth } = {}) {
  const meta = await sharp(source).metadata();
  const resize = Boolean(maxWidth) && meta.width > maxWidth;
  const pipe = () =>
    resize ? sharp(source).resize({ width: maxWidth }) : sharp(source);

  const encoded = [
    {
      ...AVIF,
      buffer: await pipe().avif({ quality: 55, effort: 4 }).toBuffer(),
    },
    { ...WEBP, buffer: await pipe().webp({ quality: 78 }).toBuffer() },
  ];

  return {
    width: meta.width,
    height: meta.height,
    // Browsers take the first <source>/image-set() entry whose type they
    // support, so order by size: an AVIF-capable browser also reads WebP, and
    // AVIF is not always the smaller of the two (flat gradients compress
    // better as WebP). Anything that ends up bigger than the source PNG is
    // dropped outright.
    variants: encoded
      .filter((v) => v.buffer.length < source.length)
      .sort((a, b) => a.buffer.length - b.buffer.length),
  };
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
