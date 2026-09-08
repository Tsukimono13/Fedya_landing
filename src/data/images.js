// Per-file overrides for the site images in public/assets/images/.
// Everything under that directory is encoded to AVIF + WebP at build time by
// src/scripts/site-images.js; this map only records the exceptions.
//
// `maxWidth` downscales the encoded variants. Set it when the source is
// oversampled relative to what CSS actually paints — the rule of thumb is
// 2x the largest CSS width the image is ever rendered at. The original PNG is
// never touched: it stays as the last-resort fallback for browsers with
// neither AVIF nor WebP.
//
// `preload` marks the LCP image. Its AVIF gets a <link rel="preload"> in
// <head>; exactly one image should carry it.
export const IMAGE_OPTIONS = {
  // Hero portrait. CSS paints it at 439x553 (273x350 below 651px), so 878px
  // covers 2x displays; the source is 1317px wide.
  'fedor_photo.png': { maxWidth: 878, preload: true },

  // Painted at its intrinsic 1076px on desktop (.booking__work-img sets no
  // width), so there is nothing to downscale.
  'atWork.png': {},
};
