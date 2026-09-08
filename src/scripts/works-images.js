import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { encodeVariants, escapeHtml } from './image-encode.js';
import { works } from '../data/works.js';

// Build-time replacement for vite-imagetools + the old client-side
// works-render.js. It encodes an AVIF and a WebP variant of every portfolio
// PNG, emits all three as hashed build assets, and inlines the resulting
// <picture> markup into index.html.
//
// Why not render this in the browser: search engines index JS-injected images
// only on a deferred second pass, and Google Images is a real traffic source
// for a tattoo portfolio. Inlining the markup means the gallery — URLs, alt
// text, intrinsic sizes — is in the HTML the crawler gets on the first hit.
//
// Placeholders in index.html:
//   <!-- WORKS:carousel -->   desktop GSAP carousel items
//   <!-- WORKS:swiper -->     mobile Swiper slides
const SOURCE_DIR = 'src/assets/works';

export function worksImages() {
  let config;
  // file name -> { width, height, sources: [{ mime, url }], fallbackUrl }
  const assets = new Map();

  // Assets are emitted with an explicit fileName rather than a `name`, because
  // Vite runs transformIndexHtml before Rollup finalises hashed asset names —
  // getFileName() throws at that point. Hashing the encoded bytes ourselves
  // keeps cache-busting without depending on Rollup's naming pass.
  const hashedName = (file, ext, buffer) => {
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 8);
    const stem = path.basename(file, '.png');
    return `${config.build.assetsDir}/${stem}-${hash}.${ext}`;
  };

  function pictureMarkup(work) {
    const meta = assets.get(work.file);
    if (!meta) return '';
    const sources = meta.sources
      .map(({ mime, url }) => `<source type="${mime}" srcset="${url}">`)
      .join('');
    return (
      `<picture>${sources}` +
      `<img src="${meta.fallbackUrl}"` +
      ` alt="${escapeHtml(work.alt)}"` +
      ` width="${meta.width}" height="${meta.height}"` +
      ` loading="lazy" decoding="async"></picture>`
    );
  }

  const renderList = (itemClass) =>
    works
      .map((w) => `<div class="${itemClass}">${pictureMarkup(w)}</div>`)
      .join('');

  return {
    name: 'works-images',

    configResolved(resolved) {
      config = resolved;
    },

    async buildStart() {
      const isBuild = config.command === 'build';

      for (const work of works) {
        const abs = path.resolve(config.root, SOURCE_DIR, work.file);
        const source = await readFile(abs);

        // In dev the raw PNGs are served straight from src/, so only the
        // intrinsic dimensions are needed — skip the (slow) AVIF encode.
        if (!isBuild) {
          const { width, height } = await sharp(source).metadata();
          assets.set(work.file, {
            width,
            height,
            sources: [],
            fallbackUrl: `/${SOURCE_DIR}/${work.file}`,
          });
          continue;
        }

        const encoded = await encodeVariants(source);
        const sources = [];
        for (const variant of encoded.variants) {
          const fileName = hashedName(work.file, variant.ext, variant.buffer);
          this.emitFile({ type: 'asset', fileName, source: variant.buffer });
          sources.push({ mime: variant.mime, url: config.base + fileName });
        }
        const pngName = hashedName(work.file, 'png', source);
        this.emitFile({ type: 'asset', fileName: pngName, source });

        assets.set(work.file, {
          width: encoded.width,
          height: encoded.height,
          sources,
          fallbackUrl: config.base + pngName,
        });
      }
    },

    transformIndexHtml(html) {
      return html
        .replace(/<!--\s*WORKS:carousel\s*-->/g, () =>
          renderList('carousel-item'),
        )
        .replace(/<!--\s*WORKS:swiper\s*-->/g, () =>
          renderList('swiper-slide'),
        );
    },
  };
}
