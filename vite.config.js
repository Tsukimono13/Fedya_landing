import { defineConfig } from 'vite';
import { staticPartials } from './src/scripts/static-partials.js';
import { worksImages } from './src/scripts/works-images.js';
import { siteImages } from './src/scripts/site-images.js';
import { fontsWoff2 } from './src/scripts/fonts-woff2.js';

export default defineConfig({
  // The site is served from https://usa.tattoo/seattlebooking/ (the domain
  // root 301s there), so every generated asset URL has to carry that prefix.
  // With base '/' the built <script>/<link> tags point at /assets/... and 404.
  base: '/seattlebooking/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  css: {
    preprocessorOptions: {
      // Use Sass's modern compiler API instead of the legacy JS API that
      // Vite 5 defaults to. Silences the "legacy JS API" deprecation warning
      // and is faster. Requires sass >= 1.70 (we have ^1.79.5).
      scss: { api: 'modern-compiler' },
    },
  },
  plugins: [
    // Encodes AVIF + WebP variants of the portfolio PNGs and inlines the
    // <picture> markup into index.html (see src/scripts/works-images.js).
    worksImages(),
    // Encodes AVIF + WebP variants of everything in public/assets/images and
    // rewires <img>, CSS backgrounds and the LCP preload to prefer them.
    siteImages(),
    // Converts the .otf/.ttf faces to WOFF2 and puts them first in the
    // @font-face src list (see src/scripts/fonts-woff2.js).
    fontsWoff2(),
    // Inlines socials + FAQ partials into index.html at build time so the
    // shipped HTML is fully static (preserves SEO without runtime DOM build).
    staticPartials(),
  ],
});
